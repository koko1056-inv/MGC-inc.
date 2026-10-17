// translations.ts の英語版。言語切替時に読み込む（i18n.ts）。
import type { Translation } from './translations';

export const en: Translation = {
  nav: {
    works: 'Business',
    services: 'Services',
    worksTop: 'All businesses',
    aiSolutions: 'AI Solutions',
    companyGroup: 'Company',
    diagnosis: 'AI Diagnosis',
    cases: 'Case Studies',
    training: 'Training',
    column: 'Column',
    blog: 'News & Journal',
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
    desc: 'For us, AI is a means — the goal is to make the future better.\nFrom mapping the work to building, adoption and launching a business — we support enterprise AI end-to-end.',
    whatWeDo: 'What we do',
    chips: ['AI Solutions (Consulting · Build · Operations)', 'AI Business Launch Support', 'AI Training', 'Cross-Border Business'],
    viewProjects: 'View Services',
    tryDiagnosis: 'Free AI Diagnosis',
    bookConsult: 'Request a 30-min Free Consultation',
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
        desc: 'Because we design every job assuming AI does the work from day one, we move fast. Our CEO talks with you directly and takes the shortest path to the challenge in front of you.',
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
      { value: '4', unit: 'Businesses', label: 'AI Solutions / Business Launch / Training / Cross-Border' },
      { value: '3', unit: 'Modalities', label: 'AI built for text, voice, and image' },
      { value: '2025', unit: 'Founded', label: 'From Kyoto, connecting Japan and the world' },
    ],
  },
  oneStop: {
    eyebrow: 'One-Stop Support',
    title: 'From mapping the work to launching a business.',
    lead: "We don't build and leave. From deciding which tasks AI should take on, to getting it genuinely used on the floor, to turning that track record into a business you sell to your industry — our CEO handles it personally, end to end.",
    steps: [
      {
        step: '01',
        title: 'Discovery & scoping',
        desc: 'Deciding which work AI takes on, and how far.',
        items: [
          'Audit the work and map where AI helps most, in priority order',
          'Narrow to one process, and size the opportunity by counting current hours and volume',
          'Turn requirements, approach and cost into something you can decide on',
        ],
      },
      {
        step: '02',
        title: 'Consulting, build & adoption',
        desc: 'Not building and leaving — getting it used on the floor.',
        items: [
          'Prove the value with a working system in a 2–4 week PoC',
          'Build in the shape the problem needs — voice, text, CRM — and integrate with existing systems',
          'Improve operations and train the team, so the results keep compounding',
        ],
      },
      {
        step: '03',
        title: 'AI business launch support',
        desc: 'Turning what worked in-house into a business for your industry.',
        items: [
          'Package the deployment into an offering your peers can buy',
          'MGC carries the technical work: development, maintenance and support',
          'Service site and landing pages, sales collateral and the sales motion',
        ],
      },
    ],
    note: 'Step 03 is for companies aiming to commercialize. Engaging us for 01 and 02 alone is perfectly fine.',
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
    primary: 'Request a Consultation',
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
        a: 'Yes. We offer standalone AI training programs tailored to executives, managers, and hands-on staff. You can start with training and expand into consulting or development later.',
      },
      {
        q: 'Can you integrate with our existing systems?',
        a: 'Yes. We integrate with CRMs such as Salesforce and kintone, chat tools like Slack, Microsoft Teams and LINE, and core systems via API. We are vendor-neutral — we choose the stack that fits your environment.',
      },
      {
        q: 'How long does deployment take?',
        a: 'Depending on scope: a pilot runs 2–4 weeks, and production rollouts take 1–3 months. We design for speed-to-value above all — the pace that comes from working AI-natively.',
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
    blog: { title: 'News & Journal', sub: 'News & Journal' },
    contact: { title: 'Contact', sub: 'Start the Conversation' },
  },
  worksIntro: {
    eyebrow: "Services",
    lead: "Four businesses — AI Solutions (consulting, development, operations), AI Business Launch Support, Training, and Cross-Border Business (Inbound/Outbound) — connecting Japan and the world through AI and tech.",
    indexLabel: "Domains",
    detailLink: "Learn more",
    serviceLink: "See the service",
  },
  works: {
    service_ai: {
      title: "AI Solutions",
      subtitle: "Consulting, development and operations — end-to-end.",
      desc: "From working out where AI should be used, to building AI for voice, text and CRM, to running it after launch. Proven use cases are offered as services; everything else is designed case by case.",
      items: [
        { title: "AI Sales", sub: "Automating appointment setting", text: "AI handles the work before the meeting — list building, first contact, replies and scheduling — so people can focus on the meeting itself.", link: "ai-sales" },
        { title: "AI Phone", sub: "Voice AI for first response", text: "Voice AI takes the first response on calls, understands the request in natural speech, and hands a summary to the right person.", link: "ai-phone" },
        { title: "Salesforce AI", sub: "AI for Salesforce / CRM", text: "From automating input to surfacing insights and acting through agents — turning your CRM from a box you fill in into a system that moves.", link: "salesforce-ai" },
        { title: "Consulting & Development", sub: "Custom AI consulting and development", text: "For work outside the three above: we map the work, set priorities, build AI for voice, text and CRM, and run it with you." }
      ]
    },
    service_newbiz: {
      title: "AI Business Launch Support",
      subtitle: "Turn the AI you adopted into a business you sell to your industry.",
      desc: "AI built for one company tends to work for its peers as well. We package the AI you have already proven in your own operations into something you can sell to others in your industry, and stay with you until it runs as a business. MGC carries the technical work, so you can start without hiring a dedicated engineering team.",
      items: [
        { title: "Packaging", sub: "Turning your case into a product", text: "We document how your AI is built, run and what it delivers, then shape it into an offering your peers can buy — drawing the line between what is standard and what is configured per customer." },
        { title: "Operations", sub: "We carry the AI work", text: "Development, onboarding, maintenance and support sit with MGC. You focus on selling into the customer base and industry standing you already have." },
        { title: "Go-to-Market", sub: "Launching the sales side", text: "Service site and landing pages, sales collateral, scope and pricing, and building the sales motion — we put it together with you and stay until it is working." }
      ]
    },
    service_training: {
      title: "Training",
      subtitle: "Growing people who can put AI to work, inside your company.",
      desc: "Hands-on training (OFF-JT) for managers and employees who are not IT specialists, taking them from the foundations to putting AI to work through lectures, industry examples, and demos. Every course is offered to all companies on the same terms — same content, hours, and price.",
      items: [
        { title: "AI Reskilling", sub: "AI Reskilling Program", text: "From the big picture of AI tools to choosing between generative AI and agents, using data via API, and security and permission design — foundations through practice." },
        { title: "DX Enablement", sub: "DX Leadership & Generative AI Practitioner Program", text: "For the people who will drive DX inside your company: mapping current work, redesigning processes with generative AI, and driving adoption and measuring impact." },
        { title: "Delivery", sub: "Format and process", text: "In-person or live online. Hearing → confirming dates and format → training (OFF-JT) → practice support and review." }
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
      subtitle: "Consulting, development and operations — end-to-end.",
      p1: "From working out where AI should be used, to building AI for voice, text and CRM, to running it after launch.\nProven use cases are offered as services; everything else is designed case by case.",
      features: [
        { title: "AI Sales", sub: "Automating appointment setting", text: "AI handles everything before the meeting — list building, first contact, replies and scheduling — so your team spends its time in the meeting itself." },
        { title: "AI Phone", sub: "Voice AI for first response", text: "Voice AI takes the first response on the calls that never stop. Unlike push-button IVR, it understands the request in natural speech and hands a summary to the right person." },
        { title: "Salesforce AI", sub: "AI for Salesforce / CRM", text: "Automating input, surfacing insights, and acting through agents — starting from whether standard features are enough — so your CRM actually moves work forward." },
        { title: "Consulting & Development", sub: "Custom AI consulting and development", text: "We audit your operations and design a realistic roadmap with clear priorities, then build voice, text and CRM-integrated AI into your actual operations, including API integration with tools such as kintone." }
      ]
    },
    service_newbiz: {
      title: "AI Business Launch Support",
      subtitle: "Turn the AI you adopted into a business you sell to your industry.",
      p1: "AI built for one company tends to work for its peers as well.\nWe package the AI you have already proven in your own operations into something you can sell to others in your industry, and stay with you until it runs as a business. MGC carries the technical work, so you can start without hiring a dedicated engineering team.",
      features: [
        { title: "Packaging", sub: "Turning your case into a product", text: "We document how your AI is built, how it runs and what it delivers, then shape it into an offering your peers can buy. We separate what ships as standard from what is configured per customer, so it can be delivered again and again. A company that understands the industry selling it is what makes the pitch land." },
        { title: "Operations", sub: "We carry the AI work", text: "Development, onboarding, maintenance and support sit with MGC. You focus on selling into the customer base and industry standing you already have — no dedicated engineering hires or new development department needed to get started." },
        { title: "Go-to-Market", sub: "Launching the sales side", text: "Service site and landing pages, sales collateral, scope and pricing, and building the sales motion. We put it together with you, stay until who-buys-what-at-what-price is settled, and keep improving it after launch." },
        { title: "Outcome", sub: "What you get", text: "A new revenue stream on the customer base you already have. Standing in your industry as a company that provides AI rather than one that merely uses it — which pays off in both hiring and sales. And the knowledge from improving your own operations becomes an asset you can sell." }
      ]
    },
    service_training: {
      title: "Training",
      subtitle: "Growing people who can put AI to work, inside your company.",
      p1: "Hands-on training (OFF-JT) for managers and employees who are not IT specialists.\nLectures, industry examples, and demos take participants from the foundations to putting AI to work. Every course is offered to all companies on the same terms — same content, hours, and price.",
      features: [
        { title: "AI Reskilling", sub: "AI Reskilling Program", text: "From the big picture of AI tools to choosing between generative AI and agents, using data via API, security and permission design, and how to apply AI to business processes — 20 hours of OFF-JT covering foundations through practice." },
        { title: "DX Enablement", sub: "DX Leadership & Generative AI Practitioner Program", text: "For the people who will drive DX inside your company: mapping work and finding bottlenecks, redesigning processes with generative AI, no-code and automation tools, and driving adoption while measuring impact." },
        { title: "Delivery", sub: "Format and process", text: "In-person or live online. We start by clarifying your operational challenges and goals, confirm dates and format, run the training, then support putting what was learned into practice." }
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
    ],
    visionLabel: "Vision",
    valuesTitle: "Values",
    principle: {
      eyebrow: "Principle",
      title: "Start AI-native.",
      desc: "When we take on new work, a new business or a new problem, we design it assuming AI does the work from the start. Rather than building for people and adding AI later, we design AI-native first and then decide where a person must judge. We think this way about our clients' work and our own.",
    },
    offer: {
      title: "What we deliver",
      items: [
        { title: "Speed", desc: "The pace that comes from working AI-natively." },
        { title: "Global reach", desc: "Beyond Japan — everything we build assumes connecting Japan and the world." },
        { title: "Fresh thinking", desc: "Ideas born from our own perspective and worldview." },
      ],
    },
    choice: {
      title: "We choose work that lasts",
      desc: "We prioritize work that can be rolled out further or grown into a business over one-off engagements — because we want what we build to be passed on and to keep going.",
    },
  },
  company: {
    items: [
      { label: 'Company Name', value: 'MGC Inc. (ＭＧＣ株式会社)' },
      { label: 'CEO', value: 'Kokomu Matsuo' },
      { label: 'Headquarters', value: '111 Nishitatsumi-cho, Kamigyo-ku, Kyoto 602-8107, Japan' },
      { label: 'Established', value: 'December 1, 2025' },
      { label: 'Corporate Number', value: '4130001081155' },
      { label: 'Business Domains', value: 'AI Solutions (Consulting / Development / Operations)\nAI Business Launch Support (Packaging and commercializing AI services)\nTraining (AI reskilling / DX enablement)\nCross-Border Business (Japan Distributorship / Overseas Expansion Support)' },
      { label: 'Contact', value: 'contact@mgc-global01.com' },
    ],
    message: {
      eyebrow: 'Message',
      title: 'Message from the CEO',
      paragraphs: [
        'AI is a new technology, but for us it is only a means. The goal is to make the future better — and used well, that means can always make it so.',
        'MGC wants to be a company that solves the problem in front of each client while thinking, over the long term, about where technology can make the world better. We build AI into front-line work — phone handling, sales, running a CRM — and when it works, we take it to the rest of the industry and grow it into a business. We care about making it last, not stopping at an operational fix.',
        'Not just shipping technology, but bringing it to the world with our own perspective and conviction — and having what we build passed on from person to person. From Kyoto, we will keep connecting Japan and the world through AI and technology.',
      ],
      role: 'CEO, MGC Inc.',
      name: 'Kokomu Matsuo',
      nameEn: '松尾 心夢',
    },
    profileTitle: 'Company information',
    history: {
      title: 'History',
      items: [
        { date: 'Dec 2025', text: 'MGC Inc. founded in Kyoto' },
        { date: 'Jul 2026', text: 'Launched the AI Reskilling Program' },
        { date: 'Aug 2026', text: 'Started publishing industry AI columns' },
        { date: 'Aug 2026', text: 'Launched AI Sales, AI Phone and Salesforce AI services' },
        { date: 'Sep 2026', text: 'Added the DX Leadership & Generative AI Practitioner Program' },
        { date: 'Sep 2026', text: 'Launched AI Business Launch Support' },
      ],
    },
    access: {
      title: 'Access',
      address: '111 Nishitatsumi-cho, Kamigyo-ku, Kyoto 602-8107, Japan (Habitation Ons Un 106)',
      mapLabel: 'Open in Google Maps',
      mapTitle: 'Map of MGC Inc.',
    },
    missionLink: 'See our mission',
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
  news: {
    eyebrow: 'News',
    title: 'News',
    more: 'See all news & journal',
    items: [
      { date: '2026.09.15', category: 'Service', title: 'Launched AI Business Launch Support', href: '/works' },
      { date: '2026.09.03', category: 'Training', title: 'Added the DX Leadership & Generative AI Practitioner Program', href: '/training' },
      { date: '2026.08.28', category: 'Site', title: 'Published our case studies', href: '/cases' },
      { date: '2026.08.27', category: 'Service', title: 'Published service pages for AI Sales, AI Phone and Salesforce AI', href: '/service/ai-sales' },
      { date: '2026.08.08', category: 'Column', title: 'Started publishing industry AI columns (Japanese)', href: '/column' },
      { date: '2026.07.23', category: 'Training', title: 'Launched the AI Reskilling Program', href: '/training' },
      { date: '2025.12.01', category: 'Company', title: 'MGC Inc. was founded', href: '/company' },
    ],
  },
  journal: {
    eyebrow: 'Journal',
    title: 'Journal',
    lead: 'How we think, and how we work with AI.',
    readMore: 'Read more',
    close: 'Close',
    author: 'Kokomu Matsuo, CEO',
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
        "AI Sales (automating appointment setting)",
        "AI Phone (voice AI for first response)",
        "AI for Salesforce / CRM",
        "AI consulting & development",
        "AI Business Launch Support",
        "AI training (enrollment / materials)",
        "Japan Market Entry (Inbound)",
        "Overseas Expansion Support (Outbound)",
        "Other / mixed topics",
      ],
      topicPlaceholder: "Select a topic",
      message: "Details (optional)",
      messagePlaceholder: "Tell us about your current challenges or how you'd like to proceed.",
      submit: "Request a Free Consultation",
      sending: "Sending…",
      success: "Thank you. We'll get back to you within one business day.",
      privacyNote: "We use your information to respond to your inquiry and contact you. See our Privacy Policy for details.",
      consentLink: "I agree to the Privacy Policy",
      consentText: " and want to send this message",
      consentError: "Please agree to the Privacy Policy before sending.",
      emailError: "Please enter a valid email address.",
      sendError: "We couldn't send your message. Please try again later, or email us at contact@mgc-global01.com.",
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
        { label: 'Email', value: 'contact@mgc-global01.com', href: 'mailto:contact@mgc-global01.com' },
        { label: 'Web', value: 'https://mgc-global01.com/', href: 'https://mgc-global01.com/' },
      ],
      cta: 'Request materials / Contact us',
      ctaHref: '#contact/training',
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
      ctaButton: 'Request a free 30-min consultation',
      again: 'Run another diagnosis',
    },
  },
  footer: {
    corp: 'MGC Inc. (ＭＧＣ株式会社)',
    address: '111 Nishitatsumi-cho, Kamigyo-ku, Kyoto, Japan',
    rights: '© 2026 MGC Inc. All Rights Reserved.',
    tagline: 'Connect Japan & The World through AI and Tech.',
    groups: { business: 'Business & Services', insights: 'Work & Knowledge', company: 'Company' },
    contactCta: 'Request a free 30-min consult',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  }
};
