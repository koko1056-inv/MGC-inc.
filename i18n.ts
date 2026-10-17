// 英語の文言は初回表示に使わないため、言語を切り替えたときに別ファイルから読み込む
// （初回に読み込むJSを減らす）。各データの en は、読み込むまで日本語で代用している。
import type { Lang } from './translations';
import { translations } from './translations';
import { serviceContent } from './serviceContent';
import { caseContent } from './caseContent';
import { legalContent } from './legalContent';

let enLoading: Promise<void> | null = null;

export const loadLang = (lang: Lang): Promise<void> => {
  if (lang === 'ja') return Promise.resolve();
  enLoading ??= Promise.all([
    import('./translations.en'),
    import('./serviceContent.en'),
    import('./caseContent.en'),
    import('./legalContent.en'),
  ]).then(([t, s, c, l]) => {
    translations.en = t.en;
    serviceContent.en = s.en;
    caseContent.en = c.en;
    legalContent.en = l.en;
  });
  return enLoading;
};
