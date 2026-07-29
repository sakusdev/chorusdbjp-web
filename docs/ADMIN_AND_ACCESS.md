# 管理画面とCloudflare Access

管理画面は `/admin`、管理APIは `/api/admin/*` です。公開検索ページは認証不要のまま維持します。

## 1. Worker環境変数

Cloudflare Dashboardの Workers & Pages → `chorusdbjp-api` → Settings → Variables and Secrets に設定します。

- `ACCESS_TEAM_DOMAIN`: `https://<team-name>.cloudflareaccess.com`
- `ACCESS_AUD`: AccessアプリケーションのApplication Audience (AUD) Tag
- `ADMIN_EMAILS`: 管理を許可するメールアドレス。複数はカンマ区切り

例:

```text
ACCESS_TEAM_DOMAIN=https://example.cloudflareaccess.com
ACCESS_AUD=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAILS=admin@example.com,editor@example.com
```

## 2. Accessアプリケーション

Zero Trust → Access controls → Applications → Add an application → Self-hosted を開きます。

保護対象として次の2パスを登録します。

```text
chorusdbjp.sakus.org/admin*
chorusdbjp.sakus.org/api/admin/*
```

Allowポリシーには管理者のメールアドレス、メールドメイン、またはGoogle/GitHub等のIdPグループを指定します。

## 3. 迂回防止

Workerは `CF-Access-Jwt-Assertion` を公開鍵で検証し、AUD、issuer、メールアドレスを確認します。そのためAccessを経由しない直接リクエストは403になります。

`workers.dev` は不要なら無効化してください。公開サイトのカスタムドメインのみを使用する構成が推奨です。

## 4. 管理機能

- 楽曲の一覧・検索
- 新規登録
- 作品・版情報の編集
- 出典URL、確認日、確認メモの更新
- verified / unverified の変更
- 公開・非公開の切り替え
- 公開停止（物理削除は行わない）

## 5. データベース

管理画面は `0006_add_provenance_fields.sql` が適用済みであることを前提とします。

```sql
PRAGMA table_info(works);
PRAGMA table_info(editions);
```

`work_type`、`source_checked_at`、`verification_notes` が表示されれば準備完了です。
