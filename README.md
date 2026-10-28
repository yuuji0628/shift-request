
# shift-request

Cloudflare Workers + D1 で動く、シンプルなシフト希望提出サイトです。

## できること

### スタッフ側 `/`
- 1週間分をまとめて入力・一括送信
- 週の開始日から7日分を自動表示
- 希望時間を出勤可能日の全日にコピー可能
- 名前入力
- 日付選択
- 出勤可 / 休み希望
- 希望開始時間 / 終了時間
- 備考
- 同じ「名前 + 日付」で再送信すると内容を更新

### 管理側 `/admin`
- 月を選んで表示
- 日付ごとに提出を一覧表示
- 出勤可能時間・休み希望・備考を確認
- 個別削除
- 管理パスワード付き

---

## 1. GitHubへアップロード

このフォルダの中身を `yuuji0628/shift-request` にアップロードしてください。

必要ファイル:

- `src/index.js`
- `schema.sql`
- `wrangler.toml`
- `package.json`
- `README.md`

---

## 2. D1のテーブルを作る

Cloudflare Dashboard → D1 → `shift-request-db` → コンソール を開き、
`schema.sql` の中身を全部貼って実行してください。

成功すると `shift_requests` テーブルが作成されます。

---

## 3. D1 Database ID を入れる

Cloudflareの `shift-request-db` の詳細画面で Database ID を確認します。

`wrangler.toml` の

`database_id = "PUT_YOUR_D1_DATABASE_ID_HERE"`

を実際の Database ID に置き換えてください。

GitHub上で直接編集してもOKです。

---

## 4. CloudflareでGitHubリポジトリを接続

Workers & Pages → アプリケーションを作成 → GitHub を選択し、
`yuuji0628/shift-request` を接続します。

Framework preset は不要です。

Build command:
`npm install`

Deploy command:
`npx wrangler deploy`

Root directory:
`/`

---

## 5. 管理パスワードを設定

Cloudflareの `shift-request` Worker:

Settings → Variables and Secrets → Add

名前:
`ADMIN_PASSWORD`

値:
好きな管理者パスワード

**Secret として保存**してください。

---

## 6. URL

スタッフ用:
`https://shift-request.<あなたのworkers.dev>.workers.dev/`

管理用:
`https://shift-request.<あなたのworkers.dev>.workers.dev/admin`

---

## 注意

- GitHubを Public にしても、`ADMIN_PASSWORD` はGitHubに書かないでください。
- D1 Database ID は公開されても秘密情報ではありませんが、管理パスワードは必ずSecretで設定してください。


## 最新UI
- カレンダーから複数日選択
- 日ごとに出勤可/休み
- 日ごとに開始/終了時間
- 日ごとに備考
- 休みの日は時間欄自動非表示
- 最初の入力時間を出勤可能日の全日にコピー
- 選択日は日付順表示


## Compact UI update
- 備考欄は常時表示
- 開始/終了時間を横並び
- 日別カードの余白とボタン高さを縮小
- 備考欄をコンパクト化


## 管理画面追加機能
- 実際にシフトへ入れた/入れていないを記録
- 実際の開始/終了時間
- 管理メモ
- 連勤自動チェック（5連勤注意、6連勤以上強警告）
- 月次サマリー
- actual_shifts テーブルは管理画面を開いた際に自動作成


## 時間入力
- スタッフ側・管理側とも15分単位（00 / 15 / 30 / 45）


## 管理画面UI
- 通常時は名前＋出勤可/休み希望のみ表示
- 名前タップで希望時間、採用可否、実働時間、管理メモを展開
