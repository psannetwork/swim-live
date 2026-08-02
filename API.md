# 📄 完全版 API ドキュメント  

本ドキュメントは、`live-results.swim.or.jp` および `result.swim.or.jp` (V1 API) の全エンドポイントを網羅したものです。  
本ライブラリは、堅牢なエラーハンドリング、型安全性、およびデータ正規化を自動で行います。

---

## ⚠️ 堅牢性とDXの設計方針

本ライブラリは以下のベストプラクティスに基づき設計されています。

1.  **堅牢なエラーハンドリング**: 通信エラーは `SwimApiError`, `SwimNetworkError`, `SwimRateLimitError` として独自定義され、適切に処理されます。
2.  **型安全性とデータの正規化**: レスポンスは JSON そのままではなく、TypeScript インターフェース（`NormalizedRace`, `GameDetail` 等）にマッピングされ、扱いやすい形式で返されます。
3.  **自動メタデータ enriqument**: `member_group_code` に対応する地域名や団体名などは、マスターデータから自動的に結合して取得します（`getGames` 等）。
4.  **便利な統合 API**: 複数のリクエストを跨ぐ複雑なデータ取得は、統合された単一のメソッドで呼び出し可能です（`getGameComprehensiveData`）。

---

## 1. ライブ結果配信システム API (`live-results.swim.or.jp`)

| エンドポイント | ラッパーメソッド |
| :--- | :--- |
| `/api/games/` | `SwimLiveScraper.getGames()` (`NormalizedGame[]` 型) |
| `/api/games/{game_code}` | `SwimLiveScraper.getGameDetails(gameCode)` (`GameDetail` 型) |
| `/api/race_heats/race_list/{game_code}?game_date={date}` | `SwimLiveScraper.getRaceListByGameDate(gameCode, date)` (`NormalizedRace[]` 型) |
| ※統合API | `SwimLiveScraper.getGameComprehensiveData(gameCode, date?)` |
| `/api/games/member_group/{group_code}` | `SwimLiveScraper.getMemberGroupGames(groupCode)` (`NormalizedGame[]` 型) |
| `/api/masters/member_groups` | `SwimLiveScraper.getMastersMemberGroups()` |

*(他、`getRaceResults`, `getRaceStatus` 等も利用可能)*

---

## 2. V1 API (`result.swim.or.jp/api/v1/`)

競技者詳細、ランキング、過去データ等の分析用 API です。

### 競技者関連
- `/athletes` : `searchAthletes(params)` (地域・クラス名のコード自動変換対応)
- `/athletes/{id}` : `getV1Athlete(athleteId)`

### 大会・レース関連
- `/games` : `searchGames(params)`

*(その他詳細はソースコードの `SwimLiveScraper` 定義を参照)*

---

## 3. 利用方法 (`SwimLiveScraper` クラス)

すべての API は `SwimLiveScraper` を介して呼び出せます。

### 統合ヘルパーメソッド例

```typescript
// 1. 大会データの包括的取得（レース一覧、開催日、メッセージを一度に）
const { raceList, availableDates, messages } = await SwimLiveScraper.getGameComprehensiveData('1626708');

// 2. 正規化されたデータ構造 (NormalizedRace 型)
console.log(raceList[0].race_name); // "フリーリレー 混合 4×50m"
console.log(raceList[0].is_finished); // true / false
```

*注: 開発時は `console.debug` でリクエスト URL が出力されるため、ログの監視が可能です。*
