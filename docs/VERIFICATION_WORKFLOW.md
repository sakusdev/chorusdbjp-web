# データ確認ワークフロー

ChorusDBJPでは、曲名だけを根拠に作者や編成を確定しません。同名異曲、編曲版、曲集名の誤登録を避けるため、以下の手順で確認します。

## 確認状態

- `unverified`: 出典確認が完了していない
- `verified`: 公式出版社、作曲者公式、放送局・主催者公式などで作品を特定できた
- `rejected`: 合唱版の実在を確認できない、または登録対象外

## `verified` に必要な項目

1. 作品を特定できる曲名
2. 作詞者と作曲者
3. 合唱編成または掲載楽譜版
4. 公式性を説明できる `source_url`
5. `source_checked_at`
6. 同名作品がある場合は識別情報

YouTube検索結果、個人ブログ、歌詞サイト、動画タイトルだけでは `verified` にしません。

## 曲・組曲・曲集の扱い

`works.work_type` は次を使用します。

- `song`: 単独曲
- `suite`: 組曲
- `collection`: 曲集
- `arrangement`: 原曲と区別して管理する編曲版

検索結果へ通常公開するのは原則として `song` と、作品単位で特定できる `arrangement` です。曲集名を単独曲として登録しません。

## D1への適用

Cloudflare Dashboardで D1 データベース `chorusdbjp-db` の Console を開き、未適用のマイグレーションを番号順に実行します。

`0006_add_provenance_fields.sql` 実行後は、次の確認を行います。

```sql
PRAGMA table_info(works);
PRAGMA table_info(editions);
```

`works.work_type`、`editions.source_checked_at`、`editions.verification_notes` が表示されれば成功です。

管理用の点検SQLは `ops/catalog-review.sql` にあります。

## 更新例

```sql
UPDATE works
SET lyricist = '作詞者名',
    composer = '作曲者名',
    work_type = 'song',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'song-slug';

UPDATE editions
SET source_url = 'https://公式出典.example/',
    source_checked_at = '2026-07-29',
    verification_status = 'verified',
    verification_notes = '出版社公式商品ページで作詞・作曲・編成を確認'
WHERE work_id = 'song-slug';
```

## 訂正・削除

誤情報、権利上の問題、リンク切れが判明した場合は、公開継続よりも一時非公開を優先します。

```sql
UPDATE works
SET published = 0, updated_at = CURRENT_TIMESTAMP
WHERE id = 'song-slug';
```
