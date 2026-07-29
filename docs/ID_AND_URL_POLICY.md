# ID・URL運用方針

ChorusDBJPの公開URLは、作品情報の修正やID整理後もできるだけ維持します。

## 現行ルール

- 新規作品IDは人が読める英数字slugを使用する
- 例: `soranji`, `boku-no-koto`, `tabidachi-no-hi-ni`
- `extra-001` のような投入順依存のIDは禁止する
- 日本語タイトルそのものを恒久IDとして新規採用しない
- 同名作品は作曲者などをslugへ加える

例:

- `michi-yamazaki-tomoko`
- `michi-miura-mari`

## IDを変更するとき

1. 新しい作品IDを作成する
2. `editions.work_id` を新IDへ移す
3. 旧IDを `work_aliases.alias` に登録する
4. 旧URLで詳細が開けることを確認する
5. 既存の出典・確認状態を保持する

## エイリアス

`work_aliases` は旧IDから現行作品IDへの対応を保持します。

```sql
INSERT INTO work_aliases (alias, work_id, reason)
VALUES ('old-id', 'new-id', 'slug normalization');
```

エイリアス自体を別作品へ使い回してはいけません。

## 禁止事項

- 行番号や投入順からIDを生成する
- 同名作品を作者確認なしで同一IDへ統合する
- ID変更時に旧URLを無断で切る
- 表示名の変更だけを目的に作品IDを頻繁に変える
