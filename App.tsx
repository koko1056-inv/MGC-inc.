import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { ArrowRight, Globe, Zap, Layers, ArrowUpRight, X, Send, Menu, Anchor, Check, Heart, MapPin, Calendar, User, Brain, Network, MessageCircle, Sparkles } from 'lucide-react';

import { translations, Lang } from './translations';
export const LanguageContext = React.createContext<{ lang: Lang; setLang: (l: Lang) => void; t: typeof translations['ja'] }>({
  lang: 'ja',
  setLang: () => {},
  t: translations['ja']
});
export const useLanguage = () => React.useContext(LanguageContext);
// --- Types & Interfaces ---

type ViewState = 'home' | 'works' | 'mission' | 'partners' | 'company' | 'career' | 'contact' | 'blog';

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

// --- Feature Components (Pages) ---

const HomeView: React.FC<{ onNavigate?: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const goTo = (id: ViewState) => {
    if (onNavigate) onNavigate(id);
    else window.location.hash = id;
  };

  const services = [
    { icon: <Globe className="w-6 h-6" />, title: t.works.service_ai.title, subtitle: t.works.service_ai.subtitle },
    { icon: <Zap className="w-6 h-6" />, title: t.works.service_lab.title, subtitle: t.works.service_lab.subtitle },
    { icon: <Layers className="w-6 h-6" />, title: t.works.service_trade.title, subtitle: t.works.service_trade.subtitle },
  ];

  return (
  <>
  <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden pt-40 pb-20">
    <div className="max-w-screen-xl w-full mx-auto">
      {/* Eyebrow: What we do */}
      <Reveal>
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.3em] text-accent">
            {t.hero.whatWeDo}
          </span>
        </div>
      </Reveal>

      <Reveal delay={50}>
        <h1 className="text-[12vw] md:text-[10vw] leading-[0.9] font-bold tracking-tighter text-offblack mb-10">
          {t.hero.title_1} <br />
          <span className="text-accent transition-colors duration-500">{t.hero.title_2}</span> {t.hero.title_3}
        </h1>
      </Reveal>

      {/* Service chips — "what we do" at a glance */}
      <Reveal delay={150}>
        <div className="flex flex-wrap gap-2 md:gap-3 mb-10">
          {t.hero.chips.map((chip, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2 bg-offblack text-white rounded-full text-xs md:text-sm font-bold tracking-tight"
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
              {chip}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={250}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-gray-200 pt-8 mt-8 gap-6">
          <p className="text-lg md:text-xl text-gray-600 max-w-xl font-medium leading-relaxed whitespace-pre-line">
            {t.hero.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              onClick={() => goTo('contact')}
              className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-accent text-white rounded-full font-bold text-base tracking-tight hover:bg-offblack transition-all shadow-lg shadow-accent/20 whitespace-nowrap"
            >
              {t.hero.bookConsult}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => goTo('works')}
              className="group inline-flex items-center justify-center gap-2 text-offblack font-bold text-sm tracking-tight border-b-2 border-offblack pb-1 hover:text-accent hover:border-accent transition-colors whitespace-nowrap"
            >
              {t.hero.viewProjects}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  </section>

  {/* === Service Index (under hero) === */}
  <div className="px-6 md:px-12 pb-24 max-w-screen-xl mx-auto w-full">
    <Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-200 rounded-[2rem] overflow-hidden">
        {services.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo('works')}
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
          </button>
        ))}
      </div>
    </Reveal>
  </div>

  {/* === Why MGC Section === */}
  <section className="bg-offblack text-white py-24 md:py-32 px-6 md:px-12">
    <div className="max-w-screen-xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">
            {t.whyMgc.eyebrow}
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[0.95]">
          {t.whyMgc.title}
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed mb-16 font-medium">
          {t.whyMgc.lead}
        </p>
      </Reveal>

      {/* 3 Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {t.whyMgc.reasons.map((r, i) => (
          <Reveal key={r.number} delay={i * 100} className="h-full">
            <div className="group h-full bg-gray-900/60 rounded-2xl p-8 border border-gray-800 hover:border-accent transition-colors duration-500 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-2xl font-bold text-accent">{r.number}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight leading-snug">
                {r.title}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">{r.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Stats Strip */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800 border border-gray-800 rounded-2xl overflow-hidden">
          {t.whyMgc.stats.map((s, i) => (
            <div key={i} className="bg-offblack p-8 md:p-10 flex flex-col items-start">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-none">{s.value}</span>
                <span className="text-xl md:text-2xl font-bold text-accent">{s.unit}</span>
              </div>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed mt-3">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>

  {/* === Home CTA Section === */}
  <section className="px-6 md:px-12 py-24 md:py-32">
    <div className="max-w-screen-xl mx-auto">
      <Reveal>
        <div className="relative bg-gradient-to-br from-accent via-blue-600 to-blue-700 rounded-[2.5rem] p-12 md:p-20 overflow-hidden">
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
              <button
                onClick={() => goTo('contact')}
                className="group inline-flex items-center gap-3 px-7 py-4 bg-white text-offblack rounded-full font-bold tracking-tight hover:bg-offwhite transition-colors whitespace-nowrap shadow-xl"
              >
                {t.homeCTA.primary}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => goTo('works')}
                className="group inline-flex items-center gap-2 text-white font-bold text-sm tracking-tight border-b-2 border-white/40 pb-1 hover:border-white transition-colors whitespace-nowrap"
              >
                {t.homeCTA.secondary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
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
  index: '01' | '02' | '03';
  serviceKey: 'service_ai' | 'service_lab' | 'service_trade';
  icon: ReactNode;
  hasFlagship?: boolean;
  badge?: string;
  onDetail: () => void;
}> = ({ index, serviceKey, icon, hasFlagship, badge, onDetail }) => {
  const { t } = useLanguage();
  const data = t.works[serviceKey];
  return (
    <Reveal>
      <section className="border-t border-gray-800 pt-16 md:pt-20 pb-4">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          {/* Left column: index + headline */}
          <div className="md:col-span-5 lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                SERVICE / {index}
              </span>
              {badge && (
                <span className="px-2.5 py-1 bg-accent/10 border border-accent/30 rounded-full text-[10px] font-bold tracking-wider text-accent uppercase">
                  {badge}
                </span>
              )}
            </div>
            <div className="text-[7rem] md:text-[9rem] font-bold text-gray-800/60 leading-[0.85] mb-8 select-none tracking-tighter">
              {index}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
                {icon}
              </div>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-[1.1]">
              {data.title}
            </h3>
            <p className="text-lg md:text-xl text-accent font-bold leading-snug">
              {data.subtitle}
            </p>
          </div>
          {/* Right column: description + features */}
          <div className="md:col-span-7 lg:col-span-7 md:pl-6 md:border-l md:border-gray-900">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 font-normal">
              {data.desc}
            </p>
            <div className="space-y-6 mb-8">
              {data.items.map((item, i) => (
                <div key={i} className="group flex gap-4 md:gap-6 pb-6 border-b border-gray-900 last:border-b-0">
                  <div className="flex-shrink-0">
                    <span className="font-mono text-xs font-bold text-accent">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-1 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-accent/80 mb-2">
                      {item.sub}
                    </p>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onDetail}
                className="group inline-flex items-center gap-3 text-white font-bold text-sm tracking-tight border-b-2 border-white/30 pb-1 hover:border-accent hover:text-accent transition-colors"
              >
                {t.worksIntro.detailLink}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {hasFlagship && (
                <a
                  href="#aide-section"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('aide-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-accent text-xs font-bold tracking-tight hover:bg-accent hover:text-white transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.worksIntro.flagshipAnchor}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
};

const WorksView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<ContentKey | null>(null);
  const { t } = useLanguage();
  const contentData = getContentData(t);

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
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.9] mb-8">
              {t.headings.works.title}
              <span className="block text-accent">{t.headings.works.sub}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl font-medium">
              {t.worksIntro.lead}
            </p>
          </div>
        </Reveal>

        {/* === Index Strip === */}
        <Reveal delay={150}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20 md:mb-32 pt-8 border-t border-gray-800">
            <div className="md:col-span-1 col-span-2 flex items-center mb-2 md:mb-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-500">
                {t.worksIntro.indexLabel}
              </span>
            </div>
            {(['service_ai', 'service_lab', 'service_trade'] as const).map((key, i) => (
              <a
                key={key}
                href={`#service-0${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`service-0${i + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group flex items-center gap-3 p-4 rounded-xl border border-gray-800 hover:border-accent transition-colors"
              >
                <span className="font-mono text-xs text-accent font-bold">
                  0{i + 1}
                </span>
                <span className="text-sm font-bold text-white group-hover:text-accent transition-colors leading-snug">
                  {t.works[key].title}
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        {/* === Service Blocks (vertical, uniform) === */}
        <div id="service-01" className="scroll-mt-24">
          <ServiceBlock
            index="01"
            serviceKey="service_ai"
            icon={<Globe className="w-5 h-5 text-accent stroke-[1.75]" />}
            hasFlagship
            badge="Flagship: AIDE"
            onDetail={() => setSelectedId('service_ai')}
          />
        </div>

        <div id="service-02" className="scroll-mt-24 mt-24 md:mt-32">
          <ServiceBlock
            index="02"
            serviceKey="service_lab"
            icon={<Zap className="w-5 h-5 text-accent stroke-[1.75]" />}
            badge="Performance-Based"
            onDetail={() => setSelectedId('service_lab')}
          />
        </div>

        <div id="service-03" className="scroll-mt-24 mt-24 md:mt-32">
          <ServiceBlock
            index="03"
            serviceKey="service_trade"
            icon={<Layers className="w-5 h-5 text-accent stroke-[1.75]" />}
            onDetail={() => setSelectedId('service_trade')}
          />
        </div>

        {/* === Flagship Product: AIDE === */}
        <div id="aide-section" className="scroll-mt-24 mt-32 md:mt-40">
          <Reveal>
            <div className="border-t-2 border-accent pt-16 mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-accent">{t.aide.badge}</span>
                <span className="font-mono text-xs text-gray-500">{t.aide.number}</span>
                <span className="px-2 py-0.5 bg-accent/10 border border-accent/30 rounded-full text-[10px] font-mono font-bold tracking-wider text-accent">
                  ← SERVICE 01
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-10">
                <div>
                  <h2 className="text-7xl md:text-[9rem] font-bold tracking-tighter text-white mb-4 leading-none">
                    {t.aide.title}
                  </h2>
                  <p className="text-2xl md:text-3xl font-bold text-accent tracking-tight">{t.aide.tagline}</p>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed max-w-md font-medium">
                  {t.aide.subtitle}
                </p>
              </div>
              <p className="text-gray-400 max-w-3xl leading-relaxed mb-4 text-base">
                {t.aide.lead}
              </p>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-8">
                {t.aide.pillarsTitle}
              </p>
            </div>
          </Reveal>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {t.aide.pillars.map((p, i) => {
              const icons = [
                <Brain className="w-6 h-6 text-accent stroke-[1.5]" />,
                <Network className="w-6 h-6 text-accent stroke-[1.5]" />,
                <Zap className="w-6 h-6 text-accent stroke-[1.5]" />,
                <MessageCircle className="w-6 h-6 text-accent stroke-[1.5]" />
              ];
              return (
                <Reveal key={p.id} delay={i * 100} className="h-full">
                  <div className="group h-full bg-gray-900/70 rounded-2xl p-7 border border-gray-800 hover:border-accent hover:bg-gray-900 transition-all duration-500 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
                        {icons[i]}
                      </div>
                      <span className="text-accent font-mono text-sm font-bold">{p.id}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{p.title}</h3>
                    <p className="text-xs text-accent font-mono uppercase tracking-widest mb-5">{p.sub}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* 4-Step Flow */}
          <Reveal>
            <div className="border-t border-gray-800 pt-12 mb-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">{t.aide.flowTitle}</h3>
                <p className="text-gray-400 leading-relaxed max-w-md font-medium">{t.aide.flowLead}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {t.aide.flow.map((s, i) => (
                  <div key={s.step} className="relative bg-gray-900/40 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">STEP {s.step}</span>
                    <h4 className="text-xl font-bold text-white mt-3 mb-2 tracking-tight">{s.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    {i < t.aide.flow.length - 1 && (
                      <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 text-gray-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* AIDE CTA */}
          <Reveal>
            <div className="relative bg-gradient-to-br from-accent to-blue-600 rounded-[2.5rem] p-12 md:p-16 overflow-hidden mt-8">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="max-w-2xl">
                  <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-4 leading-tight">
                    {t.aide.cta.title}
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">{t.aide.cta.desc}</p>
                </div>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-3 px-7 py-4 bg-white text-offblack rounded-full font-bold tracking-tight hover:bg-offwhite transition-colors whitespace-nowrap shadow-lg"
                >
                  {t.aide.cta.button}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <DetailModal id={selectedId} onClose={() => setSelectedId(null)} />
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
     "/assets/blog_automation.jpg",
     "/assets/blog_ai__transforming_the_future.jpg",
     "/assets/blog_japan_s_future_in_sales_ai.jpg",
     "/assets/blog_sales_ai.jpg",
     "/assets/blog_automation.jpg",
     "/assets/blog_voice_app.jpg",
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
                  <img src={post.image} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={post.title} />
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
  const [formState, setFormState] = useState({ name: '', email: '', company: '', topic: '', message: '' });
  const { t } = useLanguage();
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);
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
    setIsSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: `[Company] ${formState.company || '(unspecified)'}\n[Topic] ${formState.topic || '(unspecified)'}\n\n${formState.message}`,
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      setIsSent(true);
      setFormState({ name: '', email: '', company: '', topic: '', message: '' });
      setTimeout(() => setIsSent(false), 8000);
    } catch (error) {
      console.error('Contact error:', error);
      alert('Sorry, there was an error sending your message. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
    if (id === 'email') setEmailError('');
  };

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
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm">
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
                    <option value="">— Select —</option>
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

                <button
                  type="submit"
                  disabled={isSent || isSending}
                  className="group w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-accent text-white rounded-full font-bold text-base tracking-tight hover:bg-offblack transition-all shadow-lg shadow-accent/20 disabled:opacity-70"
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
    const validViews: ViewState[] = ['home', 'works', 'mission', 'partners', 'company', 'career', 'contact', 'blog'];
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
        {view === 'home' && <HomeView onNavigate={navigate} />}
        {view === 'works' && <WorksView />}
        {view === 'blog' && <BlogView />}
        {view === 'mission' && <MissionView />}
        {/* PartnersView is hidden */}
        {view === 'company' && <CompanyView />}
        {view === 'career' && <CareerView />}
        {view === 'contact' && <ContactView />}
      </main>

      {/* Floating CTA — visible on every page except contact itself */}
      {view !== 'contact' && (
        <button
          onClick={() => navigate('contact')}
          aria-label={t.floatingCta.label}
          className="group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 inline-flex items-center gap-3 px-5 py-3.5 md:px-6 md:py-4 bg-accent text-white rounded-full font-bold text-sm md:text-base tracking-tight shadow-2xl shadow-accent/30 hover:bg-offblack hover:shadow-offblack/40 transition-all duration-300"
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
        </button>
      )}

      <footer className={`px-6 md:px-12 py-8 text-center text-sm font-medium opacity-50 ${view === 'mission' || view === 'career' || view === 'works' ? 'text-gray-500' : 'text-gray-400'}`}>
        &copy; 2026 MGC inc. All Rights Reserved.
      </footer>
    </div>
    </LanguageContext.Provider>
  );
};


export default App;