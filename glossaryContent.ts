// AI活用の用語集（/glossary）。サイト内で使っている用語を、一般的な定義で短く説明する。
// 定義は一般的な意味に限り、MGCの実績や数字は書かない。関連するページがあれば link で示す。
import type { Lang } from './translations';

export type GlossaryTerm = { id: string; term: string; reading?: string; definition: string; link?: { href: string; label: string } };

const ja: GlossaryTerm[] = [
  { id: 'generative-ai', term: '生成AI', reading: 'せいせいエーアイ', definition: '文章・画像・音声などを新しく作り出すAI。大量のデータから言葉や画像のパターンを学習し、指示（プロンプト）に応じて文章の作成・要約・翻訳などを行う。', link: { href: '/training', label: 'AI活用リスキリング研修' } },
  { id: 'llm', term: 'LLM（大規模言語モデル）', reading: 'エルエルエム', definition: '大量の文章で学習した、言葉を扱うAIモデル。ChatGPT や Claude、Gemini などの土台になっている。質問への回答、要約、文章の分類・抽出などに使われる。' },
  { id: 'ai-agent', term: 'AIエージェント', reading: 'エーアイエージェント', definition: '目的を与えると、必要な手順を自分で組み立て、ツールやシステム（CRM・メール・表計算など）を操作しながら作業を進めるAI。質問に答えるだけのチャットボットと違い、実際の操作まで行う。', link: { href: '/service/salesforce-ai', label: 'Salesforce AI活用支援' } },
  { id: 'rag', term: 'RAG（検索拡張生成）', reading: 'ラグ', definition: 'AIが回答を作る前に、社内文書やマニュアルなどから関連する情報を検索し、その内容をもとに答える仕組み。AIが学習していない自社固有の情報で回答でき、根拠の示し方も工夫しやすい。' },
  { id: 'hallucination', term: 'ハルシネーション', definition: 'AIが事実でない内容を、もっともらしく生成してしまう現象。根拠となる資料を参照させる（RAG）、人が確認する工程を挟む、といった設計で影響を抑える。' },
  { id: 'prompt', term: 'プロンプト', definition: 'AIに与える指示や質問の文章。目的・前提・出力の形式を具体的に伝えるほど、意図に沿った結果が得やすい。' },
  { id: 'voicebot', term: 'ボイスボット', definition: '音声で自動応答する仕組みの総称。電話の受付や問い合わせ対応に使われ、AI電話（音声AI）もその一種。', link: { href: '/service/ai-phone', label: 'AI電話（音声AI）' } },
  { id: 'ivr', term: 'IVR（自動音声応答）', reading: 'アイブイアール', definition: '電話をかけた人に「1を押してください」のような音声案内を流し、番号の入力で用件を振り分ける仕組み。決まった選択肢でしか振り分けられない点が、話し言葉を聞き取るAI電話との違い。', link: { href: '/service/ai-phone', label: 'AI電話（音声AI）' } },
  { id: 'acw', term: 'ACW（通話後処理）', reading: 'エーシーダブリュー', definition: 'After Call Work の略。コールセンターなどで通話を終えた後に行う、記録の入力・要約・関係者への共有などの作業。AIで要約や記録を自動化しやすい工程の一つ。', link: { href: '/cases', label: '導入事例（コールセンター運営）' } },
  { id: 'crm', term: 'CRM（顧客関係管理）', reading: 'シーアールエム', definition: 'Customer Relationship Management の略。顧客の情報ややり取りの履歴を一元管理し、関係づくりに活かす考え方と、そのためのシステム。Salesforce や kintone などで構築されることが多い。', link: { href: '/service/salesforce-ai', label: 'Salesforce AI活用支援' } },
  { id: 'sfa', term: 'SFA（営業支援システム）', reading: 'エスエフエー', definition: 'Sales Force Automation の略。商談の進み具合、営業活動の記録、売上見込みなどを管理し、営業を効率化するシステム。CRMの一部として提供されることも多い。', link: { href: '/service/ai-sales', label: 'AI営業' } },
  { id: 'api', term: 'API連携', reading: 'エーピーアイれんけい', definition: 'システム同士が決められた手順でデータをやり取りし、連動して動くようにすること。AIを既存のCRMやチャットツールとつなぎ、入力・通知・更新を自動化する際の土台になる。' },
  { id: 'off-jt', term: 'OFF-JT', reading: 'オフジェイティー', definition: 'Off the Job Training の略。通常の業務を離れて、講義や演習で体系的に学ぶ研修の形式。職場で仕事をしながら学ぶ OJT と対になる言葉。', link: { href: '/training', label: 'AI活用リスキリング研修' } },
  { id: 'reskilling', term: 'リスキリング', definition: '仕事の変化に合わせて、新しい業務に必要な知識・技能を学び直すこと。AIの普及に伴い、AIを業務で使いこなすための学び直しが求められている。', link: { href: '/training', label: 'AI活用リスキリング研修' } },
  { id: 'dx', term: 'DX（デジタルトランスフォーメーション）', reading: 'ディーエックス', definition: 'デジタル技術を使って、業務の進め方やビジネスの形そのものを変えること。ツールの導入だけでなく、業務の棚卸しと仕組みの作り直しを伴う。', link: { href: '/works/ai-solutions', label: 'AIソリューション' } },
];

const en: GlossaryTerm[] = [
  { id: 'generative-ai', term: 'Generative AI', definition: 'AI that creates new text, images or audio. It learns patterns from large amounts of data and writes, summarises or translates in response to instructions (prompts).', link: { href: '/training', label: 'AI training' } },
  { id: 'llm', term: 'LLM (large language model)', definition: 'An AI model trained on large amounts of text to work with language. It underlies ChatGPT, Claude and Gemini, and is used for answering, summarising, classifying and extracting.' },
  { id: 'ai-agent', term: 'AI agent', definition: 'AI that, given a goal, plans the steps itself and works through tools and systems (CRM, email, spreadsheets) to get it done — not just answering questions like a chatbot, but taking actions.', link: { href: '/service/salesforce-ai', label: 'Salesforce AI' } },
  { id: 'rag', term: 'RAG (retrieval-augmented generation)', definition: 'A setup where AI first searches your documents and manuals for relevant information and answers based on it, so it can use company-specific knowledge it was never trained on.' },
  { id: 'hallucination', term: 'Hallucination', definition: 'When AI produces plausible-sounding content that is not true. It is mitigated by grounding answers in source documents (RAG) and adding human review steps.' },
  { id: 'prompt', term: 'Prompt', definition: 'The instruction or question given to AI. The more concretely it states the goal, context and output format, the closer the result is to what you intended.' },
  { id: 'voicebot', term: 'Voicebot', definition: 'A general term for automated voice response, used for phone reception and inquiries. An AI phone (voice AI) is one kind.', link: { href: '/service/ai-phone', label: 'AI Phone' } },
  { id: 'ivr', term: 'IVR (interactive voice response)', definition: "A phone system that plays menus such as 'press 1' and routes callers by keypad input. Unlike an AI phone that understands natural speech, it can only route by fixed choices.", link: { href: '/service/ai-phone', label: 'AI Phone' } },
  { id: 'acw', term: 'ACW (after-call work)', definition: 'Work done after a call ends, such as logging, summarising and sharing with colleagues. One of the steps AI can most easily automate.', link: { href: '/cases', label: 'Case studies' } },
  { id: 'crm', term: 'CRM (customer relationship management)', definition: 'Managing customer information and interaction history in one place to build relationships, and the systems for it, often built on Salesforce or kintone.', link: { href: '/service/salesforce-ai', label: 'Salesforce AI' } },
  { id: 'sfa', term: 'SFA (sales force automation)', definition: 'Systems that manage deal progress, sales activities and forecasts to make selling more efficient; often part of a CRM.', link: { href: '/service/ai-sales', label: 'AI Sales' } },
  { id: 'api', term: 'API integration', definition: 'Connecting systems so they exchange data in a defined way and work together — the basis for linking AI to existing CRMs and chat tools.' },
  { id: 'off-jt', term: 'OFF-JT', definition: 'Off-the-job training: learning systematically through lectures and exercises away from daily work, as opposed to on-the-job training (OJT).', link: { href: '/training', label: 'AI training' } },
  { id: 'reskilling', term: 'Reskilling', definition: 'Learning the knowledge and skills needed for new kinds of work as jobs change — increasingly, learning to use AI in everyday work.', link: { href: '/training', label: 'AI training' } },
  { id: 'dx', term: 'DX (digital transformation)', definition: 'Using digital technology to change how work is done and how the business operates — not just adopting tools, but rethinking processes.', link: { href: '/works/ai-solutions', label: 'AI Solutions' } },
];

export const glossaryContent: Record<Lang, { title: string; sub: string; lead: string; terms: GlossaryTerm[] }> = {
  ja: { title: 'AI活用 用語集', sub: 'Glossary', lead: 'AIの導入・活用でよく使われる言葉を、短く説明します。MGCのサービスや研修で扱う内容に関係する用語は、関連ページもあわせてご覧ください。', terms: ja },
  en: { title: 'AI Glossary', sub: 'Glossary', lead: 'Short explanations of terms that come up when adopting and using AI, with links to related MGC pages.', terms: en },
};
