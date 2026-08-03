# Swim-Live API ドキュメント

本ライブラリは、水泳競技の速報データおよび選手データへの堅牢かつ型安全なアクセスインターフェースを提供します。

## 設計方針

1.  **堅牢なエラーハンドリング**: `SwimApiError` 階層を用いた独自定義のエラー処理。
2.  **型安全性と正規化**: 
    - ライブ結果 (`LiveGame`) と V1 データ (`RawGame`) の構造差異を吸収し、`NormalizedGame` 型へ統合。
    - マスタデータ (`member_groups` 等) は `createMasterMap` utility で高速結合 (O(1))。
3.  **自動メタデータ結合**: 開催地コードやステータスコードの自動結合 (`enrichGames`)。

---

## 1. SwimLiveScraper クラス API メソッド

すべての API は `SwimLiveScraper` クラスを通じて利用します。

### 正規化された大会データ

#### `getGames(): Promise<NormalizedGame[]>`
ライブデータおよびV1データを統合・正規化した大会リストを取得します。

- **戻り値**: `Promise<NormalizedGame[]>`

#### `getGameDetails(gameCode: string): Promise<GameDetail>`
特定大会の詳細情報を取得します。

- **引数**:
    - `gameCode` (string): 大会のユニーク識別子。
- **戻り値**: `Promise<GameDetail>`

### V1 専用検索メソッド

#### `searchGames(params: SearchGameParams): Promise<RawGame[]>`
V1 APIを使用して大会を検索します。

- **引数**:
    - `params` (`SearchGameParams`): 検索条件オブジェクト。
- **戻り値**: `Promise<RawGame[]>`

#### `searchAthletes(params: SearchAthleteParams): Promise<Athlete[]>`
選手情報を検索します。

- **引数**:
    - `params` (`SearchAthleteParams`): 検索条件。
- **戻り値**: `Promise<Athlete[]>`

### 選手詳細エンドポイント

#### `getV1Athlete(athleteId: string): Promise<Athlete>`
特定の選手のプロファイル情報を取得します。

- **引数**:
    - `athleteId` (string): 選手のユニーク識別子。
- **戻り値**: `Promise<Athlete>`

#### `getV1AthleteCareers(athleteId: string): Promise<AthleteCareer[]>`
選手のキャリア概要を取得します。

- **引数**:
    - `athleteId` (string): 選手のユニーク識別子。
- **戻り値**: `Promise<AthleteCareer[]>`

#### `getV1AthleteBestFinaPoints(athleteId: string, year?: number, waterwayCode?: number): Promise<FinaPoint[]>`
選手のFINAポイントを取得します。

- **引数**:
    - `athleteId` (string)
    - `year` (number, オプション)
    - `waterwayCode` (number, オプション)
- **戻り値**: `Promise<FinaPoint[]>`

---

## 2. 利用方法の例

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

// 正規化された大会リストの取得例
async function fetchGames() {
  const games = await SwimLiveScraper.getGames();
  
  // 正規化された NormalizedGame オブジェクトとして利用可能
  games.forEach(game => {
    console.log(`${game.game_name} - ステータス: ${game.status_label}`);
  });
}
```

*注: 開発時は `console.debug` でリクエスト URL が出力されるため、ログの監視が可能です。*
