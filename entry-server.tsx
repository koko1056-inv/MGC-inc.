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
      author: {
        '@type': 'Person',
        name: '松尾 心夢',
        alternateName: 'Kokomu Matsuo',
        jobTitle: '代表取締役',
        url: `${SITE_ORIGIN}/company`,
        worksFor: { '@type': 'Organization', name: 'ＭＧＣ株式会社', url: SITE_ORIGIN },
      },
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
