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
import { factCheck } from './fact-check.mjs';

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

// 文体の見本（この構造・トーンに厳密に合わせる）。標準は docs/seo-aio/column-style-guide.md
const exemplarPath = join(CONTENT_DIR, 'ai-training-selection-checklist.json');
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

# 分量・構成（厳守。docs/seo-aio/column-style-guide.md の型）
- 本文（lead + body のテキスト合計）は **2,000〜3,000字**。水増しや同義の繰り返しで字数を稼がない。
- タイトルは「テーマ — 読者が得るもの」の形（全角ダッシュで2つに分ける）。
- body の順番: ①前提の節（「まず決めること：…」）→ ②観点の節を4〜5本（見出しは「チェックリストN：…」など番号＋観点。各節は「確認項目の ul（3〜4項目、『〜か』で終わる問いの形）→ なぜ大事かの段落」）→ ③「MGCの…の場合」の節 → ④ links ブロック → ⑤「まとめ」の節（1段落、要約のみ）。
- 文体はです・ます調、1文40〜60字、1段落2〜4文。h3 は使わない。quote は1回まで。
- 「MGCの…の場合」に書いてよいのはサイトに公開済みの事実だけ（AIソリューションの PoC は100〜300万円が目安・本番導入は個別見積もり、パイロット運用2〜4週間・本番運用1〜3ヶ月が目安、研修は1名398,000円（税込）・標準20時間、初回相談・お見積もりまで無料、専門チームが一貫して担当）。新しい数字・事例・社名・お客様の声は書かない。期間は公開済みの目安（パイロット運用＝PoC 2〜4週間、本番運用1〜3ヶ月）だけを書く。links の desc やMGCの節に「構築事例」「導入実績」など、事例や実績があるような表現を書かない。効果の割合（%・割）や、公開されていない金額は書かない。

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
  "seoTitle": "検索向けタイトル（60字以内、業界×AIのキーワードを前寄せ、末尾に - ＭＧＣ株式会社）",
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
    { "type": "quote", "text": "一文で刺さる要点" },
    { "type": "links", "items": [{ "href": "/works/ai-solutions", "label": "AIソリューション", "desc": "一言の説明" }, { "href": "/pricing", "label": "料金の考え方", "desc": "一言の説明" }] }
  ],
  "faq": [
    { "q": "その業界の顧客が実際に気にする質問", "a": "誠実で具体的な回答（会話調）" }
  ]
}
# body の作り方: 上の「分量・構成」の順番どおり。links の href はサイト内のパス（/training、/pricing、/works/ai-solutions、/service/ai-sales、/service/ai-phone、/service/salesforce-ai、/guide のいずれか）。faq は3問で、1問は「MGCではできるか」に公開済みの事実の範囲で答える。`;

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

// 同じ日に2本出さない（手動実行と定時実行が重なった場合など）。FORCE=1 で無視できる。
const rotationKeys = new Set(inds.map((i) => i.key));
const todays = (manifest.articles || []).find((a) => a.date === today && rotationKeys.has(a.industry));
if (todays && process.env.FORCE !== '1') {
  console.log(`[generate-column] 本日（${today}）の自動投稿は公開済みのためスキップ: ${todays.slug}`);
  process.exit(0);
}

// 生成元: OPENAI_API_KEY があれば OpenAI、無ければ Gemini（2026-11 に Gemini のクレジットが切れたため OpenAI に切り替えられるようにした）
const PROVIDER = process.env.OPENAI_API_KEY ? 'openai' : 'gemini';
if (PROVIDER === 'gemini' && !API_KEY) die('OPENAI_API_KEY も GEMINI_API_KEY も未設定です（GitHub Secrets に登録してください）');
console.error(`[generate-column] 生成元: ${PROVIDER}`);

// 応答テキストから、最初の完結したJSONオブジェクトだけを取り出す（文字列内の括弧・エスケープを考慮）。
// 2026-11-03 にオブジェクトの後ろへ余分な文字が付いた応答で JSON.parse が失敗し、その日の投稿が止まったための対策。
export function extractJsonObject(text) {
  const s = text.indexOf('{');
  if (s < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = s; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return text.slice(s, i + 1);
  }
  return null;
}

// Gemini を呼び、記事JSONを1件返す（モデル候補を順に試す）。失敗は例外で返し、呼び出し側で再試行する。
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
    throw new Error(`Gemini API ${res.status} (model ${m}): ${errText.slice(0, 500)}`);
  }
  if (!data) throw new Error(`利用可能なGeminiモデルが見つかりませんでした。候補: ${MODELS.join(', ')}（GEMINI_MODEL 変数で有効なモデルを指定してください）`);
  const cand = (data.candidates || [])[0];
  if (!cand) throw new Error(`Gemini 応答に candidates がありません: ${JSON.stringify(data).slice(0, 400)}`);
  if (cand.finishReason && cand.finishReason !== 'STOP') {
    console.error(`[generate-column] 警告: finishReason=${cand.finishReason}`);
  }
  let text = ((cand.content && cand.content.parts) || []).map((p) => p.text || '').join('').trim();
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const json = extractJsonObject(text);
  if (!json) throw new Error(`JSONが見つかりません（finishReason=${cand.finishReason}）。先頭: ${text.slice(0, 200)}`);
  try { return { art: JSON.parse(json), model: usedModel }; }
  catch (err) { throw new Error(`JSON parse失敗: ${err.message}`); }
}

// OpenAI（Chat Completions、JSON 出力）で記事JSONを1件返す。モデルは OPENAI_MODEL 変数、無ければ候補を順に試す
const OPENAI_MODELS = [
  ...(process.env.OPENAI_MODEL ? [process.env.OPENAI_MODEL] : []),
  'gpt-5-mini',
  'gpt-4.1-mini',
].filter((v, i, a) => v && a.indexOf(v) === i);
async function callOpenAI(userText) {
  for (const m of OPENAI_MODELS) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: m, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: userText }], response_format: { type: 'json_object' } }),
    });
    const text = await res.text();
    if (!res.ok) {
      if (res.status === 404 || /model_not_found|does not exist/i.test(text)) { console.error(`[generate-column] モデル ${m} は利用不可 (${res.status})。次の候補を試します。`); continue; }
      throw new Error(`OpenAI API ${res.status} (model ${m}): ${text.slice(0, 500)}`);
    }
    const content = JSON.parse(text).choices?.[0]?.message?.content || '';
    const json = extractJsonObject(content);
    if (!json) throw new Error(`JSONが見つかりません。先頭: ${content.slice(0, 200)}`);
    try { return { art: JSON.parse(json), model: m }; }
    catch (err) { throw new Error(`JSON parse失敗: ${err.message}`); }
  }
  throw new Error(`利用可能なOpenAIモデルが見つかりませんでした。候補: ${OPENAI_MODELS.join(', ')}（OPENAI_MODEL 変数で指定してください）`);
}

// 生成を最大 tries 回まで試す（JSONの崩れ・一時的なAPIエラーで日次投稿を止めない）。
// 認証・課金のエラー（401/402/403）は再試行しても直らないため即失敗。
async function generate(userText, tries = 3) {
  let last;
  for (let i = 1; i <= tries; i++) {
    try { return await (PROVIDER === 'openai' ? callOpenAI(userText) : callGemini(userText)); }
    catch (err) {
      last = err;
      console.error(`[generate-column] 生成 ${i}/${tries} 回目に失敗: ${err.message}`);
      if (/(Gemini|OpenAI) API (401|402|403|429 [\s\S]*insufficient_quota)/.test(err.message)) break; // 認証・課金のエラーは再試行しても直らない
      if (i < tries) await new Promise((r) => setTimeout(r, 5000 * i));
    }
  }
  throw last;
}

// 本文（lead + body）の文字数
const bodyLen = (a) => [a.lead || '', ...((a.body || []).map((b) => (b.text || '') + (b.items ? b.items.map((i) => (typeof i === 'string' ? i : `${i.label || ''}${i.desc || ''}`)).join('') : '')))].join('').length;

let art, MODEL;
try { ({ art, model: MODEL } = await generate(USER)); }
catch (err) { die(err.message); }

// 分量ガード: 短ければ1回だけ「書き足し」を依頼（デイリー投稿は止めない）
if (bodyLen(art) < 1800) {
  const prev = bodyLen(art);
  const expandPrompt = `以下は前回のあなたの出力です。内容の重複や水増しをせず、具体例・業務の場面・導入手順・つまずきやすい点・確認すべきチェック項目などを補って、本文（lead + body）を約2,500字まで自然に充実させてください。構成の型（前提の節 → 観点の節4〜5本 → MGCの場合 → links → まとめ）は保ってください。タイトルや構成の骨子は活かしつつ、同じJSONスキーマで全文を1つのJSONオブジェクトとして再出力してください。\n\n${JSON.stringify(art)}`;
  try {
    const r = await generate(expandPrompt, 2);
    if (r && bodyLen(r.art) > prev) { art = r.art; MODEL = r.model; }
  } catch (_) { /* 失敗時は初稿を使用 */ }
  console.error(`[generate-column] 分量ガード: ${prev}字 → ${bodyLen(art)}字`);
}

// 事実の検査: 公開済みのMGCの事実から外れた表現（未公開の金額・出典のない割合・事例や実績の表現など）があれば、
// 指摘を添えて最大2回まで直させる。それでも残る場合は公開しない（誤った事実を出すより、その日の投稿を止める）。
for (let round = 1; ; round++) {
  const issues = factCheck(art);
  if (!issues.length) break;
  console.error(`[generate-column] 事実の検査で指摘 ${issues.length} 件（${round}回目）:\n  - ${issues.join('\n  - ')}`);
  if (round > 2) die('事実の検査を通らないため公開を中止しました');
  const fixPrompt = `以下は前回のあなたの出力です。次の指摘をすべて直してください。指摘された箇所は、公開済みの事実だけで書き直すか、削除してください。数字・事例・実績を新しく作らないでください。それ以外の内容と構成は変えず、同じJSONスキーマで全文を1つのJSONオブジェクトとして再出力してください。\n\n# 指摘\n- ${issues.join('\n- ')}\n\n# 前回の出力\n${JSON.stringify(art)}`;
  try { ({ art, model: MODEL } = await generate(fixPrompt, 2)); }
  catch (err) { die(`事実の検査の修正に失敗: ${err.message}`); }
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
const textLen = [art.lead || '', ...art.body.map((b) => (b.text || '') + (b.items ? b.items.map((i) => (typeof i === 'string' ? i : `${i.label || ''}${i.desc || ''}`)).join('') : ''))].join('').length;
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
