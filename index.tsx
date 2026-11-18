import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { loadLang } from './i18n';
import { Analytics } from '@vercel/analytics/react';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const app = (
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);

// ビルド時に事前描画したページはそのHTMLを引き継ぐ（ハイドレーション）。
// 事前描画していないURL（/contact/thanks など）は空の器から描画する。
// 英語版の URL（/en, /en/...）は、英語の文言を読み込んでから引き継ぐ（事前描画と同じ内容で始めるため）
const start = () => {
  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(rootElement, app);
  } else {
    ReactDOM.createRoot(rootElement).render(app);
  }
};
const p = window.location.pathname;
if (p === '/en' || p.startsWith('/en/')) loadLang('en').then(start, start);
else start();
