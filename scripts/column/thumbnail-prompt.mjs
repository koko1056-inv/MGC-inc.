// コラムのサムネイル（写真調）の生成プロンプトを、記事データから決まった形で組み立てる。
// 誰が作っても同じ見た目になるよう、画風（STYLE）は固定し、記事ごとに変わるのは「場所」と「場面」だけにする。
// 基準になったサムネイル: /assets/service_training.webp（コラム「法人向けAI研修の選び方チェックリスト」）
//
// 使い方:
//   node scripts/column/thumbnail-prompt.mjs <slug>        … 1本のプロンプトを表示
//   node scripts/column/thumbnail-prompt.mjs --all --json  … 全記事の {slug, prompt} を JSON で表示
// 記事 JSON に "thumbnailScene" があれば、それを場面として優先する（キーワードで決まらない記事向け）。
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CONTENT = join(ROOT, 'content', 'columns');

// 画風（固定）。DESIGN.md §4: 白・黒/グレー基調、アクセントは青 #2D6CDF のみ、余白多め、暖色を出さない
export const STYLE = [
  'Photorealistic editorial photograph, 16:9, natural daylight from large windows',
  'bright minimal modern Japanese workplace, white walls, light wood, pale concrete, a few green plants',
  'Japanese professionals in business casual clothing in black, charcoal, gray and white',
  'the only accent color is a single cobalt blue (#2D6CDF) element such as a bar in a chart on a screen, a tablet UI or a folder',
  'calm, candid documentary composition, eye-level, people focused on the work rather than posing, faces natural and not looking at the camera',
  'generous negative space, soft contrast, neutral color grading',
  'no text, no letters, no numbers, no logos, no watermarks, no brand names, no warm colors such as pink, coral, orange or red',
].join('; ');

// 業種ごとの場所と人物
export const SETTINGS = {
  manufacturing: 'a clean, bright factory floor next to a production line with machinery in neutral gray',
  construction: 'a construction site office with a large window overlooking a building under construction, safety helmets on the desk',
  'real-estate': 'a bright real estate office with floor plans and building models on the table',
  retail: 'the back office of a bright retail store, with neat product shelves visible through a glass wall',
  logistics: 'a bright, orderly warehouse with racks of cardboard boxes and a packing station',
  healthcare: 'a calm nurses station in a bright care facility, staff in simple white and navy uniforms',
  hospitality: 'the back office of a bright hotel and restaurant, with a reception lobby softly visible behind',
  professional: 'a quiet, bright professional services office for accountants and lawyers, with documents and binders',
  finance: 'a bright, secure financial services office with neatly arranged documents',
  education: 'a bright school staff room next to a classroom, teachers at desks',
  hr: 'a bright HR and recruiting office with a small interview corner',
  public: 'a bright municipal office with a public service counter in the background',
  general: 'a bright modern meeting room in a Japanese company',
};

// タイトルのキーワード → 場面（上から順に最初に当たったもの）
export const SCENES = [
  [/教材|学習コンテンツ/, 'a teacher reviewing a draft lesson handout on a laptop next to neatly stacked printed teaching materials, a colleague checking it beside them'],
  [/研修|リスキリング|教育|育成|スキル/, 'a small group learning session, one person explaining at a large screen while others take notes on laptops'],
  [/費用|見積|積算|コスト|価格|プライシング|利益/, 'two people reviewing a cost breakdown on a laptop and a printed estimate, one pointing at a chart'],
  [/検査|品質|安全|点検|巡回|事故|リスク|不正|インシデント/, 'a person carefully checking items with a tablet that shows an inspection screen, a colleague confirming beside them'],
  [/需要予測|在庫|発注|欠品|MD/, 'two people looking at a demand forecast chart on a large monitor next to neatly stocked shelves'],
  [/シフト|勤務|配置|労務/, 'a manager and a staff member planning a shift schedule together on a tablet'],
  [/配車|配送|ラストワンマイル|積載|搬入|動線/, 'a dispatcher planning routes on a large monitor while a colleague checks loads nearby'],
  [/書類|文書|契約|記録|帳票|議事録|伝票|報告/, 'a person reviewing documents with an AI assistant summary on a laptop, papers neatly organized beside it'],
  [/問い合わせ|反響|窓口|電話|顧客対応|カスタマー|接客|応対|家族/, 'a staff member answering an inquiry at a desk with a headset, a laptop showing a conversation summary'],
  [/技術承継|技術継承|継承|属人化|暗黙知|ナレッジ|知見|勘|熟練|形式知/, 'a senior expert explaining to a younger colleague while the younger one records notes on a tablet'],
  [/採用|面接|スカウト|求人|マッチング|キャリア|面談|人材/, 'two people in a calm one-on-one interview, one taking notes on a laptop'],
  [/データ|分析|可視化|予兆|予測|EBPM|見える化/, 'a small team discussing a simple data dashboard on a large screen'],
  [/計画|スケジュール|生産|進捗/, 'a planner arranging a schedule on a large screen with a colleague beside a whiteboard'],
  [/ガバナンス|セキュリティ|コンプライアンス|規程|ルール/, 'a team leader and a colleague reviewing guidelines on a laptop in a quiet meeting space'],
];
export const DEFAULT_SCENE = 'a small team working together around a laptop, one person pointing at the screen';

export const loadArticle = (slug) => JSON.parse(readFileSync(join(CONTENT, `${slug}.json`), 'utf8'));

export function promptFor(a) {
  const setting = SETTINGS[a.industry] || SETTINGS.general;
  const scene = a.thumbnailScene || (SCENES.find(([re]) => re.test(a.title)) || [, DEFAULT_SCENE])[1];
  return `${scene}, in ${setting}. ${STYLE}.`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--all')) {
    const manifest = JSON.parse(readFileSync(join(CONTENT, 'columns.json'), 'utf8'));
    const out = manifest.articles.map((e) => { const a = loadArticle(e.slug); return { slug: a.slug, prompt: promptFor(a) }; });
    console.log(args.includes('--json') ? JSON.stringify(out, null, 1) : out.map((x) => `${x.slug}\n  ${x.prompt}`).join('\n'));
  } else if (args[0]) {
    console.log(promptFor(loadArticle(args[0])));
  } else {
    console.error('使い方: node scripts/column/thumbnail-prompt.mjs <slug> | --all [--json]');
    process.exitCode = 1;
  }
}
