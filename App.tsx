import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { ArrowRight, Globe, Zap, Layers, ArrowUpRight, X, Palette, Send, Network, Menu, Plus, Anchor, Check, Heart, MapPin, Cpu, Mic, MessageSquare, Briefcase, Plane, Sparkles, Mail, Calendar, User } from 'lucide-react';


// --- Types & Interfaces ---

type ViewState = 'home' | 'works' | 'cases' | 'mission' | 'partners' | 'company' | 'career' | 'contact' | 'blog';

// Updated ContentKeys to include new services and keep old architecture items
type ContentKey = 'product' | 'marketing' | 'trading' | 'vision' | 'service_ai' | 'service_lab' | 'service_trade';

interface ContentItem {
  title: string;
  subtitle: string;
  theme: 'light' | 'dark' | 'gray';
  details: ReactNode;
  number?: string;
  icon?: ReactNode;
}

// --- Data ---

const contentData: Record<ContentKey, ContentItem> = {
  // --- New Services (for WorksView) ---
  service_ai: {
    title: "Global One AI",
    subtitle: "世界をひとつの市場に変える、ワンストップAI",
    theme: 'dark',
    number: "01",
    icon: <Globe className="w-6 h-6 text-white stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-12 text-gray-300">
          言葉の壁を越える「音声AI」と、未開拓の顧客へ届く「リーチAI」を統合。<br className="hidden md:block"/>
          海外進出のハードルをゼロにし、あなたのビジネスを世界標準へ加速させます。
        </p>
        <div className="space-y-12 text-gray-400">
           <div className="border-t border-gray-800 pt-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <span className="text-accent font-bold tracking-widest text-sm mb-2 block">01</span>
                  <h4 className="text-2xl font-bold text-white">Cross-Border Voice</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold mb-3 text-white">その声は、国境を越えて響く。</p>
                  <p className="text-lg leading-relaxed">
                    高精度の音声AIが、リアルタイムで言語の壁を解消。まるで母国語同士のように、現地のパートナーや顧客と深い信頼関係を築けます。
                  </p>
                </div>
             </div>
           </div>
           
           <div className="border-t border-gray-800 pt-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <span className="text-accent font-bold tracking-widest text-sm mb-2 block">02</span>
                  <h4 className="text-2xl font-bold text-white">Direct Global Reach</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold mb-3 text-white">待っているだけでは出会えない顧客へ。</p>
                  <p className="text-lg leading-relaxed">
                    独自のリーチAIが、世界中の企業データベースから最適なターゲットを抽出。アプローチまでを自動化し、商談の機会を最大化します。
                  </p>
                </div>
             </div>
           </div>

           <div className="border-t border-gray-800 pt-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <span className="text-accent font-bold tracking-widest text-sm mb-2 block">03</span>
                  <h4 className="text-2xl font-bold text-white">All-in-One Platform</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold mb-3 text-white">海外展開を、もっとシンプルに。</p>
                  <p className="text-lg leading-relaxed">
                    コミュニケーションから新規開拓まで、グローバルビジネスに必要なツールをワンストップで提供。複雑なプロセスをなくし、成果に集中できる環境を作ります。
                  </p>
                </div>
             </div>
           </div>
        </div>
      </>
    )
  },
  service_lab: {
    title: "Global X Lab",
    subtitle: "アイデアを、瞬速で世界の手のひらへ。",
    theme: 'light',
    number: "02",
    icon: <Zap className="w-6 h-6 text-offblack stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-12">
          「開発」と「マーケティング」を掛け合わせ（X）、国境の壁を突破する。<br className="hidden md:block"/>
          世界中のライフスタイルをアップデートするプロダクトを、ここから次々と生み出します。
        </p>
        <div className="space-y-12">
           <div className="border-t border-gray-200 pt-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <span className="text-accent font-bold tracking-widest text-sm mb-2 block">01</span>
                  <h4 className="text-2xl font-bold">Agile for Global<br/><span className="text-base text-gray-400 font-normal">世界最速の社会実装</span></h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold mb-3">ひらめきを、即座に形にする。</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    トレンドの波を逃さない超高速のアジャイル開発。MVP（実用最小限の製品）を短期間で市場へ投入し、世界中のユーザーからのフィードバックで進化させ続けます。
                  </p>
                </div>
             </div>
           </div>
           
           <div className="border-t border-gray-200 pt-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <span className="text-accent font-bold tracking-widest text-sm mb-2 block">02</span>
                  <h4 className="text-2xl font-bold">Dev × Growth<br/><span className="text-base text-gray-400 font-normal">開発と成長の融合</span></h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold mb-3">作ると同時に、世界へ仕掛ける。</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    プロダクト開発とグロースハックを分断させない。設計段階から各国のマーケティング戦略を組み込み、リリースした瞬間から垂直立ち上げを実現します。
                  </p>
                </div>
             </div>
           </div>

           <div className="border-t border-gray-200 pt-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <span className="text-accent font-bold tracking-widest text-sm mb-2 block">03</span>
                  <h4 className="text-2xl font-bold">Borderless Experience<br/><span className="text-base text-gray-400 font-normal">言葉はいらない体験</span></h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold mb-3">直感で伝わる、ノンバーバル設計。</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    言語や文化背景が異なる70億人が、説明書なしで使えるUI/UXを追求。国境を感じさせない「ボーダレス」な体験デザインを提供します。
                  </p>
                </div>
             </div>
           </div>
        </div>
      </>
    )
  },
  service_trade: {
    title: "Global Nexus Trade",
    subtitle: "技術の「適材適所」を、世界規模で創り出す。",
    theme: 'light',
    number: "03",
    icon: <Layers className="w-6 h-6 text-offblack stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-12">
          日本の技術を世界へ、世界の革新を日本へ。<br className="hidden md:block"/>
          国境によるミスマッチを解消し、埋もれていた価値を「最も必要とされる場所」へと繋ぐ、次世代の技術トレーディング。
        </p>
        <div className="space-y-12">
           <div className="border-t border-gray-200 pt-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <span className="text-accent font-bold tracking-widest text-sm mb-2 block">01</span>
                  <h4 className="text-2xl font-bold">Export: Value Optimization<br/><span className="text-base text-gray-400 font-normal">価値の再配置</span></h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold mb-3">日本の技術に、新たな市場を。</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    国内では成熟した技術も、世界にはそれを熱望する市場が存在します。日本の優れた知財（IP）や素材を発掘し、その価値が最も高く評価される海外パートナーへとマッチングさせます。
                  </p>
                </div>
             </div>
           </div>
           
           <div className="border-t border-gray-200 pt-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <span className="text-accent font-bold tracking-widest text-sm mb-2 block">02</span>
                  <h4 className="text-2xl font-bold">Import: Global Solution<br/><span className="text-base text-gray-400 font-normal">世界の知を実装</span></h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold mb-3">海外の革新を、日本の課題解決へ。</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    ゼロから開発するのではなく、世界中にある「既存の正解」を導入する。海外の先端テクノロジーやソリューションを輸入し、日本企業のイノベーションを加速させます。
                  </p>
                </div>
             </div>
           </div>

           <div className="border-t border-gray-200 pt-8">
             <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <span className="text-accent font-bold tracking-widest text-sm mb-2 block">03</span>
                  <h4 className="text-2xl font-bold">Frictionless Process<br/><span className="text-base text-gray-400 font-normal">取引の効率化</span></h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl font-bold mb-3">技術移転を、もっとスムーズに。</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    複雑なライセンス契約、権利処理、ローカライズの壁を、専門チームとAIが効率化。アナログで時間のかかる貿易実務を刷新し、ビジネスチャンスを逃さないスピーディな取引を実現します。
                  </p>
                </div>
             </div>
           </div>
        </div>
      </>
    )
  },
  
  // --- Old Architecture (Renamed to Internal Methods) ---
  product: {
    title: "Manifest Creativity",
    subtitle: "脳内のビジョンを、直接ソフトウェアへ変換する。",
    theme: 'light',
    number: "OS.01",
    icon: <Zap className="w-6 h-6 text-offblack stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-8">
          The barrier between idea and execution is gone.
        </p>
        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
          <p>
            AIネイティブ時代において、技術はもはや障壁ではありません。
            重要なのは「何を創りたいか」という思想です。
            私たちは、情熱とアイデアを持つ個人が、AIという翼を使って自分の世界観をそのままプロダクトとして具現化し、
            世の中に問いかけることを可能にします。
          </p>
        </div>
      </>
    )
  },
  marketing: {
    title: "Global Marketing",
    subtitle: "コンテキストをハックし、文化的な摩擦を共感に変える。",
    theme: 'dark',
    number: "OS.02",
    icon: <Globe className="w-6 h-6 text-white stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-8 text-gray-300">
          Translation is utility. Localization is empathy.
        </p>
        <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
          <p>
            言語をただ置き換えるだけでは、人の心は動きません。
            私たちはターゲット市場の文化的背景（コンテキスト）を徹底的に解析。
            その土地の空気を吸い込んだかのような、自然で響くナラティブを構築します。
          </p>
        </div>
      </>
    )
  },
  trading: {
    title: "Curated Commerce",
    subtitle: "AIオペレーションで、物理と情報の距離を消し去る。",
    theme: 'light',
    number: "OS.03",
    icon: <Layers className="w-6 h-6 text-offblack stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-8">
           Delivering the unseen craft of Japan everywhere.
        </p>
        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
          <p>
            日本の本当に良いものには、まだ世界が知らない物語があります。
            私たちはAIを活用した高度なオペレーションにより、従来の手法ではリーチできなかった地域やニッチな市場へ、
            日本のクラフトマンシップと美意識を届けます。
          </p>
        </div>
      </>
    )
  },
  vision: {
    title: "Minimal Organization.",
    subtitle: "Small Team, Giant Leaps.",
    theme: 'gray',
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-8">
          Bloat is the enemy of speed.
        </p>
        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
          <p>
            巨大な組織図は必要ありません。必要なのは、自律的に動き、決定し、実行できるエリートたちの小さな集合体です。
            MGC inc.は組織の肥大化を拒み、個々の能力を最大化することで、世界規模の課題解決に挑みます。
          </p>
        </div>
      </>
    )
  }
};

const ACCENT_COLORS = [
  '#2563EB', // Swiss Blue
  '#FF3B30', // International Red
  '#34C759', // Success Green
  '#FF9500', // Safety Orange
  '#AF52DE', // Royal Purple
  '#050505', // Monochrome
];

// --- Shared Components ---

const Reveal: React.FC<{ children: ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

const SectionHeading: React.FC<{ title: string; subtitle?: ReactNode; dark?: boolean }> = ({ title, subtitle, dark = false }) => (
  <Reveal>
    <div className={`flex flex-col md:flex-row items-end justify-between border-b ${dark ? 'border-gray-800' : 'border-gray-200'} pb-8 mb-16`}>
      <div className="relative">
        <h2 className={`text-6xl md:text-8xl font-bold tracking-tighter mb-2 ${dark ? 'text-white' : 'text-offblack'}`}>{title}</h2>
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

const DetailModal: React.FC<{ id: ContentKey | null; onClose: () => void }> = ({ id, onClose }) => {
  if (!id) return null;
  const content = contentData[id];
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-[fadeIn_0.3s_ease-out] ${content.theme === 'dark' ? 'bg-gray-900 text-white' : content.theme === 'gray' ? 'bg-gray-100 text-offblack' : 'bg-white text-offblack'}`}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 transition-colors z-10">
          <X className="w-6 h-6" />
        </button>
        <div className="p-8 md:p-12">
           <div className="flex items-start gap-6 mb-8">
              {content.icon && (
                <div className={`p-4 rounded-2xl ${content.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {content.icon}
                </div>
              )}
              <div>
                {content.number && <span className="text-accent font-bold tracking-widest text-sm mb-2 block">{content.number}</span>}
                <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2">{content.title}</h3>
                <p className={`text-xl font-medium ${content.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{content.subtitle}</p>
              </div>
           </div>
           <div className="prose prose-lg max-w-none">
             {content.details}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Generated Case Image Component ---

// Simple memory cache to persist images during session
const imageCache: Record<string, string> = {};

const GeneratedCaseImage = ({ prompt, className }: { prompt: string, className?: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(imageCache[prompt] || null);
  const [loading, setLoading] = useState(!imageCache[prompt]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If we have a cached image for this prompt, use it and skip generation.
    if (imageCache[prompt]) {
        setImageUrl(imageCache[prompt]);
        setLoading(false);
        return;
    }

    setLoading(true);
    let isMounted = true;
    const gen = async () => {
      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        
        if (!response.ok) throw new Error("Backend failed");
        const data = await response.json();
        
        if (!isMounted) return;

        let found = false;
        // Extract image from parts (matching backend structure which returns full response)
        for (const part of data.candidates?.[0]?.content?.parts || []) {
           if (part.inlineData) {
             const url = `data:image/png;base64,${part.inlineData.data}`;
             setImageUrl(url);
             imageCache[prompt] = url; // Save to cache
             found = true;
             break;
           }
        }
        if (!found) setError(true);
      } catch (e) {
        console.error("Image generation failed", e);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    gen();
    return () => { isMounted = false; };
  }, [prompt]);

  if (loading) return (
      <div className={`bg-gray-50 flex flex-col items-center justify-center ${className}`}>
          <div className="w-8 h-8 border-2 border-gray-200 border-t-accent rounded-full animate-spin mb-4"/>
          <p className="text-xs font-mono text-gray-400 animate-pulse">Generating Asset...</p>
      </div>
  );

  if (error || !imageUrl) return (
      <div className={`bg-gray-50 flex items-center justify-center text-gray-300 ${className}`}>
        <div className="text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <span className="text-xs font-mono">Image Unavailable</span>
        </div>
      </div>
  );

  return <img src={imageUrl} alt="Generated Asset" className={`object-cover w-full h-full animate-[fadeIn_0.5s_ease-out] ${className}`} />;
}

// --- Feature Components (Pages) ---

const HomeView: React.FC<{ onNavigate?: (view: ViewState) => void }> = ({ onNavigate }) => (
  <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden pt-40 pb-20">
    <div className="max-w-screen-xl w-full mx-auto">
      <Reveal>
        <h1 className="text-[12vw] md:text-[10vw] leading-[0.9] font-bold tracking-tighter text-offblack mb-12">
          Connect <br />
          <span className="text-accent transition-colors duration-500">Japan</span> & <br />
          The World.
        </h1>
      </Reveal>
      
      <Reveal delay={200}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-gray-200 pt-8 mt-8">
          <p className="text-lg md:text-xl text-gray-600 max-w-md font-medium leading-relaxed">
            日本の可能性を、世界の実装へ。
            <br />
            テクノロジーで思考と国境の壁を溶かす、次世代のグローバル・ハブ。
          </p>
          <div className="mt-8 md:mt-0">
            <button 
              onClick={() => {
                if (onNavigate) onNavigate('cases');
                else window.location.hash = 'cases';
              }} 
              className="group flex items-center gap-2 text-offblack font-bold text-lg tracking-tight border-b-2 border-offblack pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              View Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const WorksView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<ContentKey | null>(null);

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <SectionHeading 
          title="Business" 
          subtitle="Our Business Domains."
          dark 
        />

        <div className="group/grid grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[420px] md:auto-rows-[520px]">
          
          <Reveal className="h-full">
             <div 
              onClick={() => setSelectedId('service_ai')}
              className="relative h-full text-white rounded-[2rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between overflow-hidden group/card cursor-pointer border border-transparent group-hover/grid:opacity-50 hover:!opacity-100 bg-offblack"
            >
              <div className="absolute inset-0 z-0">
                <img src="/assets/service_ai.jpg" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[2s] ease-out" alt="Global One AI" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
              </div>
              <div className="absolute top-6 right-8 text-[8rem] font-bold text-white/5 opacity-0 group-hover/card:opacity-10 transition-all duration-700 select-none leading-none z-0">01</div>
              <div className="pointer-events-none relative z-10 transition-transform duration-700 group-hover:translate-y-[-5px]">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                  <Globe className="w-6 h-6 text-white stroke-[1.5]" />
                </div>
                <h3 className="text-4xl font-bold tracking-tighter mb-4">Global <br/>One AI</h3>
                <p className="text-gray-200 text-base leading-relaxed font-medium">
                  世界をひとつの市場に変える、ワンストップAI。
                </p>
              </div>
              <div className="flex justify-end mt-auto relative z-10">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover/card:bg-accent group-hover/card:border-accent transition-all duration-500 backdrop-blur-sm"><ArrowRight className="w-5 h-5 text-white" /></div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="md:col-span-2 h-full">
             <div 
              onClick={() => setSelectedId('service_lab')}
              className="relative h-full text-white rounded-[2rem] p-10 md:p-14 shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between overflow-hidden group/card cursor-pointer border border-transparent group-hover/grid:opacity-50 hover:!opacity-100 bg-offblack"
            >
              <div className="absolute inset-0 z-0">
                <img src="/assets/service_lab.png" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[2s] ease-out" alt="Global X Lab" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute top-6 right-10 text-[10rem] font-bold text-white/5 opacity-0 group-hover/card:opacity-10 transition-all duration-700 select-none leading-none z-0">02</div>
              <div className="relative z-10 pointer-events-none">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                  <Zap className="w-6 h-6 text-white stroke-[1.5]" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Global <br/>X Lab</h3>
                <p className="text-gray-200 text-lg font-medium leading-relaxed max-w-md">
                  アイデアを、瞬速で世界の手のひらへ。<br/>「開発」と「マーケティング」を掛け合わせ（X）、国境の壁を突破する。
                </p>
              </div>
              <div className="flex items-center gap-3 text-white font-bold tracking-tight relative z-10 mt-auto">
                <span className="group-hover/card:text-accent transition-colors duration-300">View Lab</span>
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-full group-hover/card:bg-accent group-hover/card:text-white transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 group-hover/card:rotate-45 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={300} className="md:col-span-3 h-[420px]">
            <div 
              onClick={() => setSelectedId('service_trade')}
              className="relative h-full text-white rounded-[2rem] p-10 md:p-14 shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col md:flex-row items-center justify-between overflow-hidden group/card cursor-pointer border border-transparent group-hover/grid:opacity-50 hover:!opacity-100 bg-offblack"
            >
              <div className="absolute inset-0 z-0">
                <img src="/assets/service_trade.png" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[2s] ease-out" alt="Global Nexus Trade" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute top-6 right-10 text-[12rem] font-bold text-white/5 opacity-0 group-hover/card:opacity-10 transition-all duration-700 select-none leading-none z-0">03</div>
              <div className="pointer-events-none relative z-10 w-full md:w-2/3">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                  <Layers className="w-6 h-6 text-white stroke-[1.5]" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Global Nexus Trade</h3>
                <p className="text-gray-200 text-lg leading-relaxed max-w-xl">
                  技術の「適材適所」を、世界規模で創り出す。<br/>日本の技術を世界へ、世界の革新を日本へ。
                </p>
              </div>
              <div className="relative z-10 mt-8 md:mt-0">
                 <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center group-hover/card:bg-accent group-hover/card:border-accent group-hover/card:text-white transition-all duration-500 backdrop-blur-sm"><ArrowRight className="w-8 h-8" /></div>
              </div>
            </div>
          </Reveal>
        </div>
        <DetailModal id={selectedId} onClose={() => setSelectedId(null)} />
      </div>
    </PageTransition>
  );
};

const CasesView: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const cases = [
    {
      id: "01",
      category: "Voice AI Architecture",
      title: "Voice Agent Construction",
      image: "/assets/case01.png",
      detailImage: "/assets/case01_detail.jpg",
      desc: "コールセンターにおける一次応答・架電業務の完全AI化。小売店における予約受付の自動化を実装。",
      detail: "【コールセンター業務の完全自動化と高度化】\nTwilio（電話API）とElevenLabs（超自然な音声合成）、そしてLLMを高度に連携させることで、人間と区別がつかないレベルのAI電話対応を実現しました。\n\nコールセンターにおける一次応答から、AIへのエスカレーション対応までをシームレスに自動化。特筆すべきは、人間が対応している通話内容もAIがリアルタイムで聞き取り、自動要約を作成する機能です。\n\nこの要約データは自動的にCRMへ入力され、担当部署へのタスク連携も行われます。オペレーターの後処理時間（ACW）をほぼゼロにし、対応品質の均質化を実現しました。",
      tags: ["Voice Synthesis", "Twilio / ElevenLabs", "Real-time Processing"],
      icon: <Mic className="w-8 h-8 text-offblack" />
    },
    {
      id: "02",
      category: "Intelligent CS Bot",
      title: "Customer Support AI",
      image: "/assets/case02.png",
      detailImage: "/assets/case02_chatbot_ui.jpg",
      desc: "介護業界、建材メーカー等における問い合わせ対応をRAG活用で自動化。Web/LINE上での高度な対話を実現。",
      detail: "【顧客対応と社内FAQの双方向DX】\n対外的な顧客サポート（Webチャット、LINE公式アカウント）の自動化に加え、社内向けの問い合わせ対応もAI化しました。\n\n「経費精算の手順は？」「就業規則の確認」といった社員からの質問に対し、RAG（検索拡張生成）技術を用いて社内マニュアルから最適な回答を即座に生成します。\n\n企業ごとの膨大なナレッジを学習させることで、「誰に聞けばいいかわからない」時間を排除し、組織全体の生産性を底上げしました。",
      tags: ["RAG", "Multi-modal Chatbot", "Knowledge Base Integration"],
      icon: <MessageSquare className="w-8 h-8 text-offblack" />
    },
    {
      id: "03",
      category: "AI Native Transformation",
      title: "AI Consulting",
      image: "/assets/case03.png",
      detailImage: "/assets/case03_workflow.jpg",
      desc: "最新ツール導入によるAIネイティブなビジネスモデルへの転換支援。業務プロセスの自動化ワークフロー開発。",
      detail: "【ヒアリングから実装まで、一気通貫の変革】\n単なるアドバイザリー業務ではありません。現場の課題ヒアリングから始まり、解決策の提案、そしてコードレベルでの実装までを一貫して行います。\n\n複数のSaaSツール間をAPI連携で繋ぎ合わせる自動化ワークフローの構築や、業務に特化した独自の社内システムのスクラッチ開発も実施。\n\nボトルネックとなっていた手作業をシステムに置き換え、企業が本来注力すべきコア業務にリソースを集中できる環境を構築します。",
      tags: ["DX Strategy", "Workflow Automation", "Business Modeling"],
      icon: <Briefcase className="w-8 h-8 text-offblack" />
    },
    {
      id: "04",
      category: "Cross-Border Matching",
      title: "AI Powered Export",
      image: "/assets/case04_final.jpg",
      detailImage: "/assets/case04_final.jpg",
      desc: "アフリカ・欧州との連携をベースに、日本企業の製品・サービスを最適化してマッチング。市場選定のAI化。",
      detail: "【AIが即座に見つける、世界の最適パートナー】\nアフリカや欧州市場をメインターゲットに、日本企業の製品が「刺さる」パートナー企業をAIが自動選定します。\n\nLinkedInなどのビジネスデータベースを解析し、決裁権を持つキーマンを特定。さらに、その相手に合わせたパーソナライズされたアプローチ（コールドメール等）までも自動化します。\n\nマッチング成立後は、連携企業とともに輸出・契約面をサポート。テクノロジーによる開拓と、人間によるクロージングの融合で、海外進出の成功率を最大化させます。",
      tags: ["Global Matching Algorithm", "Market Entry", "Africa / Europe"],
      icon: <Plane className="w-8 h-8 text-offblack" />
    }
  ];

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <SectionHeading 
          title="Case Studies" 
          subtitle="Implementation Archive" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((c, i) => (
            <Reveal key={i} delay={i * 100} className="h-full">
               <div 
                 onClick={() => setSelectedCase(i)}
                 className="group cursor-pointer h-full bg-white rounded-[2rem] border border-gray-100 hover:border-accent hover:shadow-xl transition-all duration-500 flex flex-col relative overflow-hidden"
               >
                  {/* Image Section */}
                  <div className="h-64 w-full bg-gray-50 relative overflow-hidden">
                      <GridPattern />
                      <img 
                        src={c.image} 
                        alt={c.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback if case image is missing
                          (e.target as HTMLImageElement).src = i === 0 ? "/assets/service_ai.jpg" : i === 1 ? "/assets/service_lab.png" : "/assets/service_trade.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white/90 text-offblack px-6 py-2 rounded-full font-bold text-sm tracking-widest backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          VIEW DETAILS
                        </span>
                      </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8 md:p-10 flex flex-col flex-grow relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-accent/20 transition-colors duration-300">
                        {c.icon}
                      </div>
                      <span className="font-mono text-sm font-bold text-gray-300 group-hover:text-accent transition-colors duration-300">CASE.{c.id}</span>
                    </div>

                    <div className="mb-6">
                       <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">{c.category}</span>
                       <h3 className="text-3xl font-bold tracking-tight mb-4 text-offblack group-hover:text-accent transition-colors duration-300">{c.title}</h3>
                       <p className="text-gray-600 font-medium leading-relaxed mb-6">{c.desc}</p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                       {c.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-100">
                            {tag}
                          </span>
                       ))}
                    </div>
                  </div>
               </div>
            </Reveal>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedCase !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <div 
              className="fixed inset-0 bg-offblack/80 backdrop-blur-sm animate-in fade-in duration-300" 
              onClick={() => setSelectedCase(null)}
            />
            <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
              <button 
                onClick={() => setSelectedCase(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-offblack/10 hover:bg-offblack text-offblack hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-2/5 relative h-64 md:h-auto bg-gray-100">
                <img 
                  src={cases[selectedCase].image} 
                  className="w-full h-full object-cover" 
                  alt="" 
                  onError={(e) => {
                       (e.target as HTMLImageElement).src = selectedCase === 0 ? "/assets/service_ai.jpg" : selectedCase === 1 ? "/assets/service_lab.png" : selectedCase === 2 ? "/assets/service_trade.png" : "/assets/service_ai.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-offblack/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <span className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-80">{cases[selectedCase].category}</span>
                    <h3 className="text-2xl font-bold leading-tight">{cases[selectedCase].title}</h3>
                  </div>
                </div>
              </div>

              <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-white">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 rounded-2xl bg-accent/5 text-accent">
                      {cases[selectedCase].icon}
                   </div>
                   <div>
                     <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Project ID</span>
                     <span className="block text-lg font-mono font-bold text-offblack">CASE.{cases[selectedCase].id}</span>
                   </div>
                </div>

                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-offblack text-base md:text-lg leading-relaxed whitespace-pre-line font-medium">
                    {cases[selectedCase].detail}
                  </p>
                </div>

                {/* DETAIL IMAGE SECTION */}
                <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                   <img 
                      src={cases[selectedCase].detailImage} 
                      alt="Architecture Diagram" 
                      className="w-full h-auto"
                      onError={(e) => {
                         // Fallback to main image if detail image is interactive diagram replacement not ready
                         (e.target as HTMLImageElement).src = cases[selectedCase].image; 
                         // Or hide it if no image
                         // (e.target as HTMLImageElement).style.display = 'none';
                      }}
                   />
                </div>

                <div className="mt-10 pt-10 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Technologies & Scope</h4>
                  <div className="flex flex-wrap gap-2">
                    {cases[selectedCase].tags.map((tag, idx) => (
                      <span key={idx} className="px-4 py-2 bg-gray-50 text-offblack text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

const MissionView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<ContentKey | null>(null);

  const values = [
    { title: "不易流行 (Fueki Ryuko)", sub: "技術を変え、文化を創る", desc: "技術は時代とともに変わるが、本質は変わらない。私たちはAIという最新の「流行」を追いながらも、その奥にある人々の幸せという「不易」を見失わない。目指すのは、単なる技術の実装ではない。10年、100年と続き、やがて人々の当たり前となる「文化」を創り出すことだ。" },
    { title: "四方よし (Future)", sub: "歴史と社会への愛", desc: "「売り手よし、買い手よし、世間よし」。私たちはそこに「未来よし」を加える。自分と他者、そして社会への愛を持ち、歴史に恥じない商いを行う。1000年後の人類が振り返ったとき、「この技術があってよかった」と感謝される価値だけを世界に届ける。" },
    { title: "志高実行 (Think Big)", sub: "問いと意志", desc: "すべての起点は「なぜ（Why）」という問いと、「なんとしてもやりたい（Will）」という志。評論家になるな。他者を評価する暇があるなら、己の手を動かせ。大きな夢を抱きながら、足元の一歩を積み重ねる者だけが、世界を変える。" },
    { title: "柔軟自在 (Be Agile)", sub: "壁を楽しむ", desc: "世界は広く、変化は速い。内側に閉じこもらず、外に目を向けよ。立ちはだかる壁は、成長のための遊び場だ。日本的な「和」の精神と、グローバルな「個」の強さを融合させ、しなやかに壁を越えていけ。" },
    { title: "一日一生 (Live for Today)", sub: "人生を主役に", desc: "仕事は、あなたの人生を豊かにするための「手段」である。会社のために己を殺すな。自分のために会社を生かせ。今日が最後の一日であるという覚悟（死生観）を持ち、悔いのない「今」を熱く生きろ。" },
  ];

  return (
    <PageTransition>
      <div className="bg-offblack min-h-screen text-white pb-20">
        <div className="px-6 md:px-12 max-w-screen-xl mx-auto pt-10">
          <SectionHeading 
            title="MGC Way" 
            subtitle="The Core Philosophy" 
            dark 
          />

          <Reveal>
            <div className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
               <div>
                 <h3 className="text-3xl md:text-5xl font-bold mb-6 text-accent">AI × Global Trading</h3>
                 <p className="text-xl leading-relaxed text-gray-300">
                   AIを「未来のインフラ」として捉え、<br/>
                   1000年続く人類の豊かさを実装する。
                 </p>
               </div>
               <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                 <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                   <Anchor className="w-6 h-6 text-accent" />
                   Mission
                 </h4>
                 <p className="text-2xl font-bold mb-4">日本の精神で、未来のインフラを創る</p>
                 <p className="text-gray-400 leading-relaxed">
                   技術は変えても、文化と精神性は変えない。AIという最新のテクノロジーを使いながらも、それによって人間が退化（絶滅）するのではなく、むしろ「人間らしさ」が極大化されるような新しい社会システム（インフラ）を創る。
                 </p>
               </div>
            </div>
          </Reveal>

          <div className="space-y-12 mb-32">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group border-t border-gray-800 pt-10 hover:border-accent transition-colors duration-500">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <span className="text-6xl font-bold text-gray-800 group-hover:text-accent transition-colors duration-500">0{i + 1}</span>
                      <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-1">{v.title}</h3>
                      <p className="text-sm font-bold uppercase tracking-widest text-accent">{v.sub}</p>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-lg md:text-xl text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <SectionHeading 
            title="Internal OS" 
            subtitle="MGC Internal Operating System" 
            dark
          />

          <p className="text-gray-400 text-xl mb-12 max-w-3xl">
            MGC inc.を動かす3つの駆動エンジン。これらは単なる事業ドメインではなく、私たちが世界を認識し、ハックするための独自の思考OSである。
          </p>

          {/* Internal OS - System Module Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal>
              <div onClick={() => setSelectedId('product')} className="group cursor-pointer bg-gray-900 border border-gray-800 p-8 rounded-xl hover:border-accent transition-colors duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 rounded bg-gray-800 text-white"><Zap className="w-6 h-6" /></div>
                   <span className="font-mono text-sm text-accent">OS.01</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">Manifest Creativity</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">脳内のビジョンを、直接ソフトウェアへ変換する。技術的な摩擦係数をゼロにする思考法。</p>
                <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                   <span className="text-xs font-mono text-gray-500 uppercase">Input: Vision</span>
                   <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div onClick={() => setSelectedId('marketing')} className="group cursor-pointer bg-gray-900 border border-gray-800 p-8 rounded-xl hover:border-accent transition-colors duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 rounded bg-gray-800 text-white"><Globe className="w-6 h-6" /></div>
                   <span className="font-mono text-sm text-accent">OS.02</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">Global Marketing</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">コンテキストをハックし、文化的な摩擦を「共感」に変える。ナラティブ設計のメソドロジー。</p>
                <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                   <span className="text-xs font-mono text-gray-500 uppercase">Input: Context</span>
                   <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div onClick={() => setSelectedId('trading')} className="group cursor-pointer bg-gray-900 border border-gray-800 p-8 rounded-xl hover:border-accent transition-colors duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 rounded bg-gray-800 text-white"><Layers className="w-6 h-6" /></div>
                   <span className="font-mono text-sm text-accent">OS.03</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">Curated Commerce</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">AIオペレーションで、物理と情報の距離を消し去る。価値の再配置（Arbitrage）システム。</p>
                <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                   <span className="text-xs font-mono text-gray-500 uppercase">Input: Value</span>
                   <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Reveal>
          </div>

        </div>
        <DetailModal id={selectedId} onClose={() => setSelectedId(null)} />
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
    { code: 'TYO', city: 'Kyoto (HQ)', name: 'MGC inc.', role: 'Headquarters', description: '日本の精神性と美意識を、テクノロジーの実装に落とし込む司令塔。すべての戦略とクリエイティブはここから生まれる。', x: 85, y: 40 },
  ];
  
  const [activeCity, setActiveCity] = useState<string | null>(null);

  return (
    <PageTransition>
       <div className="px-6 md:px-12 max-w-screen-xl mx-auto min-h-screen">
        <SectionHeading 
          title="Alliance" 
          subtitle="Global Network Nodes" 
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
                        <div className={`w-4 h-4 rounded-full ${p.code === 'TYO' ? 'bg-accent shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.2)]'} relative z-10 transition-transform duration-300 group-hover:scale-150`}></div>
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

const CompanyView: React.FC = () => {
  const info = [
    { label: 'Company Name', value: 'MGC inc.' },
    { label: 'CEO', value: 'KOKOMU MATSUO' },
    { label: 'Headquarters', value: 'Kyoto, Japan' },
    { label: 'Established', value: '2025' },
    { label: 'Business Domains', value: 'AI Native Product Development\nGlobal Marketing Solution\nCurated Cross-border Trading' },
  ];

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <SectionHeading title="Profile" subtitle="Corporate Overview" />
        <div className="grid grid-cols-1">
          {info.map((item, index) => (
            <Reveal key={index} delay={index * 100}>
                <div className="group flex flex-col md:flex-row py-10 border-b border-gray-200 hover:border-accent transition-colors duration-500">
                  <div className="md:w-1/3 mb-4 md:mb-0">
                      <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-accent transition-colors">{item.label}</span>
                  </div>
                  <div className="md:w-2/3">
                      <p className="text-2xl md:text-3xl font-medium text-offblack whitespace-pre-line leading-relaxed">{item.value}</p>
                  </div>
                </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

const CareerView: React.FC = () => {
  const mindsets = [
    { title: "Will・原動力", req: "「Why」を語れる偏愛家", desc: "内なる衝動や「なぜ」という問いから動ける。", ng: "受動的な優等生", ngDesc: "指示待ち、言われたことしかやらない。" },
    { title: "Grit・突破力", req: "壁を遊具と捉える「冒険心」", desc: "トラブルを面白がれるレジリエンス。", ng: "正解を求める性質", ngDesc: "正解がないと動けない。失敗を極度に恐れる。" },
    { title: "Time・時間感覚", req: "「今日」と「1000年」の複眼思考", desc: "今日死ぬ気で働き、1000年先のロマンを描く。", ng: "目先の数字/夢想のみ", ngDesc: "目先の数字しか見えない、または夢だけで手が動かない。" },
    { title: "Humanity", req: "他者を裁かず、愛を持てる人", desc: "自分・他者・社会・歴史へのリスペクト。", ng: "他責・冷笑的", ngDesc: "他責思考、冷笑的な評論家タイプ。" },
  ];

  const skills = [
    { title: "AI Native", sub: "AIを「同僚」にする力", desc: "AIを拡張ツールとして息をするように使う。", ng: "AIアレルギー (技術への好奇心がない)" },
    { title: "Global", sub: "異文化への敬意と適応力", desc: "異なる価値観の間に入り、滑らかに調整・融合できる。", ng: "語学力のみ/排他的 (中身がない、特定の価値観を押し付ける)" },
    { title: "Concept", sub: "「技術」を「文化」にする構想力", desc: "技術が生活をどう豊かにするか、ストーリーを描ける。", ng: "機能重視 (機能の話しかできない、人間への興味が薄い)" },
  ];

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto text-white">
        <SectionHeading title="Careers" subtitle="Join the Collective." dark />

        {/* Introduction */}
        <Reveal>
          <div className="mb-32 max-w-5xl">
            <h3 className="text-4xl md:text-7xl font-bold tracking-tighter mb-12 text-white leading-[1.1]">
              We don't hire employees. <br/>
              We gather <span className="text-accent underline decoration-4 underline-offset-8">comrades</span>.
            </h3>
            <div className="flex flex-col md:flex-row gap-12 border-l-2 border-accent pl-8 md:pl-12">
                <p className="text-xl text-gray-400 font-medium leading-relaxed md:w-1/2">
                   MGC inc.は、既存の枠組みに収まりきらない「はみ出し者」を求めています。
                   スキルセットよりも、私たちの哲学（MGC Way）に魂レベルで共鳴できるか。
                </p>
                <p className="text-xl text-gray-400 font-medium leading-relaxed md:w-1/2">
                   それが唯一にして最大の採用基準です。
                   <br/>
                   <span className="text-white font-bold mt-4 block">Are you the one?</span>
                </p>
            </div>
          </div>
        </Reveal>

        {/* Mindset Section */}
        <div className="mb-40">
          <SectionHeading title="" subtitle={<span className="flex items-center gap-3 text-2xl font-bold"><Heart className="text-accent w-8 h-8"/> Mindset / Core Requirements</span>} dark />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mindsets.map((m, i) => (
               <Reveal key={i} delay={i * 100} className="h-full">
                 <div className="group relative h-full bg-gray-900 rounded-[2rem] p-8 md:p-12 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 border border-gray-800 overflow-hidden flex flex-col justify-between">
                    
                    {/* Background Pattern appearing on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                        <GridPattern dark />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-end items-start mb-8">
                             <span className="text-6xl font-mono font-bold text-gray-800 group-hover:text-gray-700 transition-colors duration-500">0{i+1}</span>
                        </div>
                        
                        <h4 className="text-3xl font-bold mb-6 tracking-tight text-white group-hover:translate-x-2 transition-transform duration-500">{m.title}</h4>
                        
                        <div className="space-y-6">
                            <div className="relative pl-6 transition-all duration-500 group-hover:pl-8">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-full"></div>
                                <p className="text-lg font-bold text-white mb-2">{m.req}</p>
                                <p className="text-gray-400 leading-relaxed">{m.desc}</p>
                            </div>

                            <div className="relative pl-6 pt-6 border-t border-gray-800 transition-all duration-500 opacity-60 group-hover:opacity-100">
                                <div className="absolute left-0 top-6 bottom-0 w-1 bg-gray-700 rounded-full group-hover:bg-gray-600 transition-colors"></div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Anti-Pattern</p>
                                <p className="text-gray-400 font-medium">NG: {m.ng}</p>
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
          <SectionHeading title="" subtitle={<span className="flex items-center gap-3 text-2xl font-bold"><Zap className="text-accent w-8 h-8"/> Competency / Required Skills</span>} dark />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {skills.map((s, i) => (
                <Reveal key={i} delay={i * 100} className="h-full">
                  <div className="group relative h-full bg-gray-900 text-white rounded-[2rem] p-10 overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors duration-500 flex flex-col">
                     {/* Dynamic Background */}
                     <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                        <GridPattern dark />
                     </div>
                     <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/40 transition-all duration-700"></div>

                     <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-auto">
                            <span className="inline-block px-3 py-1 rounded-full border border-gray-700 text-xs font-mono mb-6 text-gray-400 group-hover:border-accent group-hover:text-accent transition-all duration-500">Skill 0{i+1}</span>
                            <h4 className="text-3xl font-bold tracking-tighter mb-4 group-hover:text-accent transition-colors duration-300">{s.title}</h4>
                            <p className="text-xl font-medium text-white mb-4">{s.sub}</p>
                            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                        </div>

                        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="flex items-start gap-3">
                                <X className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Mismatch</span>
                                    <p className="text-sm text-gray-400">{s.ng}</p>
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

              <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter">Are you ready?</h3>
                <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                   評論家になるな。世界を変えるのは、いつだって手を動かす者だけだ。<br className="hidden md:block"/>
                   あなたの「Why」を聞かせてください。
                </p>
                <button 
                   onClick={() => window.location.hash = 'contact'}
                   className="inline-flex items-center gap-3 bg-white text-accent px-14 py-6 rounded-full text-xl font-bold hover:bg-offblack hover:text-white transition-all duration-300 shadow-lg"
                >
                   Entry Form
                   <ArrowRight className="w-6 h-6" />
                </button>
              </div>
           </div>
        </Reveal>
      </div>
    </PageTransition>
  )
}

const BlogView: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const posts = [
    {
      id: 1,
      date: "2025.10.15",
      category: "AI-Native",
      title: "「声」の再定義：電話業務という\"負の遺産\"を、AIはどう解放するか",
      excerpt: "人間が電話番をする時代の終わり。AIがコンシェルジュとなり、人間は創造的な対話のみに集中する未来。",
      image: "/assets/blog_vision.jpg",
      content: "「電話対応」は、企業の生産性を最も阻害する要因の一つです。理不尽なクレーム、繰り返される同じ質問、取次ぎのためだけの時間。MGC inc.は、この「負の遺産」をAIによって完全に解放します。\n\n最新のVoice AIは、感情を理解し、文脈を読み取り、人間以上のホスピタリティで顧客をもてなします。人間は、AIが解決できない高度な判断や、心を通わせる対話だけに集中する。\n\n私たちが提供するのは、単なる自動応答システムではありません。企業の「声」そのものをアップデートし、ビジネスのスピードを極限まで加速させる、AI時代の新しいコミュニケーション・インフラです。"
    },
    {
      id: 2,
      date: "2025.10.20",
      category: "Philosophy",
      title: "Tech × Art × Soul：次世代プロダクト開発における「三位一体」の哲学",
      excerpt: "機能競争の終焉。技術に美意識と魂を宿らせ、マーケティング自体を不要にするほどの引力を持つ。",
      image: "/assets/blog_philosophy.jpg",
      content: "「機能」だけで差別化できる時代は終わりました。これからのプロダクトに必要なのは、Tech（技術）、Art（美意識）、そしてSoul（魂）の三位一体です。\n\n技術はあくまで表現の筆であり、そこにどんな絵を描くか（Art）、そしてなぜ描くのか（Soul）がなければ、人の心は動きません。スペックの高さではなく、手にした瞬間の「高揚感」をデザインする。\n\nMGC inc.は、多額の広告費で無理やり売るマーケティングを否定します。プロダクトそのものが発する圧倒的な美しさとストーリー（引力）で、世界中のユーザーを自然と惹きつける。それが私たちの流儀です。"
    },
    {
      id: 3,
      date: "2025.11.01",
      category: "Strategy",
      title: "日本という枠を、最初から捨てる：Day1 Global戦略の必然性",
      excerpt: "「まずは国内」という思考停止が死を招く理由。MGCが京都にいながらシリコンバレーと同じ目線で世界を見る理由。",
      image: "/assets/blog_strategy.jpg",
      content: "「まずは日本で成功してから海外へ」——その順序思考こそが、日本のスタートアップをガラパゴス化させてきました。インターネットに国境がない以上、最初から世界市場（Day1 Global）を狙わない手はありません。\n\n言語の壁はAIが溶かしました。物流の壁はDXが低くしました。今、京都にいながらにして、ロンドンやニューヨークの顧客と直接取引できない理由は何一つありません。\n\nMGC inc.は、日本の繊細な感性と精神性を最大の武器に、最初から世界80億人をターゲットにします。日本市場はその中の一部に過ぎません。ローカルに根を張り、グローバルに花を咲かせる。これが私たちの生存戦略であり、これからの日本企業があるべき姿です。"
    },
    {
      id: 4,
      date: "2025.11.15",
      category: "Methodology",
      title: "眠れる巨人を、AIで叩き起こす：日本発グローバル展開の新解",
      excerpt: "日本の技術・資産を世界へ届けるために必要なのは、商社でもコンサルでもなく、「AIネイティブなオペレーション」への完全移行である。",
      image: "/assets/blog_methodology.jpg",
      content: "日本には、世界を驚かせる技術や伝統資産が山のように眠っています。しかし、「良いものを作れば売れる」という昭和の神話はとっくに崩壊しました。必要なのは、世界市場への最適化と接続です。\n\n従来、これを担っていた商社やコンサルの役割を、MGC inc.はAIによって解体・再構築します。\n\n1. **全方位スキャンによる最適地選定**\n人間には不可能な規模で世界中の市場データやトレンドをクロールし、「どの国の、どの企業の、どんな課題に」その技術が刺さるのか、AIがピンポイントで特定します。\n\n2. **現地特化型マリアージュ**\n単なる翻訳ではありません。現地の文化コード、商習慣、美的感覚に合わせて、製品の文脈（コンテキスト）自体をAIが生成し直します。日本の文脈のまま押し付けるのではなく、現地に「刺さる」形へと変容させるのです。\n\n3. **ゼロから組み直したAIオペレーション**\nリード獲得から商談設定、契約までのプロセスを、AIエージェントが自律的に遂行します。時差も言語も関係ありません。人間が寝ている間も、AIは地球の裏側でトップセールスを行い続けます。\n\nこの「劇的によいもの」に生まれ変わったオペレーションこそが、日本の眠れる資産を世界へ届けるための最短ルートなのです。"
    }
  ];

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto py-20">
        <SectionHeading title="Journal" subtitle="Thoughts & Vision" dark />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 100}>
              <div 
                onClick={() => setSelectedPost(i)}
                className="group cursor-pointer bg-gray-900/50 rounded-[2.5rem] border border-gray-800 p-2 hover:border-accent/40 transition-all duration-700 hover:shadow-2xl flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={post.title} />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-accent/90 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                    {post.category}
                  </div>
                </div>
                
                <div className="px-6 pb-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-xs mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tighter text-white mb-4 leading-tight group-hover:text-accent transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-accent font-bold text-sm tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Post Detail Modal */}
        {selectedPost !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-y-auto">
            <div 
              className="fixed inset-0 bg-offblack/95 backdrop-blur-2xl animate-in fade-in duration-500" 
              onClick={() => setSelectedPost(null)}
            />
            <div className="relative w-full max-w-4xl bg-gray-900 rounded-[3rem] border border-gray-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500 flex flex-col md:flex-row max-h-[90vh]">
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-accent text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img src={posts[selectedPost].image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:hidden" />
              </div>
              
              <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-8">
                  <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold tracking-widest uppercase rounded-full border border-accent/30">
                    {posts[selectedPost].category}
                  </span>
                  <span className="text-gray-500 font-mono text-xs">{posts[selectedPost].date}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-8 leading-tight">
                  {posts[selectedPost].title}
                </h2>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed font-medium mb-8 italic border-l-4 border-accent pl-6">
                    {posts[selectedPost].excerpt}
                  </p>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line text-base">
                    {posts[selectedPost].content}
                  </p>
                </div>

                <div className="mt-12 pt-12 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="block text-white font-bold text-sm">Editorial Team</span>
                      <span className="block text-gray-500 text-xs tracking-wide">MGC Journal</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

const ContactView: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [emailError, setEmailError] = useState('');
  const [isSent, setIsSent] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formState.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    // Updated to call real backend endpoint
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSent(true);
      setFormState({ name: '', email: '', message: '' });
      
      // Keep feedback visible for a few seconds
      setTimeout(() => setIsSent(false), 5000);
    } catch (error) {
      console.error('Contact error:', error);
      alert('Sorry, there was an error sending your message. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
    if (id === 'email') setEmailError('');
  };

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/2">
            <SectionHeading title="Contact" subtitle="Let's Collaborate." />
            <Reveal delay={200}>
              <div className="mt-[-2rem]">
                <p className="text-xl text-gray-500 mb-6">
                  Have an idea? Let's build the future together. <br />
                  まずはあなたのビジョンをお聞かせください。
                </p>
              </div>
            </Reveal>
          </div>
          <div className="md:w-1/2 pt-8 md:pt-32">
            <Reveal delay={200}>
              <form className="space-y-12" onSubmit={handleSubmit}>
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-accent transition-colors">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-200 py-4 text-2xl font-medium bg-transparent focus:outline-none focus:border-accent transition-colors placeholder-gray-200" 
                    placeholder="Your Name" 
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className={`block text-sm font-bold uppercase tracking-widest mb-2 transition-colors ${emailError ? 'text-red-500' : 'text-gray-400 group-focus-within:text-accent'}`}>Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formState.email}
                    onChange={handleChange}
                    className={`w-full border-b-2 py-4 text-2xl font-medium bg-transparent focus:outline-none transition-colors placeholder-gray-200 ${emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-accent'}`} 
                    placeholder="your.email@example.com" 
                  />
                  {emailError && <p className="text-red-500 text-sm mt-2 font-medium animate-[fadeIn_0.3s_ease-out]">{emailError}</p>}
                </div>
                <div className="group">
                  <label htmlFor="message" className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-accent transition-colors">Message</label>
                  <textarea 
                    id="message" 
                    rows={3} 
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-200 py-4 text-2xl font-medium bg-transparent focus:outline-none focus:border-accent transition-colors placeholder-gray-200 resize-none" 
                    placeholder="Tell us about your project"
                  ></textarea>
                </div>
                <div className="pt-8">
                  <button type="submit" className="group flex items-center gap-4 text-2xl font-bold tracking-tight hover:text-accent transition-colors" disabled={isSent}>
                    {isSent ? 'Message Sent' : 'Send Message'}
                    <span className={`rounded-full p-3 transition-colors duration-300 ${isSent ? 'bg-accent text-white' : 'bg-offblack text-white group-hover:bg-accent'}`}>
                      {isSent ? <Check className="w-6 h-6" /> : <Send className="w-6 h-6" />}
                    </span>
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const App: React.FC = () => {
  // Helper to parse view from hash
  const getViewFromHash = (): ViewState => {
    const hash = window.location.hash.slice(1);
    const validViews: ViewState[] = ['home', 'works', 'cases', 'mission', 'partners', 'company', 'career', 'contact', 'blog']; // Added 'blog'
    return validViews.includes(hash as ViewState) ? (hash as ViewState) : 'home';
  };

  const [view, setView] = useState<ViewState>(getViewFromHash());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Listen for hash changes to handle browser back/forward and direct URL access
  useEffect(() => {
    const handleHashChange = () => {
      const newView = getViewFromHash();
      setView(newView);
      window.scrollTo(0, 0); // Reset scroll on view change
      setIsMenuOpen(false);  // Close mobile menu on nav
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Initial scroll reset if hash exists
    if (window.location.hash) {
       window.scrollTo(0, 0);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (id: ViewState) => {
    window.location.hash = id;
  };

  const navItems: { id: ViewState; label: string }[] = [
    { id: 'works', label: 'Works' },
    { id: 'cases', label: 'Cases' },
    { id: 'blog', label: 'Journal' },
    { id: 'mission', label: 'Mission' },
    // { id: 'partners', label: 'Partners' }, // Hidden
    { id: 'company', label: 'Company' },
    { id: 'career', label: 'Careers' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${view === 'mission' || view === 'career' || view === 'works' || view === 'blog' ? 'bg-offblack text-white' : 'bg-offwhite text-offblack'}`}>
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full py-6 px-6 md:px-12 z-50 flex justify-between items-center mix-blend-difference text-white">
        <button 
          onClick={() => navigate('home')}
          className="flex items-center gap-4 group z-50 relative"
        >
          <div className="w-16 h-10 bg-white flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-180">
            <div className="w-5 h-5 bg-black rounded-full" />
          </div>
          <span className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity">MGC Inc.</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`relative py-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center ${view === item.id ? 'opacity-100 font-bold scale-110' : 'opacity-60 hover:opacity-100 font-medium scale-100'}`}
            >
              {item.label}
               <span className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${view === item.id ? 'w-full' : 'w-0'}`} />
            </button>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 p-2 hover:opacity-70 transition-opacity"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <nav className="flex flex-col items-center gap-8">
           {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="text-4xl font-bold tracking-tighter text-offblack hover:text-accent transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main>
        {view === 'home' && <HomeView />}
        {view === 'works' && <WorksView />}
        {view === 'cases' && <CasesView />}
        {view === 'blog' && <BlogView />}
        {view === 'mission' && <MissionView />}
        {/* PartnersView is hidden */}
        {view === 'company' && <CompanyView />}
        {view === 'career' && <CareerView />}
        {view === 'contact' && <ContactView />}
      </main>

      {/* Footer (Simple) */}
      <footer className={`px-6 md:px-12 py-8 text-center text-sm font-medium opacity-50 ${view === 'mission' || view === 'career' || view === 'works' ? 'text-gray-500' : 'text-gray-400'}`}>
        &copy; 2025 MGC inc. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;