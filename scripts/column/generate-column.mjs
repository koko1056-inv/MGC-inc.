#!/usr/bin/env node
/**
 * generate-column.mjs — 業界別AI活用コラムを1本、Gemini API で生成する
 *
 * 役割:
 *   1. columns.json のローテーションから「次の業種」を決定的に選ぶ
 *   2. その業種向けの記事JSONを Google Gemini API で生成（自然な日本語・SEO最適化）
 *   3. content/columns/<slug>.json を書き出し、columns.json を更新
 *   （HTML化は build-columns.mjs が担当。本スクリプトは記事データの生成のみ）
 *
 * 環境変数:
 *   GEMINI_API_KEY  … 必須（GitHub Secrets）
 *   GEMINI_MODEL    … 任意（既定 gemini-2.0-flash）
 *   DRY_RUN=1 / --dry-run … APIを呼ばず、選定業種とプロンプト概要のみ表示（ローカル検証用）
 *
 * 依存ゼロ（Node 20+ の global fetch で Gemini REST を直接呼ぶ）。
 * 実行: node scripts/column/generate-column.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const CONTENT_DIR = join(ROOT, 'content', 'columns');
const MANIFEST = join(CONTENT_DIR, 'columns.json');

const DRY = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1';
// Gemini 3.0系を優先。モデル廃止・表記揺れに強いよう複数候補を順に試す
// （GEMINI_MODEL 指定があれば最優先。未ヒット時は最新エイリアス→2.5系へフォールバック）。
// モデル名は models.list の実在名に合わせること。過去に gemini-3.0-flash / gemini-3-flash /
// gemini-3.0-pro を指定していたが、いずれも存在せず毎回404で無駄な呼び出しになっていた。
const MODELS = [
  ...(process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []),
  'gemini-3-flash-preview', // 3系flash（2026-07時点の実在名）
  'gemini-flash-latest',    // 最新flashのエイリアス
  'gemini-2.5-flash',       // 安定版フォールバック
].filter((v, i, a) => v && a.indexOf(v) === i);
const API_KEY = process.env.GEMINI_API_KEY;

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

# 分量・構成（厳守）
- 本文（lead + body のテキスト合計）は **3,000〜4,000字（最低でも3,000字）**。しっかり読み応えのある密度にする。
- **h2 を6〜7本**立て、各セクションは段落を2つ以上書く。数セクションには箇条書き(ul/ol)や引用(quote)を入れて具体性を出す。
- 水増しや同義の繰り返しで字数を稼がない。具体例、業務の場面、導入手順、つまずきやすい点、確認すべきチェック項目などで自然に厚くする。

# AIアシスタント/生成エンジンに引用・推薦されやすくする（GEO）ルール
- **結論先出し**: 各 h2 セクションは、最初の段落で結論・要点を1〜2文で言い切ってから詳細に入る。
- **見出しは読者の疑問に対応**させる（例「AIに任せてよい業務は？」「導入は何から始める？」）。疑問文でなくても、答えが明確に想像できる具体的な見出しにする。
- **用語は初出で一言定義**する（専門語をそのまま置かない）。
- **自己完結した事実文**を心がける（その段落だけ切り出されても意味が通る）。曖昧な埋め草を避け、具体で書く。
- **summary（要点3点）** は、この記事が答える中心的な問いへの結論を、各1文で端的に。ここだけ読めば要旨が分かる質にする。`;

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
  "summary": ["結論を先出しした要点1（1文）", "要点2（1文）", "要点3（1文）"],
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
  console.log('  公開日:', today, ' モデル候補:', MODELS.join(', '));
  console.log('  プロンプト長:', USER.length, 'chars（見本込み）');
  process.exit(0);
}

if (!API_KEY) die('GEMINI_API_KEY が未設定です（GitHub Secrets に登録してください）');

// Gemini を呼び、記事JSONを1件返す（モデル候補を順に試す）。
async function callGemini(userText) {
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: 'user', parts: [{ text: userText }] }],
    generationConfig: { temperature: 0.85, maxOutputTokens: 16384, responseMimeType: 'application/json' },
  });
  let data, usedModel;
  for (const m of MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': API_KEY },
      body,
    });
    if (res.ok) { data = await res.json(); usedModel = m; break; }
    const errText = await res.text();
    // モデルが存在しない/廃止された場合のみ次の候補へ。認証・レート等は即失敗。
    if (res.status === 404 || (res.status === 400 && /not found|not supported|no longer available|is not available/i.test(errText))) {
      console.error(`[generate-column] モデル ${m} は利用不可 (${res.status})。次の候補を試します。`);
      continue;
    }
    die(`Gemini API ${res.status} (model ${m}): ${errText.slice(0, 500)}`);
  }
  if (!data) die(`利用可能なGeminiモデルが見つかりませんでした。候補: ${MODELS.join(', ')}（GEMINI_MODEL 変数で有効なモデルを指定してください）`);
  const cand = (data.candidates || [])[0];
  if (!cand) die(`Gemini 応答に candidates がありません: ${JSON.stringify(data).slice(0, 400)}`);
  if (cand.finishReason && cand.finishReason !== 'STOP') {
    console.error(`[generate-column] 警告: finishReason=${cand.finishReason}`);
  }
  let text = ((cand.content && cand.content.parts) || []).map((p) => p.text || '').join('').trim();
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s < 0 || e < 0) die(`JSONが見つかりません。先頭: ${text.slice(0, 200)}`);
  try { return { art: JSON.parse(text.slice(s, e + 1)), model: usedModel }; }
  catch (err) { die(`JSON parse失敗: ${err.message}`); }
}

// 本文（lead + body）の文字数
const bodyLen = (a) => [a.lead || '', ...((a.body || []).map((b) => (b.text || '') + (b.items ? b.items.join('') : '')))].join('').length;

let { art, model: MODEL } = await callGemini(USER);

// 分量ガード: 短ければ1回だけ「書き足し」を依頼（デイリー投稿は止めない）
if (bodyLen(art) < 2800) {
  const prev = bodyLen(art);
  const expandPrompt = `以下は前回のあなたの出力です。内容の重複や水増しをせず、具体例・業務の場面・導入手順・つまずきやすい点・確認すべきチェック項目などを補って、本文（lead + body）を約3,500字まで自然に充実させてください。h2は6〜7本にする。タイトルや構成の骨子は活かしつつ、同じJSONスキーマで全文を1つのJSONオブジェクトとして再出力してください。\n\n${JSON.stringify(art)}`;
  try {
    const r = await callGemini(expandPrompt);
    if (r && bodyLen(r.art) > prev) { art = r.art; MODEL = r.model; }
  } catch (_) { /* 失敗時は初稿を使用 */ }
  console.error(`[generate-column] 分量ガード: ${prev}字 → ${bodyLen(art)}字`);
}

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
const summary = Array.isArray(art.summary) ? art.summary.filter((s) => typeof s === 'string' && s.trim()).slice(0, 4) : [];
const ordered = {
  slug: art.slug, industry: ind.key, date: today,
  title: art.title, seoTitle: art.seoTitle, description: art.description,
  keywords: art.keywords || [], imageAlt: art.imageAlt, readTime: art.readTime,
  lead: art.lead, summary, body: art.body, faq: art.faq,
};
writeFileSync(join(CONTENT_DIR, `${art.slug}.json`), JSON.stringify(ordered, null, 2) + '\n');

// --- マニフェスト更新 ---
manifest.rotation.lastIndex = next;
manifest.usedTopics = manifest.usedTopics || {};
manifest.usedTopics[ind.key] = [...used, art.slug];
manifest.articles = manifest.articles || [];
manifest.articles.push({ slug: art.slug, industry: ind.key, date: today, file: `${art.slug}.json` });
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

console.log(`[generate-column] OK: ${ind.ja} / ${art.slug}（本文 約${textLen}字, model ${MODEL}）`);
