# 📄 完全版 API ドキュメント  

本ドキュメントは、`live-results.swim.or.jp` および `result.swim.or.jp` (V1 API) の全エンドポイントを網羅したものです。

---

## 1. ライブ結果配信システム API (`live-results.swim.or.jp`)

| エンドポイント | 説明 |
| :--- | :--- |
| `/api/games/member_group/{group_code}` | 地域/団体ごとの大会一覧 |
| `/api/games/{game_code}` | 特定大会の詳細情報 |
| `/api/race_heats/race_list/{game_code}` | 指定日の試合スケジュール |
| `/api/race_heats/race` | ヒートの進行状況と公開設定 |
| `/api/result/race` | ヒートごとの結果詳細 |
| `/api/race_heats/searchedRaceHeats/{game_code}` | 選手名/所属/種目によるヒート検索 |
| `/api/games/` | 全大会一覧取得 |
| `/api/games/in_progress_count` | 現在進行中の大会数 |
| `/api/masters/member_groups` | マスターズ大会の地域/団体一覧 |
| `/api/race_heats/messages/{game_code}` | 大会関連メッセージ取得 |
| `/api/race_heats/next` | 次のレース情報取得 |
| `/api/race_heats/select_date/{game_code}` | 大会開催日の日付リスト取得 |

---

## 2. V1 API (`result.swim.or.jp/api/v1/`)

競技者詳細、ランキング、過去データ等の分析用 API です。

### 競技者関連
- `/athletes` : 競技者検索
- `/athletes/{id}` : 競技者詳細
- `/athletes/{id}/best_fina_points` : FINAポイントベスト
- `/athletes/{id}/careers` : キャリア情報
- `/athletes/{id}/entries` : エントリー情報
- `/athletes/{id}/swimed_races` : 出場レース一覧
- `/athletes/{id}/results/...` : 記録詳細（ベスト/グラフ/レコード）
- `/athletes/{id}/histories/...` : 競技履歴

### 大会・レース関連
- `/games` : 大会検索
- `/games/{gameId}` : 大会詳細
- `/games/{gameId}/classes` : 大会クラス一覧
- `/games/{gameId}/races` : 大会レース一覧
- `/games/{gameId}/heats/...` : ヒート詳細
- `/games/{gameId}/results/...` : 結果詳細

### 比較分析 (Comparing)
- `.../comparing` : すべての競技者記録/レース結果比較エンドポイント（汎用ラッパーで対応）

### ユーティリティ・マスターズ情報
- `/announcements/latest` : 最新のお知らせ
- `/rankings/updated_time` : ランキング更新時刻
- `/standard_record_breakers/updated_time` : 標準記録突破者更新時刻
- `/masters/...` : マスターズ大会関連の各マスター情報（期間、泳法、クラス等）

---

## 3. 利用方法 (`SwimLiveScraper` クラス)

すべての API は `SwimLiveScraper` を介して呼び出せます。

- **ライブ系:** `SwimLiveScraper.getRaceResults(...)` 等
- **V1系 (汎用):** `SwimLiveScraper.getV1('path', params)`
- **比較分析:** `SwimLiveScraper.getV1Comparing('path', params)`

### 選手データ分析用ヘルパーメソッド
複雑なパラメーターを隠蔽し、型安全かつ直感的にデータ取得が可能です。

| メソッド名 | 説明 |
| :--- | :--- |
| `getV1Athlete(athleteId)` | 選手詳細取得 |
| `getV1AthleteBestFinaPoints(athleteId, year?, waterwayCode?)` | 指定年・水路のFINAポイントベスト |
| `getV1AthleteSwimedRaces(athleteId, periodCode?, waterwayCode?)` | 指定期間・水路の出場レース一覧 |
| `getV1AthleteResults(athleteId, waterwayCode, styleCode, distanceCode, type)` | 特定条件のレース結果詳細。`type` に `'best'`, `'graphs'`, `'records'` を指定可能 |
| `getV1AthleteCareers(athleteId)` | 選手キャリア情報取得 |

*注: `year`, `waterwayCode`, `periodCode` などのオプション引数は省略可能です。*
