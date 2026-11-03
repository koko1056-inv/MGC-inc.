#!/usr/bin/env node
/**
 * build-columns.mjs — 業界別AI活用コラムの静的HTMLジェネレータ
 *
 * 入力:
 *   content/columns/columns.json         … マニフェスト（サイト設定・業種・記事一覧）
 *   content/columns/<slug>.json          … 各記事（構造化本文）
 * 出力:
 *   public/column/<slug>.html            … 記事ページ（完全なSEO head付き）
 *   public/column/index.html             … コラム一覧
 *   public/sitemap.xml                   … <!-- COLUMNS --> ブロックを更新
 *
 * 依存ゼロ（Node標準のみ）。 実行: node scripts/column/build-columns.mjs
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const CONTENT_DIR = join(ROOT, 'content', 'columns');
const OUT_DIR = join(ROOT, 'public', 'column');
const SITEMAP = join(ROOT, 'public', 'sitemap.xml');

// ---- helpers ----
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// JSON-LD: <script> の中に安全に埋め込む（'<' をユニコードエスケープ）
const jsonld = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

const die = (msg) => {
  console.error(`\n[build-columns] ERROR: ${msg}\n`);
  process.exit(1);
};

// ---- load manifest ----
if (!existsSync(join(CONTENT_DIR, 'columns.json'))) die('content/columns/columns.json が見つかりません');
const manifest = JSON.parse(readFileSync(join(CONTENT_DIR, 'columns.json'), 'utf8'));
const site = manifest.site;
const industriesByKey = Object.fromEntries((manifest.rotation.industries || []).map((i) => [i.key, i]));

// ---- load articles ----
const articles = [];
const seenSlug = new Set();
for (const entry of manifest.articles || []) {
  const file = join(CONTENT_DIR, entry.file || `${entry.slug}.json`);
  if (!existsSync(file)) die(`記事ファイルがありません: ${file}`);
  const a = JSON.parse(readFileSync(file, 'utf8'));
  if (!a.slug) die(`slug がありません: ${file}`);
  if (seenSlug.has(a.slug)) die(`slug が重複しています: ${a.slug}`);
  seenSlug.add(a.slug);
  if (!industriesByKey[a.industry]) die(`未知の industry "${a.industry}"（${a.slug}）。columns.json の rotation.industries に追加してください`);
  articles.push(a);
}
// 新しい日付順（降順）
articles.sort((x, y) => (y.date || '').localeCompare(x.date || ''));

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// ---- shared CSS (self-contained, Tailwind非依存) ----
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#111418;--blue:#2D6CDF;--muted:#5b6472;--line:#e6e8ec;--bg:#ffffff;--soft:#f6f8fb;--maxw:1200px}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{font-family:"Hiragino Kaku Gothic ProN","Hiragino Sans","Noto Sans JP",Meiryo,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--ink);line-height:1.9;letter-spacing:.01em;-webkit-font-smoothing:antialiased;font-feature-settings:"palt" 1,"kern" 1}
a{color:var(--blue);text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%}

/* ── ヘッダー ───────────────────────── */
.site-header{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.92);backdrop-filter:saturate(180%) blur(12px);border-bottom:1px solid var(--line)}
.site-header .inner{max-width:var(--maxw);margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:24px}
.site-header a.brand{display:flex;align-items:center;gap:10px;color:var(--ink);font-size:1.05rem;font-weight:800;letter-spacing:-.02em;text-decoration:none;flex-shrink:0}
.site-header a.brand .mark{width:38px;height:25px;background:var(--ink);display:flex;align-items:center;justify-content:center;border-radius:2px}
.site-header a.brand .mark i{width:11px;height:11px;background:#fff;border-radius:50%;display:block}
.site-header nav{margin-left:auto;display:flex;align-items:center;gap:22px;overflow-x:auto;scrollbar-width:none}
.site-header nav::-webkit-scrollbar{display:none}
.site-header nav a{color:var(--ink);font-size:.85rem;font-weight:700;text-decoration:none;white-space:nowrap;opacity:.7;transition:opacity .2s,color .2s}
.site-header nav a:hover{opacity:1;color:var(--blue)}
.site-header nav a.is-current{opacity:1;color:var(--blue)}
.site-header nav a.nav-cta{opacity:1;background:var(--ink);color:#fff;border-radius:999px;padding:9px 18px}
.site-header nav a.nav-cta:hover{background:var(--blue);color:#fff}

/* 読了プログレス */
.progress{position:fixed;top:0;left:0;height:3px;width:0;background:var(--blue);z-index:40;transition:width .1s linear}

/* ── 共通レイアウト ─────────────────── */
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}
.ind-links{max-width:var(--maxw);margin:20px auto 0;padding:0 24px;display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-size:.85rem}
.ind-links .label{color:var(--muted);font-weight:700;margin-right:4px}
.ind-links a{color:var(--blue);text-decoration:underline;text-underline-offset:3px}
a.chip{text-decoration:none}
.crumbs{font-size:.78rem;color:var(--muted);max-width:var(--maxw);margin:22px auto 0;padding:0 24px}
.crumbs a{color:var(--muted)}
.crumbs a:hover{color:var(--blue)}
.eyebrow{display:inline-block;font-size:.7rem;font-weight:800;letter-spacing:.24em;color:var(--blue);text-transform:uppercase}

/* ── 記事ページ ─────────────────────── */
.article-head{max-width:var(--maxw);margin:0 auto;padding:26px 24px 0}
.article-head .meta{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-size:.8rem;color:var(--muted);margin:16px 0 0}
h1.title{font-size:clamp(1.7rem,3.4vw,2.6rem);line-height:1.45;font-weight:800;letter-spacing:-.02em;margin:14px 0 0;max-width:22em}
.chip{background:var(--soft);color:var(--blue);font-weight:800;border-radius:999px;padding:4px 12px;font-size:.75rem}
.hero{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:20px;background:var(--soft);margin:28px 0 0;display:block;max-width:var(--maxw)}
.hero-wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}

.layout{max-width:var(--maxw);margin:0 auto;padding:44px 24px 0;display:grid;grid-template-columns:minmax(0,1fr) 292px;gap:56px;align-items:start}
.col-main{min-width:0}
.col-side{position:sticky;top:96px}

.lead{font-size:1.1rem;color:#2a3340;font-weight:600;line-height:1.95;border-left:3px solid var(--blue);padding-left:18px;margin:0 0 32px}
.keypoints{background:var(--soft);border-radius:18px;padding:24px 26px;margin:0 0 40px}
.keypoints h2{font-size:.78rem;font-weight:800;color:var(--blue);margin:0 0 14px;letter-spacing:.18em;text-transform:uppercase}
.keypoints ul{margin:0;padding:0;list-style:none}
.keypoints li{position:relative;margin:0 0 12px;padding-left:24px;color:#1b2430;font-weight:600}
.keypoints li::before{content:"";position:absolute;left:2px;top:.72em;width:8px;height:8px;border-radius:50%;background:var(--blue)}
.keypoints li:last-child{margin-bottom:0}

.article{max-width:none}
.article > h2{font-size:1.45rem;font-weight:800;line-height:1.55;margin:56px 0 18px;padding-top:22px;border-top:1px solid var(--line);scroll-margin-top:96px}
.article > h3{font-size:1.12rem;font-weight:800;margin:34px 0 10px;color:#1b2430}
.article p{margin:0 0 20px;color:#313a46}
.article ul,.article ol{margin:0 0 22px;padding-left:22px}
.article li{margin:0 0 10px;color:#313a46}
.article blockquote{margin:28px 0;padding:20px 24px;background:var(--soft);border-radius:14px;border-left:4px solid var(--blue);color:#1b2430;font-weight:600}

/* 目次 */
.toc{border:1px solid var(--line);border-radius:18px;padding:20px 22px}
.toc h2{font-size:.72rem;font-weight:800;letter-spacing:.2em;color:var(--muted);text-transform:uppercase;margin:0 0 14px}
.toc ol{list-style:none;margin:0;padding:0;counter-reset:toc}
.toc li{counter-increment:toc;margin:0 0 11px;line-height:1.6}
.toc li:last-child{margin-bottom:0}
.toc a{display:flex;gap:10px;color:var(--muted);font-size:.84rem;font-weight:600;text-decoration:none}
.toc a::before{content:counter(toc,decimal-leading-zero);color:var(--blue);font-weight:800;font-size:.72rem;padding-top:.18em}
.toc a:hover{color:var(--ink);text-decoration:none}
.toc a.is-active{color:var(--blue)}
.side-cta{margin-top:18px;background:var(--ink);color:#fff;border-radius:18px;padding:22px}
.side-cta p{color:rgba(255,255,255,.78);font-size:.82rem;margin:0 0 14px;line-height:1.8}
.side-cta strong{display:block;color:#fff;font-size:1rem;font-weight:800;margin-bottom:8px;line-height:1.6}
.side-cta a{display:inline-flex;align-items:center;gap:6px;background:var(--blue);color:#fff;border-radius:999px;padding:10px 18px;font-size:.82rem;font-weight:800;text-decoration:none}
.toc-mobile{display:none}

/* FAQ */
.faq{margin:56px 0 8px}
.faq h2{font-size:1.45rem;font-weight:800;margin-bottom:18px}
.faq details{border:1px solid var(--line);border-radius:14px;margin-bottom:12px;overflow:hidden;transition:border-color .2s}
.faq details[open]{border-color:var(--blue)}
.faq summary{cursor:pointer;list-style:none;padding:18px 20px;font-weight:700;color:var(--ink);display:flex;justify-content:space-between;gap:12px;line-height:1.7}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"＋";color:var(--blue);font-weight:800;flex-shrink:0}
.faq details[open] summary::after{content:"−"}
.faq .a{padding:0 20px 20px;color:#313a46}

/* CTA */
.cta{margin:60px 0;background:var(--ink);color:#fff;border-radius:24px;padding:40px 34px}
.cta h2{color:#fff;font-size:1.5rem;font-weight:800;margin-bottom:12px;line-height:1.6}
.cta p{color:rgba(255,255,255,.8);margin-bottom:22px}
.cta .cta-eyebrow{display:inline-block;background:var(--blue);color:#fff;font-size:.7rem;font-weight:800;letter-spacing:.1em;border-radius:999px;padding:6px 14px;margin-bottom:16px}
.cta .btns{display:flex;flex-wrap:wrap;gap:12px}
.cta .cta-foot{color:rgba(255,255,255,.55);font-size:.78rem;margin:16px 0 0}
.btn{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:14px 24px;font-weight:800;font-size:.92rem;text-decoration:none;transition:transform .2s,background .2s}
.btn:hover{text-decoration:none;transform:translateY(-2px)}
.btn-primary{background:var(--blue);color:#fff}
.btn-ghost{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.25)}

/* 用語集へのリンク */
.article a.term{color:inherit;text-decoration:underline;text-decoration-color:var(--blue);text-underline-offset:3px}
/* 関連サービス */
.svc-links{margin:48px 0 0}
.svc-links h2{font-size:1.1rem;font-weight:800;margin-bottom:14px}
.svc-links ul{list-style:none;padding:0;margin:0;display:grid;gap:12px}
.svc-links a{display:block;border:1px solid var(--line);border-left:4px solid var(--blue);border-radius:14px;padding:16px 18px;text-decoration:none;color:var(--ink);background:#fff}
.svc-links a:hover{border-color:var(--blue)}
.svc-links strong{display:block;font-weight:800;margin-bottom:4px}
.svc-links span{font-size:.88rem;color:var(--muted)}
/* 関連記事 */
.related{margin:56px 0 0;padding-top:36px;border-top:1px solid var(--line)}
.related h2{font-size:1.25rem;font-weight:800;margin-bottom:20px}
.related .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}
.disclaimer{font-size:.78rem;color:var(--muted);border-top:1px solid var(--line);margin-top:44px;padding-top:20px;line-height:1.9}
.back-link{display:inline-flex;align-items:center;gap:8px;margin-top:34px;font-size:.86rem;font-weight:700}

/* ── カード ─────────────────────────── */
.card{border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#fff;display:flex;flex-direction:column;text-decoration:none;color:var(--ink);transition:border-color .25s,box-shadow .25s,transform .25s}
.card:hover{border-color:var(--blue);text-decoration:none;box-shadow:0 12px 32px rgba(17,20,24,.08);transform:translateY(-3px)}
.card .thumb{position:relative;overflow:hidden;background:var(--soft)}
.card .thumb img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.card:hover .thumb img{transform:scale(1.05)}
.card .thumb .k{position:absolute;left:12px;top:12px;background:rgba(255,255,255,.94);color:var(--blue);font-size:.7rem;font-weight:800;border-radius:999px;padding:5px 12px;letter-spacing:.02em}
.card .body{padding:18px 18px 20px;display:flex;flex-direction:column;gap:9px;flex:1}
.card h3,.card h2.h3{margin:0;font-size:1rem;font-weight:800;line-height:1.65;letter-spacing:-.01em;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.card .d{font-size:.82rem;color:var(--muted);line-height:1.8;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card .foot{display:flex;align-items:center;gap:12px;font-size:.74rem;color:#9aa3b0;margin-top:auto;padding-top:6px}

/* ── 一覧ページ ─────────────────────── */
.index-hero{max-width:var(--maxw);margin:26px auto 0;padding:0 24px}
.index-hero h1{font-size:clamp(2rem,4.6vw,3.2rem);font-weight:800;letter-spacing:-.03em;line-height:1.35;margin:14px 0 0}
.index-hero p{color:var(--muted);max-width:44em;margin-top:16px}
.index-hero .count{display:inline-block;margin-top:18px;font-size:.78rem;font-weight:700;color:var(--muted)}
.index-hero .count b{color:var(--ink);font-size:1rem}

.featured{max-width:var(--maxw);margin:40px auto 0;padding:0 24px}
.featured a{display:grid;grid-template-columns:1.15fr 1fr;gap:0;border:1px solid var(--line);border-radius:24px;overflow:hidden;color:var(--ink);text-decoration:none;transition:border-color .25s,box-shadow .25s}
.featured a:hover{border-color:var(--blue);text-decoration:none;box-shadow:0 16px 40px rgba(17,20,24,.08)}
.featured .thumb{overflow:hidden;background:var(--soft)}
.featured .thumb img{width:100%;height:100%;min-height:280px;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.22,1,.36,1)}
.featured a:hover .thumb img{transform:scale(1.04)}
.featured .body{padding:36px 38px;display:flex;flex-direction:column;justify-content:center;gap:14px}
.featured .tag{display:flex;align-items:center;gap:10px}
.featured .tag .pill{background:var(--blue);color:#fff;font-size:.68rem;font-weight:800;letter-spacing:.12em;border-radius:999px;padding:5px 12px;text-transform:uppercase}
.featured h2{font-size:clamp(1.2rem,2vw,1.6rem);font-weight:800;line-height:1.6;letter-spacing:-.01em}
.featured p{color:var(--muted);font-size:.9rem;line-height:1.85;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.featured .foot{display:flex;gap:14px;font-size:.76rem;color:#9aa3b0}

.filters{max-width:var(--maxw);margin:52px auto 0;padding:0 24px}
.filters .label{display:block;font-size:.7rem;font-weight:800;letter-spacing:.2em;color:var(--muted);text-transform:uppercase;margin-bottom:14px}
.filters .row{display:flex;flex-wrap:wrap;gap:8px}
.filters button{font:inherit;cursor:pointer;background:#fff;border:1px solid var(--line);color:var(--muted);font-weight:700;font-size:.8rem;border-radius:999px;padding:8px 15px;transition:border-color .2s,color .2s,background .2s}
.filters button:hover{border-color:var(--blue);color:var(--blue)}
.filters button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.filters button .n{opacity:.55;font-size:.74rem;margin-left:5px}

.cards{max-width:var(--maxw);margin:26px auto 0;padding:0 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}
.cards[data-empty="true"]::after{content:"該当する記事はまだありません。";color:var(--muted);font-size:.9rem}
.more{max-width:var(--maxw);margin:36px auto 0;padding:0 24px;display:flex;justify-content:center}
.more button{font:inherit;cursor:pointer;background:#fff;border:1px solid var(--ink);color:var(--ink);font-weight:800;font-size:.88rem;border-radius:999px;padding:14px 34px;transition:background .2s,color .2s}
.more button:hover{background:var(--ink);color:#fff}

/* ── フッター ───────────────────────── */
.site-footer{border-top:1px solid var(--line);margin-top:80px;padding:56px 0 32px;color:var(--muted);font-size:.84rem}
.site-footer .cols{max-width:var(--maxw);margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:40px}
.site-footer .brand-col strong{display:block;color:var(--ink);font-size:1rem;margin-bottom:12px}
.site-footer .brand-col p{line-height:1.9}
.site-footer h2{font-size:.68rem;font-weight:800;letter-spacing:.22em;color:#9aa3b0;text-transform:uppercase;margin-bottom:16px}
.site-footer ul{list-style:none;margin:0;padding:0}
.site-footer li{margin-bottom:11px}
.site-footer li a{color:#313a46;font-weight:600;text-decoration:none}
.site-footer li a:hover{color:var(--blue)}
.site-footer .bottom{max-width:var(--maxw);margin:44px auto 0;padding:22px 24px 0;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;font-size:.76rem}
.site-footer .bottom a{color:var(--muted)}

@media(max-width:1024px){
  .layout{grid-template-columns:minmax(0,1fr);gap:0}
  .col-side{display:none}
  .toc-mobile{display:block;border:1px solid var(--line);border-radius:16px;padding:6px 20px;margin:0 0 34px}
  .toc-mobile summary{cursor:pointer;list-style:none;padding:14px 0;font-size:.8rem;font-weight:800;letter-spacing:.14em;color:var(--muted);text-transform:uppercase;display:flex;justify-content:space-between}
  .toc-mobile summary::-webkit-details-marker{display:none}
  .toc-mobile summary::after{content:"＋";color:var(--blue)}
  .toc-mobile[open] summary::after{content:"−"}
  .toc-mobile .toc{border:0;padding:0 0 18px}
  .toc-mobile .toc h2{display:none}
  .featured a{grid-template-columns:1fr}
  .featured .thumb img{min-height:0;aspect-ratio:16/9}
  .site-footer .cols{grid-template-columns:1fr 1fr;gap:32px}
}
@media(max-width:640px){
  .wrap,.crumbs,.article-head,.hero-wrap,.layout,.index-hero,.featured,.filters,.ind-links,.cards,.more{padding-left:18px;padding-right:18px}
  .cta{padding:28px 22px;border-radius:20px}
  .featured .body{padding:26px 24px}
  .article > h2{font-size:1.25rem;margin-top:44px}
  .site-footer .cols{grid-template-columns:1fr}
}
`.trim();

// AI診断の表示切り替え。App.tsx の SHOW_DIAGNOSIS と揃えること。
// false の間はコラム側の導線（ヘッダー・フッター・CTA・llms.txt）から診断を外す。
const SHOW_DIAGNOSIS = false;

// 計測: Vercel Web Analytics（本体サイトと同じ）。静的ページなのでスクリプトを直接読み込む
const ANALYTICS_HEAD = `<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};</script>
<script defer src="/_vercel/insights/script.js"></script>`;
// 計測: コラムから相談・事例・サービスへ進んだクリック（個人情報は送らない）
const ANALYTICS_CLICK = `<script>
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a'):null; if(!a) return;
  var h=a.getAttribute('href')||'';
  var name = h.indexOf('/contact')===0 ? 'contact_cta' : h.indexOf('/cases')===0 ? 'cases_click' : h.indexOf('/service/')===0 ? 'service_click' : null;
  if(name) window.va('event',{name:name,data:{from:'column',page:location.pathname}});
});
<\/script>`;

const MARK = '<span class="mark"><i></i></span>';
const navLink = (href, label, current) => `<a href="${href}"${current === href ? ' class="is-current"' : ''}>${label}</a>`;
// 著者。社員は代表1人のため、コラムの執筆者は代表とする（構造化データ・meta・本文の署名で共通）
const AUTHOR = { name: '松尾 心夢', role: '代表取締役', org: 'ＭＧＣ株式会社' };
const AUTHOR_LD = {
  '@type': 'Person', '@id': 'https://mgc-global01.com/company#ceo', name: AUTHOR.name, alternateName: 'Kokomu Matsuo', jobTitle: AUTHOR.role,
  worksFor: { '@type': 'Organization', name: 'ＭＧＣ株式会社', alternateName: 'MGC Inc.', url: 'https://mgc-global01.com' },
  url: 'https://mgc-global01.com/company',
};

const header = (current = '') => `<header class="site-header"><div class="inner"><a class="brand" href="/">${MARK}MGC Inc.</a><nav>${[
  ['/works', '事業内容'],
  ['/service/ai-sales', 'AI営業'],
  ['/service/ai-phone', 'AI電話'],
  ['/service/salesforce-ai', 'Salesforce AI'],
  ['/cases', '導入事例'],
  ['/training', '研修'],
  ['/column', 'コラム'],
].map(([h, l]) => navLink(h, l, current)).join('')}${SHOW_DIAGNOSIS ? navLink('/diagnosis', 'AI診断', current) : ''}<a class="nav-cta" href="/contact">お問い合わせ</a></nav></div></header>`;

const FOOTER = `<footer class="site-footer">
<div class="cols">
<div class="brand-col"><strong>${esc(site.brandFull)}</strong><p>AIとテクノロジーで、日本と世界をつなぐ。</p><p>${esc(site.address || '')}</p></div>
<div><h2>事業・サービス</h2><ul><li><a href="/works">事業内容</a></li><li><a href="/works/ai-solutions">AIソリューション</a></li><li><a href="/service/ai-sales">AI営業</a></li><li><a href="/service/ai-phone">AI電話</a></li><li><a href="/service/salesforce-ai">Salesforce AI</a></li><li><a href="/works/ai-business-launch">AI事業立ち上げ支援</a></li><li><a href="/training">研修</a></li><li><a href="/works/cross-border">クロスボーダー</a></li></ul></div>
<div><h2>実績・ナレッジ</h2><ul><li><a href="/cases">導入事例</a></li><li><a href="/column">コラム</a></li>${SHOW_DIAGNOSIS ? '<li><a href="/diagnosis">AI活用診断</a></li>' : ''}</ul></div>
<div><h2>会社情報</h2><ul><li><a href="/mission">会社理念</a></li><li><a href="/company">会社概要</a></li><li><a href="/career">採用情報</a></li><li><a href="/contact">お問い合わせ</a></li></ul></div>
</div>
<div class="bottom"><span>© 2026 MGC Inc. All Rights Reserved.</span><span><a href="/privacy-policy">プライバシーポリシー</a>　<a href="/terms-of-service">利用規約</a></span></div>
</footer>`;

// ---- render article body blocks ----
// 本文中の用語を、用語集（/glossary）の該当箇所へリンクする。各記事で用語ごとに最初の1回だけ
const GLOSSARY_LINKS = [
  ['生成AI', 'generative-ai'], ['LLM', 'llm'], ['AIエージェント', 'ai-agent'], ['RAG', 'rag'], ['ハルシネーション', 'hallucination'],
  ['ボイスボット', 'voicebot'], ['IVR', 'ivr'], ['ACW', 'acw'], ['CRM', 'crm'], ['SFA', 'sfa'], ['API連携', 'api'],
  ['OFF-JT', 'off-jt'], ['リスキリング', 'reskilling'], ['DX', 'dx'],
  ['機械学習', 'machine-learning'], ['チャットボット', 'chatbot'], ['OCR', 'ocr'], ['画像認識', 'image-recognition'], ['需要予測', 'demand-forecasting'],
  ['パーソナライズ', 'personalization'], ['暗黙知', 'tacit-knowledge'], ['属人化', 'siloed-expertise'], ['匿名化', 'anonymization'], ['PoC', 'poc'],
].map(([term, id]) => ({ id, re: new RegExp(/^[A-Za-z]/.test(term) ? `(?<![A-Za-z])${term}(?![A-Za-z])` : term) }));
function linkTerms(html, used) {
  // html はエスケープ済みの本文（タグを含まない）。リンク内の語を二重にリンクしないよう、1語ずつ置き換える
  for (const g of GLOSSARY_LINKS) {
    if (used.has(g.id)) continue;
    const m = html.match(g.re);
    if (!m) continue;
    // 既に挿入したリンクの中（href や表示文字）には触れない
    const before = html.slice(0, m.index);
    if ((before.match(/<a /g) || []).length !== (before.match(/<\/a>/g) || []).length) continue;
    html = `${before}<a class="term" href="/glossary#${g.id}">${m[0]}</a>${html.slice(m.index + m[0].length)}`;
    used.add(g.id);
  }
  return html;
}

function renderBody(blocks = [], headings = []) {
  const out = [];
  const used = new Set();
  for (const b of blocks) {
    if (b.type === 'h2') {
      const id = `s${headings.length + 1}`;
      headings.push({ id, text: b.text });
      out.push(`<h2 id="${id}">${esc(b.text)}</h2>`);
    }
    else if (b.type === 'h3') out.push(`<h3>${esc(b.text)}</h3>`);
    else if (b.type === 'p') out.push(`<p>${linkTerms(esc(b.text), used)}</p>`);
    else if (b.type === 'quote') out.push(`<blockquote>${esc(b.text)}</blockquote>`);
    else if (b.type === 'ul') out.push(`<ul>${(b.items || []).map((i) => `<li>${linkTerms(esc(i), used)}</li>`).join('')}</ul>`);
    else if (b.type === 'ol') out.push(`<ol>${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ol>`);
    else die(`未知のブロック type "${b.type}"`);
  }
  return out.join('\n');
}

// コラムの内容に近いMGCのサービスを選ぶ（本文中の語の出現数で判定。該当なしはAIソリューション）
const SERVICE_LINKS = [
  { href: '/service/ai-phone', name: 'AI電話（音声AI）', desc: '電話の一次対応を音声AIが引き受け、用件を聞き取って要約し担当者に引き渡す', words: ['電話', 'コール', '問い合わせ対応', '架電', '着信', '音声AI', 'ボイスボット', '反響'] },
  { href: '/service/ai-sales', name: 'AI営業', desc: 'リスト作成から初回接触・返信対応・日程調整まで、営業の前工程をAIが担う', words: ['営業', '商談', 'アポ', '見込み客', 'スカウト', '新規開拓', 'インサイドセールス'] },
  { href: '/service/salesforce-ai', name: 'Salesforce AI活用支援', desc: 'CRMの入力自動化、データからの示唆、エージェントによる実行まで', words: ['CRM', 'Salesforce', 'kintone', '顧客データ', 'SFA', '顧客情報'] },
  { href: '/training', name: 'AI活用リスキリング研修', desc: 'ITに詳しくない方がAIを業務で使いこなすための実践型研修（OFF-JT）', words: ['研修', 'リスキリング', '人材育成', 'OJT'] },
];
function relatedServicesHtml(a) {
  const text = plainText(a);
  const count = (w) => text.split(w).length - 1;
  const scored = SERVICE_LINKS.map((s) => ({ ...s, score: s.words.reduce((n, w) => n + count(w), 0) }))
    .filter((s) => s.score >= 3).sort((x, y) => y.score - x.score).slice(0, 2);
  const picks = scored.length ? scored : [{ href: '/works/ai-solutions', name: 'AIソリューション', desc: '何にAIを使うべきかの整理から、開発・導入・運用まで一貫して支援' }];
  return `<section class="svc-links"><h2>このテーマに関するMGCのサービス</h2><ul>${picks
    .map((s) => `<li><a href="${s.href}"><strong>${esc(s.name)}</strong><span>${esc(s.desc)}</span></a></li>`).join('')}</ul></section>`;
}

// プレーンテキスト抽出（description 補完・文字数チェック用）
function plainText(a) {
  const parts = [a.lead || ''];
  for (const b of a.body || []) {
    if (b.text) parts.push(b.text);
    if (b.items) parts.push(b.items.join(''));
  }
  return parts.join('');
}

// ---- article page ----
function articleHtml(a) {
  const ind = industriesByKey[a.industry];
  const url = `${site.baseUrl}/column/${a.slug}`;
  const img = a.image || ind.fallbackImage;
  const imgAbs = img.startsWith('http') ? img : `${site.baseUrl}${img}`;
  // タイトル末尾はサイト全体で「 - ＭＧＣ株式会社」に揃える（記事データ側の「 - MGCコラム」等は付け替える）
  const seoTitle = `${(a.seoTitle || a.title).replace(/\s*[-–—|｜]\s*(MGC(コラム| Inc\.)?|ＭＧＣ株式会社)\s*$/, '')} - ＭＧＣ株式会社`;
  const desc = a.description || plainText(a).slice(0, 110);
  const kw = (a.keywords || []).join(', ');

  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${site.baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'AI活用コラム', item: `${site.baseUrl}/column` },
      { '@type': 'ListItem', position: 3, name: `${ind.ja}のAI活用`, item: `${site.baseUrl}/column/industry/${a.industry}` },
      { '@type': 'ListItem', position: 4, name: a.title, item: url },
    ],
  };
  const posting = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: a.title, description: desc, abstract: desc, image: [imgAbs],
    datePublished: a.date, dateModified: a.dateModified || a.date,
    inLanguage: 'ja', isAccessibleForFree: true, wordCount: plainText(a).length,
    author: AUTHOR_LD,
    publisher: { '@type': 'Organization', '@id': `${site.baseUrl}/#organization`, name: 'ＭＧＣ株式会社', alternateName: 'MGC Inc.', url: site.baseUrl, logo: { '@type': 'ImageObject', url: `${site.baseUrl}/assets/brand/mgc-logo.png`, width: 512, height: 512 } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: ind.ja,
    about: [
      { '@type': 'Thing', name: `${ind.ja}のAI活用` },
      { '@type': 'Thing', name: 'AI導入・業務効率化' },
    ],
    keywords: kw,
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1.title', '.keypoints', '.lead'] },
  };
  const faqLd = (a.faq && a.faq.length) ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;

  // 関連コラム: 同じ業界の中で前後の記事を選ぶ（先頭の3本に偏らず、どの記事も前後から必ずリンクされる）
  const sameInd = articles.filter((x) => x.industry === a.industry);
  const pos = sameInd.findIndex((x) => x.slug === a.slug);
  const related = [sameInd[pos - 1], sameInd[pos + 1], sameInd[pos + 2] ?? sameInd[pos - 2]].filter((x) => x && x.slug !== a.slug);
  const servicesHtml = relatedServicesHtml(a);
  const relatedHtml = related.length ? `<section class="related"><h2>${esc(ind.ja)}の関連コラム</h2><div class="grid">${related
    .map((r) => {
      const rimg = r.image || industriesByKey[r.industry].fallbackImage;
      return `<a class="card" href="/column/${r.slug}"><span class="thumb"><img src="${esc(rimg)}" alt="${esc(r.imageAlt || r.title)}" loading="lazy"/><span class="k">${esc(industriesByKey[r.industry].ja)}</span></span><span class="body"><h3>${esc(r.title)}</h3><span class="foot">${esc(r.date.replace(/-/g, '.'))}</span></span></a>`;
    })
    .join('')}</div></section>` : '';

  const headings = [];
  const bodyHtml = renderBody(a.body, headings);
  const tocItems = headings.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('');
  const tocHtml = headings.length >= 3 ? `<nav class="toc"><h2>目次</h2><ol>${tocItems}</ol></nav>` : '';
  const tocMobile = headings.length >= 3 ? `<details class="toc-mobile"><summary>目次</summary><nav class="toc"><h2>目次</h2><ol>${tocItems}</ol></nav></details>` : '';

  const faqHtml = (a.faq && a.faq.length) ? `<section class="faq"><h2>よくあるご質問</h2>${a.faq
    .map((f) => `<details><summary>${esc(f.q)}</summary><div class="a">${esc(f.a)}</div></details>`)
    .join('')}</section>` : '';

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(seoTitle)}</title>
<meta name="description" content="${esc(desc)}"/>
${kw ? `<meta name="keywords" content="${esc(kw)}"/>` : ''}
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1"/>
<meta name="author" content="${AUTHOR.name}（${AUTHOR.org} ${AUTHOR.role}）"/>
<link rel="canonical" href="${esc(url)}"/>
<meta property="og:type" content="article"/>
<meta property="og:locale" content="ja_JP"/>
<meta property="og:site_name" content="MGC Inc."/>
<meta property="og:url" content="${esc(url)}"/>
<meta property="og:title" content="${esc(seoTitle)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:image" content="${esc(imgAbs)}"/>
<meta property="article:published_time" content="${esc(a.date)}"/>
<meta property="article:section" content="${esc(ind.ja)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(seoTitle)}"/>
<meta name="twitter:description" content="${esc(desc)}"/>
<meta name="twitter:image" content="${esc(imgAbs)}"/>
<meta name="theme-color" content="#111418"/>
<link rel="icon" href="/favicon.ico"/>
<script type="application/ld+json">${jsonld(breadcrumb)}</script>
<script type="application/ld+json">${jsonld(posting)}</script>
${faqLd ? `<script type="application/ld+json">${jsonld(faqLd)}</script>` : ''}
<style>${CSS}</style>
${ANALYTICS_HEAD}
</head>
<body>
<div class="progress" id="progress"></div>
${header('/column')}
<nav class="crumbs"><a href="/">ホーム</a> ／ <a href="/column">AI活用コラム</a> ／ <a href="/column/industry/${esc(a.industry)}">${esc(ind.ja)}</a></nav>
<header class="article-head">
<span class="eyebrow">${esc(ind.ja)} × AI活用</span>
<h1 class="title">${esc(a.title)}</h1>
<div class="meta"><a class="chip" href="/column/industry/${esc(a.industry)}">${esc(ind.ja)}</a><span>${esc(a.date.replace(/-/g, '.'))}</span>${a.readTime ? `<span>読了目安 ${esc(a.readTime)}</span>` : ''}<span>執筆：${AUTHOR.role} ${AUTHOR.name}</span></div>
</header>
<div class="hero-wrap"><img class="hero" src="${esc(img)}" alt="${esc(a.imageAlt || a.title)}" width="1200" height="675"/></div>
<main class="layout">
<div class="col-main">
<article class="article">
<p class="lead">${esc(a.lead)}</p>
${tocMobile}
${(a.summary && a.summary.length) ? `<aside class="keypoints"><h2>この記事の要点</h2><ul>${a.summary.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></aside>` : ''}
${bodyHtml}
${faqHtml}
${SHOW_DIAGNOSIS ? `<section class="cta">
<span class="cta-eyebrow">無料・所要3分・その場で結果</span>
<h2>では、御社の場合はどうか？ 3分のAI活用診断で確かめる</h2>
<p>業種と今の課題を入力するだけで、AIが「${esc(ind.ja)}の御社に向いたAI活用施策・導入後のワークフロー・削減できる工数とコスト」を、提案書レベルの診断レポートにしてその場でお返しします。無料です。</p>
<div class="btns">
<a class="btn btn-primary" href="/diagnosis">無料でAI活用診断を受ける</a>
<a class="btn btn-ghost" href="/contact">30分の無料相談を申し込む</a>
</div>
<p class="cta-foot">診断は登録不要・その場で結果表示。もちろん、いきなり相談していただいても構いません（初回相談・お見積もりまで無料）。</p>
</section>` : `<section class="cta">
<span class="cta-eyebrow">初回相談・お見積もりまで無料</span>
<h2>では、御社の場合はどうか？ まず30分お話しませんか</h2>
<p>${esc(ind.ja)}の業務のどこにAIを使えるか、どこは人が持つべきかを整理してお返しします。現状を伺うところから始められます。</p>
<div class="btns">
<a class="btn btn-primary" href="/contact">30分の無料相談を申し込む</a>
<a class="btn btn-ghost" href="/cases">導入事例を見る</a>
</div>
<p class="cta-foot">初回のご相談・お見積もりまで無料です。具体的な資料がなくても構いません。</p>
</section>`}
${servicesHtml}
${relatedHtml}
<p class="disclaimer">本コラムは一般的な情報提供を目的としたもので、特定の成果を保証するものではありません。導入可否や効果は、企業の状況・データ・体制により異なります。具体的なご相談は個別にお問い合わせください。</p>
<a class="back-link" href="/column">← コラム一覧へ戻る</a>
</article>
</div>
<aside class="col-side">
${tocHtml}
<div class="side-cta"><strong>${esc(ind.ja)}のAI活用、どこから始めるか</strong><p>現状を伺い、どの業務をAIに任せられるかを整理してお返しします。初回相談は無料です。</p><a href="/contact">30分の無料相談 →</a></div>
</aside>
</main>
${FOOTER}
${ANALYTICS_CLICK}
<script>
(function(){
  var bar=document.getElementById('progress');
  var links=[].slice.call(document.querySelectorAll('.col-side .toc a'));
  var heads=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1));});
  function onScroll(){
    var h=document.documentElement;
    var max=h.scrollHeight-h.clientHeight;
    if(bar) bar.style.width=(max>0?(h.scrollTop/max*100):0)+'%';
    var i=heads.length-1;
    for(;i>=0;i--){ if(heads[i] && heads[i].getBoundingClientRect().top<140) break; }
    links.forEach(function(a,n){ a.classList.toggle('is-active', n===i); });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();
<\/script>
</body>
</html>`;
}

// ---- index page ----
function indexHtml() {
  const url = `${site.baseUrl}/column`;
  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem', position: i + 1, url: `${site.baseUrl}/column/${a.slug}`, name: a.title,
    })),
  };
  const excerpt = (a) => a.description || `${plainText(a).slice(0, 90)}…`;
  const cardHtml = (a) => {
    const ind = industriesByKey[a.industry];
    const img = a.image || ind.fallbackImage;
    return `<a class="card" data-ind="${esc(a.industry)}" href="/column/${a.slug}"><span class="thumb"><img src="${esc(img)}" alt="${esc(a.imageAlt || a.title)}" loading="lazy"/><span class="k">${esc(ind.ja)}</span></span><span class="body"><h3>${esc(a.title)}</h3><span class="d">${esc(excerpt(a))}</span><span class="foot"><span>${esc(a.date.replace(/-/g, '.'))}</span>${a.readTime ? `<span>読了 ${esc(a.readTime)}</span>` : ''}</span></span></a>`;
  };

  // 最新の1本は大きく見せる
  const top = articles[0];
  const featuredHtml = top ? (() => {
    const ind = industriesByKey[top.industry];
    const img = top.image || ind.fallbackImage;
    return `<section class="featured"><a href="/column/${top.slug}"><span class="thumb"><img src="${esc(img)}" alt="${esc(top.imageAlt || top.title)}"/></span><span class="body"><span class="tag"><span class="pill">Featured</span><span class="chip">${esc(ind.ja)}</span></span><h2>${esc(top.title)}</h2><p>${esc(excerpt(top))}</p><span class="foot"><span>${esc(top.date.replace(/-/g, '.'))}</span>${top.readTime ? `<span>読了 ${esc(top.readTime)}</span>` : ''}</span></span></a></section>`;
  })() : '';

  const rest = articles.slice(1);
  const cards = rest.map(cardHtml).join('');

  // 業種フィルタ。記事が存在する業種だけを、記事数の多い順に並べる。
  const counts = rest.reduce((acc, a) => ({ ...acc, [a.industry]: (acc[a.industry] || 0) + 1 }), {});
  const usedIndustries = Object.keys(counts).sort((x, y) => counts[y] - counts[x] || industriesByKey[x].ja.localeCompare(industriesByKey[y].ja, 'ja'));
  const filtersHtml = usedIndustries.length > 1
    ? `<nav class="filters" aria-label="業種でしぼり込む">
<span class="label">業種でしぼり込む</span>
<div class="row">
<button type="button" data-f="all" aria-pressed="true">すべて<span class="n">${rest.length}</span></button>
${usedIndustries.map((k) => `<button type="button" data-f="${esc(k)}" aria-pressed="false">${esc(industriesByKey[k].ja)}<span class="n">${counts[k]}</span></button>`).join('\n')}
</div>
</nav>`
    : '';
  // 業界別ページへのリンク（クローラーとJSなしの環境でも辿れるように）
  const industryNavHtml = `<nav class="ind-links" aria-label="業界別のコラム一覧"><span class="label">業界別のコラム一覧</span>${usedIndustries.concat(Object.keys(industriesByKey).filter((k) => !usedIndustries.includes(k) && articles.some((a) => a.industry === k))).map((k) => `<a href="/column/industry/${esc(k)}">${esc(industriesByKey[k].ja)}</a>`).join('')}</nav>`;
  // JSが無い環境では全記事がそのまま並ぶ（フィルタと「もっと見る」は加点機能）
  const filterScript = `<script>
(function(){
  var STEP=12;
  var grid=document.querySelector('.cards');
  var nav=document.querySelector('.filters');
  var moreWrap=document.querySelector('.more');
  var moreBtn=moreWrap && moreWrap.querySelector('button');
  var featured=document.querySelector('.featured');
  if(!grid) return;
  var cards=[].slice.call(grid.querySelectorAll('.card'));
  var key='all', shownCount=STEP;

  function matched(){
    return cards.filter(function(c){ return key==='all' || c.getAttribute('data-ind')===key; });
  }
  function render(){
    var list=matched();
    cards.forEach(function(c){ c.style.display='none'; });
    list.slice(0,shownCount).forEach(function(c){ c.style.display=''; });
    grid.setAttribute('data-empty', list.length===0 ? 'true' : 'false');
    if(featured) featured.style.display = key==='all' ? '' : 'none';
    if(moreWrap){
      var remain=list.length-shownCount;
      moreWrap.style.display = remain>0 ? '' : 'none';
      if(moreBtn) moreBtn.textContent='もっと見る（残り'+remain+'件）';
    }
    if(nav){
      [].forEach.call(nav.querySelectorAll('button'),function(b){
        b.setAttribute('aria-pressed', b.getAttribute('data-f')===key ? 'true' : 'false');
      });
    }
  }
  if(nav){
    nav.addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b) return;
      key=b.getAttribute('data-f'); shownCount=STEP; render();
      history.replaceState(null,'', key==='all' ? location.pathname : location.pathname+'#'+key);
      window.scrollTo({top:nav.getBoundingClientRect().top+window.pageYOffset-100,behavior:'smooth'});
    });
  }
  if(moreBtn){
    moreBtn.addEventListener('click',function(){ shownCount+=STEP; render(); });
  }
  var initial=location.hash.slice(1);
  if(initial && nav && nav.querySelector('button[data-f="'+initial.replace(/"/g,'')+'"]')) key=initial;
  render();
})();
<\/script>`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>AI活用コラム｜業界別のAI導入・活用の実践知 - ＭＧＣ株式会社</title>
<meta name="description" content="製造・建設・不動産・小売・物流・医療・士業など、業界別にAIの現実的な活用方法を解説するMGCのコラム。どの業務に、どうAIを使い、どこは人が判断するか。実務目線でまとめています。"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<link rel="canonical" href="${esc(url)}"/>
<meta property="og:type" content="website"/>
<meta property="og:locale" content="ja_JP"/>
<meta property="og:site_name" content="MGC Inc."/>
<meta property="og:url" content="${esc(url)}"/>
<meta property="og:title" content="AI活用コラム｜業界別のAI導入・活用の実践知 - ＭＧＣ株式会社"/>
<meta property="og:description" content="業界別に、AIの現実的な活用方法を実務目線で解説するMGCのコラム。"/>
<meta property="og:image" content="${esc(site.baseUrl)}/assets/service_ai.jpg"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="theme-color" content="#111418"/>
<link rel="icon" href="/favicon.ico"/>
<script type="application/ld+json">${jsonld(itemList)}</script>
<style>${CSS}</style>
${ANALYTICS_HEAD}
</head>
<body>
${header('/column')}
<nav class="crumbs"><a href="/">ホーム</a> ／ AI活用コラム</nav>
<section class="index-hero"><span class="eyebrow">AI Column</span><h1>業界別 AI活用コラム</h1><p>製造・建設・不動産・小売・物流・医療・士業…。業界ごとに「どの業務に、どうAIを使い、どこは人が判断するか」を、実務目線でまとめています。</p><span class="count">全 <b>${articles.length}</b> 記事</span></section>
${featuredHtml}
${filtersHtml}
${industryNavHtml}
<section class="cards">${cards || '<p style="color:#5b6472">記事は準備中です。</p>'}</section>
<div class="more"><button type="button">もっと見る</button></div>
${filterScript}
<section class="wrap" style="margin-top:56px">
${SHOW_DIAGNOSIS ? `<div class="cta">
<span class="cta-eyebrow">無料・所要3分・その場で結果</span>
<h2>自社のAI活用、どこから始める？ まず3分の無料診断で確かめる</h2>
<p>業種と課題を入力するだけで、AIが最適な活用施策・導入後のワークフロー・削減できる工数とコストを、提案書レベルのレポートにしてその場でお返しします。ITに詳しくない方でも大丈夫です。</p>
<div class="btns"><a class="btn btn-primary" href="/diagnosis">無料でAI活用診断を受ける</a><a class="btn btn-ghost" href="/contact">30分の無料相談を申し込む</a></div>
</div>` : `<div class="cta">
<span class="cta-eyebrow">初回相談・お見積もりまで無料</span>
<h2>自社のAI活用、どこから始める？ まず30分お話しませんか</h2>
<p>今の業務を伺い、どこからAIに任せられるか、どこは人が持つべきかを整理してお返しします。ITに詳しくない方でも大丈夫です。</p>
<div class="btns"><a class="btn btn-primary" href="/contact">30分の無料相談を申し込む</a><a class="btn btn-ghost" href="/cases">導入事例を見る</a></div>
</div>`}
</section>
${FOOTER}
${ANALYTICS_CLICK}
</body>
</html>`;
}

// ---- 業界別の一覧ページ（/column/industry/<key>）----
// 紹介文は、その業界の記事が実際に扱っているテーマだけを書く（実績や数字は書かない）
const INDUSTRY_LEADS = {
  manufacturing: '外観検査、予兆保全、生産計画、需要予測、在庫の最適化、熟練者の技術承継など、製造業の現場でAIをどう使い、どこは人が判断するかを解説するコラムです。',
  construction: '写真整理、安全・品質管理、書類作成、進捗管理、資材搬入、見積・積算、技術継承など、建設業の現場にAIを取り入れる進め方を解説するコラムです。',
  'real-estate': '反響対応、物件登録、査定・市場分析、契約書類のチェック、巡回・点検、広告づくり、リフォーム提案など、不動産の仲介・管理実務でのAI活用を解説するコラムです。',
  retail: '需要予測と在庫、パーソナライズ、カスタマーサポート、店舗運営、OMO、価格の最適化、MDなど、小売・ECでのAI活用を解説するコラムです。',
  logistics: '配車計画、在庫、倉庫の動線・配置、書類業務、ラストワンマイル、積載、安全管理、ベテランの判断の標準化など、物流でのAI活用を解説するコラムです。',
  healthcare: '記録業務、ケアプランとリスク予測、シフト作成、インシデント報告、見守り、外国人材の教育、退院支援、家族対応など、医療・介護の現場でのAI活用を解説するコラムです。',
  hospitality: '予約・シフト・接客、需要予測、バックヤード業務、お客様の声の分析、品質のばらつきや廃棄の削減など、飲食・ホテルでのAI活用を解説するコラムです。',
  professional: '会計・法務の定型業務、契約・書類の下書きと確認、相談対応の型化、リスク管理と組織の知のデジタル化など、士業でのAI活用を「AIに任せる作業」と「人が持つ判断」に分けて解説するコラムです。',
  finance: '審査・照会、事務作業と顧客対応、査定、非定型書類の審査とコンプライアンス、パーソナライズ、AIの信頼性とリスク管理、不正検知など、金融・保険でのAI活用を解説するコラムです。',
  education: '校務・教材作成、フィードバック、授業準備、データ活用、指導力の底上げ、生徒の見守りなど、教育現場で先生の時間を生み出すAI活用を解説するコラムです。',
  hr: '書類選考とスカウト、採用マッチング、面接評価の平準化、求人票、キャリア面談、タレントマネジメント、リスキリング、社内ナレッジなど、人材・採用領域でのAI活用を解説するコラムです。',
  public: '窓口業務、内部事務、ガバナンス、住民サービス、政策立案・地域活性化など、自治体でのAI導入を実務から進める方法を解説するコラムです。',
};
function industryHtml(key) {
  const ind = industriesByKey[key];
  const list = articles.filter((a) => a.industry === key);
  const url = `${site.baseUrl}/column/industry/${key}`;
  const title = `${ind.ja}のAI活用コラム｜業務別の導入の進め方 - ＭＧＣ株式会社`;
  const lead = INDUSTRY_LEADS[key] || `${ind.ja}でのAI活用を、実務目線で解説するコラムです。`;
  const desc = `${lead.replace(/コラムです。$/, 'MGCのコラム一覧')}（${list.length}記事）。`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${ind.ja}のAI活用コラム`, description: lead, url, inLanguage: 'ja',
      isPartOf: { '@id': `${site.baseUrl}/#website` }, about: { '@type': 'Thing', name: `${ind.ja}のAI活用` },
      mainEntity: { '@type': 'ItemList', itemListElement: list.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.baseUrl}/column/${a.slug}`, name: a.title })) } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${site.baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'AI活用コラム', item: `${site.baseUrl}/column` },
      { '@type': 'ListItem', position: 3, name: `${ind.ja}のAI活用`, item: url },
    ] },
  ];
  const excerpt = (a) => a.description || `${plainText(a).slice(0, 90)}…`;
  const cards = list.map((a) => {
    const img = a.image || ind.fallbackImage;
    return `<a class="card" href="/column/${a.slug}"><span class="thumb"><img src="${esc(img)}" alt="${esc(a.imageAlt || a.title)}" loading="lazy"/><span class="k">${esc(ind.ja)}</span></span><span class="body"><h2 class="h3">${esc(a.title)}</h2><span class="d">${esc(excerpt(a))}</span><span class="foot"><span>${esc(a.date.replace(/-/g, '.'))}</span>${a.readTime ? `<span>読了 ${esc(a.readTime)}</span>` : ''}</span></span></a>`;
  }).join('');
  const others = Object.keys(industriesByKey).filter((k) => k !== key && articles.some((a) => a.industry === k));
  const svc = ['hr', 'education'].includes(key) ? { href: '/training', label: 'AI活用リスキリング研修' } : { href: '/works/ai-solutions', label: 'AIソリューション' };
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<link rel="canonical" href="${esc(url)}"/>
<meta property="og:type" content="website"/>
<meta property="og:locale" content="ja_JP"/>
<meta property="og:site_name" content="MGC Inc."/>
<meta property="og:url" content="${esc(url)}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:image" content="${esc(site.baseUrl)}${esc(ind.fallbackImage)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="theme-color" content="#111418"/>
<link rel="icon" href="/favicon.ico"/>
${ld.map((x) => `<script type="application/ld+json">${jsonld(x)}</script>`).join('\n')}
<style>${CSS}</style>
${ANALYTICS_HEAD}
</head>
<body>
${header('/column')}
<nav class="crumbs"><a href="/">ホーム</a> ／ <a href="/column">AI活用コラム</a> ／ ${esc(ind.ja)}</nav>
<section class="index-hero"><span class="eyebrow">AI Column — ${esc(ind.ja)}</span><h1>${esc(ind.ja)}のAI活用コラム</h1><p>${esc(lead)}</p><span class="count">全 <b>${list.length}</b> 記事</span></section>
<section class="cards">${cards}</section>
<nav class="ind-links" aria-label="ほかの業界のコラム"><span class="label">ほかの業界</span>${others.map((k) => `<a href="/column/industry/${esc(k)}">${esc(industriesByKey[k].ja)}</a>`).join('')}<a href="/column">すべてのコラム</a></nav>
<section class="wrap" style="margin-top:56px">
<div class="cta">
<span class="cta-eyebrow">初回相談・お見積もりまで無料</span>
<h2>${esc(ind.ja)}のAI活用、どこから始める？ まず30分お話しませんか</h2>
<p>今の業務を伺い、どこからAIに任せられるか、どこは人が持つべきかを整理してお返しします。関連するサービス：<a href="${esc(svc.href)}">${esc(svc.label)}</a></p>
<div class="btns"><a class="btn btn-primary" href="/contact">30分の無料相談を申し込む</a><a class="btn btn-ghost" href="/cases">導入事例を見る</a></div>
</div>
</section>
${FOOTER}
${ANALYTICS_CLICK}
</body>
</html>`;
}

// ---- sitemap ----
function updateSitemap() {
  const START = '<!-- COLUMNS:START -->';
  const END = '<!-- COLUMNS:END -->';
  const urls = [
    `  <url><loc>${site.baseUrl}/column</loc><lastmod>${articles.map((a) => a.date).sort().pop()}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    ...Object.keys(industriesByKey).filter((k) => articles.some((a) => a.industry === k)).map((k) =>
      `  <url><loc>${site.baseUrl}/column/industry/${k}</loc><lastmod>${articles.filter((a) => a.industry === k).map((a) => a.date).sort().pop()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`),
    ...articles.map((a) =>
      `  <url><loc>${site.baseUrl}/column/${a.slug}</loc><lastmod>${a.date}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
  ].join('\n');
  const block = `${START}\n${urls}\n  ${END}`;

  let xml;
  if (existsSync(SITEMAP)) {
    xml = readFileSync(SITEMAP, 'utf8');
    if (xml.includes(START) && xml.includes(END)) {
      xml = xml.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
    } else {
      xml = xml.replace('</urlset>', `${block}\n</urlset>`);
    }
  } else {
    xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n${block}\n</urlset>\n`;
  }
  writeFileSync(SITEMAP, xml);
}

// ---- llms.txt（AIアシスタント/生成エンジン向けのサイトガイド。llms.txt標準）----
function updateLlmsTxt() {
  // 方針: AIが「この会社は何をしていて、誰に何を頼めるか」を正しく説明・推薦できるよう、
  // 会社概要 → 事業・サービス → 研修 → 事例 → 主要ページ → コラム の順に、サイトに載っている事実だけを書く。
  // 料金はサイトに明記しているもの（研修の受講料）だけ。実績の数字は事例ページに載せているものだけ。
  const B = site.baseUrl;
  const L = [];
  L.push('# ＭＧＣ株式会社（MGC Inc.）');
  L.push('');
  L.push('> 京都の会社。企業のAI活用を、業務の棚卸し・要件整理から、AIの開発・導入・定着、そして同業他社へ届ける事業化まで一貫して支援する。事業はAIソリューション、AI事業立ち上げ支援、研修（AI活用リスキリング研修）、クロスボーダー（海外企業の日本参入・日本企業の海外進出）の4つ。ビジョンは「AIとテクノロジーで、日本と世界をつなぐ」。');
  L.push('');
  L.push(`サイト全文（サービス・事業・研修・事例・ガイド・用語集の本文）: ${B}/llms-full.txt`);
  L.push('');
  L.push('## 会社概要');
  L.push('- 商号: ＭＧＣ株式会社（MGC Inc.）');
  L.push('- 所在地: 〒602-8107 京都府京都市上京区西辰巳町111 アビタシオンオンズアン106');
  L.push('- 代表者: 代表取締役 松尾 心夢（Kokomu Matsuo）');
  L.push('- 設立: 2025年12月1日');
  L.push('- 法人番号: 4130001081155');
  L.push('- 問い合わせ: contact@mgc-global01.com ／ フォーム ' + B + '/contact （初回相談は無料・30分）');
  L.push('- 進め方の特徴: 代表がヒアリングから設計・実装・定着まで一貫して担当する。特定のベンダーやAIモデルに縛られず、業務と既存システム（Salesforce、kintone、Slack、Microsoft Teams、LINE など）に合う構成を選ぶ。作って終わりにせず、現場で使われる状態まで運用を見届ける。');
  L.push('');
  L.push('## 事業・サービス');
  L.push(`- [AIソリューション](${B}/works/ai-solutions): 「何にAIを使うべきか」の整理から、音声・テキスト・CRM連携に対応するAIの開発、導入後の運用まで。下の3サービスと、個別のAIコンサルティング・開発を提供`);
  L.push(`  - [AI営業](${B}/service/ai-sales): リスト作成・初回接触・返信対応・日程調整まで、アポイントが取れるまでの営業の前工程をAIが担う。1アポ単位の成果報酬ではなく、仕組みを作って動かし続ける契約形態`);
  L.push(`  - [AI電話（音声AI）](${B}/service/ai-phone): 電話の一次対応を音声AIが引き受ける。プッシュ操作のIVRとは違い、用件を話し言葉のまま聞き取り、要約して担当者に引き渡す。人が対応すべき通話は人に回す`);
  L.push(`  - [Salesforce AI活用支援](${B}/service/salesforce-ai): 入力の自動化、貯まったデータからの示唆の提示、エージェントによる実行まで。MGCはSalesforceのライセンス再販をしていないため、標準AI機能と個別開発のどちらが合うかを利害なく比較できる`);
  L.push(`- [AI事業立ち上げ支援](${B}/works/ai-business-launch): 自社で導入して効果が出たAIを、同業他社へ提供できる商材にまとめ、新しい事業として立ち上げる。パッケージ化、AI側の実務（開発・導入・保守・問い合わせ対応）の巻き取り、サービスサイト・営業資料・価格設計など販売の立ち上げまで`);
  L.push(`- [研修事業（AI活用リスキリング研修）](${B}/training): ITに詳しくない経営者・従業員向けの実践型研修（OFF-JT）。コースは「AI活用リスキリング研修（基礎〜実践）」と「DX推進・生成AI活用人材養成講座」。受講料は1名 398,000円（税込）、標準時間は20時間、通学（対面）またはオンライン（同時双方向）。全企業に同じ内容・時間・価格で提供`);
  L.push(`- [クロスボーダー事業](${B}/works/cross-border): 海外の優れたプロダクトを日本市場へ届ける「Inbound」（日本総代理店）と、日本企業の海外進出を支援する「Outbound」`);
  L.push('');
  L.push('## 料金の考え方');
  L.push(`- [料金の考え方](${B}/pricing): 研修は1名 398,000円（税込）・標準20時間（OFF-JT）で、全企業に同じ内容・時間・価格。AI営業・AI電話・Salesforce AI活用支援は一律の価格表を出さず、費用の構成（初期・月額・実費／従量、Salesforceは調査・判断・構築・月額・ライセンス）と、費用が変わる要因を開示。期間の目安はパイロット運用2〜4週間、本番運用1〜3ヶ月（スコープにより変わる）。初回相談・お見積もりまで無料`);
  L.push('');
  L.push('## 導入事例（社名は掲載許諾が取れるまで伏せ、業種で紹介）');
  L.push(`- [コールセンター運営: 催促架電の自動化](${B}/cases/callcenter-voice-ai): CRMと音声AIを統合し、催促の架電をAIが自動で行う。通話内容に応じた有人対応へのエスカレーションと、通話後の記録・通知（ACW）まで自動化`);
  L.push(`- [総合代理店: 海外メーカー発掘の自動化](${B}/cases/distributor-ai-outreach): 取り扱い候補となる海外メーカーの発掘から接触までをAIで自動化し、1ヶ月で海外メーカーとの商談が10件生まれた`);
  L.push(`- [大手建設機械メーカー: 現場の音声AI](${B}/cases/manufacturer-field-voice-ai): 現場でのトラブルシューティングを音声AIとの対話で解決。機種と言語に応じた技術情報をAIが引き当てる`);
  L.push('');
  L.push('## 比較・選び方ガイド');
  L.push(`- [AI電話・IVR・ボイスボットの違いと選び方](${B}/guide/ai-phone-vs-ivr-voicebot): 用件の伝え方・扱える情報・記録・人への引き継ぎで比較。向く電話・向かない電話`);
  L.push(`- [AI営業とテレアポ代行の違いと選び方](${B}/guide/ai-sales-vs-telemarketing): 担い手・契約の形・手元に残るもの・比較の観点`);
  L.push(`- [Salesforceの標準AI機能と個別開発、どちらを選ぶか](${B}/guide/salesforce-standard-ai-vs-custom): 費用の構成・判断の材料・進め方`);
  L.push('');
  L.push('## 主要ページ');
  L.push(`- [トップ](${B}/) ／ [事業内容](${B}/works) ／ [導入事例](${B}/cases) ／ [会社理念](${B}/mission) ／ [会社概要](${B}/company) ／ [お知らせ・ジャーナル](${B}/blog) ／ [AI活用コラム](${B}/column) ／ [料金の考え方](${B}/pricing) ／ [AI活用 用語集](${B}/glossary) ／ [お問い合わせ](${B}/contact)`);
  if (SHOW_DIAGNOSIS) L.push(`- [AI活用診断（無料）](${B}/diagnosis): 業種と課題を入力すると、AI活用施策・導入後ワークフロー・削減効果の試算をその場で返す無料診断`);
  L.push('');
  L.push('## AI活用コラム（業界別）');
  L.push('業界別に「どの業務にどうAIを使い、どこは人が判断するか」を実務目線で解説する記事。執筆は代表取締役 松尾 心夢。');
  L.push(`業界別の一覧: ${Object.keys(industriesByKey).filter((k) => articles.some((a) => a.industry === k)).map((k) => `[${industriesByKey[k].ja}](${B}/column/industry/${k})`).join(' ／ ')}`);
  for (const a of articles) {
    const ind = industriesByKey[a.industry];
    const d = a.description || plainText(a).slice(0, 90);
    L.push(`- [${a.title}](${B}/column/${a.slug}): ［${ind.ja}］${d}`);
  }
  L.push('');
  writeFileSync(join(ROOT, 'public', 'llms.txt'), L.join('\n') + '\n');
}

// ---- run ----
let count = 0;
for (const a of articles) {
  writeFileSync(join(OUT_DIR, `${a.slug}.html`), articleHtml(a));
  count++;
}
writeFileSync(join(OUT_DIR, 'index.html'), indexHtml());
const HUBS = Object.keys(industriesByKey).filter((k) => articles.some((a) => a.industry === k));
mkdirSync(join(OUT_DIR, 'industry'), { recursive: true });
for (const k of HUBS) writeFileSync(join(OUT_DIR, 'industry', `${k}.html`), industryHtml(k));
updateSitemap();
updateLlmsTxt();

console.log(`[build-columns] OK: ${count} 記事 + index.html + 業界別 ${HUBS.length} ページ + sitemap 更新`);
for (const a of articles) {
  const len = plainText(a).length;
  const warn = len < 1500 ? '  ⚠ 短い(1500字未満)' : '';
  console.log(`  - /column/${a.slug}  (${a.industry}, ${len}字)${warn}`);
}
