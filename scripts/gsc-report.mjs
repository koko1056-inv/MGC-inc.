// Search Console の数値を取得して、デイリー振り返り用の Markdown を作る。
//
// 使い方:
//   GSC_SERVICE_ACCOUNT_JSON='{"client_email":...,"private_key":...}' node scripts/gsc-report.mjs [YYYY-MM-DD]
//   → docs/seo-aio/metrics/<今日の日付>.md を書き出す（引数で日付を指定可）
//
// 事前準備（代表の操作が必要）:
//   1. Google Cloud でサービスアカウントを作り、Search Console API を有効化して鍵（JSON）を発行
//   2. Search Console の「設定 → ユーザーと権限」で、サービスアカウントのメールを「制限付き」で追加
//   3. 鍵の JSON を環境変数 GSC_SERVICE_ACCOUNT_JSON に入れる（リポジトリには絶対にコミットしない）
//
// 取得するもの:
//   - 期間: 前日（データのある最新日）・直近7日・直近28日、それぞれ直前の同じ長さの期間と比較
//   - ページ別・クエリ別の 表示回数 / クリック / CTR / 平均掲載順位
//   - サイトマップの送信・エラー状況、主要ページのインデックス状況（URL検査API）
// 依存パッケージなし（Node の crypto と fetch のみ）。
import { createSign } from 'node:crypto';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = process.env.GSC_SITE || 'sc-domain:mgc-global01.com';
const ORIGIN = 'https://mgc-global01.com';
// URL検査は1日の上限があるため、主要ページだけを見る
const KEY_PAGES = ['/', '/works', '/service/ai-phone', '/service/ai-sales', '/service/salesforce-ai', '/training', '/cases', '/guide', '/glossary', '/column'];

const b64url = (s) => Buffer.from(s).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

async function accessToken() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GSC_SERVICE_ACCOUNT_JSON が未設定です（README の事前準備を参照）');
  const sa = JSON.parse(raw);
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  }));
  const signer = createSign('RSA-SHA256');
  signer.update(`${head}.${claim}`);
  const jwt = `${head}.${claim}.${b64url(signer.sign(sa.private_key))}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`トークン取得に失敗: ${res.status} ${json.error ?? ''} ${json.error_description ?? ''}`);
  return json.access_token;
}

let TOKEN;
const api = async (url, body) => {
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: { authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${url} → ${res.status} ${JSON.stringify(json.error ?? json).slice(0, 300)}`);
  return json;
};
const SA = (body) => api(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, body);

const ymd = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(`${s}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return ymd(d); };

async function rows(start, end, dimension) {
  const out = await SA({ startDate: start, endDate: end, dimensions: dimension ? [dimension] : [], rowLimit: 250, dataState: 'all' });
  return out.rows ?? [];
}
const total = (r) => r[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
const pct = (a, b) => (b ? `${a >= b ? '+' : ''}${(((a - b) / b) * 100).toFixed(0)}%` : a ? '新規' : '—');
const fmt = (m) => `${m.impressions} / ${m.clicks} / ${(m.ctr * 100).toFixed(1)}% / ${m.position ? m.position.toFixed(1) : '—'}`;
const keyName = (k) => k.replace(ORIGIN, '') || '/';

function movers(cur, prev, label) {
  const p = new Map(prev.map((r) => [r.keys[0], r]));
  const merged = cur.map((r) => ({ key: r.keys[0], cur: r, prev: p.get(r.keys[0]) }));
  for (const r of prev) if (!cur.some((c) => c.keys[0] === r.keys[0])) merged.push({ key: r.keys[0], cur: { clicks: 0, impressions: 0, ctr: 0, position: 0 }, prev: r });
  const diff = (x) => x.cur.impressions - (x.prev?.impressions ?? 0);
  const up = [...merged].sort((a, b) => diff(b) - diff(a)).filter((x) => diff(x) > 0).slice(0, 10);
  const down = [...merged].sort((a, b) => diff(a) - diff(b)).filter((x) => diff(x) < 0).slice(0, 10);
  const line = (x) => `| ${label === 'page' ? keyName(x.key) : x.key} | ${x.prev ? fmt(x.prev) : '—'} | ${fmt(x.cur)} | ${diff(x) > 0 ? '+' : ''}${diff(x)} |`;
  const head = `| ${label === 'page' ? 'ページ' : 'クエリ'} | 前（表示/クリック/CTR/順位） | 今 | 表示回数の差 |\n|:--|:--|:--|--:|`;
  return `#### 伸びた\n${up.length ? `${head}\n${up.map(line).join('\n')}` : 'なし'}\n\n#### 落ちた\n${down.length ? `${head}\n${down.map(line).join('\n')}` : 'なし'}`;
}

async function main() {
  const today = process.argv[2] || ymd(new Date());
  TOKEN = await accessToken();

  // データのある最新日（Search Console は通常2〜3日遅れ。dataState=all で速報値も含める）
  const byDate = await SA({ startDate: addDays(today, -40), endDate: today, dimensions: ['date'], dataState: 'all' });
  const dates = (byDate.rows ?? []).map((r) => r.keys[0]).sort();
  const last = dates.at(-1);
  const L = [`# Search Console デイリー（${today}）`, '', `- プロパティ: \`${SITE}\``];
  if (!last) {
    L.push('- データ: まだありません（登録直後は数日かかります）');
  } else {
    L.push(`- データのある最新日: ${last}（Search Console は2〜3日遅れで確定します。直近は速報値を含む）`);
    const periods = [['前日', 1], ['直近7日', 7], ['直近28日', 28]];
    L.push('', '## サマリー', '| 期間 | 表示回数 | クリック | CTR | 平均掲載順位 | 前期間比（表示） |', '|:--|--:|--:|--:|--:|--:|');
    const detail = [];
    for (const [name, n] of periods) {
      const end = last, start = addDays(last, -(n - 1));
      const pend = addDays(start, -1), pstart = addDays(pend, -(n - 1));
      const [cur, prev] = [total(await rows(start, end)), total(await rows(pstart, pend))];
      L.push(`| ${name}（${start}〜${end}） | ${cur.impressions} | ${cur.clicks} | ${(cur.ctr * 100).toFixed(1)}% | ${cur.position ? cur.position.toFixed(1) : '—'} | ${pct(cur.impressions, prev.impressions)} |`);
      for (const dim of ['page', 'query']) {
        const [c, p] = [await rows(start, end, dim), await rows(pstart, pend, dim)];
        detail.push(`### ${name}・${dim === 'page' ? 'ページ別' : 'クエリ別'}（${pstart}〜${pend} → ${start}〜${end}）`, movers(c, p, dim), '');
        if (name === '直近28日') {
          detail.push(`#### 上位（表示回数順）`, '| キー | 表示 / クリック / CTR / 順位 |', '|:--|:--|', ...c.slice(0, 20).map((r) => `| ${dim === 'page' ? keyName(r.keys[0]) : r.keys[0]} | ${fmt(r)} |`), '');
        }
      }
    }
    L.push('', '## 内訳', ...detail);
  }

  // サイトマップの状態
  try {
    const sm = await api(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps`);
    L.push('', '## サイトマップ', '| パス | 最終送信 | 最終読込 | 警告 | エラー |', '|:--|:--|:--|--:|--:|',
      ...(sm.sitemap ?? []).map((s) => `| ${s.path} | ${s.lastSubmitted ?? '—'} | ${s.lastDownloaded ?? '—'} | ${s.warnings ?? 0} | ${s.errors ?? 0} |`));
    if (!(sm.sitemap ?? []).length) L.push('| （未送信） | | | | |');
  } catch (e) { L.push('', '## サイトマップ', `取得できませんでした: ${e.message}`); }

  // 主要ページのインデックス状況（URL検査API）
  L.push('', '## インデックス状況（主要ページ）', '| ページ | 判定 | カバレッジ | 最終クロール |', '|:--|:--|:--|:--|');
  for (const p of KEY_PAGES) {
    try {
      const r = await api('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', { inspectionUrl: ORIGIN + p, siteUrl: SITE, languageCode: 'ja' });
      const s = r.inspectionResult?.indexStatusResult ?? {};
      L.push(`| ${p} | ${s.verdict ?? '—'} | ${s.coverageState ?? '—'} | ${s.lastCrawlTime ?? '—'} |`);
    } catch (e) { L.push(`| ${p} | 取得失敗 | ${e.message.slice(0, 80)} | |`); }
  }

  const file = join(ROOT, 'docs', 'seo-aio', 'metrics', `${today}.md`);
  mkdirSync(dirname(file), { recursive: true });
  const prevNote = existsSync(file) ? readFileSync(file, 'utf8').split('\n<!-- 手書きメモ -->')[1] : undefined;
  writeFileSync(file, L.join('\n') + '\n' + (prevNote ? `\n<!-- 手書きメモ -->${prevNote}` : ''));
  console.log(`書き出し: ${file}`);
}

main().catch((e) => { console.error(e.message); process.exitCode = 1; });
