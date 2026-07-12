# APIドキュメント (SwimLiveScraper)

`SwimLiveScraper` クラスを使用して、水泳競技の速報データや選手詳細データにアクセスする方法です。

## 1. 速報データ関連 (Core Methods)
競技会ごとの速報データにアクセスします。

*   `getGames()`: 大会リストを取得します。
*   `getInProgressCount()`: 開催中の大会数を取得します。
*   `getGameDetails(gameCode)`: 特定大会の詳細を取得します。
*   `getRaceListByGameDate(gameCode, date)`: 指定日付のレースリストを取得します。
*   `getRaceResults(gameCode, programId, heat)`: レース結果を取得・解析します。
*   `getSearchedRaces(...)`: 選手名や所属などでレースを検索します。

## 2. 詳細データ・ランキング (V1 Dedicated Methods)
選手詳細や統計データにアクセスします。

*   `getV1Games(params)`: クエリパラメータを指定して大会を検索します。
*   `getV1Athlete(athleteId)`: 選手プロファイルを取得します。
*   `getV1AthleteBestFinaPoints(athleteId, params)`: 選手のFINAポイントを取得します。
*   `getV1AthleteSwimedRaces(athleteId, params)`: 出場レース履歴を取得します。
*   `getV1RankingsUpdatedTime()`: ランキングの最終更新日時を取得します。

※その他、`getV1Masters*()` などのマスタデータ取得用メソッドが多数用意されています。
