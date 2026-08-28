// 導入事例。社名は掲載許諾が取れるまで伏せ、業種と規模感だけで示す。
//
// 掲載方針（重要）:
// - 社名・製品名・所在地は書かない。特定につながる固有名詞も避ける。
// - 数値の成果は、実測して先方の確認が取れたものだけを載せる。
//   未確定のものは status に「進行中」と書き、成果欄は作らない。
// - 各事例の内容は、Notionのプロジェクト／商談ページに残っている事実に基づく。

export type CaseStudy = {
  slug: string;
  industry: string;          // 業種（社名の代わりに出す見出し）
  scale: string;             // 規模・立ち位置の一言
  services: string[];        // 関連するサービス
  status: string;            // 進行中 / 実施中 など
  summary: string;
  challenge: string[];
  approach: { title: string; desc: string }[];
  stack?: string;            // 使った主な技術
  points: string[];          // 設計上の要点（MGCの効かせどころ）
  note?: string;             // 掲載上の但し書き
};

type Content = Record<'ja' | 'en', { heading: string; lead: string; eyebrow: string; disclaimer: string; cases: CaseStudy[] }>;

export const caseContent: Content = {
  ja: {
    eyebrow: 'Case Studies',
    heading: '導入事例',
    lead: 'MGCが実際に取り組んでいる案件です。社名は掲載許諾の手続き中のため伏せ、業種と進め方をご紹介します。',
    disclaimer: '掲載内容は各社の許諾を得た範囲で随時更新します。数値での成果は、実測して先方の確認が取れたものだけを掲載する方針のため、集計中の案件には記載していません。',
    cases: [
      {
        slug: 'callcenter-voice-ai',
        industry: 'コールセンター運営',
        scale: '契約者への電話対応業務を担う事業者',
        services: ['AI電話（音声AI）', 'AI活用研修'],
        status: '進行中（2026年6月〜）',
        summary:
          '定型的な架電業務を音声AIで自動化する案件です。6種類ある電話業務のうち、まず1つに絞って共通基盤とあわせて構築し、実運用の結果を見てから残りへ広げる進め方を取っています。',
        challenge: [
          '契約に関する定型的な架電業務（解約手続きの追いかけ、継続確認、未払いの督促、機器の未着確認、返却の催促など）が人手に依存していた',
          '繁忙期に負荷が集中し、その時期に他の業務が圧迫されていた',
          '架電の内容が定型的である一方、件数が多く、担当者の時間を大きく使っていた',
        ],
        approach: [
          { title: '6つの業務を分解し、1つに絞って着手', desc: '全部を一度に自動化せず、最も定型度が高い1業務を選んで着手しました。同時に、他の業務へ展開できる共通基盤を作っています。' },
          { title: '既存の顧客データベースと接続', desc: '顧客・契約データを参照し、架電結果を書き戻す構成にしました。担当者が普段見ている画面を変えずに済みます。' },
          { title: '段階の区切りに意思決定ポイントを置いた', desc: '第1弾の実運用の結果を見てから、残りの業務へ進むかを判断する形で合意しています。成果が出ないまま投資が膨らむことを防ぐためです。' },
          { title: '繁忙期から逆算してスコープを切った', desc: '繁忙期に開発が重ならないよう、その前に実装を完了させる前提で対象範囲を決めました。' },
        ],
        stack: '発着信基盤（Twilio）／ 顧客・契約データベース（Salesforce）／ 日本語音声合成（ElevenLabs）',
        points: [
          'AIが架電していることの開示と同意取得のルールを、実装より先に確定させた',
          '対応が難しい場面で人へ引き渡す条件を、設計段階で決めた',
          '通話料・音声合成料などの外部サービス利用料は、実費として明確に切り分けた',
          '同じ会社に対し、バックオフィス業務のAI活用研修も並行して実施している',
        ],
        note: '第1弾の実運用の結果は集計中です。数値が確定し、先方の確認が取れ次第この欄に追記します。',
      },
      {
        slug: 'distributor-ai-outreach',
        industry: '海外製品の総代理店',
        scale: '海外メーカーの製品を日本市場で扱う事業者',
        services: ['AI営業'],
        status: '進行中',
        summary:
          '海外向けの新規開拓を、AIによるアウトリーチで支援している案件です。リストの作成から個別文面の生成、返信対応までを仕組みとして回しています。',
        challenge: [
          '新規開拓のリストが枯渇し、接触できる先が頭打ちになっていた',
          '同じ企業に重ねて接触してしまう事故が起きやすかった',
          '一斉配信では返信が取れず、かといって1社ずつ書く時間もなかった',
        ],
        approach: [
          { title: '狙う条件を言語化してリストを作り直した', desc: '成果につながった相手の共通点から条件を整理し、その条件でリストを生成する形にしました。' },
          { title: '重複と既存取引先を仕組みで除外', desc: '過去の接触履歴と突き合わせ、重ねて当たることを機械的に防いでいます。' },
          { title: '文面を1社ずつ生成', desc: 'テンプレートの差し込みではなく、相手企業の事業内容を踏まえて切り口を変える形にしました。' },
          { title: '接触データを自社側に蓄積する運用へ移行', desc: '送って終わりにせず、反応の履歴を自社のデータベースに残し、次の打ち手に使える形へ切り替えを進めています。' },
        ],
        points: [
          '返信率が落ちてきた局面では、送信量を増やすのではなく、狙う条件と文面の切り口を見直した',
          'リストの枯渇は仕組みだけでは解けないため、対象カテゴリーの拡張を先方と一緒に検討している',
        ],
        note: '成約に至った事例が出ています。具体的な内容は、先方の掲載許諾が取れ次第ご紹介します。',
      },
      {
        slug: 'manufacturer-document-search',
        industry: '大手建設機械メーカー',
        scale: '海外展開している機械メーカー',
        services: ['AI開発（受託）'],
        status: '進行中',
        summary:
          '機種と言語に応じて、必要な技術ドキュメントに辿り着けるアプリケーションを受託開発している案件です。既存の顧客向けポータルと連携させています。',
        challenge: [
          '機種ごとに技術資料が大量にあり、必要なものへ辿り着くまでに時間がかかっていた',
          '対応言語が多く、言語ごとに資料の探し方が揃っていなかった',
          '既存のポータルから遷移したときに、機種や言語の情報が引き継がれていなかった',
        ],
        approach: [
          { title: '既存ポータルと連携し、条件を引き継ぐ', desc: '利用者がどの機種・どの言語を見ていたかを引き継いで起動し、その条件で絞り込んだ状態から始められるようにしています。' },
          { title: '検索は提供元のAPIを使う', desc: 'ファイルを直接参照するのではなく、提供元が用意した検索の仕組みを経由する構成にし、資料の更新に追従できるようにしています。' },
          { title: '多言語の表示品質を確保', desc: '言語ごとのフォントを検証し、どの言語でも文字が崩れずに読める状態を作っています。' },
          { title: '図・PDF・リンクの見せ方を設計', desc: '検索結果をただ並べるのではなく、資料の種類に応じた表示を設計しています。' },
        ],
        points: [
          '既存システムの利用者体験を変えないことを前提に、遷移と認証の設計を先に固めた',
          '検索が期待どおりに効かないケースを実データで洗い出し、参照方法そのものを見直した',
        ],
      },
    ],
  },

  en: {
    eyebrow: 'Case Studies',
    heading: 'Case studies',
    lead: 'Projects MGC is actually working on. Company names are withheld while permission to publish is arranged, so we describe the industry and the approach.',
    disclaimer: 'We update these as each client approves what may be published. Figures are only published once measured and confirmed by the client, so projects still being measured have no results section.',
    cases: [
      {
        slug: 'callcenter-voice-ai',
        industry: 'Call centre operator',
        scale: 'Handles outbound calls to contract holders',
        services: ['Voice AI', 'AI training'],
        status: 'In progress (from June 2026)',
        summary:
          'Automating routine outbound calls with voice AI. Rather than tackling all six call types at once, we built the shared foundation alongside a single flow, and will widen scope based on how it performs in production.',
        challenge: [
          'Routine contract-related calls — chasing cancellations, confirming renewals, payment reminders, undelivered and unreturned equipment — all depended on people',
          'Load concentrated in the busy season, squeezing everything else',
          'The calls were highly repetitive yet high in volume, consuming a lot of staff time',
        ],
        approach: [
          { title: 'Break down six flows, start with one', desc: 'We picked the most repetitive flow rather than automating everything at once, while building a foundation the other flows can reuse.' },
          { title: 'Connect to the existing customer database', desc: 'The system reads contract data and writes call results back, so staff keep working in the screens they already use.' },
          { title: 'A decision point between phases', desc: 'Whether to proceed to the remaining flows is decided on the first phase’s real-world results — so investment does not grow ahead of evidence.' },
          { title: 'Scope set backwards from the busy season', desc: 'Implementation is scheduled to finish before the busy period, and scope was cut to fit.' },
        ],
        stack: 'Telephony (Twilio) / customer and contract data (Salesforce) / Japanese speech synthesis (ElevenLabs)',
        points: [
          'Rules for disclosing AI calling and obtaining consent were settled before implementation',
          'Conditions for handing a call to a person were defined during design',
          'External usage costs such as call time and speech synthesis are billed separately at cost',
          'AI training for back-office work runs in parallel with the same client',
        ],
        note: 'First-phase results are still being measured. We will add figures here once confirmed by the client.',
      },
      {
        slug: 'distributor-ai-outreach',
        industry: 'Sole distributor of overseas products',
        scale: 'Brings an overseas manufacturer’s products to the Japanese market',
        services: ['AI Sales'],
        status: 'In progress',
        summary:
          'Supporting overseas prospecting with AI-driven outreach — list building, per-company messaging and reply handling run as one system.',
        challenge: [
          'The prospect list ran dry and reachable companies plateaued',
          'The same companies were easily contacted twice',
          'Mass sending got no replies, but writing one at a time was not feasible',
        ],
        approach: [
          { title: 'Describe the target, then rebuild the list', desc: 'We worked backwards from what actually converted to define targeting conditions, and generate lists from those.' },
          { title: 'Screen duplicates and existing accounts', desc: 'Contact history is checked automatically so nobody is approached twice.' },
          { title: 'Write per company', desc: 'Not a template with fields swapped — the angle changes based on each company’s business.' },
          { title: 'Move contact data in-house', desc: 'Responses are accumulated in the client’s own database rather than disappearing after each send.' },
        ],
        points: [
          'When reply rates dipped, we revisited targeting and messaging rather than increasing volume',
          'List exhaustion cannot be solved by tooling alone, so category expansion is being worked through with the client',
        ],
        note: 'Deals have closed through this work. We will share specifics once the client approves publication.',
      },
      {
        slug: 'manufacturer-document-search',
        industry: 'Major construction machinery manufacturer',
        scale: 'A machinery manufacturer operating internationally',
        services: ['Custom AI development'],
        status: 'In progress',
        summary:
          'Building an application that helps users reach the right technical documentation for a given machine model and language, integrated with the existing customer portal.',
        challenge: [
          'Each model has a large volume of technical material, and finding the right document took time',
          'Many supported languages, with no consistent way to search per language',
          'Model and language context was lost when moving from the existing portal',
        ],
        approach: [
          { title: 'Carry context over from the portal', desc: 'The app launches already filtered to the model and language the user was viewing.' },
          { title: 'Search through the provider’s API', desc: 'Rather than referencing files directly, search goes through the provided mechanism so results follow document updates.' },
          { title: 'Get multilingual rendering right', desc: 'Fonts were verified per language so text renders correctly in all of them.' },
          { title: 'Design how diagrams, PDFs and links appear', desc: 'Results are presented according to document type rather than as a flat list.' },
        ],
        points: [
          'Navigation and authentication were settled first, on the premise that the existing user experience must not change',
          'Cases where search did not behave as expected were identified against real data, leading to a change in how documents are referenced',
        ],
      },
    ],
  },
};
