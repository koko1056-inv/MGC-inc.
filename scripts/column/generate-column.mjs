#!/usr/bin/env node
/**
 * generate-column.mjs — 業界別AI活用コラムを1本、Anthropic APIで生成する
 *
 * 役割:
 *   1. columns.json のローテーションから「次の業種」を決定的に選ぶ
 *   2. その業種向けの記事JSONを Anthropic Messages API で生成（自然な日本語・SEO最適化）
 *   3. content/columns/<slug>.json を書き出し、columns.json を更新
 *   （HTML化は build-columns.mjs が担当。本スクリプトは記事データの生成のみ）
 *
 * 環境変数:
 *   ANTHROPIC_API_KEY  … 必須（GitHub Secrets）
 *   ANTHROPIC_MODEL    … 任意（既定 claude-sonnet-5）
 *   DRY_RUN=1 / --dry-run … APIを呼ばず、選定業種とプロンプト概要のみ表示（ローカル検証用）
 *
 * 依存ゼロ（Node 20+ の global fetch を使用）。実行: node scripts/column/generate-column.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const CONTENT_DIR = join(ROOT, 'content', 'columns');
const MANIFEST = join(CONTENT_DIR, 'columns.json');

const DRY = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
const API_KEY = process.env.ANTHROPIC_API_KEY;

const die = (m) => { console.error(`\n[generate-column] ERROR: ${m}\n`); process.exit(1); };

if (!existsSync(MANIFEST)) die('content/columns/columns.json が見つかりません');
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const inds = manifest.rotation.industries || [];
if (!inds.length) die('rotation.industries が空です');

// --- 次の業種を決定的に選ぶ ---
const next = (((manifest.rotation.lastIndex ?? -1) + 1) % inds.length + inds.length) % inds.length;
const ind = inds[next];
const used = (manifest.usedTopics && manifest.usedTopics[ind.key]) || [];
const existingSlugs = new Set((manifest.articles || []).map((a) => a.slug));

// JST の当日日付（Actions は UTC 実行のため +9h）
const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

// 文体の見本（この構造・トーンに厳密に合わせる）
const exemplarPath = join(CONTENT_DIR, 'manufacturing-inspection-ai.json');
const exemplar = existsSync(exemplarPath) ? readFileSync(exemplarPath, 'utf8') : '';

const SYSTEM = [
  'あなたは日本企業のAI活用を支援する「MGC（ＭＧＣ株式会社）」のオウンドメディア編集者兼コンサルタントです。',
  '業界別に、AI導入の現実的な進め方を実務目線で書きます。読者はその業界の経営者・管理者・現場担当で、ITに詳しいとは限りません。',
  '出力は指定スキーマのJSONオブジェクトのみ。前置き・説明・コードフェンスを一切付けない。',
].join('\n');

const RULES = `# 文体・品質ルール（厳守）
- 自然で読みやすい日本語。SEO目的のキーワード詰め込み、機械翻訳的な言い回し、AIが書いたと分かる硬い定型文、同じ語の過度な繰り返しを避ける。
- キーワードは無理に詰めず、見出しと文脈に自然に溶かす。
- トーンは落ち着いた実務・等身大。煽らない。「何をAIに任せ、どこは人が判断するか」「小さく始める」「記録・権限・基準を先に決める」といった誠実な視点。
- 誇大な断定や、具体的な数値効果（○％削減 等）の保証はしない。
- 売り込みは本文に入れない（相談導線CTAはサイト側で自動付与される）。末尾の「まとめ」は内容の要約に徹する。
- 本文（lead + body のテキスト合計）はおよそ2000〜3500字。`;

const SCHEMA = `# 出力スキーマ（このキー構成のJSONのみ）
{
  "slug": "${ind.key}-<テーマの半角英小文字ハイフン>",   // 例 ${ind.key}-foo-bar。必ず "${ind.key}-" で始める
  "industry": "${ind.key}",
  "title": "日本語の記事タイトル（32字前後、具体的に）",
  "seoTitle": "検索向けタイトル（60字以内、業界×AIのキーワードを前寄せ、末尾に - MGCコラム）",
  "description": "meta description（80〜120字、読むと内容が分かる自然な一文）",
  "keywords": ["5個前後", "業界 AI", "..."],
  "imageAlt": "アイキャッチ画像の代替テキスト（日本語）",
  "readTime": "8分",
  "lead": "リード文（120字前後、記事の要点と読む価値）",
  "body": [
    { "type": "h2", "text": "見出し" },
    { "type": "p", "text": "段落" },
    { "type": "ul", "items": ["箇条書き", "..."] },
    { "type": "ol", "items": ["手順1", "..."] },
    { "type": "quote", "text": "一文で刺さる要点" }
  ],
  "faq": [
    { "q": "その業界の顧客が実際に気にする質問", "a": "誠実で具体的な回答（会話調）" }
  ]
}
# body の作り方: h2 を4〜6個。必要に応じて h3 / ul / ol / quote を効果的に混ぜる。最後の h2 は「まとめ：…」で要点を ul で列挙。faq は2〜3問。`;

const USER = `# 今日書くコラム
- 業種: ${ind.ja}（key: ${ind.key}）
- 公開日: ${today}
- この業種で既出のテーマ(slug・重複禁止): ${used.length ? used.join(', ') : '（まだ無し）'}

${SCHEMA}

${RULES}

# 文体の見本（構造・トーンをこの水準に合わせる。内容は今回の業種向けに完全に新規で書くこと）
${exemplar}

上記に従い、${ind.ja}向けのAI活用コラムを1本、スキーマ通りのJSONオブジェクトのみで出力してください。`;

if (DRY) {
  console.log('[generate-column] DRY RUN');
  console.log('  次の業種:', ind.key, '/', ind.ja, `(lastIndex ${manifest.rotation.lastIndex} → ${next})`);
  console.log('  既出テーマ:', used);
  console.log('  公開日:', today, ' モデル:', MODEL);
  console.log('  プロンプト長:', USER.length, 'chars（見本込み）');
  process.exit(0);
}

if (!API_KEY) die('ANTHROPIC_API_KEY が未設定です（GitHub Secrets に登録してください）');

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 8192,
    system: SYSTEM,
    messages: [{ role: 'user', content: USER }],
  }),
});
if (!res.ok) die(`Anthropic API ${res.status}: ${(await res.text()).slice(0, 500)}`);
const data = await res.json();
let text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('').trim();
text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
const s = text.indexOf('{'), e = text.lastIndexOf('}');
if (s < 0 || e < 0) die(`JSONが見つかりません。先頭: ${text.slice(0, 200)}`);

let art;
try { art = JSON.parse(text.slice(s, e + 1)); } catch (err) { die(`JSON parse失敗: ${err.message}`); }

// --- 正規化・検証 ---
art.industry = ind.key;
art.date = today;
delete art.image; // 画像は業種フォールバックを使う（build側で自動）

if (!art.slug) die('slug がありません');
art.slug = String(art.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
if (!art.slug.startsWith(`${ind.key}-`)) art.slug = `${ind.key}-${art.slug}`.replace(/-+/g, '-');
let baseSlug = art.slug, n = 2;
while (existingSlugs.has(art.slug)) art.slug = `${baseSlug}-${n++}`;

for (const f of ['title', 'seoTitle', 'description', 'lead', 'body', 'faq']) {
  if (!art[f] || (Array.isArray(art[f]) && art[f].length === 0)) die(`必須フィールドが不足: ${f}`);
}
if (!Array.isArray(art.body) || art.body.length < 4) die('body の見出し/段落が不足しています');

// readTime 補完
const textLen = [art.lead || '', ...art.body.map((b) => (b.text || '') + (b.items ? b.items.join('') : ''))].join('').length;
if (!art.readTime) art.readTime = `${Math.max(5, Math.round(textLen / 400))}分`;
if (!art.imageAlt) art.imageAlt = `${ind.ja}のAI活用イメージ`;

// key の順序を整えて書き出し
const ordered = {
  slug: art.slug, industry: ind.key, date: today,
  title: art.title, seoTitle: art.seoTitle, description: art.description,
  keywords: art.keywords || [], imageAlt: art.imageAlt, readTime: art.readTime,
  lead: art.lead, body: art.body, faq: art.faq,
};
writeFileSync(join(CONTENT_DIR, `${art.slug}.json`), JSON.stringify(ordered, null, 2) + '\n');

// --- マニフェスト更新 ---
manifest.rotation.lastIndex = next;
manifest.usedTopics = manifest.usedTopics || {};
manifest.usedTopics[ind.key] = [...used, art.slug];
manifest.articles = manifest.articles || [];
manifest.articles.push({ slug: art.slug, industry: ind.key, date: today, file: `${art.slug}.json` });
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

console.log(`[generate-column] OK: ${ind.ja} / ${art.slug}（本文 約${textLen}字）`);
