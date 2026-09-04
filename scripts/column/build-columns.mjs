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
:root{--ink:#111418;--blue:#2D6CDF;--muted:#5b6472;--line:#e6e8ec;--bg:#ffffff;--soft:#f6f8fb}
html{-webkit-text-size-adjust:100%}
body{font-family:"Hiragino Kaku Gothic ProN","Hiragino Sans","Noto Sans JP",Meiryo,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--ink);line-height:1.85;-webkit-font-smoothing:antialiased}
a{color:var(--blue);text-decoration:none}
a:hover{text-decoration:underline}
.site-header{position:sticky;top:0;z-index:20;background:var(--ink);display:flex;align-items:center;justify-content:space-between;padding:16px 24px}
.site-header a.brand{color:#fff;font-size:1.15rem;font-weight:800;letter-spacing:.04em;text-decoration:none}
.site-header nav a{color:rgba(255,255,255,.8);font-size:.85rem;font-weight:600;margin-left:20px;text-decoration:none}
.site-header nav a:hover{color:#fff}
.wrap{max-width:760px;margin:0 auto;padding:0 22px}
.crumbs{font-size:.8rem;color:var(--muted);margin:26px auto 0;max-width:760px;padding:0 22px}
.crumbs a{color:var(--muted)}
.eyebrow{display:inline-block;font-size:.72rem;font-weight:800;letter-spacing:.16em;color:var(--blue);text-transform:uppercase;margin-bottom:14px}
h1.title{font-size:2rem;line-height:1.45;font-weight:800;letter-spacing:-.01em;margin:8px 0 16px}
.meta{display:flex;flex-wrap:wrap;gap:14px;align-items:center;font-size:.82rem;color:var(--muted);margin-bottom:26px}
.chip{background:var(--soft);color:var(--blue);font-weight:700;border-radius:999px;padding:4px 12px;font-size:.78rem}
.hero{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:16px;background:var(--soft);margin:6px 0 30px;display:block}
.lead{font-size:1.08rem;color:#2a3340;font-weight:500;border-left:3px solid var(--blue);padding-left:16px;margin:0 0 30px}
.keypoints{background:var(--soft);border:1px solid var(--line);border-radius:14px;padding:20px 22px;margin:0 0 34px}
.keypoints h2{font-size:.95rem;font-weight:800;color:var(--blue);margin:0 0 12px;letter-spacing:.02em}
.keypoints ul{margin:0;padding-left:20px}
.keypoints li{margin:0 0 8px;color:#1b2430;font-weight:500}
.keypoints li:last-child{margin-bottom:0}
.article h2{font-size:1.35rem;font-weight:800;line-height:1.5;margin:44px 0 14px;padding-top:6px}
.article h3{font-size:1.1rem;font-weight:700;margin:30px 0 10px;color:#1b2430}
.article p{margin:0 0 18px;color:#313a46}
.article ul,.article ol{margin:0 0 20px;padding-left:22px}
.article li{margin:0 0 9px;color:#313a46}
.article blockquote{margin:26px 0;padding:16px 20px;background:var(--soft);border-radius:12px;border-left:4px solid var(--blue);color:#1b2430;font-weight:600}
.faq{margin:48px 0 8px}
.faq h2{font-size:1.35rem;font-weight:800;margin-bottom:16px}
.faq details{border:1px solid var(--line);border-radius:12px;padding:0;margin-bottom:12px;overflow:hidden}
.faq summary{cursor:pointer;list-style:none;padding:16px 18px;font-weight:700;color:var(--ink);display:flex;justify-content:space-between;gap:12px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"＋";color:var(--blue);font-weight:800}
.faq details[open] summary::after{content:"−"}
.faq .a{padding:0 18px 18px;color:#313a46}
.cta{margin:52px 0;background:var(--ink);color:#fff;border-radius:20px;padding:30px 26px}
.cta h2{color:#fff;font-size:1.3rem;font-weight:800;margin-bottom:10px}
.cta p{color:rgba(255,255,255,.82);margin-bottom:20px}
.cta .cta-eyebrow{display:inline-block;background:var(--blue);color:#fff;font-size:.72rem;font-weight:800;letter-spacing:.08em;border-radius:999px;padding:5px 12px;margin-bottom:14px}
.cta .btns{display:flex;flex-wrap:wrap;gap:12px}
.cta .cta-foot{color:rgba(255,255,255,.6);font-size:.8rem;margin:14px 0 0}
.btn{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:13px 22px;font-weight:800;font-size:.92rem;text-decoration:none}
.btn-primary{background:var(--blue);color:#fff}
.btn-ghost{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.25)}
.related{margin:44px 0}
.related h2{font-size:1.2rem;font-weight:800;margin-bottom:14px}
.related a{display:block;border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:10px;color:var(--ink);text-decoration:none}
.related a:hover{border-color:var(--blue)}
.related .k{font-size:.74rem;color:var(--blue);font-weight:700}
.disclaimer{font-size:.8rem;color:var(--muted);border-top:1px solid var(--line);margin-top:44px;padding-top:20px}
.site-footer{border-top:1px solid var(--line);margin-top:60px;padding:30px 22px;color:var(--muted);font-size:.82rem}
.site-footer .wrap{max-width:760px}
/* index */
.index-hero{max-width:820px;margin:40px auto 8px;padding:0 22px}
.index-hero h1{font-size:2rem;font-weight:800;margin-bottom:10px}
.index-hero p{color:var(--muted);max-width:640px}
.filters{max-width:900px;margin:26px auto 0;padding:0 22px;display:flex;flex-wrap:wrap;gap:8px}
.filters button{font:inherit;cursor:pointer;background:#fff;border:1px solid var(--line);color:var(--muted);font-weight:700;font-size:.8rem;border-radius:999px;padding:7px 14px;transition:border-color .2s,color .2s,background .2s}
.filters button:hover{border-color:var(--blue);color:var(--blue)}
.filters button[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff}
.cards[data-empty="true"]::after{content:"該当する記事はまだありません。";color:var(--muted);font-size:.9rem}
.cards{max-width:900px;margin:26px auto 0;padding:0 22px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
.card{border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#fff;display:flex;flex-direction:column;text-decoration:none;color:var(--ink);transition:border-color .2s}
.card:hover{border-color:var(--blue);text-decoration:none}
.card img{width:100%;aspect-ratio:16/9;object-fit:cover;background:var(--soft)}
.card .body{padding:16px 16px 20px;display:flex;flex-direction:column;gap:8px;flex:1}
.card .k{font-size:.72rem;color:var(--blue);font-weight:800}
.card h3{font-size:1.02rem;font-weight:700;line-height:1.5}
.card .d{font-size:.84rem;color:var(--muted);line-height:1.7}
.card .date{font-size:.74rem;color:#9aa3b0;margin-top:auto}
@media(max-width:640px){h1.title{font-size:1.55rem}.wrap{padding:0 18px}.cta{padding:24px 20px}}
`.trim();

// AI診断の表示切り替え。App.tsx の SHOW_DIAGNOSIS と揃えること。
// false の間はコラム側の導線（ヘッダー・フッター・CTA・llms.txt）から診断を外す。
const SHOW_DIAGNOSIS = false;

const HEADER = `<header class="site-header"><a class="brand" href="/">MGC Inc.</a><nav><a href="/service/ai-sales">サービス</a><a href="/cases">導入事例</a><a href="/column">コラム</a>${SHOW_DIAGNOSIS ? '<a href="/diagnosis">AI診断</a>' : ''}<a href="/training">研修</a><a href="/#works">事業内容</a><a href="/contact">お問い合わせ</a></nav></header>`;
const FOOTER = `<footer class="site-footer"><div class="wrap"><p><strong>${esc(site.brandFull)}</strong></p><p>${esc(site.address || '')}</p><p style="margin-top:10px"><a href="/">${esc(site.baseUrl)}</a> ・ <a href="/column">コラム一覧</a> ・ <a href="/cases">導入事例</a> ・ <a href="/service/ai-sales">AI営業</a> ・ <a href="/service/ai-phone">AI電話</a> ・ <a href="/service/salesforce-ai">Salesforce AI</a>${SHOW_DIAGNOSIS ? ' ・ <a href="/diagnosis">AI活用診断</a>' : ''} ・ <a href="/training">研修</a></p><p style="margin-top:10px">© 2026 MGC Inc. All Rights Reserved.</p></div></footer>`;

// ---- render article body blocks ----
function renderBody(blocks = []) {
  const out = [];
  for (const b of blocks) {
    if (b.type === 'h2') out.push(`<h2>${esc(b.text)}</h2>`);
    else if (b.type === 'h3') out.push(`<h3>${esc(b.text)}</h3>`);
    else if (b.type === 'p') out.push(`<p>${esc(b.text)}</p>`);
    else if (b.type === 'quote') out.push(`<blockquote>${esc(b.text)}</blockquote>`);
    else if (b.type === 'ul') out.push(`<ul>${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`);
    else if (b.type === 'ol') out.push(`<ol>${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ol>`);
    else die(`未知のブロック type "${b.type}"`);
  }
  return out.join('\n');
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
  const seoTitle = a.seoTitle || `${a.title} - MGCコラム`;
  const desc = a.description || plainText(a).slice(0, 110);
  const kw = (a.keywords || []).join(', ');

  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${site.baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'AI活用コラム', item: `${site.baseUrl}/column` },
      { '@type': 'ListItem', position: 3, name: a.title, item: url },
    ],
  };
  const posting = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: a.title, description: desc, abstract: desc, image: [imgAbs],
    datePublished: a.date, dateModified: a.dateModified || a.date,
    inLanguage: 'ja', isAccessibleForFree: true, wordCount: plainText(a).length,
    author: { '@type': 'Organization', name: 'MGC Inc.', alternateName: 'ＭＧＣ株式会社', url: site.baseUrl, sameAs: [site.baseUrl] },
    publisher: { '@type': 'Organization', name: 'MGC Inc.', url: site.baseUrl, logo: { '@type': 'ImageObject', url: `${site.baseUrl}/logo.png` } },
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

  const related = articles
    .filter((x) => x.industry === a.industry && x.slug !== a.slug)
    .slice(0, 3);
  const relatedHtml = related.length ? `<section class="related"><h2>${esc(ind.ja)}の関連コラム</h2>${related
    .map((r) => `<a href="/column/${r.slug}"><span class="k">${esc(industriesByKey[r.industry].ja)}</span><br>${esc(r.title)}</a>`)
    .join('')}</section>` : '';

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
<meta name="author" content="MGC Inc."/>
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
</head>
<body>
${HEADER}
<nav class="crumbs"><a href="/">ホーム</a> ／ <a href="/column">AI活用コラム</a> ／ ${esc(ind.ja)}</nav>
<main class="wrap">
<article class="article">
<span class="eyebrow">${esc(ind.ja)} × AI活用</span>
<h1 class="title">${esc(a.title)}</h1>
<div class="meta"><span class="chip">${esc(ind.ja)}</span><span>${esc(a.date.replace(/-/g, '.'))}</span>${a.readTime ? `<span>読了目安 ${esc(a.readTime)}</span>` : ''}</div>
<img class="hero" src="${esc(img)}" alt="${esc(a.imageAlt || a.title)}" width="1200" height="675"/>
<p class="lead">${esc(a.lead)}</p>
${(a.summary && a.summary.length) ? `<aside class="keypoints"><h2>この記事の要点</h2><ul>${a.summary.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></aside>` : ''}
${renderBody(a.body)}
${faqHtml}
${SHOW_DIAGNOSIS ? `<section class="cta">
<span class="cta-eyebrow">無料・所要3分・その場で結果</span>
<h2>では、御社の場合はどうか？ 3分のAI活用診断で確かめる</h2>
<p>業種と今の課題を入力するだけで、AIが「${esc(ind.ja)}の御社に向いたAI活用施策・導入後のワークフロー・削減できる工数とコスト」を、提案書レベルの診断レポートにしてその場でお返しします。無料です。</p>
<div class="btns">
<a class="btn btn-primary" href="/diagnosis">無料でAI活用診断を受ける</a>
<a class="btn btn-ghost" href="/contact">30分の無料相談を予約する</a>
</div>
<p class="cta-foot">診断は登録不要・その場で結果表示。もちろん、いきなり相談していただいても構いません（初回相談・お見積もりまで無料）。</p>
</section>` : `<section class="cta">
<span class="cta-eyebrow">初回相談・お見積もりまで無料</span>
<h2>では、御社の場合はどうか？ まず30分お話しませんか</h2>
<p>${esc(ind.ja)}の業務のどこにAIを使えるか、どこは人が持つべきかを整理してお返しします。現状を伺うところから始められます。</p>
<div class="btns">
<a class="btn btn-primary" href="/contact">30分の無料相談を予約する</a>
<a class="btn btn-ghost" href="/cases">導入事例を見る</a>
</div>
<p class="cta-foot">初回のご相談・お見積もりまで無料です。具体的な資料がなくても構いません。</p>
</section>`}
${relatedHtml}
<p class="disclaimer">本コラムは一般的な情報提供を目的としたもので、特定の成果を保証するものではありません。導入可否や効果は、企業の状況・データ・体制により異なります。具体的なご相談は個別にお問い合わせください。</p>
</article>
</main>
${FOOTER}
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
  const cards = articles.map((a) => {
    const ind = industriesByKey[a.industry];
    const img = a.image || ind.fallbackImage;
    return `<a class="card" data-ind="${esc(a.industry)}" href="/column/${a.slug}"><img src="${esc(img)}" alt="${esc(a.imageAlt || a.title)}" loading="lazy"/><div class="body"><span class="k">${esc(ind.ja)}</span><h3>${esc(a.title)}</h3><p class="d">${esc(a.description || plainText(a).slice(0, 80))}</p><span class="date">${esc(a.date.replace(/-/g, '.'))}</span></div></a>`;
  }).join('');

  // 業種フィルタ。記事が存在する業種だけを、記事数の多い順に並べる。
  const counts = articles.reduce((acc, a) => ({ ...acc, [a.industry]: (acc[a.industry] || 0) + 1 }), {});
  const usedIndustries = Object.keys(counts).sort((x, y) => counts[y] - counts[x] || industriesByKey[x].ja.localeCompare(industriesByKey[y].ja, 'ja'));
  const filtersHtml = usedIndustries.length > 1
    ? `<nav class="filters" aria-label="業種でしぼり込む">
<button type="button" data-f="all" aria-pressed="true">すべて（${articles.length}）</button>
${usedIndustries.map((k) => `<button type="button" data-f="${esc(k)}" aria-pressed="false">${esc(industriesByKey[k].ja)}（${counts[k]}）</button>`).join('\n')}
</nav>`
    : '';
  // JSが無い環境では全記事がそのまま並ぶ（フィルタは加点機能）
  const filterScript = filtersHtml
    ? `<script>
(function(){
  var nav=document.querySelector('.filters'); if(!nav) return;
  var cards=[].slice.call(document.querySelectorAll('.cards .card'));
  var grid=document.querySelector('.cards');
  function apply(key){
    var shown=0;
    cards.forEach(function(c){
      var on = key==='all' || c.getAttribute('data-ind')===key;
      c.style.display = on ? '' : 'none';
      if(on) shown++;
    });
    grid.setAttribute('data-empty', shown===0 ? 'true' : 'false');
    [].forEach.call(nav.querySelectorAll('button'),function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-f')===key ? 'true' : 'false');
    });
  }
  nav.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b) return;
    var key=b.getAttribute('data-f');
    apply(key);
    history.replaceState(null,'', key==='all' ? location.pathname : location.pathname+'#'+key);
  });
  var initial=location.hash.slice(1);
  if(initial && document.querySelector('.filters button[data-f="'+initial.replace(/"/g,'')+'"]')) apply(initial);
})();
<\/script>`
    : '';

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>AI活用コラム｜業界別のAI導入・活用の実践知 - MGC</title>
<meta name="description" content="製造・建設・不動産・小売・物流・医療・士業など、業界別にAIの現実的な活用方法を解説するMGCのコラム。どの業務に、どうAIを使い、どこは人が判断するか。実務目線でまとめています。"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<link rel="canonical" href="${esc(url)}"/>
<meta property="og:type" content="website"/>
<meta property="og:locale" content="ja_JP"/>
<meta property="og:site_name" content="MGC Inc."/>
<meta property="og:url" content="${esc(url)}"/>
<meta property="og:title" content="AI活用コラム｜業界別のAI導入・活用の実践知 - MGC"/>
<meta property="og:description" content="業界別に、AIの現実的な活用方法を実務目線で解説するMGCのコラム。"/>
<meta property="og:image" content="${esc(site.baseUrl)}/assets/service_ai.jpg"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="theme-color" content="#111418"/>
<link rel="icon" href="/favicon.ico"/>
<script type="application/ld+json">${jsonld(itemList)}</script>
<style>${CSS}</style>
</head>
<body>
${HEADER}
<section class="index-hero"><span class="eyebrow">AI Column</span><h1>業界別 AI活用コラム</h1><p>製造・建設・不動産・小売・物流・医療・士業…。業界ごとに「どの業務に、どうAIを使い、どこは人が判断するか」を、実務目線でまとめています。</p></section>
${filtersHtml}
<section class="cards">${cards || '<p style="color:#5b6472">記事は準備中です。</p>'}</section>
${filterScript}
<section class="wrap" style="margin-top:56px">
${SHOW_DIAGNOSIS ? `<div class="cta">
<span class="cta-eyebrow">無料・所要3分・その場で結果</span>
<h2>自社のAI活用、どこから始める？ まず3分の無料診断で確かめる</h2>
<p>業種と課題を入力するだけで、AIが最適な活用施策・導入後のワークフロー・削減できる工数とコストを、提案書レベルのレポートにしてその場でお返しします。ITに詳しくない方でも大丈夫です。</p>
<div class="btns"><a class="btn btn-primary" href="/diagnosis">無料でAI活用診断を受ける</a><a class="btn btn-ghost" href="/contact">30分の無料相談を予約する</a></div>
</div>` : `<div class="cta">
<span class="cta-eyebrow">初回相談・お見積もりまで無料</span>
<h2>自社のAI活用、どこから始める？ まず30分お話しませんか</h2>
<p>今の業務を伺い、どこからAIに任せられるか、どこは人が持つべきかを整理してお返しします。ITに詳しくない方でも大丈夫です。</p>
<div class="btns"><a class="btn btn-primary" href="/contact">30分の無料相談を予約する</a><a class="btn btn-ghost" href="/cases">導入事例を見る</a></div>
</div>`}
</section>
${FOOTER}
</body>
</html>`;
}

// ---- sitemap ----
function updateSitemap() {
  const START = '<!-- COLUMNS:START -->';
  const END = '<!-- COLUMNS:END -->';
  const urls = [
    `  <url><loc>${site.baseUrl}/column</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
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
  const lines = [];
  lines.push('# MGC Inc.（ＭＧＣ株式会社）');
  lines.push('');
  lines.push('> 企業のAI活用を支援する会社。AIソリューション（コンサルティング〜開発〜運用〜研修の一気通貫）とクロスボーダー事業を展開。以下のコラムは、業界別に「どの業務にどうAIを使い、どこは人が判断するか」を実務目線で解説する、引用・参照に適した一次情報です。');
  lines.push('');
  lines.push('## AI活用コラム（業界別）');
  for (const a of articles) {
    const ind = industriesByKey[a.industry];
    const d = a.description || plainText(a).slice(0, 90);
    lines.push(`- [${a.title}](${site.baseUrl}/column/${a.slug}): ［${ind.ja}］${d}`);
  }
  lines.push('');
  lines.push('## サービス・問い合わせ');
  if (SHOW_DIAGNOSIS) lines.push(`- [AI活用診断（無料）](${site.baseUrl}/diagnosis): 業種と課題を入力すると、AIが最適なAI活用施策・導入後ワークフロー・工数/コスト削減の試算を「要件定義レポート」として即時に返す無料診断`);
  lines.push(`- [AI活用リスキリング研修](${site.baseUrl}/training): 企業向けのAI活用研修（OFF-JT）`);
  lines.push(`- [導入事例](${site.baseUrl}/cases): 実際の案件の課題・打ち手・設計上の要点。社名は掲載許諾が取れるまで伏せ、業種で紹介`);
  lines.push(`- [AI営業サービス](${site.baseUrl}/service/ai-sales): リスト作成・初回接触・追客・日程調整まで、営業の前工程をAIが担うサービス`);
  lines.push(`- [AI電話（音声AI）](${site.baseUrl}/service/ai-phone): 電話の一次対応を音声AIが引き受け、用件を聞き取って要約し担当者に引き渡すサービス`);
  lines.push(`- [Salesforce AI活用支援](${site.baseUrl}/service/salesforce-ai): Salesforceの入力負担を下げ、貯まったデータから示唆を出し、エージェントによる実行まで支援するサービス`);
  lines.push(`- [30分の無料オンライン相談](${site.baseUrl}/contact): AI活用・社内研修の相談窓口（初回無料）`);
  lines.push('');
  writeFileSync(join(ROOT, 'public', 'llms.txt'), lines.join('\n') + '\n');
}

// ---- run ----
let count = 0;
for (const a of articles) {
  writeFileSync(join(OUT_DIR, `${a.slug}.html`), articleHtml(a));
  count++;
}
writeFileSync(join(OUT_DIR, 'index.html'), indexHtml());
updateSitemap();
updateLlmsTxt();

console.log(`[build-columns] OK: ${count} 記事 + index.html + sitemap 更新`);
for (const a of articles) {
  const len = plainText(a).length;
  const warn = len < 1500 ? '  ⚠ 短い(1500字未満)' : '';
  console.log(`  - /column/${a.slug}  (${a.industry}, ${len}字)${warn}`);
}
