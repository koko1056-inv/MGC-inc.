import React, { useEffect, useLayoutEffect, useRef, useState, ReactNode } from 'react';
import { ArrowRight, Globe, Zap, Layers, X, Send, Menu, Anchor, Check, Heart, MapPin, Calendar, User, Sparkles, Plus, Minus, ChevronRight } from 'lucide-react';

import { translations, Lang } from './translations';
import { track } from '@vercel/analytics';
import { serviceContent, ServiceKey, ServiceSection } from './serviceContent';
import { caseContent, CaseStudy } from './caseContent';
import { legalContent, LegalDoc } from './legalContent';
import { journalPosts, JOURNAL_SLUGS, journalPath, findJournalPost } from './journal';
import { loadLang } from './i18n';
import { glossaryContent } from './glossaryContent';
import { guideContent, GUIDE_SLUGS, GUIDE_DATES } from './guideContent';
// ガイドごとの関連コラム（scripts/column/build-columns.mjs が生成）
import guideColumns from './content/columns/guide-columns.json';
// 用語→コラム、トップの最新コラム（build-columns.mjs が生成）
import siteLinks from './content/columns/site-links.json';
export const LanguageContext = React.createContext<{ lang: Lang; setLang: (l: Lang) => void; t: typeof translations['ja'] }>({
  lang: 'ja',
  setLang: () => {},
  t: translations['ja']
});
export const useLanguage = () => React.useContext(LanguageContext);
// --- Types & Interfaces ---

export type ViewState = 'home' | 'works' | 'training' | 'diagnosis' | 'mission' | 'partners' | 'company' | 'career' | 'contact' | 'blog' | 'cases' | 'notfound' | 'privacy-policy' | 'terms-of-service' | 'journal' | 'glossary' | 'case' | 'guides' | 'guide' | 'pricing' | BizView | ServiceKey;

// AI診断の表示切り替え。false の間は、サイト内の導線をすべて隠す。
// ページ自体（/diagnosis）は残るため、true に戻せば元の状態に復帰する。
export const SHOW_DIAGNOSIS = false;

// ビューごとの title / description。cases とサービス3本は各ビュー側で設定する。
const PAGE_META: Record<Lang, Partial<Record<string, { title: string; description: string }>>> = {
  ja: {
    home: { title: 'ＭＧＣ株式会社（MGC Inc.）| AIとテクノロジーで、日本と世界をつなぐ', description: 'ＭＧＣ株式会社は、AIソリューション・AI事業立ち上げ支援・AI活用研修・クロスボーダー事業を展開する京都の会社。業務の棚卸しから開発・定着、事業化まで一気通貫で支援します。初回相談は無料。' },
    works: { title: '事業内容｜AIソリューション・AI事業立ち上げ支援・研修・クロスボーダー - ＭＧＣ株式会社', description: 'AIコンサルティング・開発・運用を一気通貫で提供するAIソリューション、導入実績を同業他社向けの商材に変えるAI事業立ち上げ支援、AI活用の実践型研修、海外企業の日本総代理店・日本企業の海外進出を支援するクロスボーダー事業。' },
    training: { title: 'AI活用リスキリング研修｜実践型のOFF-JT研修 - ＭＧＣ株式会社', description: 'ITに詳しくない経営者・従業員がAIを業務に導入・活用できるようになる実践型研修（OFF-JT）。基礎から実務での活用までを、解説・実例・デモで学びます。' },
    mission: { title: '会社理念｜AIとテクノロジーで、日本と世界をつなぐ - ＭＧＣ株式会社', description: 'ＭＧＣ株式会社の会社理念。ビジョン「AIとテクノロジーで、日本と世界をつなぐ」と、まずAIネイティブにやってみるという考え方、バリュー（楽観主義・誠実さ・思考の枠を超える）、続いていく取り組みを選ぶ姿勢を掲載しています。' },
    company: { title: '会社概要 - ＭＧＣ株式会社', description: 'ＭＧＣ株式会社（MGC Inc.）の会社概要。京都市上京区を拠点に、AIソリューション・AI事業立ち上げ支援・AI活用研修・クロスボーダー事業を展開しています。代表メッセージ、沿革、所在地とアクセスを掲載。' },
    career: { title: '採用情報｜AIネイティブに働く仲間を募集 - ＭＧＣ株式会社', description: 'ＭＧＣ株式会社の採用情報。AIを「同僚」として使いこなし、日本と世界をつなぐ仕事に挑む仲間を募集しています。求める資質（原動力・突破力・時間感覚・人間性）と、求めるスキル（AIネイティブ・グローバル・構想力）を掲載。' },
    contact: { title: 'お問い合わせ｜30分の無料相談 - ＭＧＣ株式会社', description: 'AI導入、AI営業・AI電話・Salesforce AI活用、AI活用研修、海外展開のご相談窓口。フォームで送信いただくと、専門チームが内容を確認して1営業日以内にメールでご返信します。初回の30分相談は無料です。' },
    blog: { title: 'お知らせ・ジャーナル - ＭＧＣ株式会社', description: 'ＭＧＣ株式会社のお知らせ（サービス開始・研修・サイト更新）と、代表がAIとの向き合い方や実装の記録を綴るジャーナル。AI営業、音声AI、Salesforce・kintone連携、海外展開などをテーマにしています。' },
    diagnosis: { title: 'AI活用診断｜業種と課題から導入効果をその場で試算 - ＭＧＣ株式会社', description: '業種・事業内容・課題を入力するだけで、AIに任せられる業務、導入後のワークフロー、期待できる効果をその場で診断します。無料・所要3分。' },
    'biz-ai': { title: 'AIソリューション｜AIコンサルティング・開発・運用 - ＭＧＣ株式会社', description: '「何にAIを使うべきか」の整理から、音声・テキスト・CRM連携に対応するAIの開発、導入後の運用まで。AI営業・AI電話・Salesforce AI活用支援と、個別のAIコンサルティング・開発を提供します。' },
    'biz-newbiz': { title: 'AI事業立ち上げ支援｜導入したAIを同業他社へ届ける事業に - ＭＧＣ株式会社', description: '自社で導入して効果が出たAIを、同業他社へ提供できる商材にまとめ、新しい事業として立ち上げます。パッケージ化、AI側の実務の巻き取り、販売の立ち上げまで支援します。' },
    'biz-crossborder': { title: 'クロスボーダー事業｜海外企業の日本参入・日本企業の海外進出支援 - ＭＧＣ株式会社', description: '海外の優れたプロダクトを日本市場へ届ける「Inbound」と、日本企業の海外進出を支援する「Outbound」。双方向で日本と世界のビジネスをつなぎます。' },
    guides: { title: '比較・選び方ガイド｜AI電話とIVR、AI営業とテレアポ代行ほか - ＭＧＣ株式会社', description: 'AI導入でよく比べられる方法の違いと選び方を、表でまとめたガイド。AI電話・IVR・ボイスボット、AI営業とテレアポ代行、Salesforceの標準AI機能と個別開発を比較しています。' },
    pricing: { title: '料金の考え方｜研修の受講料とAIソリューションの費用構成 - ＭＧＣ株式会社', description: '研修は1名398,000円（税込）・標準20時間。AI営業・AI電話・Salesforce AI活用支援はPoC 100〜300万円が目安、本番導入は要件に応じて個別見積もり。費用の構成と金額が変わる要因、期間の目安も掲載。' },
    glossary: { title: 'AI活用 用語集｜AIエージェント・RAG・ボイスボット・IVRなど - ＭＧＣ株式会社', description: 'AIの導入・活用でよく使われる言葉（生成AI、LLM、AIエージェント、RAG、ハルシネーション、ボイスボット、IVR、ACW、CRM、SFA、API連携、OFF-JT、リスキリング、DX）を短く説明する用語集です。' },
    'privacy-policy': { title: 'プライバシーポリシー - ＭＧＣ株式会社', description: 'ＭＧＣ株式会社のプライバシーポリシー。問い合わせフォーム・AI活用診断で取得する情報、利用目的、外部サービス、保管期間、開示等のご請求について。' },
    'terms-of-service': { title: 'サイト利用規約 - ＭＧＣ株式会社', description: 'ＭＧＣ株式会社ウェブサイト（mgc-global01.com）の利用規約。著作権、禁止事項、AI活用診断の結果の位置づけ、免責事項、外部リンク、個人情報の取扱い、準拠法・管轄（京都地方裁判所）について定めています。' },
    thanks: { title: '送信完了 - ＭＧＣ株式会社', description: 'お問い合わせを受け付けました。内容を確認し、1営業日以内にメールでご返信します。' },
    notfound: { title: 'ページが見つかりません - ＭＧＣ株式会社', description: 'お探しのページは移動したか、削除された可能性があります。' },
    cases: { title: '導入事例｜AI導入の進め方と実例 - ＭＧＣ株式会社', description: 'MGCが実際に進めている案件の課題・打ち手・設計の要点。コールセンターの催促架電を音声AIで自動化した事例、海外メーカーの発掘をAIで自動化し1ヶ月で商談10件につながった事例、建設機械の現場で音声AIが技術情報を引き当てる事例を紹介します。' },
  },
  en: {
    home: { title: 'MGC Inc. | Connect Japan & The World through AI and Tech', description: 'MGC Inc. runs AI Solutions, AI Business Launch Support, AI Training and Cross-Border Business from Kyoto, Japan — from mapping the work to launching a business. First consultation is free.' },
    works: { title: 'Business | AI Solutions, Business Launch, Training and Cross-Border - MGC Inc.', description: 'End-to-end AI solutions, AI business launch support that turns a proven deployment into a product for the industry, hands-on AI training, and two-way cross-border business.' },
    training: { title: 'AI Reskilling Program - MGC Inc.', description: 'Hands-on AI training (OFF-JT) for managers and employees who are not IT specialists, from the foundations to putting AI to work.' },
    mission: { title: 'Mission | Connect Japan & The World through AI and Tech - MGC Inc.', description: 'The mission of MGC Inc.: our vision to connect Japan and the world through AI and technology, starting AI-native, our values (optimism, integrity, thinking beyond the frame), and choosing work that lasts.' },
    company: { title: 'Company Profile - MGC Inc.', description: 'Corporate profile of MGC Inc., based in Kyoto, Japan: AI Solutions, AI Business Launch Support, AI training and Cross-Border business. Includes a message from our CEO, history, and access.' },
    career: { title: 'Careers | Work AI-natively with us - MGC Inc.', description: 'Careers at MGC Inc. We look for people who work with AI as a colleague and want to connect Japan and the world. The qualities (will, grit, time sense, humanity) and skills (AI-native, global, vision) we value.' },
    contact: { title: 'Contact | Free 30-minute consultation - MGC Inc.', description: 'Contact MGC Inc. about AI adoption, AI Sales, AI Phone, Salesforce AI, AI training or overseas expansion. Our specialist team reviews every message and replies by email within one business day. The first 30-minute consultation is free.' },
    blog: { title: 'News & Journal - MGC Inc.', description: 'News from MGC Inc. (service launches, training, site updates) and our CEO\'s journal on working with AI: AI sales, voice AI, Salesforce and kintone integration, and global expansion.' },
    diagnosis: { title: 'AI Diagnosis | Estimate the impact of AI for your business - MGC Inc.', description: 'Enter your industry, business and challenges to see which work AI can take on, the workflow after adoption and the expected impact. Free, about 3 minutes.' },
    'biz-ai': { title: 'AI Solutions | AI consulting, development and operation - MGC Inc.', description: 'From deciding what AI should do, to building voice, text and CRM-connected AI, to running it after launch. AI Sales, AI Phone, Salesforce AI and bespoke AI consulting and development.' },
    'biz-newbiz': { title: 'AI Business Launch | Turn the AI you adopted into a business - MGC Inc.', description: 'We package AI that worked in your company into a product you can sell to your industry, take on the AI-side operations, and help you launch sales.' },
    'biz-crossborder': { title: 'Cross-Border | Japan market entry and overseas expansion - MGC Inc.', description: 'Inbound: bringing excellent overseas products to Japan. Outbound: helping Japanese companies expand overseas. Connecting business between Japan and the world in both directions.' },
    pricing: { title: 'Pricing | Training fees and how AI Solutions costs are structured - MGC Inc.', description: 'Training is JPY 398,000 per participant (tax incl.) for a standard 20 hours. For AI Sales, AI Phone and Salesforce AI a PoC typically costs JPY 1–3 million and production rollout is quoted individually; we also disclose the cost components and typical timelines.' },
    guides: { title: 'Comparison guides | AI phone vs IVR, AI Sales vs telemarketing - MGC Inc.', description: 'Tables comparing commonly weighed approaches to AI adoption: AI phones, IVR and voicebots; AI Sales and telemarketing; Salesforce built-in AI and bespoke development.' },
    glossary: { title: 'AI Glossary | AI agents, RAG, voicebots, IVR and more - MGC Inc.', description: 'Short explanations of terms used in AI adoption: generative AI, LLMs, AI agents, RAG, hallucination, voicebots, IVR, ACW, CRM, SFA, API integration, OFF-JT, reskilling and DX.' },
    'privacy-policy': { title: 'Privacy Policy - MGC Inc.', description: 'How MGC Inc. handles information collected through the contact form, AI diagnosis and analytics.' },
    'terms-of-service': { title: 'Terms of Use - MGC Inc.', description: 'Terms of use for the MGC Inc. website (mgc-global01.com): copyright, prohibited conduct, the status of AI diagnosis results, disclaimer, external links, personal information, and governing law and jurisdiction (Kyoto District Court).' },
    thanks: { title: 'Message sent - MGC Inc.', description: 'We received your message and will reply within one business day.' },
    notfound: { title: 'Page not found - MGC Inc.', description: 'The page you are looking for may have moved or no longer exists.' },
    cases: { title: 'Case studies | How AI projects actually run - MGC Inc.', description: 'How MGC runs real projects: voice AI in a call centre, automated overseas supplier outreach, and field troubleshooting by voice.' },
  },
};

// OGP画像。SNSで共有したときにページごとの画像を出す（1200×630。public/assets/og/）。
const OG_IMAGE_DEFAULT = '/assets/og/home.jpg';
const OG_IMAGE_VIEWS = ['home', 'works', 'cases', 'training', 'mission', 'company', 'career', 'blog', 'contact', 'ai-sales', 'ai-phone', 'salesforce-ai', 'biz-ai', 'biz-newbiz', 'biz-crossborder'];
const ogImageFor = (view: string) => (OG_IMAGE_VIEWS.includes(view) ? `/assets/og/${view}.jpg` : OG_IMAGE_DEFAULT);

// SPAのため、ビューが変わるたびに title / description / canonical / OGP を書き換える。
export const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1';
const applyMeta = (m: { title: string; description: string; url: string; image: string; noindex: boolean }) => {
  document.title = m.title;
  const set = (selector: string, attr: 'content' | 'href', value: string) =>
    document.querySelector(selector)?.setAttribute(attr, value);
  set('meta[name="robots"]', 'content', m.noindex ? 'noindex' : ROBOTS_INDEX);
  set('meta[name="description"]', 'content', m.description);
  set('link[rel="canonical"]', 'href', m.url);
  set('meta[property="og:title"]', 'content', m.title);
  set('meta[property="og:description"]', 'content', m.description);
  set('meta[property="og:url"]', 'content', m.url);
  set('meta[property="og:image"]', 'content', m.image);
  set('meta[name="twitter:title"]', 'content', m.title);
  set('meta[name="twitter:description"]', 'content', m.description);
  set('meta[name="twitter:url"]', 'content', m.url);
  set('meta[name="twitter:image"]', 'content', m.image);
};

// ビューとクリーンURLの対応。ハッシュ（#works 等）は互換のため引き続き受け付ける。
export const PATH_TO_VIEW: Record<string, ViewState> = {
  '/works': 'works', '/training': 'training', '/diagnosis': 'diagnosis', '/cases': 'cases',
  '/mission': 'mission', '/company': 'company', '/career': 'career', '/contact': 'contact', '/blog': 'blog',
  '/privacy-policy': 'privacy-policy', '/terms-of-service': 'terms-of-service', '/glossary': 'glossary', '/guide': 'guides', '/pricing': 'pricing',
  '/works/ai-solutions': 'biz-ai', '/works/ai-business-launch': 'biz-newbiz', '/works/cross-border': 'biz-crossborder',
};
// 事業ごとのページ（事業内容 › 各事業）。研修は専用ページ（/training）があるため含めない
export type BizView = 'biz-ai' | 'biz-newbiz' | 'biz-crossborder';
export const BUSINESS_PAGES: Record<BizView, { path: string; key: 'service_ai' | 'service_newbiz' | 'service_lab'; no: string; image: string; topic?: string }> = {
  'biz-ai': { path: '/works/ai-solutions', key: 'service_ai', no: '01', image: '/assets/service_ai.webp', topic: 'ai-solutions' },
  'biz-newbiz': { path: '/works/ai-business-launch', key: 'service_newbiz', no: '02', image: '/assets/service_newbiz.webp', topic: 'newbiz' },
  'biz-crossborder': { path: '/works/cross-border', key: 'service_lab', no: '04', image: '/assets/service_lab.webp', topic: 'crossborder' },
};
export const isBizView = (v: string): v is BizView => v in BUSINESS_PAGES;
export const pathForView = (v: ViewState): string =>
  isServiceKey(v) ? `/service/${v}` : isBizView(v) ? BUSINESS_PAGES[v].path : v === 'home' ? '/' : v === 'notfound' ? '/404' : v === 'guides' ? '/guide' : `/${v}`;

export const SERVICE_KEYS: ServiceKey[] = ['ai-sales', 'ai-phone', 'salesforce-ai'];
const isServiceKey = (v: string): v is ServiceKey => (SERVICE_KEYS as string[]).includes(v);

// クリーンURLのパスからビューを決める（ブラウザと事前描画で共通）
export const viewForPath = (rawPath: string): ViewState => {
  const path = rawPath.replace(/\/+$/, '') || '/';
  if (PATH_TO_VIEW[path]) return PATH_TO_VIEW[path];
  if (path === '/contact/thanks') return 'contact';
  const svc = path.match(/^\/service\/([a-z-]+)$/);
  if (svc && isServiceKey(svc[1])) return svc[1];
  const gd = path.match(/^\/guide\/([a-z0-9-]+)$/);
  if (gd && GUIDE_SLUGS.includes(gd[1])) return 'guide';
  const cs = path.match(/^\/cases\/([a-z0-9-]+)$/);
  if (cs && caseContent.ja.cases.some((x) => x.slug === cs[1])) return 'case';
  const post = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (post && JOURNAL_SLUGS.includes(post[1])) return 'journal';
  if (path === '/' || path === '/index.html' || path === '/200.html') return 'home';
  // 知らないURLはトップを見せず「見つからない」ページにする（本番では 404.html として配信）
  return 'notfound';
};

// ビューごとの title / description / URL / OGP画像（ブラウザと事前描画で共通）
export const SITE_ORIGIN = 'https://mgc-global01.com';
// path は同じビューで別ページになるもの（/contact/thanks）の判定に使う
export const THANKS_PATH = '/contact/thanks';
// ジャーナルの description。抜粋が短い記事は、本文の書き出しを文単位で足して70字以上にし、執筆者を添える
const journalDescription = (post: { excerpt: string; content: string }, lang: string): string => {
  if (post.excerpt.length >= 70) return post.excerpt;
  const ja = lang === 'ja';
  let d = post.excerpt;
  const sentences = post.content.replace(/\n+/g, ja ? '' : ' ').split(ja ? /(?<=。)/ : /(?<=\.)\s+/);
  for (const sn of sentences) {
    if (d.length >= (ja ? 70 : 120)) break;
    const t = sn.trim();
    if (t && (d + t).length <= (ja ? 120 : 220)) d += (ja ? '' : ' ') + t;
    else break;
  }
  return `${d}${ja ? '（代表取締役 松尾 心夢のジャーナル）' : ' — Journal by Kokomu Matsuo, CEO of MGC Inc.'}`;
};

export const metaFor = (view: ViewState, lang: Lang, path?: string) => {
  const page = isServiceKey(view) ? serviceContent[lang][view] : null;
  const isThanks = view === 'contact' && path?.replace(/\/+$/, '') === THANKS_PATH;
  if (view === 'guide') {
    const slug = (path ?? '').replace(/\/+$/, '').split('/').pop() ?? '';
    const g = guideContent[lang].guides.find((x) => x.slug === slug);
    if (g) {
      return {
        title: `${g.title}${lang === 'ja' ? ' - ＭＧＣ株式会社' : ' - MGC Inc.'}`,
        description: g.description,
        url: `${SITE_ORIGIN}/guide/${g.slug}`,
        image: SITE_ORIGIN + ogImageFor('works'),
        noindex: false,
      };
    }
  }
  if (view === 'case') {
    const slug = (path ?? '').replace(/\/+$/, '').split('/').pop() ?? '';
    const cs = caseContent[lang].cases.find((x) => x.slug === slug);
    if (cs) {
      return {
        title: `${cs.title ?? cs.industry}｜${lang === 'ja' ? '導入事例' : 'Case study'}（${cs.industry}）${lang === 'ja' ? ' - ＭＧＣ株式会社' : ' - MGC Inc.'}`,
        description: cs.summary,
        url: `${SITE_ORIGIN}/cases/${cs.slug}`,
        image: SITE_ORIGIN + ogImageFor('cases'),
        noindex: false,
      };
    }
  }
  if (view === 'journal') {
    const post = findJournalPost(lang, (path ?? '').replace(/\/+$/, '').split('/').pop() ?? '');
    if (post) {
      return {
        title: `${post.title}${lang === 'ja' ? ' - ＭＧＣ株式会社' : ' - MGC Inc.'}`,
        // 抜粋が短い記事は、誰が何について書いたかを補って検索結果・AI要約での説明を十分にする
        description: journalDescription(post, lang),
        url: SITE_ORIGIN + journalPath(post.slug),
        image: SITE_ORIGIN + post.imageJpg,
        noindex: false,
      };
    }
  }
  const base = page
    ? { title: page.seoTitle, description: page.seoDescription }
    : (PAGE_META[lang][isThanks ? 'thanks' : view] ?? PAGE_META[lang].home!);
  return {
    title: base.title,
    description: base.description,
    url: SITE_ORIGIN + (isThanks ? THANKS_PATH : view === 'home' ? '' : pathForView(view)),
    image: SITE_ORIGIN + ogImageFor(view),
    // 検索結果に出さないページ（送信完了・404）
    // 診断は入口を隠している間（SHOW_DIAGNOSIS=false）は検索にも出さない
    noindex: isThanks || view === 'notfound' || (view === 'diagnosis' && !SHOW_DIAGNOSIS),
  };
};

type ContentKey = 'service_ai' | 'service_newbiz' | 'service_training' | 'service_lab';


// --- Data ---



// --- Shared Components ---

// 事前描画したHTMLをそのまま引き継ぐ（ハイドレーション）間は true。
// この間に描画される要素は「表示された状態」から始め、クローラやJS実行前でも本文が見えるようにする。
// ハイドレーション後（ページ遷移など）に現れる要素は、従来どおり下からふわっと出す。
let isHydrating = true;
export const markHydrated = () => { isHydrating = false; };

// SSR では useLayoutEffect が警告を出すため、サーバーでは useEffect に置き換える
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const Reveal: React.FC<{ children: ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(isHydrating);
  const ref = useRef<HTMLDivElement>(null);

  // ハイドレーション時に画面外にある要素だけ、いったん隠してスクロールで出す（画面内は表示したまま）
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || !isVisible) return;
    if (el.getBoundingClientRect().top > window.innerHeight) setIsVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const PageTransition: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="animate-[fadeIn_0.5s_cubic-bezier(0.22,1,0.36,1)_forwards] w-full min-h-screen pt-24 pb-20">
    {children}
  </div>
);

// ページ遷移のリンク。href を持たせて検索エンジン・新しいタブ・右クリックに対応しつつ、
// 通常のクリックはページを読み直さずに画面内で切り替える（onGo）。
const NavLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { onGo: () => void }> = ({ onGo, onClick, children, ...rest }) => (
  <a
    {...rest}
    onClick={(e) => {
      onClick?.(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      onGo();
    }}
  >
    {children}
  </a>
);

const SectionHeading: React.FC<{ title: string; subtitle?: ReactNode; dark?: boolean; as?: 'h1' | 'h2' }> = ({ title, subtitle, dark = false, as: Tag = 'h2' }) => (
  <Reveal>
    <div className={`flex flex-col md:flex-row items-end justify-between border-b ${dark ? 'border-gray-800' : 'border-gray-200'} pb-8 mb-16`}>
      <div className="relative">
        <Tag className={`text-6xl md:text-8xl font-bold tracking-tighter mb-2 ${dark ? 'text-white' : 'text-offblack'}`}>{title}</Tag>
        <div className="w-24 h-2 bg-accent mt-4"></div>
      </div>
      {subtitle && (
        <div className={`mt-6 md:mt-0 md:text-right font-medium text-xl ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {subtitle}
        </div>
      )}
    </div>
  </Reveal>
);

const GridPattern = ({ dark = false }: { dark?: boolean }) => (
  <div 
    className={`absolute inset-0 z-0 opacity-[0.03] pointer-events-none ${dark ? 'bg-grid-white' : 'bg-grid-black'}`}
    style={{
      backgroundImage: `linear-gradient(${dark ? '#FFF' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${dark ? '#FFF' : '#000'} 1px, transparent 1px)`,
      backgroundSize: '32px 32px'
    }}
  />
);


// --- Feature Components (Pages) ---

// --- FAQ Item (collapsible accordion) ---
const FaqItem: React.FC<{ question: string; answer: string; index: number; link?: { href: string; label: string; onGo: () => void } }> = ({ question, answer, index, link }) => {
  const [open, setOpen] = useState(index === 0); // First open by default
  return (
    <div className={`group rounded-2xl border transition-all duration-300 ${open ? 'bg-white border-accent shadow-lg shadow-accent/5' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-6 p-6 md:p-7 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <span className={`font-mono text-xs font-bold flex-shrink-0 mt-1.5 ${open ? 'text-accent' : 'text-gray-400'}`}>
            Q.{String(index + 1).padStart(2, '0')}
          </span>
          <h3 className={`text-base md:text-lg font-bold tracking-tight leading-snug ${open ? 'text-accent' : 'text-offblack'}`}>
            {question}
          </h3>
        </div>
        <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${open ? 'bg-accent text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-6 md:px-7 pb-6 md:pb-7 pl-14 md:pl-[4.5rem]">
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {answer}
          </p>
          {link && (
            <NavLink href={link.href} onGo={link.onGo} className="inline-flex items-center gap-1.5 mt-3 text-sm md:text-base font-bold text-accent underline underline-offset-4">
              {link.label}
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

// 事業の3段階（学ぶ→成果をつくる→広げる）。研修を入口に置く。トップと /works で使う
const GrowthFlow: React.FC<{ onGo: (view: ViewState) => void }> = ({ onGo }) => {
  const { t } = useLanguage();
  const g = t.growthFlow;
  return (
    <div>
      <Reveal>
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">{g.eyebrow}</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-offblack mt-3 leading-tight">{g.title}</h2>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed mt-5 font-medium">{g.lead}</p>
      </Reveal>
      <ol className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 mt-10">
        {g.steps.map((st, i) => (
          <Reveal key={st.step} delay={i * 100} className="h-full">
            <li className="relative h-full list-none">
              <NavLink href={pathForView(st.view as ViewState)} onGo={() => onGo(st.view as ViewState)} className="group flex flex-col h-full rounded-2xl bg-white border border-gray-200 border-t-4 border-t-accent p-7 md:p-8 hover:border-accent transition-colors">
                <span className="text-xs font-bold tracking-[0.2em] text-accent">{st.step}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-offblack mt-2 tracking-tight">{st.verb}</h3>
                <p className="text-sm font-bold text-gray-500 mt-1">{st.name}</p>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mt-4 flex-grow">{st.desc}</p>
                <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold text-accent">
                  {g.more}<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </NavLink>
              {i < g.steps.length - 1 && <ArrowRight aria-hidden className="hidden lg:block absolute top-1/2 -right-[22px] w-5 h-5 text-gray-300" />}
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal><p className="text-sm text-gray-500 leading-relaxed mt-6">{g.note}</p></Reveal>
    </div>
  );
};

// トップの「こんなお悩みはありませんか」。各サービスページに書いてある課題から作る
const PainPoints: React.FC<{ onGo: (view: ViewState) => void }> = ({ onGo }) => {
  const { t } = useLanguage();
  const p = t.pains;
  return (
    <div>
      <Reveal>
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">{p.eyebrow}</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-offblack mt-3 leading-tight">{p.title}</h2>
      </Reveal>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        {p.items.map((it, i) => (
          <Reveal key={i} delay={i * 90} className="h-full">
            <li className="flex flex-col h-full rounded-2xl bg-[#F4F6FB] border-l-4 border-accent p-6 md:p-7">
              <p className="text-[15px] md:text-base text-[#1A2233] leading-[1.9] flex-grow">{it.text}</p>
              <NavLink href={pathForView(it.view as ViewState)} onGo={() => onGo(it.view as ViewState)} className="group inline-flex items-center gap-1.5 mt-5 text-sm font-bold text-accent">
                {it.service}{p.linkSuffix}<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </NavLink>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
};

const HomeView: React.FC<{ onNavigate?: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { t, lang } = useLanguage();

  const goTo = (id: ViewState) => {
    if (onNavigate) onNavigate(id);
    else window.location.hash = id;
  };

  // 事例カードから、導入事例ページの該当箇所まで送る

  // ヒーローの背景を、マウス位置にわずかに追従させる（動きを減らす設定では止める）
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', String((e.clientX - r.left) / r.width - 0.5));
      el.style.setProperty('--my', String((e.clientY - r.top) / r.height - 0.5));
    };
    const onLeave = () => {
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const services: { icon: ReactNode; title: string; subtitle: string; view: ViewState }[] = [
    { icon: <Globe className="w-6 h-6" />, title: t.works.service_ai.title, subtitle: t.works.service_ai.subtitle, view: 'biz-ai' },
    { icon: <Sparkles className="w-6 h-6" />, title: t.works.service_newbiz.title, subtitle: t.works.service_newbiz.subtitle, view: 'biz-newbiz' },
    { icon: <User className="w-6 h-6" />, title: t.works.service_training.title, subtitle: t.works.service_training.subtitle, view: 'training' },
    { icon: <Layers className="w-6 h-6" />, title: t.works.service_lab.title, subtitle: t.works.service_lab.subtitle, view: 'biz-crossborder' },
  ];

  return (
  <>
  <section ref={heroRef} className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden pt-40 pb-20">
    {/* 背景。光をゆっくり漂わせ、グリッドを流し、マウスにわずかに追従させる */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-40 -right-40 mgc-parallax">
        <div className="w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl mgc-orb-a" />
      </div>
      <div className="absolute bottom-20 -left-40 mgc-parallax">
        <div className="w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl mgc-orb-b" />
      </div>
      <div
        className="absolute -inset-10 opacity-[0.025] pointer-events-none mgc-grid mgc-parallax-soft"
        style={{
          backgroundImage: `linear-gradient(#050505 1px, transparent 1px), linear-gradient(90deg, #050505 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
    <div className="max-w-screen-xl w-full mx-auto relative">
      {/* Eyebrow: What we do */}
      <Reveal>
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.3em] text-accent">
            {t.hero.whatWeDo}
          </span>
        </div>
      </Reveal>

      <h1 className={`${lang === 'ja' ? 'text-[10vw] md:text-[6.5vw] leading-[1.15]' : 'text-[12vw] md:text-[10vw] leading-[0.9]'} font-bold tracking-tighter text-offblack mb-6`}>
        <span className="mgc-line">
          <span style={{ animationDelay: '80ms' }}>{t.hero.title_1}</span>
        </span>
        <span className="mgc-line">
          <span style={{ animationDelay: '220ms' }}>
            <span className="text-accent mgc-underline">{t.hero.title_2}</span>{lang === 'ja' ? '' : ' '}{t.hero.title_3}
          </span>
        </span>
      </h1>
      {lang === 'ja' && (
        <p className="font-mono text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-8 mgc-fade-up" style={{ animationDelay: '700ms' }}>
          {t.hero.subtitle_en}
        </p>
      )}

      {/* Service chips — "what we do" at a glance */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-10">
          {t.hero.chips.map((chip, i) => (
            <span
              key={i}
              style={{ animationDelay: `${900 + i * 110}ms` }}
              className="mgc-chip mgc-fade-up inline-flex items-center gap-2 px-4 py-2 bg-offblack text-white rounded-full text-xs md:text-sm font-bold tracking-tight hover:bg-accent"
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
              {chip}
            </span>
          ))}
      </div>

      <Reveal delay={250}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-gray-200 pt-8 mt-8 gap-6">
          <p className="text-lg md:text-xl text-gray-600 max-w-xl font-medium leading-relaxed whitespace-pre-line">
            {t.hero.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {SHOW_DIAGNOSIS && (
              <NavLink
                href={pathForView('diagnosis')} onGo={() => goTo('diagnosis')}
                className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-accent text-white rounded-full font-bold text-base tracking-tight hover:opacity-90 transition-all shadow-lg shadow-accent/20 whitespace-nowrap"
              >
                <Sparkles className="w-5 h-5" />
                {t.hero.tryDiagnosis}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            )}
            {/* 診断を隠している間は、相談ボタンを主導線に格上げする */}
            <NavLink
              href={pathForView('contact')} onGo={() => goTo('contact')}
              className={
                SHOW_DIAGNOSIS
                  ? 'group inline-flex items-center justify-center gap-2 text-offblack font-bold text-sm tracking-tight border-b-2 border-offblack pb-1 hover:text-accent hover:border-accent transition-colors whitespace-nowrap'
                  : 'group inline-flex items-center justify-center gap-3 px-6 py-4 bg-accent text-white rounded-full font-bold text-base tracking-tight hover:opacity-90 transition-all shadow-lg shadow-accent/20 whitespace-nowrap'
              }
            >
              {t.hero.bookConsult}
              <ArrowRight className={SHOW_DIAGNOSIS ? 'w-4 h-4 group-hover:translate-x-1 transition-transform' : 'w-5 h-5 group-hover:translate-x-1 transition-transform'} />
            </NavLink>
          </div>
        </div>
      </Reveal>
    </div>

    {/* スクロールを促す線 */}
    <div className="hidden md:flex absolute bottom-10 left-6 md:left-12 items-center gap-4 mgc-fade-up" style={{ animationDelay: '1400ms' }}>
      <span className="block w-px h-12 bg-gray-300 overflow-hidden">
        <span className="block w-px h-full bg-accent mgc-cue-line" />
      </span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Scroll</span>
    </div>
  </section>

  {/* === Service Index (under hero) === */}
  <div className="px-6 md:px-12 pb-24 max-w-screen-xl mx-auto w-full">
    {/* 見出しの階層（h1→h2→h3）をそろえるための、画面には出さない見出し */}
    <h2 className="sr-only">{t.nav.works}</h2>
    <Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-[2rem] overflow-hidden">
        {services.map((s, i) => (
          <NavLink
            key={i}
            href={pathForView(s.view)} onGo={() => goTo(s.view)}
            className="group bg-offwhite hover:bg-offblack transition-colors duration-500 p-10 text-left flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-accent">{s.icon}</div>
              <span className="font-mono text-xs text-gray-300 group-hover:text-accent transition-colors">0{i + 1}</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-offblack group-hover:text-white transition-colors duration-300">{s.title}</h3>
            <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed flex-grow">{s.subtitle}</p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-200 transition-colors">
              Learn More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </NavLink>
        ))}
      </div>
    </Reveal>
  </div>

  {/* === こんなお悩みはありませんか === */}
  <section className="px-6 md:px-12 pb-24 max-w-screen-xl mx-auto w-full">
    <PainPoints onGo={goTo} />
  </section>

  {/* === Free AI Diagnosis Banner (無料フロントエンド) === */}
  {/* 診断を隠している間は、HTMLにも出さない */}
  {SHOW_DIAGNOSIS && (
  <div className="px-6 md:px-12 pb-24 max-w-screen-xl mx-auto w-full">
    <Reveal>
      <NavLink
        href={pathForView('diagnosis')} onGo={() => goTo('diagnosis')}
        className="group w-full relative overflow-hidden rounded-[2rem] bg-offblack text-left p-8 md:p-12 hover:bg-accent transition-colors duration-500"
      >
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/80 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-accent group-hover:bg-white transition-colors animate-pulse" />
              {t.diagnosisBanner.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mt-5 leading-[1.2] whitespace-pre-line">
              {t.diagnosisBanner.title}
            </h2>
            <p className="text-base md:text-lg text-white/70 group-hover:text-white/90 transition-colors mt-4 leading-relaxed">
              {t.diagnosisBanner.lead}
            </p>
          </div>
          <span className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white text-offblack font-bold text-base tracking-tight whitespace-nowrap flex-shrink-0">
            {t.diagnosisBanner.cta}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </NavLink>
    </Reveal>
  </div>
  )}

  {/* === 事業の3段階（研修を入口に） === */}
  <section className="px-6 md:px-12 pb-24 max-w-screen-xl mx-auto w-full">
    <GrowthFlow onGo={goTo} />
  </section>

  {/* === One-Stop Flow Section === */}
  <section className="px-6 md:px-12 pb-24 max-w-screen-xl mx-auto w-full">
    <Reveal>
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">
          {t.oneStop.eyebrow}
        </span>
      </div>
      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-offblack mb-6 leading-tight">
        {t.oneStop.title}
      </h2>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-12 font-medium">
        {t.oneStop.lead}
      </p>
    </Reveal>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
      {t.oneStop.steps.map((s, i) => (
        <Reveal key={s.step} delay={i * 120} className="h-full">
          <div className="relative h-full bg-white rounded-2xl p-7 md:p-8 border border-gray-200 hover:border-accent transition-colors">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-4xl md:text-5xl font-bold text-accent/20 leading-none tabular-nums">{s.step}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Step</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-offblack mb-3 tracking-tight leading-snug">{s.title}</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">{s.desc}</p>
            {'duration' in s && s.duration && (
              <span className="inline-block mt-4 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs md:text-sm font-bold">{s.duration}</span>
            )}
            <ul className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              {s.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-accent flex-shrink-0 mt-1" strokeWidth={3} />
                  <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            {i < t.oneStop.steps.length - 1 && (
              <ArrowRight className="hidden lg:block absolute top-16 -right-4 w-6 h-6 text-gray-300" />
            )}
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal>
      <p className="text-sm text-gray-500 leading-relaxed mt-6">{t.oneStop.note}</p>
    </Reveal>
  </section>

  {/* === Stack / Coverage Section === */}
  <section className="px-6 md:px-12 pb-24 max-w-screen-xl mx-auto w-full">
    <Reveal>
      <div className="border border-gray-200 rounded-[2rem] p-8 md:p-12 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">
            {t.stack.eyebrow}
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-offblack mb-4 leading-tight">
          {t.stack.title}
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed mb-8 font-medium">
          {t.stack.lead}
        </p>
        {t.stack.groups.map((g, gi) => (
          <div key={gi} className="flex flex-col md:flex-row gap-3 md:gap-8 py-5 border-t border-gray-100">
            <span className="md:w-52 flex-shrink-0 text-xs font-bold uppercase tracking-widest text-gray-400 md:mt-2.5">
              {g.label}
            </span>
            <div className="flex flex-wrap gap-2">
              {g.items.map((item, ii) => (
                <span key={ii} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-bold text-offblack">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  </section>

  {/* === Why MGC Section === */}
  <section className="bg-white border-y border-gray-200 py-24 md:py-32 px-6 md:px-12">
    <div className="max-w-screen-xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">
            {t.whyMgc.eyebrow}
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[0.95] text-offblack">
          {t.whyMgc.title}
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed font-medium">
          {t.whyMgc.lead}
        </p>
        {/* 理念・価値観そのものは会社理念ページで詳しく伝える（トップでは重複させない） */}
        <NavLink
          href={pathForView('mission')}
          onGo={() => goTo('mission')}
          className="inline-flex items-center gap-2 mt-6 mb-16 text-sm font-bold text-accent hover:gap-3 transition-all"
        >
          {t.whyMgc.missionLink} <ArrowRight className="w-4 h-4" />
        </NavLink>
      </Reveal>

      {/* 3 Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {t.whyMgc.reasons.map((r, i) => (
          <Reveal key={r.number} delay={i * 100} className="h-full">
            <div className="group h-full bg-offwhite rounded-2xl p-8 border border-gray-200 hover:border-accent transition-colors duration-500 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-2xl font-bold text-accent">{r.number}</span>
              </div>
              <h3 className="text-2xl font-bold text-offblack mb-4 tracking-tight leading-snug">
                {r.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">{r.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Stats Strip */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
          {t.whyMgc.stats.map((s, i) => (
            <div key={i} className="bg-white p-8 md:p-10 flex flex-col items-start">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl md:text-7xl font-bold tracking-tighter text-offblack leading-none">{s.value}</span>
                <span className="text-xl md:text-2xl font-bold text-accent">{s.unit}</span>
              </div>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed mt-3">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>

  {/* === Case Studies (実績ダイジェスト) === */}
  <section className="px-6 md:px-12 py-24 md:py-32">
    <div className="max-w-screen-xl mx-auto">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">
                {t.homeCases.eyebrow}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-offblack leading-[0.95]">
              {t.homeCases.title}
            </h2>
          </div>
          <NavLink
            href={pathForView('cases')} onGo={() => goTo('cases')}
            className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all"
          >
            {t.homeCases.cta} <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {caseContent[lang].cases.map((cs, i) => (
          <Reveal key={cs.slug} delay={i * 90} className="h-full">
            <NavLink
              href={`/cases/${cs.slug}`} onGo={() => { window.location.href = `/cases/${cs.slug}`; }}
              className="group h-full w-full text-left bg-white rounded-3xl border border-gray-200 p-8 flex flex-col hover:border-accent transition-colors duration-500"
            >
              <div className="flex flex-wrap gap-2 mb-5">
                {cs.services.slice(0, 2).map((sv) => (
                  <span key={sv} className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-bold tracking-tight">
                    {sv}
                  </span>
                ))}
              </div>
              {cs.company && <p className="text-xs font-bold text-gray-500 mb-1">{cs.company.name}</p>}
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-offblack leading-snug">{cs.industry}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">{cs.scale}</p>
              <p className="text-sm text-gray-600 leading-relaxed mt-5 line-clamp-4 flex-grow">{cs.summary}</p>
              {cs.metrics?.length ? (
                <div className="mt-6 pt-5 border-t border-gray-200">
                  <p className="flex items-baseline gap-1 leading-none">
                    <span className="text-4xl font-bold tracking-tight text-offblack tabular-nums">{cs.metrics[0].value}</span>
                    <span className="text-base font-bold text-accent">{cs.metrics[0].unit}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{cs.metrics[0].label}</p>
                </div>
              ) : cs.result && (
                <p className="mt-6 pt-5 border-t border-gray-200 text-base font-bold text-offblack leading-snug">
                  {cs.result.label}
                </p>
              )}
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-accent transition-colors">
                {t.homeCases.detail} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </NavLink>
          </Reveal>
        ))}
      </div>
    </div>
  </section>

  {/* === お知らせ === */}
  <section className="px-6 md:px-12 pb-24 md:pb-32">
    <div className="max-w-screen-xl mx-auto">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">{t.news.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-offblack leading-tight">{t.news.title}</h2>
          </div>
          <NavLink href={pathForView('blog')} onGo={() => goTo('blog')} className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all">
            {t.news.more} <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </Reveal>
      <Reveal>
        <NewsList limit={4} onNavigate={goTo} />
      </Reveal>
    </div>
  </section>

  {/* === 最新のコラム（日本語のみ。build-columns が生成した一覧） === */}
  {lang === 'ja' && siteLinks.latest.length > 0 && (
  <section className="px-6 md:px-12 pb-24 md:pb-32">
    <div className="max-w-screen-xl mx-auto">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">Column</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-offblack leading-tight mt-3">最新のコラム</h2>
          </div>
          <a href="/column" className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all">
            コラム一覧へ <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </Reveal>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {siteLinks.latest.map((c) => (
          <li key={c.slug}>
            <a href={`/column/${c.slug}`} className="group block h-full bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-accent transition-colors">
              <img src={c.image} alt={c.imageAlt} width={1400} height={788} loading="lazy" className="w-full h-auto aspect-video object-cover" />
              <span className="block p-5">
                <span className="block text-xs font-bold text-gray-500">{c.industry}<span className="ml-2 font-normal">{c.date.replace(/-/g, '.')}</span></span>
                <span className="block text-base font-bold leading-[1.6] mt-2 group-hover:text-accent transition-colors">{c.title}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
  )}

  {/* === FAQ Section === */}
  <section className="px-6 md:px-12 py-24 md:py-32 bg-offwhite">
    <div className="max-w-screen-xl mx-auto">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">
                {t.faq.eyebrow}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-offblack leading-[0.95]">
              {t.faq.title}
            </h2>
          </div>
        </div>
      </Reveal>
      <div className="space-y-3 md:space-y-4">
        {t.faq.items.map((item, i) => (
          <Reveal key={i} delay={i * 80}>
            <FaqItem question={item.q} answer={item.a} index={i} link={item.link ? { href: item.link, label: (item as { linkLabel?: string }).linkLabel ?? t.pricing.faqLink, onGo: () => (item.link === '/pricing' ? onNavigate?.('pricing') : window.location.assign(item.link!)) } : undefined} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>

  {/* === Home CTA Section === */}
  <section className="px-6 md:px-12 py-24 md:py-32">
    <div className="max-w-screen-xl mx-auto">
      <Reveal>
        <div className="relative bg-accent rounded-[2.5rem] p-12 md:p-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/80">
                {t.homeCTA.eyebrow}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight">
              {t.homeCTA.title}
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 whitespace-pre-line max-w-3xl">
              {t.homeCTA.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
              <NavLink
                href={pathForView('contact')} onGo={() => goTo('contact')}
                className="group inline-flex items-center gap-3 px-7 py-4 bg-white text-offblack rounded-full font-bold tracking-tight hover:bg-offwhite transition-colors whitespace-nowrap shadow-xl"
              >
                {t.homeCTA.primary}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NavLink>
              <NavLink
                href={pathForView('works')} onGo={() => goTo('works')}
                className="group inline-flex items-center gap-2 text-white font-bold text-sm tracking-tight border-b-2 border-white/40 pb-1 hover:border-white transition-colors whitespace-nowrap"
              >
                {t.homeCTA.secondary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </div>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed">
              {t.homeCTA.foot}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
  </>
  );
};

// --- Service Block (uniform structure for each service) ---
const ServiceBlock: React.FC<{
  index: '01' | '02' | '03' | '04';
  serviceKey: ContentKey;
  icon: ReactNode;
  image?: string;
  /** 「詳しく見る」の行き先（各事業のページ） */
  detailView: ViewState;
  onNavigate?: (view: ViewState) => void;
}> = ({ index, serviceKey, icon, image, detailView, onNavigate }) => {
  const { t } = useLanguage();
  const data = t.works[serviceKey];
  return (
    <Reveal>
      <section className="border-t border-gray-200 pt-16 md:pt-20 pb-4">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          {/* Left column: index + headline */}
          <div className="md:col-span-5 lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                SERVICE / {index}
              </span>
            </div>
            <div className="text-[7rem] md:text-[9rem] font-bold text-gray-200 leading-[0.85] mb-8 select-none tracking-tighter">
              {index}
            </div>
            {image && (
              <div className="rounded-2xl overflow-hidden mb-8 border border-gray-200">
                <img src={image} alt={data.title} loading="lazy" className="w-full aspect-[4/3] object-cover" />
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
                {icon}
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-offblack tracking-tight mb-4 leading-[1.1]">
              {data.title}
            </h2>
            <p className="text-lg md:text-xl text-accent font-bold leading-snug">
              {data.subtitle}
            </p>
          </div>
          {/* Right column: description + features */}
          <div className="md:col-span-7 lg:col-span-7 md:pl-6 md:border-l md:border-gray-200">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-10 font-normal">
              {data.desc}
            </p>
            <div className="space-y-6 mb-8">
              {data.items.map((item, i) => (
                <div key={i} className="group flex gap-4 md:gap-6 pb-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex-shrink-0">
                    <span className="font-mono text-xs font-bold text-accent">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-offblack mb-1 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-accent/80 mb-2">
                      {item.sub}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {item.text}
                    </p>
                    {(() => {
                      // AIソリューションの各サービスは、個別のサービスページへつなぐ
                      const link = (item as { link?: string }).link;
                      return link && isServiceKey(link) ? (
                        <NavLink
                          href={pathForView(link)} onGo={() => onNavigate?.(link)}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all"
                        >
                          {t.worksIntro.serviceLink} <ArrowRight className="w-4 h-4" />
                        </NavLink>
                      ) : null;
                    })()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
              <NavLink
                href={pathForView(detailView)}
                onGo={() => onNavigate?.(detailView)}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white font-bold text-sm tracking-tight hover:opacity-90 transition-opacity"
              >
                {serviceKey === 'service_training' ? t.worksIntro.trainingLink : t.worksIntro.detailLink}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
};

const WorksView: React.FC<{ onNavigate?: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { t, lang } = useLanguage();

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        {/* === Page Intro Hero === */}
        <Reveal>
          <div className="pb-12 md:pb-16">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">
                {t.worksIntro.eyebrow}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-offblack leading-[0.9] mb-8">
              {t.headings.works.title}
            </h1>
            <p aria-hidden className="-mt-6 mb-8 text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-accent leading-[0.9]">{t.headings.works.sub}</p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl font-medium">
              {t.worksIntro.lead}
            </p>
          </div>
        </Reveal>

        {/* === Index Strip === */}
        <Reveal delay={150}>
          <div className="mb-20 md:mb-32 pt-8 border-t border-gray-200">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">
              {t.worksIntro.indexLabel}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(['service_ai', 'service_newbiz', 'service_training', 'service_lab'] as const).map((key, i) => (
              <a
                key={key}
                href={`#service-0${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`service-0${i + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-accent transition-colors"
              >
                <span className="font-mono text-xs text-accent font-bold">
                  0{i + 1}
                </span>
                <span className="text-sm font-bold text-offblack group-hover:text-accent transition-colors leading-snug">
                  {t.works[key].title}
                </span>
              </a>
            ))}
            </div>
          </div>
        </Reveal>

        {/* === Service Blocks (vertical, uniform) === */}
        <div id="service-01" className="scroll-mt-24">
          <ServiceBlock
            index="01"
            serviceKey="service_ai"
            icon={<Globe className="w-5 h-5 text-accent stroke-[1.75]" />}
            image="/assets/service_ai.webp"
            detailView="biz-ai"
            onNavigate={onNavigate}
          />
        </div>

        <div id="service-02" className="scroll-mt-24 mt-24 md:mt-32">
          <ServiceBlock
            index="02"
            serviceKey="service_newbiz"
            icon={<Sparkles className="w-5 h-5 text-accent stroke-[1.75]" />}
            image="/assets/service_newbiz.webp"
            detailView="biz-newbiz"
            onNavigate={onNavigate}
          />
        </div>

        <div id="service-03" className="scroll-mt-24 mt-24 md:mt-32">
          <ServiceBlock
            index="03"
            serviceKey="service_training"
            icon={<User className="w-5 h-5 text-accent stroke-[1.75]" />}
            image="/assets/service_training.webp"
            detailView="training"
            onNavigate={onNavigate}
          />
        </div>

        <div id="service-04" className="scroll-mt-24 mt-24 md:mt-32">
          <ServiceBlock
            index="04"
            serviceKey="service_lab"
            icon={<Zap className="w-5 h-5 text-accent stroke-[1.75]" />}
            image="/assets/service_lab.webp"
            detailView="biz-crossborder"
            onNavigate={onNavigate}
          />
        </div>

        {/* === 事業の3段階（研修を入口に） === */}
        <div className="mt-24 md:mt-32 border-t border-gray-200 pt-16">
          <GrowthFlow onGo={(v) => onNavigate?.(v)} />
        </div>

        {/* === One-Stop Flow === */}
        <div className="mt-24 md:mt-32 border-t border-gray-200 pt-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-offblack tracking-tighter max-w-xl leading-tight">{t.oneStop.title}</h2>
              <p className="text-gray-600 leading-relaxed max-w-md font-medium">{t.oneStop.lead}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
              {t.oneStop.steps.map((s, i) => (
                <div key={s.step} className="relative h-full bg-white rounded-2xl p-7 md:p-8 border border-gray-200 hover:border-accent transition-colors">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="font-mono text-4xl md:text-5xl font-bold text-accent/20 leading-none tabular-nums">{s.step}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Step</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-offblack mb-3 tracking-tight leading-snug">{s.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">{s.desc}</p>
                  {'duration' in s && s.duration && (
                    <span className="inline-block mt-4 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs md:text-sm font-bold">{s.duration}</span>
                  )}
                  <ul className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    {s.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-accent flex-shrink-0 mt-1" strokeWidth={3} />
                        <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {i < t.oneStop.steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-16 -right-4 w-6 h-6 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mt-6">{t.oneStop.note}</p>
          </Reveal>
        </div>

        {/* === 次の一歩（事例・相談） === */}
        <Reveal>
          <div className="mt-24 md:mt-32 rounded-[1.75rem] md:rounded-[2.5rem] bg-[#F4F6FB] border border-gray-200 px-7 py-12 md:px-16 md:py-16">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-offblack leading-[1.5]">{t.worksIntro.ctaTitle}</h2>
            <p className="text-base md:text-lg text-[#1A2233] leading-[1.9] mt-4 max-w-2xl">{t.worksIntro.ctaLead}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
              <NavLink
                href={pathForView('contact')}
                onGo={() => onNavigate?.('contact')}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-accent text-white font-bold text-sm md:text-base tracking-tight hover:opacity-90 transition-opacity"
              >
                {t.homeCTA.primary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </NavLink>
              <NavLink
                href={pathForView('cases')}
                onGo={() => onNavigate?.('cases')}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-gray-300 bg-white text-offblack font-bold text-sm tracking-tight hover:border-offblack transition-colors"
              >
                {t.homeCases.cta}
              </NavLink>
            </div>
          </div>
        </Reveal>

      </div>
    </PageTransition>
  );
};


const MissionView: React.FC = () => {
  const { t } = useLanguage();
  const m = t.mission;
  return (
    <PageTransition>
      <div className="min-h-screen text-offblack pb-20">
        <div className="px-6 md:px-12 max-w-screen-xl mx-auto pt-10">
          <SectionHeading as="h1" title={t.headings.mission.title} subtitle={t.headings.mission.sub} />

          {/* ビジョン・ミッション */}
          <Reveal>
            <div className="mb-24 md:mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">{m.visionLabel}</span>
                <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 text-offblack leading-tight tracking-tight">{m.intro.title}</h2>
                <p className="text-lg md:text-xl leading-relaxed text-gray-700">{m.intro.desc}</p>
              </div>
              <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-200">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-3 text-accent">
                  <Anchor className="w-5 h-5" />
                  Mission
                </h3>
                <p className="text-2xl font-bold mb-4 leading-snug">{m.intro.mission_title}</p>
                <p className="text-gray-600 leading-relaxed">{m.intro.mission_desc}</p>
              </div>
            </div>
          </Reveal>

          {/* 基本思想 */}
          <Reveal>
            <div className="mb-24 md:mb-32 border-l-4 border-accent pl-6 md:pl-10 py-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">{m.principle.eyebrow}</span>
              <h2 className="text-2xl md:text-4xl font-bold text-offblack tracking-tight mt-3 leading-snug">{m.principle.title}</h2>
              <p className="text-base md:text-lg text-gray-700 leading-[2] mt-5 max-w-3xl">{m.principle.desc}</p>
            </div>
          </Reveal>

          {/* 届ける価値 */}
          <section className="mb-24 md:mb-32">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold text-offblack tracking-tight mb-8">{m.offer.title}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {m.offer.items.map((o, i) => (
                <Reveal key={i} delay={i * 90} className="h-full">
                  <div className="h-full bg-white rounded-2xl border border-gray-200 p-7">
                    <span className="font-mono text-sm font-bold text-accent">0{i + 1}</span>
                    <h3 className="text-xl font-bold text-offblack mt-3 mb-2">{o.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{o.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* バリュー */}
          <section className="mb-24 md:mb-32">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold text-offblack tracking-tight mb-4">{m.valuesTitle}</h2>
            </Reveal>
            <div className="space-y-12">
              {m.values.map((v, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="group border-t border-gray-200 pt-10 hover:border-accent transition-colors duration-500">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <span className="text-6xl font-bold text-gray-200 group-hover:text-accent transition-colors duration-500">0{i + 1}</span>
                        <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-1">{v.title}</h3>
                        <p className="text-sm font-bold uppercase tracking-widest text-accent">{v.sub}</p>
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">{v.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 選ぶ仕事 */}
          <Reveal>
            <div className="rounded-2xl bg-[#F4F6FB] p-8 md:p-10">
              <h2 className="text-xl md:text-2xl font-bold text-offblack tracking-tight">{m.choice.title}</h2>
              <p className="text-base md:text-lg text-gray-700 leading-[2] mt-4 max-w-3xl">{m.choice.desc}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
};

// PartnersView is temporarily hidden but kept in the codebase for future use
const PartnersView: React.FC = () => {
   const partners = [
    { code: 'ULN', city: 'Ulaanbaatar', name: 'Moniinnotech', role: 'Central Asia Tech Hub', description: 'モンゴル独自の高度IT人材ネットワークを活用した、スケーラブルな開発体制の構築。AIデータセットの精製からコアモジュールの実装まで、技術基盤を強固に支える。', x: 75, y: 35 },
    { code: 'SFO', city: 'San Francisco', name: 'Nebula AI Labs', role: 'Research Partner', description: 'シリコンバレーの最先端AI研究機関との連携により、生成AIの最新モデルをプロダクトへ即座に統合。技術的な優位性を担保する。', x: 15, y: 38 },
    { code: 'LND', city: 'London', name: 'ElevenLabs', role: 'Voice AI Partner', description: '英国発の音声AIユニコーン。感情や抑揚を完璧に再現する世界最高峰の音声合成モデルを連携させ、言語の壁を「声」のレベルで完全に消滅させる。', x: 48, y: 28 },
    { code: 'TYO', city: 'Kyoto (HQ)', name: 'MGC Inc.', role: 'Headquarters', description: '日本の精神性と美意識を、テクノロジーの実装に落とし込む司令塔。すべての戦略とクリエイティブはここから生まれる。', x: 85, y: 40 },
  ];
  
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <PageTransition>
       <div className="px-6 md:px-12 max-w-screen-xl mx-auto min-h-screen">
        <SectionHeading 
          title={t.headings.alliance.title} 
          subtitle={t.headings.alliance.sub} 
        />
        
        <div className="relative w-full aspect-[16/9] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-12 group/map">
            {/* Light Grid Background */}
            <GridPattern />
            
            {/* World Map SVG (Simplified) */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full text-gray-100 fill-current pointer-events-none opacity-100 transition-opacity duration-500">
                <g className="stroke-gray-300 stroke-1">
                  {/* North America */}
                  <path d="M130,120 L280,90 L320,110 L350,70 L420,80 L380,190 L320,230 L280,260 L220,240 L180,270 L140,210 L120,140 Z" />
                  {/* South America */}
                  <path d="M280,270 L360,270 L400,330 L380,460 L320,530 L280,410 L260,330 Z" />
                  {/* Europe */}
                  <path d="M460,80 L520,70 L580,80 L560,130 L520,150 L480,140 L450,110 Z" />
                  {/* Africa */}
                  <path d="M440,160 L540,160 L580,190 L600,290 L520,390 L460,330 L420,230 Z" />
                  {/* Asia */}
                  <path d="M580,80 L700,70 L850,80 L900,130 L850,230 L750,260 L680,210 L620,190 Z" />
                  {/* Australia */}
                  <path d="M780,360 L880,360 L900,430 L820,460 L760,410 Z" />
                  {/* Greenland */}
                  <path d="M350,50 L420,40 L440,90 L380,100 Z" />
                  {/* SE Asia Islands */}
                  <path d="M850,260 L880,260 L880,330 L840,310 Z" />
                </g>
            </svg>

            {/* Connection Lines (Optional decorative) */}
            <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
               {/* Lines from HQ to partners */}
               {partners.filter(p => p.code !== 'TYO').map((p, i) => (
                   <line 
                     key={i} 
                     x1="86" y1="38" 
                     x2={p.x} y2={p.y} 
                     stroke="#000"
                     strokeWidth="0.1" 
                     strokeDasharray="1 1"
                   />
               ))}
            </svg>

            {/* City Nodes */}
            {partners.map((p, i) => (
                <div 
                    key={i}
                    className="absolute group"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    onMouseEnter={() => setActiveCity(p.code)}
                    onMouseLeave={() => setActiveCity(null)}
                >
                    <div className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer p-4">
                        <div className={`w-4 h-4 rounded-full ${p.code === 'TYO' ? 'bg-accent shadow-[0_0_20px_rgba(45,108,223,0.4)]' : 'bg-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.2)]'} relative z-10 transition-transform duration-300 group-hover:scale-150`}></div>
                        <div className={`absolute inset-0 m-4 w-4 h-4 rounded-full ${p.code === 'TYO' ? 'bg-accent' : 'bg-gray-800'} animate-ping opacity-20`}></div>
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:top-10">
                            <span className="text-xs font-mono font-bold text-white bg-black px-2 py-1 rounded backdrop-blur-sm shadow-md">{p.code}</span>
                        </div>
                    </div>
                </div>
            ))}

            {/* Active City Details Overlay */}
            <div className={`absolute bottom-8 left-8 right-8 md:w-96 bg-white/90 backdrop-blur-md border border-gray-200 p-6 rounded-2xl transition-all duration-300 shadow-xl ${activeCity ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                 {activeCity && (
                     <>
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-xl font-bold text-gray-900">{partners.find(p => p.code === activeCity)?.name}</h3>
                             <span className="text-accent font-mono text-sm">{activeCity}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-3">{partners.find(p => p.code === activeCity)?.city}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{partners.find(p => p.code === activeCity)?.description}</p>
                     </>
                 )}
            </div>
            
            {/* Default Overlay when no city selected */}
             <div className={`absolute bottom-8 left-8 pointer-events-none transition-all duration-300 ${!activeCity ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-gray-600 font-mono text-sm bg-white/80 px-3 py-2 rounded backdrop-blur-sm border border-gray-200 shadow-sm">
                    <MapPin className="w-4 h-4 inline mr-2 text-accent" />
                    Hover nodes to explore network
                </p>
             </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {partners.map((p, i) => (
                 <div key={i} className="border-t border-gray-200 pt-4 cursor-pointer hover:bg-gray-100 transition-colors" onMouseEnter={() => setActiveCity(p.code)} onMouseLeave={() => setActiveCity(null)}>
                     <span className={`font-mono text-2xl block mb-2 transition-colors ${activeCity === p.code ? 'text-accent' : 'text-gray-300'}`}>{p.code}</span>
                     <span className="text-sm font-bold text-offblack">{p.city}</span>
                 </div>
             ))}
        </div>
      </div>
    </PageTransition>
  )
}

const CompanyView: React.FC<{ onNavigate?: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const c = t.company;
  const mapQuery = encodeURIComponent('京都府京都市上京区西辰巳町111');

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <SectionHeading as="h1" title={t.headings.company.title} subtitle={t.headings.company.sub} />

        {/* 代表メッセージ */}
        <section className="mb-24 md:mb-32">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">{c.message.eyebrow}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-offblack tracking-tight mt-3 leading-snug">{c.message.title}</h2>
                <div className="w-16 h-1.5 bg-accent mt-5 rounded-full" />
              </div>
              <div className="lg:col-span-8">
                <div className="space-y-6">
                  {c.message.paragraphs.map((para, i) => (
                    <p key={i} className="text-base md:text-lg text-gray-700 leading-[2]">{para}</p>
                  ))}
                </div>
                <div className="mt-10 pt-8 border-t border-gray-200 flex items-end justify-between gap-6">
                  <div>
                    <p className="text-sm text-gray-500">{c.message.role}</p>
                    <p className="text-2xl md:text-3xl font-bold text-offblack tracking-tight mt-1">{c.message.name}</p>
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 mt-2">{c.message.nameEn}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 会社情報 */}
        <section className="mb-24 md:mb-32">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-offblack tracking-tight mb-4">{c.profileTitle}</h2>
          </Reveal>
          <dl className="grid grid-cols-1 border-t border-gray-200">
            {c.items.map((item, index) => (
              <Reveal key={index} delay={index * 60}>
                <div className="flex flex-col md:flex-row gap-2 md:gap-8 py-7 border-b border-gray-200">
                  <dt className="md:w-1/4 text-sm font-bold text-gray-500 pt-1">{item.label}</dt>
                  <dd className="md:w-3/4 text-lg md:text-xl font-medium text-offblack whitespace-pre-line leading-relaxed">{item.value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>

        {/* 沿革 */}
        <section className="mb-24 md:mb-32">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-offblack tracking-tight mb-10">{c.history.title}</h2>
          </Reveal>
          <ol className="relative border-l-2 border-gray-200 ml-2 space-y-8">
            {c.history.items.map((h, i) => (
              <Reveal key={i} delay={i * 60}>
                <li className="pl-8 relative">
                  <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-accent" />
                  <p className="text-sm font-mono font-bold text-accent tracking-wide">{h.date}</p>
                  <p className="text-base md:text-lg text-offblack font-medium mt-1 leading-relaxed">{h.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* アクセス */}
        <section className="mb-16">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-offblack tracking-tight mb-6">{c.access.title}</h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">{c.access.address}</p>
            <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 aspect-[16/9] md:aspect-[21/9]">
              <iframe
                title={c.access.mapTitle}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-5">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all"
              >
                {c.access.mapLabel} <ArrowRight className="w-4 h-4" />
              </a>
              <NavLink
                href={pathForView('mission')} onGo={() => onNavigate?.('mission')}
                className="inline-flex items-center gap-2 text-sm font-bold text-offblack hover:text-accent transition-colors"
              >
                {c.missionLink} <ArrowRight className="w-4 h-4" />
              </NavLink>
            </div>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  );
};

const CareerView: React.FC = () => {
  const { t } = useLanguage();
  const mindsets = t.career.mindsets;

  const skills = t.career.skills;

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto text-offblack">
        <SectionHeading as="h1" title={t.headings.career.title} subtitle={t.headings.career.sub} />

        {/* Introduction */}
        <Reveal>
          <div className="mb-32 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                <p className="text-2xl md:text-4xl font-light leading-snug">
                   {t.career.intro.desc}
                   <br/>
                   <span className="text-offblack font-bold mt-4 block">{t.career.intro.call}</span>
                </p>
            </div>
          </div>
        </Reveal>

        {/* Mindset Section */}
        <div className="mb-40">
          <Reveal>
            <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-offblack tracking-tight border-b border-gray-200 pb-6 mb-10">
              <Heart className="text-accent w-7 h-7" /> {t.career.subheadings.mindset}
            </h2>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mindsets.map((m, i) => (
               <Reveal key={i} delay={i * 100} className="h-full">
                 <div className="group relative h-full bg-white rounded-[2rem] p-8 md:p-12 shadow-sm hover:shadow-[0_20px_50px_rgba(17,20,24,0.10)] transition-all duration-500 border border-gray-200 overflow-hidden flex flex-col justify-between">
                    
                    {/* Background Pattern appearing on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                        <GridPattern />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-end items-start mb-8">
                             <span className="text-6xl font-mono font-bold text-gray-200 group-hover:text-gray-600 transition-colors duration-500">0{i+1}</span>
                        </div>
                        
                        <h3 className="text-3xl font-bold mb-6 tracking-tight text-offblack group-hover:translate-x-2 transition-transform duration-500">{m.title}</h3>
                        
                        <div className="space-y-6">
                            <div className="relative pl-6 transition-all duration-500 group-hover:pl-8">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-full"></div>
                                <p className="text-lg font-bold text-offblack mb-2">{m.req}</p>
                                <p className="text-gray-600 leading-relaxed">{m.desc}</p>
                            </div>

                            <div className="relative pl-6 pt-6 border-t border-gray-200 transition-all duration-500 opacity-60 group-hover:opacity-100">
                                <div className="absolute left-0 top-6 bottom-0 w-1 bg-gray-300 rounded-full group-hover:bg-gray-400 transition-colors"></div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Anti-Pattern</p>
                                <p className="text-gray-600 font-medium">NG: {m.ng}</p>
                                <p className="text-gray-500 text-sm mt-1">{m.ngDesc}</p>
                            </div>
                        </div>
                    </div>
                 </div>
               </Reveal>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-40">
          <Reveal>
            <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-offblack tracking-tight border-b border-gray-200 pb-6 mb-10">
              <Zap className="text-accent w-7 h-7" /> {t.career.subheadings.skills}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {skills.map((s, i) => (
                <Reveal key={i} delay={i * 100} className="h-full">
                  <div className="group relative h-full bg-white text-offblack rounded-[2rem] p-10 overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors duration-500 flex flex-col">
                     {/* Dynamic Background */}
                     <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                        <GridPattern />
                     </div>
                     <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/40 transition-all duration-700"></div>

                     <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-auto">
                            <span className="inline-block px-3 py-1 rounded-full border border-gray-300 text-xs font-mono mb-6 text-gray-600 group-hover:border-accent group-hover:text-accent transition-all duration-500">Skill 0{i+1}</span>
                            <h3 className="text-3xl font-bold tracking-tighter mb-4 group-hover:text-accent transition-colors duration-300">{s.title}</h3>
                            <p className="text-xl font-medium text-offblack mb-4">{s.sub}</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                        </div>

                        <div className="mt-8 p-4 rounded-xl bg-offblack/5 border border-offblack/10 backdrop-blur-sm transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="flex items-start gap-3">
                                <X className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Mismatch</span>
                                    <p className="text-sm text-gray-600">{s.ng}</p>
                                </div>
                            </div>
                        </div>
                     </div>
                  </div>
                </Reveal>
             ))}
          </div>
        </div>

        {/* CTA */}
        <Reveal>
           <div className="group relative bg-accent text-white p-12 md:p-24 rounded-[3rem] overflow-hidden text-center shadow-2xl mb-12 cursor-pointer hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 bg-offblack opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              
              <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] animate-[spin_20s_linear_infinite]"></div>
              {/* Added decorative logic */}
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter">{t.career.cta.title}</h2>
                <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed whitespace-pre-line">
                   {t.career.cta.desc}
                </p>
                <button className="px-10 py-5 bg-white text-offblack rounded-full font-bold text-xl hover:bg-offwhite transition-colors shadow-lg">
                   {t.career.cta.button}
                </button>
              </div>
           </div>
        </Reveal>
      </div>
    </PageTransition>
  )
}

// お知らせの一覧。内部リンクはSPA遷移、/column は静的ページなので通常のリンク
const NewsList: React.FC<{ limit?: number; onNavigate?: (view: ViewState) => void }> = ({ limit, onNavigate }) => {
  const { t } = useLanguage();
  const items = limit ? t.news.items.slice(0, limit) : t.news.items;
  return (
    <ul className="border-t border-gray-200">
      {items.map((n, i) => {
        const isStatic = n.href.startsWith('/column');
        const inner = (
          <>
            <span className="font-mono text-sm text-gray-500 tabular-nums w-24 flex-shrink-0">{n.date}</span>
            <span className="inline-flex items-center justify-center min-w-[4.5rem] px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-bold flex-shrink-0">{n.category}</span>
            <span className="flex-1 text-base text-offblack font-medium leading-relaxed group-hover:text-accent transition-colors">{n.title}</span>
            <ArrowRight className="hidden sm:block w-4 h-4 text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
          </>
        );
        const cls = 'group flex flex-wrap sm:flex-nowrap items-center gap-x-5 gap-y-2 py-5 border-b border-gray-200 w-full text-left';
        return (
          <li key={i}>
            {isStatic ? (
              <a href={n.href} className={cls}>{inner}</a>
            ) : (
              <NavLink href={n.href} onGo={() => onNavigate?.(viewForPath(n.href))} className={cls}>{inner}</NavLink>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const BlogView: React.FC<{ onNavigate?: (view: ViewState) => void; onNavigatePath: (path: string) => void }> = ({ onNavigate, onNavigatePath }) => {
  const { t, lang } = useLanguage();
  const posts = journalPosts(lang);

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <SectionHeading as="h1" title={t.headings.blog.title} subtitle={t.headings.blog.sub} />

        {/* お知らせ */}
        <section className="mb-24 md:mb-32">
          <Reveal>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">{t.news.eyebrow}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-offblack tracking-tight mt-3 mb-8">{t.news.title}</h2>
          </Reveal>
          <Reveal>
            <NewsList onNavigate={onNavigate} />
          </Reveal>
        </section>

        {/* ジャーナル（記事は /blog/<slug> の個別ページ） */}
        <section>
          <Reveal>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">{t.journal.eyebrow}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-offblack tracking-tight mt-3">{t.journal.title}</h2>
            <p className="text-gray-600 leading-relaxed mt-3 mb-10">{t.journal.lead}</p>
          </Reveal>
          <JournalCards posts={posts} onNavigatePath={onNavigatePath} />
        </section>
      </div>
    </PageTransition>
  );
};

const JournalCards: React.FC<{ posts: ReturnType<typeof journalPosts>; onNavigatePath: (path: string) => void }> = ({ posts, onNavigatePath }) => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((p, i) => (
        <Reveal key={p.id} delay={(i % 3) * 90} className="h-full">
          <NavLink
            href={journalPath(p.slug)}
            onGo={() => onNavigatePath(journalPath(p.slug))}
            className="group h-full w-full text-left bg-white rounded-3xl border border-gray-200 overflow-hidden hover:border-accent hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <img src={p.image} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
              <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 text-accent text-[10px] font-bold tracking-widest uppercase rounded-full">{p.category}</span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <time dateTime={p.isoDate} className="font-mono text-xs text-gray-400">{p.date}</time>
              <h3 className="text-lg font-bold text-offblack mt-2 mb-3 leading-snug group-hover:text-accent transition-colors">{p.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-grow">{p.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-accent font-bold text-sm">
                {t.journal.readMore} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </NavLink>
        </Reveal>
      ))}
    </div>
  );
};

// ジャーナル記事の個別ページ（/blog/<slug>）
const JournalPostView: React.FC<{ slug: string; onNavigate: (view: ViewState) => void; onNavigatePath: (path: string) => void }> = ({ slug, onNavigate, onNavigatePath }) => {
  const { t, lang } = useLanguage();
  const post = findJournalPost(lang, slug);
  if (!post) return <NotFoundView onNavigate={onNavigate} />;
  // ほかの記事: 前後の記事を出す（新しい3本に偏らず、どの記事も前後からリンクされる）
  const all = journalPosts(lang);
  const pos = all.findIndex((p) => p.slug === slug);
  const others = [all[pos - 1], all[pos + 1], all[pos + 2] ?? all[pos - 2]].filter((p): p is (typeof all)[number] => !!p && p.slug !== slug);
  return (
    <PageTransition>
      <article className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
          <NavLink href="/" onGo={() => onNavigate('home')} className="hover:text-accent transition-colors">{lang === 'ja' ? 'ホーム' : 'Home'}</NavLink>
          <span aria-hidden>／</span>
          <NavLink href="/blog" onGo={() => onNavigate('blog')} className="hover:text-accent transition-colors">{t.headings.blog.title}</NavLink>
        </nav>
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold tracking-widest uppercase rounded-full">{post.category}</span>
            <time dateTime={post.isoDate} className="text-gray-500 font-mono text-sm">{post.date}</time>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-offblack leading-[1.4] mt-5">{post.title}</h1>
          <p className="text-sm text-gray-500 mt-5">{t.journal.author}</p>
        </div>
        <div className="mt-10 rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden bg-gray-100 aspect-[16/9] md:aspect-[21/9]">
          <img src={post.image} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="max-w-3xl mt-12">
          <p className="text-lg md:text-xl text-offblack leading-[1.9] font-medium border-l-4 border-accent pl-5">{post.excerpt}</p>
          <div className="mt-10 space-y-6">
            {post.content.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="text-base md:text-[17px] text-[#1A2233] leading-[2] whitespace-pre-line">{para}</p>
            ))}
          </div>
          <div className="mt-14 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-bold text-gray-500">{t.journal.author}</span>
            <NavLink href="/blog" onGo={() => onNavigate('blog')} className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all">
              {lang === 'ja' ? 'お知らせ・ジャーナル一覧へ' : 'All news & journal'} <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
        {(() => {
          const gs = guidesForText(`${post.title}\n${post.content}`);
          return <RelatedReading title={lang === 'ja' ? 'あわせて読みたい' : 'Related reading'} items={[...guideReading(lang, gs), ...columnReading(lang, columnsForGuides(gs, 2))]} />;
        })()}
        <section className="mt-24 md:mt-32">
          <h2 className="text-2xl md:text-3xl font-bold text-offblack tracking-tight mb-8">{lang === 'ja' ? 'ほかの記事' : 'More from the journal'}</h2>
          <JournalCards posts={others} onNavigatePath={onNavigatePath} />
        </section>
      </article>
    </PageTransition>
  );
};

// #contact/<slug> で来たとき、その相談内容を初期選択する。
// どのサービスページ経由の問い合わせかを、受信メール側で判別できるようにする。
// 種別の並び（topicOptions と同じ順）: 研修／AI営業／AI電話／Salesforce AI／AI事業立ち上げ／クロスボーダー／その他。
// AIソリューションのページ（個別のコンサル・開発を含む）からは「その他（AI導入全般）」を選んだ状態にする。
const SERVICE_TOPIC_INDEX: Record<string, number> = { training: 0, 'ai-sales': 1, 'ai-phone': 2, 'salesforce-ai': 3, newbiz: 4, crossborder: 5, other: 6, 'ai-solutions': 6 };

const ContactView: React.FC<{ onNavigate?: (view: ViewState) => void; initialSent?: boolean }> = ({ onNavigate, initialSent = false }) => {
  const { t, lang } = useLanguage();
  const f = t.contact.form;
  const initialTopic = (() => {
    if (typeof window === 'undefined') return '';
    const seg = window.location.hash.slice(1).split('/')[1];
    const i = seg !== undefined ? SERVICE_TOPIC_INDEX[seg] : undefined;
    return i !== undefined ? (t.contact.form.topicOptions[i] ?? '') : '';
  })();
  const [formState, setFormState] = useState({ name: '', email: '', company: '', topic: initialTopic, message: '' });
  // 迷惑送信対策: 人には見えない入力欄。ボットが埋めるとサーバー側で破棄される
  const [website, setWebsite] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sendError, setSendError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(initialSent);

  // 送信完了は /contact/thanks（検索結果に出さない）。表示が切り替わるたびに title 等を合わせる
  useEffect(() => {
    applyMeta(metaFor('contact', lang, isSent ? THANKS_PATH : '/contact'));
  }, [isSent, lang]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formState.email)) {
      setEmailError(f.emailError);
      return;
    }
    if (!agreed) {
      setSendError(f.consentError);
      return;
    }
    setSendError('');
    setIsSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          website,
          message: `[Company] ${formState.company || '(unspecified)'}\n[Topic] ${formState.topic || '(unspecified)'}\n\n${formState.message}`,
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      track('contact_submit', { topic: formState.topic || '(unspecified)', entry: entryPath() });
      setIsSent(true);
      setFormState({ name: '', email: '', company: '', topic: '', message: '' });
      // 完了状態を専用URLにする（計測でCVを分けられるようにする。戻る操作でフォームへ戻れる）
      if (window.location.pathname !== THANKS_PATH) {
        window.history.pushState({}, '', THANKS_PATH);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Contact error:', error);
      setSendError(f.sendError);
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
    if (id === 'email') setEmailError('');
  };

  // 戻る／進むで /contact と /contact/thanks を行き来できるようにする
  useEffect(() => {
    const sync = () => setIsSent(window.location.pathname === THANKS_PATH);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const th = t.contact.form.thanks;

  if (isSent) {
    return (
      <PageTransition>
        <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full mb-6">
                <Check className="w-3.5 h-3.5 text-accent" strokeWidth={3} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">{th.eyebrow}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-offblack mb-6 leading-[1.05]">{th.title}</h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">{th.lead}</p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-12 bg-white rounded-3xl border border-gray-200 p-8 md:p-10">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{th.nextTitle}</span>
                <ol className="mt-6 space-y-5">
                  {th.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent font-mono text-sm font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-[15px] md:text-base text-gray-700 leading-relaxed pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 pt-8 border-t border-gray-200">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{th.linksTitle}</span>
                <div className="flex flex-wrap gap-x-8 gap-y-4 mt-5">
                  <NavLink href={pathForView('cases')} onGo={() => onNavigate?.('cases')} className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all">
                    {th.caseLink} <ArrowRight className="w-4 h-4" />
                  </NavLink>
                  <a href="/column" className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all">
                    {th.columnLink} <ArrowRight className="w-4 h-4" />
                  </a>
                  <NavLink href={pathForView('home')} onGo={() => onNavigate?.('home')} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-offblack transition-colors">
                    {th.homeLink} <ArrowRight className="w-4 h-4" />
                  </NavLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Lead + Bullets + Trust */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full mb-6">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">
                  {t.contact.eyebrow}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-offblack mb-6 leading-[1.05]">
                {t.contact.lead}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10 font-medium">
                {t.contact.sub}
              </p>
              <div className="space-y-3 mb-10">
                {t.contact.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base font-medium">{b}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t.contact.form.privacyNote}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <Reveal delay={200}>
              <form onSubmit={handleSubmit} className="relative bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm">
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-accent transition-colors">
                      {t.contact.form.name} <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full border-b border-gray-300 py-3 text-base font-medium bg-transparent focus:outline-none focus:border-accent transition-colors placeholder-gray-300"
                      placeholder={t.contact.form.namePlaceholder}
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="company" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-accent transition-colors">
                      {t.contact.form.company}
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formState.company}
                      onChange={handleChange}
                      className="w-full border-b border-gray-300 py-3 text-base font-medium bg-transparent focus:outline-none focus:border-accent transition-colors placeholder-gray-300"
                      placeholder={t.contact.form.companyPlaceholder}
                    />
                  </div>
                </div>

                <div className="group mb-6">
                  <label htmlFor="email" className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors ${emailError ? 'text-red-500' : 'text-gray-500 group-focus-within:text-accent'}`}>
                    {t.contact.form.email} <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className={`w-full border-b py-3 text-base font-medium bg-transparent focus:outline-none transition-colors placeholder-gray-300 ${emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-accent'}`}
                    placeholder={t.contact.form.emailPlaceholder}
                  />
                  {emailError && <p className="text-red-500 text-xs mt-2 font-medium animate-[fadeIn_0.3s_ease-out]">{emailError}</p>}
                </div>

                <div className="group mb-6">
                  <label htmlFor="topic" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-accent transition-colors">
                    {t.contact.form.topic}
                  </label>
                  <select
                    id="topic"
                    value={formState.topic}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 py-3 text-base font-medium bg-transparent focus:outline-none focus:border-accent transition-colors text-offblack"
                  >
                    <option value="">{f.topicPlaceholder}</option>
                    {t.contact.form.topicOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="group mb-8">
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-accent transition-colors">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 py-3 text-base font-medium bg-transparent focus:outline-none focus:border-accent transition-colors placeholder-gray-300 resize-none"
                    placeholder={t.contact.form.messagePlaceholder}
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label htmlFor="consent" className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={agreed}
                      onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setSendError(''); }}
                      required
                      className="mt-1 w-4 h-4 accent-accent flex-shrink-0"
                    />
                    <span className="text-sm text-[#1A2233] leading-[1.8]">
                      <a href="/privacy-policy" target="_blank" rel="noopener" className="text-accent font-bold underline underline-offset-4">{f.consentLink}</a>
                      {f.consentText}
                    </span>
                  </label>
                </div>

                {sendError && (
                  <p role="alert" className="mb-6 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 leading-[1.8]">{sendError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSent || isSending}
                  className="group w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-accent text-white rounded-full font-bold text-base tracking-tight hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-70"
                >
                  {isSent ? (
                    <>
                      <Check className="w-5 h-5" />
                      {t.contact.form.success}
                    </>
                  ) : isSending ? (
                    <>{t.contact.form.sending}</>
                  ) : (
                    <>
                      {t.contact.form.submit}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};


const TrainingView: React.FC<{ onNavigatePath: (to: string) => void }> = ({ onNavigatePath }) => {
  const { t, lang } = useLanguage();
  const tr = t.training;

  const Head: React.FC<{ eyebrow: string; title: string }> = ({ eyebrow, title }) => (
    <div className="mb-10 md:mb-12">
      <span className="text-[#2D6CDF] font-bold tracking-[0.2em] text-xs uppercase">{eyebrow}</span>
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111418] mt-2 leading-[1.5]">{title}</h2>
      <div className="w-16 h-1.5 bg-[#2D6CDF] mt-4 rounded-full" />
    </div>
  );

  return (
    <PageTransition>
      <div className="text-[#111418]">
        {/* Hero */}
        <section className="px-6 md:px-12">
          <div className="max-w-screen-xl mx-auto">
            <Reveal>
              <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-[#F4F6FB] border border-gray-200 text-[#111418]">
                <GridPattern />
                <div className="relative px-6 md:px-16 py-14 md:py-24">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2D6CDF]/20 bg-white text-gray-600 text-xs md:text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#2D6CDF]" />
                    {tr.hero.badge}
                  </span>
                  <h1 className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.25] mt-6">{tr.hero.title}</h1>
                  <p className="text-base md:text-2xl text-gray-500 font-medium mt-3 leading-[1.6]">{tr.hero.titleSub}</p>
                  <p className="max-w-3xl text-base md:text-lg text-gray-700 leading-[1.9] mt-8">{tr.hero.lead}</p>
                  <a
                    href={tr.contact.ctaHref}
                    className="group inline-flex items-center gap-2.5 mt-10 px-7 py-4 rounded-full bg-[#2D6CDF] text-white font-bold text-sm md:text-base tracking-tight shadow-xl shadow-[#2D6CDF]/25 hover:opacity-90 transition-all duration-300"
                  >
                    {tr.hero.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* こんな方に */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.forWhom.eyebrow} title={tr.forWhom.heading} /></Reveal>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {tr.forWhom.items.map((item, i) => (
                <Reveal key={i} delay={i * 70}>
                  <li className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 h-full">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2D6CDF]/10 text-[#2D6CDF] flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] md:text-base text-[#111418] leading-[1.8]">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* 2コースの比較表（値はコースのデータから取る。受講料・時間などを二重に書かない） */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.compare.eyebrow} title={tr.compare.heading} /></Reveal>
            <Reveal>
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full min-w-[640px] text-left text-[15px] leading-[1.8]">
                  <thead>
                    <tr className="bg-[#111418] text-white">
                      <th scope="col" className="w-32 md:w-40 px-5 py-4 font-bold">{tr.compare.courseLabel}</th>
                      {tr.course.items.map((c, i) => (
                        <th key={i} scope="col" className="px-5 py-4 font-bold">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      [tr.compare.labels.target, (c: typeof tr.course.items[number]) => c.specs[0].value],
                      [tr.compare.labels.aim, (c: typeof tr.course.items[number]) => c.aim],
                      [tr.compare.labels.format, (c: typeof tr.course.items[number]) => c.specs[1].value],
                      [tr.compare.labels.hours, (c: typeof tr.course.items[number]) => c.specs[3].value],
                      [tr.compare.labels.fee, (c: typeof tr.course.items[number]) => c.specs[2].value],
                      [tr.compare.labels.themes, (c: typeof tr.course.items[number]) => c.themes.flatMap((g) => g.items).join('／')],
                    ] as const).map(([label, get], ri) => (
                      <tr key={ri} className="border-t border-gray-200 align-top">
                        <th scope="row" className="bg-[#F4F6FB] px-5 py-4 font-bold text-[#111418]">{label}</th>
                        {tr.course.items.map((c, ci) => (
                          <td key={ci} className="px-5 py-4 text-gray-700">{get(c)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
            {tr.course.note && (
              <Reveal>
                <p className="text-sm text-gray-500 leading-[1.9] mt-6">{tr.course.note}</p>
              </Reveal>
            )}
          </div>
        </section>

        {/* Course: 各コースを「特徴3点・習得できること・研修詳細」の同じ型で */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.course.eyebrow} title={tr.course.heading} /></Reveal>
            <div className="space-y-16 md:space-y-24">
              {tr.course.items.map((course, ci) => (
                <article key={ci}>
                  <Reveal>
                    <div className="rounded-3xl border-2 border-[#2D6CDF]/20 bg-[#2D6CDF]/[0.04] p-7 md:p-10">
                      <span className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">{tr.course.nameLabel}</span>
                      <h3 className="text-xl md:text-3xl font-bold text-[#111418] mt-3 leading-[1.5]">{course.name}</h3>
                      <p className="text-[15px] md:text-base text-gray-700 mt-4 leading-[1.9] max-w-4xl">{course.overview}</p>
                    </div>
                  </Reveal>

                  <h4 className="text-lg md:text-xl font-bold text-[#111418] mt-10 mb-5">{tr.course.featuresLabel}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    {course.features.map((f, i) => (
                      <Reveal key={i} delay={i * 70}>
                        <div className="rounded-2xl bg-[#F4F6FB] border-l-4 border-[#2D6CDF] p-5 md:p-6 h-full">
                          <span className="text-[#2D6CDF] font-bold tracking-widest text-sm">{String(i + 1).padStart(2, '0')}</span>
                          <p className="text-[15px] md:text-base text-[#111418] font-bold mt-2 leading-[1.8]">{f}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>

                  <h4 className="text-lg md:text-xl font-bold text-[#111418] mt-10 mb-5">{tr.course.outcomesLabel}</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {course.outcomes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] md:text-base text-[#111418] leading-[1.8]">
                        <Check className="w-4 h-4 text-[#2D6CDF] flex-shrink-0 mt-1.5" strokeWidth={3} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg md:text-xl font-bold text-[#111418] mt-10 mb-2">{tr.course.detailLabel}</h4>
                  <dl className="grid grid-cols-1">
                    {course.specs.slice(0, 4).map((s, i) => (
                      <div key={i} className="flex flex-col md:flex-row gap-2 md:gap-8 py-5 border-b border-gray-200">
                        <dt className="md:w-40 flex-shrink-0 text-sm font-bold text-[#2D6CDF] pt-0.5">{s.label}</dt>
                        <dd className="flex-1 text-base md:text-lg text-[#111418] leading-[1.8]">{s.value}</dd>
                      </div>
                    ))}
                    <div className="flex flex-col md:flex-row gap-2 md:gap-8 py-5 border-b border-gray-200">
                      <dt className="md:w-40 flex-shrink-0 text-sm font-bold text-[#2D6CDF] pt-0.5">{tr.course.themesLabel}</dt>
                      <dd className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {course.themes.map((g, gi) => (
                          <div key={gi}>
                            <p className="text-sm font-bold text-[#111418]">{g.heading}</p>
                            <ul className="mt-2 space-y-1.5">
                              {g.items.map((it, ii) => (
                                <li key={ii} className="text-[15px] text-gray-700 leading-[1.7] pl-3 border-l-2 border-[#2D6CDF]/30">{it}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Flow / Process */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.flow.eyebrow} title={tr.flow.heading} /></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {tr.flow.steps.map((step, i) => (
                <Reveal key={i} delay={i * 90}>
                  <div className="relative rounded-2xl bg-white border border-gray-200 text-[#111418] p-6 md:p-7 h-full">
                    <span className="text-[#2D6CDF] font-bold tracking-widest text-sm">{step.no}</span>
                    <h3 className="text-lg md:text-xl font-bold mt-2 leading-[1.5]">{step.title}</h3>
                    <p className="text-sm text-gray-600 mt-3 leading-[1.8]">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 研修のあとに（実践支援・振り返り → AIソリューションのPoC） */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.after.eyebrow} title={tr.after.heading} /></Reveal>
            <Reveal><p className="max-w-3xl text-base md:text-lg text-gray-700 leading-[1.9] mb-8">{tr.after.lead}</p></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tr.after.steps.map((step, i) => (
                <Reveal key={i} delay={i * 90}>
                  <div className="rounded-2xl bg-white border border-gray-200 border-t-4 border-t-[#2D6CDF] p-6 md:p-7 h-full">
                    <span className="text-[#2D6CDF] font-bold tracking-widest text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-lg md:text-xl font-bold mt-2 leading-[1.5]">{step.title}</h3>
                    <p className="text-sm md:text-[15px] text-gray-600 mt-3 leading-[1.8]">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <NavLink href={tr.after.linkHref} onGo={() => onNavigatePath(tr.after.linkHref)} className="group inline-flex items-center gap-2 mt-8 text-[#2D6CDF] font-bold underline underline-offset-4">
                {tr.after.link}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </NavLink>
            </Reveal>
          </div>
        </section>

        {/* オプション・サポート（伴走オプションは個別見積もり、助成金申請サポートは研修受講者は無料。金額や受給の可否は書かない） */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.options.eyebrow} title={tr.options.heading} /></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tr.options.items.map((o, i) => (
                <Reveal key={i} delay={i * 90}>
                  <div className="rounded-2xl bg-[#F4F6FB] border-l-4 border-[#2D6CDF] p-6 md:p-8 h-full">
                    <h3 className="text-lg md:text-xl font-bold leading-[1.5]">{o.title}</h3>
                    <p className="inline-block mt-3 px-3 py-1 rounded-full bg-white border border-[#2D6CDF]/20 text-sm font-bold text-[#2D6CDF]">{o.price}</p>
                    <p className="text-[15px] md:text-base text-gray-700 mt-4 leading-[1.8]">{o.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Apply */}
        {/* よくある質問（受講料・時間・形式など。FAQPage の構造化データと同じ内容） */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.faq.eyebrow} title={tr.faq.heading} /></Reveal>
            <div className="space-y-3 max-w-4xl">
              {tr.faq.items.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <FaqItem question={item.q} answer={item.a} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="px-6 md:px-12"><div className="max-w-screen-xl mx-auto">
          <RelatedReading
            title={lang === 'ja' ? 'あわせて読みたい' : 'Related reading'}
            items={[
              ...columnReading(lang, [{ slug: 'ai-training-selection-checklist', title: '法人向けAI研修の選び方チェックリスト — 「受けて終わり」にしないための確認項目' }]),
              ...guideReading(lang, ['ai-adoption-where-to-start']),
            ]}
          />
        </div></div>

        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.contact.eyebrow} title={tr.contact.heading} /></Reveal>
            <Reveal>
              <div className="rounded-[1.75rem] md:rounded-[2.5rem] bg-white border border-gray-200 text-[#111418] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-3 p-7 md:p-12">
                    <p className="text-base md:text-lg text-gray-700 leading-[1.9]">{tr.contact.lead}</p>
                    <p className="text-2xl md:text-3xl font-bold mt-8 mb-6">{tr.contact.corp}</p>
                    <dl className="space-y-4">
                      {tr.contact.rows.map((row, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 border-b border-gray-200 pb-4">
                          <dt className="md:w-24 flex-shrink-0 text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">{row.label}</dt>
                          <dd className="flex-1 text-base md:text-lg leading-[1.7] break-words">
                            {'href' in row && row.href ? (
                              <a
                                href={row.href}
                                target={row.href.startsWith('http') ? '_blank' : undefined}
                                rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="text-[#111418] hover:text-[#2D6CDF] transition-colors underline decoration-gray-300 underline-offset-4"
                              >
                                {row.value}
                              </a>
                            ) : (
                              <span className="text-[#111418]">{row.value}</span>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="lg:col-span-2 bg-[#2D6CDF] p-7 md:p-12 flex flex-col justify-center">
                    <p className="text-white/90 font-medium leading-[1.8] mb-6">{tr.hero.cta}</p>
                    <a
                      href={tr.contact.ctaHref}
                      className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white text-[#111418] font-bold text-sm md:text-base tracking-tight hover:bg-[#111418] hover:text-white transition-all duration-300"
                    >
                      {tr.contact.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

// --- AI活用診断（無料フロントエンド） ---
interface Diagnosis {
  summary: string;
  recommendedUseCases: { title: string; why: string; how: string }[];
  workflow: { step: string; before: string; after: string }[];
  expectedEffect: {
    hoursSavedPerMonth?: number;
    costReductionYenPerMonth?: number;
    roiNote?: string;
    roas?: string | null;
    assumptions?: string[];
  };
  requirements: string[];
  firstSteps: string[];
  riskNotes?: string[];
}

// ============================================================
// Service Pages (AI営業 / AI電話 / Salesforce AI)
// 本文は serviceContent.ts。セクションの type ごとに見せ方を変え、
// サービスごとに構成を組み替えることでページの表情を分ける。
// ============================================================

// サービス・事業ページ上部の概要ボックス（対象となる業務／期間の目安／費用の構成／お渡しするもの）。
// 各ページに既に書いてある内容だけで作り、根拠のない項目はデータ側で置かない。
const SummaryBox: React.FC<{ items: { label: string; value: string }[]; heading: string }> = ({ items, heading }) => (
  <div className="rounded-[1.5rem] md:rounded-[2rem] bg-white border border-gray-200 border-t-4 border-t-[#2D6CDF] p-6 md:p-10">
    <h2 className="text-lg md:text-xl font-bold text-[#111418]">{heading}</h2>
    <dl className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-10">
      {items.map((it, i) => (
        <div key={i} className="py-4 border-b border-gray-100">
          <dt className="text-sm font-bold text-[#2D6CDF]">{it.label}</dt>
          <dd className="text-[15px] md:text-base text-[#1A2233] leading-[1.8] mt-1.5">{it.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

const SectionHead: React.FC<{ eyebrow: string; heading: string; lead?: string }> = ({ eyebrow, heading, lead }) => (
  <div className="mb-10 md:mb-14">
    <span className="text-[#2D6CDF] font-bold tracking-[0.2em] text-xs uppercase">{eyebrow}</span>
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111418] mt-2 leading-[1.5]">{heading}</h2>
    <div className="w-16 h-1.5 bg-[#2D6CDF] mt-4 rounded-full" />
    {lead && <p className="text-base md:text-lg text-gray-600 leading-[1.9] mt-6 max-w-3xl">{lead}</p>}
  </div>
);

const ServiceSectionBlock: React.FC<{ section: ServiceSection; onNavigate?: (view: ViewState) => void }> = ({ section, onNavigate }) => {
  const s = section;
  const { t, lang } = useLanguage();

  if (s.type === 'problems') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {s.items.map((item, i) => (
            <Reveal key={i} delay={i * 70}>
              <li className="flex items-start gap-4 rounded-2xl bg-[#F4F6FB] p-5 md:p-6 h-full border-l-4 border-[#2D6CDF]/30">
                <span className="flex-shrink-0 text-[#2D6CDF] font-bold text-sm pt-0.5 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[15px] md:text-base text-[#1A2233] leading-[1.9]">{item}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </>
    );
  }

  if (s.type === 'steps') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <ol className="relative">
          {s.steps.map((step, i) => (
            <Reveal key={i} delay={i * 70}>
              <li className="relative flex gap-5 md:gap-8 pb-8 last:pb-0">
                {/* 縦のつなぎ線 */}
                {i < s.steps.length - 1 && (
                  <span aria-hidden className="absolute left-[19px] md:left-[27px] top-12 md:top-14 bottom-0 w-px bg-gray-200" />
                )}
                <span className="relative flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#2D6CDF] text-white font-bold text-sm md:text-base flex items-center justify-center tabular-nums">
                  {step.no}
                </span>
                <div className="pt-1 md:pt-2.5 flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-[#111418] leading-[1.6]">{step.title}</h3>
                  {step.duration && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#2D6CDF]/10 text-[#2D6CDF] text-xs md:text-sm font-bold">{step.duration}</span>
                  )}
                  <p className="text-[15px] md:text-base text-gray-600 leading-[1.9] mt-2 max-w-3xl">{step.desc}</p>
                  {step.role && (
                    <p className="text-sm text-[#1A2233] leading-[1.8] mt-3 max-w-3xl bg-[#F4F6FB] rounded-lg px-4 py-2.5"><span className="font-bold text-[#2D6CDF]">{lang === 'ja' ? '役割分担 ' : 'Roles '}</span>{step.role}</p>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        {s.note && (
          <Reveal>
            <p className="mt-8 text-sm text-gray-500 leading-[1.9] border-l-2 border-gray-300 pl-4 max-w-3xl">{s.note}</p>
          </Reveal>
        )}
      </>
    );
  }

  if (s.type === 'compare') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <Reveal>
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="w-[22%] text-left text-xs font-bold tracking-widest uppercase text-gray-500 pb-4 pr-4 align-bottom" />
                  <th className="w-[39%] text-left pb-4 px-4 align-bottom">
                    <span className="text-sm md:text-base font-bold text-[#5B6472] leading-[1.6]">{s.leftLabel}</span>
                  </th>
                  <th className="w-[39%] text-left pb-4 px-4 align-bottom">
                    <span className="text-sm md:text-base font-bold text-[#2D6CDF] leading-[1.6]">{s.rightLabel}</span>
                    <span className="block h-1 w-full bg-[#2D6CDF] rounded-full mt-3" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {s.rows.map((row, i) => (
                  <tr key={i} className="border-t border-gray-200 align-top">
                    <td className="py-5 pr-4 text-sm font-bold text-[#111418] leading-[1.7]">{row.axis}</td>
                    <td className="py-5 px-4 text-[15px] text-gray-500 leading-[1.9]">{row.left}</td>
                    <td className="py-5 px-4 text-[15px] text-[#1A2233] leading-[1.9] bg-[#F4F6FB]">{row.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </>
    );
  }

  if (s.type === 'split') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Reveal>
            <div className="h-full rounded-3xl bg-[#F4F6FB] p-7 md:p-9 border-t-4 border-[#2D6CDF]">
              <h3 className="text-xl md:text-2xl font-bold text-[#111418] leading-[1.5]">{s.leftTitle}</h3>
              <ul className="mt-6 space-y-4">
                {s.leftItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#2D6CDF] flex-shrink-0 mt-1.5" strokeWidth={3} />
                    <span className="text-[15px] md:text-base text-[#1A2233] leading-[1.9]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-3xl bg-white p-7 md:p-9 border-2 border-gray-200 border-t-4 border-t-[#111418]">
              <h3 className="text-xl md:text-2xl font-bold text-[#111418] leading-[1.5]">{s.rightTitle}</h3>
              <ul className="mt-6 space-y-4">
                {s.rightItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span aria-hidden className="w-4 h-4 flex-shrink-0 mt-1.5 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111418]" />
                    </span>
                    <span className="text-[15px] md:text-base text-[#1A2233] leading-[1.9]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </>
    );
  }

  if (s.type === 'chat') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <Reveal>
          <div className="rounded-3xl bg-[#F4F6FB] p-6 md:p-10">
            <div className="space-y-4 max-w-3xl mx-auto">
              {s.turns.map((turn, i) => {
                const isAi = turn.who === 'ai';
                return (
                  <div key={i} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] md:max-w-[75%] ${isAi ? '' : 'text-right'}`}>
                      <span className={`block text-[11px] font-bold tracking-widest uppercase mb-1.5 ${isAi ? 'text-[#2D6CDF]' : 'text-gray-500'}`}>
                        {isAi ? 'AI' : 'Caller'}
                      </span>
                      <p
                        className={`inline-block text-left text-[15px] md:text-base leading-[1.9] px-5 py-3.5 ${
                          isAi
                            ? 'bg-[#2D6CDF] text-white rounded-2xl rounded-tl-sm'
                            : 'bg-white text-[#1A2233] border border-gray-200 rounded-2xl rounded-tr-sm'
                        }`}
                      >
                        {turn.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
        {s.note && (
          <Reveal>
            <p className="mt-6 text-sm text-gray-500 leading-[1.9] border-l-2 border-gray-300 pl-4 max-w-3xl">{s.note}</p>
          </Reveal>
        )}
      </>
    );
  }

  if (s.type === 'layers') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <div className="space-y-5">
          {s.layers.map((layer, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="relative rounded-3xl border-2 border-gray-200 bg-white p-7 md:p-9 hover:border-[#2D6CDF]/40 transition-colors duration-300">
                {/* 段階が上がるほど青を濃く */}
                <span
                  aria-hidden
                  className="absolute left-0 top-7 bottom-7 w-1.5 rounded-full bg-[#2D6CDF]"
                  style={{ opacity: 0.3 + i * 0.35 }}
                />
                <div className="pl-5 md:pl-7">
                  <div className="flex flex-col md:flex-row md:items-baseline md:gap-5">
                    <span className="text-xs font-bold tracking-[0.2em] text-[#2D6CDF] tabular-nums">{layer.stage}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-[#111418] leading-[1.5] mt-1 md:mt-0">{layer.title}</h3>
                  </div>
                  <p className="text-[15px] md:text-base text-gray-600 leading-[1.9] mt-3 max-w-3xl">{layer.desc}</p>
                  <ul className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {layer.examples.map((ex, j) => (
                      <li key={j} className="rounded-xl bg-[#F4F6FB] px-4 py-3.5 text-sm text-[#1A2233] leading-[1.8]">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </>
    );
  }

  if (s.type === 'cards') {
    const cols = s.columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2';
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <div className={`grid grid-cols-1 ${cols} gap-5 md:gap-6`}>
          {s.cards.map((card, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="h-full flex flex-col rounded-2xl border border-gray-200 bg-white p-6 md:p-8 hover:border-[#2D6CDF]/40 transition-colors duration-300">
                <span aria-hidden className="block w-10 h-1 bg-[#2D6CDF] rounded-full mb-5" />
                {card.tag && (
                  <span className={`self-start mb-3 px-2.5 py-0.5 rounded-full text-xs font-bold ${card.link && card.tag !== '活用イメージ' && card.tag !== 'Example' ? 'bg-[#2D6CDF] text-white' : 'bg-[#F4F6FB] text-[#5B6472]'}`}>{card.tag}</span>
                )}
                <h3 className="text-lg md:text-xl font-bold text-[#111418] leading-[1.6]">{card.title}</h3>
                <p className="text-[15px] md:text-base text-gray-600 leading-[1.9] mt-3 flex-grow">{card.desc}</p>
                {card.link && (
                  <a href={card.link.href} className="group inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-[#2D6CDF] underline underline-offset-4">
                    {card.link.label}<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        {s.note && (
          <Reveal>
            <p className="mt-8 text-sm text-gray-500 leading-[1.9] border-l-2 border-gray-300 pl-4 max-w-3xl">{s.note}</p>
          </Reveal>
        )}
      </>
    );
  }

  // ページ途中の相談導線（問い合わせフォームの種別を選んだ状態で開く）
  if (s.type === 'cta') {
    return (
      <Reveal>
        <div className="rounded-[1.5rem] md:rounded-[2rem] bg-[#F4F6FB] border border-[#2D6CDF]/20 p-7 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-[#111418] leading-[1.5]">{s.heading}</h2>
            <p className="text-[15px] md:text-base text-gray-600 leading-[1.9] mt-3">{s.lead}</p>
          </div>
          <a href={`#contact/${s.topic}`} className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#2D6CDF] text-white font-bold text-sm md:text-base whitespace-nowrap hover:opacity-90 transition-opacity">
            {s.button}<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </Reveal>
    );
  }


  if (s.type === 'notes') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <Reveal>
          <ul className="rounded-3xl bg-[#F4F6FB] p-7 md:p-10 space-y-5">
            {s.items.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span aria-hidden className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#2D6CDF] text-[#2D6CDF] text-xs font-bold flex items-center justify-center mt-0.5 tabular-nums">
                  {i + 1}
                </span>
                <span className="text-[15px] md:text-base text-[#1A2233] leading-[1.9]">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </>
    );
  }

  if (s.type === 'pricing') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          <Reveal className="lg:col-span-3">
            <dl className="h-full">
              {s.rows.map((row, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-1.5 md:gap-8 py-5 border-b border-gray-200 first:pt-0">
                  <dt className="md:w-32 flex-shrink-0 text-sm font-bold text-[#2D6CDF] pt-0.5">{row.label}</dt>
                  <dd className="flex-1 text-[15px] md:text-base text-[#1A2233] leading-[1.9]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-2">
            <div className="h-full rounded-3xl bg-[#F4F6FB] p-6 md:p-8">
              <span className="text-xs font-bold tracking-widest uppercase text-gray-500">費用が変わる要因</span>
              <ul className="mt-5 space-y-3.5">
                {s.drivers.map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#2D6CDF] flex-shrink-0 mt-2.5" />
                    <span className="text-[15px] text-[#1A2233] leading-[1.9]">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <p className="mt-8 text-sm text-gray-500 leading-[1.9] border-l-2 border-gray-300 pl-4 max-w-3xl">{s.note}</p>
        </Reveal>
        <Reveal>
          <NavLink href="/pricing" onGo={() => onNavigate?.('pricing')} className="group inline-flex items-center gap-2 mt-6 text-[#2D6CDF] font-bold underline underline-offset-4">
            {t.pricing.serviceLink}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </Reveal>
      </>
    );
  }

  if (s.type === 'cases') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {s.links.map((link, i) => (
            <Reveal key={i} delay={i * 80}>
              <a
                href={`/cases/${link.slug}`}
                className="group flex flex-col h-full rounded-2xl border-2 border-gray-200 bg-[#F4F6FB] p-6 md:p-8 hover:border-[#2D6CDF]/50 transition-colors duration-300"
              >
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#2D6CDF]">Case Study</span>
                <span className="text-lg md:text-xl font-bold text-[#111418] leading-[1.6] mt-3 group-hover:text-[#2D6CDF] transition-colors">
                  {link.label}
                </span>
                <span className="text-[15px] text-gray-600 leading-[1.9] mt-2.5 flex-1">{link.desc}</span>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#111418] mt-5 group-hover:text-[#2D6CDF] transition-colors">
                  事例を見る
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </>
    );
  }

  if (s.type === 'related') {
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {s.links.map((link, i) => (
            <Reveal key={i} delay={i * 80}>
              <a
                href={`/column/${link.slug}`}
                className="group flex flex-col h-full rounded-2xl border border-gray-200 bg-white p-6 hover:border-[#2D6CDF]/40 transition-colors duration-300"
              >
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#2D6CDF]">Column</span>
                <span className="text-[15px] md:text-base font-bold text-[#111418] leading-[1.7] mt-3 flex-1 group-hover:text-[#2D6CDF] transition-colors">
                  {link.title}
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 mt-5 group-hover:text-[#2D6CDF] transition-colors">
                  読む
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </>
    );
  }

  // faq
  return (
    <>
      <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} /></Reveal>
      <dl className="divide-y divide-gray-200 border-t border-gray-200">
        {s.items.map((item, i) => (
          <Reveal key={i} delay={i * 60}>
            <div className="py-7">
              <dt className="flex items-start gap-4">
                <span aria-hidden className="text-[#2D6CDF] font-bold text-lg leading-[1.5] flex-shrink-0">Q</span>
                <span className="text-base md:text-lg font-bold text-[#111418] leading-[1.7]">{item.q}</span>
              </dt>
              <dd className="flex items-start gap-4 mt-4">
                <span aria-hidden className="text-gray-400 font-bold text-lg leading-[1.5] flex-shrink-0">A</span>
                <span className="text-[15px] md:text-base text-gray-600 leading-[1.9]">{item.a}</span>
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </>
  );
};

// ============================================================
// Cases (導入事例)
// 社名は掲載許諾が取れるまで伏せ、業種と進め方で示す。本文は caseContent.ts。
// ============================================================

// Before / After のフロー図。
// 事実を表す図のため画像生成は使わず、図形とテキストで組む（DESIGN.md §4）。
// 青 = AIが担う工程、濃グレー = 人が担う工程。色は §2 の6ロールから外さない。
const CaseFlow: React.FC<{ flow: NonNullable<CaseStudy['flow']>; lang: 'ja' | 'en' }> = ({ flow, lang }) => {
  const Row: React.FC<{ label: string; steps: { label: string; by: 'human' | 'ai' }[]; dim?: boolean }> = ({ label, steps, dim }) => (
    <div className="flex flex-col lg:flex-row lg:items-stretch gap-3 lg:gap-0">
      <div className="lg:w-24 flex-shrink-0 flex lg:items-center">
        <span className={`text-xs font-bold tracking-widest uppercase ${dim ? 'text-gray-400' : 'text-[#2D6CDF]'}`}>
          {label}
        </span>
      </div>
      <ol className="flex-1 flex flex-col lg:flex-row lg:items-stretch gap-2 lg:gap-0">
        {steps.map((s, i) => (
          <li key={i} className="flex lg:flex-1 items-center lg:items-stretch gap-2 lg:gap-0 min-w-0">
            <div
              className={`flex-1 min-w-0 rounded-xl px-3 py-3 lg:px-2.5 lg:py-3.5 text-[13px] leading-[1.6] font-medium border text-center lg:flex lg:items-center lg:justify-center ${
                s.by === 'ai'
                  ? 'bg-[#2D6CDF] border-[#2D6CDF] text-white'
                  : dim
                    ? 'bg-white border-gray-300 text-gray-500'
                    : 'bg-white border-[#111418] text-[#111418]'
              }`}
            >
              <span className="break-words">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden className="flex-shrink-0 flex items-center justify-center w-6 lg:w-5 rotate-90 lg:rotate-0">
                <ArrowRight className={`w-4 h-4 ${dim ? 'text-gray-300' : 'text-gray-400'}`} />
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5 md:p-7">
      {/* 凡例 */}
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-500">
          <span aria-hidden className="w-3.5 h-3.5 rounded bg-[#2D6CDF]" />
          {lang === 'ja' ? 'AIが担う' : 'Handled by AI'}
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-500">
          <span aria-hidden className="w-3.5 h-3.5 rounded border-2 border-[#111418] bg-white" />
          {lang === 'ja' ? '人が担う' : 'Handled by people'}
        </span>
      </div>

      <div className="space-y-4">
        <Row label={flow.beforeLabel} steps={flow.before} dim />
        <div className="hidden lg:block border-t border-dashed border-gray-200" />
        <Row label={flow.afterLabel} steps={flow.after} />
      </div>

      <p className="text-[15px] text-gray-600 leading-[1.9] mt-6 pt-5 border-t border-gray-200">{flow.caption}</p>
    </div>
  );
};

// 導入事例の本文。一覧（/cases）では概要とリンク、事例ページ（/cases/<slug>）では全文を出す
const CaseArticle: React.FC<{ cs: CaseStudy; lang: Lang; page?: boolean }> = ({ cs, lang, page = false }) => {
  // 見出しの階層: 事例ページは h1 → h2（課題・打ち手…）→ h3（各打ち手）
  const Label = (page ? 'h2' : 'h3') as 'h2';
  const Item = (page ? 'h3' : 'h4') as 'h3';
  if (!page) {
    return (
      <article id={cs.slug} className="scroll-mt-28 rounded-3xl border-2 border-gray-200 bg-white overflow-hidden">
                  {/* Header band */}
                  <div className="bg-[#F4F6FB] px-6 md:px-10 py-7 md:py-8 border-b border-gray-200">
                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                      {cs.services.map((s) => (
                        <span key={s} className="inline-flex items-center px-3 py-1 rounded-full bg-[#2D6CDF] text-white text-xs font-bold tracking-tight">
                          {s}
                        </span>
                      ))}
                    </div>
                    {cs.company && (
                      <div className="flex items-center gap-3 mb-3">
                        {cs.company.logo && <img src={cs.company.logo} alt={cs.company.name} className="h-8 w-auto object-contain" loading="lazy" />}
                        <span className="text-sm font-bold text-gray-600">{cs.company.name}</span>
                      </div>
                    )}
                    {page ? (
                      <>
                        <p className="text-sm font-bold text-[#2D6CDF]">{cs.industry}</p>
                        <h1 className="text-2xl md:text-4xl font-bold text-[#111418] leading-[1.5] mt-1">{cs.title ?? cs.industry}</h1>
                      </>
                    ) : (
                      <h2 className="text-2xl md:text-3xl font-bold text-[#111418] leading-[1.5]">
                        <a href={`/cases/${cs.slug}`} className="hover:text-[#2D6CDF] transition-colors">{cs.industry}</a>
                      </h2>
                    )}
                    <p className="text-sm md:text-base text-gray-600 leading-[1.8] mt-2">{cs.scale}</p>
                    <p className="text-[15px] md:text-base text-[#1A2233] leading-[1.9] mt-5 max-w-3xl">{cs.summary}</p>
                    {cs.result && (
                      <div className="mt-6 rounded-2xl bg-white border-l-4 border-[#2D6CDF] px-6 py-5">
                        <span className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">
                          {lang === 'ja' ? '成果' : 'Result'}
                        </span>
                        {cs.metrics?.length ? (
                          <div className="flex flex-wrap gap-x-10 gap-y-4 mt-3">
                            {cs.metrics.map((m, mi) => (
                              <div key={mi}>
                                <p className="flex items-baseline gap-1.5 leading-none">
                                  <span className="text-5xl md:text-6xl font-bold tracking-tight text-[#111418] tabular-nums">{m.value}</span>
                                  <span className="text-lg md:text-xl font-bold text-[#2D6CDF]">{m.unit}</span>
                                </p>
                                <p className="text-sm text-gray-600 mt-2">{m.label}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xl md:text-2xl font-bold text-[#111418] leading-[1.5] mt-2">{cs.result.label}</p>
                        )}
                        <p className="text-[15px] text-gray-600 leading-[1.9] mt-4">{cs.result.desc}</p>
                      </div>
                    )}
                  </div>
          <div className="px-6 md:px-10 py-6 flex justify-end">
            <a href={`/cases/${cs.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#2D6CDF] hover:gap-3 transition-all">
              {lang === 'ja' ? '事例の詳細を見る' : 'Read the full case'} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </article>
    );
  }
  return (
      <article id={cs.slug} className="scroll-mt-28 rounded-3xl border-2 border-gray-200 bg-white overflow-hidden">
                  {/* Header band */}
                  <div className="bg-[#F4F6FB] px-6 md:px-10 py-7 md:py-8 border-b border-gray-200">
                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                      {cs.services.map((s) => (
                        <span key={s} className="inline-flex items-center px-3 py-1 rounded-full bg-[#2D6CDF] text-white text-xs font-bold tracking-tight">
                          {s}
                        </span>
                      ))}
                    </div>
                    {cs.company && (
                      <div className="flex items-center gap-3 mb-3">
                        {cs.company.logo && <img src={cs.company.logo} alt={cs.company.name} className="h-8 w-auto object-contain" loading="lazy" />}
                        <span className="text-sm font-bold text-gray-600">{cs.company.name}</span>
                      </div>
                    )}
                    {page ? (
                      <>
                        <p className="text-sm font-bold text-[#2D6CDF]">{cs.industry}</p>
                        <h1 className="text-2xl md:text-4xl font-bold text-[#111418] leading-[1.5] mt-1">{cs.title ?? cs.industry}</h1>
                      </>
                    ) : (
                      <h2 className="text-2xl md:text-3xl font-bold text-[#111418] leading-[1.5]">
                        <a href={`/cases/${cs.slug}`} className="hover:text-[#2D6CDF] transition-colors">{cs.industry}</a>
                      </h2>
                    )}
                    <p className="text-sm md:text-base text-gray-600 leading-[1.8] mt-2">{cs.scale}</p>
                    <p className="text-[15px] md:text-base text-[#1A2233] leading-[1.9] mt-5 max-w-3xl">{cs.summary}</p>
                    {cs.result && (
                      <div className="mt-6 rounded-2xl bg-white border-l-4 border-[#2D6CDF] px-6 py-5">
                        <span className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">
                          {lang === 'ja' ? '成果' : 'Result'}
                        </span>
                        {cs.metrics?.length ? (
                          <div className="flex flex-wrap gap-x-10 gap-y-4 mt-3">
                            {cs.metrics.map((m, mi) => (
                              <div key={mi}>
                                <p className="flex items-baseline gap-1.5 leading-none">
                                  <span className="text-5xl md:text-6xl font-bold tracking-tight text-[#111418] tabular-nums">{m.value}</span>
                                  <span className="text-lg md:text-xl font-bold text-[#2D6CDF]">{m.unit}</span>
                                </p>
                                <p className="text-sm text-gray-600 mt-2">{m.label}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xl md:text-2xl font-bold text-[#111418] leading-[1.5] mt-2">{cs.result.label}</p>
                        )}
                        <p className="text-[15px] text-gray-600 leading-[1.9] mt-4">{cs.result.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Before / After のフロー図 */}
                  {cs.flow && (
                    <div className="px-6 md:px-10 pt-8 md:pt-10">
                      <Label className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">
                        {lang === 'ja' ? '業務の流れ' : 'How the work flows'}
                      </Label>
                      <div className="mt-4">
                        <CaseFlow flow={cs.flow} lang={lang} />
                      </div>
                    </div>
                  )}

                  <div className="px-6 md:px-10 py-8 md:py-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* 課題 */}
                    <div className="lg:col-span-2">
                      <Label className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">
                        {lang === 'ja' ? '課題' : 'Challenge'}
                      </Label>
                      <ul className="mt-4 space-y-3.5">
                        {cs.challenge.map((x, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2.5" />
                            <span className="text-[15px] text-[#1A2233] leading-[1.9]">{x}</span>
                          </li>
                        ))}
                      </ul>
                      {cs.stack && (
                        <div className="mt-7 pt-6 border-t border-gray-200">
                          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                            {lang === 'ja' ? '主な構成' : 'Stack'}
                          </span>
                          <p className="text-sm text-[#1A2233] leading-[1.9] mt-3">{cs.stack}</p>
                        </div>
                      )}
                    </div>

                    {/* 打ち手 */}
                    <div className="lg:col-span-3">
                      <Label className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">
                        {lang === 'ja' ? '打ち手' : 'What we did'}
                      </Label>
                      <ol className="mt-4 space-y-5">
                        {cs.approach.map((a, j) => (
                          <li key={j} className="flex gap-4">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2D6CDF]/10 text-[#2D6CDF] text-xs font-bold flex items-center justify-center mt-0.5 tabular-nums">
                              {j + 1}
                            </span>
                            <div>
                              <Item className="text-base md:text-lg font-bold text-[#111418] leading-[1.6]">{a.title}</Item>
                              <p className="text-[15px] text-gray-600 leading-[1.9] mt-1.5">{a.desc}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* 設計上の要点 */}
                  <div className="px-6 md:px-10 pb-8 md:pb-10">
                    <div className="rounded-2xl bg-[#F4F6FB] p-6 md:p-7">
                      <Label className="text-xs font-bold tracking-widest uppercase text-gray-500">
                        {lang === 'ja' ? '設計上の要点' : 'Design decisions'}
                      </Label>
                      <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {cs.points.map((x, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-[#2D6CDF] flex-shrink-0 mt-1.5" strokeWidth={3} />
                            <span className="text-[15px] text-[#1A2233] leading-[1.9]">{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {cs.note && (
                      <p className="mt-5 text-sm text-gray-500 leading-[1.9] border-l-2 border-gray-300 pl-4">{cs.note}</p>
                    )}
                    {cs.voice && (
                      <figure className="mt-8 rounded-2xl bg-[#F4F6FB] px-6 md:px-8 py-6 md:py-7">
                        <span className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">{lang === 'ja' ? 'お客様の声' : 'Client voice'}</span>
                        <blockquote className="text-base md:text-lg text-[#111418] font-medium leading-[1.9] mt-3">「{cs.voice.text}」</blockquote>
                        <figcaption className="text-sm text-gray-500 mt-3">{cs.voice.person}</figcaption>
                      </figure>
                    )}
                  </div>
                </article>
  );
};

// 比較・選び方ガイド（/guide と /guide/<slug>）。本文は guideContent.ts
const GuideHead: React.FC<{ eyebrow: string; title: string; lead: string; h1?: boolean }> = ({ eyebrow, title, lead, h1 }) => {
  const T = (h1 ? 'h1' : 'h2') as 'h1';
  return (
    <header className="border-b border-gray-200 pb-8 mb-10">
      <span className="text-xs font-bold tracking-widest uppercase text-accent">{eyebrow}</span>
      <T className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.4] mt-3">{title}</T>
      <div className="w-16 h-1.5 bg-accent mt-5 rounded-full" />
      <p className="max-w-3xl text-base md:text-lg text-[#1A2233] leading-[1.9] mt-6">{lead}</p>
    </header>
  );
};

const GuidesView: React.FC = () => {
  const { lang } = useLanguage();
  const c = guideContent[lang];
  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto text-[#111418] pb-24 md:pb-32">
        <GuideHead eyebrow="Guide" title={c.title} lead={c.lead} h1 />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {c.guides.map((g) => (
            <a key={g.slug} href={`/guide/${g.slug}`} className="group flex flex-col bg-white rounded-2xl border border-gray-200 p-7 hover:border-accent transition-colors">
              <h2 className="text-lg font-bold tracking-tight leading-[1.6] group-hover:text-accent transition-colors">{g.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mt-3 flex-grow">{g.description}</p>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all mt-4" />
            </a>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

// あわせて読みたいガイド・コラム（料金・研修・事例のページから、比較・選び方ガイドとコラムへ）
// コラムは日本語のみのため、英語版ではガイドだけを出す。コラムのタイトルは公開後に変えない決まり（column-style-guide）。
// columnReading に書いた slug・タイトルは build-columns.mjs が記事と照合する
type ReadingItem = { href: string; label: string; kind: string };
const GUIDE_FOR_CASE_SERVICE: Record<string, string> = { 'AI電話（音声AI）': 'ai-phone-vs-ivr-voicebot', 'AI営業': 'ai-sales-vs-telemarketing', 'Salesforce AI': 'salesforce-standard-ai-vs-custom' };
// 本文の語から関連するガイドを選ぶ（ジャーナル記事用）。当たりが多い順に最大2本、なければ「AI導入は何から始めるか」
const GUIDE_WORDS: [string, RegExp][] = [
  ['ai-phone-vs-ivr-voicebot', /電話|音声|ボイス|コール|phone|voice|call/gi],
  ['ai-sales-vs-telemarketing', /営業|商談|アポ|セールス|sales/gi],
  ['salesforce-standard-ai-vs-custom', /Salesforce|kintone|CRM|SFA/gi],
];
const guidesForText = (text: string): string[] => {
  const hits = GUIDE_WORDS.map(([slug, re]) => [slug, (text.match(re) || []).length] as const).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([slug]) => slug);
  return hits.length ? hits : ['ai-adoption-where-to-start'];
};
const columnsForGuides = (gs: string[], n: number) =>
  gs.flatMap((g) => (guideColumns as Record<string, { slug: string; title: string; industry: string }[]>)[g] || []).filter((c, i, a) => a.findIndex((y) => y.slug === c.slug) === i).slice(0, n);
const guideReading = (lang: Lang, slugs: string[]): ReadingItem[] =>
  slugs.map((s) => guideContent[lang].guides.find((g) => g.slug === s)).filter((g): g is NonNullable<typeof g> => !!g)
    .map((g) => ({ href: `/guide/${g.slug}`, label: g.title, kind: lang === 'ja' ? '比較・選び方ガイド' : 'Guide' }));
const columnReading = (lang: Lang, cols: { slug: string; title: string }[]): ReadingItem[] =>
  lang === 'ja' ? cols.map((c) => ({ href: `/column/${c.slug}`, label: c.title, kind: 'コラム' })) : [];
const RelatedReading: React.FC<{ title: string; items: ReadingItem[] }> = ({ title, items }) => {
  if (!items.length) return null;
  return (
    <section className="mt-16 md:mt-20">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-[1.5] mb-6">{title}</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <li key={it.href}>
            <a href={it.href} className="group block h-full bg-white rounded-2xl border border-gray-200 border-l-4 border-l-accent p-6 hover:border-accent transition-colors">
              <span className="block text-xs font-bold text-gray-500 mb-2">{it.kind}</span>
              <span className="text-base font-bold leading-[1.6] group-hover:text-accent transition-colors">{it.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

const GuideView: React.FC<{ slug: string; onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const { lang } = useLanguage();
  const ja = lang === 'ja';
  const c = guideContent[lang];
  const g = c.guides.find((x) => x.slug === slug);
  if (!g) return <NotFoundView onNavigate={onNavigate} />;
  const others = c.guides.filter((x) => x.slug !== slug);
  return (
    <PageTransition>
      <article className="px-6 md:px-12 max-w-screen-xl mx-auto text-[#111418] pb-24 md:pb-32">
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
          <NavLink href={pathForView('guides')} onGo={() => onNavigate('guides')} className="hover:text-accent transition-colors">{c.title}</NavLink>
        </nav>
        <GuideHead eyebrow="Guide" title={g.title} lead={g.lead} h1 />
        {GUIDE_DATES[g.slug] && (
          <p className="-mt-6 mb-10 text-xs text-gray-500">
            {ja ? '公開' : 'Published'} <time dateTime={GUIDE_DATES[g.slug].published}>{GUIDE_DATES[g.slug].published.replace(/-/g, '.')}</time>
            {GUIDE_DATES[g.slug].modified > GUIDE_DATES[g.slug].published && (<>{ja ? '・更新 ' : ' · Updated '}<time dateTime={GUIDE_DATES[g.slug].modified}>{GUIDE_DATES[g.slug].modified.replace(/-/g, '.')}</time></>)}
          </p>
        )}
        <section className="max-w-4xl">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-[1.5] mb-5">{g.table.caption}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm md:text-[15px] border-t border-gray-200">
              <thead>
                <tr className="bg-[#F4F6FB]">
                  {g.table.head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-bold border-b border-gray-200">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {g.table.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, k) => k === 0
                      ? <th key={k} scope="row" className="px-4 py-3 border-b border-gray-200 font-bold align-top whitespace-nowrap">{cell}</th>
                      : <td key={k} className="px-4 py-3 border-b border-gray-200 leading-[1.8] align-top text-[#1A2233]">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {g.sections.map((sec) => (
          <section key={sec.heading} className="max-w-4xl mt-14">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-[1.5] pl-4 border-l-4 border-accent">{sec.heading}</h2>
            {sec.paragraphs?.map((p, i) => <p key={i} className="text-base md:text-[17px] text-[#1A2233] leading-[2] mt-4">{p}</p>)}
            {sec.list && (
              <ul className="mt-4 space-y-2">
                {sec.list.map((x, i) => (
                  <li key={i} className="flex gap-3 text-base text-[#1A2233] leading-[1.9]">
                    <span className="mt-[0.8em] w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <section className="max-w-4xl mt-14">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-[1.5] mb-5">{ja ? 'よくあるご質問' : 'FAQ'}</h2>
          <div className="space-y-3">
            {g.faq.map((f, i) => <FaqItem key={i} question={f.q} answer={f.a} index={i} />)}
          </div>
        </section>
        <div className="max-w-4xl mt-14 flex flex-wrap gap-3">
          <NavLink href={g.service.href} onGo={() => onNavigate(viewForPath(g.service.href))} className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-accent text-white font-bold text-sm hover:opacity-90 transition-opacity">
            {ja ? `${g.service.label}のサービスを見る` : `See ${g.service.label}`} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
          <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-gray-300 bg-white text-[#111418] font-bold text-sm hover:border-[#111418] transition-colors">
            {ja ? '無料で相談する' : 'Request a free consultation'}
          </a>
        </div>
        {ja && ((guideColumns as Record<string, { slug: string; title: string; industry: string }[]>)[g.slug] || []).length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight mb-6">関連コラム</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(guideColumns as Record<string, { slug: string; title: string; industry: string }[]>)[g.slug].map((c) => (
                <li key={c.slug}>
                  <a href={`/column/${c.slug}`} className="group block h-full bg-white rounded-2xl border border-gray-200 border-l-4 border-l-accent p-6 hover:border-accent transition-colors">
                    <span className="block text-xs font-bold text-gray-500 mb-2">{c.industry}</span>
                    <span className="text-base font-bold leading-[1.6] group-hover:text-accent transition-colors">{c.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{ja ? 'ほかのガイド' : 'Other guides'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {others.map((o) => (
              <a key={o.slug} href={`/guide/${o.slug}`} className="group block bg-white rounded-2xl border border-gray-200 p-6 hover:border-accent transition-colors">
                <span className="text-base font-bold leading-[1.6] group-hover:text-accent transition-colors">{o.title}</span>
              </a>
            ))}
          </div>
        </section>
      </article>
    </PageTransition>
  );
};

// 導入事例の個別ページ（/cases/<slug>）
const CaseView: React.FC<{ slug: string; onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const { lang } = useLanguage();
  const c = caseContent[lang];
  const cs = c.cases.find((x) => x.slug === slug);
  if (!cs) return <NotFoundView onNavigate={onNavigate} />;
  const others = c.cases.filter((x) => x.slug !== slug);
  return (
    <PageTransition>
      <div className="text-[#111418] px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
            <NavLink href={pathForView('cases')} onGo={() => onNavigate('cases')} className="hover:text-accent transition-colors">{c.heading}</NavLink>
            <span aria-hidden>／</span>
            <span className="text-offblack font-bold">{cs.industry}</span>
          </nav>
          <CaseArticle cs={cs} lang={lang} page />
          {(() => {
            const gs: string[] = Array.from(new Set<string>((cs.services as string[]).map((x) => GUIDE_FOR_CASE_SERVICE[x]).filter((x): x is string => !!x)));
            const cols = columnsForGuides(gs, 2);
            return <RelatedReading title={lang === 'ja' ? 'あわせて読みたい' : 'Related reading'} items={[...guideReading(lang, gs.length ? gs : ['ai-adoption-where-to-start']), ...columnReading(lang, cols)]} />;
          })()}
          <section className="mt-16 md:mt-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">{lang === 'ja' ? 'ほかの導入事例' : 'More case studies'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {others.map((o) => (
                <a key={o.slug} href={`/cases/${o.slug}`} className="group flex flex-col bg-white rounded-2xl border border-gray-200 p-7 hover:border-accent transition-colors">
                  <span className="text-xs font-bold text-accent">{o.industry}</span>
                  <span className="text-lg font-bold tracking-tight mt-2 group-hover:text-accent transition-colors">{o.title ?? o.industry}</span>
                  <span className="text-sm text-gray-500 leading-relaxed mt-2">{o.summary}</span>
                </a>
              ))}
            </div>
          </section>
          <Reveal>
            <div className="mt-16 md:mt-20 rounded-[1.75rem] md:rounded-[2.5rem] bg-[#2D6CDF] text-white px-7 py-12 md:px-16 md:py-16">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.5]">{lang === 'ja' ? '同じような課題、お持ちではありませんか' : 'Facing something similar?'}</h2>
              <a href="#contact" className="group inline-flex items-center gap-2.5 mt-8 px-7 py-4 rounded-full bg-white text-[#111418] font-bold text-sm md:text-base hover:opacity-90 transition-opacity">
                {lang === 'ja' ? '無料で相談する' : 'Request a free consultation'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
};

const CasesView: React.FC = () => {
  const { lang } = useLanguage();
  const c = caseContent[lang];

  // #cases/<slug> で来たときは、その事例まで送る
  useEffect(() => {
    const slug = window.location.hash.slice(1).split('/')[1];
    if (!slug) return;
    const t = window.setTimeout(() => {
      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <PageTransition>
      <div className="text-[#111418] px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          {/* Head */}
          <Reveal>
            <div className="pt-2 pb-10 md:pb-14">
              <span className="text-[#2D6CDF] font-bold tracking-[0.2em] text-xs uppercase">{c.eyebrow}</span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#111418] mt-3 leading-[1.4]">{c.heading}</h1>
              <div className="w-16 h-1.5 bg-[#2D6CDF] mt-5 rounded-full" />
            </div>
          </Reveal>

          {/* Cases */}
          <div className="space-y-8 md:space-y-10">
            {c.cases.map((cs, i) => (
              <Reveal key={cs.slug} delay={i * 80}>
                <CaseArticle cs={cs} lang={lang} />
              </Reveal>
            ))}
          </div>

          <RelatedReading title={lang === 'ja' ? '比較・選び方ガイド' : 'Comparison guides'} items={guideReading(lang, ['ai-phone-vs-ivr-voicebot', 'ai-sales-vs-telemarketing', 'salesforce-standard-ai-vs-custom', 'ai-adoption-where-to-start'])} />


          {/* CTA */}
          <Reveal>
            <div className="mt-16 md:mt-20 rounded-[1.75rem] md:rounded-[2.5rem] bg-[#2D6CDF] text-white px-7 py-12 md:px-16 md:py-16 text-center">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.5]">
                {lang === 'ja' ? '同じような課題、お持ちではありませんか' : 'Facing something similar?'}
              </h2>
              <p className="text-base md:text-lg text-white/90 leading-[1.9] mt-5 max-w-2xl mx-auto">
                {lang === 'ja'
                  ? '現状を伺い、どこからAIに任せられるかを整理してお返しします。初回のご相談は無料です。'
                  : 'Tell us where you are and we will map what can be handed to AI. The first consultation is free.'}
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-center items-stretch sm:items-center gap-3 sm:gap-4 mt-9">
                <a
                  href="#contact"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#111418] font-bold text-sm md:text-base tracking-tight hover:bg-[#111418] hover:text-white transition-all duration-300"
                >
                  {lang === 'ja' ? '無料で相談する' : 'Request a free consultation'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                {SHOW_DIAGNOSIS && (
                  <a
                    href="/diagnosis"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/40 text-white font-bold text-sm tracking-tight hover:bg-white/10 transition-colors duration-300"
                  >
                    {lang === 'ja' ? '無料のAI活用診断を試す（3分）' : 'Try the free AI diagnosis (3 min)'}
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
};

// サービスごとの比較・選び方ガイド
const SERVICE_GUIDE: Record<ServiceKey, string> = {
  'ai-phone': 'ai-phone-vs-ivr-voicebot',
  'ai-sales': 'ai-sales-vs-telemarketing',
  'salesforce-ai': 'salesforce-standard-ai-vs-custom',
};


// ============================================================
// 料金の考え方（/pricing）。新しい数字は持たず、研修のデータと各サービスの「費用の考え方」から組み立てる
// ============================================================
const PricingView: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { t, lang } = useLanguage();
  const p = t.pricing;
  const course = t.training.course.items;
  const Head: React.FC<{ eyebrow: string; title: string; lead?: string }> = ({ eyebrow, title, lead }) => (
    <div className="mb-8 md:mb-10">
      <span className="text-[#2D6CDF] font-bold tracking-[0.2em] text-xs uppercase">{eyebrow}</span>
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111418] mt-2 leading-[1.5]">{title}</h2>
      <div className="w-16 h-1.5 bg-[#2D6CDF] mt-4 rounded-full" />
      {lead && <p className="text-base md:text-lg text-gray-600 leading-[1.9] mt-6 max-w-3xl">{lead}</p>}
    </div>
  );
  return (
    <PageTransition>
      <div className="text-[#111418]">
        <section className="px-6 md:px-12">
          <div className="max-w-screen-xl mx-auto">
            <Reveal>
              <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-[#F4F6FB] border border-gray-200">
                <GridPattern />
                <div className="relative px-6 md:px-16 py-14 md:py-20">
                  <span className="text-[#2D6CDF] font-bold tracking-[0.2em] text-xs uppercase">{p.eyebrow}</span>
                  <h1 className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.25] mt-4">{p.title}</h1>
                  <p className="max-w-3xl text-base md:text-lg text-gray-700 leading-[1.9] mt-8">{p.lead}</p>
                  <p className="inline-flex items-center gap-2 mt-8 px-4 py-2 rounded-full bg-white border border-[#2D6CDF]/20 text-sm md:text-base font-bold text-[#111418]">
                    <span className="w-2 h-2 rounded-full bg-[#2D6CDF]" />{p.free}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={p.training.eyebrow} title={p.training.heading} /></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {course.map((c, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="rounded-2xl border border-gray-200 border-t-4 border-t-[#2D6CDF] bg-white p-6 md:p-8 h-full">
                    <h3 className="text-lg md:text-xl font-bold leading-[1.6]">{c.name}</h3>
                    <dl className="mt-4">
                      {[c.specs[2], c.specs[3], c.specs[1]].map((sp, j) => (
                        <div key={j} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                          <dt className="w-24 flex-shrink-0 text-sm font-bold text-[#2D6CDF] pt-0.5">{sp.label}</dt>
                          <dd className="flex-1 text-[15px] md:text-base leading-[1.8]">{sp.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="text-sm text-gray-500 leading-[1.9] mt-6">{p.training.note}</p>
              <ul className="mt-5 space-y-2.5">
                {t.training.options.items.map((o, i) => (
                  <li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 text-[15px] leading-[1.8]">
                    <span className="font-bold text-[#111418] sm:w-56 flex-shrink-0">{o.title}</span>
                    <span className="text-[#2D6CDF] font-bold">{o.price}</span>
                  </li>
                ))}
              </ul>
              <NavLink href="/training" onGo={() => onNavigate('training')} className="group inline-flex items-center gap-2 mt-4 text-[#2D6CDF] font-bold underline underline-offset-4">
                {p.training.link}<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </NavLink>
            </Reveal>
          </div>
        </section>

        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={p.services.eyebrow} title={p.services.heading} lead={p.services.lead} /></Reveal>
            <Reveal>
              <div className="rounded-2xl bg-[#F4F6FB] border-l-4 border-[#2D6CDF] p-6 md:p-8 mb-8 max-w-4xl">
                <p className="text-sm font-bold text-gray-600">{p.services.poc.label}</p>
                <p className="text-3xl md:text-4xl font-bold text-[#111418] mt-2">{p.services.poc.value}</p>
                <p className="text-[15px] text-gray-700 mt-3 leading-[1.8]">{p.services.poc.note}</p>
              </div>
            </Reveal>
            <div className="space-y-8">
              {SERVICE_KEYS.map((k) => {
                const page = serviceContent[lang][k];
                const sec = page.sections.find((x) => x.type === 'pricing');
                if (!sec || sec.type !== 'pricing') return null;
                return (
                  <Reveal key={k}>
                    <article className="rounded-3xl border border-gray-200 bg-white p-6 md:p-10">
                      <h3 className="text-xl md:text-2xl font-bold leading-[1.5]">{page.navLabel}</h3>
                      {sec.lead && <p className="text-[15px] text-gray-600 leading-[1.9] mt-3 max-w-3xl">{sec.lead}</p>}
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mt-6">
                        <div className="lg:col-span-3">
                          <h4 className="text-sm font-bold text-[#111418] mb-2">{p.services.structureLabel}</h4>
                          <dl>
                            {sec.rows.map((row, i) => (
                              <div key={i} className="flex flex-col md:flex-row gap-1 md:gap-6 py-4 border-b border-gray-200">
                                <dt className="md:w-28 flex-shrink-0 text-sm font-bold text-[#2D6CDF] pt-0.5">{row.label}</dt>
                                <dd className="flex-1 text-[15px] text-[#1A2233] leading-[1.9]">{row.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                        <div className="lg:col-span-2 rounded-2xl bg-[#F4F6FB] p-5 md:p-6">
                          <h4 className="text-sm font-bold text-[#111418]">{p.services.driversLabel}</h4>
                          <ul className="mt-3 space-y-2.5">
                            {sec.drivers.map((d, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#2D6CDF] flex-shrink-0 mt-2.5" />
                                <span className="text-[15px] text-[#1A2233] leading-[1.8]">{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <p className="mt-6 text-sm text-gray-500 leading-[1.9] border-l-2 border-gray-300 pl-4 max-w-3xl">{sec.note}</p>
                      <NavLink href={`/service/${k}`} onGo={() => onNavigate(k)} className="group inline-flex items-center gap-2 mt-5 text-[#2D6CDF] font-bold underline underline-offset-4">
                        {page.navLabel} {p.services.link}<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </NavLink>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={p.period.eyebrow} title={p.period.heading} /></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
              {p.period.items.map((it, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="rounded-2xl bg-[#F4F6FB] border-l-4 border-[#2D6CDF] p-6 md:p-7 h-full">
                    <p className="text-sm font-bold text-gray-600">{it.label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-[#111418] mt-2">{it.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal><p className="text-sm md:text-[15px] text-gray-600 leading-[1.9] mt-6 max-w-3xl">{p.period.note}</p></Reveal>
          </div>
        </section>

        {/* よくあるご質問（FAQPage の構造化データと同じ内容） */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={p.faq.eyebrow} title={p.faq.heading} /></Reveal>
            <div className="space-y-3 max-w-4xl">
              {p.faq.items.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <FaqItem question={item.q} answer={item.a} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="px-6 md:px-12"><div className="max-w-screen-xl mx-auto">
          <RelatedReading
            title={lang === 'ja' ? '費用を比べる前に読む' : 'Read before comparing costs'}
            items={[
              ...columnReading(lang, [{ slug: 'ai-cost-breakdown-initial-monthly-usage', title: 'AI導入費用の内訳の考え方 — 初期費用・月額費用・実費をどう見るか' }]),
              ...guideReading(lang, ['ai-adoption-where-to-start', 'ai-phone-vs-ivr-voicebot', 'ai-sales-vs-telemarketing', 'salesforce-standard-ai-vs-custom']),
            ]}
          />
        </div></div>

        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal>
              <div className="rounded-[1.75rem] md:rounded-[2.5rem] bg-white border-2 border-[#2D6CDF]/20 p-7 md:p-12">
                <h2 className="text-xl md:text-3xl font-bold leading-[1.5]">{p.cta.heading}</h2>
                <p className="text-base md:text-lg text-gray-700 leading-[1.9] mt-4 max-w-3xl">{p.cta.lead}</p>
                <NavLink href="/contact" onGo={() => onNavigate('contact')} className="group inline-flex items-center gap-2.5 mt-8 px-7 py-4 rounded-full bg-[#2D6CDF] text-white font-bold text-sm md:text-base hover:opacity-90 transition-all">
                  {p.cta.button}<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </NavLink>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

const ServiceView: React.FC<{ serviceKey: ServiceKey; onNavigate?: (view: ViewState) => void }> = ({ serviceKey, onNavigate }) => {
  const { lang, t } = useLanguage();
  const page = serviceContent[lang][serviceKey];

  return (
    <PageTransition>
      <div className="text-[#111418]">
        {/* Hero */}
        <section className="px-6 md:px-12">
          <div className="max-w-screen-xl mx-auto">
            {/* 事業内容 → AIソリューション の中のサービスであることを示す */}
            <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-5">
              <NavLink href={pathForView('works')} onGo={() => onNavigate?.('works')} className="hover:text-accent transition-colors">{t.nav.works}</NavLink>
              <span aria-hidden>／</span>
              <NavLink href={pathForView('biz-ai')} onGo={() => onNavigate?.('biz-ai')} className="hover:text-accent transition-colors">{t.nav.aiSolutions}</NavLink>
              <span aria-hidden>／</span>
              <span className="text-offblack font-bold">{page.navLabel}</span>
            </nav>
            <Reveal>
              <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-[#F4F6FB] text-[#111418] border border-gray-200">
                <GridPattern />
                <div className="relative px-6 md:px-16 py-14 md:py-24">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2D6CDF]/25 bg-white text-[#2D6CDF] text-xs md:text-sm font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#2D6CDF]" />
                    {page.hero.badge}
                  </span>
                  <h1 className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.25] mt-6 max-w-4xl">{page.hero.title}</h1>
                  <p className="text-base md:text-2xl text-[#5B6472] font-medium mt-3 leading-[1.6]">{page.hero.titleSub}</p>
                  <p className="max-w-3xl text-base md:text-lg text-[#1A2233] leading-[1.9] mt-8">{page.hero.lead}</p>
                  <ul className="flex flex-wrap gap-3 mt-8">
                    {page.hero.points.map((p, i) => (
                      <li key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-[#1A2233] text-sm font-medium">
                        <Check className="w-3.5 h-3.5 text-[#2D6CDF]" strokeWidth={3} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-10">
                    <a
                      href={`#contact/${page.slug}`}
                      className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#2D6CDF] text-white font-bold text-sm md:text-base tracking-tight shadow-xl shadow-[#2D6CDF]/25 hover:opacity-90 transition-all duration-300"
                    >
                      {page.cta.button}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    {SHOW_DIAGNOSIS && (
                      <a
                        href={page.cta.secondaryHref}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-gray-300 bg-white text-[#111418] font-bold text-sm tracking-tight hover:border-[#111418] transition-colors duration-300"
                      >
                        {page.cta.secondary}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Key visual */}
            <Reveal delay={120}>
              <img
                src={page.image}
                alt={page.imageAlt}
                width={page.imageWidth}
                height={page.imageHeight}
                loading="eager"
                className="w-full h-auto rounded-[1.75rem] md:rounded-[2.5rem] border border-gray-200 mt-6 md:mt-8 bg-white"
              />
            </Reveal>
          </div>
        </section>

        {page.summary && (
          <section className="px-6 md:px-12 mt-10 md:mt-14">
            <div className="max-w-screen-xl mx-auto">
              <Reveal><SummaryBox items={page.summary} heading={lang === 'ja' ? 'サービスの概要' : 'At a glance'} /></Reveal>
            </div>
          </section>
        )}

        {/* 「◯◯とは」への一文の答え（検索・AIが定義として引用しやすい形） */}
        {page.definition && (
          <section className="px-6 md:px-12 mt-16 md:mt-20">
            <div className="max-w-screen-xl mx-auto">
              <Reveal>
                <div className="max-w-4xl border-l-4 border-accent pl-6 md:pl-8">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#111418] leading-[1.5]">{page.definition.heading}</h2>
                  <p className="text-base md:text-lg text-[#1A2233] leading-[1.9] mt-3">{page.definition.text}</p>
                  {SERVICE_GUIDE[serviceKey] && (() => {
                    const g = guideContent[lang].guides.find((x) => x.slug === SERVICE_GUIDE[serviceKey]);
                    return g ? (
                      <a href={`/guide/${g.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all">
                        {lang === 'ja' ? '比較・選び方ガイド: ' : 'Guide: '}{g.title} <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : null;
                  })()}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Sections */}
        {page.sections.map((section, i) => (
          <section key={i} className="px-6 md:px-12 mt-20 md:mt-28">
            <div className="max-w-screen-xl mx-auto">
              <ServiceSectionBlock section={section} onNavigate={onNavigate} />
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal>
              <div className="rounded-[1.75rem] md:rounded-[2.5rem] bg-[#2D6CDF] text-white px-7 py-12 md:px-16 md:py-16 text-center">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.5]">{page.cta.heading}</h2>
                <p className="text-base md:text-lg text-white/90 leading-[1.9] mt-5 max-w-2xl mx-auto">{page.cta.lead}</p>
                <div className="flex flex-col sm:flex-row sm:justify-center items-stretch sm:items-center gap-3 sm:gap-4 mt-9">
                  <a
                    href={`#contact/${page.slug}`}
                    className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#111418] font-bold text-sm md:text-base tracking-tight hover:bg-[#111418] hover:text-white transition-all duration-300"
                  >
                    {page.cta.button}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  {SHOW_DIAGNOSIS && (
                    <a
                      href={page.cta.secondaryHref}
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/40 text-white font-bold text-sm tracking-tight hover:bg-white/10 transition-colors duration-300"
                    >
                      {page.cta.secondary}
                    </a>
                  )}
                </div>
                {SHOW_DIAGNOSIS && <p className="text-sm text-white/75 leading-[1.8] mt-6">{page.cta.sub}</p>}
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

const DiagnosisView: React.FC = () => {
  const { t } = useLanguage();
  const d = t.diagnosis;
  const [form, setForm] = useState({
    name: '', company: '', email: '', industry: '', business: '',
    employees: '', tools: '', monthly: '', goal: '',
  });
  const [challenges, setChallenges] = useState<string[]>([]);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
    if (id === 'email') setEmailError('');
  };

  const toggleChallenge = (c: string) => {
    setChallenges(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(form.email)) { setEmailError(d.form.emailError); return; }
    if (!form.industry && !form.business) { setError(d.form.needIndustry); return; }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 58000);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, challenges }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok || !data.diagnosis) throw new Error(data.error || d.form.genericError);
      setResult(data.diagnosis);
      setTimeout(() => document.getElementById('diagnosis-result')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: any) {
      setError(err?.name === 'AbortError' ? d.form.timeoutError : (err?.message || d.form.genericError));
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  const yen = (n?: number) => typeof n === 'number' ? `¥${n.toLocaleString()}` : '—';
  const hrs = (n?: number) => typeof n === 'number' ? `${n.toLocaleString()}h` : '—';

  return (
    <PageTransition>
      <div className="text-[#111418]">
        {/* Hero */}
        <section className="px-6 md:px-12">
          <div className="max-w-screen-xl mx-auto">
            <Reveal>
              <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-[#111418] text-white">
                <GridPattern dark />
                <div className="relative px-6 md:px-16 py-14 md:py-20">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/80 text-xs md:text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#2D6CDF] animate-pulse" />
                    {d.hero.badge}
                  </span>
                  <h1 className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.2] mt-6">{d.hero.title}</h1>
                  <p className="text-base md:text-2xl text-white/55 font-medium mt-3 leading-[1.6]">{d.hero.titleSub}</p>
                  <p className="max-w-3xl text-base md:text-lg text-white/85 leading-[1.9] mt-8">{d.hero.lead}</p>
                  <div className="flex flex-wrap gap-4 md:gap-6 mt-8">
                    {d.hero.points.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                        <Check className="w-5 h-5 text-[#2D6CDF] flex-shrink-0" />
                        <span className="font-medium">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Form */}
        {!result && (
          <section className="px-6 md:px-12 mt-12 md:mt-16">
            <div className="max-w-3xl mx-auto">
              <Reveal>
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="industry" className="block text-sm font-bold text-[#111418] mb-2">{d.form.industry} <span className="text-[#2D6CDF]">*</span></label>
                      <input id="industry" value={form.industry} onChange={onChange} placeholder={d.form.industryPh} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D6CDF] focus:ring-2 focus:ring-[#2D6CDF]/20 outline-none transition" />
                    </div>
                    <div>
                      <label htmlFor="employees" className="block text-sm font-bold text-[#111418] mb-2">{d.form.employees}</label>
                      <select id="employees" value={form.employees} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D6CDF] focus:ring-2 focus:ring-[#2D6CDF]/20 outline-none transition bg-white">
                        <option value="">{d.form.selectPh}</option>
                        {d.form.employeeOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label htmlFor="business" className="block text-sm font-bold text-[#111418] mb-2">{d.form.business}</label>
                    <textarea id="business" value={form.business} onChange={onChange} rows={2} placeholder={d.form.businessPh} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D6CDF] focus:ring-2 focus:ring-[#2D6CDF]/20 outline-none transition resize-none" />
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-bold text-[#111418] mb-2">{d.form.challenges}</label>
                    <div className="flex flex-wrap gap-2">
                      {d.form.challengeOptions.map((c, i) => (
                        <button type="button" key={i} onClick={() => toggleChallenge(c)}
                          className={`px-3.5 py-2 rounded-full text-sm font-medium border transition ${challenges.includes(c) ? 'bg-[#2D6CDF] text-white border-[#2D6CDF]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#2D6CDF]'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    <div>
                      <label htmlFor="tools" className="block text-sm font-bold text-[#111418] mb-2">{d.form.tools}</label>
                      <input id="tools" value={form.tools} onChange={onChange} placeholder={d.form.toolsPh} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D6CDF] focus:ring-2 focus:ring-[#2D6CDF]/20 outline-none transition" />
                    </div>
                    <div>
                      <label htmlFor="monthly" className="block text-sm font-bold text-[#111418] mb-2">{d.form.monthly}</label>
                      <input id="monthly" value={form.monthly} onChange={onChange} placeholder={d.form.monthlyPh} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D6CDF] focus:ring-2 focus:ring-[#2D6CDF]/20 outline-none transition" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label htmlFor="goal" className="block text-sm font-bold text-[#111418] mb-2">{d.form.goal}</label>
                    <input id="goal" value={form.goal} onChange={onChange} placeholder={d.form.goalPh} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D6CDF] focus:ring-2 focus:ring-[#2D6CDF]/20 outline-none transition" />
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm font-bold text-[#111418] mb-4">{d.form.contactHeading}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">{d.form.name}</label>
                        <input id="name" value={form.name} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D6CDF] focus:ring-2 focus:ring-[#2D6CDF]/20 outline-none transition" />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-600 mb-2">{d.form.company}</label>
                        <input id="company" value={form.company} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D6CDF] focus:ring-2 focus:ring-[#2D6CDF]/20 outline-none transition" />
                      </div>
                    </div>
                    <div className="mt-5">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">{d.form.email} <span className="text-[#2D6CDF]">*</span></label>
                      <input id="email" type="email" value={form.email} onChange={onChange} placeholder="you@company.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2D6CDF] focus:ring-2 focus:ring-[#2D6CDF]/20 outline-none transition" />
                      {emailError && <p className="text-red-500 text-xs mt-1.5">{emailError}</p>}
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm mt-5">{error}</p>}

                  <button type="submit" disabled={loading}
                    className="group w-full mt-8 px-7 py-4 rounded-full bg-[#2D6CDF] text-white font-bold text-base tracking-tight shadow-xl shadow-[#2D6CDF]/25 hover:opacity-90 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2.5">
                    {loading ? d.form.loading : d.form.submit}
                    {!loading && <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                    {d.form.privacyNote}{' '}
                    <a href="/privacy-policy" target="_blank" rel="noopener" className="text-accent underline underline-offset-4">{t.footer.privacy}</a>
                  </p>
                </form>
              </Reveal>
            </div>
          </section>
        )}

        {/* Result */}
        {result && (
          <section id="diagnosis-result" className="px-6 md:px-12 mt-12 md:mt-16">
            <div className="max-w-4xl mx-auto">
              <Reveal>
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                  <div>
                    <span className="text-[#2D6CDF] font-bold tracking-[0.2em] text-xs uppercase">{d.result.eyebrow}</span>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111418] mt-2">{d.result.title}</h2>
                  </div>
                  <button onClick={() => window.print()} className="text-sm font-medium text-gray-500 hover:text-[#2D6CDF] underline underline-offset-4 print:hidden">{d.result.print}</button>
                </div>

                {/* Summary */}
                <div className="bg-[#111418] text-white rounded-3xl p-6 md:p-8 mb-8">
                  <p className="text-base md:text-lg leading-[1.9]">{result.summary}</p>
                </div>

                {/* Expected effect stat tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  <div className="bg-[#2D6CDF]/5 border border-[#2D6CDF]/20 rounded-2xl p-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{d.result.hoursSaved}</p>
                    <p className="text-3xl font-bold text-[#2D6CDF]">{hrs(result.expectedEffect?.hoursSavedPerMonth)}<span className="text-sm text-gray-400 font-medium">{d.result.perMonth}</span></p>
                  </div>
                  <div className="bg-[#2D6CDF]/5 border border-[#2D6CDF]/20 rounded-2xl p-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{d.result.costReduction}</p>
                    <p className="text-3xl font-bold text-[#2D6CDF]">{yen(result.expectedEffect?.costReductionYenPerMonth)}<span className="text-sm text-gray-400 font-medium">{d.result.perMonth}</span></p>
                  </div>
                  <div className="bg-[#2D6CDF]/5 border border-[#2D6CDF]/20 rounded-2xl p-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{d.result.roi}</p>
                    <p className="text-base font-bold text-[#111418] leading-snug mt-1">{result.expectedEffect?.roiNote || '—'}</p>
                  </div>
                </div>
                {result.expectedEffect?.roas && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">ROAS</p>
                    <p className="text-sm text-[#111418] leading-relaxed">{result.expectedEffect.roas}</p>
                  </div>
                )}
                {result.expectedEffect?.assumptions && result.expectedEffect.assumptions.length > 0 && (
                  <p className="text-xs text-gray-400 -mt-6 mb-10">{d.result.assumptions}: {result.expectedEffect.assumptions.join(' / ')}</p>
                )}

                {/* Recommended use cases */}
                <h3 className="text-xl font-bold text-[#111418] mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-[#2D6CDF]" />{d.result.useCases}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  {result.recommendedUseCases?.map((u, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5">
                      <div className="w-8 h-8 rounded-full bg-[#2D6CDF] text-white font-bold flex items-center justify-center text-sm mb-3">{i + 1}</div>
                      <p className="font-bold text-[#111418] mb-2 leading-snug">{u.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">{u.why}</p>
                      <p className="text-sm text-[#2D6CDF] leading-relaxed">{u.how}</p>
                    </div>
                  ))}
                </div>

                {/* Before / After workflow */}
                <h3 className="text-xl font-bold text-[#111418] mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-[#2D6CDF]" />{d.result.workflow}</h3>
                <div className="space-y-3 mb-10">
                  {result.workflow?.map((w, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] gap-3 bg-white border border-gray-200 rounded-2xl p-4">
                      <div className="font-bold text-[#111418] text-sm flex items-center">{w.step}</div>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3"><span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">{d.result.before}</span>{w.before}</div>
                      <div className="text-sm text-[#111418] bg-[#2D6CDF]/5 rounded-xl p-3"><span className="text-[10px] font-bold uppercase text-[#2D6CDF] block mb-1">{d.result.after}</span>{w.after}</div>
                    </div>
                  ))}
                </div>

                {/* Requirements & first steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold text-[#111418] mb-4">{d.result.requirements}</h3>
                    <ul className="space-y-2.5">
                      {result.requirements?.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><Check className="w-4 h-4 text-[#2D6CDF] flex-shrink-0 mt-0.5" />{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold text-[#111418] mb-4">{d.result.firstSteps}</h3>
                    <ol className="space-y-2.5">
                      {result.firstSteps?.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700"><span className="w-5 h-5 rounded-full bg-[#2D6CDF]/10 text-[#2D6CDF] font-bold flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>{s}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {result.riskNotes && result.riskNotes.length > 0 && (
                  <p className="text-xs text-gray-400 mb-10">{d.result.riskNotes}: {result.riskNotes.join(' / ')}</p>
                )}

                {/* CTA */}
                <div className="relative overflow-hidden rounded-3xl bg-[#2D6CDF] text-white p-8 md:p-12 text-center print:hidden">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{d.result.ctaTitle}</h3>
                  <p className="text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">{d.result.ctaSub}</p>
                  <a href="#contact" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#2D6CDF] font-bold text-base hover:bg-[#111418] hover:text-white transition-all duration-300">
                    {d.result.ctaButton}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>

                <div className="text-center mt-8 print:hidden">
                  <button onClick={() => { setResult(null); window.scrollTo(0, 0); }} className="text-sm font-medium text-gray-400 hover:text-[#2D6CDF] underline underline-offset-4">{d.result.again}</button>
                </div>
              </Reveal>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
};

// 事業ごとのページ（/works/ai-solutions など）。以前は事業内容ページのポップアップで見せていた内容
const BusinessView: React.FC<{ biz: BizView; onNavigate: (view: ViewState) => void }> = ({ biz, onNavigate }) => {
  const { t, lang } = useLanguage();
  const ja = lang === 'ja';
  const meta = BUSINESS_PAGES[biz];
  const d = t.details[meta.key];
  const w = t.works[meta.key];
  const others: { view: ViewState; no: string; title: string; subtitle: string }[] = [
    ...(Object.keys(BUSINESS_PAGES) as BizView[]).map((v) => ({ view: v as ViewState, no: BUSINESS_PAGES[v].no, title: t.works[BUSINESS_PAGES[v].key].title, subtitle: t.works[BUSINESS_PAGES[v].key].subtitle })),
    { view: 'training' as ViewState, no: '03', title: t.works.service_training.title, subtitle: t.works.service_training.subtitle },
  ].filter((o) => o.view !== biz).sort((a, b) => a.no.localeCompare(b.no));
  const contactHref = `#contact${meta.topic ? `/${meta.topic}` : ''}`;
  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto text-[#111418]">
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-5">
          <NavLink href={pathForView('works')} onGo={() => onNavigate('works')} className="hover:text-accent transition-colors">{t.nav.works}</NavLink>
          <span aria-hidden>／</span>
          <span className="text-offblack font-bold">{w.title}</span>
        </nav>

        {/* Hero */}
        <Reveal>
          <div className="rounded-[1.75rem] md:rounded-[2.5rem] bg-[#F4F6FB] border border-gray-200 px-6 md:px-16 py-14 md:py-20">
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-accent">Business {meta.no}</span>
            <h1 className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.25] mt-4">{w.title}</h1>
            <p className="text-base md:text-2xl text-[#5B6472] font-medium mt-3 leading-[1.6]">{w.subtitle}</p>
            <p className="max-w-3xl text-base md:text-lg text-[#1A2233] leading-[1.9] mt-8 whitespace-pre-line">{d.p1}</p>
            <a
              href={contactHref}
              className="group inline-flex items-center justify-center gap-2.5 mt-10 px-7 py-4 rounded-full bg-accent text-white font-bold text-sm md:text-base tracking-tight hover:opacity-90 transition-opacity"
            >
              {t.homeCTA.primary}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </Reveal>
        <div className="mt-6 md:mt-8 rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden border border-gray-200 bg-white aspect-[16/9] md:aspect-[21/9]">
          <img src={meta.image} alt="" className="w-full h-full object-cover" />
        </div>
        {'summary' in d && d.summary && (
          <Reveal className="block mt-10 md:mt-14">
            <SummaryBox items={d.summary} heading={ja ? '事業の概要' : 'At a glance'} />
          </Reveal>
        )}

        {/* 提供内容 */}
        <section className="mt-24 md:mt-32">
          <Reveal>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">{ja ? 'What we do' : 'What we do'}</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.5] mt-2">{ja ? '提供内容' : 'What we provide'}</h2>
            <div className="w-16 h-1.5 bg-accent mt-4 rounded-full" />
          </Reveal>
          <div className="mt-10 border-t border-gray-200">
            {d.features.map((f, i) => {
              // AIソリューションの各サービスは、個別のサービスページへつなぐ
              const link = (w.items.find((x) => x.title === f.title) as { link?: string } | undefined)?.link;
              return (
                <Reveal key={f.title}>
                  <div className="grid md:grid-cols-12 gap-4 md:gap-10 py-10 border-b border-gray-200">
                    <div className="md:col-span-4">
                      <span className="font-mono text-sm font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-[1.5] mt-2">{f.sub}</h3>
                      <p className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 mt-1">{f.title}</p>
                    </div>
                    <div className="md:col-span-8">
                      <p className="text-base md:text-lg text-[#1A2233] leading-[1.9]">{f.text}</p>
                      {link && isServiceKey(link) && (
                        <NavLink
                          href={pathForView(link)}
                          onGo={() => onNavigate(link)}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all"
                        >
                          {t.worksIntro.serviceLink} <ArrowRight className="w-4 h-4" />
                        </NavLink>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* よくあるご質問（FAQPage の構造化データと同じ内容） */}
        <section className="mt-24 md:mt-32 max-w-4xl">
          <Reveal>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">FAQ</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.5] mt-2">{ja ? 'よくあるご質問' : 'FAQ'}</h2>
            <div className="w-16 h-1.5 bg-accent mt-4 rounded-full" />
          </Reveal>
          <div className="space-y-3 mt-10">
            {d.faq.map((f, i) => { const l = f as { link?: string; linkLabel?: string }; return <FaqItem key={i} question={f.q} answer={f.a} index={i} link={l.link && l.linkLabel ? { href: l.link, label: l.linkLabel, onGo: () => window.location.assign(l.link!) } : undefined} />; })}
          </div>
        </section>

        {/* 比較・選び方ガイドとコラム（AIソリューション・AI事業立ち上げ支援のページ） */}
        {meta.key !== 'service_lab' && (
          <RelatedReading
            title={ja ? 'あわせて読みたい' : 'Related reading'}
            items={meta.key === 'service_ai'
              ? [...guideReading(lang, ['ai-adoption-where-to-start', 'ai-phone-vs-ivr-voicebot', 'ai-sales-vs-telemarketing', 'salesforce-standard-ai-vs-custom']), ...columnReading(lang, [{ slug: 'ai-cost-breakdown-initial-monthly-usage', title: 'AI導入費用の内訳の考え方 — 初期費用・月額費用・実費をどう見るか' }])]
              : [...guideReading(lang, ['ai-adoption-where-to-start']), ...columnReading(lang, columnsForGuides(['ai-adoption-where-to-start'], 2))]}
          />
        )}

        {/* 相談・事例への導線 */}
        <Reveal>
          <div className="mt-24 md:mt-32 rounded-[1.75rem] md:rounded-[2.5rem] bg-accent text-white px-7 py-12 md:px-16 md:py-16">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.5]">{t.worksIntro.ctaTitle}</h2>
            <p className="text-base md:text-lg text-white/90 leading-[1.9] mt-4 max-w-2xl">{t.worksIntro.ctaLead}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
              <a href={contactHref} className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white text-[#111418] font-bold text-sm md:text-base tracking-tight hover:opacity-90 transition-opacity">
                {t.homeCTA.primary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <NavLink href={pathForView('cases')} onGo={() => onNavigate('cases')} className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/50 text-white font-bold text-sm tracking-tight hover:bg-white/10 transition-colors">
                {t.homeCases.cta}
              </NavLink>
            </div>
          </div>
        </Reveal>

        {/* ほかの事業 */}
        <section className="mt-24 md:mt-32">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{ja ? 'ほかの事業' : 'Our other businesses'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {others.map((o) => (
              <NavLink
                key={o.view}
                href={pathForView(o.view)}
                onGo={() => onNavigate(o.view)}
                className="group flex flex-col bg-white rounded-2xl border border-gray-200 p-7 hover:border-accent transition-colors"
              >
                <span className="font-mono text-xs font-bold text-accent">{o.no}</span>
                <span className="text-lg font-bold tracking-tight mt-2 group-hover:text-accent transition-colors">{o.title}</span>
                <span className="text-sm text-gray-500 leading-relaxed mt-2 flex-grow">{o.subtitle}</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all mt-4" />
              </NavLink>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

// AI活用の用語集（/glossary）。本文は glossaryContent.ts
const GlossaryView: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { lang } = useLanguage();
  const g = glossaryContent[lang];
  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto text-[#111418]">
        <header className="border-b border-gray-200 pb-8 mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-accent">{g.sub}</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.4] mt-3">{g.title}</h1>
          <div className="w-16 h-1.5 bg-accent mt-5 rounded-full" />
          <p className="max-w-3xl text-base md:text-lg text-[#1A2233] leading-[1.9] mt-6">{g.lead}</p>
        </header>
        {/* 目次 */}
        <nav aria-label={lang === 'ja' ? '用語の一覧' : 'Terms'} className="flex flex-wrap gap-2 mb-12">
          {g.terms.map((x) => (
            <a key={x.id} href={`#${x.id}`} className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-[#1A2233] hover:border-accent hover:text-accent transition-colors">{x.term}</a>
          ))}
        </nav>
        <dl className="max-w-4xl border-t border-gray-200 pb-24 md:pb-32">
          {g.terms.map((x) => (
            <div key={x.id} id={x.id} className="scroll-mt-28 py-8 border-b border-gray-200">
              <dt>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-[1.5]">{x.term}</h2>
                {x.reading && <span className="block text-xs text-gray-500 mt-1">{x.reading}</span>}
              </dt>
              <dd className="mt-3">
                <p className="text-base md:text-[17px] text-[#1A2233] leading-[1.9]">{x.definition}</p>
                {lang === 'ja' && (siteLinks.glossary as Record<string, { slug: string; title: string }[]>)[x.id] && (
                  <ul className="mt-3 space-y-1.5">
                    {(siteLinks.glossary as Record<string, { slug: string; title: string }[]>)[x.id].map((c) => (
                      <li key={c.slug} className="text-sm leading-[1.7]">
                        <span className="text-gray-500 mr-2">コラム</span>
                        <a href={`/column/${c.slug}`} className="text-[#1A2233] underline decoration-gray-300 underline-offset-4 hover:text-accent hover:decoration-accent">{c.title}</a>
                      </li>
                    ))}
                  </ul>
                )}
                {x.link && (
                  <NavLink
                    href={x.link.href}
                    onGo={() => onNavigate(viewForPath(x.link!.href))}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all"
                  >
                    {lang === 'ja' ? '関連: ' : 'Related: '}{x.link.label} <ArrowRight className="w-4 h-4" />
                  </NavLink>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </PageTransition>
  );
};

// プライバシーポリシー・サイト利用規約（本文は legalContent.ts）
const LegalView: React.FC<{ doc: 'privacy' | 'terms'; onNavigate: (view: ViewState) => void }> = ({ doc, onNavigate }) => {
  const { lang } = useLanguage();
  const d: LegalDoc = legalContent[lang][doc];
  const other = doc === 'privacy' ? legalContent[lang].terms : legalContent[lang].privacy;
  const otherView: ViewState = doc === 'privacy' ? 'terms-of-service' : 'privacy-policy';
  // 本文中の「プライバシーポリシー」はリンクにする（利用規約から辿れるように）
  const withLinks = (text: string) => {
    const word = lang === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy';
    if (doc !== 'terms' || !text.includes(word)) return text;
    const [before, after] = text.split(word);
    return (
      <>
        {before}
        <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); onNavigate('privacy-policy'); }} className="text-accent underline underline-offset-4">{word}</a>
        {after}
      </>
    );
  };
  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <header className="border-b border-gray-200 pb-8 mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-accent">{d.sub}</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-offblack leading-[1.4] mt-3">{d.title}</h1>
          <div className="w-16 h-1.5 bg-accent mt-5 rounded-full" />
        </header>
        <article className="max-w-3xl pb-24 md:pb-32">
          <p className="text-sm text-gray-500">{d.updated}</p>
          <p className="text-base md:text-[17px] text-[#1A2233] leading-[2] mt-6">{d.intro}</p>
          {d.sections.map((sec, i) => (
            <section key={i} className={sec.heading ? 'mt-12' : 'mt-5'}>
              {sec.heading && (
                <h2 className="text-lg md:text-xl font-bold text-offblack tracking-tight leading-[1.5] pl-4 border-l-4 border-accent">{sec.heading}</h2>
              )}
              {sec.paragraphs?.map((para, j) => (
                <p key={j} className="text-[15px] md:text-base text-[#1A2233] leading-[2] mt-4">{withLinks(para)}</p>
              ))}
              {sec.list && (
                <ul className="mt-4 space-y-2">
                  {sec.list.map((item, j) => (
                    <li key={j} className="flex gap-3 text-[15px] md:text-base text-[#1A2233] leading-[1.9]">
                      <span className="mt-[0.8em] w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sec.table && (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm border-t border-gray-200">
                    <thead>
                      <tr className="bg-[#F4F6FB]">
                        {sec.table.head.map((h) => <th key={h} className="px-4 py-3 font-bold text-offblack border-b border-gray-200">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.table.rows.map((row, j) => (
                        <tr key={j}>
                          {row.map((cell, k) => <td key={k} className={`px-4 py-3 border-b border-gray-200 leading-[1.8] align-top ${k === 0 ? 'font-bold text-offblack' : 'text-[#1A2233]'}`}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <a
              href={pathForView(otherView)}
              onClick={(e) => { e.preventDefault(); onNavigate(otherView); }}
              className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all"
            >
              {other.title} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </article>
      </div>
    </PageTransition>
  );
};

// 知らないURLで表示するページ。本番では 404.html として配信され、ステータスも 404 になる。
const NotFoundView: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { lang } = useLanguage();
  const ja = lang === 'ja';
  const links: { id?: ViewState; href?: string; label: string }[] = [
    { id: 'home', label: ja ? 'トップページ' : 'Home' },
    { id: 'works', label: ja ? '事業内容' : 'What we do' },
    { id: 'cases', label: ja ? '導入事例' : 'Case studies' },
    { href: '/column', label: ja ? 'コラム' : 'Column' },
    { id: 'contact', label: ja ? 'お問い合わせ' : 'Contact' },
  ];
  return (
    <PageTransition>
      <section className="min-h-[70vh] px-6 pt-40 pb-24 md:pt-48">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-bold tracking-widest text-[#2D6CDF]">404 — NOT FOUND</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.4] text-[#111418] mt-4">
            {ja ? 'お探しのページが見つかりませんでした' : 'We couldn’t find that page'}
          </h1>
          <p className="text-base md:text-lg text-[#1A2233] leading-[1.9] mt-6">
            {ja
              ? 'ページが移動したか、URLが変わった可能性があります。以下からお探しの情報へお進みください。'
              : 'The page may have moved or the address may have changed. Try one of these instead.'}
          </p>
          <ul className="mt-10 border-t border-gray-200">
            {links.map((l) => (
              <li key={l.label} className="border-b border-gray-200">
                <a
                  href={l.href ?? pathForView(l.id!)}
                  onClick={(e) => { if (l.id) { e.preventDefault(); onNavigate(l.id); } }}
                  className="group flex items-center justify-between py-5 text-base md:text-lg font-bold text-[#111418] hover:text-[#2D6CDF] transition-colors"
                >
                  {l.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageTransition>
  );
};

// 問い合わせの起点（このタブで最初に開いたページ）。コラムは別ページなので、コラムから来た場合はそのパスを使う。
// 個人は特定せず、パスだけを Web Analytics のイベントに付ける（どのページ・コラムが問い合わせにつながったかを見るため）
const ENTRY_KEY = 'mgc_entry';
const entryPath = (): string => {
  try {
    let v = sessionStorage.getItem(ENTRY_KEY);
    if (!v) {
      let ref = '';
      try { const u = new URL(document.referrer); if (u.origin === window.location.origin) ref = u.pathname; } catch { /* 参照元なし */ }
      v = ref.startsWith('/column') ? ref : window.location.pathname;
      sessionStorage.setItem(ENTRY_KEY, v);
    }
    return v.slice(0, 200);
  } catch { return '(unknown)'; }
};

const App: React.FC<{ initialPath?: string }> = ({ initialPath }) => {
  // URL からビューを決める。ハッシュに有効なビュー名があればそれを優先（旧リンク互換）、
  // なければクリーンURL（/works, /service/<slug> など）で解決する。
  // 事前描画（サーバー）では window が無いため、渡されたパスで決める。
  const currentPath = () => (typeof window === 'undefined' ? (initialPath ?? '/') : window.location.pathname).replace(/\/+$/, '');
  const getViewFromLocation = (): ViewState => {
    if (typeof window === 'undefined') return viewForPath(initialPath ?? '/');
    const validViews: ViewState[] = ['home', 'works', 'training', 'diagnosis', 'mission', 'partners', 'company', 'career', 'contact', 'blog', 'cases', ...SERVICE_KEYS];
    const hash = window.location.hash.slice(1).split('/')[0];
    if (validViews.includes(hash as ViewState)) return hash as ViewState;
    return viewForPath(window.location.pathname);
  };

  const [view, setView] = useState<ViewState>(getViewFromLocation());
  // 同じビューで中身が変わるページ（/blog/<slug>）のために、現在のパスも持つ
  const [path, setPath] = useState<string>(currentPath());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // スマホのメニューはヘッダーの真下から始める（ヘッダーの高さは端末や文字の大きさで変わるため実測する）
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerH, setHeaderH] = useState(73);
  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setHeaderH(Math.round(el.getBoundingClientRect().bottom)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [lang, setLang] = useState<Lang>('ja');
  const t = translations[lang];

  // ハッシュ変更（旧リンク・ページ内リンク）とブラウザの戻る/進む（popstate）の両方に追従する
  useEffect(() => {
    const sync = () => {
      const next = getViewFromLocation();
      // サービスページ等の「#contact/…」リンクから相談フォームへ来た導線を計測する
      if (next === 'contact' && viewRef.current !== 'contact' && window.location.hash.startsWith('#contact')) {
        track('contact_cta', { from: viewRef.current, via: window.location.hash.slice(1) });
      }
      setView(next);
      setPath(currentPath());
      // ページ内の節へのリンク（#ai-agent など）はその位置へ。ページ扱いのハッシュ（#works 等）は先頭へ
      const anchor = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
      if (anchor) anchor.scrollIntoView({ block: 'start' });
      else window.scrollTo(0, 0);
      setIsMenuOpen(false);
    };
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    // 旧形式のハッシュ（#works 等）はページ扱いなので先頭へ。節の id（#service-04 等）ならその位置へ
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) window.setTimeout(() => target.scrollIntoView({ block: 'start' }), 100);
      else window.scrollTo(0, 0);
    }
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  // ビューごとの title / description / canonical / OGP をまとめて反映する
  useEffect(() => {
    applyMeta(metaFor(view, lang, window.location.pathname));
  }, [view, lang, path]);

  // ハイドレーションが終わったら、以降に現れる要素はスクロールで出す演出に戻す
  useEffect(() => { markHydrated(); entryPath(); }, []);

  // 計測: イベントハンドラから最新のビューを読むための参照
  const viewRef = useRef(view);
  useEffect(() => { viewRef.current = view; }, [view]);

  // 計測: 電話・メール・外部サイトへのクリック（個人情報は送らず、種類とページだけ）
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      const href = a?.getAttribute('href') ?? '';
      if (!href) return;
      if (href.startsWith('tel:')) track('tel_click', { page: viewRef.current });
      else if (href.startsWith('mailto:')) track('mail_click', { page: viewRef.current });
      else if (href === '/column' || href.startsWith('/column/')) track('column_click', { page: viewRef.current });
      else if (/^https?:\/\//.test(href) && !href.startsWith(SITE_ORIGIN)) track('outbound_click', { page: viewRef.current, host: new URL(href).hostname });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // クリーンURLへ遷移する。ハッシュは付けない（旧ハッシュ付きURLから来た場合はここで消える）
  // パスで遷移する（/blog/<slug> のようにビュー名だけでは決まらないページ用）
  const navigatePath = (to: string) => {
    const [pathname, hash] = to.split('#');
    if (window.location.pathname !== pathname || window.location.hash !== (hash ? `#${hash}` : '')) {
      window.history.pushState({}, '', to);
    }
    setView(viewForPath(pathname));
    setPath(pathname);
    setIsMenuOpen(false);
    if (hash) {
      // ページの切り替え（描画）を待ってから、その節までスクロールする
      window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const navigate = (id: ViewState) => {
    // どのページから相談フォームへ来たかを計測する（ボタンごとに印を付けず、遷移の一か所で取る）
    if (id === 'contact' && view !== 'contact') track('contact_cta', { from: view });
    navigatePath(pathForView(id));
  };

  // フッターのリンク。ヘッダーより広く、役割ごとにまとめて並べる。
  const footerGroups: { title: string; links: NavLeaf[] }[] = [
    {
      title: t.footer.groups.business,
      // 事業内容ページの4事業と同じ並び。AIソリューションの下に個別サービスを置く
      links: [
        { id: 'works', label: t.nav.works },
        { id: 'biz-ai', label: t.nav.aiSolutions },
        ...SERVICE_KEYS.map((k) => ({ id: k as ViewState, label: serviceContent[lang][k].navLabel, indent: true })),
        { id: 'biz-newbiz', label: t.nav.newBiz },
        { id: 'training', label: t.nav.training },
        { id: 'biz-crossborder', label: t.nav.crossBorder },
        { id: 'pricing', label: t.pricing.footer },
      ],
    },
    {
      title: t.footer.groups.insights,
      links: [
        { id: 'cases', label: t.nav.cases },
        { href: '/column', label: t.nav.column },
        { id: 'guides', label: lang === 'ja' ? '比較・選び方ガイド' : 'Comparison guides' },
        { id: 'glossary', label: lang === 'ja' ? '用語集' : 'Glossary' },
        { id: 'blog', label: t.nav.blog },
      ],
    },
    {
      title: t.footer.groups.company,
      links: [
        { id: 'mission', label: t.nav.mission },
        { id: 'company', label: t.nav.company },
        { id: 'career', label: t.nav.career },
        { id: 'contact', label: t.nav.contact },
      ],
    },
  ];

  // 情報ナビ（お問い合わせはCTAボタンとして分離、Journalはフッターへ集約）
  // heading: 押せない小見出し / indent: 小見出しの下に字下げして並べる
  // hash: 同じページ内の節へ飛ぶ（例: 事業内容の「クロスボーダー」→ /works#service-04）
  type NavLeaf = { id?: ViewState; hash?: string; href?: string; label: string; heading?: boolean; indent?: boolean };
  const leafHref = (c: NavLeaf) => (c.id ? pathForView(c.id) + (c.hash ? `#${c.hash}` : '') : undefined);
  const goLeaf = (c: NavLeaf) => { if (c.id) navigatePath(leafHref(c)!); };
  const isLeafActive = (c: NavLeaf) => view === c.id && !c.hash;
  type NavItem = NavLeaf & { children?: NavLeaf[] };
  const navItems: NavItem[] = [
    { label: t.nav.works, children: [
      { id: 'works', label: t.nav.worksTop },
      { id: 'biz-ai', label: t.nav.aiSolutions },
      { id: 'biz-newbiz', label: t.nav.newBiz },
      { id: 'training', label: t.nav.training },
      { id: 'biz-crossborder', label: t.nav.crossBorder },
    ] },
    { id: 'cases', label: t.nav.cases },
    { href: '/column', label: t.nav.column },
    { label: t.nav.companyGroup, children: [
      { id: 'mission', label: t.nav.mission },
      { id: 'company', label: t.nav.company },
      { id: 'blog', label: t.nav.blog },
      { id: 'career', label: t.nav.career },
    ] },
  ];
  // スマホのメニュー用: 子を持たない単独リンクが続くときは、1つのまとまりにする
  type MobileGroup = { kind: 'section'; label: string; children: NavLeaf[] } | { kind: 'links'; label: string; links: NavItem[] };
  const mobileGroups: MobileGroup[] = navItems.reduce<MobileGroup[]>((acc, item) => {
    if (item.children) { acc.push({ kind: 'section', label: item.label, children: item.children }); return acc; }
    const last = acc[acc.length - 1];
    if (last && last.kind === 'links') last.links.push(item);
    else acc.push({ kind: 'links', label: `links-${item.label}`, links: [item] });
    return acc;
  }, []);
  // サービスページ（AI営業など）は事業内容の中のページとして扱う
  const isGroupActive = (item: NavItem) => !!item.children?.some((c) => c.id === view || (c.id === 'works' && (isServiceKey(view) || isBizView(view))));

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
    <div className="min-h-screen font-sans bg-offwhite text-offblack">
      
      {/* Header
          以前は mix-blend-difference（背景に応じて色を反転）だったため、ドロップダウンが
          下の本文と混ざって読みにくかった。白地の固定ヘッダーにして、常に同じ見え方にする。 */}
      <header ref={headerRef} className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 text-offblack">
        <div className="py-4 px-6 md:px-12 flex justify-between items-center">
        <NavLink
          href={pathForView('home')} onGo={() => navigate('home')}
          className="flex items-center gap-4 group z-50 relative"
        >
          <div className="w-14 h-9 bg-offblack flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-180">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          <span className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity">MGC Inc.</span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => item.children ? (
            <div key={item.label} className="relative group">
              <button
                type="button"
                aria-haspopup="true"
                className={`relative py-1 inline-flex items-center gap-1 transition-colors ${isGroupActive(item) ? 'text-offblack font-bold' : 'text-gray-600 hover:text-offblack font-medium'}`}
              >
                {item.label}
                <span aria-hidden className="text-[10px] translate-y-px transition-transform group-hover:rotate-180">▾</span>
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 ${isGroupActive(item) ? 'w-full' : 'w-0'}`} />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block group-focus-within:block">
                <div className="min-w-[15rem] rounded-2xl bg-white border border-gray-200 p-2 shadow-[0_12px_32px_rgba(17,20,24,0.12)]">
                  {item.children.map((c) => c.heading ? (
                    <span key={c.label} className="block px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{c.label}</span>
                  ) : (
                    <NavLink
                      key={c.label}
                      href={leafHref(c)} onGo={() => goLeaf(c)}
                      aria-current={isLeafActive(c) ? 'page' : undefined}
                      className={`relative block w-full text-left ${c.indent ? 'pl-8 pr-4' : 'px-4'} py-2.5 rounded-xl text-sm transition-colors ${
                        isLeafActive(c)
                          ? 'font-bold text-accent bg-accent/10'
                          : 'font-medium text-gray-700 hover:text-offblack hover:bg-[#F4F6FB]'
                      }`}
                    >
                      {isLeafActive(c) && <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-accent" />}
                      {c.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          ) : item.href ? (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 text-gray-600 hover:text-offblack font-medium transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <NavLink
              key={item.id}
              href={item.id ? pathForView(item.id) : undefined} onGo={() => item.id && navigate(item.id)}
              aria-current={view === item.id ? 'page' : undefined}
              className={`relative py-1 transition-colors ${view === item.id ? 'text-offblack font-bold' : 'text-gray-600 hover:text-offblack font-medium'}`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 ${view === item.id ? 'w-full' : 'w-0'}`} />
            </NavLink>
          ))}
          {/* Contact CTA（主導線） */}
          <NavLink
            href={pathForView('contact')} onGo={() => navigate('contact')}
            className="ml-1 px-5 py-2 rounded-full bg-offblack text-white font-bold hover:bg-accent transition-colors duration-300"
          >
            {t.nav.contact}
          </NavLink>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
             {/* Language Switcher (Desktop/Mobile) */}
             <button
               onClick={() => { const next: Lang = lang === 'ja' ? 'en' : 'ja'; loadLang(next).then(() => setLang(next)); }}
               className="font-mono text-sm font-bold border border-gray-300 rounded-full flex overflow-hidden z-50 hover:border-gray-400 transition-colors"
             >
               <span className={`px-3 py-1 transition-colors ${lang === 'ja' ? 'bg-offblack text-white' : 'text-gray-500 hover:text-offblack'}`}>JP</span>
               <span className={`px-3 py-1 transition-colors ${lang === 'en' ? 'bg-offblack text-white' : 'text-gray-500 hover:text-offblack'}`}>EN</span>
             </button>

             <button
               className="md:hidden z-50 p-2 hover:opacity-70 transition-opacity"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
             >
               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
        </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {/* スマホのメニュー（md 未満でのみ開く）。見出し＝小さめのグレー、項目＝同じ大きさ・タップ領域 48px、左揃え */}
      <div
        style={{ top: headerH }}
        className={`fixed inset-x-0 bottom-0 bg-white z-40 overflow-y-auto overscroll-contain transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <nav aria-label={lang === 'ja' ? 'メニュー' : 'Menu'} className="mx-auto w-full max-w-md px-6 pt-6" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)' }}>
          {mobileGroups.map((item) => item.kind === 'section' ? (
            <div key={item.label} className="mb-6">
              <p className="px-1 pb-1 text-xs font-bold tracking-[0.2em] uppercase text-gray-400">{item.label}</p>
              <ul className="border-t border-gray-100">
                {item.children.map((c) => c.heading ? (
                  <li key={c.label} className="px-1 pt-4 pb-1 text-[11px] font-bold tracking-[0.15em] text-accent">{c.label}</li>
                ) : (
                  <li key={c.label} className="border-b border-gray-100">
                    <NavLink
                      href={leafHref(c)} onGo={() => goLeaf(c)}
                      className={`flex items-center justify-between min-h-[48px] py-2 ${c.indent ? 'pl-5 pr-1 text-[15px] font-medium text-gray-600' : 'px-1 text-[17px] font-bold text-offblack'} leading-snug hover:text-accent transition-colors`}
                    >
                      {c.label}
                      <ChevronRight aria-hidden className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul key={item.label} className="mb-6 border-t border-gray-100">
              {item.links.map((l) => (
                <li key={l.href ?? l.id} className="border-b border-gray-100">
                  {l.href ? (
                    <a href={l.href} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between min-h-[48px] py-2 px-1 text-[17px] font-bold text-offblack leading-snug hover:text-accent transition-colors">
                      {l.label}
                      <ChevronRight aria-hidden className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </a>
                  ) : (
                    <NavLink href={l.id ? pathForView(l.id) : undefined} onGo={() => l.id && navigate(l.id)} className="flex items-center justify-between min-h-[48px] py-2 px-1 text-[17px] font-bold text-offblack leading-snug hover:text-accent transition-colors">
                      {l.label}
                      <ChevronRight aria-hidden className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          ))}
          <NavLink
            href={pathForView('contact')} onGo={() => navigate('contact')}
            className="mt-2 flex items-center justify-center w-full min-h-[52px] px-8 rounded-full bg-accent text-white text-base font-bold hover:opacity-90 transition-colors"
          >
            {t.nav.contact}
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <main>
        {view === 'home' && <HomeView onNavigate={navigate} />}
        {view === 'works' && <WorksView onNavigate={navigate} />}
        {view === 'training' && <TrainingView onNavigatePath={navigatePath} />}
        {isServiceKey(view) && <ServiceView serviceKey={view} onNavigate={navigate} />}
        {view === 'cases' && <CasesView />}
        {view === 'diagnosis' && <DiagnosisView />}
        {view === 'blog' && <BlogView onNavigate={navigate} onNavigatePath={navigatePath} />}
        {view === 'journal' && <JournalPostView slug={path.split('/').pop() ?? ''} onNavigate={navigate} onNavigatePath={navigatePath} />}
        {view === 'mission' && <MissionView />}
        {/* PartnersView is hidden */}
        {view === 'company' && <CompanyView onNavigate={navigate} />}
        {view === 'career' && <CareerView />}
        {view === 'contact' && <ContactView onNavigate={navigate} initialSent={currentPath() === THANKS_PATH} />}
        {isBizView(view) && <BusinessView biz={view} onNavigate={navigate} />}
        {view === 'glossary' && <GlossaryView onNavigate={navigate} />}
        {view === 'pricing' && <PricingView onNavigate={navigate} />}
        {view === 'guides' && <GuidesView />}
        {view === 'guide' && <GuideView slug={path.split('/').pop() ?? ''} onNavigate={navigate} />}
        {view === 'case' && <CaseView slug={path.split('/').pop() ?? ''} onNavigate={navigate} />}
        {view === 'notfound' && <NotFoundView onNavigate={navigate} />}
        {view === 'privacy-policy' && <LegalView doc="privacy" onNavigate={navigate} />}
        {view === 'terms-of-service' && <LegalView doc="terms" onNavigate={navigate} />}
      </main>

      {/* Floating CTA — visible on every page except contact itself */}
      {view !== 'contact' && view !== 'home' && (
        <NavLink
          href={pathForView('contact')} onGo={() => navigate('contact')}
          aria-label={t.floatingCta.label}
          className="group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 inline-flex items-center gap-3 px-5 py-3.5 md:px-6 md:py-4 bg-accent text-white rounded-full font-bold text-sm md:text-base tracking-tight shadow-2xl shadow-accent/30 hover:opacity-90 hover:shadow-offblack/40 transition-all duration-300"
        >
          <span className="relative flex items-center justify-center w-2.5 h-2.5">
            <span className="absolute inset-0 bg-white/40 rounded-full animate-ping"></span>
            <span className="relative w-2.5 h-2.5 bg-white rounded-full"></span>
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span>{t.floatingCta.label}</span>
            <span className="text-[10px] font-mono opacity-80">{t.floatingCta.sub}</span>
          </span>
          <span className="sm:hidden">{t.floatingCta.label}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </NavLink>
      )}

      <footer className={`px-6 md:px-12 pt-16 md:pt-20 pb-10 border-t border-gray-200 text-gray-500`}>
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            {/* ブランド・所在地・相談への導線 */}
            <div className="md:col-span-4 lg:col-span-5">
              <NavLink href={pathForView('home')} onGo={() => navigate('home')} className="flex items-center gap-3 group">
                <span className={`w-12 h-8 flex items-center justify-center bg-offblack`}>
                  <span className={`w-4 h-4 rounded-full bg-white`} />
                </span>
                <span className={`text-lg font-bold tracking-tighter text-offblack group-hover:text-accent transition-colors`}>
                  MGC Inc.
                </span>
              </NavLink>
              <p className={`text-sm font-bold mt-6 text-offblack`}>{t.footer.tagline}</p>
              <p className="text-sm leading-relaxed mt-4">{t.footer.corp}</p>
              <p className="text-sm leading-relaxed">{t.footer.address}</p>
              <NavLink
                href={pathForView('contact')} onGo={() => navigate('contact')}
                className="group inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-bold hover:opacity-90 transition-colors"
              >
                {t.footer.contactCta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </NavLink>
            </div>

            {/* リンク集 */}
            {footerGroups.map((group) => (
              <div key={group.title} className="md:col-span-4 lg:col-span-2 lg:col-start-auto">
                <h2 className={`text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-5 text-gray-400`}>
                  {group.title}
                </h2>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label} className={link.indent ? 'pl-3' : undefined}>
                      {link.href ? (
                        <a href={link.href} className={`text-sm font-medium hover:text-accent transition-colors text-gray-700`}>
                          {link.label}
                        </a>
                      ) : (
                        <NavLink
                          href={leafHref(link)} onGo={() => goLeaf(link)}
                          className={`text-sm text-left hover:text-accent transition-colors ${link.indent ? 'text-gray-500' : 'font-medium text-gray-700'}`}
                        >
                          {link.label}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 最下段 */}
          <div className={`mt-14 md:mt-16 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-gray-200`}>
            <p className="text-xs opacity-70">{t.footer.rights}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <NavLink href="/privacy-policy" onGo={() => navigate('privacy-policy')} className="hover:text-accent transition-colors">{t.footer.privacy}</NavLink>
              <NavLink href="/terms-of-service" onGo={() => navigate('terms-of-service')} className="hover:text-accent transition-colors">{t.footer.terms}</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </LanguageContext.Provider>
  );
};


export default App;