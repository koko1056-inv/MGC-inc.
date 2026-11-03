# SEO / AIO 運用メモ

- `audit.md` … 監査結果（ページ別の数値つき）
- `queries.md` … 狙うクエリ・AIに聞かれそうな質問・一次情報コンテンツ案
- `backlog.md` … 施策の一覧（効果が大きい順）
- `changelog.md` … サイクルごとの変更履歴
- `metrics/YYYY-MM-DD.md` … デイリーの数値（Search Console。`scripts/gsc-report.mjs`、毎朝自動実行）

## 1サイクルの流れ
1. backlog の上から1〜3件を実装
2. `npm run build`（事前描画・サイトマップ載せ漏れ・コラムのリンク切れはビルドで検査される）
3. 監査: `cp -r public/column dist/ && python3 scripts/seo-audit.py dist /tmp/audit.json`
4. PR → マージ → 本番で curl 確認（該当HTML・構造化データ）、問い合わせAPIが 400（空送信）を返すこと
5. changelog に記録

## ルール
- 事実でない実績・数字・お客様の声は書かない（不明なものはプレースホルダにもしない）
- CSP・レート制限などのセキュリティ設定を壊さない
- デザイン・ブランドを大きく変えない
