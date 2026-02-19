import React from 'react';
import { Globe, Zap, Layers, Mic, MessageSquare, Briefcase, Plane } from 'lucide-react';

export type Lang = 'ja' | 'en';

export const translations = {
  ja: {
    nav: {
      works: '事業内容',
      cases: '実績',
      blog: 'Journal',
      mission: '会社理念',
      company: '会社概要',
      career: '採用情報',
      contact: 'お問い合わせ',
    },
    hero: {
      title_1: 'Connect',
      title_2: 'Japan',
      title_3: '& The World.',
      subtitle_en: 'Updating the World with AI Intelligence.',
      desc: '日本の可能性を、世界の実装へ。\nテクノロジーで思考と国境の壁を溶かす、次世代のグローバル・ハブ。',
      viewProjects: 'プロジェクトを見る',
    },
    headings: {
      works: { title: '事業内容', sub: 'Our Works' },
      cases: { title: '導入事例', sub: 'Case Studies' },
      mission: { title: '会社理念', sub: 'MGC Way' },
      internalOS: { title: '駆動エンジン', sub: 'Internal OS' },
      alliance: { title: 'アライアンス', sub: 'Alliance' },
      company: { title: '会社概要', sub: 'Corporate Profile' },
      career: { title: '採用情報', sub: 'Careers' },
      blog: { title: 'ジャーナル', sub: 'Journal' },
      contact: { title: 'お問い合わせ', sub: 'Contact' },
    },
    works: {
      service_ai: {
        title: "Global One AI",
        subtitle: "世界をひとつの市場に変える、ワンストップAI",
        desc: "言葉の壁を越える「音声AI」と、未開拓の顧客へ届く「リーチAI」を統合。海外進出のハードルをゼロにし、あなたのビジネスを世界標準へ加速させます。",
        items: [
          { title: "Cross-Border Voice", sub: "その声は、国境を越えて響く。", text: "高精度の音声AIが、リアルタイムで言語の壁を解消。まるで母国語同士のように、現地のパートナーや顧客と深い信頼関係を築けます。" },
          { title: "Direct Global Reach", sub: "待っているだけでは出会えない顧客へ。", text: "独自のリーチAIが、世界中の企業データベースから最適なターゲットを抽出。アプローチまでを自動化し、商談の機会を最大化します。" },
          { title: "All-in-One Platform", sub: "海外展開を、もっとシンプルに。", text: "コミュニケーションから新規開拓まで、グローバルビジネスに必要なツールをワンストップで提供。" }
        ]
      },
      service_lab: {
        title: "Global X Lab",
        subtitle: "アイデアを、瞬速で世界の手のひらへ。",
        desc: "「開発」と「マーケティング」を掛け合わせ、国境の壁を突破する。世界中のライフスタイルをアップデートするプロダクトを生み出します。",
        items: [
           { title: "Agile for Global", sub: "世界最速の社会実装", text: "トレンドの波を逃さない超高速のアジャイル開発。MVPを短期間で市場へ投入し、フィードバックで進化させ続けます。" },
           { title: "Dev × Growth", sub: "開発と成長の融合", text: "プロダクト開発とグロースハックを分断させない。設計段階からマーケティング戦略を組み込みます。" },
           { title: "Borderless Experience", sub: "言葉はいらない体験", text: "言語や文化背景が異なる人々が、説明書なしで使えるUI/UXを追求します。" }
        ]
      },
      service_trade: {
        title: "Global Nexus Trade",
        subtitle: "技術の「適材適所」を、世界規模で創り出す。",
        desc: "日本の技術を世界へ、世界の革新を日本へ。国境によるミスマッチを解消し、埋もれていた価値を繋ぐ次世代技術トレーディング。",
        items: [
          { title: "Export: Value Optimization", sub: "価値の再配置", text: "日本の優れた知財（IP）や素材を発掘し、その価値が最も高く評価される海外パートナーへとマッチングさせます。" },
          { title: "Import: Global Solution", sub: "世界の知を実装", text: "世界中にある「既存の正解」を導入する。海外の先端テクノロジーを輸入し、日本企業のイノベーションを加速させます。" },
          { title: "Frictionless Process", sub: "取引の効率化", text: "複雑なライセンス契約や権利処理をAIが効率化。スピーディな取引を実現します。" }
        ]
      }
    },
    // Detailed Modal Content (JSX Text Parts)
    details: {
      service_ai: {
        title: "Global One AI",
        subtitle: "世界をひとつの市場に変える、ワンストップAI",
        p1: "言葉の壁を越える「音声AI」と、未開拓の顧客へ届く「リーチAI」を統合。海外進出のハードルをゼロにし、あなたのビジネスを世界標準へ加速させます。",
        features: [
          { title: "Cross-Border Voice", sub: "その声は、国境を越えて響く。", text: "高精度の音声AIが、リアルタイムで言語の壁を解消。まるで母国語同士のように、現地のパートナーや顧客と深い信頼関係を築けます。" },
          { title: "Direct Global Reach", sub: "待っているだけでは出会えない顧客へ。", text: "独自のリーチAIが、世界中の企業データベースから最適なターゲットを抽出。アプローチまでを自動化し、商談の機会を最大化します。" },
          { title: "All-in-One Platform", sub: "海外展開を、もっとシンプルに。", text: "コミュニケーションから新規開拓まで、グローバルビジネスに必要なツールをワンストップで提供。" }
        ]
      },
      service_lab: {
        title: "Global X Lab",
        subtitle: "アイデアを、瞬速で世界の手のひらへ。",
        p1: "「開発」と「マーケティング」を掛け合わせ、国境の壁を突破する。世界中のライフスタイルをアップデートするプロダクトを生み出します。",
        features: [
           { title: "Agile for Global", sub: "世界最速の社会実装", text: "トレンドの波を逃さない超高速のアジャイル開発。MVPを短期間で市場へ投入し、フィードバックで進化させ続けます。" },
           { title: "Dev × Growth", sub: "開発と成長の融合", text: "プロダクト開発とグロースハックを分断させない。設計段階からマーケティング戦略を組み込みます。" },
           { title: "Borderless Experience", sub: "言葉はいらない体験", text: "言語や文化背景が異なる人々が、説明書なしで使えるUI/UXを追求します。" }
        ]
      },
      service_trade: {
        title: "Global Nexus Trade",
        subtitle: "技術の「適材適所」を、世界規模で創り出す。",
        p1: "日本の技術を世界へ、世界の革新を日本へ。\n国境によるミスマッチを解消し、埋もれていた価値を「最も必要とされる場所」へと繋ぐ、次世代の技術トレーディング。",
        features: [
          { title: "Export: Value Optimization", sub: "価値の再配置", p1: "日本の技術に、新たな市場を。", text: "国内では成熟した技術も、世界にはそれを熱望する市場が存在します。日本の優れた知財（IP）や素材を発掘し、その価値が最も高く評価される海外パートナーへとマッチングさせます。" },
          { title: "Import: Global Solution", sub: "世界の知を実装", p1: "海外の革新を、日本の課題解決へ。", text: "ゼロから開発するのではなく、世界中にある「既存の正解」を導入する。海外の先端テクノロジーやソリューションを輸入し、日本企業のイノベーションを加速させます。" },
          { title: "Frictionless Process", sub: "取引の効率化", p1: "技術移転を、もっとスムーズに。", text: "複雑なライセンス契約、権利処理、ローカライズの壁を、専門チームとAIが効率化。アナログで時間のかかる貿易実務を刷新し、ビジネスチャンスを逃さないスピーディな取引を実現します。" }
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
        text: "巨大な組織図は必要ありません。必要なのは、自律的に動き、決定し、実行できるエリートたちの小さな集合体です。MGC inc.は組織の肥大化を拒み、個々の能力を最大化することで、世界規模の課題解決に挑みます。"
      }
    },
    cases: [
      {
        id: "01",
        category: "Voice AI Architecture",
        title: "Voice Agent Construction",
        desc: "コールセンターにおける一次応答・架電業務の完全AI化。小売店における予約受付の自動化を実装。",
        detail: "【コールセンター業務の完全自動化と高度化】\nTwilio（電話API）とElevenLabs（超自然な音声合成）、そしてLLMを高度に連携させることで、人間と区別がつかないレベルのAI電話対応を実現しました。\n\nコールセンターにおける一次応答から、AIへのエスカレーション対応までをシームレスに自動化。特筆すべきは、人間が対応している通話内容もAIがリアルタイムで聞き取り、自動要約を作成する機能です。\n\nこの要約データは自動的にCRMへ入力され、担当部署へのタスク連携も行われます。オペレーターの後処理時間（ACW）をほぼゼロにし、対応品質の均質化を実現しました。",
        tags: ["Voice Synthesis", "Twilio / ElevenLabs", "Real-time Processing"]
      },
      {
        id: "02",
        category: "Intelligent CS Bot",
        title: "Customer Support AI",
        desc: "介護業界、建材メーカー等における問い合わせ対応をRAG活用で自動化。Web/LINE上での高度な対話を実現。",
        detail: "【顧客対応と社内FAQの双方向DX】\n対外的な顧客サポート（Webチャット、LINE公式アカウント）の自動化に加え、社内向けの問い合わせ対応もAI化しました。\n\n「経費精算の手順は？」「就業規則の確認」といった社員からの質問に対し、RAG（検索拡張生成）技術を用いて社内マニュアルから最適な回答を即座に生成します。\n\n企業ごとの膨大なナレッジを学習させることで、「誰に聞けばいいかわからない」時間を排除し、組織全体の生産性を底上げしました。",
        tags: ["RAG", "Multi-modal Chatbot", "Knowledge Base Integration"]
      },
      {
        id: "03",
        category: "AI Native Transformation",
        title: "AI Consulting",
        desc: "最新ツール導入によるAIネイティブなビジネスモデルへの転換支援。業務プロセスの自動化ワークフロー開発。",
        detail: "【ヒアリングから実装まで、一気通貫の変革】\n単なるアドバイザリー業務ではありません。現場の課題ヒアリングから始まり、解決策の提案、そしてコードレベルでの実装までを一貫して行います。\n\n複数のSaaSツール間をAPI連携で繋ぎ合わせる自動化ワークフローの構築や、業務に特化した独自の社内システムのスクラッチ開発も実施。\n\nボトルネックとなっていた手作業をシステムに置き換え、企業が本来注力すべきコア業務にリソースを集中できる環境を構築します。",
        tags: ["DX Strategy", "Workflow Automation", "Business Modeling"]
      },
      {
        id: "04",
        category: "Cross-Border Matching",
        title: "AI Powered Export",
        desc: "アフリカ・欧州との連携をベースに、日本企業の製品・サービスを最適化してマッチング。市場選定のAI化。",
        detail: "【AIが即座に見つける、世界の最適パートナー】\nアフリカや欧州市場をメインターゲットに、日本企業の製品が「刺さる」パートナー企業をAIが自動選定します。\n\nLinkedInなどのビジネスデータベースを解析し、決裁権を持つキーマンを特定。さらに、その相手に合わせたパーソナライズされたアプローチ（コールドメール等）までも自動化します。\n\nマッチング成立後は、連携企業とともに輸出・契約面をサポート。テクノロジーによる開拓と、人間によるクロージングの融合で、海外進出の成功率を最大化させます。",
        tags: ["Global Matching Algorithm", "Market Entry", "Africa / Europe"]
      }
    ],
    mission: {
      internal_os: {
        lead: "MGC inc.を動かす3つの駆動エンジン。これらは単なる事業ドメインではなく、私たちが世界を認識し、ハックするための独自の思考OSである。",
        os1: { title: "Manifest Creativity", desc: "脳内のビジョンを、直接ソフトウェアへ変換する。技術的な摩擦係数をゼロにする思考法。" },
        os2: { title: "Global Marketing", desc: "コンテキストをハックし、文化的な摩擦を「共感」に変える。ナラティブ設計のメソドロジー。" },
        os3: { title: "Curated Commerce", desc: "AIオペレーションで、物理と情報の距離を消し去る。見えない価値を届ける物流OS。" }
      },
      intro: {
        title: "AI × Global Trading",
        desc: "AIを「未来のインフラ」として捉え、1000年続く人類の豊かさを実装する。",
        mission_title: "日本の精神で、未来のインフラを創る",
        mission_desc: "技術は変えても、文化と精神性は変えない。AIという最新のテクノロジーを使いながらも、それによって人間が退化（絶滅）するのではなく、むしろ「人間らしさ」が極大化されるような新しい社会システム（インフラ）を創る。"
      },
      values: [
        { title: "不易流行 (Fueki Ryuko)", sub: "技術を変え、文化を創る", desc: "技術は時代とともに変わるが、本質は変わらない。私たちはAIという最新の「流行」を追いながらも、その奥にある人々の幸せという「不易」を見失わない。目指すのは、単なる技術の実装ではない。10年、100年と続き、やがて人々の当たり前となる「文化」を創り出すことだ。" },
        { title: "四方よし (Future)", sub: "歴史と社会への愛", desc: "「売り手よし、買い手よし、世間よし」。私たちはそこに「未来よし」を加える。自分と他者、そして社会への愛を持ち、歴史に恥じない商いを行う。1000年後の人類が振り返ったとき、「この技術があってよかった」と感謝される価値だけを世界に届ける。" },
        { title: "志高実行 (Think Big)", sub: "問いと意志", desc: "すべての起点は「なぜ（Why）」という問いと、「なんとしてもやりたい（Will）」という志。評論家になるな。他者を評価する暇があるなら、己の手を動かせ。大きな夢を抱きながら、足元の一歩を積み重ねる者だけが、世界を変える。" },
        { title: "柔軟自在 (Be Agile)", sub: "壁を楽しむ", desc: "世界は広く、変化は速い。内側に閉じこもらず、外に目を向けよ。立ちはだかる壁は、成長のための遊び場だ。日本的な「和」の精神と、グローバルな「個」の強さを融合させ、しなやかに壁を越えていけ。" },
        { title: "一日一生 (Live for Today)", sub: "人生を主役に", desc: "仕事は、あなたの人生を豊かにするための「手段」である。会社のために己を殺すな。自分のために会社を生かせ。今日が最後の一日であるという覚悟（死生観）を持ち、悔いのない「今」を熱く生きろ。" },
      ]
    },
    company: {
      items: [
        { label: 'Company Name', value: 'MGC inc.' },
        { label: 'CEO', value: 'KOKOMU MATSUO' },
        { label: 'Headquarters', value: 'Kyoto, Japan' },
        { label: 'Established', value: '2025' },
        { label: 'Business Domains', value: 'AI Native Product Development\nGlobal Marketing Solution\nCurated Cross-border Trading' },
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
          id: 10,
          date: "2026.02.19",
          category: "AI Strategy",
          title: "日本の営業AIの未来",
          excerpt: "営業AIの先駆者は海外、日本はどう動く？",
          content: "AIが営業の世界を席巻している中、SNSやニュースデータを駆使して広告ニーズをリアルタイムで探知するAIの事例が注目されています。しかし、日本の企業はまだ商談特化型AIの開発に至っていません。これは国際競争力を高めるための喫緊の課題と言えるでしょう。\n\nMGC inc.では、営業AIの開発に力を注いでおり、国内でのリーダーシップを確立するために、国産の商談特化型AIの開発を推進しています。ローカルLLMの失敗パターンを解析する技術やRAGの精度を高めるデバッグツールなど、最先端の技術を駆使して、日本が世界に誇れるAIソリューションを提供することを目指しています。\n\n今こそ、日本の企業がそのポテンシャルをフルに発揮し、AI戦略を再構築する時です。MGC inc.は、この新たな局面での先駆者として、未来を切り開く覚悟です。"
        },
        {
          id: 10,
          date: "2026.02.18",
          category: "AI Strategy",
          title: "AI導入で未来を変える",
          excerpt: "AIを活用しない企業は未来に取り残される。",
          content: "AIを導入することなくして、企業は未来に生き残れるだろうか？この問いに対する答えは、否である。大手企業でさえも、AIを活用しなければ業務の効率化を果たせず、競争から取り残されるだろう。\n\nアインHDが約1300店舗に生成AIを搭載した薬歴入力システムを導入する計画は、AIの力を活用することで、業務時間を半減させる革新的な一例だ。このような動きは、業界全体に変革をもたらす布石となる。\n\nITエンジニアとしての未来を考えると、AIツールを活用することがキャリアの向上につながる。ChatGPTやClaude Codeなどのツールは、エンジニアとしての価値を高めるための鍵となる。\n\nMGC inc.は、AIを通じて業務の自動化を進め、より豊かな未来を築くビジョンを持っている。AIを活用しない選択肢はない！"
        },
        {
          id: 0,
          date: "2025.02.15",
          category: "Sales AI",
          title: "人間が電話しなくても売れる時代：AIで実現する、次世代営業の全自動化",
          excerpt: "リスト作成、メール送信、フォローアップ、CRM入力——これら全てをAIに任せたとき、営業担当者は何をすべきか。",
          content: "「営業は足で稼ぐもの」——その信仰こそが、日本の営業組織を非効率の泥沼に引きずり込んできた。\n\nターゲットリストの作成、パーソナライズされたアプローチメールの送信、返信がなければ自動フォローアップ、商談後のCRM入力——これら全てはAIが代替できる「実行業務」だ。MGC inc.では、これらを完全に自動化したAI営業フローを構築している。アポイント獲得まで、人間の手を一切介さない。\n\n人間の営業担当者が集中すべきは「クロージング」と「信頼構築」だ。AIが選び抜いた有望リードに対し、人間が感情と論理で訴えかける。それだけに全力を注げる体制こそが、勝てる営業組織の姿だ。\n\nAIは競合に勝つためのツールではない。競合が存在する前提を壊すためのインフラだ。AIネイティブな営業設計に移行した企業が圧倒的な優位を取る——その分水嶺は、もう目の前に来ている。"
        },
        {
          id: 1,
          date: "2025.02.10",
          category: "AI Automation",
          title: "AIエージェントが「社員」になる日：OpenClawで実現する、眠らない組織の作り方",
          excerpt: "メールの確認、カレンダー管理、SNS投稿、データ分析——これらを一体のAIエージェントに任せたとき、組織は何倍速になるか。",
          content: "「AI導入」と言えば、多くの企業がまず思い浮かべるのはチャットボットや一部業務の自動化だ。だが、それは氷山の一角に過ぎない。\n\nMGC inc.が実装しているのは、もっと根本的な変革だ。OpenClaw（AIエージェント基盤）を活用することで、メールの確認・返信、タスクの進捗管理、Slackへの自動通知、SNSのスケジュール投稿、週次レポートの自動生成——これら全てを、一人のAIエージェントが24時間365日、休まず実行する。\n\n人間が行うべき仕事とは何か。それは「判断」と「創造」だ。AIエージェントは、情報収集・整理・実行の部分を完全に引き受ける。人間は、その出力を見て、より高次元の意思決定に集中すればいい。\n\n「AIを使いこなす」から「AIに働かせる」へ。この発想の転換こそが、次世代のビジネスオペレーションの本質だ。眠らない社員、不満を言わない実行者、全ツールを横断するオペレーター——それがAIエージェントの正体である。"
        },
        {
          id: 2,
          date: "2025.02.01",
          category: "Voice AI",
          title: "エンジニア不要の音声革命：ElevenLabs × Lovableが証明する「創造の民主化」",
          excerpt: "プロダクトを作るのに、もうエンジニアは要らない。AIツールの組み合わせで、ビジョンを持つ全員が音声アプリを世に問える時代が来た。",
          content: "「良いアイデアはあるが、実装できる人間がいない」——この言い訳は、2025年に入って完全に消滅した。\n\nElevenLabs（世界最高峰の音声AI）とLovable（AIによるアプリ開発基盤）を組み合わせれば、コードを一行も書かずに、プロ品質の音声インタラクティブアプリを数時間で構築できる。コールセンター向けAI音声エージェント、音声でナビゲートするサービスアプリ、ユーザーの言葉に反応するコマーシャル——全てが、ノーコードで実装可能な現実だ。\n\nMGC inc.は、この組み合わせをクライアントの「最速プロトタイピング」に活用している。アイデアを出した翌日には、実動するプロダクトのデモを見せられる。投資家への説明も、ユーザーテストも、市場検証も——全てが圧倒的に早くなった。\n\n技術の民主化は、単なる便利の話ではない。「思想を持った人間」が「技術の壁」を超えて、直接世界に問いかけられる時代の到来だ。ツールは揃った。あとは、あなたのビジョンだけが問われる。"
        },
        {
          id: 3,
          date: "2025.01.10",
          category: "Vision",
          title: "「声」の再定義：電話業務という\"負の遺産\"を、AIはどう解放するか",
          excerpt: "人間が電話番をする時代の終わり。AIがコンシェルジュとなり、人間は創造的な対話のみに集中する未来。",
          content: "「電話対応」は、企業の生産性を最も阻害する要因の一つです。理不尽なクレーム、繰り返される同じ質問、取次ぎのためだけの時間。MGC inc.は、この「負の遺産」をAIによって完全に解放します。\n\n最新のVoice AIは、感情を理解し、文脈を読み取り、人間以上のホスピタリティで顧客をもてなします。人間は、AIが解決できない高度な判断や、心を通わせる対話だけに集中する。\n\n私たちが提供するのは、単なる自動応答システムではありません。企業の「声」そのものをアップデートし、ビジネスのスピードを極限まで加速させる、AI時代の新しいコミュニケーション・インフラです。"
        },
        {
          id: 4,
          date: "2025.01.05",
          category: "Product",
          title: "Tech × Art × Soul：次世代プロダクト開発における「三位一体」の哲学",
          excerpt: "機能競争の終焉。技術に美意識と魂を宿らせ、マーケティング自体を不要にするほどの引力を持つ。",
          content: "「機能」だけで差別化できる時代は終わりました。これからのプロダクトに必要なのは、Tech（技術）、Art（美意識）、そしてSoul（魂）の三位一体です。\n\n技術はあくまで表現の筆であり、そこにどんな絵を描くか（Art）、そしてなぜ描くのか（Soul）がなければ、人の心は動きません。スペックの高さではなく、手にした瞬間の「高揚感」をデザインする。\n\nMGC inc.は、多額の広告費で無理やり売るマーケティングを否定します。プロダクトそのものが発する圧倒的な美しさとストーリー（引力）で、世界中のユーザーを自然と惹きつける。それが私たちの流儀です。"
        },
        {
          id: 5,
          date: "2024.12.28",
          category: "Global",
          title: "日本という枠を、最初から捨てる：Day1 Global戦略の必然性",
          excerpt: "「まずは国内」という思考停止が死を招く理由。MGCが京都にいながらシリコンバレーと同じ目線で世界を見る理由。",
          content: "「まずは日本で成功してから海外へ」——その順序思考こそが、日本のスタートアップをガラパゴス化させてきました。インターネットに国境がない以上、最初から世界市場（Day1 Global）を狙わない手はありません。\n\n言語の壁はAIが溶かしました。物流の壁はDXが低くしました。今、京都にいながらにして、ロンドンやニューヨークの顧客と直接取引できない理由は何一つありません。\n\nMGC inc.は、日本の繊細な感性と精神性を最大の武器に、最初から世界80億人をターゲットにします。日本市場はその中の一部に過ぎません。ローカルに根を張り、グローバルに花を咲かせる。これが私たちの生存戦略であり、これからの日本企業があるべき姿です。"
        },
        {
          id: 6,
          date: "2024.12.20",
          category: "AI Trading",
          title: "眠れる巨人を、AIで叩き起こす：日本発グローバル展開の新解",
          excerpt: "日本の技術・資産を世界へ届けるために必要なのは、商社でもコンサルでもなく、「AIネイティブなオペレーション」への完全移行である。",
          content: "日本には、世界を驚かせる技術や伝統資産が山のように眠っています。... (略) ... この「劇的によいもの」に生まれ変わったオペレーションこそが、日本の眠れる資産を世界へ届けるための最短ルートなのです。"
        }
      ]
    },
    contact: {
      lead: "まずはあなたのビジョンをお聞かせください。",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        submit: "Send Message",
        success: "Thank you for reaching out."
      }
    }
  },
  en: {
     nav: {
      works: 'Works',
      cases: 'Cases',
      blog: 'Journal',
      mission: 'Mission',
      company: 'Company',
      career: 'Careers',
      contact: 'Contact',
    },
    hero: {
      title_1: 'Connect',
      title_2: 'Japan',
      title_3: '& The World.',
      subtitle_en: 'Updating the World with AI Intelligence.',
      desc: 'Connect Japan\'s Potential to Global Implementation.\nTechnology melting the borders of thought and nations. A next-gen global hub.',
      viewProjects: 'View Projects',
    },
    headings: {
      works: { title: 'Our Works', sub: 'Global Solutions' },
      cases: { title: 'Case Studies', sub: 'Implementation Archive' },
      mission: { title: 'MGC Way', sub: 'The Core Philosophy' },
      internalOS: { title: 'Internal OS', sub: 'MGC Internal Operating System' },
      alliance: { title: 'Alliance', sub: 'Global Network Nodes' },
      company: { title: 'Profile', sub: 'Corporate Overview' },
      career: { title: 'Careers', sub: 'Join the Collective.' },
      blog: { title: 'Journal', sub: 'Thoughts & Vision' },
      contact: { title: 'Contact', sub: 'Start the Conversation' },
    },
    works: {
      service_ai: {
        title: "Global One AI",
        subtitle: "One-stop AI turning the world into a single market.",
        desc: "Integrating 'Voice AI' to break language barriers and 'Reach AI' to find untapped customers. We lower hurdles for global expansion to zero.",
        items: [
          { title: "Cross-Border Voice", sub: "Resonating across borders.", text: "High-precision Voice AI resolves language barriers in real-time. Build trust with local partners as if speaking their native language." },
          { title: "Direct Global Reach", sub: "Don't wait. Reach out.", text: "Proprietary Reach AI extracts optimal targets from global databases. Automates approaches to maximize business opportunities." },
          { title: "All-in-One Platform", sub: "Global expansion, simplified.", text: "One-stop tools for global business, from communication to new client acquisition." }
        ]
      },
      service_lab: {
        title: "Global X Lab",
        subtitle: "Ideas to the world, instantly.",
        desc: "Multiplying Development x Marketing to break borders. Creating products that update global lifestyles.",
        items: [
           { title: "Agile for Global", sub: "Fastest Social Implementation", text: "Ultra-high-speed agile development catching trends. Launch MVPs quickly and evolve through feedback." },
           { title: "Dev × Growth", sub: "Fusion of Code & Growth", text: "No division between dev and growth. Marketing strategy matches architecture from day one." },
           { title: "Borderless Experience", sub: "Intuitive Design", text: "Pursuing UI/UX usable by 7 billion people without manuals. Designing borderless experiences." }
        ]
      },
      service_trade: {
        title: "Global Nexus Trade",
        subtitle: "Creating 'Right Place, Right Time' globally.",
        desc: "Japan's tech to the world, world's innovation to Japan. Eliminating mismatches and connecting hidden values.",
        items: [
          { title: "Export: Value Optimization", sub: "Value Reallocation", text: "Discovering Japanese IP/materials and matching them to overseas partners where they are valued most." },
          { title: "Import: Global Solution", sub: "Implementing World Knowledge", text: "Importing cutting-edge tech to accelerate Japanese innovation, rather than reinventing the wheel." },
          { title: "Frictionless Process", sub: "Efficient Trading", text: "AI streamlines complex licensing and rights processing for speedy transactions." }
        ]
      }
    },
    details: {
      service_ai: {
        title: "Global One AI",
        subtitle: "One-stop AI turning the world into a single market.",
        p1: "Integrating 'Voice AI' to break language barriers and 'Reach AI' to find untapped customers. We lower hurdles for global expansion to zero.",
        features: [
          { title: "Cross-Border Voice", sub: "Resonating across borders.", text: "High-precision Voice AI resolves language barriers in real-time. Build trust with local partners as if speaking their native language." },
          { title: "Direct Global Reach", sub: "Don't wait. Reach out.", text: "Proprietary Reach AI extracts optimal targets from global databases. Automates approaches to maximize business opportunities." },
          { title: "All-in-One Platform", sub: "Global expansion, simplified.", text: "One-stop tools for global business, from communication to new client acquisition." }
        ]
      },
      service_lab: {
        title: "Global X Lab",
        subtitle: "Ideas to the world, instantly.",
        p1: "Multiplying Development x Marketing to break borders. Creating products that update global lifestyles.",
        features: [
           { title: "Agile for Global", sub: "Fastest Social Implementation", text: "Ultra-high-speed agile development catching trends. Launch MVPs quickly and evolve through feedback." },
           { title: "Dev × Growth", sub: "Fusion of Code & Growth", text: "No division between dev and growth. Marketing strategy matches architecture from day one." },
           { title: "Borderless Experience", sub: "Intuitive Design", text: "Pursuing UI/UX usable by 7 billion people without manuals. Designing borderless experiences." }
        ]
      },
      service_trade: {
        title: "Global Nexus Trade",
        subtitle: "Creating 'Right Place, Right Time' globally.",
        p1: "Japan's tech to the world, world's innovation to Japan.\nEliminating mismatches and connecting hidden values to where they are needed most.",
        features: [
          { title: "Export: Value Optimization", sub: "Value Reallocation", p1: "New markets for Japan's tech.", text: "Discovering Japanese IP/materials and matching them to overseas partners where they are valued most." },
          { title: "Import: Global Solution", sub: "Implementing World Knowledge", p1: "Global innovation for Japan.", text: "Importing cutting-edge tech to accelerate Japanese innovation, rather than reinventing the wheel." },
          { title: "Frictionless Process", sub: "Efficient Trading", p1: "Smoother tech transfer.", text: "AI streamlines complex licensing and rights processing. Renewing analog trade practices for speed." }
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
        text: "No giant org charts needed. Just a small collective of autonomous elites who decide and execute. MGC inc. rejects bloat and maximizes individual capability to tackle global challenges."
      }
    },
    cases: [
      {
        id: "01",
        category: "Voice AI Architecture",
        title: "Voice Agent Construction",
        desc: "Complete AI automation of call center response and outbound tasks. Automated reservation systems for retail.",
        detail: "[Full Automation of Call Center Operations]\nSeamlessly automating everything from primary response to AI escalation using Twilio, ElevenLabs, and LLMs.\n\nKey feature: AI listens to human conversations in real-time and creates automated summaries. This data enters CRM automatically, reducing After Call Work (ACW) to near zero.",
        tags: ["Voice Synthesis", "Twilio / ElevenLabs", "Real-time Processing"]
      },
      {
        id: "02",
        category: "Intelligent CS Bot",
        title: "Customer Support AI",
        desc: "Automating inquiries in nursing/construction sectors using RAG. Advanced dialogue on Web/LINE.",
        detail: "[Two-way DX for Customer Support & Internal FAQ]\nAutomating external support and internal inquiries. Using RAG to generate optimal answers from internal manuals instantly, solving 'who do I ask?' issues and boosting productivity.",
        tags: ["RAG", "Multi-modal Chatbot", "Knowledge Base Integration"]
      },
      {
        id: "03",
        category: "AI Native Transformation",
        title: "AI Consulting",
        desc: "Supporting transition to AI-native business models. Developing automated workflow automation.",
        detail: "[Transformation from Hearing to Implementation]\nFrom issue identification to code-level implementation. Building automated workflows connecting SaaS tools via API and developing scratch systems to replace manual bottlenecks.",
        tags: ["DX Strategy", "Workflow Automation", "Business Modeling"]
      },
      {
        id: "04",
        category: "Cross-Border Matching",
        title: "AI Powered Export",
        desc: "Optimizing matching for Japanese products/services based on Africa/Europe connections.",
        detail: "[AI Finds Optimal Global Partners Instantly]\nAI selects partners in Africa/Europe where Japanese products fit best. Parsing databases like LinkedIn to identify key decision makers and automating personalized approaches.",
        tags: ["Global Matching Algorithm", "Market Entry", "Africa / Europe"]
      }
    ],
    mission: {
      internal_os: {
        lead: "Three engines driving MGC inc. Not just business domains, but our proprietary Operating System to perceive and hack the world.",
        os1: { title: "Manifest Creativity", desc: "Converting visions directly into software. A mindset to reduce technical friction to zero." },
        os2: { title: "Global Marketing", desc: "Hacking context to turn cultural friction into empathy. Methodology of narrative design." },
        os3: { title: "Curated Commerce", desc: "Eliminating distance between physical and information via AI ops. Logistics OS delivering unseen value." }
      },
      intro: {
        title: "AI × Global Trading",
        desc: "AI as a 'Future Infrastructure' to implement human prosperity for 1000 years.",
        mission_title: "Creating future infrastructure with Japan's spirit",
        mission_desc: "We change technology, but we do not change culture and spirituality. Using AI but ensuring humanity is maximized, not diminished."
      },
      values: [
        { title: "Fueki Ryuko (Review & Innovation)", sub: "Change Tech, Create Culture", desc: "Tech changes, essence remains. While chasing the latest AI 'trends' (Ryuko), we never lose sight of 'Fueki' - human happiness. We aim not just for implementation, but to create culture that lasts 100 years." },
        { title: "Four-way Satisfaction (Future Good)", sub: "Love for History & Society", desc: "Seller, Buyer, Society... and 'Future'. We conduct business with love for others and history. Delivering value that humanity 1000 years from now will thank us for." },
        { title: "Think Big, Execute High", sub: "Question & Will", desc: "Start with 'Why' and 'Will'. Don't be a critic. If you have time to judge, move your hands. Only those who dream big while stacking small steps change the world." },
        { title: "Flexible & Agile", sub: "Enjoy the Walls", desc: "The world is wide and fast. Look outward. Obstacles are playgrounds for growth. Fuse Japanese harmony with global individuality to overcome walls gracefully." },
        { title: "Live for Today (Ichinichi Issho)", sub: "Life as the Protagonist", desc: "Work is a means to enrich life. Don't kill yourself for the company; use the company for yourself. Live today with passion, as if it were your last." },
      ]
    },
    company: {
      items: [
        { label: 'Company Name', value: 'MGC inc.' },
        { label: 'CEO', value: 'KOKOMU MATSUO' },
        { label: 'Headquarters', value: 'Kyoto, Japan' },
        { label: 'Established', value: '2025' },
        { label: 'Business Domains', value: 'AI Native Product Development\nGlobal Marketing Solution\nCurated Cross-border Trading' },
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
          id: 10,
          date: "2026.02.19",
          category: "AI Strategy",
          title: "Japan's Future in Sales AI",
          excerpt: "Pioneers in sales AI are abroad. Japan, what's next?",
          content: "In a world where AI dominates sales, an example of an AI detecting advertising needs in real-time using SNS and news data is making waves. Yet, Japanese companies have not developed negotiation-specialized AI. This is a pressing issue for enhancing international competitiveness.\n\nAt MGC inc., we are focusing on developing sales AI and are pushing for the creation of domestic negotiation-specialized AI to establish leadership in Japan. By utilizing cutting-edge technologies such as analyzing failure patterns in local LLMs and enhancing RAG accuracy with debugging tools, we aim to offer AI solutions Japan can be proud of globally.\n\nNow is the time for Japanese companies to unleash their full potential and rebuild their AI strategies. As a front-runner in this new phase, MGC inc. is ready to pave the way forward."
        },
        {
          id: 10,
          date: "2026.02.18",
          category: "AI Strategy",
          title: "AI: Transforming the Future",
          excerpt: "Embrace AI or face obsolescence.",
          content: "Can businesses survive without adopting AI? The answer is a resounding no. Even major corporations will find themselves left behind if they do not leverage AI to enhance operational efficiency.\n\nAin HD's plan to implement a generative AI-powered pharmaceutical record-keeping system across 1,300 stores is a groundbreaking example of how harnessing AI can halve working hours, setting the stage for industry-wide transformation.\n\nFor IT engineers considering their future, leveraging AI tools like ChatGPT and Claude Code is key to enhancing career value. These tools are crucial in advancing an engineer's worth in the modern tech landscape.\n\nMGC inc. envisions a future where AI-driven automation leads to a more prosperous tomorrow. There is no alternative to embracing AI!"
        },
        {
          id: 0,
          date: "2025.02.15",
          category: "Sales AI",
          title: "Selling Without Picking Up the Phone: The Complete Automation of Sales with AI",
          excerpt: "List building, email outreach, follow-ups, CRM entry — when AI handles all of this, what should your salespeople actually do?",
          content: "'Sales is all about legwork' — this belief has dragged Japanese sales organizations into a swamp of inefficiency.\n\nBuilding target lists, sending personalized outreach emails, automated follow-ups when there's no reply, CRM entry after meetings — all of this is 'execution work' that AI can replace. MGC inc. has built fully automated AI sales flows where no human touch is needed until the appointment is secured.\n\nWhat human salespeople should focus on is closing and trust-building. AI selects the most promising leads; humans bring emotion and logic to close the deal. That single-focus structure is what a winning sales organization looks like.\n\nAI is not a tool to beat competitors. It is infrastructure to destroy the premise that competitors exist. Companies that shift to AI-native sales design will gain overwhelming advantage — and that inflection point is right in front of us."
        },
        {
          id: 1,
          date: "2025.02.10",
          category: "AI Automation",
          title: "The Day AI Agents Become Employees: Building a 24/7 Organization with OpenClaw",
          excerpt: "Email management, calendar coordination, auto-posting, data analysis — what happens to your organization's velocity when a single AI agent handles all of this?",
          content: "When companies talk about 'AI adoption', most envision chatbots or partial automation. That's just the tip of the iceberg.\n\nMGC inc. implements something more fundamental. Using OpenClaw (an AI agent platform), a single AI agent handles email monitoring and responses, task tracking, Slack notifications, social media scheduling, and automated weekly reports — all running 24/7 without rest.\n\nWhat should humans actually do? Judge and create. AI agents fully take over information gathering, organization, and execution. Humans can focus on higher-order decisions with the outputs AI surfaces.\n\nThe shift from 'using AI' to 'making AI work for you' — this mindset change is the essence of next-gen business operations. A tireless employee, an executor without complaints, an operator spanning all tools. That is what an AI agent truly is."
        },
        {
          id: 2,
          date: "2025.02.01",
          category: "Voice AI",
          title: "The No-Engineer Voice Revolution: How ElevenLabs × Lovable Proves the Democratization of Creation",
          excerpt: "You no longer need engineers to build a product. The era where anyone with a vision can ship a voice app has arrived.",
          content: "'Great idea, but no one to build it' — this excuse completely disappeared in 2025.\n\nCombining ElevenLabs (world-class voice AI) and Lovable (AI-powered app development), you can build a professional-grade interactive voice app in hours without writing a single line of code. AI voice agents for call centers, voice-navigated service apps, voice-reactive commercials — all achievable with no-code, today.\n\nMGC inc. uses this combination for fastest-possible prototyping for clients. We can demo a working product the day after an idea is born. Investor pitches, user testing, market validation — everything accelerates dramatically.\n\nThe democratization of technology is not just about convenience. It is the arrival of an era where people with ideas can directly question the world without being blocked by technical walls. The tools are ready. What's left is only your vision."
        },
        {
          id: 3,
          date: "2025.01.10",
          category: "Vision",
          title: "Redefining 'Voice': How AI liberates from the legacy of phone operations",
          excerpt: "The end of human receptionists. A future where AI becomes a concierge, allowing humans to focus only on creative dialogue.",
          content: "'Phone support' is one of the biggest inhibitors of corporate productivity. MGC inc. completely liberates this 'negative legacy' with AI.\n\nLatest Voice AI understands emotion, reads context, and welcomes customers with more hospitality than humans. Humans can focus only on creative judgment and heart-to-heart dialogue.\n\nWhat we provide is not a simple auto-response system. It is a new communication infrastructure for the AI era that updates a company's very 'voice' and pushes business speed to its limit."
        },
        {
          id: 4,
          date: "2025.01.05",
          category: "Product",
          title: "Tech × Art × Soul: The philosophy of 'Trinity' in next-gen product development",
          excerpt: "End of the feature war. Infusing aesthetics and soul into technology to create gravity that makes marketing itself unnecessary.",
          content: "The era where features alone differentiate is over. What next-gen products need is the trinity of Tech, Art, and Soul.\n\nTechnology is just a brush; without Art (aesthetics) and Soul (purpose), hearts won't move. We design 'excitement' at the first touch, not just high specs.\n\nMGC inc. rejects marketing that forces products through massive ad spend. Products that naturally attract users worldwide through their own overwhelming beauty and story — that is our way."
        },
        {
          id: 5,
          date: "2024.12.28",
          category: "Global",
          title: "Discarding the 'Japan' frame from Day 1: The necessity of Global strategy",
          excerpt: "Why the 'Japan first' mindset leads to death. Why MGC looks at the world from Kyoto with the same eyes as Silicon Valley.",
          content: "'Japan first' has galapagos-ized Japanese startups. If there are no borders on the internet, there's no reason not to target the world market (Day1 Global) from the start.\n\nAI melted language barriers. DX lowered logistics walls. There's no reason not to deal directly with London or NY from Kyoto.\n\nMGC inc. targets all 8 billion people on earth from day one, using Japan's refined sensibility as its greatest weapon. Japan is just one part of that. Root locally, bloom globally. This is our survival strategy."
        },
        {
          id: 6,
          date: "2024.12.20",
          category: "AI Trading",
          title: "Waking the Sleeping Giants with AI: A new solution for Japan's global expansion",
          excerpt: "Instead of trading houses or consultants, what's needed for Japan's global expansion is complete migration to 'AI-native operations'.",
          content: "Japan has tons of hidden gems. But the 'good products will sell' myth is long dead. What's needed is optimization and connection to global markets via AI-native operations."
        }
      ]
    },
    contact: {
      lead: "Tell us your vision.",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        submit: "Send Message",
        success: "Thank you for reaching out."
      }
    }
  }
};
