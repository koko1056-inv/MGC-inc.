// 本番サイトの健康診断（SEO Daily Report が毎日実行する。Search Console が無くても動く）。
// サイトマップの全 URL について、表示（200）・JSON-LD が読めるか・canonical がサイトマップと同じか・h1 が1つか を確かめ、
// 問い合わせAPI が空の送信を受け付けない（400）ことも確かめる。問題があれば終了コード1（ワークフローが失敗し、通知が届く）。
// 結果はジョブの概要（GITHUB_STEP_SUMMARY）に日本語で出す。
import { appendFileSync } from 'node:fs';

const BASE = process.env.SITE_URL || 'https://mgc-global01.com';
const UA = { 'User-Agent': 'MGC-site-health/1.0' };

const summary = (text) => {
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
};

const sitemap = await (await fetch(`${BASE}/sitemap.xml`, { headers: UA })).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const problems = [];
let jsonld = 0;

async function check(url) {
  try {
    const res = await fetch(url, { headers: UA, redirect: 'manual' });
    if (res.status !== 200) return problems.push(`${url}: HTTP ${res.status}`);
    const html = await res.text();
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); jsonld++; } catch { problems.push(`${url}: JSON-LD が読めない`); }
    }
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    if (canonical !== url) problems.push(`${url}: canonical が違う（${canonical || 'なし'}）`);
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) problems.push(`${url}: h1 が ${h1} 個`);
  } catch (err) {
    problems.push(`${url}: 取得に失敗（${err.message}）`);
  }
}

// 同時に 8 件ずつ
for (let i = 0; i < urls.length; i += 8) await Promise.all(urls.slice(i, i + 8).map(check));

// 問い合わせAPI: 空の送信は 400 で弾かれるのが正常（入力の検証が働いている）
let contact = 0;
try {
  contact = (await fetch(`${BASE}/api/contact`, { method: 'POST', headers: { ...UA, 'Content-Type': 'application/json', Origin: BASE }, body: '{}' })).status;
} catch { contact = 0; }
if (contact !== 400) problems.push(`問い合わせAPI: 空の送信に ${contact || '応答なし'}（期待は 400）`);

summary(`## サイトの健康診断（${new Date().toISOString().slice(0, 10)}）`);
summary('');
summary(`- ページ: ${urls.length} URL（サイトマップ）／ JSON-LD: ${jsonld} 件`);
summary(`- 問い合わせAPI（空の送信）: ${contact}`);
summary(problems.length ? `- 問題: ${problems.length} 件` : '- 問題: なし');
for (const p of problems.slice(0, 50)) summary(`  - ${p}`);

if (problems.length) {
  console.log(`::error title=サイトの健康診断で問題が見つかりました::${problems.length} 件（ジョブの概要を参照）`);
  process.exit(1);
}
