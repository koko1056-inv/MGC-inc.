// 導入事例。社名は掲載許諾が取れるまで伏せ、業種と規模感だけで示す。
//
// 掲載方針（重要）:
// - 社名・製品名・所在地は書かない。特定につながる固有名詞も避ける。
// - 数値の成果は、実測して先方の確認が取れたものだけを載せる。
//   未確定のものは成果欄を作らず、note にその旨を書く。
// - 各事例の内容は、Notionのプロジェクト／商談ページに残っている事実に基づく。

export type CaseStudy = {
  slug: string;
  industry: string;          // 業種（社名の代わりに出す見出し）
  scale: string;             // 規模・立ち位置の一言
  services: string[];        // 関連するサービス
  summary: string;
  challenge: string[];
  approach: { title: string; desc: string }[];
  stack?: string;            // 使った主な技術
  result?: { label: string; desc: string };  // 先方の確認が取れた成果のみ
  // Before/After のフロー図。by: 'human' は人、'ai' はAIが担う工程。
  // 事実を表す図のため画像生成は使わず、テキストと図形で組む（DESIGN.md §4）。
  flow?: {
    beforeLabel: string;
    afterLabel: string;
    before: { label: string; by: 'human' | 'ai' }[];
    after: { label: string; by: 'human' | 'ai' }[];
    caption: string;
  };
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
        services: ['AI電話（音声AI）', 'Salesforce AI', 'AI活用研修'],
        summary:
          'CRMと音声AIを統合し、催促の架電をAIが自動で行う仕組みです。架電して終わりではなく、通話内容に応じた有人対応へのエスカレーションと、通話後の記録・通知（ACW）までを自動化しています。',
        flow: {
          beforeLabel: '導入前',
          afterLabel: '導入後',
          before: [
            { label: '対象者を抽出', by: 'human' },
            { label: '電話をかける', by: 'human' },
            { label: '通話内容を記録', by: 'human' },
            { label: '関係者へ共有', by: 'human' },
            { label: '次のアクションを起票', by: 'human' },
          ],
          after: [
            { label: '対象者を抽出', by: 'ai' },
            { label: '電話をかける', by: 'ai' },
            { label: '要対応か判定', by: 'ai' },
            { label: '判断が要る通話に対応', by: 'human' },
            { label: '記録・Teams通知', by: 'ai' },
          ],
          caption: '人が残るのは「判断が要る通話」だけになりました。記録・共有・起票（ACW）が丸ごと自動化された点が、人件費の削減に最も効いています。',
        },
        challenge: [
          '契約に関する催促の架電（解約手続きの追いかけ、継続確認、未払いの督促、機器の未着確認、返却の催促など）が人手に依存していた',
          '架電そのものより、通話後の後処理（ACW）に時間が取られていた。記録の入力、関係者への共有、次のアクションの起票など',
          '定型的な内容にもかかわらず件数が多く、担当者の時間と人件費を大きく使っていた',
          '繁忙期に負荷が集中し、その時期に他の業務が圧迫されていた',
        ],
        approach: [
          { title: 'CRMと音声AIを統合し、催促架電を自動化', desc: '顧客・契約データを参照して対象を抽出し、AIが自動で架電します。架電の結果はCRMへ書き戻すため、担当者が普段見ている画面がそのまま最新になります。' },
          { title: '通話内容に応じて有人対応へエスカレーション', desc: '会話の内容から、人が対応すべきものを判定して引き渡します。全部をAIで完結させず、判断や交渉が要る通話は人に回す設計です。' },
          { title: 'ACW（通話後処理）を自動化', desc: '通話内容の要約をチャットツール（Teams）へ自動で通知し、記録と共有を人手から外しました。ここが人件費の削減に最も効いています。' },
          { title: '6つの業務を分解し、1つに絞って着手', desc: '全部を一度に自動化せず、最も定型度が高い1業務から着手しました。同時に、他の業務へ展開できる共通基盤を作っています。' },
          { title: '段階の区切りに意思決定ポイントを置いた', desc: '第1弾の実運用の結果を見てから、残りの業務へ進むかを判断する形で合意しています。成果が出ないまま投資が膨らむことを防ぐためです。' },
        ],
        stack: '発着信基盤（Twilio）／ 顧客・契約データベース（Salesforce）／ 日本語音声合成（ElevenLabs）／ 通知先（Microsoft Teams）',
        points: [
          '効いたのは架電の自動化そのものより、ACW（通話後処理）の自動化だった。架電だけを自動化しても、後処理が人手なら工数は残る',
          'AIが架電していることの開示と同意取得のルールを、実装より先に確定させた',
          '対応が難しい場面で人へ引き渡す条件を、設計段階で決めた',
          '繁忙期に開発が重ならないよう、その前に実装を完了させる前提でスコープを切った',
          '同じ会社に対し、バックオフィス業務のAI活用研修も並行して実施している',
        ],
        note: '削減した人件費の具体的な数値は集計中です。確定し、先方の確認が取れ次第この欄に追記します。',
      },
      {
        slug: 'distributor-ai-outreach',
        industry: '総合代理店',
        scale: '海外メーカーの製品を日本市場で扱う事業者',
        services: ['AI営業'],
        summary:
          '取り扱う候補となる海外メーカーの発掘を、AIで自動化している案件です。条件に合うメーカーを見つけ、接触し、商談の場をつくるまでを仕組みとして回しています。',
        flow: {
          beforeLabel: '導入前',
          afterLabel: '導入後',
          before: [
            { label: '人脈をたどって候補を探す', by: 'human' },
            { label: 'リストを手作業で作る', by: 'human' },
            { label: '文面を書いて送る', by: 'human' },
            { label: '返信を捌く', by: 'human' },
            { label: '商談', by: 'human' },
          ],
          after: [
            { label: '狙う条件を決める', by: 'human' },
            { label: '条件に合うメーカーを発掘', by: 'ai' },
            { label: '重複・既存先を除外', by: 'ai' },
            { label: '1社ずつ文面を生成し送信', by: 'ai' },
            { label: '商談', by: 'human' },
          ],
          caption: '担当者の仕事は「狙う条件を決めること」と「商談」に集約されました。探す・送る・捌くの工程が仕組みに置き換わっています。',
        },
        challenge: [
          '取り扱い候補となる海外メーカーを探す作業が、担当者の手作業と人脈に依存していた',
          '新規開拓のリストが枯渇し、接触できる先が頭打ちになっていた',
          '同じ企業に重ねて接触してしまう事故が起きやすかった',
          '一斉配信では返信が取れず、かといって1社ずつ書く時間もなかった',
        ],
        approach: [
          { title: '海外メーカーの発掘をAIで自動化', desc: '取り扱いたい製品カテゴリーと条件から、該当する海外メーカーを自動で洗い出します。担当者の人脈に依存していた工程を仕組みに置き換えました。' },
          { title: '重複と既存取引先を仕組みで除外', desc: '過去の接触履歴と突き合わせ、重ねて当たることを機械的に防いでいます。' },
          { title: '文面を1社ずつ生成', desc: 'テンプレートの差し込みではなく、相手企業の製品や事業内容を踏まえて切り口を変える形にしました。' },
          { title: '接触データを自社側に蓄積する運用へ移行', desc: '送って終わりにせず、反応の履歴を自社のデータベースに残し、次の打ち手に使える形へ切り替えを進めています。' },
        ],
        result: {
          label: '1ヶ月で海外メーカーとの商談 10件',
          desc: '人脈に頼らず、条件から発掘して商談まで至った件数です。担当者は発掘や初回接触ではなく、商談そのものに時間を使える状態になりました。',
        },
        points: [
          '返信率が落ちてきた局面では、送信量を増やすのではなく、狙う条件と文面の切り口を見直した',
          'リストの枯渇は仕組みだけでは解けないため、対象カテゴリーの拡張を先方と一緒に検討している',
        ],
      },
      {
        slug: 'manufacturer-field-voice-ai',
        industry: '大手建設機械メーカー',
        scale: '海外展開している機械メーカー',
        services: ['AI電話（音声AI）', 'AI開発（受託）'],
        summary:
          '現場でのトラブルシューティングを、音声AIとの対話で解決できるシステムです。機種と言語に応じた技術情報をAIが引き当て、話しかけるだけで答えが返ります。',
        flow: {
          beforeLabel: '導入前',
          afterLabel: '導入後',
          before: [
            { label: '現場でトラブル発生', by: 'human' },
            { label: '事務所へ戻る', by: 'human' },
            { label: '手袋を外して端末を操作', by: 'human' },
            { label: '機種の資料を探す', by: 'human' },
            { label: '対処する', by: 'human' },
          ],
          after: [
            { label: '現場でトラブル発生', by: 'human' },
            { label: 'その場で話しかける', by: 'human' },
            { label: '機種・言語から該当情報を特定', by: 'ai' },
            { label: '音声で手順を返す', by: 'ai' },
            { label: '対処する', by: 'human' },
          ],
          caption: '「事務所へ戻る」「手袋を外す」の2工程が消えました。現場は手がふさがっているという前提から設計しています。',
        },
        challenge: [
          '現場でトラブルが起きたとき、対処法を調べるために事務所へ戻る必要があった',
          '手袋を外してスマートフォンを操作しないと調べられず、その手間が現場の負担になっていた',
          '機種ごとに技術資料が大量にあり、必要なものへ辿り着くまでに時間がかかっていた',
          '対応言語が多く、言語ごとに資料の探し方が揃っていなかった',
        ],
        approach: [
          { title: '話しかけるだけで答えが返る形にした', desc: '画面を操作せず、音声での対話でトラブルシューティングを進められるようにしました。手袋を外す・事務所へ戻るという手間をなくすことが目的です。' },
          { title: '機種と言語を引き継いで絞り込む', desc: '既存の顧客向けポータルから、利用者が見ていた機種と言語を引き継いで起動し、その条件で絞り込んだ状態から始められるようにしています。' },
          { title: '検索は提供元のAPIを使う', desc: 'ファイルを直接参照するのではなく、提供元が用意した検索の仕組みを経由する構成にし、資料の更新に追従できるようにしています。' },
          { title: '多言語の表示・読み上げ品質を確保', desc: '言語ごとのフォントと音声を検証し、どの言語でも破綻せずに使える状態を作っています。' },
        ],
        points: [
          '現場は手がふさがっているという前提から設計した。画面操作を前提にすると、結局は使われない',
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
        services: ['Voice AI', 'Salesforce AI', 'AI training'],
        summary:
          'CRM and voice AI integrated so that AI places reminder calls automatically. It does not stop at the call: escalation to a person, and the after-call work of logging and notifying, are automated too.',
        flow: {
          beforeLabel: 'Before',
          afterLabel: 'After',
          before: [
            { label: 'Select who to call', by: 'human' },
            { label: 'Place the call', by: 'human' },
            { label: 'Log the call', by: 'human' },
            { label: 'Share with the team', by: 'human' },
            { label: 'Raise the next action', by: 'human' },
          ],
          after: [
            { label: 'Select who to call', by: 'ai' },
            { label: 'Place the call', by: 'ai' },
            { label: 'Decide if a person is needed', by: 'ai' },
            { label: 'Handle calls needing judgement', by: 'human' },
            { label: 'Log and notify via Teams', by: 'ai' },
          ],
          caption: 'People are left with only the calls that need judgement. Automating the after-call work — logging, sharing, raising actions — is what produced the payroll saving.',
        },
        challenge: [
          'Contract reminder calls — chasing cancellations, confirming renewals, payment reminders, undelivered and unreturned equipment — all depended on people',
          'More time went into after-call work than the calls themselves: logging, sharing with colleagues, raising the next action',
          'Highly repetitive yet high in volume, consuming staff time and payroll',
          'Load concentrated in the busy season, squeezing everything else',
        ],
        approach: [
          { title: 'Integrate CRM with voice AI to automate reminder calls', desc: 'Targets are selected from contract data, AI places the call, and results are written back — so the screens staff already use stay current.' },
          { title: 'Escalate to a person based on what was said', desc: 'Calls needing judgement or negotiation are identified from the conversation and handed over rather than forced through AI.' },
          { title: 'Automate after-call work', desc: 'A summary of each call is pushed to the team chat tool (Teams) automatically, taking logging and sharing off people. This is where the payroll saving comes from.' },
          { title: 'Break down six flows, start with one', desc: 'We picked the most repetitive flow rather than automating everything at once, while building a foundation the other flows reuse.' },
          { title: 'A decision point between phases', desc: 'Whether to proceed to the remaining flows is decided on the first phase’s real-world results, so investment does not grow ahead of evidence.' },
        ],
        stack: 'Telephony (Twilio) / contract data (Salesforce) / Japanese speech synthesis (ElevenLabs) / notifications (Microsoft Teams)',
        points: [
          'Automating after-call work mattered more than automating the call. Automate only the call and the workload stays',
          'Rules for disclosing AI calling and obtaining consent were settled before implementation',
          'Conditions for handing a call to a person were defined during design',
          'Scope was cut so implementation completes before the busy season',
          'AI training for back-office work runs in parallel with the same client',
        ],
        note: 'The payroll saving is still being measured. We will add the figure once confirmed by the client.',
      },
      {
        slug: 'distributor-ai-outreach',
        industry: 'Distributor',
        scale: 'Brings overseas manufacturers’ products to the Japanese market',
        services: ['AI Sales'],
        summary:
          'Automating the discovery of overseas manufacturers worth representing — finding companies that fit, reaching out, and getting to a meeting, all as one system.',
        flow: {
          beforeLabel: 'Before',
          afterLabel: 'After',
          before: [
            { label: 'Search through personal networks', by: 'human' },
            { label: 'Build the list by hand', by: 'human' },
            { label: 'Write and send outreach', by: 'human' },
            { label: 'Handle replies', by: 'human' },
            { label: 'Meeting', by: 'human' },
          ],
          after: [
            { label: 'Define the criteria', by: 'human' },
            { label: 'Surface matching manufacturers', by: 'ai' },
            { label: 'Screen duplicates and existing accounts', by: 'ai' },
            { label: 'Write and send per company', by: 'ai' },
            { label: 'Meeting', by: 'human' },
          ],
          caption: 'The team’s work narrows to defining criteria and holding the meeting. Searching, sending and triaging moved into the system.',
        },
        challenge: [
          'Finding candidate overseas manufacturers relied on manual work and personal networks',
          'The prospect list ran dry and reachable companies plateaued',
          'The same companies were easily contacted twice',
          'Mass sending got no replies, but writing one at a time was not feasible',
        ],
        approach: [
          { title: 'Automate manufacturer discovery', desc: 'Given a product category and criteria, matching overseas manufacturers are surfaced automatically — replacing a step that depended on personal networks.' },
          { title: 'Screen duplicates and existing accounts', desc: 'Contact history is checked automatically so nobody is approached twice.' },
          { title: 'Write per company', desc: 'The angle changes based on each manufacturer’s products and business, rather than swapping fields in a template.' },
          { title: 'Move contact data in-house', desc: 'Responses accumulate in the client’s own database rather than disappearing after each send.' },
        ],
        result: {
          label: '10 meetings with overseas manufacturers in one month',
          desc: 'Sourced from criteria rather than personal networks. The team now spends its time in the meetings themselves rather than on discovery and first contact.',
        },
        points: [
          'When reply rates dipped, we revisited targeting and messaging rather than increasing volume',
          'List exhaustion cannot be solved by tooling alone, so category expansion is worked through with the client',
        ],
      },
      {
        slug: 'manufacturer-field-voice-ai',
        industry: 'Major construction machinery manufacturer',
        scale: 'A machinery manufacturer operating internationally',
        services: ['Voice AI', 'Custom AI development'],
        summary:
          'A system that lets field staff troubleshoot by talking to a voice AI. It pulls the right technical information for the machine model and language, so an answer comes back from speaking alone.',
        flow: {
          beforeLabel: 'Before',
          afterLabel: 'After',
          before: [
            { label: 'Problem occurs on site', by: 'human' },
            { label: 'Walk back to the office', by: 'human' },
            { label: 'Remove gloves, use a device', by: 'human' },
            { label: 'Search for the right document', by: 'human' },
            { label: 'Fix it', by: 'human' },
          ],
          after: [
            { label: 'Problem occurs on site', by: 'human' },
            { label: 'Just speak, on the spot', by: 'human' },
            { label: 'Match model and language', by: 'ai' },
            { label: 'Answer back by voice', by: 'ai' },
            { label: 'Fix it', by: 'human' },
          ],
          caption: 'Two steps disappear: walking back and taking off gloves. Designed from the premise that hands are full on site.',
        },
        challenge: [
          'When something went wrong on site, staff had to return to the office to look up how to fix it',
          'Looking it up meant removing gloves to operate a phone — a real burden in the field',
          'Each model has a large volume of technical material, and finding the right document took time',
          'Many supported languages, with no consistent way to search per language',
        ],
        approach: [
          { title: 'Answers from speaking alone', desc: 'Troubleshooting proceeds through voice conversation with no screen interaction, removing the need to take off gloves or walk back to the office.' },
          { title: 'Carry model and language over', desc: 'The app launches already filtered to the model and language the user was viewing in the existing customer portal.' },
          { title: 'Search through the provider’s API', desc: 'Search goes through the provided mechanism rather than referencing files directly, so results follow document updates.' },
          { title: 'Get multilingual rendering and speech right', desc: 'Fonts and voices were verified per language so the system holds up in all of them.' },
        ],
        points: [
          'Designed from the premise that hands are full on site. Assume screen interaction and it simply will not get used',
          'Navigation and authentication were settled first, on the premise that the existing user experience must not change',
          'Cases where search did not behave as expected were identified against real data, leading to a change in how documents are referenced',
        ],
      },
    ],
  },
};
