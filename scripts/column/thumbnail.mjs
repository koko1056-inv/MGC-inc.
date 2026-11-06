// コラムのサムネイルを、決まったサイズ・形式で書き出す。
// 生成した画像（ファイル・https の URL・Buffer）を受け取り、次の2つを作る:
//   public/assets/column/<name>.webp  … 一覧・記事のサムネイル（1400×788、16:9、品質80）
//   public/assets/column/<name>.jpg   … OGP・構造化データ用（1200×630、品質82）
// どちらも中央で切り抜く（cover）。<name> は記事の slug（業種の予備画像は ind_<業種>）。
//
// 使い方:
//   node scripts/column/thumbnail.mjs <name> <画像ファイル or https URL>
// 記事に使うときは、記事 JSON の "image" を "/assets/column/<slug>.webp" にする（build-columns が .jpg を OGP に使う）。
import sharp from 'sharp';
import { mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'public', 'assets', 'column');
export const SIZES = { thumb: { w: 1400, h: 788, q: 80 }, og: { w: 1200, h: 630, q: 82 } };

export async function writeThumbnail(name, input) {
  if (!/^[a-z0-9_-]+$/.test(name)) throw new Error(`name は英小文字・数字・-_ のみ: ${name}`);
  const buf = Buffer.isBuffer(input) ? input : /^https:\/\//.test(input) ? Buffer.from(await (await fetch(input)).arrayBuffer()) : readFileSync(input);
  mkdirSync(OUT, { recursive: true });
  const base = sharp(buf).rotate();
  await base.clone().resize(SIZES.thumb.w, SIZES.thumb.h, { fit: 'cover', position: 'centre' }).webp({ quality: SIZES.thumb.q }).toFile(join(OUT, `${name}.webp`));
  await base.clone().resize(SIZES.og.w, SIZES.og.h, { fit: 'cover', position: 'centre' }).jpeg({ quality: SIZES.og.q, progressive: true, mozjpeg: true }).toFile(join(OUT, `${name}.jpg`));
  return { webp: `/assets/column/${name}.webp`, jpg: `/assets/column/${name}.jpg` };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [name, input] = process.argv.slice(2);
  if (!name || !input) { console.error('使い方: node scripts/column/thumbnail.mjs <name> <画像ファイル or https URL>'); process.exit(1); }
  writeThumbnail(name, input).then((r) => console.log(r)).catch((e) => { console.error(e.message); process.exitCode = 1; });
}
