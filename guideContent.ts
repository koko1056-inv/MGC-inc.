// 比較・選び方ガイド（/guide, /guide/<slug>）。
// 「◯◯と△△の違い」「どちらを選ぶか」という問いに、表と短い文章で直接答えるページ。
// 内容はサービスページに掲載済みの事実と、一般的な仕組みの説明に限る。料金は公開済みの目安（PoC 100〜300万円）だけ。導入件数・お客様の声は書かない。
import type { Lang } from './translations';

export type Guide = {
  slug: string;
  title: string;
  description: string;
  lead: string;
  table: { caption: string; head: string[]; rows: string[][] };
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[];
  faq: { q: string; a: string }[];
  service: { href: string; label: string };
};

const ja: Guide[] = [
  {
    slug: 'ai-phone-vs-ivr-voicebot',
    title: 'AI電話・IVR・ボイスボットの違いと選び方',
    description: '電話の自動化で比較されるAI電話（音声AI）、IVR（自動音声応答）、ボイスボットの違いを、用件の伝え方・扱える情報・記録・人への引き継ぎで比較。向く電話・向かない電話と、導入前に決めておくことも解説します。',
    lead: '電話の一次対応を自動化する方法には、IVR（「1を押してください」の自動音声）、ボイスボット（音声で自動応答する仕組みの総称）、AI電話（話し言葉を聞き取る音声AI）があります。違いは「かけてきた人がどう用件を伝えるか」と「その後、人にどう引き継ぐか」に表れます。',
    table: {
      caption: 'IVRとAI電話（音声AI）の比較',
      head: ['比較の観点', 'IVR（プッシュ操作の自動音声）', 'AI電話（音声AI）'],
      rows: [
        ['用件の伝え方', '番号を選んで階層をたどる。該当する番号がないと詰まる', '話し言葉のまま伝えられる'],
        ['一度に扱える情報', '1階層で1つ。日時と用件を同時には受け取れない', '用件・日時・名前・電話番号をまとめて聞き取れる'],
        ['分岐の変更', '音声の録り直しと設定変更が必要', '対応方針の記述を変えるだけで反映できる'],
        ['記録の残り方', 'どの番号を押したかだけが残る', '会話内容の要約・録音・聞き取った項目が残る'],
        ['人への引き継ぎ', '選んだ番号に応じて転送', '会話の内容から、人が対応すべき通話を判定して引き渡す'],
      ],
    },
    sections: [
      {
        heading: 'ボイスボットとAI電話の関係',
        paragraphs: [
          'ボイスボットは、音声で自動応答する仕組み全体を指す言葉です。決められた質問に順に答えてもらう形のものから、話し言葉をそのまま理解するものまで幅があり、AI電話（音声AI）もその一種です。比べるときは名前ではなく、「自由に話した用件を聞き取れるか」「要約や記録がどこに残るか」「人に回す条件を決められるか」で見ると判断しやすくなります。',
        ],
      },
      {
        heading: 'AI電話が向く電話、向かない電話',
        list: [
          '向いている: 同じ種類の問い合わせが繰り返しかかってくる',
          '向いている: 電話に出るたびに現場の作業が中断されている',
          '向いている: 営業時間外やピーク時に取りこぼしが発生している',
          '今は向かない: 着信のほとんどが緊急対応・クレームである',
          '今は向かない: 1件ごとに内容が大きく異なり、定型化できない',
          '今は向かない: 人に引き渡す先の体制がなく、結局つながらない状態になる',
        ],
      },
      {
        heading: '導入前に決めておくこと',
        list: [
          'AIが応答していることを、かけてきた方にどう伝えるか',
          '通話の録音と、その保存期間・利用範囲をどう案内するか',
          '人に引き渡す条件と、引き渡し先が不在だったときの扱い',
          'AIが対応しきれなかった場合の最終的な受け皿',
        ],
      },
    ],
    faq: [
      { q: 'IVRとAI電話の一番の違いは何ですか？', a: 'IVRは番号の入力で決まった選択肢に振り分けるのに対し、AI電話は用件を話し言葉のまま聞き取り、要約して担当者に引き渡せる点です。日時と用件などを一度の会話でまとめて受け取れます。' },
      { q: 'ボイスボットとAI電話は別のものですか？', a: 'ボイスボットは音声で自動応答する仕組みの総称で、AI電話（音声AI）もその一種です。製品によって、自由な話し言葉をどこまで聞き取れるかや、記録・引き継ぎの仕組みが異なります。' },
      { q: 'AI電話にすると、電話に出る人は不要になりますか？', a: 'なりません。判断や交渉が要る通話、緊急の通話は人が対応する前提で設計します。AIは一次対応と要約・記録を引き受け、人が対応すべき通話を見分けて回す役割です。' },
    ],
    service: { href: '/service/ai-phone', label: 'AI電話（音声AI）' },
  },
  {
    slug: 'ai-sales-vs-telemarketing',
    title: 'AI営業とテレアポ代行の違いと選び方',
    description: '営業の前工程を外に任せる方法として比較されるAI営業とテレアポ代行の違いを、担い手・契約の形・手元に残るもの・比較の観点で整理。AI営業が向く会社・向かない会社も解説します。',
    lead: 'アポイント獲得までの前工程を任せる方法として、テレアポ代行とAI営業があります。テレアポ代行は人が電話をかけ、1アポ単位の成果報酬で請け負う形が一般的です。AI営業は、狙う企業の条件・リスト・文面・判定基準を作り込み、送信・追客・日程調整までをAIが回し続ける仕組みをつくります。',
    table: {
      caption: 'テレアポ代行とAI営業（MGC）の比較',
      head: ['比較の観点', 'テレアポ代行（一般的な形）', 'AI営業（MGC）'],
      rows: [
        ['担い手', '代行会社のスタッフが架電する', 'AIがリスト作成・文面の個別生成・送信・追客・日程調整を担い、人の確認を挟む'],
        ['契約の形', '1アポ単位の成果報酬が多い', '初期費用（設計）＋月額費用（運用・改善）＋実費（送信基盤・データ取得）'],
        ['手元に残るもの', 'アポイント', 'アポイントに加え、ターゲット条件・文面・接触データなどの仕組み'],
        ['文面', 'トークスクリプトに沿った架電', '1社ずつ個別に生成した文面'],
        ['比較のしかた', 'アポ単価', 'アポ単価だけでなく、商談の質と再現性'],
      ],
    },
    sections: [
      {
        heading: 'AI営業が向く会社、向かない会社',
        list: [
          '向いている: 法人向け（BtoB）で、狙う企業の条件をある程度言葉にできる',
          '向いている: 商談さえ組めれば受注につながる手応えがある',
          '向いている: 営業担当が前工程に追われ、商談の準備が薄くなっている',
          '今は向かない: 個人向け（BtoC）で、対象が不特定多数である',
          '今は向かない: 誰に売るかがまだ決まっていない',
          '今は向かない: 商談を受ける体制がなく、アポが増えても対応できない',
        ],
      },
      {
        heading: '比べるときの注意',
        paragraphs: [
          'アポ単価だけで比べると判断を誤りやすくなります。どのような条件の企業と商談できたか（商談の質）と、同じ成果を繰り返し出せるか（再現性）、そして仕組みや接触データが社内に残るかまで含めて比べることをおすすめします。',
        ],
      },
    ],
    faq: [
      { q: 'AI営業は成果報酬型ですか？', a: 'MGCのAI営業は1アポ単位の成果報酬ではなく、仕組みを作って動かし続ける契約形態です。費用は初期費用・月額費用・実費で構成され、対象範囲と件数で変わります。PoCは100〜300万円が目安で、本番導入は要件に応じて個別にお見積もりします。' },
      { q: 'AI営業にすると営業担当は不要になりますか？', a: 'なりません。AIが担うのは商談にたどり着くまでの前工程で、商談と提案は人が担います。前工程から解放されることで、商談の準備に時間を使えるようになります。' },
    ],
    service: { href: '/service/ai-sales', label: 'AI営業' },
  },
  {
    slug: 'salesforce-standard-ai-vs-custom',
    title: 'Salesforceの標準AI機能と個別開発、どちらを選ぶか',
    description: 'SalesforceでAIを使うときの「標準のAI機能（Agentforceなど）を使うか、外部のAIを連携して個別に作るか」の判断を、費用の構成・判断の材料・進め方で整理します。',
    lead: 'SalesforceでAIを活用する方法は、大きく「Salesforce標準のAI機能を使う」と「外部のAIをAPIで連携して個別に作る」に分かれます。どちらが合うかは、対象の業務とデータの整い方で決まります。',
    table: {
      caption: '標準AI機能と個別開発の比較',
      head: ['比較の観点', '標準のAI機能（Agentforceなど）', '外部AIの連携（個別開発）'],
      rows: [
        ['必要なもの', '該当するライセンス（Salesforceと直接契約）', '連携の開発。構成によってはライセンス不要'],
        ['費用の中心', 'ライセンス費用（利用ユーザー数に連動）', '構築費用（業務の数・複雑さ・連携先の数で変動）'],
        ['向いている状況', '標準機能の範囲で対象業務をまかなえる', '基幹システム・Excel・他SaaSとの連携が必要、標準機能では足りない'],
        ['データの扱い', 'Salesforceの中で完結しやすい', '外に出さない構成も、限定した範囲だけを渡す構成も選べる'],
      ],
    },
    sections: [
      {
        heading: '判断の材料',
        list: [
          '対象とする業務の数と、その複雑さ',
          '標準機能で足りるか、個別開発が必要か',
          '連携する外部システムの数（基幹システム・Excel・他SaaS）',
          '利用ユーザー数（ライセンス費用に直結）',
        ],
      },
      {
        heading: '進め方',
        paragraphs: [
          '最初に「調査・判断」として、現状のデータと運用を確認し、標準機能で足りるか個別に作るかを決めます。入力されていないデータが多い場合は、入力の自動化から始めて、貯まったデータを示唆や実行に使う段階へ進めます。MGCはSalesforceのライセンスを再販していないため、どちらが安く済むかを利害なく比較してご提案します。',
        ],
      },
    ],
    faq: [
      { q: 'AgentforceやEinsteinのライセンスは必ず必要ですか？', a: '構成によります。標準のAI機能を使う場合は該当するライセンスが必要ですが、外部のAIをAPI経由で連携する構成なら不要なこともあります。' },
      { q: 'Salesforceのデータを外部のAIに渡すことになりますか？', a: '構成によって変わります。データを外に出さない構成も、限定した範囲だけを渡す構成も可能です。どの情報がどこまで出るのかを明示したうえで決めます。' },
    ],
    service: { href: '/service/salesforce-ai', label: 'Salesforce AI活用支援' },
  },
  {
    slug: 'ai-adoption-where-to-start',
    title: 'AI導入は何から始めるか — 最初の1業務の選び方と進め方',
    description: 'AI導入を何から始めるかを、社内の状況別の最初の一歩、最初に任せる1業務の選び方、業務の棚卸しからPoC・本番運用までの進め方で整理。研修とAIソリューションのどちらから始めるかの判断にも答えます。',
    lead: 'AI導入は、全社で一度に始めるより、1つの業務で効果を確かめてから広げるほうが判断しやすくなります。最初に決めるのは「どのツールを入れるか」ではなく、「社内にAIを使いこなす人がいるか」と「どの業務を、どこまでAIに任せるか」です。',
    table: {
      caption: '社内の状況別、最初の一歩',
      head: ['社内の状況', '最初の一歩', 'MGCの窓口'],
      rows: [
        ['AIを使いこなす人が社内にいない。何に使えるかが分からない', '経営者・従業員が、AIを業務に取り入れる基礎から実践までを学ぶ', 'AI活用リスキリング研修（1名398,000円（税込）・標準20時間）'],
        ['任せたい業務の候補はあるが、効果が見えない', '業務を棚卸しし、対象を1業務に絞ってPoCで効果を確かめる', 'AIソリューション（PoC 100〜300万円が目安）'],
        ['商談の前工程（リスト作成・初回接触・追客）に時間を取られている', '前工程をAIに任せる仕組みをつくり、商談と提案は人が担う', 'AI営業'],
        ['電話に出るたびに現場の作業が中断されている', '一次対応・要約・記録をAIに任せ、人に回す条件を決める', 'AI電話'],
        ['Salesforceへの入力が営業担当の負担になっている', '標準AI機能で足りるか個別に作るかを判断し、入力の自動化から始める', 'Salesforce AI活用支援'],
      ],
    },
    sections: [
      {
        heading: '最初に任せる1業務の選び方',
        list: [
          '同じ種類の作業が繰り返し発生している',
          'AIに任せる範囲と、判断の基準を言葉にできる',
          '人が確認する箇所と、人に回す条件を決められる',
          '今の工数と件数を数えられ、効果を比べる基準がある',
          '今は向かない: 1件ごとに内容が大きく異なり、定型化できない',
        ],
      },
      {
        heading: '進め方と期間の目安',
        paragraphs: [
          '最初に業務を棚卸しし、AIを活かせる領域と優先順位を整理します。対象を1業務に絞り、今の工数と件数を数えて効果を見立てたうえで、要件・進め方・費用を、着手するかを判断できる形にまとめます。',
          'そのうえで、パイロット運用（PoC）で実際に動くもので効果を確かめます。期間の目安はパイロット運用が2〜4週間、本番運用が1〜3ヶ月です（スコープによって変わります）。PoCの費用は100〜300万円が目安で、本番導入は要件に応じて個別にお見積もりします。',
        ],
      },
      {
        heading: '研修とAIソリューション、どちらから始めるか',
        paragraphs: [
          '研修は、社内にAIを使いこなす土台をつくる段階です。AIソリューションは、業務の成果をつくる段階です。研修だけ、AIソリューションだけのご依頼も可能です。研修のあと業務への組み込みまで進める場合は、AIソリューションのPoCから進めます。',
        ],
      },
    ],
    faq: [
      { q: 'AI導入で最初にやるべきことは何ですか？', a: 'どの業務を、どこまでAIに任せるかを決めることです。業務を棚卸しして対象を1業務に絞り、今の工数と件数を数えて効果を見立てます。社内にAIを使いこなす人がいない場合は、研修から始める方法もあります。' },
      { q: '小さく試すことはできますか？', a: 'できます。「まず1業務から」のスモールスタートを推奨しており、2〜4週間のパイロット運用（PoC）で効果を確かめてから本格展開できます。PoCの費用は100〜300万円が目安です。' },
      { q: '相談の時点で、任せる業務が決まっていなくてもよいですか？', a: 'はい。業務の棚卸しから一緒に行います。初回相談・お見積もりまでは無料で、専門チームが一貫して担当します。' },
    ],
    service: { href: '/works/ai-solutions', label: 'AIソリューション' },
  },
];

const en: Guide[] = [
  {
    slug: 'ai-phone-vs-ivr-voicebot',
    title: 'AI phone vs IVR vs voicebot: differences and how to choose',
    description: 'How AI phones (voice AI), IVR and voicebots differ in how callers state their needs, what information is captured, records and handover to people — plus which calls suit an AI phone.',
    lead: "There are three common ways to automate first response on the phone: IVR (keypad menus like 'press 1'), voicebots (a general term for automated voice response) and AI phones (voice AI that understands natural speech). The differences show in how callers tell you what they need, and how calls are handed to people.",
    table: {
      caption: 'IVR vs AI phone (voice AI)',
      head: ['Aspect', 'IVR (keypad menus)', 'AI phone (voice AI)'],
      rows: [
        ['How callers state their need', 'Choose numbers through menus; stuck if nothing fits', 'Say it in their own words'],
        ['Information per exchange', 'One item per menu level', 'Need, date, name and number in one conversation'],
        ['Changing the flow', 'Re-record prompts and reconfigure', 'Edit the response policy'],
        ['What is recorded', 'Only which keys were pressed', 'Summary, recording and captured details'],
        ['Handover to people', 'Transfer by menu choice', 'Recognises calls that need a person and hands them over'],
      ],
    },
    sections: [
      { heading: 'Voicebots and AI phones', paragraphs: ["'Voicebot' covers all automated voice response, from scripted Q&A to systems that understand free speech; an AI phone is one kind. Compare on whether it understands what callers say freely, where summaries and records go, and whether you can set rules for handing calls to people."] },
      { heading: 'Calls that suit — and do not suit — an AI phone', list: ['Suits: the same kinds of inquiries come in repeatedly', 'Suits: answering the phone keeps interrupting on-site work', 'Suits: calls are missed after hours or at peak times', 'Not yet: most calls are emergencies or complaints', 'Not yet: every call is very different and cannot be standardised', 'Not yet: there is nobody to hand calls over to'] },
    ],
    faq: [
      { q: 'What is the main difference between IVR and an AI phone?', a: 'IVR routes callers to fixed choices by keypad; an AI phone understands what callers say in their own words, summarises it and hands it to the right person, capturing several details in one conversation.' },
      { q: 'Will we no longer need people to answer the phone?', a: 'No. Calls that need judgement, negotiation or urgent action are designed to go to people. The AI handles first response, summaries and records, and recognises which calls to pass on.' },
    ],
    service: { href: '/service/ai-phone', label: 'AI Phone' },
  },
  {
    slug: 'ai-sales-vs-telemarketing',
    title: 'AI Sales vs outsourced telemarketing: differences and how to choose',
    description: 'How AI Sales and outsourced telemarketing differ in who does the work, how contracts work, what you keep and how to compare them — plus which companies AI Sales suits.',
    lead: 'Outsourced telemarketing usually means people making calls, paid per appointment. AI Sales builds a system — target criteria, lists, messages and qualification rules — and AI keeps sending, following up and scheduling.',
    table: {
      caption: 'Outsourced telemarketing vs AI Sales (MGC)',
      head: ['Aspect', 'Outsourced telemarketing (typical)', 'AI Sales (MGC)'],
      rows: [
        ['Who does the work', "The agency's staff make calls", 'AI builds lists, writes tailored messages, sends, follows up and schedules, with human checks'],
        ['Contract', 'Often paid per appointment', 'Initial fee (design) + monthly fee (operation) + pass-through costs'],
        ['What you keep', 'Appointments', 'Appointments plus the system: target criteria, messages and contact data'],
        ['How to compare', 'Cost per appointment', 'Meeting quality and repeatability, not just cost per appointment'],
      ],
    },
    sections: [
      { heading: 'Who AI Sales suits', list: ['Suits: B2B, with target companies you can describe', 'Suits: meetings reliably turn into deals', 'Not yet: B2C with an unspecified audience', 'Not yet: no capacity to take more meetings'] },
    ],
    faq: [
      { q: 'Is AI Sales pay-per-appointment?', a: "No. MGC's AI Sales is a contract to build and run a system, with an initial fee, monthly fee and pass-through costs that depend on scope and volume. A PoC typically costs JPY 1–3 million; production rollout is quoted individually." },
    ],
    service: { href: '/service/ai-sales', label: 'AI Sales' },
  },
  {
    slug: 'salesforce-standard-ai-vs-custom',
    title: "Salesforce's built-in AI vs bespoke development: which to choose",
    description: 'How to decide between Salesforce built-in AI features (such as Agentforce) and connecting external AI through bespoke development: cost structure, decision factors and how to start.',
    lead: 'Using AI with Salesforce broadly means either using built-in AI features or connecting external AI via APIs. Which fits depends on the work and how complete your data is.',
    table: {
      caption: 'Built-in AI vs bespoke integration',
      head: ['Aspect', 'Built-in AI (e.g. Agentforce)', 'External AI integration'],
      rows: [
        ['What you need', 'The relevant licences (contracted with Salesforce)', 'Integration development; licences may not be needed'],
        ['Main cost', 'Licences (scale with users)', 'Build cost (scales with tasks, complexity and integrations)'],
        ['Suits', 'Built-in features cover the work', 'Needs links to core systems, Excel or other SaaS'],
      ],
    },
    sections: [
      { heading: 'How to start', paragraphs: ['We start with an assessment of your data and processes and decide whether built-in features are enough. MGC does not resell licences, so we compare the options without a conflict of interest.'] },
    ],
    faq: [
      { q: 'Do we always need Agentforce or Einstein licences?', a: 'It depends. Built-in AI needs the relevant licences, but connecting external AI via APIs may not.' },
    ],
    service: { href: '/service/salesforce-ai', label: 'Salesforce AI' },
  },
  {
    slug: 'ai-adoption-where-to-start',
    title: 'Where to start with AI adoption: choosing the first task and how to proceed',
    description: 'Where to start with AI adoption: the first step for your situation, how to choose the first task to hand to AI, and how we move from a task inventory to a PoC and production — plus whether to start with training or an AI solution.',
    lead: 'AI adoption is easier to judge when you prove the effect on one task before expanding, rather than starting company-wide. The first decision is not which tool to buy, but whether you have people who can use AI, and which task to hand to AI and how far.',
    table: {
      caption: 'The first step for your situation',
      head: ['Your situation', 'First step', 'MGC service'],
      rows: [
        ["No one in-house can use AI yet, or you don't know what it can do", 'Executives and staff learn from the basics to practical use of AI at work', 'AI reskilling training (JPY 398,000 incl. tax per person, 20 standard hours)'],
        ['You have candidate tasks but cannot see the effect', 'Inventory tasks, narrow to one and validate the effect in a PoC', 'AI solutions (PoC guide: JPY 1–3 million)'],
        ['Pre-sales work (lists, first contact, follow-ups) eats your time', 'Build a system where AI handles pre-sales and people run meetings and proposals', 'AI sales'],
        ['Field work is interrupted every time the phone rings', 'Let AI handle first response, summaries and records, and set the conditions for handing calls to people', 'AI phone'],
        ['Salesforce data entry burdens your sales team', 'Decide between built-in AI and custom builds, starting with automated data entry', 'Salesforce AI'],
      ],
    },
    sections: [
      { heading: 'Choosing the first task', list: ['The same kind of work recurs', 'You can describe the scope and decision criteria for AI', 'You can decide where people check and when work is handed to people', 'You can count current effort and volume to compare the effect', 'Not yet suited: every case differs widely and cannot be standardised'] },
      { heading: 'How we proceed, and how long it takes', paragraphs: ['We first inventory your tasks and prioritise where AI can help, narrow to one task, count current effort and volume, and summarise requirements, approach and cost so you can decide whether to proceed.', 'We then validate the effect with something that actually works in a pilot (PoC). As a guide, the pilot takes 2–4 weeks and production 1–3 months (depending on scope). A PoC is typically JPY 1–3 million; production is quoted individually.'] },
      { heading: 'Training or an AI solution first?', paragraphs: ['Training builds the in-house foundation for using AI; AI solutions create results in your operations. You can request either on its own. If you want to embed AI into operations after training, we start from an AI solution PoC.'] },
    ],
    faq: [
      { q: 'What should we do first when adopting AI?', a: 'Decide which task to hand to AI and how far. Inventory your tasks, narrow to one, and estimate the effect from current effort and volume. If no one in-house can use AI yet, you can start with training.' },
      { q: 'Can we start small?', a: 'Yes. We recommend starting with one task and validating the effect in a 2–4 week pilot (PoC) before scaling. A PoC is typically JPY 1–3 million.' },
      { q: "Is it fine if we haven't decided which task to hand over?", a: 'Yes. We start with the task inventory together. The first consultation and quote are free, and a dedicated team handles everything consistently.' },
    ],
    service: { href: '/works/ai-solutions', label: 'AI solutions' },
  },
];

export const guideContent: Record<Lang, { title: string; lead: string; guides: Guide[] }> = {
  ja: { title: '比較・選び方ガイド', lead: 'AIの導入でよく比べられる方法の違いと、選ぶときの観点を、表と短い文章でまとめています。', guides: ja },
  en: { title: 'Comparison guides', lead: 'Differences between commonly compared approaches to AI adoption, and what to look at when choosing.', guides: en },
};
export const GUIDE_SLUGS = ja.map((g) => g.slug);

// 公開日・内容の最終更新日（構造化データとページの表示に使う）。内容（表・本文・FAQ）を直したら modified を更新する。
// 関連コラムなどの自動で変わる欄は内容の更新に含めない
export const GUIDE_DATES: Record<string, { published: string; modified: string }> = {
  'ai-phone-vs-ivr-voicebot': { published: '2026-11-02', modified: '2026-11-02' },
  'ai-sales-vs-telemarketing': { published: '2026-11-02', modified: '2026-11-03' },
  'salesforce-standard-ai-vs-custom': { published: '2026-11-02', modified: '2026-11-02' },
  'ai-adoption-where-to-start': { published: '2026-11-04', modified: '2026-11-04' },
};
