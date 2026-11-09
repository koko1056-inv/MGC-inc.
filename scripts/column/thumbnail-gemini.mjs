// コラムの個別サムネイルを Gemini の画像生成で作り、決まったサイズ・形式で置く（日次の自動投稿・Column Thumbnail 用）。
// プロンプトは thumbnail-prompt.mjs（画風は固定、場所と場面だけ記事で変わる）、書き出しは thumbnail.mjs。
// 記事 JSON の "image" が無い（業種の予備画像を使っている）記事だけを対象にする。--force で作り直す。
//
// 使い方: GEMINI_API_KEY=... node scripts/column/thumbnail-gemini.mjs <slug> [<slug>...] [--force]
//        GEMINI_API_KEY=... node scripts/column/thumbnail-gemini.mjs --latest   … 最新の記事1本
// 失敗しても記事の公開は止めない（呼び出し側は continue-on-error。画像が無ければ業種の予備画像が使われる）。
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promptFor, loadArticle } from './thumbnail-prompt.mjs';
import { writeThumbnail } from './thumbnail.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CONTENT = join(ROOT, 'content', 'columns');
const API_KEY = process.env.GEMINI_API_KEY;
const MODELS = [
  ...(process.env.GEMINI_IMAGE_MODEL ? [process.env.GEMINI_IMAGE_MODEL] : []),
  'gemini-2.5-flash-image',
  'gemini-2.5-flash-image-preview',
].filter((v, i, a) => a.indexOf(v) === i);

async function generate(prompt) {
  const body = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } },
  });
  for (const m of MODELS) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': API_KEY }, body,
    });
    const text = await res.text();
    if (!res.ok) {
      if (res.status === 404 || (res.status === 400 && /not found|not supported|is not available/i.test(text))) { console.error(`[thumbnail-gemini] モデル ${m} は利用不可 (${res.status})`); continue; }
      throw new Error(`Gemini API ${res.status} (model ${m}): ${text.slice(0, 300)}`);
    }
    const parts = JSON.parse(text).candidates?.[0]?.content?.parts || [];
    const img = parts.find((p) => p.inlineData?.data);
    if (!img) throw new Error(`画像が返らなかった (model ${m}): ${text.slice(0, 300)}`);
    return { buf: Buffer.from(img.inlineData.data, 'base64'), model: m };
  }
  throw new Error(`利用できる画像モデルがない: ${MODELS.join(', ')}`);
}

// 記事 JSON に image を書き足す（キーの並びは imageAlt の直後）
function setImage(slug) {
  const p = join(CONTENT, `${slug}.json`);
  const a = JSON.parse(readFileSync(p, 'utf8'));
  const out = {};
  for (const [k, v] of Object.entries(a)) { if (k === 'image') continue; out[k] = v; if (k === 'imageAlt') out.image = `/assets/column/${slug}.webp`; }
  if (!out.image) out.image = `/assets/column/${slug}.webp`;
  writeFileSync(p, JSON.stringify(out, null, 2) + '\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  let slugs = args.filter((x) => !x.startsWith('--'));
  if (args.includes('--latest')) {
    const m = JSON.parse(readFileSync(join(CONTENT, 'columns.json'), 'utf8'));
    slugs = [m.articles[m.articles.length - 1].slug];
  }
  if (!API_KEY) { console.error('[thumbnail-gemini] GEMINI_API_KEY が未設定'); process.exit(1); }
  let bad = 0;
  for (const slug of slugs) {
    const a = loadArticle(slug);
    if (a.image && !force) { console.log(`[thumbnail-gemini] ${slug}: 個別画像あり（スキップ）`); continue; }
    try {
      const { buf, model } = await generate(promptFor(a));
      await writeThumbnail(slug, buf);
      setImage(slug);
      console.log(`[thumbnail-gemini] ${slug}: OK (${model}, ${Math.round(buf.length / 1024)}KB)`);
    } catch (e) { console.error(`[thumbnail-gemini] ${slug}: ${e.message}`); bad++; }
  }
  process.exitCode = bad ? 1 : 0;
}
