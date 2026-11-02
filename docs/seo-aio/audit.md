# SEO / AIO 監査（2026-11-02 時点）

対象: https://mgc-global01.com （サイト本体 31ページ＋コラム 94記事）。
方法: ビルド後のHTML（事前描画済み）を機械的に監査し、本番は curl・ヘッドレスブラウザで確認。
再実行: `npm run build` のあと、監査スクリプト（docs/seo-aio/README.md 参照）を実行する。

## 総括
- 土台は整っている: 全ページ事前描画（JSなしで本文・title・canonical・OGPが読める）、h1は全ページ1つ、canonical・OGP・サイトマップ・robots（AIクローラー許可）・llms.txt あり。表示速度も良好。
- 弱いのは **「AIが引用しやすい一次情報」と「サービスとコラムのつながり」**。サービスページは充実しているが、AIに聞かれやすい定義・比較・費用感の問いに一文で答える箇所が少ない。コラム94本はサービスページへの導線と相互リンクが弱い。
- **構造化データに事実誤り**: 研修の Course で受講料が 1,398,000円 になっている（正しくは 398,000円/1名・税込）。最優先で直す。

## 項目別
| 項目 | 状態 | 所見 |
|:--|:--|:--|
| title | ○ | 全ページ固有。末尾「 - ＭＧＣ株式会社」で統一済み |
| meta description | △ | 会社概要(40字)・お問い合わせ(53)・お知らせ(49)・ジャーナル記事(20〜77)が短い。80〜120字に |
| 見出し構造 | △ | h1は全ページ1つ。事業内容(5か所)・採用情報(2か所)で h2→h4 などの飛び |
| 構造化データ | △ | Organization/WebSite（全ページ）、Service・FAQPage（サービス）、Course（研修）、Article（ジャーナル）、BlogPosting・FAQPage（コラム）、BreadcrumbList。**Course の価格誤り**、Course に hasCourseInstance なし、研修・事業ページに FAQPage なし |
| canonical | ○ | 全ページ自己参照。送信完了・404・AI診断（非表示中）は noindex |
| OGP | ○ | ページ別画像あり。ジャーナル記事は og:image:width/height（1200×630固定値）と実画像サイズが不一致 |
| sitemap | ○ | 検索対象ページを網羅（ビルド時に載せ漏れ検査あり）。lastmod あり |
| robots.txt | ○ | 全許可＋GPTBot・ClaudeBot・PerplexityBot・Google-Extended 等を明示許可 |
| llms.txt | △ | **コラム一覧が先頭で、会社・事業・サービスの説明がほぼない**。AIが会社を説明・推薦する材料が足りない |
| 内部リンク | △ | サービス・事業ページはヘッダー/フッターから全ページ被リンク。コラム94本中46本は被リンク2以下。コラム→サービスの導線が業界と結びついていない |
| 表示速度 | ○ | 本番実測（モバイル・CPU4倍遅延・低速回線）: LCP 1.6〜2.2秒、CLS 0。転送量 200KB前後 |
| 画像alt | ○ | alt属性なしは0。装飾画像は alt=""（適切） |
| 外部の評価 | × | Search Console 未登録（確認タグ待ち）、Bing Webmaster Tools 未登録。sameAs（公式SNS等）なし |

## ページ別（サイト本体）
| パス | title長 | description長 | h1 | 見出し飛び | 構造化データ | 被リンク(内部) | 本文文字数 | 備考 |
|:--|--:|--:|--:|--:|:--|--:|--:|:--|
| `/404` | 21 | 28 | 1 | 0 | — | 0 | 527 | noindex |
| `/blog` | 20 | 49 | 1 | 0 | BreadcrumbList | 31 | 1922 |  |
| `/blog/ai-agent-teams` | 25 | 47 | 1 | 0 | BreadcrumbList, Article | 11 | 1387 |  |
| `/blog/ai-transforming-the-future` | 26 | 21 | 1 | 0 | BreadcrumbList, Article | 4 | 1180 |  |
| `/blog/claude-code-salesforce-kintone-ai` | 55 | 77 | 1 | 0 | BreadcrumbList, Article | 11 | 2314 |  |
| `/blog/day1-global-strategy` | 43 | 54 | 1 | 0 | BreadcrumbList, Article | 1 | 1185 |  |
| `/blog/elevenlabs-lovable-voice-revolution` | 56 | 64 | 1 | 0 | BreadcrumbList, Article | 1 | 1328 |  |
| `/blog/future-of-sales-ai-in-japan` | 20 | 20 | 1 | 0 | BreadcrumbList, Article | 11 | 1193 |  |
| `/blog/openclaw-ai-agents-as-employees` | 52 | 61 | 1 | 0 | BreadcrumbList, Article | 1 | 1313 |  |
| `/blog/redefining-voice-phone-operations` | 53 | 49 | 1 | 0 | BreadcrumbList, Article | 1 | 1149 |  |
| `/blog/sales-automation-with-ai` | 44 | 55 | 1 | 0 | BreadcrumbList, Article | 1 | 1253 |  |
| `/blog/tech-art-soul-product-philosophy` | 51 | 45 | 1 | 0 | BreadcrumbList, Article | 1 | 1148 |  |
| `/blog/waking-sleeping-giants-global-expansion` | 39 | 64 | 1 | 0 | BreadcrumbList, Article | 1 | 1405 |  |
| `/career` | 30 | 62 | 1 | 2 | BreadcrumbList | 126 | 1195 |  |
| `/cases` | 26 | 66 | 1 | 0 | BreadcrumbList | 126 | 3453 |  |
| `/column` | 33 | 90 | 1 | 0 | ItemList | 126 | 15998 |  |
| `/company` | 14 | 40 | 1 | 0 | BreadcrumbList | 126 | 1344 |  |
| `/contact` | 25 | 53 | 1 | 0 | BreadcrumbList | 126 | 842 |  |
| `/contact/thanks` | 14 | 40 | 1 | 0 | — | 0 | 595 | noindex |
| `/diagnosis` | 35 | 67 | 1 | 0 | — | 0 | 867 | noindex |
| `/` | 39 | 95 | 1 | 0 | FAQPage | 126 | 3616 |  |
| `/mission` | 35 | 66 | 1 | 0 | BreadcrumbList | 126 | 1222 |  |
| `/privacy-policy` | 20 | 72 | 1 | 0 | BreadcrumbList | 126 | 2689 |  |
| `/service/ai-phone` | 32 | 68 | 1 | 0 | BreadcrumbList, Service, FAQPage | 126 | 3587 |  |
| `/service/ai-sales` | 35 | 65 | 1 | 0 | BreadcrumbList, Service, FAQPage | 126 | 3752 |  |
| `/service/salesforce-ai` | 42 | 82 | 1 | 0 | BreadcrumbList, Service, FAQPage | 126 | 4143 |  |
| `/terms-of-service` | 17 | 49 | 1 | 0 | BreadcrumbList | 126 | 1454 |  |
| `/training` | 35 | 77 | 1 | 0 | BreadcrumbList, Course, Course | 126 | 1751 |  |
| `/works` | 46 | 112 | 1 | 5 | BreadcrumbList | 126 | 3089 |  |
| `/works/ai-business-launch` | 39 | 82 | 1 | 0 | BreadcrumbList, Service | 31 | 1344 |  |
| `/works/ai-solutions` | 36 | 103 | 1 | 0 | BreadcrumbList, Service | 31 | 1225 |  |
| `/works/cross-border` | 41 | 77 | 1 | 0 | BreadcrumbList, Service | 31 | 1043 |  |

## コラム（94記事）
- 全記事: h1=1、canonical あり、BreadcrumbList・BlogPosting・FAQPage あり、著者は代表（Person）
- 平均本文 約5,100字。被リンク（内部）平均4.1、2以下が46記事

## 再監査（2026-11-02・サイクル7時点）
| 指標 | サイクル0 | サイクル7 |
|:--|--:|--:|
| 検索対象ページ数（サイトマップ） | 123 | 131 |
| 構造化データ（JSON-LD、本番・全ページ合計） | 389 | 428（すべて妥当） |
| FAQPage | 98 | 105 |
| 事実誤り（研修 Course の価格） | 1 | 0 |
| 見出しの飛び | 7 | 0 |
| 内部被リンク2以下のコラム | 46 | 12 |
| 内部被リンク1のジャーナル記事 | 7 | 0（サイクル7で前後リンク化） |
| llms.txt の会社・サービス情報 | なし | あり（会社概要・4事業・研修の実数・事例・ガイド・用語集） |
| 「◯◯とは」定義・比較表・用語集 | なし | サービス3・ガイド3・用語15 |

残り: description が 60字台のページ（採用情報・会社理念・利用規約・一部のジャーナル記事）、本文が薄めのページ（お問い合わせ・ジャーナルの一部）。外部の評価（Search Console・Bing Webmaster Tools）は未登録。
