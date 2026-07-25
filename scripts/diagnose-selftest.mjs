#!/usr/bin/env node
/**
 * diagnose-selftest.mjs — /api/diagnose のGemini呼び出しを切り分けるための一時的な自己診断。
 *
 * 目的: 本番で全モデルが400を返す原因が
 *   (A) APIキーが無効        … 正常キーでも同じ形の呼び出しが400になるか
 *   (B) リクエストの形が不正  … 形を変えると成功するか
 * のどちらかを確定させる。
 *
 * 実行: GEMINI_API_KEY=xxx node scripts/diagnose-selftest.mjs
 * キーは出力しない。エラーは先頭300字だけ表示する。
 */
import { GoogleGenAI } from '@google/genai';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error('GEMINI_API_KEY がありません');
  process.exit(1);
}
console.log(`キー長: ${KEY.length}（値は出力しません）`);

const MODEL = 'gemini-2.5-flash'; // 確実に存在するモデルで形の違いだけを見る
const PROMPT = '次のJSONだけを返してください: {"ok": true}';
const CONFIG = { temperature: 0.6, maxOutputTokens: 256, responseMimeType: 'application/json' };

const show = (label, err) => {
  const msg = String(err?.message || err);
  const status = err?.status ?? ((msg.match(/\b(4\d{2}|5\d{2})\b/) || [])[1] || '?');
  console.log(`  ✗ ${label} → status ${status}`);
  console.log(`     ${msg.slice(0, 300).replace(/\s+/g, ' ')}`);
};

const genAI = new GoogleGenAI({ apiKey: KEY });

// A) 現在の実装と同じ形: contents は Content オブジェクト、config あり
console.log('\n[A] SDK / contents={parts:[{text}]} + config');
try {
  const r = await genAI.models.generateContent({ model: MODEL, contents: { parts: [{ text: PROMPT }] }, config: CONFIG });
  console.log('  ✓ 成功:', String(r?.text).slice(0, 80));
} catch (e) { show('A', e); }

// B) contents を文字列にする
console.log('\n[B] SDK / contents="..." + config');
try {
  const r = await genAI.models.generateContent({ model: MODEL, contents: PROMPT, config: CONFIG });
  console.log('  ✓ 成功:', String(r?.text).slice(0, 80));
} catch (e) { show('B', e); }

// C) contents を配列にする
console.log('\n[C] SDK / contents=[{role,parts}] + config');
try {
  const r = await genAI.models.generateContent({ model: MODEL, contents: [{ role: 'user', parts: [{ text: PROMPT }] }], config: CONFIG });
  console.log('  ✓ 成功:', String(r?.text).slice(0, 80));
} catch (e) { show('C', e); }

// D) config を外す（config自体が原因かを見る）
console.log('\n[D] SDK / contents="..." / config なし');
try {
  const r = await genAI.models.generateContent({ model: MODEL, contents: PROMPT });
  console.log('  ✓ 成功:', String(r?.text).slice(0, 80));
} catch (e) { show('D', e); }

// E) 素のREST（デイリーコラム生成と同じ方式。これは本番で動いている実績がある）
console.log('\n[E] 素のREST / generationConfig');
try {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: PROMPT }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 256, responseMimeType: 'application/json' },
      }),
    }
  );
  const body = await res.text();
  if (!res.ok) console.log(`  ✗ E → status ${res.status}\n     ${body.slice(0, 300).replace(/\s+/g, ' ')}`);
  else console.log('  ✓ 成功:', body.slice(0, 120).replace(/\s+/g, ' '));
} catch (e) { show('E', e); }

// F) 利用可能なモデル一覧（キーの権限確認）
console.log('\n[F] models.list（キーで見えるモデル）');
try {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
    headers: { 'x-goog-api-key': KEY },
  });
  const body = await res.text();
  if (!res.ok) console.log(`  ✗ F → status ${res.status}\n     ${body.slice(0, 300).replace(/\s+/g, ' ')}`);
  else {
    const names = (JSON.parse(body).models || []).map((m) => m.name.replace('models/', ''));
    console.log(`  ✓ ${names.length}件:`, names.filter((n) => n.includes('flash') || n.includes('pro')).slice(0, 15).join(', '));
  }
} catch (e) { show('F', e); }

console.log('\n--- 自己診断おわり ---');
