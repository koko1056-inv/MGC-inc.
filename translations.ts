import React from 'react';
import { Globe, Zap, Layers, Mic, MessageSquare, Briefcase, Plane } from 'lucide-react';

export type Lang = 'ja' | 'en';

export const translations = {
  ja: {
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
      desc: '日本の可能性を、世界の実装へ。\nテクノロジーで思考と国境の壁を溶かす、次世代のグローバル・ハブ。',
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
      }
    }
  }
};
