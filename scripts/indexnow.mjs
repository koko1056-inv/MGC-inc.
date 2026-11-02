// IndexNow で、検索エンジン（Bing など。Bing の索引は ChatGPT 検索などでも使われる）に更新したURLを知らせる。
// 使い方: node scripts/indexnow.mjs            … サイトマップの全URLを送る
//         node scripts/indexnow.mjs /guide /glossary … 指定したパスだけ送る
// 本番にデプロイされた後に実行する（キーのファイル https://mgc-global01.com/7ad72b2fab3951558d1d7e62ceb10986.txt が公開されている必要がある）。
// キーは公開してよい値（所有確認のためのもので、秘密情報ではない）。
import { readFileSync } from 'node:fs';

const HOST = 'mgc-global01.com';
const KEY = '7ad72b2fab3951558d1d7e62ceb10986';
const args = process.argv.slice(2);
const urls = args.length
  ? args.map((p) => `https://${HOST}${p.startsWith('/') ? p : '/' + p}`)
  : [...readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} URL → HTTP ${res.status}`);
if (!res.ok && res.status !== 202) process.exitCode = 1;
