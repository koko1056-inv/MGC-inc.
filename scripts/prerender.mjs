// ビルド後に主要ページを静的HTMLとして書き出す（プリレンダリング）。
//
// なぜ: サイトはSPAのため、SNSや検索のクローラはどのURLでもトップの title / OGP しか
// 受け取れなかった。ここでページごとに本文と <head> を埋めたHTMLを作り、
// ブラウザ側はそれを引き継いで動かす（index.tsx の hydrateRoot）。
//
// 前提: `vite build`（ブラウザ用）と `vite build --ssr entry-server.tsx`（dist-ssr）の後に実行する。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { render, routes, llmsFull, splitLangPath, localizePath, SITE_ORIGIN, siteJsonLdEn } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

// 器となるHTML。再実行時は index.html が事前描画済みなので、先に保存した 200.html を使う
const shellPath = path.join(dist, '200.html');
const indexPath = path.join(dist, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');
const template = indexHtml.includes('<div id="root"></div>') ? indexHtml : fs.readFileSync(shellPath, 'utf-8');

// vercel.json に、事前描画したページへの書き換えがあるかを確かめる。
// 無いまま出すと、そのURLは 200.html（空の器）で配信され、事前描画が効かない。
// 注意: cleanUrls は使わない。有効にすると .html / .ts 宛ての書き換え（/column, /api 等）が404になった（PR #46 で取り消し）。
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf-8'));
if (vercel.cleanUrls) throw new Error('vercel.json の cleanUrls は使わない（既存の書き換えが壊れる）');
const rewrites = vercel.rewrites ?? [];
const matchRewrite = (route) => rewrites.find((r) => {
  const re = new RegExp('^' + r.source.replace(/:[a-z]+/g, '[^/]+') + '$');
  return re.test(route) && r.destination.endsWith('.html') && r.source !== '/(.*)';
});
const missing = routes().filter((r) => r !== '/' && !matchRewrite(r));
if (missing.length) throw new Error(`vercel.json に書き換えが無いページ: ${missing.join(', ')}`);

// 事前描画しないURL（/contact/thanks など）向けの空の器。vercel.json のフォールバック先
if (!template.includes('<div id="root"></div>')) throw new Error('空の器が見つからない。先に vite build を実行する');
fs.writeFileSync(shellPath, template);

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const setAttr = (html, re, value) => {
  if (!re.test(html)) throw new Error(`テンプレートに見つからない: ${re}`);
  return html.replace(re, (_, a, b) => `${a}${esc(value)}${b}`);
};

// 日本語版と英語版の対応（hreflang）。両方を事前描画するページだけに付ける
const routeSet = new Set(routes());
const absUrl = (p) => `${SITE_ORIGIN}${p}`;
const pairOf = (route) => {
  const { path: base } = splitLangPath(route);
  const ja = base, en = localizePath(base, 'en');
  return routeSet.has(ja) && routeSet.has(en) ? { ja, en } : null;
};
const hreflangTags = (pair) => [
  `<link rel="alternate" hreflang="ja" href="${absUrl(pair.ja)}" />`,
  `<link rel="alternate" hreflang="en" href="${absUrl(pair.en)}" />`,
  `<link rel="alternate" hreflang="x-default" href="${absUrl(pair.ja)}" />`,
].join('\n    ');

let count = 0;
// 404.html は Vercel が「どの書き換えにも当たらないURL」に 404 で返すページ。書き換え不要
const NOT_FOUND = '/404';
for (const route of [...routes(), NOT_FOUND]) {
  const { html, meta, jsonLd, lang } = render(route);
  let out = template;
  if (lang === 'en') {
    // 共通の会社・サイト情報（index.html の先頭2つの JSON-LD）を英語版に置き換える
    const blocks = [...out.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].slice(0, 2);
    const [orgJa, siteJa] = blocks.map((m) => JSON.parse(m[1]));
    if (orgJa?.['@type'] !== 'Organization' || siteJa?.['@type'] !== 'WebSite') throw new Error('index.html の Organization・WebSite が見つからない');
    const { org, site } = siteJsonLdEn(orgJa, siteJa);
    out = out.replace(blocks[0][0], `<script type="application/ld+json">${JSON.stringify(org, null, 2).replace(/</g, '\\u003c')}</script>`)
      .replace(blocks[1][0], `<script type="application/ld+json">${JSON.stringify(site, null, 2).replace(/</g, '\\u003c')}</script>`);
    out = out.replace('<html lang="ja">', '<html lang="en">')
      .replace('<meta property="og:locale" content="ja_JP" />', '<meta property="og:locale" content="en_US" />')
      .replace('<meta property="og:locale:alternate" content="en_US" />', '<meta property="og:locale:alternate" content="ja_JP" />');
  }
  const pair = route === NOT_FOUND ? null : pairOf(route);
  if (pair && !meta.noindex) out = out.replace('</head>', `    ${hreflangTags(pair)}\n  </head>`);
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  out = setAttr(out, /(<meta name="description" content=")[^"]*(")/, meta.description);
  out = setAttr(out, /(<link rel="canonical" href=")[^"]*(")/, meta.url);
  out = setAttr(out, /(<meta property="og:url" content=")[^"]*(")/, meta.url);
  out = setAttr(out, /(<meta property="og:title" content=")[^"]*(")/, meta.title);
  out = setAttr(out, /(<meta property="og:description" content=")[^"]*(")/, meta.description);
  out = setAttr(out, /(<meta property="og:image" content=")[^"]*(")/, meta.image);
  // og:image:width/height: 共有画像（/assets/og/）は 1200×630 のまま。記事画像などは実寸を読んで入れる（読めなければ消す）
  if (!meta.image.includes('/assets/og/')) {
    let size = null;
    try {
      const file = path.join(dist, new URL(meta.image).pathname);
      const m = await sharp(file).metadata();
      if (m.width && m.height) size = m;
    } catch { /* 読めない画像はサイズ指定を消す */ }
    out = size
      ? out.replace(/(<meta property="og:image:width" content=")\d+(")/, `$1${size.width}$2`).replace(/(<meta property="og:image:height" content=")\d+(")/, `$1${size.height}$2`)
      : out.replace(/\s*<meta property="og:image:(width|height)" content="\d+" \/>/g, '');
  }
  out = setAttr(out, /(<meta name="twitter:url" content=")[^"]*(")/, meta.url);
  out = setAttr(out, /(<meta name="twitter:title" content=")[^"]*(")/, meta.title);
  out = setAttr(out, /(<meta name="twitter:description" content=")[^"]*(")/, meta.description);
  out = setAttr(out, /(<meta name="twitter:image" content=")[^"]*(")/, meta.image);
  if (route !== '/' && route !== '/en') out = out.replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="article" />');
  if (meta.noindex) out = setAttr(out, /(<meta name="robots" content=")[^"]*(")/, 'noindex');
  const ld = jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n    ');
  if (ld) out = out.replace('</head>', `    ${ld}\n  </head>`);
  if (!out.includes('<div id="root"></div>')) throw new Error('テンプレートに <div id="root"></div> が無い');
  // 英語版のページでは、本文中のサイト内リンクも英語版の URL に（React の部品が直書きしているリンクも含めて）
  const body = lang === 'en'
    ? html.replace(/href="(\/[^"#?]*)([#?][^"]*)?"/g, (all, p, rest = '') => `href="${localizePath(p, 'en')}${rest}"`)
    : html;
  out = out.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  count++;
  console.log(`  prerender ${route.padEnd(24)} → ${path.relative(dist, file)}  (${Math.round(out.length / 1024)}KB)`);
}
console.log(`事前描画: ${count}ページ`);

// AIアシスタント向けの全文（サイトのデータから生成。要約は public/llms.txt）
fs.writeFileSync(path.join(dist, 'llms-full.txt'), llmsFull());
console.log(`llms-full.txt: ${Math.round(fs.statSync(path.join(dist, 'llms-full.txt')).size / 1024)}KB`);

// コラムへのリンク切れを検査する（サービスページの「関連するコラム」等）
const columnDir = path.join(dist, 'column');
const deadColumns = new Set();
for (const route of [...routes(), NOT_FOUND]) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  for (const [, slug] of fs.readFileSync(path.join(dist, file), 'utf-8').matchAll(/href="\/column\/([a-z0-9-]+)"/g)) {
    if (!fs.existsSync(path.join(columnDir, `${slug}.html`))) deadColumns.add(`${route} → /column/${slug}`);
  }
}
if (deadColumns.size) throw new Error(`存在しないコラムへのリンク: ${[...deadColumns].join(', ')}`);

// サイトマップに英語版を足し、日本語版と英語版を hreflang（xhtml:link）で結ぶ（配信する dist の sitemap.xml だけを書き換える）
{
  const file = path.join(dist, 'sitemap.xml');
  let xml = fs.readFileSync(file, 'utf-8');
  const XHTML = 'xmlns:xhtml="http://www.w3.org/1999/xhtml"';
  if (!xml.includes(XHTML)) xml = xml.replace('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"', `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        ${XHTML}`);
  const enBlocks = [];
  for (const route of routes()) {
    const { lang } = splitLangPath(route);
    const pair = pairOf(route);
    if (lang !== 'ja' || !pair || render(route).meta.noindex) continue;
    const jaLoc = absUrl(pair.ja);
    const re = new RegExp(`<url>(\\s*<loc>${jaLoc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>[\\s\\S]*?)</url>`);
    const m = xml.match(re);
    if (!m) continue;
    const links = `\n    <xhtml:link rel="alternate" hreflang="ja" href="${jaLoc}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${absUrl(pair.en)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${jaLoc}"/>`;
    const body = m[1].replace(/\s*<image:image>[\s\S]*?<\/image:image>/g, '').replace(/\s*$/, '');
    xml = xml.replace(m[0], `<url>${m[1].replace(/\s*$/, '')}${links}\n  </url>`);
    enBlocks.push(`  <url>${body.replace(`<loc>${jaLoc}</loc>`, `<loc>${absUrl(pair.en)}</loc>`)}${links}\n  </url>`);
  }
  xml = xml.replace('</urlset>', `  <!-- EN:START（英語版。prerender.mjs が生成） -->\n${enBlocks.join('\n')}\n  <!-- EN:END -->\n</urlset>`);
  fs.writeFileSync(file, xml);
  console.log(`sitemap.xml: 英語版 ${enBlocks.length} URL を追加`);
}

// サイトマップの載せ漏れを検査する（検索に出すページはすべて載せる）
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf-8');
const unlisted = routes().filter((r) => !render(r).meta.noindex && !sitemap.includes(`<loc>${render(r).meta.url.replace(/\/$/, '')}${r === '/' ? '/' : ''}</loc>`));
if (unlisted.length) throw new Error(`public/sitemap.xml に載っていないページ: ${unlisted.join(', ')}`);
