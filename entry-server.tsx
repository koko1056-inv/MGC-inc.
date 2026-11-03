// 事前描画（ビルド時）用のエントリ。scripts/prerender.mjs から呼ばれる。
// ページごとに HTML と、<head> に入れる title / OGP などを返す。
import React from 'react';
import { renderToString } from 'react-dom/server';
import App, { viewForPath, metaFor, PATH_TO_VIEW, SERVICE_KEYS, pathForView, SITE_ORIGIN, THANKS_PATH, BUSINESS_PAGES, isBizView } from './App';
import { serviceContent } from './serviceContent';
import { translations } from './translations';
import { journalPosts, journalPath, findJournalPost } from './journal';
import { glossaryContent } from './glossaryContent';
import { caseContent } from './caseContent';
import { guideContent } from './guideContent';

export { SITE_ORIGIN };

// 事前描画するパス
export const routes = (): string[] => [
  '/',
  ...Object.keys(PATH_TO_VIEW),
  ...journalPosts('ja').map((p) => journalPath(p.slug)),
  ...caseContent.ja.cases.map((c) => `/cases/${c.slug}`),
  ...guideContent.ja.guides.map((g) => `/guide/${g.slug}`),
  ...SERVICE_KEYS.map((k) => pathForView(k)),
  THANKS_PATH,
];

export const render = (path: string) => {
  const html = renderToString(
    <React.StrictMode>
      <App initialPath={path} />
    </React.StrictMode>
  );
  const view = viewForPath(path);
  return { html, meta: metaFor(view, 'ja', path), jsonLd: jsonLdFor(path) };
};

export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const LOGO_URL = `${SITE_ORIGIN}/assets/brand/mgc-logo.png`;
// 代表（著者・創業者）。会社概要ページで定義し、記事の author などからは @id で参照する
export const CEO_ID = `${SITE_ORIGIN}/company#ceo`;
const CEO = {
  '@type': 'Person',
  '@id': CEO_ID,
  name: '松尾 心夢',
  alternateName: 'Kokomu Matsuo',
  jobTitle: '代表取締役',
  worksFor: { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'ＭＧＣ株式会社' },
  url: `${SITE_ORIGIN}/company`,
};
const SERVICE_TYPE: Record<string, string> = {
  'ai-sales': '営業代行・アポイント獲得の自動化（AI営業）',
  'ai-phone': '電話一次対応の自動化（音声AI）',
  'salesforce-ai': 'Salesforce・CRMのAI活用支援',
};

// ページごとの構造化データ（パンくず＋ページの種類に応じたもの）
const jsonLdFor = (path: string): object[] => {
  const view = viewForPath(path);
  const meta = metaFor(view, 'ja', path);
  const out: object[] = [];
  if (meta.noindex) return out;
  const post = view === 'journal' ? findJournalPost('ja', path.split('/').pop() ?? '') : undefined;
  if (path !== '/') {
    const cs = view === 'case' ? caseContent.ja.cases.find((x) => x.slug === path.split('/').pop()) : undefined;
    const gd = view === 'guide' ? guideContent.ja.guides.find((x) => x.slug === path.split('/').pop()) : undefined;
    const crumbs = gd
      ? [
          { name: '比較・選び方ガイド', item: `${SITE_ORIGIN}/guide` },
          { name: gd.title, item: meta.url },
        ]
      : cs
      ? [
          { name: '導入事例', item: `${SITE_ORIGIN}/cases` },
          { name: cs.title ?? cs.industry, item: meta.url },
        ]
      : post
      ? [
          { name: 'お知らせ・ジャーナル', item: `${SITE_ORIGIN}/blog` },
          { name: post.title, item: meta.url },
        ]
      : isBizView(view) || (SERVICE_KEYS as string[]).includes(view)
        ? [
            { name: '事業内容', item: `${SITE_ORIGIN}/works` },
            ...((SERVICE_KEYS as string[]).includes(view) ? [{ name: 'AIソリューション', item: `${SITE_ORIGIN}${BUSINESS_PAGES['biz-ai'].path}` }] : []),
            { name: meta.title.split(/[｜|]| - /)[0].trim(), item: meta.url },
          ]
        : [{ name: meta.title.split(/[｜|]| - /)[0].trim(), item: meta.url }];
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${SITE_ORIGIN}/` },
        ...crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 2, ...c })),
      ],
    });
  }
  if (view === 'guide') {
    const g = guideContent.ja.guides.find((x) => x.slug === path.split('/').pop());
    if (g) {
      out.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${meta.url}#article`,
        headline: g.title,
        description: g.description,
        inLanguage: 'ja',
        url: meta.url,
        image: [meta.image],
        author: { '@type': 'Organization', '@id': ORG_ID, name: 'ＭＧＣ株式会社' },
        publisher: { '@type': 'Organization', '@id': ORG_ID, name: 'ＭＧＣ株式会社', logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': meta.url },
      });
      out.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: g.faq.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
      });
    }
  }
  if (view === 'guides') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '比較・選び方ガイド',
      itemListElement: guideContent.ja.guides.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_ORIGIN}/guide/${g.slug}`, name: g.title })),
    });
  }
  if (view === 'case') {
    const cs = caseContent.ja.cases.find((x) => x.slug === path.split('/').pop());
    if (cs) {
      out.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${meta.url}#article`,
        headline: cs.title ?? cs.industry,
        description: cs.summary,
        articleSection: '導入事例',
        about: cs.services.map((name) => ({ '@type': 'Thing', name })),
        inLanguage: 'ja',
        url: meta.url,
        image: [meta.image],
        author: { '@type': 'Organization', '@id': ORG_ID, name: 'ＭＧＣ株式会社' },
        publisher: { '@type': 'Organization', '@id': ORG_ID, name: 'ＭＧＣ株式会社', logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': meta.url },
      });
    }
  }
  if (view === 'company') {
    out.push({ '@context': 'https://schema.org', ...CEO, description: 'ＭＧＣ株式会社 代表取締役。AIソリューション、AI事業立ち上げ支援、AI活用研修、クロスボーダー事業を、ヒアリングから実装・定着まで自ら担当する。' });
  }
  if (view === 'glossary') {
    const g = glossaryContent.ja;
    out.push({
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      '@id': `${meta.url}#terms`,
      name: g.title,
      description: meta.description,
      url: meta.url,
      inLanguage: 'ja',
      publisher: { '@type': 'Organization', '@id': ORG_ID, name: 'ＭＧＣ株式会社' },
      hasDefinedTerm: g.terms.map((x) => ({
        '@type': 'DefinedTerm',
        '@id': `${meta.url}#${x.id}`,
        name: x.term,
        description: x.definition,
        url: `${meta.url}#${x.id}`,
        inDefinedTermSet: `${meta.url}#terms`,
      })),
    });
  }
  if (isBizView(view)) {
    const d = translations.ja.details[BUSINESS_PAGES[view].key];
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${meta.url}#service`,
      name: d.title,
      description: meta.description,
      url: meta.url,
      image: meta.image,
      provider: { '@type': 'Organization', '@id': ORG_ID, name: 'ＭＧＣ株式会社', url: SITE_ORIGIN },
      areaServed: { '@type': 'Country', name: 'Japan' },
      audience: { '@type': 'BusinessAudience', audienceType: '法人' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${d.title}の提供内容`,
        itemListElement: d.features.map((f) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: f.sub, description: f.text } })),
      },
    });
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: d.faq.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
    });
  }
  if (post) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: [SITE_ORIGIN + post.imageJpg],
      datePublished: post.isoDate,
      dateModified: post.isoDate,
      inLanguage: 'ja',
      articleSection: post.category,
      author: { '@type': 'Person', '@id': CEO_ID, name: '松尾 心夢', url: `${SITE_ORIGIN}/company` },
      publisher: {
        '@type': 'Organization',
        name: 'ＭＧＣ株式会社',
        url: SITE_ORIGIN,
        '@id': ORG_ID,
        logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': meta.url },
    });
  }
  // index.html の Organization（@id）を参照する
  const provider = { '@type': 'Organization', '@id': ORG_ID, name: 'ＭＧＣ株式会社', url: SITE_ORIGIN };
  const faqPage = (items: { q: string; a: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
  });
  if (view === 'home') out.push(faqPage(translations.ja.faq.items.map((x) => ({ q: x.q, a: x.a }))));
  if ((SERVICE_KEYS as string[]).includes(view)) {
    const page = serviceContent.ja[view as keyof typeof serviceContent.ja];
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${meta.url}#service`,
      name: page.navLabel,
      serviceType: SERVICE_TYPE[view] ?? page.navLabel,
      description: page.definition?.text ?? page.seoDescription,
      url: meta.url,
      image: meta.image,
      provider,
      brand: { '@type': 'Brand', name: 'MGC Inc.' },
      areaServed: { '@type': 'Country', name: 'Japan' },
      audience: { '@type': 'BusinessAudience', audienceType: '法人' },
      isRelatedTo: { '@type': 'Service', name: 'AIソリューション', url: `${SITE_ORIGIN}${BUSINESS_PAGES['biz-ai'].path}` },
    });
    const faq = page.sections.find((x) => x.type === 'faq');
    if (faq && faq.type === 'faq') out.push(faqPage(faq.items));
  }
  if (view === 'training') {
    const tr = translations.ja.training;
    out.push(faqPage(tr.faq.items));
    for (const c of tr.course.items) {
      const spec = (label: string) => c.specs.find((x) => x.label === label)?.value ?? '';
      // 「1名 398,000円（税込）」から金額だけを取る（「1名」の 1 を混ぜない）
      const price = (spec('受講料').match(/([\d,]+)\s*円/)?.[1] ?? '').replace(/,/g, '');
      const hours = spec('標準時間').match(/(\d+)\s*時間/)?.[1];
      const mode = spec('実施形態');
      const modes = [...(mode.includes('通学') || mode.includes('対面') ? ['Onsite'] : []), ...(mode.includes('オンライン') ? ['Online'] : [])];
      out.push({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: c.name,
        description: c.overview,
        url: meta.url,
        inLanguage: 'ja',
        provider,
        ...(price ? { offers: { '@type': 'Offer', category: 'Paid', price, priceCurrency: 'JPY', description: '1名あたり（税込）', url: meta.url } } : {}),
        ...(modes.length && hours
          ? { hasCourseInstance: modes.map((m) => ({ '@type': 'CourseInstance', courseMode: m, courseWorkload: `PT${hours}H` })) }
          : {}),
      });
    }
  }
  return out;
};

// ---- llms-full.txt（AIアシスタント向けの全文。サイトに載せている文章をそのまま並べる）----
// scripts/prerender.mjs が dist/llms-full.txt に書き出す。内容はサイトのデータから作るため、ページと食い違わない。
const mdSection = (x: unknown): string[] => {
  // セクションのデータ（見出し・本文・表・リスト・FAQ）を、種類を問わず箇条書きに直す
  const out: string[] = [];
  const walk = (v: unknown, depth = 0) => {
    if (typeof v === 'string') { if (v.trim()) out.push(`${'  '.repeat(depth)}- ${v.trim()}`); return; }
    if (Array.isArray(v)) { v.forEach((i) => walk(i, depth)); return; }
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      if ('q' in o && 'a' in o) { out.push(`${'  '.repeat(depth)}- Q. ${o.q}`); out.push(`${'  '.repeat(depth)}  A. ${o.a}`); return; }
      const strs = Object.entries(o).filter(([k, val]) => typeof val === 'string' && !['type', 'eyebrow', 'slug', 'href', 'by', 'no', 'heading'].includes(k)).map(([, val]) => String(val).trim()).filter(Boolean);
      if (strs.length) out.push(`${'  '.repeat(depth)}- ${strs.join(' — ')}`);
      Object.values(o).filter((val) => typeof val === 'object' && val).forEach((val) => walk(val, depth + 1));
    }
  };
  walk(x);
  return out;
};

export const llmsFull = (): string => {
  const L: string[] = [];
  const t = translations.ja;
  L.push('# ＭＧＣ株式会社（MGC Inc.）— サイト全文（AIアシスタント向け）');
  L.push('');
  L.push(`> ${SITE_ORIGIN} に掲載している内容の全文です。要約は ${SITE_ORIGIN}/llms.txt 。料金はサイトに明記したもの（研修の受講料）のみ、実績の数字は導入事例に掲載したもののみです。`);
  L.push('');
  L.push('## 会社概要');
  t.company.items.forEach((i) => L.push(`- ${i.label}: ${i.value.replace(/\n/g, ' ／ ')}`));
  L.push('');
  L.push('## 事業');
  L.push(`${t.growthFlow.title} ${t.growthFlow.lead}`);
  t.growthFlow.steps.forEach((x) => L.push(`- ${x.step} ${x.verb}（${x.name}）: ${x.desc}`));
  L.push(`- ${t.growthFlow.note}`);
  (['service_ai', 'service_newbiz', 'service_training', 'service_lab'] as const).forEach((k) => {
    const d = t.details[k] as { title: string; subtitle: string; p1: string; features: { title: string; sub: string; text: string }[]; faq?: { q: string; a: string }[]; summary?: { label: string; value: string }[] };
    L.push(`### ${d.title}（${d.subtitle}）`);
    L.push(d.p1.replace(/\n/g, ''));
    d.summary?.forEach((x) => L.push(`- ${x.label}: ${x.value}`));
    d.features.forEach((f) => L.push(`- ${f.sub}（${f.title}）: ${f.text}`));
    d.faq?.forEach((f) => { L.push(`- Q. ${f.q}`); L.push(`  A. ${f.a}`); });
    L.push('');
  });
  L.push('## サービス');
  (SERVICE_KEYS as (keyof typeof serviceContent.ja)[]).forEach((k) => {
    const page = serviceContent.ja[k];
    L.push(`### ${page.navLabel}（${SITE_ORIGIN}${pathForView(k)}）`);
    if (page.definition) L.push(page.definition.text);
    L.push(page.hero.lead);
    page.summary?.forEach((x) => L.push(`- ${x.label}: ${x.value}`));
    page.sections.forEach((sec) => {
      if (sec.type === 'cases' || sec.type === 'related') return;
      L.push(`#### ${sec.heading}`);
      L.push(...mdSection(sec));
    });
    L.push('');
  });
  L.push(`## ${t.pricing.title}（${SITE_ORIGIN}/pricing）`);
  L.push(t.pricing.lead);
  L.push(`- ${t.pricing.training.heading}: ${t.training.course.items.map((c) => `${c.name} ${c.specs[2].value}・${c.specs[3].value}`).join('／')}。${t.pricing.training.note}`);
  t.training.options.items.forEach((o) => L.push(`- ${o.title}: ${o.price}（${o.desc}）`));
  L.push(`- ${t.pricing.services.heading}: 各サービスの「費用の考え方」（上記）を参照`);
  L.push(`- ${t.pricing.period.heading}: ${t.pricing.period.items.map((x) => `${x.label} ${x.value}`).join('、')}。${t.pricing.period.note}`);
  L.push(`- ${t.pricing.free}`);
  L.push('');
  L.push('## 研修');
  t.training.course.items.forEach((c) => {
    L.push(`### ${c.name}`);
    L.push(c.overview);
    c.specs.forEach((x) => L.push(`- ${x.label}: ${x.value}`));
    L.push(`- 特徴: ${c.features.join('／')}`);
    L.push(`- 習得できること: ${c.outcomes.join('／')}`);
  });
  t.training.options.items.forEach((o) => L.push(`- ${o.title}（${o.price}）: ${o.desc}`));
  L.push(`- ${t.training.after.heading}: ${t.training.after.steps.map((x) => `${x.title}（${x.desc}）`).join(' → ')}`);
  t.training.faq.items.forEach((f) => { L.push(`- Q. ${f.q}`); L.push(`  A. ${f.a}`); });
  L.push('');
  L.push('## 導入事例（社名は掲載許諾が取れるまで伏せ、業種で紹介）');
  caseContent.ja.cases.forEach((c) => {
    L.push(`### ${c.title ?? c.industry}（${c.industry}・${SITE_ORIGIN}/cases/${c.slug}）`);
    L.push(c.summary);
    c.challenge.forEach((x) => L.push(`- 課題: ${x}`));
    c.approach.forEach((a) => L.push(`- 打ち手: ${a.title} — ${a.desc}`));
    if (c.result) L.push(`- 成果: ${c.result.label} — ${c.result.desc}`);
    c.metrics?.forEach((m) => L.push(`- 数値: ${m.label} ${m.value}${m.unit}`));
    L.push('');
  });
  L.push('## 比較・選び方ガイド');
  guideContent.ja.guides.forEach((g) => {
    L.push(`### ${g.title}（${SITE_ORIGIN}/guide/${g.slug}）`);
    L.push(g.lead);
    L.push(`| ${g.table.head.join(' | ')} |`);
    L.push(`|${g.table.head.map(() => ':--').join('|')}|`);
    g.table.rows.forEach((r) => L.push(`| ${r.join(' | ')} |`));
    g.sections.forEach((sec) => { L.push(`#### ${sec.heading}`); sec.paragraphs?.forEach((p) => L.push(p)); sec.list?.forEach((x) => L.push(`- ${x}`)); });
    g.faq.forEach((f) => { L.push(`- Q. ${f.q}`); L.push(`  A. ${f.a}`); });
    L.push('');
  });
  L.push('## 用語集');
  glossaryContent.ja.terms.forEach((x) => L.push(`- ${x.term}: ${x.definition}`));
  L.push('');
  L.push('## よくあるご質問（トップページ）');
  t.faq.items.forEach((f) => { L.push(`- Q. ${f.q}`); L.push(`  A. ${f.a}`); });
  L.push('');
  return L.join('\n');
};

