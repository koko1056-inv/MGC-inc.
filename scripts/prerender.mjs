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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { render, routes } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

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

let count = 0;
for (const route of routes()) {
  const { html, meta, jsonLd } = render(route);
  let out = template;
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  out = setAttr(out, /(<meta name="description" content=")[^"]*(")/, meta.description);
  out = setAttr(out, /(<link rel="canonical" href=")[^"]*(")/, meta.url);
  out = setAttr(out, /(<meta property="og:url" content=")[^"]*(")/, meta.url);
  out = setAttr(out, /(<meta property="og:title" content=")[^"]*(")/, meta.title);
  out = setAttr(out, /(<meta property="og:description" content=")[^"]*(")/, meta.description);
  out = setAttr(out, /(<meta property="og:image" content=")[^"]*(")/, meta.image);
  out = setAttr(out, /(<meta name="twitter:url" content=")[^"]*(")/, meta.url);
  out = setAttr(out, /(<meta name="twitter:title" content=")[^"]*(")/, meta.title);
  out = setAttr(out, /(<meta name="twitter:description" content=")[^"]*(")/, meta.description);
  out = setAttr(out, /(<meta name="twitter:image" content=")[^"]*(")/, meta.image);
  if (route !== '/') out = out.replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="article" />');
  const ld = jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n    ');
  if (ld) out = out.replace('</head>', `    ${ld}\n  </head>`);
  if (!out.includes('<div id="root"></div>')) throw new Error('テンプレートに <div id="root"></div> が無い');
  out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  count++;
  console.log(`  prerender ${route.padEnd(24)} → ${path.relative(dist, file)}  (${Math.round(out.length / 1024)}KB)`);
}
console.log(`事前描画: ${count}ページ`);
