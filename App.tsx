import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { ArrowRight, Globe, Zap, Layers, X, Send, Menu, Anchor, Check, Heart, MapPin, Calendar, User, Sparkles, Plus, Minus } from 'lucide-react';

import { translations, Lang } from './translations';
import { serviceContent, ServiceKey, ServiceSection } from './serviceContent';
import { caseContent } from './caseContent';
export const LanguageContext = React.createContext<{ lang: Lang; setLang: (l: Lang) => void; t: typeof translations['ja'] }>({
  lang: 'ja',
  setLang: () => {},
  t: translations['ja']
});
export const useLanguage = () => React.useContext(LanguageContext);
// --- Types & Interfaces ---

type ViewState = 'home' | 'works' | 'training' | 'diagnosis' | 'mission' | 'partners' | 'company' | 'career' | 'contact' | 'blog' | 'cases' | ServiceKey;

// AI診断の表示切り替え。false の間は、サイト内の導線をすべて隠す。
// ページ自体（/diagnosis）は残るため、true に戻せば元の状態に復帰する。
export const SHOW_DIAGNOSIS = false;

const SERVICE_KEYS: ServiceKey[] = ['ai-sales', 'ai-phone', 'salesforce-ai'];
const isServiceKey = (v: string): v is ServiceKey => (SERVICE_KEYS as string[]).includes(v);

type ContentKey = 'service_ai' | 'service_lab';

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

// --- FAQ Item (collapsible accordion) ---
const FaqItem: React.FC<{ question: string; answer: string; index: number }> = ({ question, answer, index }) => {
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
        </div>
      </div>
    </div>
  );
};

const HomeView: React.FC<{ onNavigate?: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { t, lang } = useLanguage();

  const goTo = (id: ViewState) => {
    if (onNavigate) onNavigate(id);
    else window.location.hash = id;
  };

  const services = [
    { icon: <Globe className="w-6 h-6" />, title: t.works.service_ai.title, subtitle: t.works.service_ai.subtitle },
    { icon: <Layers className="w-6 h-6" />, title: t.works.service_lab.title, subtitle: t.works.service_lab.subtitle },
  ];

  return (
  <>
  <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden pt-40 pb-20">
    {/* Decorative orb backdrop — subtle visual accent without distracting from copy */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -left-40 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
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

      <Reveal delay={50}>
        <h1 className={`${lang === 'ja' ? 'text-[10vw] md:text-[6.5vw] leading-[1.15]' : 'text-[12vw] md:text-[10vw] leading-[0.9]'} font-bold tracking-tighter text-offblack mb-6`}>
          {t.hero.title_1} <br />
          <span className="text-accent transition-colors duration-500">{t.hero.title_2}</span>{lang === 'ja' ? '' : ' '}{t.hero.title_3}
        </h1>
        {lang === 'ja' && (
          <p className="font-mono text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">
            {t.hero.subtitle_en}
          </p>
        )}
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
            {SHOW_DIAGNOSIS && (
              <button
                onClick={() => goTo('diagnosis')}
                className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-accent text-white rounded-full font-bold text-base tracking-tight hover:bg-offblack transition-all shadow-lg shadow-accent/20 whitespace-nowrap"
              >
                <Sparkles className="w-5 h-5" />
                {t.hero.tryDiagnosis}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            {/* 診断を隠している間は、相談ボタンを主導線に格上げする */}
            <button
              onClick={() => goTo('contact')}
              className={
                SHOW_DIAGNOSIS
                  ? 'group inline-flex items-center justify-center gap-2 text-offblack font-bold text-sm tracking-tight border-b-2 border-offblack pb-1 hover:text-accent hover:border-accent transition-colors whitespace-nowrap'
                  : 'group inline-flex items-center justify-center gap-3 px-6 py-4 bg-accent text-white rounded-full font-bold text-base tracking-tight hover:bg-offblack transition-all shadow-lg shadow-accent/20 whitespace-nowrap'
              }
            >
              {t.hero.bookConsult}
              <ArrowRight className={SHOW_DIAGNOSIS ? 'w-4 h-4 group-hover:translate-x-1 transition-transform' : 'w-5 h-5 group-hover:translate-x-1 transition-transform'} />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  </section>

  {/* === Service Index (under hero) === */}
  <div className="px-6 md:px-12 pb-24 max-w-screen-xl mx-auto w-full">
    <Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-200 rounded-[2rem] overflow-hidden">
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

  {/* === Free AI Diagnosis Banner (無料フロントエンド) === */}
  <div className={`px-6 md:px-12 pb-24 max-w-screen-xl mx-auto w-full${SHOW_DIAGNOSIS ? '' : ' hidden'}`}>
    <Reveal>
      <button
        onClick={() => goTo('diagnosis')}
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
      </button>
    </Reveal>
  </div>

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {t.oneStop.steps.map((s, i) => (
        <Reveal key={s.step} delay={i * 100} className="h-full">
          <div className="relative h-full bg-white rounded-xl p-6 border border-gray-200 hover:border-accent transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">STEP {s.step}</span>
            <h4 className="text-lg font-bold text-offblack mt-3 mb-2 tracking-tight leading-snug">{s.title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            {i < t.oneStop.steps.length - 1 && (
              <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 text-gray-300" />
            )}
          </div>
        </Reveal>
      ))}
    </div>
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
            <FaqItem question={item.q} answer={item.a} index={i} />
          </Reveal>
        ))}
      </div>
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
  index: '01' | '02';
  serviceKey: 'service_ai' | 'service_lab';
  icon: ReactNode;
  image?: string;
  onDetail: () => void;
}> = ({ index, serviceKey, icon, image, onDetail }) => {
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
            </div>
            <div className="text-[7rem] md:text-[9rem] font-bold text-gray-800/60 leading-[0.85] mb-8 select-none tracking-tighter">
              {index}
            </div>
            {image && (
              <div className="rounded-2xl overflow-hidden mb-8 border border-gray-800">
                <img src={image} alt={data.title} loading="lazy" className="w-full aspect-[4/3] object-cover" />
              </div>
            )}
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
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
};

const WorksView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<ContentKey | null>(null);
  const { t, lang } = useLanguage();
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-20 md:mb-32 pt-8 border-t border-gray-800">
            <div className="md:col-span-1 col-span-2 flex items-center mb-2 md:mb-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-500">
                {t.worksIntro.indexLabel}
              </span>
            </div>
            {(['service_ai', 'service_lab'] as const).map((key, i) => (
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
            image="/assets/service_ai.jpg"
            onDetail={() => setSelectedId('service_ai')}
          />
        </div>

        <div id="service-02" className="scroll-mt-24 mt-24 md:mt-32">
          <ServiceBlock
            index="02"
            serviceKey="service_lab"
            icon={<Zap className="w-5 h-5 text-accent stroke-[1.75]" />}
            image="/assets/service_lab.png"
            onDetail={() => setSelectedId('service_lab')}
          />
        </div>

        {/* === 個別サービスページへの導線 === */}
        <div className="mt-24 md:mt-32 border-t border-gray-800 pt-16">
          <Reveal>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">Service Details</span>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mt-3 mb-10 leading-tight">
              {lang === 'ja' ? '個別のサービス' : 'Individual services'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SERVICE_KEYS.map((key) => {
                const p = serviceContent[lang][key];
                return (
                  <a
                    key={key}
                    href={`#${key}`}
                    className="group flex flex-col bg-gray-900/40 rounded-xl p-6 border border-gray-800 hover:border-accent transition-colors"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{p.hero.badge}</span>
                    <h4 className="text-xl font-bold text-white mt-3 mb-2 tracking-tight leading-snug group-hover:text-accent transition-colors">
                      {p.navLabel}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed flex-1">{p.hero.title}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white mt-5 group-hover:text-accent transition-colors">
                      {t.worksIntro.detailLink}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* === One-Stop Flow (dark variant) === */}
        <div className="mt-24 md:mt-32 border-t border-gray-800 pt-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tighter max-w-xl leading-tight">{t.oneStop.title}</h3>
              <p className="text-gray-400 leading-relaxed max-w-md font-medium">{t.oneStop.lead}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.oneStop.steps.map((s, i) => (
                <div key={s.step} className="relative bg-gray-900/40 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent">STEP {s.step}</span>
                  <h4 className="text-xl font-bold text-white mt-3 mb-2 tracking-tight leading-snug">{s.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  {i < t.oneStop.steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 text-gray-700" />
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <DetailModal id={selectedId} onClose={() => setSelectedId(null)} />
      </div>
    </PageTransition>
  );
};


const MissionView: React.FC = () => {
  const { t } = useLanguage();
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
     "/assets/blog_strategy.jpg",
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

// #contact/<slug> で来たとき、その相談内容を初期選択する。
// どのサービスページ経由の問い合わせかを、受信メール側で判別できるようにする。
const SERVICE_TOPIC_INDEX: Record<string, number> = { 'ai-sales': 0, 'ai-phone': 1, 'salesforce-ai': 2 };

const ContactView: React.FC = () => {
  const { t } = useLanguage();
  const initialTopic = (() => {
    const seg = window.location.hash.slice(1).split('/')[1];
    const i = seg !== undefined ? SERVICE_TOPIC_INDEX[seg] : undefined;
    return i !== undefined ? (t.contact.form.topicOptions[i] ?? '') : '';
  })();
  const [formState, setFormState] = useState({ name: '', email: '', company: '', topic: initialTopic, message: '' });
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
});

const TrainingView: React.FC = () => {
  const { t } = useLanguage();
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
              <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-[#111418] text-white">
                <GridPattern dark />
                <div className="relative px-6 md:px-16 py-14 md:py-24">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/80 text-xs md:text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#2D6CDF]" />
                    {tr.hero.badge}
                  </span>
                  <h1 className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.25] mt-6">{tr.hero.title}</h1>
                  <p className="text-base md:text-2xl text-white/55 font-medium mt-3 leading-[1.6]">{tr.hero.titleSub}</p>
                  <p className="max-w-3xl text-base md:text-lg text-white/85 leading-[1.9] mt-8">{tr.hero.lead}</p>
                  <a
                    href={tr.contact.ctaHref}
                    className="group inline-flex items-center gap-2.5 mt-10 px-7 py-4 rounded-full bg-[#2D6CDF] text-white font-bold text-sm md:text-base tracking-tight shadow-xl shadow-[#2D6CDF]/25 hover:bg-white hover:text-[#111418] transition-all duration-300"
                  >
                    {tr.hero.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Course */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.course.eyebrow} title={tr.course.heading} /></Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <Reveal className="lg:col-span-1">
                <div className="rounded-3xl border-2 border-[#2D6CDF]/20 bg-[#2D6CDF]/[0.04] p-7 md:p-8 h-full">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">{tr.course.nameLabel}</span>
                  <p className="text-xl md:text-2xl font-bold text-[#111418] mt-3 leading-[1.6]">{tr.course.name}</p>
                  <div className="mt-6 pt-6 border-t border-[#2D6CDF]/15">
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-500">{tr.course.overviewLabel}</span>
                    <p className="text-[15px] md:text-base text-gray-700 mt-3 leading-[1.9]">{tr.course.overview}</p>
                  </div>
                </div>
              </Reveal>
              <div className="lg:col-span-2">
                <dl className="grid grid-cols-1">
                  {tr.course.specs.map((s, i) => (
                    <Reveal key={i} delay={i * 80}>
                      <div className="flex flex-col md:flex-row gap-2 md:gap-8 py-6 border-b border-gray-200">
                        <dt className="md:w-40 flex-shrink-0 text-sm font-bold text-[#2D6CDF] pt-0.5">{s.label}</dt>
                        <dd className="flex-1 text-base md:text-lg text-[#111418] leading-[1.8]">{s.value}</dd>
                      </div>
                    </Reveal>
                  ))}
                </dl>
                {tr.course.note && (
                  <Reveal delay={tr.course.specs.length * 80}>
                    <p className="text-sm text-gray-500 leading-[1.9] mt-6">{tr.course.note}</p>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Skills / Outcomes */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.skills.eyebrow} title={tr.skills.heading} /></Reveal>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {tr.skills.items.map((item, i) => (
                <Reveal key={i} delay={i * 70}>
                  <li className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 h-full hover:border-[#2D6CDF]/40 transition-colors duration-300">
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

        {/* Flow / Process */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.flow.eyebrow} title={tr.flow.heading} /></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {tr.flow.steps.map((step, i) => (
                <Reveal key={i} delay={i * 90}>
                  <div className="relative rounded-2xl bg-[#111418] text-white p-6 md:p-7 h-full">
                    <span className="text-[#2D6CDF] font-bold tracking-widest text-sm">{step.no}</span>
                    <h3 className="text-lg md:text-xl font-bold mt-2 leading-[1.5]">{step.title}</h3>
                    <p className="text-sm text-white/70 mt-3 leading-[1.8]">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-8 rounded-2xl border border-[#2D6CDF]/30 bg-[#2D6CDF]/[0.05] p-6 md:p-7">
                <p className="text-[15px] md:text-base text-[#111418] leading-[1.9]">{tr.flow.note}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Contact / Apply */}
        <section className="px-6 md:px-12 mt-20 md:mt-28">
          <div className="max-w-screen-xl mx-auto">
            <Reveal><Head eyebrow={tr.contact.eyebrow} title={tr.contact.heading} /></Reveal>
            <Reveal>
              <div className="rounded-[1.75rem] md:rounded-[2.5rem] bg-[#111418] text-white overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-3 p-7 md:p-12">
                    <p className="text-base md:text-lg text-white/85 leading-[1.9]">{tr.contact.lead}</p>
                    <p className="text-2xl md:text-3xl font-bold mt-8 mb-6">{tr.contact.corp}</p>
                    <dl className="space-y-4">
                      {tr.contact.rows.map((row, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 border-b border-white/10 pb-4">
                          <dt className="md:w-24 flex-shrink-0 text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">{row.label}</dt>
                          <dd className="flex-1 text-base md:text-lg leading-[1.7] break-words">
                            {'href' in row && row.href ? (
                              <a
                                href={row.href}
                                target={row.href.startsWith('http') ? '_blank' : undefined}
                                rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="text-white hover:text-[#2D6CDF] transition-colors underline decoration-white/20 underline-offset-4"
                              >
                                {row.value}
                              </a>
                            ) : (
                              <span className="text-white">{row.value}</span>
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

            {/* Footnote */}
            <Reveal>
              <p className="mt-10 text-xs md:text-sm text-gray-500 leading-[1.9] border-l-2 border-gray-300 pl-4">
                {tr.footnote}
              </p>
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

const SectionHead: React.FC<{ eyebrow: string; heading: string; lead?: string }> = ({ eyebrow, heading, lead }) => (
  <div className="mb-10 md:mb-14">
    <span className="text-[#2D6CDF] font-bold tracking-[0.2em] text-xs uppercase">{eyebrow}</span>
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111418] mt-2 leading-[1.5]">{heading}</h2>
    <div className="w-16 h-1.5 bg-[#2D6CDF] mt-4 rounded-full" />
    {lead && <p className="text-base md:text-lg text-gray-600 leading-[1.9] mt-6 max-w-3xl">{lead}</p>}
  </div>
);

const ServiceSectionBlock: React.FC<{ section: ServiceSection }> = ({ section }) => {
  const s = section;

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
                  <p className="text-[15px] md:text-base text-gray-600 leading-[1.9] mt-2 max-w-3xl">{step.desc}</p>
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
    return (
      <>
        <Reveal><SectionHead eyebrow={s.eyebrow} heading={s.heading} lead={s.lead} /></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {s.cards.map((card, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 md:p-8 hover:border-[#2D6CDF]/40 transition-colors duration-300">
                <span aria-hidden className="block w-10 h-1 bg-[#2D6CDF] rounded-full mb-5" />
                <h3 className="text-lg md:text-xl font-bold text-[#111418] leading-[1.6]">{card.title}</h3>
                <p className="text-[15px] md:text-base text-gray-600 leading-[1.9] mt-3">{card.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </>
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
                href={`#cases/${link.slug}`}
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

  useEffect(() => {
    const prevTitle = document.title;
    document.title = lang === 'ja'
      ? '導入事例｜AI導入の進め方と実例 - ＭＧＣ株式会社'
      : 'Case studies | How AI projects actually run - MGC Inc.';
    return () => { document.title = prevTitle; };
  }, [lang]);

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
              <p className="text-base md:text-lg text-gray-600 leading-[1.9] mt-7 max-w-3xl">{c.lead}</p>
            </div>
          </Reveal>

          {/* Cases */}
          <div className="space-y-8 md:space-y-10">
            {c.cases.map((cs, i) => (
              <Reveal key={cs.slug} delay={i * 80}>
                <article id={cs.slug} className="scroll-mt-28 rounded-3xl border-2 border-gray-200 bg-white overflow-hidden">
                  {/* Header band */}
                  <div className="bg-[#F4F6FB] px-6 md:px-10 py-7 md:py-8 border-b border-gray-200">
                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                      {cs.services.map((s) => (
                        <span key={s} className="inline-flex items-center px-3 py-1 rounded-full bg-[#2D6CDF] text-white text-xs font-bold tracking-tight">
                          {s}
                        </span>
                      ))}
                      <span className="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 text-gray-600 text-xs font-bold">
                        {cs.status}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#111418] leading-[1.5]">{cs.industry}</h2>
                    <p className="text-sm md:text-base text-gray-600 leading-[1.8] mt-2">{cs.scale}</p>
                    <p className="text-[15px] md:text-base text-[#1A2233] leading-[1.9] mt-5 max-w-3xl">{cs.summary}</p>
                    {cs.result && (
                      <div className="mt-6 rounded-2xl bg-white border-l-4 border-[#2D6CDF] px-6 py-5">
                        <span className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">
                          {lang === 'ja' ? '成果' : 'Result'}
                        </span>
                        <p className="text-xl md:text-2xl font-bold text-[#111418] leading-[1.5] mt-2">{cs.result.label}</p>
                        <p className="text-[15px] text-gray-600 leading-[1.9] mt-2.5">{cs.result.desc}</p>
                      </div>
                    )}
                  </div>

                  <div className="px-6 md:px-10 py-8 md:py-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* 課題 */}
                    <div className="lg:col-span-2">
                      <span className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">
                        {lang === 'ja' ? '課題' : 'Challenge'}
                      </span>
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
                      <span className="text-xs font-bold tracking-widest uppercase text-[#2D6CDF]">
                        {lang === 'ja' ? '打ち手' : 'What we did'}
                      </span>
                      <ol className="mt-4 space-y-5">
                        {cs.approach.map((a, j) => (
                          <li key={j} className="flex gap-4">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2D6CDF]/10 text-[#2D6CDF] text-xs font-bold flex items-center justify-center mt-0.5 tabular-nums">
                              {j + 1}
                            </span>
                            <div>
                              <h3 className="text-base md:text-lg font-bold text-[#111418] leading-[1.6]">{a.title}</h3>
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
                      <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                        {lang === 'ja' ? '設計上の要点' : 'Design decisions'}
                      </span>
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
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* 掲載方針 */}
          <Reveal>
            <p className="mt-10 text-xs md:text-sm text-gray-500 leading-[1.9] border-l-2 border-gray-300 pl-4 max-w-3xl">
              {c.disclaimer}
            </p>
          </Reveal>

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
                  {lang === 'ja' ? '無料で相談する' : 'Book a free consultation'}
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

const ServiceView: React.FC<{ serviceKey: ServiceKey }> = ({ serviceKey }) => {
  const { lang } = useLanguage();
  const page = serviceContent[lang][serviceKey];

  // ページ固有のtitle/descriptionを反映する（SPAのため手動で書き換える）
  useEffect(() => {
    const prevTitle = document.title;
    document.title = page.seoTitle;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? null;
    meta?.setAttribute('content', page.seoDescription);
    return () => {
      document.title = prevTitle;
      if (prevDesc !== null) meta?.setAttribute('content', prevDesc);
    };
  }, [page.seoTitle, page.seoDescription]);

  return (
    <PageTransition>
      <div className="text-[#111418]">
        {/* Hero */}
        <section className="px-6 md:px-12">
          <div className="max-w-screen-xl mx-auto">
            <Reveal>
              <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-[#111418] text-white">
                <GridPattern dark />
                <div className="relative px-6 md:px-16 py-14 md:py-24">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/80 text-xs md:text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#2D6CDF]" />
                    {page.hero.badge}
                  </span>
                  <h1 className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.25] mt-6 max-w-4xl">{page.hero.title}</h1>
                  <p className="text-base md:text-2xl text-white/55 font-medium mt-3 leading-[1.6]">{page.hero.titleSub}</p>
                  <p className="max-w-3xl text-base md:text-lg text-white/85 leading-[1.9] mt-8">{page.hero.lead}</p>
                  <ul className="flex flex-wrap gap-3 mt-8">
                    {page.hero.points.map((p, i) => (
                      <li key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium">
                        <Check className="w-3.5 h-3.5 text-[#2D6CDF]" strokeWidth={3} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-10">
                    <a
                      href={`#contact/${page.slug}`}
                      className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#2D6CDF] text-white font-bold text-sm md:text-base tracking-tight shadow-xl shadow-[#2D6CDF]/25 hover:bg-white hover:text-[#111418] transition-all duration-300"
                    >
                      {page.cta.button}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    {SHOW_DIAGNOSIS && (
                      <a
                        href={page.cta.secondaryHref}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/25 text-white/90 font-bold text-sm tracking-tight hover:bg-white/10 transition-colors duration-300"
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

        {/* Sections */}
        {page.sections.map((section, i) => (
          <section key={i} className="px-6 md:px-12 mt-20 md:mt-28">
            <div className="max-w-screen-xl mx-auto">
              <ServiceSectionBlock section={section} />
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
                    className="group w-full mt-8 px-7 py-4 rounded-full bg-[#2D6CDF] text-white font-bold text-base tracking-tight shadow-xl shadow-[#2D6CDF]/25 hover:bg-[#111418] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2.5">
                    {loading ? d.form.loading : d.form.submit}
                    {!loading && <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">{d.form.privacyNote}</p>
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

const App: React.FC = () => {
  // Helper to parse view from hash
  const getViewFromHash = (): ViewState => {
    const validViews: ViewState[] = ['home', 'works', 'training', 'diagnosis', 'mission', 'partners', 'company', 'career', 'contact', 'blog', 'cases', ...SERVICE_KEYS];
    const hash = window.location.hash.slice(1).split('/')[0];
    if (validViews.includes(hash as ViewState)) return hash as ViewState;
    // Support clean path URLs (e.g. /training, /diagnosis) via Vercel SPA rewrite
    const path = window.location.pathname.replace(/\/+$/, '');
    if (path === '/training') return 'training';
    if (path === '/diagnosis') return 'diagnosis';
    if (path === '/cases') return 'cases';
    const svc = path.match(/^\/service\/([a-z-]+)$/);
    if (svc && isServiceKey(svc[1])) return svc[1];
    return 'home';
  };

  const [view, setView] = useState<ViewState>(getViewFromHash());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('ja');
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

  // 情報ナビ（お問い合わせはCTAボタンとして分離、Journalはフッターへ集約）
  const navItems: { id?: ViewState; href?: string; label: string }[] = [
    { id: 'works', label: t.nav.works },
    { id: 'cases', label: t.nav.cases },
    { id: 'training', label: t.nav.training },
    { href: '/column', label: t.nav.column },
    { id: 'mission', label: t.nav.mission },
    { id: 'company', label: t.nav.company },
    { id: 'career', label: t.nav.career },
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
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => item.href ? (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 opacity-60 hover:opacity-100 font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              {item.label}
            </a>
          ) : (
            <button
              key={item.id}
              onClick={() => item.id && navigate(item.id)}
              className={`relative py-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center ${view === item.id ? 'opacity-100 font-bold scale-110' : 'opacity-60 hover:opacity-100 font-medium scale-100'}`}
            >
              {item.label}
               <span className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${view === item.id ? 'w-full' : 'w-0'}`} />
            </button>
          ))}
          {/* Contact CTA（主導線） */}
          <button
            onClick={() => navigate('contact')}
            className="ml-1 px-5 py-1.5 rounded-full border border-white/50 font-bold hover:bg-white hover:text-offblack transition-colors duration-300"
          >
            {t.nav.contact}
          </button>
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
        <nav className="flex flex-col items-center gap-7">
           {navItems.map((item) => item.href ? (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl font-bold tracking-tighter text-offblack hover:text-accent transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <button
              key={item.id}
              onClick={() => item.id && navigate(item.id)}
              className="text-4xl font-bold tracking-tighter text-offblack hover:text-accent transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => navigate('contact')}
            className="mt-3 px-8 py-4 rounded-full bg-accent text-white text-2xl font-bold hover:bg-offblack transition-colors"
          >
            {t.nav.contact}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main>
        {view === 'home' && <HomeView onNavigate={navigate} />}
        {view === 'works' && <WorksView />}
        {view === 'training' && <TrainingView />}
        {isServiceKey(view) && <ServiceView serviceKey={view} />}
        {view === 'cases' && <CasesView />}
        {view === 'diagnosis' && <DiagnosisView />}
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

      <footer className={`px-6 md:px-12 py-12 border-t ${view === 'mission' || view === 'career' || view === 'works' || view === 'blog' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div>
            <p className={`font-bold text-base mb-2 ${view === 'mission' || view === 'career' || view === 'works' || view === 'blog' ? 'text-white' : 'text-offblack'}`}>
              {t.footer.corp}
            </p>
            <p className="text-sm leading-relaxed">{t.footer.address}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            {navItems.map((item) => item.href ? (
              <a key={item.href} href={item.href} className="hover:text-accent transition-colors">{item.label}</a>
            ) : (
              <button key={item.id} onClick={() => item.id && navigate(item.id)} className="hover:text-accent transition-colors">
                {item.label}
              </button>
            ))}
            <button onClick={() => navigate('blog')} className="hover:text-accent transition-colors">{t.nav.blog}</button>
            <button onClick={() => navigate('contact')} className="hover:text-accent transition-colors">{t.nav.contact}</button>
          </nav>
        </div>
        <p className="max-w-screen-xl mx-auto text-xs mt-10 opacity-70">{t.footer.rights}</p>
      </footer>
    </div>
    </LanguageContext.Provider>
  );
};


export default App;