export type Lang = 'ja' | 'en';

export const translations = {
  ja: {
    nav: {
      works: '事業内容',
      blog: 'Journal',
      mission: '会社理念',
      company: '会社概要',
      career: '採用情報',
      contact: 'お問い合わせ',
    },
    hero: {
      title_1: 'Connect',
      title_2: 'Japan & The World',
      title_3: 'through AI and Tech.',
      subtitle_en: 'Connect Japan & The World through AI and Tech.',
      desc: 'AIとテクノロジーで、日本と世界をつなぐ。\n私たちにとってAIは手段です。目的は、未来をより良くすること。独自の世界観と信念をもって技術を届け、人から人へ受け継がれていくものをつくります。',
      whatWeDo: '私たちがやっていること',
      chips: ['AIソリューション', '海外企業 日本総代理店', 'RKSYO（グッズAI生成）'],
      viewProjects: '事業内容を見る',
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
        { value: '3', unit: '事業', label: 'AIソリューション / 海外企業 日本総代理店 / RKSYO' },
        { value: '24/7', unit: '稼働', label: 'AIが電話・CRM・営業などの業務を代行' },
        { value: '2025', unit: '年設立', label: '京都から、日本と世界をつなぐ' },
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
          a: 'もちろん可能です。「まず1業務から」のスモールスタートを推奨しており、AIDE（AI秘書）は2〜4週間のパイロット運用で効果を検証してから本格展開できます。リスクを抑えてご導入いただけます。',
        },
        {
          q: '導入までの期間はどれくらいですか？',
          a: 'スコープによりますが、AIDEのパイロットは2〜4週間、本番運用は1〜3ヶ月が目安です。AIネイティブだからこそ出せるスピードで、事業価値を生み出すことを最優先に設計します。',
        },
        {
          q: '海外のプロダクトについて相談できますか？',
          a: 'はい。海外企業の日本総代理店として、海外の優れたプロダクトの日本市場での販売・サポートを行っています（ガジェット領域を中心に展開予定）。海外企業の日本参入のご相談もお受けします。',
        },
        {
          q: '機密情報の取り扱いは安全ですか？',
          a: 'AIDEはマルチテナント設計で企業ごとにデータを完全分離、認証ゲート・アクセス権限・鍵情報の暗号化保管に対応しています。秘密保持契約（NDA）の締結も柔軟に対応します。',
        },
      ],
    },
    headings: {
      works: { title: '事業内容', sub: 'Our Services' },
      mission: { title: '会社理念', sub: 'MGC Way' },
      internalOS: { title: '駆動エンジン', sub: 'Internal OS' },
      alliance: { title: 'アライアンス', sub: 'Alliance' },
      company: { title: '会社概要', sub: 'Corporate Profile' },
      career: { title: '採用情報', sub: 'Careers' },
      blog: { title: 'ジャーナル', sub: 'Journal' },
      contact: { title: 'お問い合わせ', sub: 'Contact' },
    },
    worksIntro: {
      eyebrow: "Services",
      lead: "MGCは、AIソリューション・海外企業 日本総代理店・RKSYOの3つの事業で、AIとテクノロジーによって日本と世界をつなぎます。",
      indexLabel: "事業領域",
      flagshipLabel: "旗艦プロダクト",
      detailLink: "詳しく見る",
      flagshipAnchor: "AIDEの詳細を見る",
    },
    works: {
      service_ai: {
        title: "AIソリューション",
        subtitle: "業務を代行・自動化するAIを、開発から運用まで。",
        desc: "電話対応・CRM入力・アポイント獲得といった、人手のかかる定型業務をAIで代行・自動化します。お客様の課題に合わせて開発から運用まで一気通貫で伴走する、MGCの主力事業です。",
        items: [
          { title: "Voice AI", sub: "音声AI（電話業務の代行）", text: "コールセンターなどの電話対応をAIが代行。人手に頼っていた電話業務を自動化し、現場をコア業務に集中させます。" },
          { title: "CRM Agent", sub: "CRM操作AI", text: "顧客企業のCRMを、適切なタイミングでAIが操作・更新。入力・更新の手作業から現場を解放します。" },
          { title: "Sales AI", sub: "営業AI（アポイント獲得）", text: "AIが営業活動を行い、アポイントを獲得。営業チームは商談とクロージングに集中できます。" }
        ]
      },
      service_lab: {
        title: "海外企業 日本総代理店",
        subtitle: "海外の優れたプロダクトを、日本市場へ。",
        desc: "海外企業から日本における販売権を得て、日本市場で販売する事業です。海外企業には日本参入の経路を、日本のお客様には世界の優れたプロダクトへのアクセスを提供します。ビジョン「日本と世界をつなぐ」を体現する事業のひとつです。",
        items: [
          { title: "Market Entry", sub: "日本市場への参入経路", text: "海外企業の日本総代理店として、日本市場での販売からサポート、ローカライズまでを担います。" },
          { title: "Curation", sub: "優れたプロダクトの目利き", text: "独自の視点で世界のプロダクトを発掘し、日本のお客様へ届けます。ガジェット領域を中心に展開予定です。" },
          { title: "Bridge", sub: "日本と世界の橋渡し", text: "言語・商習慣・サポートのギャップをMGCが埋め、海外企業と日本のお客様の双方にとってスムーズな取引を実現します。" }
        ]
      },
      service_trade: {
        title: "RKSYO",
        subtitle: "グッズのAI生成から製品化まで、一気通貫で。",
        desc: "グッズのデザインをAIで生成し、実際の製品にするところまでを支援する事業です。パートナー企業と連携し、AI生成ならではのスピードと新しい発想、そして「実際にモノになる」ところまでをワンストップで提供します。",
        items: [
          { title: "AI Design", sub: "AIによるデザイン生成", text: "AI生成ならではのスピードと新しい発想で、グッズのデザインを形にします。" },
          { title: "Production", sub: "製品化までつなぐ", text: "デザインを生成して終わりではなく、パートナー企業と連携して実際の製品に仕上げます。" },
          { title: "One-Stop", sub: "企画から製品まで一気通貫", text: "デザイン生成から製品化までをワンストップで支援。アイデアが「モノ」になるまで伴走します。" }
        ]
      }
    },
    aide: {
      badge: "Signature Product",
      number: "MGC.AIDE",
      title: "AIDE",
      tagline: "育てる、AI秘書。",
      subtitle: "普段使うチャットから呼び出せる、自社専用に育つAIエージェント。",
      lead: "ChatGPTのような汎用チャットは賢い。けれど自社の現場には「覚えない・繋がらない・続かない」という壁が残ります。AIDEは、その壁を超える、自社専用に育つAIエージェント・プラットフォームです。",
      pillarsTitle: "4つの力で、ただのチャットボットを「働く秘書」に変えます。",
      pillars: [
        { id: "01", title: "覚える", sub: "Remember", desc: "業務ルール・専門用語・ナレッジを学習。マニュアル/FAQ/過去資料を読み込み即戦力化。使うほど賢く育ちます。" },
        { id: "02", title: "繋ぐ", sub: "Connect", desc: "カレンダー・メール・CRM/SFA。自社ツールのAPIと双方向に連携し、実務にそのまま反映します。" },
        { id: "03", title: "動く", sub: "Act", desc: "定期実行・先回り通知・ワークフロー自走。指示待ちではなく、決めた仕事を自律的に実行します。" },
        { id: "04", title: "呼び出す", sub: "Invoke", desc: "LINE・社内チャット・音声から。新しいアプリも管理画面も不要。全員がすぐ使えます。" }
      ],
      flowTitle: "スモールスタートで、1業務から",
      flowLead: "いきなり全社展開は不要。まず1つの業務で成果を出し、効果を確かめながら広げます。",
      flow: [
        { step: "01", title: "ヒアリング", desc: "課題と対象業務を1つ選定。現状フローを整理します。" },
        { step: "02", title: "学習・連携設定", desc: "ナレッジ投入とツール連携。秘書を初期セットアップ。" },
        { step: "03", title: "試験運用", desc: "現場で2〜4週間試用。会話で精度を磨き込みます。" },
        { step: "04", title: "拡張・横展開", desc: "対象業務・部署・拠点へ。他テナントへも展開可能です。" }
      ],
      cta: {
        title: "まずは1業務から、AI秘書を育てませんか。",
        desc: "デモ・無料相談を承っています。自社のどの業務から始められるか、一緒に設計します。",
        button: "AIDEの相談をする"
      }
    },
    // Detailed Modal Content (JSX Text Parts)
    details: {
      service_ai: {
        title: "AIソリューション",
        subtitle: "業務を代行・自動化するAIを、開発から運用まで。",
        p1: "電話対応・CRM入力・アポイント獲得といった、人手のかかる定型業務をAIで代行・自動化します。\nお客様の課題に合わせて開発から運用まで一気通貫で伴走する、MGCの主力事業です。",
        features: [
          { title: "Voice AI", sub: "音声AI（電話業務の代行）", text: "コールセンターなどの電話対応をAIが代行。人手に頼っていた電話業務を自動化し、現場をコア業務に集中させます。" },
          { title: "CRM Agent", sub: "CRM操作AI", text: "顧客企業のCRMを、適切なタイミングでAIが操作・更新。入力・更新の手作業から現場を解放し、データの鮮度と精度を保ちます。" },
          { title: "Sales AI", sub: "営業AI（アポイント獲得）", text: "AIが営業活動を行い、アポイントを獲得します。営業チームは、人にしかできない商談とクロージングに集中できます。" }
        ]
      },
      service_lab: {
        title: "海外企業 日本総代理店",
        subtitle: "海外の優れたプロダクトを、日本市場へ。",
        p1: "海外企業から日本における販売権を得て、日本市場で販売する事業です。\n海外企業には日本参入の経路を、日本のお客様には世界の優れたプロダクトへのアクセスを提供します。",
        features: [
          { title: "Market Entry", sub: "日本市場への参入経路", text: "海外企業の日本総代理店として、日本市場での販売からカスタマーサポート、ローカライズまでを一気通貫で担います。" },
          { title: "Curation", sub: "優れたプロダクトの目利き", text: "独自の視点・世界観で世界のプロダクトを発掘し、日本のお客様へ届けます。ガジェット領域を中心に展開予定です。" },
          { title: "Bridge", sub: "日本と世界の橋渡し", text: "言語・商習慣・サポートのギャップをMGCが埋め、海外企業と日本のお客様の双方にとってスムーズな取引を実現します。" }
        ]
      },
      service_trade: {
        title: "RKSYO",
        subtitle: "グッズのAI生成から製品化まで、一気通貫で。",
        p1: "グッズのデザインをAIで生成し、実際の製品にするところまでを支援する事業です。\nパートナー企業と連携し、デザインのスピードと新しい発想、そして「実際にモノになる」ところまでをワンストップで提供します。",
        features: [
          { title: "AI Design", sub: "AIによるデザイン生成", p1: "デザインに、AIのスピードを。", text: "AI生成ならではのスピードと新しい発想で、グッズのデザインを形にします。従来の制作フローでは出てこなかったアイデアを、短時間で何案も生み出せます。" },
          { title: "Production", sub: "製品化までつなぐ", p1: "生成で終わらせない。", text: "デザインを生成して終わりではなく、パートナー企業と連携して実際の製品に仕上げます。「モノになる」ところまでが私たちの仕事です。" },
          { title: "One-Stop", sub: "企画から製品まで一気通貫", p1: "アイデアから、手元に届くまで。", text: "デザイン生成から製品化までをワンストップで支援。発注側は煩雑な調整から解放され、アイデアに集中できます。" }
        ]
      },
      product: {
        title: "Manifest Creativity",
        subtitle: "脳内のビジョンを、直接ソフトウェアへ変換する。",
        p1: "The barrier between idea and execution is gone.",
        text: "AIネイティブ時代において、技術はもはや障壁ではありません。重要なのは「何を創りたいか」という思想です。私たちは、情熱とアイデアを持つ個人が、AIという翼を使って自分の世界観をそのままプロダクトとして具現化し、世の中に問いかけることを可能にします。"
      },
      marketing: {
        title: "Global Marketing",
        subtitle: "コンテキストをハックし、文化的な摩擦を共感に変える。",
        p1: "Translation is utility. Localization is empathy.",
        text: "言語をただ置き換えるだけでは、人の心は動きません。私たちはターゲット市場の文化的背景（コンテキスト）を徹底的に解析。その土地の空気を吸い込んだかのような、自然で響くナラティブを構築します。"
      },
      trading: {
        title: "Curated Commerce",
        subtitle: "AIオペレーションで、物理と情報の距離を消し去る。",
        p1: "Delivering the unseen craft of Japan everywhere.",
        text: "日本の本当に良いものには、まだ世界が知らない物語があります。私たちはAIを活用した高度なオペレーションにより、従来の手法ではリーチできなかった地域やニッチな市場へ、日本のクラフトマンシップと美意識を届けます。"
      },
      vision: {
        title: "Minimal Organization.",
        subtitle: "Small Team, Giant Leaps.",
        p1: "Bloat is the enemy of speed.",
        text: "巨大な組織図は必要ありません。必要なのは、自律的に動き、決定し、実行できるエリートたちの小さな集合体です。MGC Inc.は組織の肥大化を拒み、個々の能力を最大化することで、世界規模の課題解決に挑みます。"
      }
    },
    mission: {
      internal_os: {
        lead: "MGC Inc.を動かす3つの駆動エンジン。これらは単なる事業ドメインではなく、私たちが世界を認識し、ハックするための独自の思考OSである。",
        os1: { title: "Manifest Creativity", desc: "脳内のビジョンを、直接ソフトウェアへ変換する。技術的な摩擦係数をゼロにする思考法。" },
        os2: { title: "Global Marketing", desc: "コンテキストをハックし、文化的な摩擦を「共感」に変える。ナラティブ設計のメソドロジー。" },
        os3: { title: "Curated Commerce", desc: "AIオペレーションで、物理と情報の距離を消し去る。見えない価値を届ける物流OS。" }
      },
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
        { label: '事業内容', value: 'AIソリューション（音声AI・CRM操作AI・営業AI）\n海外企業 日本総代理店\nRKSYO（グッズのAI生成〜製品化支援）' },
      ]
    },
    career: {
      mindsets: [
        { title: "Will・原動力", req: "「Why」を語れる偏愛家", desc: "内なる衝動や「なぜ」という問いから動ける。", ng: "受動的な優等生", ngDesc: "指示待ち、言われたことしかやらない。" },
        { title: "Grit・突破力", req: "壁を遊具と捉える「冒険心」", desc: "トラブルを面白がれるレジリエンス。", ng: "正解を求める性質", ngDesc: "正解がないと動けない。失敗を極度に恐れる。" },
        { title: "Time・時間感覚", req: "「今日」と「1000年」の複眼思考", desc: "今日死ぬ気で働き、1000年先のロマンを描く。", ng: "目先の数字/夢想のみ", ngDesc: "目先の数字しか見えない、または夢だけで手が動かない。" },
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
        desc: "評論家になるな。世界を変えるのは、いつだって手を動かす者だけだ。\nあなたの「Why」を聞かせてください。",
        button: "Join the Collective"
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
          content: "「AIにCRMを触らせる」と言うと、多くの人はチャットボットを思い浮かべる。だが現場で本当に必要なのは、会話することではなく、SalesforceやKintoneのレコードを「正しいタイミングで、正しく」更新してくれることだ。MGCのCRM操作AI事業は、この「手を動かす」部分を担っている。今回は、その実装にClaude Codeをどう使っているかを、隠さず書く。\n\nまず、汎用チャットがCRM運用でつまずく理由は3つに集約できる。覚えない（自社の項目定義や運用ルールを毎回説明し直す必要がある）、繋がらない（実際のレコードを読み書きできない）、続かない（一度の会話で終わり、定期実行や先回りができない）。この3つを越えない限り、どんなに賢いモデルでも「便利な相談相手」止まりになる。\n\n繋ぐ部分の中心がMCP（Model Context Protocol）だ。Claude Codeは、MCPサーバー経由で外部ツールのAPIを「道具」として呼び出せる。SalesforceならREST/Bulk APIとSOQL、KintoneならレコードのREST APIを、それぞれMCPサーバーとしてラップしてやれば、AIは「商談を検索する」「活動履歴を追記する」といった操作を、人間の代わりに実行できる。重要なのは、AIに生のDBを触らせるのではなく、「許可した操作だけ」を道具として渡すことだ。\n\nSalesforceとKintoneでは、設計の勘所が違う。Salesforceはオブジェクトとガバナ制限、OAuthのConnected App、Sandboxでの検証が要点になる。項目もリレーションも多く、SOQLの組み立てを誤ると無関係なレコードまで触りかねない。Kintoneはアプリ単位の権限とAPIトークンがシンプルな反面、アプリごとにスキーマが自由なので、「このアプリのステータスは何の値を取るのか」をAIに正しく覚えさせる工程が効く。どちらも、最初に「辞書」（項目定義・運用ルール）を読み込ませるかどうかで精度が段違いになる。\n\n安全に動かす設計は、機能より先に決める。具体的には3点。(1) 最小権限——AIに渡すAPIトークンや接続ユーザーは、触ってよいオブジェクト・アプリだけに絞る。(2) 監査ログ——いつ・どのレコードに・何をしたかを必ず残し、後から人が追える状態にする。(3) 承認ゲート——金額や顧客ステータスなど影響の大きい更新は、AIが下書きを作り、人が承認してから反映する。誠実さは、こういう仕組みに宿る。\n\nそして、いきなり全社でやらない。MGCが必ず勧めるのは「1業務 × 2〜4週間」のスモールスタートだ。たとえば「商談メモを音声から起こしてSalesforceの活動履歴に追記する」だけを、まず完璧にする。動くものを現場で2〜4週間まわし、会話で精度を磨いてから、対象業務・アプリ・拠点へ広げる。\n\nこの一連を、自社プロダクトAIDEとして製品化している。AIDEは「覚える・繋ぐ・動く・呼び出す」の4つで、ただのチャットボットを「働く秘書」に変える基盤だ。今回のCRM連携は、その「繋ぐ」「動く」を、SalesforceとKintoneという日本の現場で最も使われるCRMで実証したものにあたる。\n\n最後に、これは特別な話ではない。APIがあるツールなら、同じやり方でAIに手を動かさせることができる。違いを生むのは、モデルの賢さよりも、辞書を整える地道さと、安全に運用する設計だ。私たちはそこに価値があると信じているし、この記録が、同じことに挑む誰かの最短ルートになればいい。"
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
        "AIソリューション（音声AI・CRM操作AI・営業AI）のご相談",
        "海外プロダクトの導入・日本市場参入のご相談",
        "RKSYO（グッズのAI生成〜製品化）のご相談",
        "AIDE（AI秘書）のデモ・導入相談",
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
          "AIソリューション（音声AI・CRM操作AI・営業AI）",
          "海外企業 日本総代理店",
          "RKSYO（グッズのAI生成〜製品化）",
          "AIDE（AI秘書）",
          "その他・複合的なご相談",
        ],
        message: "詳細メッセージ（任意）",
        messagePlaceholder: "現在の課題や、ご希望の進め方など、自由にお書きください。",
        submit: "無料相談を申し込む",
        sending: "送信中…",
        success: "ありがとうございます。1営業日以内にご返信いたします。",
        privacyNote: "送信いただいた情報は、ご相談対応の目的のみに使用します。",
      }
    }
  },
  en: {
    nav: {
      works: 'Services',
      blog: 'Journal',
      mission: 'Mission',
      company: 'Company',
      career: 'Careers',
      contact: 'Contact',
    },
    hero: {
      title_1: 'Connect',
      title_2: 'Japan & The World',
      title_3: 'through AI and Tech.',
      subtitle_en: 'Connect Japan & The World through AI and Tech.',
      desc: 'For us, AI is a means — the goal is to make the future better.\nWe deliver technology with our own worldview and conviction, building things that are passed on from person to person and last.',
      whatWeDo: 'What we do',
      chips: ['AI Solutions', 'Japan Distributor for Global Products', 'RKSYO (AI-Generated Goods)'],
      viewProjects: 'View Services',
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
        { value: '3', unit: 'Businesses', label: 'AI Solutions / Japan Distributorship / RKSYO' },
        { value: '24/7', unit: 'Uptime', label: 'AI handling phone, CRM, and sales operations' },
        { value: '2025', unit: 'Founded', label: 'From Kyoto, connecting Japan and the world' },
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
          a: 'Absolutely. We recommend the "start with one task" small-start approach. AIDE (AI secretary) runs a 2–4 week pilot to validate impact before scaling. You can adopt with minimal risk.',
        },
        {
          q: 'How long does deployment take?',
          a: 'Depending on scope: an AIDE pilot runs 2–4 weeks, and production rollouts take 1–3 months. We design for speed-to-value above all — the pace only an AI-native team can deliver.',
        },
        {
          q: 'Can we talk to you about overseas products?',
          a: 'Yes. As the exclusive Japan distributor for overseas companies, we sell and support outstanding global products in the Japanese market (starting with gadgets). We also welcome inquiries from overseas companies looking to enter Japan.',
        },
        {
          q: 'Is our confidential data safe?',
          a: 'AIDE is multi-tenant by design, fully isolating data per company. We support auth gates, access controls, and encrypted key storage. NDA arrangements are flexible.',
        },
      ],
    },
    headings: {
      works: { title: 'Services', sub: 'What We Do' },
      mission: { title: 'MGC Way', sub: 'The Core Philosophy' },
      internalOS: { title: 'Internal OS', sub: 'MGC Internal Operating System' },
      alliance: { title: 'Alliance', sub: 'Global Network Nodes' },
      company: { title: 'Profile', sub: 'Corporate Overview' },
      career: { title: 'Careers', sub: 'Join the Collective.' },
      blog: { title: 'Journal', sub: 'Thoughts & Vision' },
      contact: { title: 'Contact', sub: 'Start the Conversation' },
    },
    worksIntro: {
      eyebrow: "Services",
      lead: "Three businesses — AI Solutions, Japan distributorship for global products, and RKSYO — connecting Japan and the world through AI and tech.",
      indexLabel: "Domains",
      flagshipLabel: "Signature Product",
      detailLink: "Learn more",
      flagshipAnchor: "Explore AIDE",
    },
    works: {
      service_ai: {
        title: "AI Solutions",
        subtitle: "AI that takes over and automates real operations — from build to run.",
        desc: "We build AI that takes over labor-intensive routine work — phone support, CRM entry, appointment setting. From development to operations, we stay with you end-to-end. This is MGC's core business.",
        items: [
          { title: "Voice AI", sub: "AI that handles phone operations", text: "AI takes over phone support such as call-center work, automating operations that used to depend on people and freeing your team for core work." },
          { title: "CRM Agent", sub: "AI that operates your CRM", text: "AI operates and updates your CRM at the right moments — freeing your team from manual entry while keeping data fresh and accurate." },
          { title: "Sales AI", sub: "AI that books appointments", text: "AI runs outbound sales activity and books appointments, so your sales team can focus on meetings and closing." }
        ]
      },
      service_lab: {
        title: "Japan Distributorship",
        subtitle: "Bringing outstanding global products to the Japanese market.",
        desc: "We acquire exclusive Japan sales rights from overseas companies and sell their products in the Japanese market — giving overseas companies a route into Japan, and Japanese customers access to the world's best products. One of the businesses that embodies our vision of connecting Japan and the world.",
        items: [
          { title: "Market Entry", sub: "A route into the Japanese market", text: "As the exclusive Japan distributor, we handle sales, customer support, and localization in the Japanese market." },
          { title: "Curation", sub: "An eye for outstanding products", text: "We discover global products through our own perspective and bring them to Japanese customers — starting with the gadget category." },
          { title: "Bridge", sub: "Bridging Japan and the world", text: "MGC closes the gaps in language, business practice, and support — making transactions smooth for overseas companies and Japanese customers alike." }
        ]
      },
      service_trade: {
        title: "RKSYO",
        subtitle: "From AI-generated goods design to finished products, end-to-end.",
        desc: "We generate goods designs with AI and support them all the way to becoming real products, working with partner companies. The speed and fresh ideas of AI generation, plus the follow-through to make things real — delivered as one service.",
        items: [
          { title: "AI Design", sub: "AI-generated design", text: "The speed and fresh ideas unique to AI generation, turned into goods designs." },
          { title: "Production", sub: "All the way to the product", text: "We don't stop at generation — together with partner companies, we turn designs into real products." },
          { title: "One-Stop", sub: "From idea to finished goods", text: "End-to-end support from design generation to production, so you can focus on the idea." }
        ]
      }
    },
    aide: {
      badge: "Signature Product",
      number: "MGC.AIDE",
      title: "AIDE",
      tagline: "The AI Secretary You Grow.",
      subtitle: "An AI agent you invoke from the chat tools you already use — built to learn and grow inside your business.",
      lead: "Generic chats like ChatGPT are smart. But three walls remain inside real operations — they don't remember, don't connect, and don't stick. AIDE is the AI agent platform built to break all three, grown specifically for your company.",
      pillarsTitle: "Four capabilities that turn a chatbot into a working secretary.",
      pillars: [
        { id: "01", title: "Remember", sub: "覚える", desc: "Learns your business rules, terminology, and knowledge. Manuals, FAQs, and past documents become operational from day one — and it gets smarter with use." },
        { id: "02", title: "Connect", sub: "繋ぐ", desc: "Calendar, email, CRM/SFA. Bidirectional integration with the tools you already use, so AI actions hit real operations." },
        { id: "03", title: "Act", sub: "動く", desc: "Scheduled execution, proactive nudges, autonomous workflows. It doesn't wait for instructions — it runs the work you defined." },
        { id: "04", title: "Invoke", sub: "呼び出す", desc: "From LINE, internal chat, or voice. No new app, no new login — everyone uses it instantly." }
      ],
      flowTitle: "Start small. One task at a time.",
      flowLead: "No need for a full company rollout. Prove value on one operation first, then expand confidently.",
      flow: [
        { step: "01", title: "Discovery", desc: "Pick one business problem. Map the current flow together." },
        { step: "02", title: "Setup", desc: "Inject knowledge, connect tools, configure the initial secretary." },
        { step: "03", title: "Pilot", desc: "2-4 week trial in the field. Sharpen precision through conversation." },
        { step: "04", title: "Scale", desc: "Expand to other operations, departments, locations — and other tenants." }
      ],
      cta: {
        title: "Start with one task. Grow your AI secretary.",
        desc: "Demos and free consultations available. Let's design where to start, together.",
        button: "Talk to us about AIDE"
      }
    },
    details: {
      service_ai: {
        title: "AI Solutions",
        subtitle: "AI that takes over and automates real operations — from build to run.",
        p1: "We build AI that takes over labor-intensive routine work — phone support, CRM entry, appointment setting.\nFrom development to operations, we stay with you end-to-end. This is MGC's core business.",
        features: [
          { title: "Voice AI", sub: "AI that handles phone operations", text: "AI takes over phone support such as call-center work, automating operations that used to depend on people and freeing your team for core work." },
          { title: "CRM Agent", sub: "AI that operates your CRM", text: "AI operates and updates your CRM at the right moments — freeing your team from manual entry while keeping data fresh and accurate." },
          { title: "Sales AI", sub: "AI that books appointments", text: "AI runs outbound sales activity and books appointments, so your sales team can focus on what only people can do — meetings and closing." }
        ]
      },
      service_lab: {
        title: "Japan Distributorship",
        subtitle: "Bringing outstanding global products to the Japanese market.",
        p1: "We acquire exclusive Japan sales rights from overseas companies and sell their products in the Japanese market.\nA route into Japan for overseas companies — and access to the world's best products for Japanese customers.",
        features: [
          { title: "Market Entry", sub: "A route into the Japanese market", text: "As the exclusive Japan distributor, we handle sales, customer support, and localization in the Japanese market end-to-end." },
          { title: "Curation", sub: "An eye for outstanding products", text: "We discover global products through our own perspective and worldview, and bring them to Japanese customers — starting with the gadget category." },
          { title: "Bridge", sub: "Bridging Japan and the world", text: "MGC closes the gaps in language, business practice, and support — making transactions smooth for overseas companies and Japanese customers alike." }
        ]
      },
      service_trade: {
        title: "RKSYO",
        subtitle: "From AI-generated goods design to finished products, end-to-end.",
        p1: "We generate goods designs with AI and support them all the way to becoming real products, working with partner companies.\nThe speed and fresh ideas of AI generation — plus the follow-through to make things real.",
        features: [
          { title: "AI Design", sub: "AI-generated design", p1: "Design at the speed of AI.", text: "The speed and fresh ideas unique to AI generation, turned into goods designs — producing in hours ideas that conventional workflows would never reach." },
          { title: "Production", sub: "All the way to the product", p1: "We don't stop at generation.", text: "Together with partner companies, we turn generated designs into real products. Making it real is part of the job." },
          { title: "One-Stop", sub: "From idea to finished goods", p1: "From idea to in your hands.", text: "End-to-end support from design generation to production — freeing you from coordination overhead so you can focus on the idea." }
        ]
      },
      product: {
        title: "Manifest Creativity",
        subtitle: "Converting visions directly into software.",
        p1: "The barrier between idea and execution is gone.",
        text: "In the AI-Native era, tech is no longer a barrier. The question is 'What do you want to create?'. We enable individuals with passion to manifest their worldview as products using AI wings."
      },
      marketing: {
        title: "Global Marketing",
        subtitle: "Hacking context to turn cultural friction into empathy.",
        p1: "Translation is utility. Localization is empathy.",
        text: "Replacing words doesn't move hearts. We thoroughly analyze the cultural context of target markets to build narratives that breathe the local air and resonate naturally."
      },
      trading: {
        title: "Curated Commerce",
        subtitle: "Eliminating distance between physical and information via AI ops.",
        p1: "Delivering the unseen craft of Japan everywhere.",
        text: "Japan's true gems have stories unknown to the world. We use advanced AI ops to deliver Japanese craftsmanship to niche markets unreachable by conventional means."
      },
      vision: {
        title: "Minimal Organization.",
        subtitle: "Small Team, Giant Leaps.",
        p1: "Bloat is the enemy of speed.",
        text: "No giant org charts needed. Just a small collective of autonomous elites who decide and execute. MGC Inc. rejects bloat and maximizes individual capability to tackle global challenges."
      }
    },
    mission: {
      internal_os: {
        lead: "Three engines driving MGC Inc. Not just business domains, but our proprietary Operating System to perceive and hack the world.",
        os1: { title: "Manifest Creativity", desc: "Converting visions directly into software. A mindset to reduce technical friction to zero." },
        os2: { title: "Global Marketing", desc: "Hacking context to turn cultural friction into empathy. Methodology of narrative design." },
        os3: { title: "Curated Commerce", desc: "Eliminating distance between physical and information via AI ops. Logistics OS delivering unseen value." }
      },
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
        { label: 'Business Domains', value: 'AI Solutions (Voice AI / CRM Agent / Sales AI)\nJapan Distributorship for Global Products\nRKSYO (AI-Generated Goods to Production)' },
      ]
    },
    career: {
      mindsets: [
        { title: "Will / Drive", req: "The 'Why' Enthusiast", desc: "Moves from inner impulse and 'Why'.", ng: "Passive Elite", ngDesc: "Waiting for instructions. Only does what is told." },
        { title: "Grit / Breakthrough", req: "Adventurer treating walls as play", desc: "Resilience to enjoy trouble.", ng: "Seeking 'Right' Answers", ngDesc: "Cannot move without correct answer. FEAR of failure." },
        { title: "Time Sense", req: "Today & 1000 Years", desc: "Work like you die today, Dream for 1000 years.", ng: "Short-term/Daydreamer", ngDesc: "Only sees immediate numbers OR dreams without action." },
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
        desc: "Don't be a critic. Only those who move their hands change the world.\nTell us your 'Why'.",
        button: "Join the Collective"
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
          content: "Say 'let AI touch the CRM' and most people picture a chatbot. But what operations actually need isn't conversation — it's records in Salesforce or Kintone being updated correctly, at the right moment. MGC's CRM Agent business owns exactly this 'hands-on' part. Here's how we use Claude Code to build it, written plainly.\n\nFirst, generic chat stumbles on CRM work for three reasons. It doesn't remember (you re-explain your field definitions and rules every time), it doesn't connect (it can't actually read or write your records), and it doesn't stick (one conversation and it's over — no scheduled runs, no proactive nudges). Until you clear all three, even the smartest model stays a 'helpful advisor' and no more.\n\nThe heart of connecting is MCP (the Model Context Protocol). Claude Code can call external tool APIs as 'tools' through an MCP server. Wrap Salesforce's REST/Bulk API and SOQL, or Kintone's record REST API, as MCP servers, and the AI can perform operations like 'search opportunities' or 'append to the activity log' on a human's behalf. The key: you don't hand the AI a raw database — you hand it only the operations you've explicitly allowed.\n\nSalesforce and Kintone differ in where the design effort goes. Salesforce centers on objects and governor limits, the OAuth Connected App, and validating in a Sandbox. With many fields and relationships, a malformed SOQL query can touch records you never intended. Kintone keeps per-app permissions and API tokens simple, but each app's schema is freeform — so the step that pays off is teaching the AI exactly what values 'status' takes in this app. For both, precision swings wildly on whether you first load the 'dictionary' (field definitions and operating rules).\n\nThe safety design comes before features. Three points specifically: (1) Least privilege — the API token or connected user you give the AI is scoped only to the objects and apps it may touch. (2) Audit logs — always record what was done to which record and when, so a human can trace it afterward. (3) Approval gates — high-impact updates like amounts or customer status are drafted by the AI and applied only after a human approves. Integrity lives in mechanisms like these.\n\nAnd we never roll out company-wide on day one. What MGC always recommends is a 'one task × 2–4 weeks' small start. Get just one thing perfect first — say, transcribing meeting notes from voice and appending them to a Salesforce activity log. Run the working thing in the field for 2–4 weeks, sharpen precision through conversation, then expand to more tasks, apps, and locations.\n\nWe've productized this whole flow as AIDE — our own product. With its four capabilities (Remember, Connect, Act, Invoke), AIDE turns a mere chatbot into a working secretary. This CRM integration is the 'Connect' and 'Act' parts, proven on Salesforce and Kintone — the CRMs most used on the Japanese front line.\n\nFinally, none of this is special. Any tool with an API can be made to let AI move its hands the same way. What makes the difference isn't the model's brilliance — it's the unglamorous work of preparing the dictionary, and the design that runs it safely. We believe that's where the value is, and we hope this record becomes the shortest path for someone taking on the same thing."
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
        "AI Solutions (Voice AI / CRM Agent / Sales AI)",
        "Overseas products & Japan market entry",
        "RKSYO (AI-generated goods to production)",
        "AIDE (AI secretary) demo & onboarding",
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
          "AI Solutions (Voice AI / CRM Agent / Sales AI)",
          "Japan Distributorship / Overseas Products",
          "RKSYO (AI-Generated Goods)",
          "AIDE (AI Secretary)",
          "Other / mixed topics",
        ],
        message: "Details (optional)",
        messagePlaceholder: "Tell us about your current challenges or how you'd like to proceed.",
        submit: "Request a Free Consultation",
        sending: "Sending…",
        success: "Thank you. We'll get back to you within one business day.",
        privacyNote: "We use your information only for responding to your inquiry.",
      }
    }
  }
};
