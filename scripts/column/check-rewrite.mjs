// コラムを書き直したとき、変えてはいけないものが変わっていないかを確かめる。
// 比べる相手は git の基準（既定 origin/main）にある同じ記事。
//
// 使い方: node scripts/column/check-rewrite.mjs [--base <ref>] <slug> [<slug>...]
//
// 確かめること:
//   - slug・title・seoTitle・industry・date が同じ
//   - 本文・リード・要点・FAQ に出てくる数字が、元の記事か、公開済みのMGCの事実（ALLOWED）にあるものだけ
//   - 「株式会社」「(株)」などの社名表記が新しく増えていない
//   - 新しい型（前提の節・MGCの場合・links・まとめ・FAQ 3問・要点3点）になっている
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
let base = 'origin/main';
if (args[0] === '--base') { base = args[1]; args.splice(0, 2); }

// サイトに公開済みのMGCの事実に含まれる数字
// 見出しの番号（チェックリスト1〜5）も許可する
const ALLOWED = ['398,000', '398000', '20', '1', '2', '3', '4', '5', '100', '300', '30'];
const text = (a) => [a.lead, ...(a.summary || []), ...(a.body || []).flatMap((b) => [b.text, ...(b.items || []).map((i) => (typeof i === 'string' ? i : `${i.label}${i.desc || ''}`))]), ...(a.faq || []).flatMap((f) => [f.q, f.a])].filter(Boolean).join('\n');
const nums = (s) => new Set((s.normalize('NFKC').match(/\d[\d,.]*/g) || []).map((n) => n.replace(/[.,]$/, '')));
const companies = (s) => (s.match(/株式会社|（株）|\(株\)|有限会社|合同会社/g) || []).length;

let bad = 0;
for (const slug of args) {
  const p = `content/columns/${slug}.json`;
  const now = JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
  const old = JSON.parse(execFileSync('git', ['show', `${base}:${p}`], { cwd: ROOT, encoding: 'utf8' }));
  const issues = [];
  for (const k of ['slug', 'title', 'seoTitle', 'industry', 'date']) if (now[k] !== old[k]) issues.push(`${k} が変わった`);
  const oldNums = nums(text(old));
  const newNums = [...nums(text(now))].filter((n) => !oldNums.has(n) && !ALLOWED.includes(n));
  if (newNums.length) issues.push(`新しい数字: ${newNums.join(', ')}`);
  if (companies(text(now)) > companies(text(old))) issues.push('社名表記が増えた');
  const h2 = (now.body || []).filter((b) => b.type === 'h2').map((b) => b.text);
  if (!h2.some((t) => /MGC/.test(t))) issues.push('「MGCの〜」の節がない');
  if (!h2.some((t) => /まとめ/.test(t))) issues.push('まとめの節がない');
  if (!(now.body || []).some((b) => b.type === 'links')) issues.push('links ブロックがない');
  if ((now.summary || []).length !== 3) issues.push('要点が3点でない');
  if ((now.faq || []).length !== 3) issues.push('FAQ が3問でない');
  if (!now.dateModified || now.dateModified === old.dateModified) issues.push('dateModified が更新されていない');
  const len = text(now).length;
  console.log(`${issues.length ? 'NG' : 'OK'}  ${slug}  (${len}字)${issues.length ? '\n    - ' + issues.join('\n    - ') : ''}`);
  if (issues.length) bad++;
}
process.exitCode = bad ? 1 : 0;
