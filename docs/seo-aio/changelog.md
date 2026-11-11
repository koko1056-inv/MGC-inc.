# SEO / AIO 変更履歴

各サイクルで「何を変えたか・狙い・確認結果・次にやること」を記録する。

## サイクル0（2026-11-02）監査
- 変更: なし（監査のみ）。`docs/seo-aio/audit.md`・`queries.md`・`backlog.md` を作成、監査スクリプト `scripts/seo-audit.py` を追加
- 主な所見: 土台は良好（事前描画・canonical・OGP・sitemap・robots・速度）。研修 Course の価格が誤り（1,398,000円）。llms.txt に会社・サービスの説明がない。コラムとサービスの内部リンクが弱い
- 次: サイクル1でバックログ #1〜#3

## サイクル1（2026-11-02）事実誤りの修正・llms.txt・description — PR #61
- 変更:
  - 研修 Course の受講料が構造化データで 1,398,000円 になっていた誤りを修正（正: 398,000円。「1名」の1を拾っていた）。hasCourseInstance（通学/オンライン・PT20H）、url、inLanguage を追加
  - llms.txt を「会社概要 → 事業・サービス → 研修（受講料・時間）→ 導入事例 → 主要ページ → コラム」の順に作り直し（掲載済みの事実のみ。コラム生成時に自動更新）
  - meta description を充実: 会社概要 40→103字、お問い合わせ 53→104字、お知らせ 49→106字（日英）。抜粋が70字未満のジャーナル記事は筆者を補足
- 狙い: AI・検索に誤った価格を渡さない。AIが会社とサービスを説明・推薦するための材料を llms.txt で最初に渡す。検索結果・AI要約の説明文の質
- 本番確認: サイトマップ全123ページが200、JSON-LD 389ブロックすべて妥当（Course 2件の price=398000）、llms.txt の新構成、問い合わせAPI（空送信）400 で正常
- 次: サイクル2で #4（サービスの定義・FAQ）、#6（研修FAQPage）

## サイクル2（2026-11-02）サービスの定義文・AI向けFAQ・研修FAQ
- 変更:
  - サービス3ページに「◯◯とは」の定義ブロック（h2＋一段落）を追加し、Service 構造化データの description にも使用
    （AI営業とは／AI電話（音声AI）とは／Salesforce AI活用支援とは）
  - サービスFAQに、AIに聞かれやすい質問を各2件追加（掲載済みの事実の範囲。金額は書かない）
    - AI営業: テレアポ代行との違い／費用の決まり方
    - AI電話: IVR・ボイスボットとの違い／費用の決まり方
    - Salesforce AI: 標準AI機能（Agentforce等）と個別開発の選び方／何から始めるか
  - 研修ページに「よくあるご質問」（受講料・時間・形式・対象・流れ、全て掲載済みの実数）と FAQPage を追加
- 狙い: 「◯◯とは」「違い」「費用」「研修 費用」系の質問で、ページの文章がそのまま答えとして引用されること
- ビルド確認: FAQPage の回答がすべてHTML本文にも表示されていること、各ページのコンソールエラーなし、問い合わせフォーム→送信完了の遷移
- 本番確認（PR #62）: 全123ページ200、JSON-LD 390件すべて妥当（FAQPage 99件。研修5問・サービス各6問）、「◯◯とは」ブロック表示、問い合わせAPI正常
- 次: サイクル3で #5（コラム→サービスの内部リンク）、#11（地域）、#12（見出しの飛び）

## サイクル3（2026-11-02）コラムとサービスのつながり・地域・見出し
- 変更:
  - コラム本文末に「このテーマに関するMGCのサービス」を自動挿入（本文中の語でAI電話・AI営業・Salesforce AI・研修を判定、該当なしはAIソリューション）。94記事中19記事が個別サービス、75記事がAIソリューションへ
  - 関連コラムを「同業界の先頭3本」から「同業界の前後の記事」に変更（古い記事にもリンクが回る）
  - コラムのフッターを4事業の構成に合わせ、CTAの「予約する」を「申し込む」に統一
  - Organization に areaServed（日本・京都府）
  - 見出しの飛びを解消（事業内容・採用情報・トップの h4 → h3）
- 狙い: コラムの評価をサービスページへ渡す／サービスとコラムの話題のつながりを検索・AIに示す／古い記事の発見性
- ビルド確認: コラムの内部被リンク2以下 46記事→12記事（最小2）、見出しの飛び 7→0、コラムでCSP違反なし
- 本番確認（PR #63）: 全123ページ200、JSON-LD 390件すべて妥当、コラムに関連サービス枠・Organization に areaServed、問い合わせAPI正常
- 次: サイクル4で #7（用語集）、#13（OGP・WebSiteの整合）

## サイクル4（2026-11-02）用語集・OGP/構造化データの整合
- 変更:
  - 用語集ページ `/glossary` を新設（生成AI、LLM、AIエージェント、RAG、ハルシネーション、プロンプト、ボイスボット、IVR、ACW、CRM、SFA、API連携、OFF-JT、リスキリング、DX の15語。日英）
    - 各用語に見出し（h2）・一般的な定義・関連するMGCのページへのリンク。用語ごとのアンカー（例 `/glossary#rag`）
    - DefinedTermSet / DefinedTerm の構造化データ、サイトマップ、フッター、llms.txt に追加
  - ページ内アンカー（#用語）への移動が、画面内遷移の処理で先頭に戻されないよう修正（直接開いた場合も該当位置へ）
  - og:image:width/height を 1200×630 の共有画像のときだけ出す（記事画像では実寸と食い違っていた）
  - WebSite に @id、publisher を Organization の @id 参照に
- 狙い: 「◯◯とは」系の質問で定義として引用される／用語からサービスへの導線／構造化データ同士のつながりを明確に
- ビルド確認: 32ページ事前描画、アンカー移動・関連リンク・フッター導線の動作、コンソールエラーなし
- 本番確認（PR #64）: 全124ページ200（用語集を含む）、JSON-LD 394件すべて妥当（DefinedTermSet 1件）、llms.txt に用語集、CSP適用、問い合わせAPI正常
- 次: サイクル5で #9（導入事例の個別ページ）、#8（比較記事）

## サイクル5（2026-11-02）導入事例の個別ページ
- 変更:
  - 導入事例3件に個別ページを新設: `/cases/callcenter-voice-ai`・`/cases/distributor-ai-outreach`・`/cases/manufacturer-field-voice-ai`
    - 何をしたかを一文にした見出し（h1）を各事例に追加（掲載済みの内容から。数値は既存の「1ヶ月で商談10件」のみ）
    - 課題・打ち手・設計上の要点を h2/h3 で構造化。Article 構造化データ、3階層パンくず、ほかの事例への導線
  - 一覧（/cases）は概要・成果と「事例の詳細を見る」に整理（全文は個別ページへ。旧 `/cases#slug` のリンクも該当カードへ移動）
  - トップの事例カード、サービスページの関連事例、llms.txt の事例リンクを個別ページへ
  - サイトマップに3件追加
- 狙い: 事例単位でURLを持たせ、AI・検索が個別に引用・リンクできるようにする／タイトルに「何をしたか」を入れて検索意図に合わせる
- ビルド確認: 35ページ事前描画、一覧→詳細・ほかの事例・パンくず・旧ハッシュ・トップ/サービスからの導線、未知のslugは404、コンソールエラーなし
- 本番確認（PR #65）: 全127ページ200（事例3ページを含む）、JSON-LD 406件すべて妥当（Article 14件）、問い合わせAPI正常
- 次: サイクル6で #8（比較記事）、#10（事業ページの充実）

## サイクル6（2026-11-02）比較・選び方ガイド・事業ページのFAQ
- 変更:
  - `/guide`（一覧）と比較ガイド3本を新設（日英）。比較表（th/td の表組み）・選び方・FAQ・関連サービスへの導線
    - `/guide/ai-phone-vs-ivr-voicebot`: AI電話・IVR・ボイスボットの違いと選び方
    - `/guide/ai-sales-vs-telemarketing`: AI営業とテレアポ代行の違いと選び方
    - `/guide/salesforce-standard-ai-vs-custom`: Salesforceの標準AI機能と個別開発、どちらを選ぶか
    - 内容はサービスページ掲載済みの事実と一般的な仕組みの説明のみ（金額・件数・声は書かない）
    - Article＋FAQPage（各ガイド）、ItemList（一覧）、パンくず、サイトマップ、フッター、llms.txt
  - サービス3ページの定義ブロックから対応するガイドへリンク
  - 事業ページ3つ（AIソリューション・AI事業立ち上げ支援・クロスボーダー）に FAQ（掲載済みの事実から各2〜3問）と FAQPage
- 狙い: 「違い」「どちらを選ぶ」系の質問に表で直接答え、AIの回答に引用されやすくする／事業ページの薄さの解消
- ビルド確認: 39ページ事前描画（サイトマップ載せ漏れ検査で /guide のURL誤りを検出→修正）、FAQの回答がすべて本文に表示、スマホで横スクロールなし、問い合わせフォーム→送信完了、コンソールエラーなし
- 本番確認（PR #66）: 全131ページ200（ガイド4ページを含む）、JSON-LD 428件すべて妥当（FAQPage 105件）、問い合わせAPI正常
- 次: サイクル7 — 監査を再実行して数値を更新し、残りのバックログと新しい施策を洗い出す

## サイクル7（2026-11-02）再監査・内部リンクの残り・IndexNow
- 変更:
  - 再監査を実施し `audit.md` に前後比較を追記。バックログに #16〜#20 を追加
  - ジャーナル記事の「ほかの記事」を前後の記事に変更（被リンク1の記事 7→0）
  - description を充実: AI営業 65→約100字、AI電話 68→約100字、導入事例 66→約120字（掲載済みの事実のみ）
  - IndexNow を導入: キーファイル（公開して問題のない所有確認用の値）と送信スクリプト `scripts/indexnow.mjs`。デプロイ後に全URLを送信
- 狙い: 古い記事の発見性、主要ページの検索結果での説明、Bing など IndexNow 対応エンジンへの更新の即時通知（Bing の索引はAI検索でも使われる）
- 本番確認（PR #67）: 全131ページ200、JSON-LD 428件すべて妥当、description 反映、IndexNow キー公開（デプロイ待ちで一度404→公開後に再送信し HTTP 200）、問い合わせAPI正常
- 次: サイクル8で #16（llms-full.txt）、#17（コラム→用語集の自動リンク）、#18（代表の Person 構造化データ）

## サイクル8（2026-11-02）llms-full.txt・用語集への自動リンク・代表の Person
- 変更:
  - `llms-full.txt`（約62KB）をビルド時にサイトのデータから生成: 会社概要、4事業（提供内容・FAQ）、サービス3つの本文（定義・比較・進め方・向き不向き・費用の考え方・FAQ）、研修（受講料・時間・FAQ）、導入事例、比較ガイド（表）、用語集、トップのFAQ。llms.txt からリンク
  - コラム本文の用語（生成AI、RAG、ハルシネーション、LLM、DX、API連携、CRM 等）を、各記事で初出のみ用語集の該当箇所へ自動リンク（59記事・129リンク）
  - 代表の Person（@id: /company#ceo）を会社概要ページに定義し、Organization の founder・ジャーナルとコラムの author から @id で参照
- 狙い: AIが1ファイルでサイト全体の正確な説明を得られる／用語集を軸にした話題のつながり／「誰が書いたか・誰の会社か」の一貫性（E-E-A-T）
- ビルド確認: 39ページ、JSON-LD 720ブロック（コラム含む）すべて妥当、用語リンク→用語集の該当位置へ移動、llms-full.txt 配信、コンソールエラーなし
- 本番確認（PR #68）: 全131ページ200、JSON-LD 429件すべて妥当（Person 1件）、llms-full.txt 公開、コラムの用語リンク表示、問い合わせAPI正常、IndexNow 再送信 HTTP 200
- 次: サイクル9で #19（IndexNow を日次コラムのワークフローに）、#20（残りの description）

## サイクル9（2026-11-02）IndexNow の自動化・残りの description
- 変更:
  - 日次コラム自動投稿のワークフローに IndexNow 送信を追加（記事の公開を確認してから、新記事・コラム一覧・llms.txt を送信。失敗しても公開には影響しない）
  - description を充実: 会社理念 66→約110字、採用情報 62→約110字、利用規約 49→約110字（日英。掲載済みの内容のみ）
- 狙い: 新しいコラムを検索エンジンに即日知らせる／主要ページの説明の質
- ビルド確認: 39ページ、ワークフローの YAML 構文
- 本番確認（PR #69）: 全131ページ200、JSON-LD 429件すべて妥当、description 反映、IndexNow 3URL 送信 HTTP 200
- 次: 計測の土台（Search Console・アクセス解析）

## 2026-11-03 デイリー: 計測の土台
- 数値: 取得できず（Search Console は接続・認証情報なし、Vercel Web Analytics はプロジェクトで無効）。詳細は `metrics/2026-11-03.md`
- 変更:
  - `scripts/gsc-report.mjs`: Search Console API から前日・7日・28日の数値（ページ別・クエリ別の増減）、サイトマップ状態、主要ページのインデックス状況を取得して `metrics/YYYY-MM-DD.md` に保存
  - `.github/workflows/seo-daily-report.yml`: 毎朝 08:30 JST に上記を自動実行（Secrets `GSC_SERVICE_ACCOUNT_JSON` 登録後に有効）
  - バックログ: #15（計測）を最優先に変更
- 確認: スクリプトの認証経路（ダミー鍵でGoogleのトークンAPIまで到達し、想定どおり「アカウントなし」で拒否）、ワークフローの YAML 構文、本番の健全性（131URL・JSON-LD 429件）
- 次: 代表の操作（Web Analytics 有効化、サービスアカウント登録）後に初回の数値を取得し、ベースライン（11/2 施策前後）を記録

## サイクル10（2026-11-03）Web Analytics の本番確認・用語集の拡充・問い合わせの起点計測
- 計測の確認（本番）:
  - `/_vercel/insights/script.js` 200、ページ表示ごとに `POST /_vercel/insights/view` 200（トップ・コラムとも）。SPA内の画面遷移（トップ→研修→用語集）も1回ずつ記録。CSP違反なし
  - 注意: 計測スクリプトはヘッドレスブラウザ（自動テスト）を記録しない仕様。確認は通常のブラウザ相当の設定で実施
  - 集計の読み出し（Vercel の Web Analytics クエリAPI）は、11/3 時点でまだ「無効」と返る。収集は動いているため、ダッシュボード側の反映待ちと判断し、次回のデイリーで再確認
- 変更:
  - 用語集に10語を追加（機械学習、チャットボット、OCR、画像認識、需要予測、パーソナライズ、暗黙知、属人化、匿名化、PoC。日英・一般的な定義のみ）。コラムで多く使われている語を選定し、コラム本文から初出を自動リンク（新語だけで131リンク、合計リンク253）
  - 問い合わせ送信イベント（`contact_submit`）に起点ページ `entry` を追加。タブで最初に開いたページ（コラムから来た場合はそのコラムのパス）だけを記録し、個人は特定しない
- 狙い: コラムで使う専門用語の定義を自サイト内で完結させる（話題の網羅性・内部リンク）／どのページ・コラムが問い合わせにつながったかを数値で見られるようにする
- ビルド確認: 39ページ、用語リンク→用語集の該当位置へ移動、コラム→問い合わせ→送信→完了ページ（entry にコラムのパスが入る）

## サイクル11（2026-11-03）業界別のコラム一覧ページ・似たタイトルの整理
- 計測: 代表が Vercel の Analytics タブで数値の表示を確認。ただし集計の読み出しAPI（MCP経由）は引き続き「無効」と返るため、数値はまだ自動取得できない。次回のデイリーで再確認
- 変更:
  - 業界別のコラム一覧ページを12ページ新設（`/column/industry/<業界>`。例: 製造業のAI活用コラム）。紹介文はその業界の記事が実際に扱うテーマだけで構成。CollectionPage＋ItemList、パンくず（3階層）、ほかの業界への相互リンク、関連サービスへの導線
  - 記事側: パンくずと業界チップから業界ページへリンク、BreadcrumbList を4階層（ホーム→コラム→業界→記事）に。コラム一覧に業界ページへの通常リンク（JSなしでも辿れる）を追加。サイトマップ・llms.txt に業界ページを追加
  - タイトルの重複対策: 自治体（6本）・士業（8本）で似通っていた記事の title タグを、各記事の見出し（扱っている内容）に沿って書き分け（h1 と本文は変更なし）
  - 不具合修正: 記事データの title が「- ＭＧＣ株式会社」で終わる13記事で、title タグの末尾が二重になっていたのを修正
- 狙い: 「業界名 AI活用」系の検索と、AIが業界ごとに記事をまとめて参照できる入口を作る／同じ業界内の記事同士が検索で食い合うのを減らす
- ビルド確認: 39ページ＋業界ページ12、title の重複なし、記事→業界ページ→問い合わせ→送信→完了ページ

## サイクル12-A（2026-11-03）研修ページの組み直し
- 依頼: 研修・サービス・料金の見せ方の改善（構成の参考: 他社サイト。文章は流用しない）。新しい数字・事例・実績・助成金の表現は書かない
- 変更（/training）:
  - 冒頭に「こんな方に」（4項目。既存の対象の言い換え）
  - 2コースの比較表（対象／ねらい／実施形態／標準時間／受講料／主なテーマ。値はコースのデータから表示）
  - 各コースを「特徴3点・習得できること・研修詳細」の同じ型に。主なテーマは見出しつきの箇条書き（時間配分は書かない）
  - 「研修のあとに」: 実践支援・振り返り → AIソリューション（PoC 2〜4週間）
  - FAQ 3問を追加（ITに詳しくなくても受講できるか／研修だけ頼めるか／受講後に実装まで頼めるか。既存ページの記載の範囲）
  - llms-full.txt に各コースの特徴・習得できること・研修のあとの流れを追加
- 構造化データ: Course・CourseInstance・Offer（398000 JPY）は本番と完全に同一。FAQPage は既存5問をそのまま残し、3問を追加（8問）
- 確認: ビルド39ページ、デスクトップ・モバイルで横スクロールなし、コンソールエラーなし

## サイクル12-B（2026-11-03）料金の考え方ページ（/pricing）
- 新設 /pricing: 研修の受講料・標準時間・実施形態（研修データから表示）、AI営業・AI電話・Salesforce AI の費用の構成と費用が変わる要因（各サービスの「費用の考え方」をそのまま表示）、期間の目安（パイロット運用2〜4週間・本番運用1〜3ヶ月、スコープにより変わる）、初回相談・お見積もりまで無料。新しい数字・料金は追加していない
- 導線: トップFAQ「料金体系を教えてください」、各サービスページの費用セクション、フッター（事業・サービス）からリンク
- サイトマップ・llms.txt（料金の節と主要ページ）・llms-full.txt に追加。vercel.json に書き換えルールを追加
- 確認: ビルド40ページ、各リンクの画面内遷移、モバイルで横スクロールなし、コンソールエラーなし

## サイクル12-B2（2026-11-03）サービスの概要ボックス・進め方と期間の対応
- 概要ボックス（対象となる業務／期間の目安／費用の構成／お渡しするもの）を、AI営業・AI電話・Salesforce AI（サービスページ上部）と AI事業立ち上げ（事業ページ上部）に追加。各ページの既存の記載だけで作成し、根拠のない項目は省いた（AI営業は期間、AI事業立ち上げは期間・費用を省略）
- 進め方と公開済みの期間（PoC 2〜4週間・本番運用1〜3ヶ月）を対応させた。AI電話は「限定運用」と「調整と拡大」、Salesforce AI は「実装と並走」と「展開と定着」、トップと /works の進め方は 02 に表示。スコープで変わる旨も明記。新しい期間は追加していない
- llms-full.txt に各サービス・AI事業立ち上げの概要を追加
- 確認: ビルド40ページ、モバイルで横スクロールなし、コンソールエラーなし

## サイクル12-C1（2026-11-03）問い合わせフォームの種別の整理
- 種別を7つに整理: 研修／AI営業／AI電話／Salesforce AI／AI事業立ち上げ／クロスボーダー／その他（AI導入全般・複合的なご相談）。旧「AIコンサルティング・AI開発」は「その他（AI導入全般）」に、Inbound/Outbound はクロスボーダーに統合
- 各ページのCTAから種別を選んだ状態でフォームを開く: 研修・AI営業・AI電話・Salesforce AI・AI事業立ち上げ・クロスボーダー（今回追加）・AIソリューション（→その他）
- 送信処理（/api/contact）、送信イベントの起点ページ（entry）、CTAクリックの計測は変更なし
- 確認: 7つの導線で初期選択を確認、送信→完了ページ、メール本文の [Topic] に新しい種別が入ることを確認

## サイクル12-C2（2026-11-03）事業の3段階の流れ・お悩み
- トップと /works に「学ぶ（研修）→ 成果をつくる（AIソリューション）→ 広げる（AI事業立ち上げ）」の3段階を追加（研修を入口に）。STEP 2 は既存の進め方の01・02、STEP 3 は03にあたると明記し、「01・02だけのご依頼でも問題ありません」の一文はそのまま残した
- トップに「こんなお悩みはありませんか」を3つ（AI営業・AI電話・Salesforce AI の各ページにある課題の書き方から作成）。各サービスページへリンク
- llms-full.txt に3段階の流れを追加
- 確認: ビルド40ページ、各リンクの画面内遷移、見出しの階層、モバイルで横スクロールなし、コンソールエラーなし

## サイクル12-D（2026-11-03）コラム2本（研修の選び方・AI導入費用の内訳）
- 追加: 「法人向けAI研修の選び方チェックリスト」（/column/ai-training-selection-checklist）、「AI導入費用の内訳の考え方 — 初期費用・月額費用・実費」（/column/ai-cost-breakdown-initial-monthly-usage）
- 外部の相場の数字・助成金の補助率は使わず、MGCが公開している費用の構造（研修の受講料と時間、初期・月額・実費／従量・ライセンス、期間の目安、初回相談無料）と判断の観点だけで構成。各記事 FAQ 3問
- 本文から /training と /pricing へのサイト内リンク（新しいブロック type: links。サイト内パスのみ許可）
- 業種を問わない記事のため、分類「業種共通」（/column/industry/general）を追加。日次の自動投稿のローテーションには入れていない（columns.json の extraIndustries）
- 確認: ビルド40ページ＋コラム96本＋業界ページ13、BlogPosting/FAQPage/BreadcrumbList 妥当、リンクから /pricing へ移動、モバイルで横スクロールなし

## サイクル13-A（2026-11-03）研修の伴走オプション・助成金申請サポート（松尾さんの決定を反映）
- 決定: 研修の受講料は据え置き（1名398,000円（税込）・標準20時間）。研修後の伴走オプション（個別見積もり）と助成金申請サポート（研修受講者は無料）を追加
- /training に「オプション・サポート」を追加。伴走オプションは既存の「実践支援・振り返り」の範囲で記述し金額は書かない。助成金は「申請をサポートします（受給できるかどうかは要件によります）」の範囲で、対象の言い切り・補助率・上限額は書かない
- FAQ を2問追加（研修のあとも伴走してもらえるか／助成金を活用できるか）。FAQPage は既存8問をそのまま残して10問に
- /pricing の研修の項、llms.txt、llms-full.txt にも反映
- 構造化データ: Course/Offer（398000 JPY）は本番と完全に同一。伴走オプション・申請サポートには価格の構造化データを付けていない

## サイクル13-B（2026-11-03）AIソリューションの料金目安「PoC 100〜300万円」
- 決定: AI営業・AI電話・Salesforce AI の料金目安として PoC 100〜300万円を掲載。本番開発・月額の金額は書かず「本番導入は要件に応じて個別見積もり」
- 反映先: /pricing（PoCの料金目安の枠、リード文、description）、各サービスの概要ボックス（「料金の目安」）と費用の考え方の表（「PoC（目安）」）、トップFAQ「料金体系を教えてください」、llms.txt、llms-full.txt
- 構造化データ: 3サービスの Service に offers（PoC、priceSpecification minPrice 1000000 / maxPrice 3000000 JPY）。本番導入・月額は載せない。研修の構造化データは本番と完全に同一

## サイクル14-A（2026-11-03）料金目安の表記ゆれをなくす
- PoC 100〜300万円（本番導入は個別見積もり）の決定後も「一律の価格表は出していません」だけが残っていた箇所を整合: 3サービスの「費用の考え方」のリード文、AI営業・AI電話の費用FAQ、トップFAQ「小さな業務から試したい」、AIソリューションFAQ「小さく試すことはできますか」、比較ガイド（AI営業とテレアポ代行）のFAQ、コラム「AI導入費用の内訳の考え方」（本文・FAQ、dateModified を更新）。日英
- 狙い: 検索結果・AIの回答でページごとに料金の説明が食い違わないようにする（同じ問いに同じ答え）

## サイクル14-B（2026-11-03）コラムの共通ヘッダー・フッターと description の補強
- コラム（静的ページ）のヘッダーを本体サイトの主なメニューに合わせた: 事業内容／研修／料金／導入事例／コラム／会社情報＋お問い合わせ（旧: 事業内容／AI営業／AI電話／Salesforce AI／導入事例／研修／コラム）
- コラムのフッターに 料金の考え方・比較・選び方ガイド・用語集・お知らせ・ジャーナル を追加（本体サイトのフッターと同じ構成に）
- 再監査（150ページ）: title・h1・見出しの飛び・alt・被リンクは問題なし。description が短かった3ページを補強（ジャーナル2本は抜粋の後に本文の書き出しを文単位で追加、業種共通の一覧ページは紹介文を具体化）。noindex の 404・送信完了・診断は対象外
- 確認: ヘッダー・フッターのリンク22件すべて200、モバイルで横スクロールなし

## 2026-11-03 表記変更: 「代表が担当」→「専門チームが担当」（松尾さんの指示）
- 代表が一人で担当・直接対応すると読める表現を「専門チームが（一貫して）担当」にそろえた（日英）
  - トップ「MGCの進め方」01 の見出しと説明
  - トップ／事業内容の「業務の棚卸しから、事業化まで。」リード文
  - お問い合わせページの description、送信完了ページのリード文
  - 会社概要の Person（代表）の構造化データ description:「〜まで自ら担当する」→「〜を展開する同社を率いる」
  - llms.txt の「進め方の特徴」、llms-full.txt に進め方（専門チームが一貫して担当）を追加
- 残したもの: 会社概要・代表メッセージ、コラム・ジャーナルの執筆者表記（代表取締役 松尾 心夢）、プライバシーポリシーの個人情報の管理責任者の記載
- 人数・メンバー名・経歴など新しい事実は書いていない

## 2026-11-03 コラムの標準化（1）スタイルガイドとサムネイルの全差し替え
- 代表の評価が高かった「法人向けAI研修の選び方チェックリスト」を標準とし、`docs/seo-aio/column-style-guide.md` に型（構成・見出し・文体・チェックリストの使い方・導入と結び・CTAと内部リンク）とサムネイルの作り方を整理
- サムネイルをテンプレート化: `scripts/column/thumbnail-prompt.mjs`（画風は固定、業種と題名のキーワードで場所と場面が決まる）、`scripts/column/thumbnail.mjs`（1400×788 WebP と 1200×630 JPEG に書き出し）。devDependencies に sharp を追加
- 全コラム95本（標準の記事を除く）と業種の予備画像13枚を、標準と同じ写真調で生成して差し替え。OGP・構造化データは JPEG（1200×630、og:image:width/height 付き）を使う
- 日次の自動投稿（generate-column.mjs）の見本を標準の記事に変更し、構成ルールを新しい型に合わせた。自動投稿の記事は業種の予備画像（同じ画風）を使う
- 書き直しの検査スクリプト `scripts/column/check-rewrite.mjs` を追加（slug・タイトル不変、新しい数字・社名がないこと、新しい型になっていること）
- links ブロックの文字列が plainText で "[object Object]" になる不具合を修正

## 2026-11-03 コラムの標準化（2）本文の書き直し 1/10本目まで（10本）
- 対象（サービスに近い順）: hr-reskilling-ai real-estate-internal-knowledge-sharing-ai real-estate-inquiry-response-ai public-resident-window-ai-automation hospitality-service-automation hr-job-description-scout-ai hospitality-personalized-guest-service-ai real-estate-valuation-market-analysis-ai finance-personalized-proposal-governance healthcare-family-communication-ai
- 新しい型（前提の節 → チェックリスト4〜5本 → MGCの場合 → links → まとめ → FAQ 3問）に整理。slug・タイトル・seoTitle・description・keywords・画像は不変、dateModified を更新
- 新しい数字・事例・社名は追加なし（check-rewrite.mjs で検査）。出典のない効果の数字や煽る表現（劇的・必須など）は弱めた／外した。MGCに関する未公開の記述は公開済みの事実に置き換えた

## 2026-11-03 コラムの標準化（3）本文の書き直し 11〜20本目（10本）
- 対象: real-estate-renovation-proposal-ai, real-estate-property-listing-matching-ai, hr-recruitment-process-ai, manufacturing-demand-forecasting-ai, real-estate-listing-content-creation-ai, public-ai-internal-document-optimization, education-teacher-skill-upgrading-ai, public-local-government-ai-practical-guide, construction-logistics-material-ai, hr-career-counseling-ai-support
- 型・検査・変更方針は（2）と同じ。check-rewrite.mjs で10本すべて OK

## 2026-11-03 コラムの標準化（4）本文の書き直し 21〜30本目（10本）
- 対象: hr-employee-experience-knowledge-ai, hr-ai-matching-optimization, finance-backoffice-ai-automation, retail-customer-support-hybrid-ai, public-resident-service-ai-efficiency, public-dx-ai-implementation, hospitality-guest-experience-and-training, healthcare-discharge-planning-coordination-ai, retail-generative-ai-efficiency, professional-high-value-advisory-ai
- 型・検査・変更方針は（2）と同じ。check-rewrite.mjs と構成順の検査で10本すべて OK

## 2026-11-03 コラムの標準化（5）本文の書き直し 31〜40本目（10本）
- 対象: education-personalized-learning-support, finance-fraud-detection-operational-resilience, real-estate-contract-document-ai, logistics-safety-management-ai, hospitality-quality-standardization-and-waste-reduction, hospitality-demand-forecasting, public-regional-revitalization-ai-strategy, professional-strategic-ai-partner, professional-ai-legal-accounting-transformation, professional-accounting-ai
- 型・検査・変更方針は（2）と同じ。check-rewrite.mjs と構成順の検査で10本すべて OK

## 2026-11-03 コラムの標準化（6）本文の書き直し 41〜50本目（10本）
- 対象: logistics-expert-skill-digitalization-ai, logistics-dispatch-planning-ai, hospitality-operational-efficiency-ai, finance-knowledge-management-compliance-ai, finance-ai-reliability-governance-strategy, finance-ai-implementation-guide, construction-knowledge-transfer-ai, construction-document-ai-automation, retail-store-operation-staff-ai, retail-omo-customer-journey-ai
- 型・検査・変更方針は（2）と同じ。check-rewrite.mjs と構成順の検査で10本すべて OK

## 2026-11-03 コラムの標準化（7）本文の書き直し 51〜60本目（10本）
- 対象: retail-dynamic-pricing-markdown-optimization, retail-demand-forecasting-inventory, retail-ai-md-merchandising-trends, retail-ai-driven-personalization, real-estate-property-maintenance-inspection-ai, public-ai-efficiency-governance, professional-risk-management-knowledge-digitization, professional-practical-ai-implementation, professional-logic-standardization-response-efficiency, professional-knowledge-work-delegation
- 型・検査・変更方針は（2）と同じ。check-rewrite.mjs と構成順の検査で10本すべて OK

## 2026-11-03 コラムの標準化（8）本文の書き直し 61〜70本目（10本）
- 対象: professional-document-review-automation, manufacturing-skill-transfer-ai, manufacturing-production-scheduling-ai, manufacturing-process-optimization-ai, manufacturing-predictive-maintenance, manufacturing-knowledge-management-ai, manufacturing-inventory-optimization-ai, manufacturing-inspection-ai, logistics-warehouse-optimization-ai, logistics-loading-optimization-ai
- 型・検査・変更方針は（2）と同じ。check-rewrite.mjs と構成順の検査で10本すべて OK

## 2026-11-03 コラムの標準化（9）本文の書き直し 71〜80本目（10本）
- 対象: logistics-last-mile-route-optimization, logistics-document-automation-ai, logistics-demand-forecasting-ai, hr-talent-management-retention-ai, hr-interview-evaluation-standardization-ai, hospitality-shift-optimization-and-labor-management, hospitality-customer-feedback-analysis, healthcare-staff-scheduling-shift-optimization-ai, healthcare-multilingual-staff-training-ai, healthcare-monitoring-sensing-ai
- 型・検査・変更方針は（2）と同じ。check-rewrite.mjs と構成順の検査で10本すべて OK

## 2026-11-03 コラムの標準化（10）本文の書き直し 81〜95本目（15本・完了）
- 対象: healthcare-incident-reporting-safety-ai, healthcare-documentation-efficiency-ai, healthcare-care-planning-risk-prediction-ai, finance-unstructured-data-compliance, finance-risk-assessment-customer-support-ai, education-student-wellbeing-ai-monitoring, education-feedback-and-curriculum-ai, education-data-driven-management-support, education-ai-co-teacher-implementation, education-administrative-efficiency-ai, construction-site-efficiency-ai, construction-safety-quality-ai-vision, construction-progress-management-ai, construction-cost-estimation-ai, ai-cost-breakdown-initial-monthly-usage
- 型・検査・変更方針は（2）と同じ。check-rewrite.mjs と構成順の検査で OK（費用のコラムは本日すでに dateModified を更新済みのため、日付の変更なし）
- これで標準の記事を除く全95本の本文が新しい型になった

## 2026-11-03 AI電話ページの改善（コールセンター向けAIエージェントとしての位置付け）
- 参考: 他社サイトの構成と見せ方のみ（文言は流用しない）
- 位置付け: title・H1・description・定義文を「コールセンター向けAIエージェント」に（「AI電話」「音声AI」は残す）。CRM・基幹システムへの記録、通話後処理（ACW）、文脈を引き継いだ有人エスカレーションまで担うと明記
- 追加セクション: AIエージェントの3つの役割（自然な会話での聞き取り／既存システムの参照・入力／有人への引き継ぎ）、受電と架電（事例の事実: Twilio・Salesforce・ElevenLabs・Microsoft Teams）、Before/After、中間CTA（問い合わせ種別「AI電話」を選んだ状態で開く）、業種別の活用イメージ6件（事例があるものは事例へリンク、それ以外は活用イメージと明記）
- 導入の進め方に役割分担（お客様／MGC専門チーム／協働）を追加。期間は既存の目安（パイロット2〜4週間・本番1〜3ヶ月）のまま
- FAQ に「CRMや基幹システムと連携できますか」「発信（架電）にも使えますか」を追加（8問）。既存の IVR比較・会話例・人に回す条件・向く/向かない・導入前に決めること・FAQ は残した
- 構造化データ: Service（PoC の priceSpecification）・FAQPage・BreadcrumbList に加えて WebPage（dateModified 2026-11-03）。サイトマップの lastmod、llms.txt の記述を更新。英語版も同じ構成に
- 新しい数字・顧客名・成果は追加していない。料金は PoC 100〜300万円・本番は個別見積もりのみ

## 2026-11-03 スマホのハンバーガーメニューの見た目を修正（ユーザー指摘）
- 「導入事例」「コラム」だけ 36px と大きく、他の項目（24px）と不揃いだった → 全項目を 17px・太字に統一し、左揃えのリストに。セクション見出し（事業内容・会社情報）は小さめのグレー、単独リンク（導入事例・コラム）は1つのまとまりとして他の項目と同じ扱い
- 最上部の見出しがヘッダーの下に隠れることがあった（メニューの上余白が固定値だった）→ ヘッダーの高さを実測し、メニューをヘッダーの真下から始めるよう変更
- 各項目のタップ領域を 48px 以上、問い合わせボタンは 52px。区切り線・右向き矢印で一覧性を上げ、下端にセーフエリア分の余白、スクロールはメニュー内に閉じる（overscroll-contain）
- デスクトップには表示しない（md:hidden）。デスクトップのヘッダーは修正前と画素単位で同一であることを確認
- 確認: 375/390/430px × JP/EN

## 2026-11-03 コラム記事のサムネイルがスマホで見切れる問題を修正（ユーザー指摘）
- 原因: 記事上部の画像（.hero）に img の height 属性（675px）がそのまま効き、CSS の aspect-ratio:16/9 が無効になっていた。スマホでは約354×675の縦長枠に cover で切り抜かれていた
- 修正: .hero に height:auto を指定し、img の width/height 属性を実寸（1400×788）に。全幅で 16:9 になり画像全体が見える（デスクトップは 1152×675 → 1152×648 で、わずかに出ていた上下の切り取りも解消）
- 確認: 375/390/430/1280px で記事・一覧・業界別ページ・関連コラムのカードを計測（カード類は元から 16:9 で問題なし。トップ・サービスページにはコラムのカードなし）。390px で全96記事の画像比率が 16:9 であることを確認

## 2026-11-04 デイリー: 日次コラムの停止を修正、コラムの更新日をサイトマップに反映
- 計測: Search Console（鍵が未登録）・Vercel Web Analytics（集計APIが無効と返す）とも数値は取得できず。本番の健全性（147ページ200、JSON-LD 465件妥当、問い合わせAPI 400）と実行時エラー0件を確認（`metrics/2026-11-04.md`）
- 日次コラム（`scripts/column/generate-column.mjs`）: 11/3 の実行が「JSON の後ろに余分な文字」で失敗していた。応答から最初の完結したJSONオブジェクトだけを取り出すようにし、JSONの崩れ・一時的なAPIエラーは最大3回まで作り直す（認証エラーは即失敗）。書き足し（分量ガード）の失敗で処理全体が止まっていた不具合も修正。同じ日に自動投稿が2本出ないようにした（FORCE=1 で無視）
- コラムの更新日: サイトマップの lastmod が公開日のままで、書き直した記事の更新が伝わっていなかった。lastmod（記事・業界別一覧・一覧）を dateModified 基準にし、`article:modified_time` と記事ページの「更新」日付（time要素）を追加
- 修正後に日次コラムを手動実行し、本番環境で成功を確認（11/4 分: education-learning-content-automation-checklist）。生成された本文のリンク説明の「構築事例」（該当する事例はない）を事実に合わせて修正し、生成ルールに再発防止の一文を追加（※同時に「2〜4週間のPoC」も誤りとして書き換えたが、サイトは「パイロット運用（PoC）2〜4週間」と公開しており誤りではなかった。11/4 サイクル15で訂正）

## 2026-11-04 サイクル15: 日次コラムの公開前の事実検査、今日のコラムのサムネイル
- 計測: Search Console・Vercel Web Analytics とも引き続き数値なし（理由は `metrics/2026-11-04.md`）。SEO Daily Report のワークフローは定時実行の履歴が0件（鍵が未登録のため、登録後も数値はその翌朝から）
- 再点検（本番ビルド全ページ）: title 60字超・description の長さ・h1・リンク切れ・画像の alt・title の重複に問題なし
- `scripts/column/fact-check.mjs` を新設し、日次の自動投稿に組み込み: 公開されていない金額、出典のない割合（%・割）、MGC以外の社名、「MGCの〜」の節とリンク説明での事例・実績の表現、公開済みの目安以外の期間を検出。指摘があれば指摘を添えて最大2回まで直させ、残る場合は公開を中止する（誤った事実を出すより、その日の投稿を止める）。モックで「直って公開」「直らず中止」の両方を確認
- 既存の97本を同じ基準で見ると、割合・金額の表記は「例：10%以内」のような説明のための例のみで、MGCの実績としての記述はなかった（変更なし）
- 訂正: 11/4 午前に「2〜4週間のPoC」を誤りとして書き換えたが、サイトの公開情報は「パイロット運用（PoC）2〜4週間」で、誤りではなかった。生成ルールを「期間は公開済みの目安（パイロット運用＝PoC 2〜4週間、本番運用1〜3ヶ月）だけを書く」に改め、検査もこれに合わせた
- 今日の自動投稿（education-learning-content-automation-checklist）の個別サムネイルをスタイルガイドの手順で作成（16:9 webp・OGP jpg）。サムネイルの場面に「教材」を追加

## 2026-11-04 サイクル16: ガイド「AI導入は何から始めるか」を新設
- 計測: SEO Daily Report の定時実行が初めて動いた（12:06 JST、定刻から約3.5時間遅れ）が、鍵（`GSC_SERVICE_ACCOUNT_JSON`）が未登録のため取得はスキップ。Vercel Web Analytics の集計APIも引き続き無効。日次コラムの定時実行は、当日分が公開済みのためスキップ（11/4 午前に入れた二重投稿の防止が働いた）
- 優先度: 数値がないため、`queries.md` の「AIに聞かれそうな質問」のうち受け皿ページがないもの（「中小企業がAI導入で最初にやるべきことは？」）を最優先にした
- `/guide/ai-adoption-where-to-start`（JP/EN）: 社内の状況別の最初の一歩（研修／AIソリューション／AI営業／AI電話／Salesforce AI）、最初に任せる1業務の選び方、棚卸し→パイロット運用（PoC）2〜4週間→本番運用1〜3ヶ月の進め方、PoC 100〜300万円・本番は個別見積もり、研修とAIソリューションの順番、FAQ 3問。すべてサイトに掲載済みの事実のみ（新しい数字・事例なし）
- 構造化データ: Article・FAQPage・BreadcrumbList（ガイドの既存の仕組み）。サイトマップ・llms.txt・llms-full.txt・ガイド一覧に追加
- トップのFAQ「小さな業務から試したいのですが、可能ですか？」からガイドへリンク（FAQのリンクを料金ページ以外にも張れるようにした）

## 2026-11-04 サイクル17: 地域の問いに答えるFAQ、新ガイドへの内部リンク
- 計測: 数値は引き続き取得不可（Search Console の鍵が未登録、Vercel Web Analytics の集計APIが無効）。前回から新しい定時実行はなし
- 優先度: `queries.md` の質問のうち、受け皿が弱い「京都でAI導入を相談できる会社は？」と、前回新設したガイドへの内部リンク（AIソリューションのページ＝「AI導入支援」の受け皿から）
- トップのFAQに「京都の会社ですか？ 京都以外の企業も相談できますか？」を追加（JP/EN）。回答は所在地（京都市上京区）・30分のオンライン相談・研修の実施形態（通学／オンライン）だけ。トップの FAQPage（9問）と llms-full.txt に反映
- `/works/ai-solutions` のFAQ「小さく試すことはできますか？」から `/guide/ai-adoption-where-to-start` へリンク（事業ページのFAQにもリンクを付けられるようにした）

## 2026-11-04 サイクル18: コラムから比較・選び方ガイドへの内部リンク、構造化データの修正
- 計測: 検索・アクセスの数値は引き続き取得不可。数値なしで測れるものとして本番の表示速度を実測（スマホ 390px 相当）: トップ・AI電話・研修・コラム記事・コラム一覧とも LCP 約0.5〜0.6秒、CLS 0（初回だけ接続確立で約3.9秒）。改善の必要なし
- 内部リンク: コラム97本の本文から、個別のガイド（/guide/<slug>）へのリンクが0本だった。記事末の「このテーマに関するMGCのサービス」の下に「比較・選び方ガイド」を追加し、選ばれたサービスに対応するガイドへ自動でリンク（AI電話→AI電話・IVR・ボイスボット、AI営業→AI営業とテレアポ代行、Salesforce→標準AIと個別開発、研修・AIソリューション→AI導入は何から始めるか）。リンク数: 12・9・4・83本。ガイドの slug が guideContent.ts から消えた場合はビルドを止める
- 構造化データ: Organization の hasOfferCatalog で、AIソリューション・AI事業立ち上げ支援・クロスボーダー事業の url が /works（一覧）になっていたのを、それぞれの個別ページに修正（全ページ共通）

## 2026-11-05 デイリー（サイクル19）: ガイドから関連コラムへのリンク
- 計測: SEO Daily Report を手動実行して確認 → 鍵（`GSC_SERVICE_ACCOUNT_JSON`）が未登録で取得スキップ。Vercel Web Analytics の集計APIも無効のまま。本番149ページ200・JSON-LD 473件妥当・実行時エラー0件（`metrics/2026-11-05.md`）
- ガイドの各ページ（JP）に「関連コラム」を追加: そのガイドへリンクしているコラムから、関連の強い順（サービスの語の出現数）→新しい順に、同じ業界は1本まで・最大6本。前回のコラム→ガイドと合わせて双方向のリンクになった。一覧は `build-columns.mjs` が `content/columns/guide-columns.json` に生成（日次コラムの投稿でも更新される）
- llms.txt のガイド一覧を、build-columns のガイド定義（GUIDES）から生成するように変更（出力は同一。ガイド追加時の載せ忘れ防止）

## 2026-11-06 サイクル20: 日次コラムの個別サムネイルを自動化、自動投稿2本の確認
- 自動投稿 2本（hr-internal-mobility-ai-skills・public-continuity-knowledge-management-ai）: 事実検査（fact-check.mjs）は両方 OK。目視で、自治体の記事の「自治体特有の複雑な業務フローを理解した専門チーム」（根拠を示せない専門性の主張）を「専門チームが一貫して担当します」に修正
- `scripts/column/thumbnail-gemini.mjs` を新設: 記事のプロンプト（thumbnail-prompt.mjs の固定の画風＋場所＋場面）で Gemini の画像生成（gemini-2.5-flash-image、変数 GEMINI_IMAGE_MODEL で変更可）を呼び、thumbnail.mjs で 1400×788 webp・1200×630 jpg に書き出し、記事 JSON の image を設定。個別画像がある記事は飛ばす（--force で作り直し）
- `daily-column.yml`: 新しい記事ができた日だけ、公開前にサムネイルを作るステップを追加（continue-on-error。失敗しても業種の予備画像で公開される）
- `column-thumbnail.yml`（手動実行）: 既存の記事に個別画像を作る。slug 指定、空なら個別画像の無い記事を最大5本
- モックで確認: モデルの404→次の候補、画像の書き出し・JSON の更新、2回目は「個別画像あり」で飛ばす
- マージ後に「Column Thumbnail」を実際に実行 → Gemini API が 402（プリペイドのクレジットが尽きた）を返して失敗。スクリプトとワークフローの経路は動作したが、**同じ API キーの日次コラム本文の生成も止まる見込み**（11/6 分は 02:17 UTC に生成済み）。AI Studio でクレジットの補充が必要（代表の操作）
- 当面の対応: 11/5・11/6 の2本のサムネイルはこれまでの手順（Higgsfield の gpt_image_2_5）で作成。hr-internal-mobility-ai-skills は場面がタイトルの「スキル」で研修の場面になるため `thumbnailScene`（スキルマップを画面で確認する場面）を指定
- generate-column.mjs: 402（課金）も 401/403 と同じく再試行せず即失敗にした（ログで原因がすぐ分かる）

## 2026-11-06 サイクル21: 料金・研修・導入事例のページから、ガイドとコラムへのリンク
- 調査: 内部リンクを数えると、料金（/pricing）・研修（/training）・導入事例3ページから、比較・選び方ガイドとコラムへのリンクが0本だった（検討段階の読者が来るページ）
- 共通の「あわせて読みたい」欄（RelatedReading）を追加:
  - /pricing「費用を比べる前に読む」: コラム「AI導入費用の内訳の考え方」＋ガイド4本
  - /training: コラム「法人向けAI研修の選び方チェックリスト」＋ガイド「AI導入は何から始めるか」
  - /cases/<slug>: 事例のサービスに対応するガイド（AI電話・AI営業・Salesforce）＋そのガイドの関連コラム2本（guide-columns.json）
- 英語版はガイドだけ（コラムは日本語のみ）。App.tsx に直接書いたコラムの slug・タイトルは build-columns.mjs が記事と照合し、食い違えばビルドを止める（わざとタイトルを変えて停止することを確認）

## 2026-11-06 サイクル22: 用語集からコラムへ、トップに最新のコラム
- 調査: トップ（/）と用語集（/glossary）からコラムへのリンクが0本（用語集はコラムから自動リンクされる一方向だった）
- `build-columns.mjs` が `content/columns/site-links.json` を生成: 用語ごとにその用語が出てくるコラム（新しい順・同じ業界は1本まで・最大3本）と、公開日の新しい順のコラム3本（タイトル・業界・日付・画像）
- 用語集: 各用語の定義の下に「コラム」として関連記事を表示（JP。21語・計32本）
- トップ: お知らせの下に「最新のコラム」3本（画像付きのカード、JP）。日次の自動投稿・「Column Thumbnail」の実行で build-columns が走るたびに更新される

## 2026-11-06 サイクル23: コラムのサムネイル・本文の生成元を Gemini 以外に（松尾さん指示）
- 確認: このセッションでは Higgsfield（MCP、gpt_image_2_5）が使える（残り 865 クレジット）。ChatGPT（OpenAI）の接続はない。Higgsfield の MCP はセッション内だけで使え、GitHub Actions からは呼べないため、Actions 側は OpenAI API を使えるようにした
- サムネイル: `thumbnail-gemini.mjs` → `thumbnail-ai.mjs`。Secret `OPENAI_API_KEY` があれば OpenAI の画像生成（/v1/images/generations、gpt-image-1、1536×1024 → 16:9 に切り抜き、変数 OPENAI_IMAGE_MODEL で変更可）、無ければ Gemini。daily-column・column-thumbnail の両ワークフローを更新
- 本文: `generate-column.mjs` に OpenAI（/v1/chat/completions、JSON 出力。モデルは変数 OPENAI_MODEL、無ければ gpt-5-mini → gpt-4.1-mini の順に試す）を追加。`OPENAI_API_KEY` があれば OpenAI、無ければ Gemini。事実検査・分量ガード・二重投稿防止は共通。課金切れ（402・429 insufficient_quota）は再試行せず即失敗
- モックで確認: モデル 404 → 次の候補、画像の書き出し、本文の生成〜公開、課金切れで1回で停止。実際の API での確認は Secret 登録後に「Column Thumbnail」を手動実行して行う
- 11/4・11/5・11/6 のサムネイルは、すでに基準と同じ方法（Higgsfield の gpt_image_2_5、同じプロンプト）で作成済みのため作り直していない

## 2026-11-09 方針の記録: コラムの生成は Gemini を継続（松尾さん「やっぱgeminiでいい」）
- コラムの本文・サムネイルの生成元は Gemini を継続。OpenAI/Higgsfield への移行はしない。`OPENAI_API_KEY` の登録は依頼しない（サイクル23 で入れた OpenAI の経路は、Secret が無い限り動かないため残置）
- 現状: Gemini の残高不足（402 プリペイドクレジット切れ）は未解消。日次コラムは 11/7・11/8 の定時実行とも 402 で失敗（公開は 11/6 分まで）。復旧は Actions の実行結果で確認する
- 改善ループは、この方針と「追加課金・秘密情報の表示/取得はしない」を前提に進める

## 2026-11-09 サイクル24: ジャーナル・事業ページ・導入事例一覧からガイドとコラムへ
- 計測: 数値は取得不可（`metrics/2026-11-09.md`）。日次コラムは Gemini の 402 で 11/7・11/8 とも失敗（未解消）
- ジャーナル11記事: 本文の語でガイドを選ぶ（電話・音声→AI電話、営業・商談→AI営業、Salesforce・kintone・CRM→Salesforce、3回以上出る語のみ・最大2本、該当なしは「AI導入は何から始めるか」）＋そのガイドの関連コラム2本
- /works/ai-solutions: ガイド4本＋コラム「AI導入費用の内訳の考え方」。/works/ai-business-launch: ガイド「AI導入は何から始めるか」＋関連コラム2本（クロスボーダーは対応するガイドがないため出さない）
- /cases（一覧）: 比較・選び方ガイド4本
- 事例ページの関連コラムの選び方を共通関数（columnsForGuides）にまとめた。390px・1280px で横はみ出しなし

## 2026-11-09 OpenAI 用のコードを削除（Gemini のみに戻す、松尾さん指示）
- PR #108 で入れた OpenAI の経路を削除: `generate-column.mjs`（callOpenAI・生成元の切り替え）、`thumbnail-ai.mjs` → `thumbnail-gemini.mjs` に戻し OpenAI の画像生成を削除、daily-column・column-thumbnail の両ワークフローから OPENAI_* を削除
- スクリプトとワークフローは PR #108 より前（2fdc30a）と同一（サムネイルのスクリプトの1行目のコメントのみ違い）
- モックで確認: 本文の生成〜公開（Gemini）、402 は1回で停止、サムネイルの生成・書き出し、キー未設定時のエラー

## 2026-11-09 サイクル25: ガイド・導入事例の構造化データに公開日・更新日
- 再点検: 本番ビルド155ページでリンク切れ0件、ガイド・コラム・用語集・料金は全ページからリンクされている（内部リンクは十分）。一方、ガイド4本・導入事例3本の Article に datePublished・dateModified が無かった（コラム・ジャーナルにはある）
- `GUIDE_DATES`（guideContent.ts）・`CASE_DATES`（caseContent.ts）に公開日・内容の最終更新日を定義（git の履歴から: ガイドは 11/2 公開、AI営業のガイドは 11/3 に料金の記述を更新、AI導入の始め方は 11/4 公開。事例は 9/7 公開・11/2 更新）
- 構造化データ: ガイド・事例の Article に datePublished・dateModified。ガイドには articleSection（比較・選び方ガイド）・about（対応するサービス）も
- ガイドのページのリード文の下に「公開・更新」の日付を表示（time 要素）。サイトマップのガイドの lastmod を更新日にそろえた
- 日次コラム: 11/9 の定時実行も失敗（Gemini の残高不足は未解消）

## 2026-11-09 サイクル26: サイトマップの更新日を実際の更新日に
- 点検: サイトマップの固定ページのうち11ページの lastmod が 10/17〜10/18 のままで、11/2〜11/6 の内容の更新（3段階の流れ・概要ボックス・料金目安・研修のオプション・問い合わせ種別・京都のFAQ・最新のコラム 等）が反映されていなかった
- git の履歴から内容の最終更新日を確認して更新: / 11/6、/works・/works/ai-business-launch・/works/cross-border・/service/ai-sales・/service/salesforce-ai・/training・/contact・/glossary 11/3、/works/ai-solutions 11/4、/cases 11/2（関連リンクの欄など自動・補助的な変更は内容の更新に含めない）
- AI営業・Salesforce AI のサービスページに dateModified（2026-11-03）を設定し、WebPage の構造化データに出るようにした（AI電話と同じ）

## 2026-11-10 デイリー（サイクル27）: コラム一覧・業界別一覧からガイドへ
- 計測: 数値は取得不可。日次コラムは 11/10 も Gemini の 402 で失敗（未解消）。本番 151ページ200・JSON-LD 481件妥当・実行時エラー0件（`metrics/2026-11-10.md`）
- コラム一覧（/column）にガイド4本、業界別一覧13ページに、その業界のコラムがリンクしているガイドを多い順に最大2本（build-columns.mjs）。390px・1280px で横はみ出しなし

## 2026-11-10 サイクル28: 料金ページに FAQ と構造化データ
- 点検: 主要ページの構造化データを一覧化 → 料金ページ（/pricing）だけ、FAQ も構造化データも無かった（「AI導入の費用は」「期間は」に答えるページ）
- /pricing に「料金についてよくあるご質問」5問を追加（JP/EN）: 研修の受講料（1名398,000円（税込）・標準20時間）、AIソリューションの費用の目安（PoC 100〜300万円・本番は個別見積もり）、期間（パイロット運用2〜4週間・本番運用1〜3ヶ月）、相談・見積もりは無料、伴走オプション（個別見積もり）と助成金申請サポート（研修受講者は無料、受給できるかどうかは要件による）。すべて掲載済みの事実のみ
- 構造化データ: FAQPage（5問）と WebPage（dateModified 2026-11-10）。価格の構造化データ（priceSpecification）は従来どおりサービス3ページのみで、料金ページには付けない
- llms-full.txt の料金の節に FAQ を追加。サイトマップの /pricing の lastmod を 11/10 に

## 2026-11-11 デイリー（サイクル29）: .html 付きURLを正規URLへリダイレクト
- 計測: 数値は取得不可。日次コラムは Gemini の 402 で停止中（未解消）。本番は正常（`metrics/2026-11-11.md`）
- 点検: `/training.html`・`/column/<slug>.html`・`/guide/<slug>.html`・`/index.html` が 200 で同じ内容を返していた（canonical は正しいが重複URL）。末尾スラッシュ・http は既に 308
- `vercel.json` の redirects に追加: `/index.html` → `/`、`/column/index.html` → `/column`、`/<path>.html` → `/<path>`（api・assets・fonts は対象外）。すべて恒久（308）。リダイレクトは受け取ったURLにだけ効くため、内部の rewrite（/training → /training.html）には影響しない
- 未対応: www.mgc-global01.com が名前解決できない（DNS 未設定）。Vercel のドメイン設定で www を追加し apex へ転送する必要がある（代表の操作）

## 2026-11-11 サイクル30: 一覧・会社情報ページの構造化データ、トップの canonical
- 点検: サイトマップ151件と各ページの canonical を照合 → トップのみ「https://mgc-global01.com」と「…/」で食い違い（他は一致）。主要ページの構造化データでは、/cases・/blog・/works・/company・/mission・/contact にページ種別が無かった
- 構造化データ（entry-server.tsx）: /cases・/blog・/works に CollectionPage と ItemList（導入事例3件・ジャーナル11件・事業4件）、/company・/mission に AboutPage（about: Organization）、/contact に ContactPage
- トップの canonical・og:url を「https://mgc-global01.com/」に（サイトマップの loc と一致）
