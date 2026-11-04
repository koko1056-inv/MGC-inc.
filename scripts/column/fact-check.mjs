// 自動生成したコラムが、公開済みのMGCの事実から外れていないかを機械的に確かめる。
// 日次の自動投稿（generate-column.mjs）が公開前に使う。手で確かめるときは CLI でも使える。
//
// 使い方: node scripts/column/fact-check.mjs <slug> [<slug>...]
//
// 確かめること（新しく生成する記事向けの厳しめの基準。既存記事の書き直しは check-rewrite.mjs）:
//   - 金額は公開済みのもの（1名398,000円、PoC 100〜300万円）だけ
//   - 効果の割合（%・割）は書かない（出典のない数字になるため）
//   - 「MGCの〜」の節で、PoC の期間を公開済みの目安（パイロット運用＝PoC 2〜4週間）以外で書かない
//   - 「MGCの〜」の節と links の説明に、事例・実績があるような表現を書かない
//   - MGC 以外の社名表記（株式会社など）を書かない
//   - links はサイト内のパスだけ
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const ALLOWED_MONEY = ['398,000円', '100〜300万円'];
const CLAIM_WORDS = /導入実績|実績多数|構築事例|開発事例|支援事例|導入事例|導入企業|お客様の声|満足度|社以上|件以上/;

const itemText = (i) => (typeof i === 'string' ? i : `${i.label || ''} ${i.desc || ''}`);
const blockText = (b) => [b.text || '', ...(b.items || []).map(itemText)].join('\n');

// 文に区切る（。！？と改行）
const sentences = (s) => s.split(/(?<=[。！？])|\n/).map((x) => x.trim()).filter(Boolean);

export function factCheck(a) {
  const issues = [];
  const body = a.body || [];
  const all = [a.title, a.seoTitle, a.description, a.lead, ...(a.summary || []), ...body.map(blockText), ...(a.faq || []).flatMap((f) => [f.q, f.a])]
    .filter(Boolean).join('\n').normalize('NFKC').replace(/[~～]/g, '〜');

  for (const m of all.match(/\d[\d,.]*(?:\s*〜\s*\d[\d,.]*)?\s*(?:万円|円)/g) || []) {
    const v = m.replace(/\s/g, '');
    if (!ALLOWED_MONEY.includes(v)) issues.push(`公開されていない金額: ${v}`);
  }
  for (const m of all.match(/\d[\d,.]*(?:\s*〜\s*\d[\d,.]*)?\s*(?:%|割)/g) || []) issues.push(`出典のない割合: ${m.replace(/\s/g, '')}`);
  if (/株式会社|（株）|\(株\)|有限会社|合同会社/.test(all.replace(/ＭＧＣ株式会社|MGC株式会社/g, ''))) issues.push('MGC以外の社名表記がある');

  // 「MGCの〜」の節（次の h2 まで）と links の説明
  let inMgc = false;
  for (const b of body) {
    if (b.type === 'h2') { inMgc = /MGC/.test(b.text || ''); continue; }
    if (b.type === 'links') {
      for (const it of b.items || []) {
        if (typeof it !== 'object' || !/^\/(?!\/)/.test(it.href || '')) issues.push(`サイト外のリンク: ${it && it.href}`);
        else if (!it.href.startsWith('/cases') && CLAIM_WORDS.test(itemText(it))) issues.push(`リンクの説明に事例・実績の表現: ${itemText(it).trim()}`);
      }
      continue;
    }
    if (inMgc) {
      const t = blockText(b).normalize('NFKC').replace(/[~～]/g, '〜');
      const m = t.match(CLAIM_WORDS);
      if (m) issues.push(`「MGCの〜」の節に事例・実績の表現: ${m[0]}`);
      for (const s of sentences(t)) {
        const durs = (s.match(/\d+(?:\s*〜\s*\d+)?\s*(?:週間|ヶ月|か月|カ月)/g) || []).map((d) => d.replace(/\s/g, ''));
        if (/PoC|概念実証|パイロット/.test(s) && durs.some((d) => !['2〜4週間', '1〜3ヶ月'].includes(d))) {
          issues.push(`公開されていない期間: ${s.slice(0, 80)}`);
        }
      }
    }
  }
  return [...new Set(issues)];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let bad = 0;
  for (const slug of process.argv.slice(2)) {
    const a = JSON.parse(readFileSync(join(ROOT, 'content', 'columns', `${slug}.json`), 'utf8'));
    const issues = factCheck(a);
    console.log(`${issues.length ? 'NG' : 'OK'}  ${slug}${issues.length ? '\n    - ' + issues.join('\n    - ') : ''}`);
    if (issues.length) bad++;
  }
  process.exitCode = bad ? 1 : 0;
}
