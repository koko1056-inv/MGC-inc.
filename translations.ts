export type Lang = 'ja' | 'en';

export const translations = {
  ja: {
    nav: {
      works: '事業内容',
      services: 'サービス',
      companyGroup: '会社情報',
      diagnosis: 'AI診断',
      cases: '導入事例',
      training: '研修',
      column: 'コラム',
      blog: 'Journal',
      mission: '会社理念',
      company: '会社概要',
      career: '採用情報',
      contact: 'お問い合わせ',
    },
    hero: {
      title_1: 'AIとテクノロジーで、',
      title_2: '日本と世界',
      title_3: 'をつなぐ。',
      subtitle_en: 'Connect Japan & The World through AI and Tech.',
      desc: '私たちにとってAIは手段です。目的は、未来をより良くすること。\n企業のAI活用を、コンサルティングから開発・運用・研修まで一気通貫で支援します。',
      whatWeDo: '私たちがやっていること',
      chips: ['AIコンサルティング・研修', 'AI開発（音声・テキスト・CRM連携）', 'クロスボーダー事業（海外進出支援）'],
      viewProjects: '事業内容を見る',
      tryDiagnosis: '無料でAI活用診断',
      bookConsult: '30分の無料相談を予約',
      bookConsultSub: 'まずはお気軽にご相談ください',
    },
    whyMgc: {
      eyebrow: 'Why MGC',
      title: 'MGCが届ける、3つの価値',
      lead: 'AIはあくまで手段です。目的は、未来をより良くすること。私たちは独自の世界観と信念をもって、技術を世の中に届けます。',
      reasons: [
        {
          number: '01',
          title: 'スピード',
          desc: 'AIネイティブな組織だからこそ出せる速さで、価値を届けます。目の前のお客様の課題に、最短ルートで応えます。',
        },
        {
          number: '02',
          title: '世界中への展開',
          desc: '日本にとどまらず、世界へ。「日本と世界をつなぐ」ことを前提に、すべての事業を設計しています。',
        },
        {
          number: '03',
          title: '新しい発想',
          desc: '普通のやり方・既存の前提にとらわれず、独自の視点・世界観から生まれる、これまでにない発想を届けます。',
        },
      ],
      stats: [
        { value: '2', unit: '事業', label: 'AIソリューション / クロスボーダー事業' },
        { value: '3', unit: 'モダリティ', label: 'テキスト・音声・画像に対応するAIを構築' },
        { value: '2025', unit: '年設立', label: '京都から、日本と世界をつなぐ' },
      ],
    },
    oneStop: {
      eyebrow: 'One-Stop Support',
      title: 'コンサルティングから運用まで、一気通貫。',
      lead: '「作って終わり」にしません。戦略の立案から開発、運用、社内に定着させる研修まで、同じチームが最後まで伴走します。',
      steps: [
        { step: '01', title: 'ヒアリング・AIコンサルティング', desc: '業務を棚卸しし、AIを活かせる領域と優先順位を整理。経営課題に直結する打ち手から着手します。' },
        { step: '02', title: '要件定義・PoC', desc: '小さく試して効果を確かめる。対象業務を1つ選び、2〜4週間で実際に動くもので検証します。' },
        { step: '03', title: '開発・導入', desc: '音声・テキスト・CRM連携など、課題に合う形でAIを開発。既存システムへの統合まで担います。' },
        { step: '04', title: '運用・内製化研修', desc: '導入後の運用改善と、社内でAIを使いこなすための研修まで。成果が続く状態をつくります。' },
      ],
    },
    stack: {
      eyebrow: 'Coverage',
      title: '幅広い技術・ツールに対応',
      lead: '特定のベンダーやモデルに縛られません。お客様の課題と環境に合わせて、最適な組み合わせを選定します。',
      groups: [
        { label: '対応モダリティ', items: ['テキスト', '音声（電話・通話）', '画像', 'データ連携・自動化'] },
        { label: '連携ツールの例', items: ['Salesforce', 'kintone', 'Slack', 'Microsoft Teams', 'LINE', '各種基幹システム（API連携）'] },
        { label: 'AI基盤の例', items: ['Claude', 'GPT', 'Gemini', '用途に応じて最適なモデルを選定'] },
      ],
    },
    homeCTA: {
      eyebrow: 'Get Started',
      title: 'まずは、30分の無料相談から。',
      desc: '事業課題を伺い、AIで解決できる打ち手を一緒に設計します。\n自社のどこから始めるか、最短ルートで答えを出します。',
      primary: '無料相談を予約する',
      secondary: '事業内容を見る',
      foot: '※ 初回相談は完全無料です。提案書作成まで含めて無償でお見積もりいたします。',
    },
    floatingCta: {
      label: '無料相談',
      sub: '30分・無料',
    },
    homeCases: {
      eyebrow: 'Case Studies',
      title: '導入事例',
      lead: '実際に進行している案件です。社名は掲載許諾の手続き中のため伏せ、業種と進め方をご紹介します。',
      cta: '導入事例をすべて見る',
      detail: '詳しく見る',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'よくあるご質問',
      items: [
        {
          q: '料金体系を教えてください。',
          a: 'AIソリューションはプロジェクト単位のお見積もりが中心です。ご相談内容（対象業務・規模・期間）に応じて最適なプランをご提案しますので、まずは初回相談（無料）でお聞かせください。',
        },
        {
          q: '小さな業務から試したいのですが、可能ですか？',
          a: 'もちろん可能です。「まず1業務から」のスモールスタートを推奨しており、2〜4週間のパイロット運用で効果を検証してから本格展開できます。リスクを抑えてご導入いただけます。',
        },
        {
          q: '研修だけの依頼も可能ですか？',
          a: '可能です。経営層・管理職・現場それぞれに合わせたAI研修を単体でご提供しています。研修から始めて、コンサルティングや開発に広げるお客様も多くいらっしゃいます。',
        },
        {
          q: '既存のシステムと連携できますか？',
          a: 'できます。Salesforce・kintoneなどのCRM、Slack・Microsoft Teams・LINEなどのチャットツール、各種基幹システムとAPIで連携します。特定のベンダーに縛られず、お客様の環境に合う構成を選定します。',
        },
        {
          q: '導入までの期間はどれくらいですか？',
          a: 'スコープによりますが、パイロット運用は2〜4週間、本番運用は1〜3ヶ月が目安です。AIネイティブだからこそ出せるスピードで、事業価値を生み出すことを最優先に設計します。',
        },
        {
          q: '海外のプロダクトについて相談できますか？',
          a: 'はい。海外企業の日本総代理店として、海外の優れたプロダクトの日本市場での販売・サポートを行っています（ガジェット領域を中心に展開予定）。海外企業の日本参入のご相談もお受けします。',
        },
        {
          q: '日本企業の海外進出も支援していますか？',
          a: 'はい。クロスボーダー事業のOutbound（海外進出支援）として、市場調査・現地パートナー開拓から、越境ECや現地展開の実行までをご支援します。どの国・地域から始めるべきかのご相談から承ります。',
        },
        {
          q: '機密情報の取り扱いは安全ですか？',
          a: 'お客様ごとにデータを分離した設計を基本とし、認証・アクセス権限の管理、鍵情報の暗号化保管に対応しています。秘密保持契約（NDA）の締結も柔軟に対応します。',
        },
      ],
    },
    headings: {
      works: { title: '事業内容', sub: 'Our Services' },
      mission: { title: '会社理念', sub: 'MGC Way' },
      alliance: { title: 'アライアンス', sub: 'Alliance' },
      company: { title: '会社概要', sub: 'Corporate Profile' },
      career: { title: '採用情報', sub: 'Careers' },
      blog: { title: 'ジャーナル', sub: 'Journal' },
      contact: { title: 'お問い合わせ', sub: 'Contact' },
    },
    worksIntro: {
      eyebrow: "Services",
      lead: "MGCは、AIソリューション（コンサルティング・開発・運用・研修）と、クロスボーダー事業（Inbound/Outbound）の2つの事業で、AIとテクノロジーによって日本と世界をつなぎます。",
      indexLabel: "事業領域",
      detailLink: "詳しく見る",
    },
    works: {
      service_ai: {
        title: "AIソリューション",
        subtitle: "コンサルティングから開発・運用・研修まで、一気通貫。",
        desc: "「何にAIを使うべきか」の整理から、音声・テキスト・画像に対応するAIの開発、導入後の運用・社内研修まで。特定の技術に縛られず、課題に合うスタックを選んで、企業のAI活用を最後まで支援します。",
        items: [
          { title: "AI Consulting", sub: "AIコンサルティング", text: "業務プロセスを棚卸しし、AI導入の優先順位と現実的なロードマップを設計。経営課題に直結する打ち手から着手します。" },
          { title: "AI Development", sub: "AI開発（音声・テキスト・CRM連携）", text: "電話業務を代行する音声AI、CRMを操作するAI、アポイントを獲得する営業AIなど、業務を実際に代行するAIを開発します。" },
          { title: "Training & Enablement", sub: "運用・内製化研修", text: "導入して終わりにせず、運用の改善と、社員がAIを使いこなすための研修まで。成果が社内に受け継がれる状態をつくります。" }
        ]
      },
      service_lab: {
        title: "クロスボーダー事業",
        subtitle: "日本と世界の間で、双方向にビジネスをつなぐ。",
        desc: "海外の優れたプロダクトを日本市場へ届ける「Inbound」と、日本企業の海外進出を支援する「Outbound」。双方向のクロスボーダー事業で、ビジョン「日本と世界をつなぐ」を体現します。",
        items: [
          { title: "Inbound: Market Entry", sub: "海外企業 日本総代理店", text: "海外企業から日本における販売権を得て、日本市場での販売・カスタマーサポート・ローカライズまでを担います。" },
          { title: "Outbound: Global Expansion", sub: "日本企業の海外進出支援", text: "日本企業が海外市場に出ていくための、市場調査・現地パートナー開拓から、越境ECや現地展開の実行までを支援します。" },
          { title: "Bridge", sub: "日本と世界の橋渡し", text: "言語・商習慣・サポートのギャップをMGCが埋め、双方向の取引・進出がスムーズに進む状態をつくります。" }
        ]
      }
    },
    // Detailed Modal Content (JSX Text Parts)
    details: {
      service_ai: {
        title: "AIソリューション",
        subtitle: "コンサルティングから開発・運用・研修まで、一気通貫。",
        p1: "「何にAIを使うべきか」の整理から、音声・テキスト・画像に対応するAIの開発、導入後の運用・社内研修まで。\n特定の技術に縛られず、課題に合うスタックを選んで、企業のAI活用を最後まで支援します。",
        features: [
          { title: "AI Consulting", sub: "AIコンサルティング", text: "業務プロセスを棚卸しし、AI導入の優先順位とROI、現実的なロードマップを設計します。PoC倒れを起こさない投資判断を支援します。" },
          { title: "AI Development", sub: "AI開発（音声・テキスト・CRM連携）", text: "電話業務を代行する音声AI、CRMを適切なタイミングで操作するAI、アポイントを獲得する営業AI。Salesforce・kintoneなどのAPI連携を含め、業務に組み込まれて動くAIを開発します。" },
          { title: "Training & Enablement", sub: "運用・内製化研修", text: "経営層・管理職・現場それぞれに合わせた研修プログラムで、AIを「同僚」として使いこなせる組織文化を社内に残します。研修のみのご依頼も可能です。" }
        ]
      },
      service_lab: {
        title: "クロスボーダー事業",
        subtitle: "日本と世界の間で、双方向にビジネスをつなぐ。",
        p1: "海外の優れたプロダクトを日本市場へ届ける「Inbound」と、日本企業の海外進出を支援する「Outbound」。\n双方向のクロスボーダー事業で、ビジョン「日本と世界をつなぐ」を体現します。",
        features: [
          { title: "Inbound: Market Entry", sub: "海外企業 日本総代理店", text: "海外企業の日本総代理店として、日本市場での販売からカスタマーサポート、ローカライズまでを一気通貫で担います。" },
          { title: "Outbound: Global Expansion", sub: "日本企業の海外進出支援", text: "日本企業が海外市場に出ていくための、市場調査・現地パートナー開拓から、越境ECや現地展開の実行までを支援します。" },
          { title: "Bridge", sub: "日本と世界の橋渡し", text: "言語・商習慣・サポートのギャップをMGCが埋め、双方向の取引・進出がスムーズに進む状態をつくります。" }
        ]
      }
    },
    mission: {
      intro: {
        title: "AIとテクノロジーで、日本と世界をつなぐ。",
        desc: "AIは新しい技術ですが、あくまで手段でしかありません。目的は、未来をより良くすること。独自の世界観と信念を持って技術を世の中に届け、自分たちが実現したことが人から人へ受け継がれ、ずっと続いていく未来をつくります。",
        mission_title: "目の前の課題と、マクロな視点の両立",
        mission_desc: "目の前のお客様の課題を解決しながら、マクロ（中長期・広い）視点で「どこに技術を活かせば世界を良くできるか」を考え、実行する。「世の中に求められていくこと」を広い視点で捉え、AIをはじめとする技術の活かしどころを見定めます。"
      },
      values: [
        { title: "楽観主義", sub: "Optimism", desc: "未来は技術でより良くできると信じ、前向きに挑む。楽しく働けている状態を大切にする。" },
        { title: "誠実さ", sub: "Integrity", desc: "顧客にも仲間にも、ごまかさず真摯に向き合う。" },
        { title: "思考の枠を超える", sub: "Think Beyond", desc: "普通のやり方・既存の前提にとらわれず、独自の視点と新しい発想で考える。" },
      ]
    },
    company: {
      items: [
        { label: '商号', value: 'ＭＧＣ株式会社（MGC Inc.）' },
        { label: '代表者', value: '代表取締役 松尾 心夢' },
        { label: '所在地', value: '京都府京都市上京区西辰巳町111\nアビタシオンオンズアン106' },
        { label: '設立', value: '2025年12月' },
        { label: '法人番号', value: '4130001081155' },
        { label: '事業内容', value: 'AIソリューション（コンサルティング・開発・運用・研修）\nクロスボーダー事業（海外企業 日本総代理店・日本企業の海外進出支援）' },
        { label: 'お問い合わせ', value: 'kokomu.matsuo@mgc-global01.com' },
      ]
    },
    career: {
      mindsets: [
        { title: "Will・原動力", req: "「Why」を語れる偏愛家", desc: "内なる衝動や「なぜ」という問いから動ける。", ng: "受動的な優等生", ngDesc: "指示待ち、言われたことしかやらない。" },
        { title: "Grit・突破力", req: "壁を遊具と捉える「冒険心」", desc: "トラブルを面白がれるレジリエンス。", ng: "正解を求める性質", ngDesc: "正解がないと動けない。失敗を極度に恐れる。" },
        { title: "Time・時間感覚", req: "「今日」と「10年先」の複眼思考", desc: "今日の成果に全力を尽くしながら、10年先の視点で物事を考えられる。", ng: "目先の数字/夢想のみ", ngDesc: "目先の数字しか見えない、または夢だけで手が動かない。" },
        { title: "Humanity", req: "他者を裁かず、愛を持てる人", desc: "自分・他者・社会・歴史へのリスペクト。", ng: "他責・冷笑的", ngDesc: "他責思考、冷笑的な評論家タイプ。" },
      ],
      skills: [
        { title: "AI Native", sub: "AIを「同僚」にする力", desc: "AIを拡張ツールとして息をするように使う。", ng: "AIアレルギー (技術への好奇心がない)" },
        { title: "Global", sub: "異文化への敬意と適応力", desc: "異なる価値観の間に入り、滑らかに調整・融合できる。", ng: "語学力のみ/排他的 (中身がない、特定の価値観を押し付ける)" },
        { title: "Concept", sub: "「技術」を「文化」にする構想力", desc: "技術が生活をどう豊かにするか、ストーリーを描ける。", ng: "機能重視 (機能の話しかできない、人間への興味が薄い)" },
      ],
      intro: {
        desc: "既存の枠組みを疑い、AIという新たな武器を手に、世界を驚かせるプロダクトを共に実装する仲間を求めています。",
        call: "Are you the one?"
      },
      subheadings: {
        mindset: "Mindset / 求める資質",
        skills: "Competency / 必須技術"
      },
      cta: {
        title: "Are you ready?",
        desc: "考えるだけで終わらせず、手を動かして形にする。\nそんな仲間の「Why」を聞かせてください。",
        button: "採用に応募する"
      }
    },
    blog: {
      items: [
        {
          id: 12,
          date: "2026.06.25",
          category: "Build Notes",
          title: "Claude Codeで、SalesforceとKintoneに「手を動かすAI」をつなぐ",
          excerpt: "顧客企業のCRMをAIが操作・更新する——その実装を、Claude CodeとMCPでどう組むか。覚えない・繋がらない・続かないの壁を、現場で越えた記録。",
          content: "「AIにCRMを触らせる」と言うと、多くの人はチャットボットを思い浮かべる。だが現場で本当に必要なのは、会話することではなく、SalesforceやKintoneのレコードを「正しいタイミングで、正しく」更新してくれることだ。MGCのCRM操作AI事業は、この「手を動かす」部分を担っている。今回は、その実装にClaude Codeをどう使っているかを、隠さず書く。\n\nまず、汎用チャットがCRM運用でつまずく理由は3つに集約できる。覚えない（自社の項目定義や運用ルールを毎回説明し直す必要がある）、繋がらない（実際のレコードを読み書きできない）、続かない（一度の会話で終わり、定期実行や先回りができない）。この3つを越えない限り、どんなに賢いモデルでも「便利な相談相手」止まりになる。\n\n繋ぐ部分の中心がMCP（Model Context Protocol）だ。Claude Codeは、MCPサーバー経由で外部ツールのAPIを「道具」として呼び出せる。SalesforceならREST/Bulk APIとSOQL、KintoneならレコードのREST APIを、それぞれMCPサーバーとしてラップしてやれば、AIは「商談を検索する」「活動履歴を追記する」といった操作を、人間の代わりに実行できる。重要なのは、AIに生のDBを触らせるのではなく、「許可した操作だけ」を道具として渡すことだ。\n\nSalesforceとKintoneでは、設計の勘所が違う。Salesforceはオブジェクトとガバナ制限、OAuthのConnected App、Sandboxでの検証が要点になる。項目もリレーションも多く、SOQLの組み立てを誤ると無関係なレコードまで触りかねない。Kintoneはアプリ単位の権限とAPIトークンがシンプルな反面、アプリごとにスキーマが自由なので、「このアプリのステータスは何の値を取るのか」をAIに正しく覚えさせる工程が効く。どちらも、最初に「辞書」（項目定義・運用ルール）を読み込ませるかどうかで精度が段違いになる。\n\n安全に動かす設計は、機能より先に決める。具体的には3点。(1) 最小権限——AIに渡すAPIトークンや接続ユーザーは、触ってよいオブジェクト・アプリだけに絞る。(2) 監査ログ——いつ・どのレコードに・何をしたかを必ず残し、後から人が追える状態にする。(3) 承認ゲート——金額や顧客ステータスなど影響の大きい更新は、AIが下書きを作り、人が承認してから反映する。誠実さは、こういう仕組みに宿る。\n\nそして、いきなり全社でやらない。MGCが必ず勧めるのは「1業務 × 2〜4週間」のスモールスタートだ。たとえば「商談メモを音声から起こしてSalesforceの活動履歴に追記する」だけを、まず完璧にする。動くものを現場で2〜4週間まわし、会話で精度を磨いてから、対象業務・アプリ・拠点へ広げる。\n\nこの一連は、MGCのAIソリューション事業として、コンサルティングから開発・運用・研修まで一気通貫で提供している。今回のCRM連携は、その中核である「繋がる・手が動く」を、SalesforceとKintoneという日本の現場で最も使われるCRMで実証したものにあたる。\n\n最後に、これは特別な話ではない。APIがあるツールなら、同じやり方でAIに手を動かさせることができる。違いを生むのは、モデルの賢さよりも、辞書を整える地道さと、安全に運用する設計だ。私たちはそこに価値があると信じているし、この記録が、同じことに挑む誰かの最短ルートになればいい。"
        },
        {
          id: 11,
          date: "2026.04.09",
          category: "Claude Code",
          title: "AIに「チーム」を持たせる時代",
          excerpt: "Claude CodeのAgent Teams機能が、開発の概念を根本から変えようとしている。",
          content: "「一人で全部やる」時代は、もう終わった。これからは「AIにチームを持たせる」時代だ。\n\nClaude CodeにAgent Teams機能が搭載された。複数のClaudeセッションが自律的に並列作業し、リーダーがタスクを分配、チームメイトが独立して実行し、結果を統合する。セキュリティレビュー、テスト実行、コードレビュー——それぞれに専門のサブエージェントを定義し、再利用可能な「役割」として組み込める。\n\nAppleはXcode 26.3にMCPネイティブ対応を追加し、OpenAIもChatGPTにMCPトンネルを実装した。MCPはLinux Foundation傘下のAgentic AI Foundationが管理する業界標準となり、AIエージェントの「共通言語」になった。\n\nMGC Inc.では、この仕組みを実務に組み込んでいる。HP改修、記事生成、リサーチ、デプロイ——すべてがClaude Codeの中で完結する。Writeツールの大規模ファイル処理は60%高速化され、MCPツール結果は最大50万文字まで保持可能になった。\n\n2026年4月4日からは、サードパーティ連携でのサブスクリプション制限も撤廃された。もはやClaude Codeは「ツール」ではない。あなたの隣で働く、最強のAIチームそのものだ。"
        },
        {
          id: 10,
          date: "2026.02.19",
          category: "AI Strategy",
          title: "日本の営業AIの未来",
          excerpt: "営業AIの先駆者は海外、日本はどう動く？",
          content: "AIが営業の世界を席巻している中、SNSやニュースデータを駆使して広告ニーズをリアルタイムで探知するAIの事例が注目されています。しかし、日本の企業はまだ商談特化型AIの開発に至っていません。これは国際競争力を高めるための喫緊の課題と言えるでしょう。\n\nMGC Inc.では、営業AIの開発に力を注いでおり、国内でのリーダーシップを確立するために、国産の商談特化型AIの開発を推進しています。ローカルLLMの失敗パターンを解析する技術やRAGの精度を高めるデバッグツールなど、最先端の技術を駆使して、日本が世界に誇れるAIソリューションを提供することを目指しています。\n\n今こそ、日本の企業がそのポテンシャルをフルに発揮し、AI戦略を再構築する時です。MGC Inc.は、この新たな局面での先駆者として、未来を切り開く覚悟です。"
        },
        {
          id: 9,
          date: "2026.02.18",
          category: "AI Strategy",
          title: "AIを導入しない企業に未来はない",
          excerpt: "AIを活用しない企業は未来に取り残される。",
          content: "AIを導入することなくして、企業は未来に生き残れるだろうか？この問いに対する答えは、否である。大手企業でさえも、AIを活用しなければ業務の効率化を果たせず、競争から取り残されるだろう。\n\nアインHDが約1300店舗に生成AIを搭載した薬歴入力システムを導入する計画は、AIの力を活用することで、業務時間を半減させる革新的な一例だ。このような動きは、業界全体に変革をもたらす布石となる。\n\nITエンジニアとしての未来を考えると、AIツールを活用することがキャリアの向上につながる。ChatGPTやClaude Codeなどのツールは、エンジニアとしての価値を高めるための鍵となる。\n\nMGC Inc.は、AIを通じて業務の自動化を進め、より豊かな未来を築くビジョンを持っている。AIを活用しない選択肢はない！"
        },
        {
          id: 0,
          date: "2025.02.15",
          category: "Sales AI",
          title: "人間が電話しなくても売れる時代：AIで実現する、次世代営業の全自動化",
          excerpt: "リスト作成、メール送信、フォローアップ、CRM入力——これら全てをAIに任せたとき、営業担当者は何をすべきか。",
          content: "「営業は足で稼ぐもの」——その信仰こそが、日本の営業組織を非効率の泥沼に引きずり込んできた。\n\nターゲットリストの作成、パーソナライズされたアプローチメールの送信、返信がなければ自動フォローアップ、商談後のCRM入力——これら全てはAIが代替できる「実行業務」だ。MGC Inc.では、これらを完全に自動化したAI営業フローを構築している。アポイント獲得まで、人間の手を一切介さない。\n\n人間の営業担当者が集中すべきは「クロージング」と「信頼構築」だ。AIが選び抜いた有望リードに対し、人間が感情と論理で訴えかける。それだけに全力を注げる体制こそが、勝てる営業組織の姿だ。\n\nAIは競合に勝つためのツールではない。競合が存在する前提を壊すためのインフラだ。AIネイティブな営業設計に移行した企業が圧倒的な優位を取る——その分水嶺は、もう目の前に来ている。"
        },
        {
          id: 1,
          date: "2025.02.10",
          category: "AI Automation",
          title: "AIエージェントが「社員」になる日：OpenClawで実現する、眠らない組織の作り方",
          excerpt: "メールの確認、カレンダー管理、SNS投稿、データ分析——これらを一体のAIエージェントに任せたとき、組織は何倍速になるか。",
          content: "「AI導入」と言えば、多くの企業がまず思い浮かべるのはチャットボットや一部業務の自動化だ。だが、それは氷山の一角に過ぎない。\n\nMGC Inc.が実装しているのは、もっと根本的な変革だ。OpenClaw（AIエージェント基盤）を活用することで、メールの確認・返信、タスクの進捗管理、Slackへの自動通知、SNSのスケジュール投稿、週次レポートの自動生成——これら全てを、一人のAIエージェントが24時間365日、休まず実行する。\n\n人間が行うべき仕事とは何か。それは「判断」と「創造」だ。AIエージェントは、情報収集・整理・実行の部分を完全に引き受ける。人間は、その出力を見て、より高次元の意思決定に集中すればいい。\n\n「AIを使いこなす」から「AIに働かせる」へ。この発想の転換こそが、次世代のビジネスオペレーションの本質だ。眠らない社員、不満を言わない実行者、全ツールを横断するオペレーター——それがAIエージェントの正体である。"
        },
        {
          id: 2,
          date: "2025.02.01",
          category: "Voice AI",
          title: "エンジニア不要の音声革命：ElevenLabs × Lovableが証明する「創造の民主化」",
          excerpt: "プロダクトを作るのに、もうエンジニアは要らない。AIツールの組み合わせで、ビジョンを持つ全員が音声アプリを世に問える時代が来た。",
          content: "「良いアイデアはあるが、実装できる人間がいない」——この言い訳は、2025年に入って完全に消滅した。\n\nElevenLabs（世界最高峰の音声AI）とLovable(AIによるアプリ開発基盤）を組み合わせれば、コードを一行も書かずに、プロ品質の音声インタラクティブアプリを数時間で構築できる。コールセンター向けAI音声エージェント、音声でナビゲートするサービスアプリ、ユーザーの言葉に反応するコマーシャル——全てが、ノーコードで実装可能な現実だ。\n\nMGC Inc.は、この組み合わせをクライアントの「最速プロトタイピング」に活用している。アイデアを出した翌日には、実動するプロダクトのデモを見せられる。投資家への説明も、ユーザーテストも、市場検証も——全てが圧倒的に早くなった。\n\n技術の民主化は、単なる便利の話ではない。「思想を持った人間」が「技術の壁」を超えて、直接世界に問いかけられる時代の到来だ。ツールは揃った。あとは、あなたのビジョンだけが問われる。"
        },
        {
          id: 3,
          date: "2025.01.10",
          category: "Vision",
          title: "「声」の再定義：電話業務という\"負の遺産\"を、AIはどう解放するか",
          excerpt: "人間が電話番をする時代の終わり。AIがコンシェルジュとなり、人間は創造的な対話のみに集中する未来。",
          content: "「電話対応」は、企業の生産性を最も阻害する要因の一つです。理不尽なクレーム、繰り返される同じ質問、取次ぎのためだけの時間。MGC Inc.は、この「負の遺産」をAIによって完全に解放します。\n\n最新のVoice AIは、感情を理解し、文脈を読み取り、人間以上のホスピタリティで顧客をもてなします。人間は、AIが解決できない高度な判断や、心を通わせる対話だけに集中する。\n\n私たちが提供するのは、単なる自動応答システムではありません。企業の「声」そのものをアップデートし、ビジネスのスピードを極限まで加速させる、AI時代の新しいコミュニケーション・インフラです。"
        },
        {
          id: 4,
          date: "2025.01.05",
          category: "Product",
          title: "Tech × Art × Soul：次世代プロダクト開発における「三位一体」の哲学",
          excerpt: "機能競争の終焉。技術に美意識と魂を宿らせ、マーケティング自体を不要にするほどの引力を持つ。",
          content: "「機能」だけで差別化できる時代は終わりました。これからのプロダクトに必要なのは、Tech（技術）、Art（美意識）、そしてSoul（魂）の三位一体です。\n\n技術はあくまで表現の筆であり、そこにどんな絵を描くか（Art）、そしてなぜ描くのか（Soul）がなければ、人の心は動きません。スペックの高さではなく、手にした瞬間の「高揚感」をデザインする。\n\nMGC Inc.は、多額の広告費で無理やり売るマーケティングを否定します。プロダクトそのものが発する圧倒的な美しさとストーリー（引力）で、世界中のユーザーを自然と惹きつける。それが私たちの流儀です。"
        },
        {
          id: 5,
          date: "2024.12.28",
          category: "Global",
          title: "日本という枠を、最初から捨てる：Day1 Global戦略の必然性",
          excerpt: "「まずは国内」という思考停止が死を招く理由。MGCが京都にいながらシリコンバレーと同じ目線で世界を見る理由。",
          content: "「まずは日本で成功してから海外へ」——その順序思考こそが、日本のスタートアップをガラパゴス化させてきました。インターネットに国境がない以上、最初から世界市場（Day1 Global）を狙わない手はありません。\n\n言語の壁はAIが溶かしました。物流の壁はDXが低くしました。今、京都にいながらにして、ロンドンやニューヨークの顧客と直接取引できない理由は何一つありません。\n\nMGC Inc.は、日本の繊細な感性と精神性を最大の武器に、最初から世界80億人をターゲットにします。日本市場はその中の一部に過ぎません。ローカルに根を張り、グローバルに花を咲かせる。これが私たちの生存戦略であり、これからの日本企業があるべき姿です。"
        },
        {
          id: 6,
          date: "2024.12.20",
          category: "AI Trading",
          title: "眠れる巨人を、AIで叩き起こす：日本発グローバル展開の新解",
          excerpt: "日本の技術・資産を世界へ届けるために必要なのは、商社でもコンサルでもなく、「AIネイティブなオペレーション」への完全移行である。",
          content: "日本には、世界を驚かせる技術や伝統資産が山のように眠っています。しかし「良いものはいつか売れる」という信仰は、グローバル競争の現実において通用しません。問題は「品質」ではなく、「届け方」にあるのです。\n\n従来の商社モデルは、情報の非対称性と人脈という「アナログな壁」の上に成立していました。しかしAIは、この壁を根本から溶かします。ターゲット市場の需要データを瞬時に解析し、最適なパートナーを自動でスクリーニングし、パーソナライズされたアプローチを多言語で自動送信する——これら全てが、AIネイティブなオペレーションで実現できます。\n\nMGC Inc.が目指すのは、「日本の眠れる巨人」を世界市場で目覚めさせることです。匠の技術・独自素材・知的財産——国内では当たり前になってしまったそれらの価値が、海外では革命的なソリューションになり得ます。AIによる市場スキャン、言語の壁を越えたアウトリーチ、契約から物流までの一気通貫管理。これらを組み合わせることで、中小企業でさえ「グローバルプレイヤー」として戦える時代が来ています。\n\nこの「劇的によいもの」に生まれ変わったオペレーションこそが、日本の眠れる資産を世界へ届けるための最短ルートなのです。"
        }
      ]
    },
    contact: {
      eyebrow: "30分・無料",
      lead: "まずは30分、お話しませんか。",
      sub: "事業課題を伺い、AIで解決できる打ち手を一緒に設計します。初回相談・提案書作成まで無料です。",
      bullets: [
        "AIコンサルティング・AI研修のご相談",
        "AI開発（音声AI・CRM操作AI・営業AIなど）のご相談",
        "海外プロダクトの導入・日本市場参入のご相談",
        "日本企業の海外進出支援のご相談",
      ],
      form: {
        name: "お名前",
        namePlaceholder: "山田 太郎",
        email: "メールアドレス",
        emailPlaceholder: "your@example.com",
        company: "会社名",
        companyPlaceholder: "株式会社○○",
        topic: "ご相談内容",
        topicOptions: [
          "AI営業（アポイント獲得の自動化）",
          "AI電話（音声AIによる一次対応）",
          "Salesforce・CRMのAI活用",
          "AIコンサルティング・研修",
          "AI開発（音声・テキスト・CRM連携）",
          "海外企業の日本市場参入（Inbound）",
          "日本企業の海外進出支援（Outbound）",
          "その他・複合的なご相談",
        ],
        message: "詳細メッセージ（任意）",
        messagePlaceholder: "現在の課題や、ご希望の進め方など、自由にお書きください。",
        submit: "無料相談を申し込む",
        sending: "送信中…",
        success: "ありがとうございます。1営業日以内にご返信いたします。",
        privacyNote: "送信いただいた情報は、ご相談対応の目的のみに使用します。",
        thanks: {
          eyebrow: "Thank you",
          title: "送信しました",
          lead: "お問い合わせありがとうございます。担当者が内容を確認し、1営業日以内にご返信いたします。",
          nextTitle: "このあとの流れ",
          steps: [
            "内容を確認し、1営業日以内にメールでご返信します。",
            "30分のオンライン相談で、現状と課題を伺います。",
            "どこからAIに任せられるかを整理し、進め方をご提案します。",
          ],
          linksTitle: "あわせてご覧ください",
          caseLink: "導入事例を見る",
          columnLink: "業界別コラムを読む",
          homeLink: "トップページへ戻る",
        },
      }
    },
    training: {
      hero: {
        badge: 'ITに詳しくない方のための実践型OFF-JT研修',
        title: 'AI活用リスキリング研修',
        titleSub: '― AIを「従業員」として雇い・育てる ―',
        lead: 'ITに詳しくない経営者・従業員が、AIを業務に導入・活用できるようになるための実践型研修（OFF-JT）。解説・業界別の実例・デモを通じて、基礎から実務での活用までを学びます。',
        cta: '資料請求・お問い合わせ',
      },
      course: {
        heading: 'コース例',
        eyebrow: 'Course',
        nameLabel: 'コース名（例）',
        overviewLabel: 'どんな訓練か',
        items: [
          {
            name: 'AI活用リスキリング研修（基礎〜実践）',
            overview: 'AIの全体像から、データ連携による業務での戦力化までを、解説・業界別の実例・デモで学ぶOFF-JT（通常の業務を離れて行う実践型の座学・演習）です。',
            specs: [
              { label: '対象', value: '経営者、管理者、従業員（AIを業務に取り入れたい方）' },
              { label: '実施形態', value: '通学（対面）／オンライン（同時双方向）' },
              { label: '受講料', value: '1名 398,000円（税込）' },
              { label: '標準時間', value: '20時間（OFF-JT）' },
              { label: '主なテーマ', value: 'AIツールの全体像／生成AI・AIエージェントの使い分け／データ連携（API）による業務活用／セキュリティと権限設計／業務への適用の考え方' },
            ],
          },
          {
            name: 'DX推進・生成AI活用人材養成講座',
            overview: '社内のDXを進める中心人物を育てる講座です。業務の棚卸しからデジタル化・自動化の設計、生成AIを使った実装と定着までを、演習を交えて学ぶOFF-JTです。',
            specs: [
              { label: '対象', value: 'DX推進の担当者・候補者、部門のリーダー層、情報システム／企画部門の方' },
              { label: '実施形態', value: '通学（対面）／オンライン（同時双方向）' },
              { label: '受講料', value: '1名 398,000円（税込）' },
              { label: '標準時間', value: '20時間（OFF-JT）' },
              { label: '主なテーマ', value: 'DXの全体像と進め方／業務の棚卸しと課題の見つけ方／生成AIによる業務プロセスの再設計／ノーコード・自動化ツールの活用／社内定着と効果測定／情報セキュリティとルールづくり' },
            ],
          },
        ],
        note: '各コースは、受講いただくすべての企業に同一の内容・時間・費用で提供します。',
      },
      skills: {
        heading: 'この研修で習得できる知識・技能',
        eyebrow: 'Outcomes',
        items: [
          '主要なAIツールの種類と役割、業務での使い分けを説明できる',
          '生成AIを用いた文章作成・調査・要約・翻訳などの実務ができる',
          'AIエージェントに業務を任せ、成果物を作らせる進め方が分かる',
          'データをAPI連携し、業務の文脈を踏まえて働くAIとして活用する考え方が身につく',
          'AI活用時の情報セキュリティ・個人情報の扱い・権限設計の基礎を理解する',
          'どの業務に、どのデータをつないで、何を任せるかを自分の言葉で計画できる',
        ],
      },
      flow: {
        heading: '研修の進め方',
        eyebrow: 'Process',
        steps: [
          { no: '01', title: 'ヒアリング', desc: '現状の業務課題とAI活用の目的を整理します。' },
          { no: '02', title: '日程・実施方法の確定', desc: '受講者・日程・実施形態（対面／オンライン）を決めます。' },
          { no: '03', title: '研修実施（OFF-JT）', desc: '解説・業界別実例・デモで、基礎から実践まで学びます。' },
          { no: '04', title: '実践支援・振り返り', desc: '学んだ内容を業務で実践するための支援を行い、定着まで伴走します。' },
        ],
      },
      contact: {
        heading: 'お申し込み・資料請求',
        eyebrow: 'Contact',
        lead: '受講のご相談、日程のご希望など、お気軽にお問い合わせください。',
        corp: 'ＭＧＣ株式会社',
        rows: [
          { label: '所在地', value: '京都府京都市上京区西辰巳町111 アビタシオンオンズアン106' },
          { label: '電話', value: '090-8353-1056', href: 'tel:09083531056' },
          { label: 'メール', value: 'kokomu.matsuo@mgc-global01.com', href: 'mailto:kokomu.matsuo@mgc-global01.com' },
          { label: 'Web', value: 'https://mgc-global01.com/', href: 'https://mgc-global01.com/' },
        ],
        cta: '資料請求・お問い合わせ',
        ctaHref: '#contact',
      },
    },
    diagnosisBanner: {
      badge: '無料・所要3分・その場で結果',
      title: 'あなたの会社の\n「AI導入後」を、3分で見てみませんか？',
      lead: '業種と課題を入力するだけで、AIが最適な活用施策・導入後のワークフロー・削減できる工数とコストを、提案書レベルのレポートにしてその場でお返しします。',
      cta: '無料で診断する',
    },
    diagnosis: {
      hero: {
        badge: '無料・所要3分・その場で結果',
        title: 'AI活用診断',
        titleSub: '― あなたの会社のAI導入後を、その場で要件定義 ―',
        lead: '業種と今の課題を入力するだけ。AIが、あなたの会社に最適なAI活用施策・導入後のワークフロー・期待できる工数/コスト削減効果を、提案書レベルの診断レポートにして即座にお返しします。',
        points: ['完全無料', '登録不要・3分で完了', '要件定義ドラフト付き'],
      },
      form: {
        industry: '業種',
        industryPh: '例：製造業／士業／飲食／EC／不動産 など',
        employees: '従業員規模',
        selectPh: '選択してください',
        employeeOptions: ['1〜5名', '6〜20名', '21〜50名', '51〜100名', '100名以上'],
        business: '事業内容（任意）',
        businessPh: '例：金属加工部品の受託製造。見積り・請求・在庫管理が手作業。',
        challenges: '今の課題（複数選択可）',
        challengeOptions: ['問い合わせ対応に時間がかかる', '書類・資料作成が多い', '営業・見積りに工数がかかる', 'データ入力・集計が手作業', 'マーケ・集客を強化したい', '採用・教育が回らない', '在庫・受発注の管理', '属人化している業務が多い'],
        tools: '今使っているツール（任意）',
        toolsPh: '例：Excel／LINE／kintone／Shopify など',
        monthly: '関連する月間コスト・売上感（任意）',
        monthlyPh: '例：広告費 月30万／人件費 月200万 など',
        goal: '達成したいこと（任意）',
        goalPh: '例：問い合わせ対応を半分の時間に',
        contactHeading: '診断結果の送付先',
        name: 'お名前（任意）',
        company: '会社名（任意）',
        email: 'メールアドレス',
        emailError: '正しいメールアドレスを入力してください。',
        needIndustry: '業種または事業内容を入力してください。',
        genericError: '診断の生成に失敗しました。時間をおいて再度お試しください。',
        timeoutError: '診断に時間がかかっています。お手数ですが、もう一度お試しください。',
        submit: '無料で診断する',
        loading: 'AIが診断中…（最大30秒）',
        privacyNote: '入力内容はAI診断とご連絡のみに利用します。しつこい営業はいたしません。',
      },
      result: {
        eyebrow: 'AI Diagnosis Report',
        title: 'AI活用診断レポート',
        print: 'PDFで保存 / 印刷',
        hoursSaved: '想定削減工数',
        costReduction: '想定コスト削減',
        roi: '投資対効果（ROI）',
        perMonth: '/月',
        assumptions: '試算の前提',
        useCases: '推奨AI活用施策 TOP3',
        workflow: '導入後ワークフロー（Before / After）',
        before: 'Before（現状）',
        after: 'After（AI導入後）',
        requirements: '要件定義ドラフト',
        firstSteps: '最初の一歩',
        riskNotes: '注意点',
        ctaTitle: 'この診断をもとに、無料で相談しませんか？',
        ctaSub: '30分のオンライン相談で、診断結果の具体化と、御社に最適な進め方をご提案します。',
        ctaButton: '30分の無料相談を予約する',
        again: 'もう一度診断する',
      },
    },
    footer: {
      corp: 'ＭＧＣ株式会社（MGC Inc.）',
      address: '京都府京都市上京区西辰巳町111 アビタシオンオンズアン106',
      rights: '© 2026 MGC Inc. All Rights Reserved.',
    }
  },
  en: {
    nav: {
      works: 'Business',
      services: 'Services',
      companyGroup: 'Company',
      diagnosis: 'AI Diagnosis',
      cases: 'Case Studies',
      training: 'Training',
      column: 'Column',
      blog: 'Journal',
      mission: 'Mission',
      company: 'Company Profile',
      career: 'Careers',
      contact: 'Contact',
    },
    hero: {
      title_1: 'Connect',
      title_2: 'Japan & The World',
      title_3: 'through AI and Tech.',
      subtitle_en: 'Connect Japan & The World through AI and Tech.',
      desc: 'For us, AI is a means — the goal is to make the future better.\nWe support enterprise AI adoption end-to-end: consulting, development, operations, and training.',
      whatWeDo: 'What we do',
      chips: ['AI Consulting & Training', 'AI Development (Voice · Text · CRM)', 'Cross-Border Business (Global Expansion)'],
      viewProjects: 'View Services',
      tryDiagnosis: 'Free AI Diagnosis',
      bookConsult: 'Book a 30-min Free Consultation',
      bookConsultSub: 'Talk to us first',
    },
    whyMgc: {
      eyebrow: 'Why MGC',
      title: 'Three values we deliver',
      lead: 'AI is only a means. The goal is to make the future better — and we deliver technology with our own worldview and conviction.',
      reasons: [
        {
          number: '01',
          title: 'Speed',
          desc: 'We deliver value at the pace only an AI-native organization can — answering the challenges in front of our customers by the shortest path.',
        },
        {
          number: '02',
          title: 'Global Reach',
          desc: 'Not just Japan — the world. Every business we run is designed around connecting Japan and the world.',
        },
        {
          number: '03',
          title: 'Fresh Thinking',
          desc: 'Unbound by conventional methods and existing assumptions, we deliver ideas born from our own perspective and worldview.',
        },
      ],
      stats: [
        { value: '2', unit: 'Businesses', label: 'AI Solutions / Cross-Border Business' },
        { value: '3', unit: 'Modalities', label: 'AI built for text, voice, and image' },
        { value: '2025', unit: 'Founded', label: 'From Kyoto, connecting Japan and the world' },
      ],
    },
    oneStop: {
      eyebrow: 'One-Stop Support',
      title: 'From consulting to operations, end-to-end.',
      lead: "We don't build and leave. From strategy to development, operations, and the training that makes AI stick — the same team stays with you to the end.",
      steps: [
        { step: '01', title: 'Discovery & AI Consulting', desc: 'We audit your operations and map where AI helps most, starting with initiatives tied to business outcomes.' },
        { step: '02', title: 'Scoping & PoC', desc: 'Start small and prove value: pick one task and validate it with a working system in 2–4 weeks.' },
        { step: '03', title: 'Development & Rollout', desc: 'Voice, text, CRM integration — we build AI in the shape your problem needs, integrated with your existing systems.' },
        { step: '04', title: 'Operations & Training', desc: 'Post-launch improvement plus training that makes your team self-sufficient — so results keep compounding.' },
      ],
    },
    stack: {
      eyebrow: 'Coverage',
      title: 'A broad stack, chosen for your problem',
      lead: 'We are not tied to a specific vendor or model. We pick the best combination for your challenge and environment.',
      groups: [
        { label: 'Modalities', items: ['Text', 'Voice (phone & calls)', 'Image', 'Data & Automation'] },
        { label: 'Tools we integrate', items: ['Salesforce', 'kintone', 'Slack', 'Microsoft Teams', 'LINE', 'Core systems via API'] },
        { label: 'AI platforms', items: ['Claude', 'GPT', 'Gemini', 'Best model per use case'] },
      ],
    },
    homeCTA: {
      eyebrow: 'Get Started',
      title: 'Start with a 30-min free consultation.',
      desc: "We listen to your business challenge and co-design where AI can help.\nWe'll show you the shortest path to results, together.",
      primary: 'Book a Consultation',
      secondary: 'View Services',
      foot: 'First consultation is fully free — including a custom proposal at no charge.',
    },
    floatingCta: {
      label: 'Free Consult',
      sub: '30-min · free',
    },
    homeCases: {
      eyebrow: 'Case Studies',
      title: 'Case studies',
      lead: 'Projects we are actually running. Company names are withheld while permission to publish is arranged, so we describe the industry and the approach.',
      cta: 'See all case studies',
      detail: 'Read more',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'How is pricing structured?',
          a: 'AI Solutions engagements are quoted per project. We propose the best plan based on your scope, scale, and timeline — start with a free first consultation.',
        },
        {
          q: 'Can we start small with one task?',
          a: 'Absolutely. We recommend the "start with one task" small-start approach: a 2–4 week pilot validates impact before scaling, so you can adopt with minimal risk.',
        },
        {
          q: 'Can we ask for training only?',
          a: 'Yes. We offer standalone AI training programs tailored to executives, managers, and hands-on staff. Many clients start with training and expand into consulting or development later.',
        },
        {
          q: 'Can you integrate with our existing systems?',
          a: 'Yes. We integrate with CRMs such as Salesforce and kintone, chat tools like Slack, Microsoft Teams and LINE, and core systems via API. We are vendor-neutral — we choose the stack that fits your environment.',
        },
        {
          q: 'How long does deployment take?',
          a: 'Depending on scope: a pilot runs 2–4 weeks, and production rollouts take 1–3 months. We design for speed-to-value above all — the pace only an AI-native team can deliver.',
        },
        {
          q: 'Can we talk to you about overseas products?',
          a: 'Yes. As the exclusive Japan distributor for overseas companies, we sell and support outstanding global products in the Japanese market (starting with gadgets). We also welcome inquiries from overseas companies looking to enter Japan.',
        },
        {
          q: 'Do you also support Japanese companies expanding overseas?',
          a: "Yes. As the Outbound side of our Cross-Border Business, we support market research, local partner discovery, cross-border e-commerce, and local rollout execution. We're happy to start with which country or region makes sense for you.",
        },
        {
          q: 'Is our confidential data safe?',
          a: 'We isolate data per client by design, and support authentication, access controls, and encrypted key storage. NDA arrangements are flexible.',
        },
      ],
    },
    headings: {
      works: { title: 'Services', sub: 'What We Do' },
      mission: { title: 'MGC Way', sub: 'The Core Philosophy' },
      alliance: { title: 'Alliance', sub: 'Global Network Nodes' },
      company: { title: 'Profile', sub: 'Corporate Overview' },
      career: { title: 'Careers', sub: 'Join the Collective.' },
      blog: { title: 'Journal', sub: 'Thoughts & Vision' },
      contact: { title: 'Contact', sub: 'Start the Conversation' },
    },
    worksIntro: {
      eyebrow: "Services",
      lead: "Two businesses — AI Solutions (consulting, development, operations, training) and Cross-Border Business (Inbound/Outbound) — connecting Japan and the world through AI and tech.",
      indexLabel: "Domains",
      detailLink: "Learn more",
    },
    works: {
      service_ai: {
        title: "AI Solutions",
        subtitle: "Consulting, development, operations, and training — end-to-end.",
        desc: "From working out where AI should be used, to building AI that handles text, voice, and image, to post-launch operations and staff training. Vendor-neutral, end-to-end support for enterprise AI adoption. This is MGC's core business.",
        items: [
          { title: "AI Consulting", sub: "Strategy & prioritization", text: "We audit your operations and design a realistic roadmap with clear priorities, starting where it moves the business most." },
          { title: "AI Development", sub: "Voice · Text · CRM integration", text: "Voice AI that handles phone work, agents that operate your CRM, sales AI that books appointments — AI that actually does the work." },
          { title: "Training & Enablement", sub: "Operations & in-house training", text: "We don't stop at launch: operational improvement plus training, so results are passed on inside your team." }
        ]
      },
      service_lab: {
        title: "Cross-Border Business",
        subtitle: "Connecting business between Japan and the world, in both directions.",
        desc: "Inbound: bringing outstanding global products into the Japanese market. Outbound: helping Japanese companies expand overseas. A two-way cross-border business that embodies our vision of connecting Japan and the world.",
        items: [
          { title: "Inbound: Market Entry", sub: "Japan distributorship", text: "As the exclusive Japan distributor for overseas companies, we handle sales, customer support, and localization in the Japanese market." },
          { title: "Outbound: Global Expansion", sub: "Support for Japanese companies going global", text: "From market research and local partner discovery to running cross-border e-commerce and local rollout, we support Japanese companies expanding abroad." },
          { title: "Bridge", sub: "Bridging Japan and the world", text: "MGC closes the gaps in language, business practice, and support — making cross-border transactions and expansion smooth in both directions." }
        ]
      }
    },
    details: {
      service_ai: {
        title: "AI Solutions",
        subtitle: "Consulting, development, operations, and training — end-to-end.",
        p1: "From working out where AI should be used, to building AI that handles text, voice, and image, to post-launch operations and staff training.\nVendor-neutral, end-to-end support for enterprise AI adoption.",
        features: [
          { title: "AI Consulting", sub: "Strategy & prioritization", text: "We audit your operations and design a realistic roadmap with clear priorities and ROI — supporting investment decisions that don't end in PoC graveyards." },
          { title: "AI Development", sub: "Voice · Text · CRM integration", text: "Voice AI that handles phone work, agents that operate your CRM at the right moments, sales AI that books appointments. Including API integration with Salesforce, kintone and more — AI built into your actual operations." },
          { title: "Training & Enablement", sub: "Operations & in-house training", text: "Training programs tailored to executives, managers, and hands-on staff — building a culture where AI is treated as a colleague. Training-only engagements are welcome." }
        ]
      },
      service_lab: {
        title: "Cross-Border Business",
        subtitle: "Connecting business between Japan and the world, in both directions.",
        p1: "Inbound: bringing outstanding global products into the Japanese market. Outbound: helping Japanese companies expand overseas.\nA two-way cross-border business that embodies our vision of connecting Japan and the world.",
        features: [
          { title: "Inbound: Market Entry", sub: "Japan distributorship", text: "As the exclusive Japan distributor for overseas companies, we handle sales, customer support, and localization in the Japanese market end-to-end." },
          { title: "Outbound: Global Expansion", sub: "Support for Japanese companies going global", text: "From market research and local partner discovery to running cross-border e-commerce and local rollout, we support Japanese companies expanding abroad." },
          { title: "Bridge", sub: "Bridging Japan and the world", text: "MGC closes the gaps in language, business practice, and support — making cross-border transactions and expansion smooth in both directions." }
        ]
      }
    },
    mission: {
      intro: {
        title: "Connect Japan & The World through AI and Tech.",
        desc: "AI is new technology, but it is only a means. The goal is to make the future better. We deliver technology with our own worldview and conviction — building things that are passed on from person to person and last.",
        mission_title: "Solving today's problems with a macro view",
        mission_desc: "We solve the challenges in front of our customers, while thinking — from a macro, long-term perspective — about where technology can make the world better, and acting on it."
      },
      values: [
        { title: "Optimism", sub: "楽観主義", desc: "We believe technology can make the future better, and we take it on with a positive spirit — valuing a state where we genuinely enjoy our work." },
        { title: "Integrity", sub: "誠実さ", desc: "With customers and teammates alike, we engage sincerely — no glossing over." },
        { title: "Think Beyond the Frame", sub: "思考の枠を超える", desc: "Unbound by conventional methods and existing assumptions, we think with our own perspective and fresh ideas." },
      ]
    },
    company: {
      items: [
        { label: 'Company Name', value: 'MGC Inc. (ＭＧＣ株式会社)' },
        { label: 'CEO', value: 'Kokomu Matsuo' },
        { label: 'Headquarters', value: 'Kyoto, Japan' },
        { label: 'Established', value: 'December 2025' },
        { label: 'Corporate Number', value: '4130001081155' },
        { label: 'Business Domains', value: 'AI Solutions (Consulting / Development / Operations / Training)\nCross-Border Business (Japan Distributorship / Overseas Expansion Support)' },
        { label: 'Contact', value: 'kokomu.matsuo@mgc-global01.com' },
      ]
    },
    career: {
      mindsets: [
        { title: "Will / Drive", req: "The 'Why' Enthusiast", desc: "Moves from inner impulse and 'Why'.", ng: "Passive Elite", ngDesc: "Waiting for instructions. Only does what is told." },
        { title: "Grit / Breakthrough", req: "Adventurer treating walls as play", desc: "Resilience to enjoy trouble.", ng: "Seeking 'Right' Answers", ngDesc: "Cannot move without correct answer. FEAR of failure." },
        { title: "Time Sense", req: "Today & 10 Years Ahead", desc: "Gives today's work full effort while thinking on a 10-year horizon.", ng: "Short-term/Daydreamer", ngDesc: "Only sees immediate numbers OR dreams without action." },
        { title: "Humanity", req: "Judge not, Love others", desc: "Respect for self, others, society, history.", ng: "Cynic / Blame others", ngDesc: "External locus of control. Cynical critic." },
      ],
      skills: [
        { title: "AI Native", sub: "AI as a Colleague", desc: "Breathing AI as an extension tool.", ng: "AI Allergy (No curiosity for tech)" },
        { title: "Global", sub: "Respect & Adaptability", desc: "Smoothly coordinating/fusing between different values.", ng: "Language only / Exclusive (Pushing specific values)" },
        { title: "Concept", sub: "Tech to Culture", desc: "Storytelling how tech enriches life.", ng: "Function-oriented (No interest in humans)" },
      ],
      intro: {
        desc: "We are looking for partners to challenge existing frameworks and implement products that surprise the world with AI as a new weapon.",
        call: "Are you the one?"
      },
      subheadings: {
        mindset: "Mindset / Core Requirements",
        skills: "Competency / Required Skills"
      },
      cta: {
        title: "Are you ready?",
        desc: "Thinking isn't enough — we build.\nTell us your 'Why'.",
        button: "Apply Now"
      }
    },
    blog: {
      items: [
        {
          id: 12,
          date: "2026.06.25",
          category: "Build Notes",
          title: "Connecting Salesforce and Kintone to a 'Hands-On AI' with Claude Code",
          excerpt: "Letting AI operate and update a customer's CRM — how we wire it up with Claude Code and MCP. Field notes on getting past the walls of 'doesn't remember, doesn't connect, doesn't stick.'",
          content: "Say 'let AI touch the CRM' and most people picture a chatbot. But what operations actually need isn't conversation — it's records in Salesforce or Kintone being updated correctly, at the right moment. MGC's CRM Agent business owns exactly this 'hands-on' part. Here's how we use Claude Code to build it, written plainly.\n\nFirst, generic chat stumbles on CRM work for three reasons. It doesn't remember (you re-explain your field definitions and rules every time), it doesn't connect (it can't actually read or write your records), and it doesn't stick (one conversation and it's over — no scheduled runs, no proactive nudges). Until you clear all three, even the smartest model stays a 'helpful advisor' and no more.\n\nThe heart of connecting is MCP (the Model Context Protocol). Claude Code can call external tool APIs as 'tools' through an MCP server. Wrap Salesforce's REST/Bulk API and SOQL, or Kintone's record REST API, as MCP servers, and the AI can perform operations like 'search opportunities' or 'append to the activity log' on a human's behalf. The key: you don't hand the AI a raw database — you hand it only the operations you've explicitly allowed.\n\nSalesforce and Kintone differ in where the design effort goes. Salesforce centers on objects and governor limits, the OAuth Connected App, and validating in a Sandbox. With many fields and relationships, a malformed SOQL query can touch records you never intended. Kintone keeps per-app permissions and API tokens simple, but each app's schema is freeform — so the step that pays off is teaching the AI exactly what values 'status' takes in this app. For both, precision swings wildly on whether you first load the 'dictionary' (field definitions and operating rules).\n\nThe safety design comes before features. Three points specifically: (1) Least privilege — the API token or connected user you give the AI is scoped only to the objects and apps it may touch. (2) Audit logs — always record what was done to which record and when, so a human can trace it afterward. (3) Approval gates — high-impact updates like amounts or customer status are drafted by the AI and applied only after a human approves. Integrity lives in mechanisms like these.\n\nAnd we never roll out company-wide on day one. What MGC always recommends is a 'one task × 2–4 weeks' small start. Get just one thing perfect first — say, transcribing meeting notes from voice and appending them to a Salesforce activity log. Run the working thing in the field for 2–4 weeks, sharpen precision through conversation, then expand to more tasks, apps, and locations.\n\nWe deliver this whole flow as MGC's AI Solutions business — consulting, development, operations, and training, end-to-end. This CRM integration proves the core of it — connecting and acting — on Salesforce and Kintone, the CRMs most used on the Japanese front line.\n\nFinally, none of this is special. Any tool with an API can be made to let AI move its hands the same way. What makes the difference isn't the model's brilliance — it's the unglamorous work of preparing the dictionary, and the design that runs it safely. We believe that's where the value is, and we hope this record becomes the shortest path for someone taking on the same thing."
        },
        {
          id: 11,
          date: "2026.04.09",
          category: "Claude Code",
          title: "The Era of Giving AI Its Own Team",
          excerpt: "Claude Code's Agent Teams feature is rewriting what it means to develop software.",
          content: "The era of 'doing everything yourself' is over. Now it's time to give AI its own team.\n\nClaude Code launched Agent Teams. Multiple Claude sessions work autonomously in parallel — a leader distributes tasks, teammates execute independently, and results converge. Security review, test execution, code review — each gets a dedicated subagent defined as a reusable 'role.'\n\nApple added native MCP support to Xcode 26.3. OpenAI built MCP tunnels into ChatGPT. MCP is now an industry standard under the Linux Foundation's Agentic AI Foundation — the lingua franca of AI agents.\n\nAt MGC Inc., this architecture runs in production. Website updates, article generation, research, deployment — everything completes inside Claude Code. The Write tool processes large files 60% faster, and MCP tool results now persist up to 500K characters.\n\nAs of April 4, 2026, subscription limits for third-party integrations were removed entirely. Claude Code is no longer just a 'tool.' It's the most capable AI team working right beside you."
        },
        {
          id: 10,
          date: "2026.02.19",
          category: "AI Strategy",
          title: "Japan's Future in Sales AI",
          excerpt: "Pioneers in sales AI are abroad. Japan, what's next?",
          content: "In a world where AI dominates sales, an example of an AI detecting advertising needs in real-time using SNS and news data is making waves. Yet, Japanese companies have not developed negotiation-specialized AI. This is a pressing issue for enhancing international competitiveness.\n\nAt MGC Inc., we are focusing on developing sales AI and are pushing for the creation of domestic negotiation-specialized AI to establish leadership in Japan. By utilizing cutting-edge technologies such as analyzing failure patterns in local LLMs and enhancing RAG accuracy with debugging tools, we aim to offer AI solutions Japan can be proud of globally.\n\nNow is the time for Japanese companies to unleash their full potential and rebuild their AI strategies. As a front-runner in this new phase, MGC Inc. is ready to pave the way forward."
        },
        {
          id: 9,
          date: "2026.02.18",
          category: "AI Strategy",
          title: "AI: Transforming the Future",
          excerpt: "Embrace AI or face obsolescence.",
          content: "Can businesses survive without adopting AI? The answer is a resounding no. Even major corporations will find themselves left behind if they do not leverage AI to enhance operational efficiency.\n\nAin HD's plan to implement a generative AI-powered pharmaceutical record-keeping system across 1,300 stores is a groundbreaking example of how harnessing AI can halve working hours, setting the stage for industry-wide transformation.\n\nFor IT engineers considering their future, leveraging AI tools like ChatGPT and Claude Code is key to enhancing career value. These tools are crucial in advancing an engineer's worth in the modern tech landscape.\n\nMGC Inc. envisions a future where AI-driven automation leads to a more prosperous tomorrow. There is no alternative to embracing AI!"
        },
        {
          id: 0,
          date: "2025.02.15",
          category: "Sales AI",
          title: "Selling Without Picking Up the Phone: The Complete Automation of Sales with AI",
          excerpt: "List building, email outreach, follow-ups, CRM entry — when AI handles all of this, what should your salespeople actually do?",
          content: "'Sales is all about legwork' — this belief has dragged Japanese sales organizations into a swamp of inefficiency.\n\nBuilding target lists, sending personalized outreach emails, automated follow-ups when there's no reply, CRM entry after meetings — all of this is 'execution work' that AI can replace. MGC Inc. has built fully automated AI sales flows where no human touch is needed until the appointment is secured.\n\nWhat human salespeople should focus on is closing and trust-building. AI selects the most promising leads; humans bring emotion and logic to close the deal. That single-focus structure is what a winning sales organization looks like.\n\nAI is not a tool to beat competitors. It is infrastructure to destroy the premise that competitors exist. Companies that shift to AI-native sales design will gain overwhelming advantage — and that inflection point is right in front of us."
        },
        {
          id: 1,
          date: "2025.02.10",
          category: "AI Automation",
          title: "The Day AI Agents Become Employees: Building a 24/7 Organization with OpenClaw",
          excerpt: "Email management, calendar coordination, auto-posting, data analysis — what happens to your organization's velocity when a single AI agent handles all of this?",
          content: "When companies talk about 'AI adoption', most envision chatbots or partial automation. That's just the tip of the iceberg.\n\nMGC Inc. implements something more fundamental. Using OpenClaw (an AI agent platform), a single AI agent handles email monitoring and responses, task tracking, Slack notifications, social media scheduling, and automated weekly reports — all running 24/7 without rest.\n\nWhat should humans actually do? Judge and create. AI agents fully take over information gathering, organization, and execution. Humans can focus on higher-order decisions with the outputs AI surfaces.\n\nThe shift from 'using AI' to 'making AI work for you' — this mindset change is the essence of next-gen business operations. A tireless employee, an executor without complaints, an operator spanning all tools. That is what an AI agent truly is."
        },
        {
          id: 2,
          date: "2025.02.01",
          category: "Voice AI",
          title: "The No-Engineer Voice Revolution: How ElevenLabs × Lovable Proves the Democratization of Creation",
          excerpt: "You no longer need engineers to build a product. The era where anyone with a vision can ship a voice app has arrived.",
          content: "'Great idea, but no one to build it' — this excuse completely disappeared in 2025.\n\nCombining ElevenLabs (world-class voice AI) and Lovable (AI-powered app development), you can build a professional-grade interactive voice app in hours without writing a single line of code. AI voice agents for call centers, voice-navigated service apps, voice-reactive commercials — all achievable with no-code, today.\n\nMGC Inc. uses this combination for fastest-possible prototyping for clients. We can demo a working product the day after an idea is born. Investor pitches, user testing, market validation — everything accelerates dramatically.\n\nThe democratization of technology is not just about convenience. It is the arrival of an era where people with ideas can directly question the world without being blocked by technical walls. The tools are ready. What's left is only your vision."
        },
        {
          id: 3,
          date: "2025.01.10",
          category: "Vision",
          title: "Redefining 'Voice': How AI liberates from the legacy of phone operations",
          excerpt: "The end of human receptionists. A future where AI becomes a concierge, allowing humans to focus only on creative dialogue.",
          content: "'Phone support' is one of the biggest inhibitors of corporate productivity. MGC Inc. completely liberates this 'negative legacy' with AI.\n\nLatest Voice AI understands emotion, reads context, and welcomes customers with more hospitality than humans. Humans can focus only on creative judgment and heart-to-heart dialogue.\n\nWhat we provide is not a simple auto-response system. It is a new communication infrastructure for the AI era that updates a company's very 'voice' and pushes business speed to its limit."
        },
        {
          id: 4,
          date: "2025.01.05",
          category: "Product",
          title: "Tech × Art × Soul: The philosophy of 'Trinity' in next-gen product development",
          excerpt: "End of the feature war. Infusing aesthetics and soul into technology to create gravity that makes marketing itself unnecessary.",
          content: "The era where features alone differentiate is over. What next-gen products need is the trinity of Tech, Art, and Soul.\n\nTechnology is just a brush; without Art (aesthetics) and Soul (purpose), hearts won't move. We design 'excitement' at the first touch, not just high specs.\n\nMGC Inc. rejects marketing that forces products through massive ad spend. Products that naturally attract users worldwide through their own overwhelming beauty and story — that is our way."
        },
        {
          id: 5,
          date: "2024.12.28",
          category: "Global",
          title: "Discarding the 'Japan' frame from Day 1: The necessity of Global strategy",
          excerpt: "Why the 'Japan first' mindset leads to death. Why MGC looks at the world from Kyoto with the same eyes as Silicon Valley.",
          content: "'Japan first' has galapagos-ized Japanese startups. If there are no borders on the internet, there's no reason not to target the world market (Day1 Global) from the start.\n\nAI melted language barriers. DX lowered logistics walls. There's no reason not to deal directly with London or NY from Kyoto.\n\nMGC Inc. targets all 8 billion people on earth from day one, using Japan's refined sensibility as its greatest weapon. Japan is just one part of that. Root locally, bloom globally. This is our survival strategy."
        },
        {
          id: 6,
          date: "2024.12.20",
          category: "AI Trading",
          title: "Waking the Sleeping Giants with AI: A new solution for Japan's global expansion",
          excerpt: "Instead of trading houses or consultants, what's needed for Japan's global expansion is complete migration to 'AI-native operations'.",
          content: "Japan has tons of hidden gems. But the 'good products will sell' myth is long dead. What's needed is optimization and connection to global markets via AI-native operations.\n\nThe traditional trading-company model rested on information asymmetry and personal networks — analog walls. AI dissolves those walls instantly: real-time demand analysis, auto-screening of overseas partners, multilingual personalized outreach at scale.\n\nMGC Inc. wakes Japan's sleeping giants — artisan techniques, unique materials, IP — and brings them where they are most valued. Even SMBs can now compete as global players when AI handles market scanning, cross-language outreach, and end-to-end deal management.\n\nThis 'dramatically better' operating model is the shortest path to delivering Japan's hidden assets to the world."
        }
      ]
    },
    contact: {
      eyebrow: "30-min · Free",
      lead: "Let's start with a 30-minute conversation.",
      sub: "We listen to your business challenge and co-design where AI can help. First consultation and proposal are fully free.",
      bullets: [
        "AI consulting & training",
        "AI development (Voice AI / CRM Agent / Sales AI)",
        "Overseas products & Japan market entry (Inbound)",
        "Overseas expansion support for Japanese companies (Outbound)",
      ],
      form: {
        name: "Your name",
        namePlaceholder: "Taro Yamada",
        email: "Email",
        emailPlaceholder: "your@example.com",
        company: "Company",
        companyPlaceholder: "Acme Co., Ltd.",
        topic: "Topic",
        topicOptions: [
          "AI Consulting & Training",
          "AI Development (Voice / Text / CRM)",
          "Japan Market Entry (Inbound)",
          "Overseas Expansion Support (Outbound)",
          "Other / mixed topics",
        ],
        message: "Details (optional)",
        messagePlaceholder: "Tell us about your current challenges or how you'd like to proceed.",
        submit: "Request a Free Consultation",
        sending: "Sending…",
        success: "Thank you. We'll get back to you within one business day.",
        privacyNote: "We use your information only for responding to your inquiry.",
        thanks: {
          eyebrow: "Thank you",
          title: "Message sent",
          lead: "Thank you for reaching out. We will review your message and reply within one business day.",
          nextTitle: "What happens next",
          steps: [
            "We review your message and reply by email within one business day.",
            "A 30-minute online consultation to understand where you are today.",
            "We map what AI can take on and propose how to proceed.",
          ],
          linksTitle: "While you wait",
          caseLink: "See case studies",
          columnLink: "Read industry columns",
          homeLink: "Back to home",
        },
      }
    },
    training: {
      hero: {
        badge: 'Hands-on OFF-JT training for non-specialists',
        title: 'AI Reskilling Program',
        titleSub: '— Hire and raise AI as a member of your team —',
        lead: 'A hands-on training program (OFF-JT) that helps managers and employees who are not IT specialists introduce and use AI at work — from the foundations to putting AI to work, through lectures, industry examples, and demos.',
        cta: 'Request materials / Contact us',
      },
      course: {
        heading: 'Example courses',
        eyebrow: 'Course',
        nameLabel: 'Course name (example)',
        overviewLabel: 'What the training covers',
        items: [
          {
            name: 'AI Reskilling Program (Foundations to Practice)',
            overview: 'An OFF-JT course — lectures, industry examples, and demos — taking you from the big picture of AI to making AI a real working asset through data integration.',
            specs: [
              { label: 'Audience', value: 'Executives, managers, and employees who want to bring AI into their work' },
              { label: 'Format', value: 'In-person / Live online' },
              { label: 'Fee', value: '¥398,000 per participant (incl. tax)' },
              { label: 'Standard hours', value: '20 hours (OFF-JT)' },
              { label: 'Key themes', value: 'Overview of AI tools / Generative AI vs. AI agents / Using data via API / Security & permission design / How to apply AI to business processes' },
            ],
          },
          {
            name: 'DX Leadership & Generative AI Practitioner Program',
            overview: 'A program for the people who will drive DX inside your company. Through hands-on exercises, participants learn to map current work, design digitalization and automation, and implement and embed generative AI in daily operations.',
            specs: [
              { label: 'Audience', value: 'DX leads and candidates, department leaders, IT and planning teams' },
              { label: 'Format', value: 'In-person / Live online' },
              { label: 'Fee', value: '¥398,000 per participant (incl. tax)' },
              { label: 'Standard hours', value: '20 hours (OFF-JT)' },
              { label: 'Key themes', value: 'What DX is and how to drive it / Mapping work and finding bottlenecks / Redesigning processes with generative AI / No-code and automation tools / Driving adoption and measuring impact / Security and internal rules' },
            ],
          },
        ],
        note: 'Every course is offered to all companies on the same terms — same content, hours, and price.',
      },
      skills: {
        heading: 'Knowledge & skills you will gain',
        eyebrow: 'Outcomes',
        items: [
          'Explain the main types of AI tools and how to use each in your work',
          'Do real work with generative AI: writing, research, summarizing, translation',
          'Understand how to delegate tasks to AI agents and have them produce deliverables',
          'Grasp how to connect data via API so AI can work with business context',
          'Understand the basics of security, personal-data handling, and permission design',
          'Plan, in your own words, which tasks to hand off, connected to which data',
        ],
      },
      flow: {
        heading: 'How the training works',
        eyebrow: 'Process',
        steps: [
          { no: '01', title: 'Hearing', desc: 'We clarify your current operational challenges and goals for AI.' },
          { no: '02', title: 'Scheduling', desc: 'We confirm participants, dates, and the format (in-person / live online).' },
          { no: '03', title: 'Training (OFF-JT)', desc: 'Learn from foundations to practice through lectures, examples, and demos.' },
          { no: '04', title: 'Practice support & review', desc: 'We support putting what you learned into practice and stay with you until it sticks.' },
        ],
      },
      contact: {
        heading: 'Apply / Request materials',
        eyebrow: 'Contact',
        lead: 'Feel free to reach out about enrollment or preferred dates.',
        corp: 'MGC Inc.',
        rows: [
          { label: 'Address', value: '111 Nishitatsumi-cho, Kamigyo-ku, Kyoto, Japan' },
          { label: 'Phone', value: '090-8353-1056', href: 'tel:09083531056' },
          { label: 'Email', value: 'kokomu.matsuo@mgc-global01.com', href: 'mailto:kokomu.matsuo@mgc-global01.com' },
          { label: 'Web', value: 'https://mgc-global01.com/', href: 'https://mgc-global01.com/' },
        ],
        cta: 'Request materials / Contact us',
        ctaHref: '#contact',
      },
    },
    diagnosisBanner: {
      badge: 'Free · 3 minutes · Instant results',
      title: 'See what your company looks like\nafter AI — in 3 minutes',
      lead: 'Enter your industry and challenges, and our AI returns a proposal-grade report: the right use cases, your post-adoption workflow, and the hours and cost you can save.',
      cta: 'Run free diagnosis',
    },
    diagnosis: {
      hero: {
        badge: 'Free · 3 minutes · Instant results',
        title: 'AI Adoption Diagnosis',
        titleSub: '— See your post-AI workflow, defined on the spot —',
        lead: 'Just enter your industry and current challenges. Our AI instantly returns a proposal-grade report: the best AI use cases for your business, your post-adoption workflow, and the hours and cost you can expect to save.',
        points: ['Completely free', 'No sign-up · 3 minutes', 'Includes a requirements draft'],
      },
      form: {
        industry: 'Industry',
        industryPh: 'e.g. Manufacturing / Professional services / F&B / E-commerce',
        employees: 'Company size',
        selectPh: 'Please select',
        employeeOptions: ['1–5', '6–20', '21–50', '51–100', '100+'],
        business: 'What you do (optional)',
        businessPh: 'e.g. Contract manufacturing of metal parts; quotes, invoicing and inventory are manual.',
        challenges: 'Current challenges (select all)',
        challengeOptions: ['Inquiry handling takes too long', 'Lots of document/report creation', 'Sales & quoting is time-consuming', 'Manual data entry & aggregation', 'Want to strengthen marketing', 'Hiring & training overload', 'Inventory & ordering management', 'Too much tribal knowledge'],
        tools: 'Tools you use now (optional)',
        toolsPh: 'e.g. Excel / LINE / Shopify',
        monthly: 'Related monthly cost / revenue (optional)',
        monthlyPh: 'e.g. Ad spend ¥300k/mo; labor ¥2M/mo',
        goal: 'What you want to achieve (optional)',
        goalPh: 'e.g. Halve inquiry-handling time',
        contactHeading: 'Where to send your report',
        name: 'Name (optional)',
        company: 'Company (optional)',
        email: 'Email',
        emailError: 'Please enter a valid email address.',
        needIndustry: 'Please enter your industry or business.',
        genericError: 'Failed to generate the diagnosis. Please try again later.',
        timeoutError: 'The diagnosis is taking too long. Please try again.',
        submit: 'Run free diagnosis',
        loading: 'AI is analyzing… (up to 30s)',
        privacyNote: 'Your input is used only for the diagnosis and to contact you. No pushy sales.',
      },
      result: {
        eyebrow: 'AI Diagnosis Report',
        title: 'AI Adoption Diagnosis Report',
        print: 'Save as PDF / Print',
        hoursSaved: 'Est. hours saved',
        costReduction: 'Est. cost saved',
        roi: 'Return on investment',
        perMonth: '/mo',
        assumptions: 'Assumptions',
        useCases: 'Top 3 recommended AI use cases',
        workflow: 'Post-adoption workflow (Before / After)',
        before: 'Before (current)',
        after: 'After (with AI)',
        requirements: 'Requirements draft',
        firstSteps: 'First steps',
        riskNotes: 'Notes',
        ctaTitle: 'Want a free consultation based on this?',
        ctaSub: 'In a 30-minute online session we’ll turn this diagnosis into concrete next steps tailored to your company.',
        ctaButton: 'Book a free 30-min consultation',
        again: 'Run another diagnosis',
      },
    },
    footer: {
      corp: 'MGC Inc. (ＭＧＣ株式会社)',
      address: '111 Nishitatsumi-cho, Kamigyo-ku, Kyoto, Japan',
      rights: '© 2026 MGC Inc. All Rights Reserved.',
    }
  }
};
