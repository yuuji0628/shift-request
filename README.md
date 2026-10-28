
# shift-request

Cloudflare Workers + D1 で動く、シンプルなシフト希望提出サイトです。

## できること

### スタッフ側 `/`
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
