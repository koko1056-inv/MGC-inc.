import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
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
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
