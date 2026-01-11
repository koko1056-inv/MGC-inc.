import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { ArrowRight, Globe, Zap, Layers, ArrowUpRight, X, Palette, Send, Network, Menu, Plus, Anchor, Check, Heart, MapPin, Cpu, Mic, MessageSquare, Briefcase, Plane, Sparkles, Mail, Calendar, User } from 'lucide-react';

import { translations, Lang } from './translations';
export const LanguageContext = React.createContext<{ lang: Lang; setLang: (l: Lang) => void; t: typeof translations['ja'] }>({
  lang: 'ja',
  setLang: () => {},
  t: translations['ja']
});
export const useLanguage = () => React.useContext(LanguageContext);
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
  const { t } = useLanguage();
  const contentData = getContentData(t);
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

const HomeView: React.FC<{ onNavigate?: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();
  return (
  <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden pt-40 pb-20">
    <div className="max-w-screen-xl w-full mx-auto">
      <Reveal>
        <h1 className="text-[12vw] md:text-[10vw] leading-[0.9] font-bold tracking-tighter text-offblack mb-12">
          {t.hero.title_1} <br />
          <span className="text-accent transition-colors duration-500">{t.hero.title_2}</span> {t.hero.title_3}
        </h1>
      </Reveal>
      
      <Reveal delay={200}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-gray-200 pt-8 mt-8">
          <p className="text-lg md:text-xl text-gray-600 max-w-md font-medium leading-relaxed whitespace-pre-line">
            {t.hero.desc}
          </p>
          <div className="mt-8 md:mt-0">
            <button 
              onClick={() => {
                if (onNavigate) onNavigate('cases');
                else window.location.hash = 'cases';
              }} 
              className="group flex items-center gap-2 text-offblack font-bold text-lg tracking-tight border-b-2 border-offblack pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              {t.hero.viewProjects} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
  );
};

const WorksView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<ContentKey | null>(null);
  const { t } = useLanguage();
  const contentData = getContentData(t);

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <SectionHeading 
          title={t.headings.works.title}
          subtitle={t.headings.works.sub}
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
                <h3 className="text-4xl font-bold tracking-tighter mb-4 whitespace-pre-line">{t.works.service_ai.title.replace(' ', '\n')}</h3>
                <p className="text-gray-200 text-base leading-relaxed font-medium">
                  {t.works.service_ai.subtitle}
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
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 whitespace-pre-line">{t.works.service_lab.title.replace(' ', '\n')}</h3>
                <p className="text-gray-200 text-lg font-medium leading-relaxed max-w-md">
                   {t.works.service_lab.subtitle}<br/>
                   {t.works.service_lab.desc}
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
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 whitespace-pre-line">{t.works.service_trade.title.replace(' ', '\n')}</h3>
                <p className="text-gray-200 text-lg font-medium leading-relaxed max-w-xl">
                  {t.works.service_trade.subtitle}<br/>
                  {t.works.service_trade.desc}
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
  const { t } = useLanguage();

  const staticCaseData = [
    {
       image: "/assets/case01.png",
       detailImage: "/assets/case01_detail.jpg",
       icon: <Mic className="w-8 h-8 text-offblack" />
    },
    {
       image: "/assets/case02.png",
       detailImage: "/assets/case02_chatbot_ui.jpg",
       icon: <MessageSquare className="w-8 h-8 text-offblack" />
    },
    {
       image: "/assets/case03.png",
       detailImage: "/assets/case03_workflow.jpg",
       icon: <Briefcase className="w-8 h-8 text-offblack" />
    },
    {
       image: "/assets/case04_final.jpg",
       detailImage: "/assets/case04_final.jpg",
       icon: <Plane className="w-8 h-8 text-offblack" />
    }
  ];

  const cases = t.cases.map((c, i) => ({
    ...c,
    ...staticCaseData[i]
  }));

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <SectionHeading 
          title={t.headings.cases.title}
          subtitle={t.headings.cases.sub}
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
  const { t } = useLanguage();
  const contentData = getContentData(t);
  const values = t.mission.values;
  return (
    <PageTransition>
      <div className="bg-offblack min-h-screen text-white pb-20">
        <div className="px-6 md:px-12 max-w-screen-xl mx-auto pt-10">
          <SectionHeading 
            title={t.headings.mission.title}
            subtitle={t.headings.mission.sub}
            dark 
          />

          <Reveal>
            <div className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
               <div>
                 <h3 className="text-3xl md:text-5xl font-bold mb-6 text-accent">{t.mission.intro.title}</h3>
                 <p className="text-xl leading-relaxed text-gray-300">
                   {t.mission.intro.desc}
                 </p>
               </div>
               <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                 <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                   <Anchor className="w-6 h-6 text-accent" />
                   Mission
                 </h4>
                 <p className="text-2xl font-bold mb-4">{t.mission.intro.mission_title}</p>
                 <p className="text-gray-400 leading-relaxed">
                   {t.mission.intro.mission_desc}
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
            title={t.headings.internalOS.title} 
            subtitle={t.headings.internalOS.sub} 
            dark
          />

          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-16 text-center">
            {t.mission.internal_os.lead}
          </p>

          {/* Internal OS - System Module Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal>
              <div onClick={() => setSelectedId('product')} className="group cursor-pointer bg-gray-900 border border-gray-800 p-8 rounded-xl hover:border-accent transition-colors duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 rounded bg-gray-800 text-white"><Zap className="w-6 h-6" /></div>
                   <span className="font-mono text-sm text-accent">OS.01</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{t.mission.internal_os.os1.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{t.mission.internal_os.os1.desc}</p>
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
                <h4 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{t.mission.internal_os.os2.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{t.mission.internal_os.os2.desc}</p>
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
                <h4 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{t.mission.internal_os.os3.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{t.mission.internal_os.os3.desc}</p>
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
  const { t } = useLanguage();
  const info = t.company.items;

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto">
        <SectionHeading title={t.headings.company.title} subtitle={t.headings.company.sub} />
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
  const { t } = useLanguage();
  const mindsets = t.career.mindsets;

  const skills = t.career.skills;

  return (
    <PageTransition>
      <div className="px-6 md:px-12 max-w-screen-xl mx-auto text-white">
        <SectionHeading title={t.headings.career.title} subtitle={t.headings.career.sub} dark />

        {/* Introduction */}
        <Reveal>
          <div className="mb-32 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                <p className="text-2xl md:text-4xl font-light leading-snug">
                   {t.career.intro.desc}
                   <br/>
                   <span className="text-white font-bold mt-4 block">{t.career.intro.call}</span>
                </p>
            </div>
          </div>
        </Reveal>

        {/* Mindset Section */}
        <div className="mb-40">
          <SectionHeading title="" subtitle={<span className="flex items-center gap-3 text-2xl font-bold"><Heart className="text-accent w-8 h-8"/> {t.career.subheadings.mindset}</span>} dark />
          
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
          <SectionHeading title="" subtitle={<span className="flex items-center gap-3 text-2xl font-bold"><Zap className="text-accent w-8 h-8"/> {t.career.subheadings.skills}</span>} dark />

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
              {/* Added decorative logic */}
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter">{t.career.cta.title}</h3>
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

const BlogView: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const { t } = useLanguage();

  const staticImages = [
     "/assets/blog_vision.jpg",
     "/assets/blog_philosophy.jpg",
     "/assets/blog_strategy.jpg",
     "/assets/blog_methodology.jpg"
  ];
  
  const posts = t.blog.items.map((item, i) => ({
    ...item,
    image: staticImages[i] || staticImages[0]
  }));

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
  const { t } = useLanguage();
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

const getContentData = (t: typeof translations['ja']) => ({
  service_ai: {
    ...t.details.service_ai,
    theme: 'dark' as const,
    number: "01",
    icon: <Globe className="w-6 h-6 text-white stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-12 whitespace-pre-line text-gray-300">
          {t.details.service_ai.p1}
        </p>
        <div className="space-y-12">
          {t.details.service_ai.features.map((f, i) => (
             <div key={i} className="border-t border-gray-800 pt-8">
               <div className="flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/3">
                   <span className="text-accent font-bold tracking-widest text-sm mb-2 block">0{i+1}</span>
                   <h4 className="text-2xl font-bold">{f.title}<br/><span className="text-base text-gray-400 font-normal">{f.sub}</span></h4>
                 </div>
                 <div className="md:w-2/3">
                   <p className="text-gray-400 text-lg leading-relaxed">{f.text}</p>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </>
    )
  },
  service_lab: {
    ...t.details.service_lab,
    theme: 'dark' as const,
    number: "02",
    icon: <Zap className="w-6 h-6 text-white stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-12 whitespace-pre-line text-gray-300">
          {t.details.service_lab.p1}
        </p>
        <div className="space-y-12">
          {t.details.service_lab.features.map((f, i) => (
             <div key={i} className="border-t border-gray-800 pt-8">
               <div className="flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/3">
                   <span className="text-accent font-bold tracking-widest text-sm mb-2 block">0{i+1}</span>
                   <h4 className="text-2xl font-bold">{f.title}<br/><span className="text-base text-gray-400 font-normal">{f.sub}</span></h4>
                 </div>
                 <div className="md:w-2/3">
                   <p className="text-gray-400 text-lg leading-relaxed">{f.text}</p>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </>
    )
  },
  service_trade: {
    ...t.details.service_trade,
    theme: 'light' as const,
    number: "03",
    icon: <Layers className="w-6 h-6 text-offblack stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-12 whitespace-pre-line">
          {t.details.service_trade.p1}
        </p>
        <div className="space-y-12">
          {t.details.service_trade.features.map((f, i) => (
             <div key={i} className="border-t border-gray-200 pt-8">
               <div className="flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/3">
                   <span className="text-accent font-bold tracking-widest text-sm mb-2 block">0{i+1}</span>
                   <h4 className="text-2xl font-bold">{f.title}<br/><span className="text-base text-gray-400 font-normal">{f.sub}</span></h4>
                 </div>
                 <div className="md:w-2/3">
                   <p className="text-gray-600 text-lg leading-relaxed">{f.text}</p>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </>
    )
  },
  product: {
    ...t.details.product,
    theme: 'light' as const,
    number: "OS.01",
    icon: <Zap className="w-6 h-6 text-offblack stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-8">{t.details.product.p1}</p>
        <div className="space-y-6 text-gray-600 text-lg leading-relaxed"><p>{t.details.product.text}</p></div>
      </>
    )
  },
  marketing: {
    ...t.details.marketing,
    theme: 'dark' as const,
    number: "OS.02",
    icon: <Globe className="w-6 h-6 text-white stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-8 text-gray-300">{t.details.marketing.p1}</p>
        <div className="space-y-6 text-gray-400 text-lg leading-relaxed"><p>{t.details.marketing.text}</p></div>
      </>
    )
  },
  trading: {
    ...t.details.trading,
    theme: 'light' as const,
    number: "OS.03",
    icon: <Layers className="w-6 h-6 text-offblack stroke-[1.5]" />,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-8">{t.details.trading.p1}</p>
        <div className="space-y-6 text-gray-600 text-lg leading-relaxed"><p>{t.details.trading.text}</p></div>
      </>
    )
  },
  vision: {
    ...t.details.vision,
    theme: 'gray' as const,
    details: (
      <>
        <p className="text-xl md:text-3xl font-light leading-relaxed mb-8">{t.details.vision.p1}</p>
        <div className="space-y-6 text-gray-600 text-lg leading-relaxed"><p>{t.details.vision.text}</p></div>
      </>
    )
  }
});

const App: React.FC = () => {
  // Helper to parse view from hash
  const getViewFromHash = (): ViewState => {
    const hash = window.location.hash.slice(1);
    const validViews: ViewState[] = ['home', 'works', 'cases', 'mission', 'partners', 'company', 'career', 'contact', 'blog']; // Added 'blog'
    return validViews.includes(hash as ViewState) ? (hash as ViewState) : 'home';
  };

  const [view, setView] = useState<ViewState>(getViewFromHash());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];

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

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const navigate = (id: ViewState) => {
    window.location.hash = id;
  };

  const navItems: { id: ViewState; label: string }[] = [
    { id: 'works', label: t.nav.works },
    { id: 'cases', label: t.nav.cases },
    { id: 'blog', label: t.nav.blog },
    { id: 'mission', label: t.nav.mission },
    // { id: 'partners', label: 'Partners' }, // Hidden
    { id: 'company', label: t.nav.company },
    { id: 'career', label: t.nav.career },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
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
        <div className="flex items-center gap-4">
             {/* Language Switcher (Desktop/Mobile) */}
             <button
               onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
               className="font-mono text-sm font-bold border border-white/30 rounded-full flex overflow-hidden backdrop-blur-md z-50 hover:border-white/50 transition-colors"
             >
               <span className={`px-3 py-1 transition-colors ${lang === 'ja' ? 'bg-white text-offblack' : 'text-white/60 hover:text-white'}`}>JP</span>
               <span className={`px-3 py-1 transition-colors ${lang === 'en' ? 'bg-white text-offblack' : 'text-white/60 hover:text-white'}`}>EN</span>
             </button>

             <button 
               className="md:hidden z-50 p-2 hover:opacity-70 transition-opacity"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
        </div>
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

      <footer className={`px-6 md:px-12 py-8 text-center text-sm font-medium opacity-50 ${view === 'mission' || view === 'career' || view === 'works' ? 'text-gray-500' : 'text-gray-400'}`}>
        &copy; 2025 MGC inc. All Rights Reserved.
      </footer>
    </div>
    </LanguageContext.Provider>
  );
};


export default App;