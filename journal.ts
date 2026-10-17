// ジャーナル記事の URL（/blog/<slug>）と画像。本文は translations.ts の blog.items（id で対応）。
// slug は公開後に変えない（URL が変わると外部からのリンクが切れる）。
import { translations, Lang } from './translations';

const JOURNAL: Record<number, { slug: string; image: string }> = {
  12: { slug: 'claude-code-salesforce-kintone-ai', image: 'blog_strategy' },
  11: { slug: 'ai-agent-teams', image: 'blog_automation' },
  10: { slug: 'future-of-sales-ai-in-japan', image: 'blog_japan_s_future_in_sales_ai' },
  9: { slug: 'ai-transforming-the-future', image: 'blog_ai__transforming_the_future' },
  0: { slug: 'sales-automation-with-ai', image: 'blog_sales_ai' },
  1: { slug: 'openclaw-ai-agents-as-employees', image: 'blog_automation' },
  2: { slug: 'elevenlabs-lovable-voice-revolution', image: 'blog_voice_app' },
  3: { slug: 'redefining-voice-phone-operations', image: 'blog_vision' },
  4: { slug: 'tech-art-soul-product-philosophy', image: 'blog_philosophy' },
  5: { slug: 'day1-global-strategy', image: 'blog_strategy' },
  6: { slug: 'waking-sleeping-giants-global-expansion', image: 'blog_methodology' },
};

export type JournalPost = (typeof translations)['ja']['blog']['items'][number] & {
  slug: string;
  /** ページ内表示用（WebP） */
  image: string;
  /** SNS共有・構造化データ用（JPEG） */
  imageJpg: string;
  /** 2026-06-25 形式 */
  isoDate: string;
};

export const journalPosts = (lang: Lang): JournalPost[] =>
  translations[lang].blog.items.map((item) => {
    const m = JOURNAL[item.id] ?? { slug: `post-${item.id}`, image: 'blog_vision' };
    return {
      ...item,
      slug: m.slug,
      image: `/assets/${m.image}.webp`,
      imageJpg: `/assets/${m.image}.jpg`,
      isoDate: item.date.replace(/\./g, '-'),
    };
  });

export const JOURNAL_SLUGS = Object.values(JOURNAL).map((m) => m.slug);
export const journalPath = (slug: string) => `/blog/${slug}`;
export const findJournalPost = (lang: Lang, slug: string) => journalPosts(lang).find((p) => p.slug === slug);
