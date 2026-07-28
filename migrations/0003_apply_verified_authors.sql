-- Apply author metadata verified against publisher sources.
-- Safe for Cloudflare D1 Console: no BEGIN/COMMIT or temporary tables.

UPDATE works SET title = 'Tomorrow', title_kana = 'とぅもろー', lyricist = '杉本竜一', composer = '杉本竜一' WHERE id = 'extra-001';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/detail/1136', verification_status = 'verified' WHERE work_id = 'extra-001';

UPDATE works SET title = '空高く', title_kana = 'そらたかく', lyricist = '山崎朋子', composer = '山崎朋子' WHERE id = 'extra-003';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/detail/216', verification_status = 'verified' WHERE work_id = 'extra-003';

UPDATE works SET title = '輝くために', title_kana = 'かがやくために', lyricist = '若松歓', composer = '若松歓' WHERE id = 'extra-004';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/detail/1146', verification_status = 'verified' WHERE work_id = 'extra-004';

UPDATE works SET title = 'この地球のどこかで', title_kana = 'このちきゅうのどこかで', lyricist = '三浦恵子', composer = '若松歓' WHERE id = 'extra-005';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/detail/1146', verification_status = 'verified' WHERE work_id = 'extra-005';

UPDATE works SET title = '僕らの奇跡', title_kana = 'ぼくらのきせき', lyricist = '栂野知子', composer = '栂野知子' WHERE id = 'extra-006';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/detail/216', verification_status = 'verified' WHERE work_id = 'extra-006';

UPDATE works SET title = '心の中にきらめいて', title_kana = 'こころのなかにきらめいて', lyricist = '田崎はるか', composer = '橋本祥路' WHERE id = 'extra-007';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/detail/843', verification_status = 'verified' WHERE work_id = 'extra-007';

UPDATE works SET title = 'My Own Road -僕が創る明日-', title_kana = 'まいおうんろーど', lyricist = '栂野知子', composer = '栂野知子' WHERE id = 'extra-009';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/detail/216', verification_status = 'verified' WHERE work_id = 'extra-009';

UPDATE works SET title = '君と歩こう', title_kana = 'きみとあるこう', lyricist = '栂野知子', composer = '栂野知子' WHERE id = 'extra-010';
UPDATE editions SET source_url = 'https://www.ongakunotomo.co.jp/catalog/detail.php?id=875930', verification_status = 'verified' WHERE work_id = 'extra-010';

UPDATE works SET title = 'ぜんぶ', title_kana = 'ぜんぶ', lyricist = 'さくらももこ', composer = '相澤直人' WHERE id = 'extra-017';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/list?category_id=6&pageno=1', verification_status = 'verified' WHERE work_id = 'extra-017';

UPDATE works SET title = 'さくら', title_kana = 'さくら', lyricist = '御木白日', composer = '大熊崇子' WHERE id = 'extra-028';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/detail/1136', verification_status = 'verified' WHERE work_id = 'extra-028';

UPDATE works SET title = '空は今', title_kana = 'そらはいま', lyricist = '山崎朋子', composer = '山崎朋子' WHERE id = 'extra-058';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/list?category_id=6&name=&tag_id=3', verification_status = 'verified' WHERE work_id = 'extra-058';

UPDATE works SET title = '地球の詩', title_kana = 'ちきゅうのうた', lyricist = '三浦真理', composer = '三浦真理' WHERE id = 'extra-061';
UPDATE editions SET source_url = 'https://store.kyogei.co.jp/products/detail/142', verification_status = 'verified' WHERE work_id = 'extra-061';

-- These are collections/suites, not single songs. Hide them until the schema supports collections.
UPDATE works SET published = 0 WHERE id IN ('extra-138', 'extra-141');
