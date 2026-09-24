// 事前描画（ビルド時）用のエントリ。scripts/prerender.mjs から呼ばれる。
// ページごとに HTML と、<head> に入れる title / OGP などを返す。
import React from 'react';
import { renderToString } from 'react-dom/server';
import App, { viewForPath, metaFor, PATH_TO_VIEW, SERVICE_KEYS, pathForView, SITE_ORIGIN } from './App';
import { serviceContent } from './serviceContent';
import { translations } from './translations';

export { SITE_ORIGIN };

// 事前描画するパス。/diagnosis は非表示中のため含めない
export const routes = (): string[] => [
  '/',
  ...Object.keys(PATH_TO_VIEW).filter((p) => p !== '/diagnosis'),
  ...SERVICE_KEYS.map((k) => pathForView(k)),
];

export const render = (path: string) => {
  const html = renderToString(
    <React.StrictMode>
      <App initialPath={path} />
    </React.StrictMode>
  );
  const view = viewForPath(path);
  return { html, meta: metaFor(view, 'ja'), jsonLd: jsonLdFor(path) };
};

// ページごとの構造化データ（パンくず＋ページの種類に応じたもの）
const jsonLdFor = (path: string): object[] => {
  const view = viewForPath(path);
  const meta = metaFor(view, 'ja');
  const out: object[] = [];
  if (path !== '/') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${SITE_ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: meta.title.split(/[｜|]| - /)[0].trim(), item: meta.url },
      ],
    });
  }
  const provider = { '@type': 'Organization', name: 'ＭＧＣ株式会社', url: SITE_ORIGIN };
  if ((SERVICE_KEYS as string[]).includes(view)) {
    const page = serviceContent.ja[view as keyof typeof serviceContent.ja];
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.navLabel,
      description: page.seoDescription,
      url: meta.url,
      provider,
      areaServed: { '@type': 'Country', name: 'Japan' },
    });
  }
  if (view === 'training') {
    const tr = translations.ja.training;
    for (const c of tr.course.items) {
      const fee = c.specs.find((x) => x.label === '受講料')?.value ?? '';
      const price = fee.replace(/[^0-9]/g, '');
      out.push({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: c.name,
        description: c.overview,
        provider,
        ...(price ? { offers: { '@type': 'Offer', price, priceCurrency: 'JPY', category: '1名あたり（税込）' } } : {}),
      });
    }
  }
  return out;
};
