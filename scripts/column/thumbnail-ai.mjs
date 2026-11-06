// コラムの個別サムネイルを画像生成APIで作り、決まったサイズ・形式で置く（日次の自動投稿・Column Thumbnail 用）。
// 生成元: OPENAI_API_KEY があれば OpenAI の画像生成（既定）、無ければ Gemini。
// 手元（Claude のセッション）で作るときは Higgsfield の gpt_image_2_5 で同じプロンプトを使う（column-style-guide.md）。
// プロンプトは thumbnail-prompt.mjs（画風は固定、場所と場面だけ記事で変わる）、書き出しは thumbnail.mjs。
// 記事 JSON の "image" が無い（業種の予備画像を使っている）記事だけを対象にする。--force で作り直す。
//
// 使い方: OPENAI_API_KEY=... node scripts/column/thumbnail-ai.mjs <slug> [<slug>...] [--force]
//        OPENAI_API_KEY=... node scripts/column/thumbnail-ai.mjs --latest   … 最新の記事1本
// 失敗しても記事の公開は止めない（呼び出し側は continue-on-error。画像が無ければ業種の予備画像が使われる）。
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promptFor, loadArticle } from './thumbnail-prompt.mjs';
import { writeThumbnail } from './thumbnail.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CONTENT = join(ROOT, 'content', 'columns');
const API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const PROVIDER = OPENAI_KEY ? 'openai' : 'gemini';
const OPENAI_IMAGE_MODELS = [
  ...(process.env.OPENAI_IMAGE_MODEL ? [process.env.OPENAI_IMAGE_MODEL] : []),
  'gpt-image-1',
].filter((v, i, a) => a.indexOf(v) === i);
const MODELS = [
  ...(process.env.GEMINI_IMAGE_MODEL ? [process.env.GEMINI_IMAGE_MODEL] : []),
  'gemini-2.5-flash-image',
  'gemini-2.5-flash-image-preview',
].filter((v, i, a) => a.indexOf(v) === i);

// OpenAI の画像生成（横長 1536×1024 → thumbnail.mjs が 16:9 に切り抜く）
async function generateOpenAI(prompt) {
  for (const m of OPENAI_IMAGE_MODELS) {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model: m, prompt, size: '1536x1024', quality: 'medium', n: 1 }),
    });
    const text = await res.text();
    if (!res.ok) {
      if (res.status === 404 || /model_not_found|does not exist/i.test(text)) { console.error(`[thumbnail-ai] モデル ${m} は利用不可 (${res.status})`); continue; }
      throw new Error(`OpenAI API ${res.status} (model ${m}): ${text.slice(0, 300)}`);
    }
    const d = JSON.parse(text).data?.[0] || {};
    if (d.b64_json) return { buf: Buffer.from(d.b64_json, 'base64'), model: m };
    if (d.url) return { buf: Buffer.from(await (await fetch(d.url)).arrayBuffer()), model: m };
    throw new Error(`画像が返らなかった (model ${m}): ${text.slice(0, 300)}`);
  }
  throw new Error(`利用できる画像モデルがない: ${OPENAI_IMAGE_MODELS.join(', ')}（OPENAI_IMAGE_MODEL 変数で指定）`);
}

async function generate(prompt) {
  if (PROVIDER === 'openai') return generateOpenAI(prompt);
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
      if (res.status === 404 || (res.status === 400 && /not found|not supported|is not available/i.test(text))) { console.error(`[thumbnail-ai] モデル ${m} は利用不可 (${res.status})`); continue; }
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
  if (!OPENAI_KEY && !API_KEY) { console.error('[thumbnail-ai] OPENAI_API_KEY も GEMINI_API_KEY も未設定'); process.exit(1); }
  console.error(`[thumbnail-ai] 生成元: ${PROVIDER}`);
  let bad = 0;
  for (const slug of slugs) {
    const a = loadArticle(slug);
    if (a.image && !force) { console.log(`[thumbnail-ai] ${slug}: 個別画像あり（スキップ）`); continue; }
    try {
      const { buf, model } = await generate(promptFor(a));
      await writeThumbnail(slug, buf);
      setImage(slug);
      console.log(`[thumbnail-ai] ${slug}: OK (${model}, ${Math.round(buf.length / 1024)}KB)`);
    } catch (e) { console.error(`[thumbnail-ai] ${slug}: ${e.message}`); bad++; }
  }
  process.exitCode = bad ? 1 : 0;
}
