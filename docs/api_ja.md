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

#### `getRaceResults(gameCode: string, programId: string, heat: string, raceStatus: RaceStatus = RaceStatus.RESULT): Promise<any>`
特定大会の特定種目の結果を取得します。

- **引数**:
    - `gameCode` (string): 大会コード
    - `programId` (string): プログラムID（種目）
    - `heat` (string): 組番号
    - `raceStatus` (`RaceStatus`, オプション): データの種類（`RaceStatus.RESULT` または `RaceStatus.IN_PROGRESS`）。デフォルトは `RaceStatus.RESULT`。
- **戻り値**: `Promise<any>`（取得した生データ）

#### `searchAthleteAcrossGames(playerName: string, belongName?: string, eventName?: string): Promise<any[]>`
全開催大会を横断して、選手名から参加種目を検索します。

- **引数**:
    - `playerName` (string): 選手名
    - `belongName` (string, オプション): 所属名
    - `eventName` (string, オプション): 種目名
- **戻り値**: `Promise<any[]>`（見つかったレース情報の配列）

#### `findAthleteAcrossGamesById(swimmerCode: string, eventName?: string): Promise<any[]>`
全開催大会を横断して、選手IDから参加種目を検索します。内部で選手情報を解決して精度を高めます。

- **引数**:
    - `swimmerCode` (string): 選手ID（コード）
    - `eventName` (string, オプション): 種目名
- **戻り値**: `Promise<any[]>`（見つかったレース情報の配列）


---

### マスタデータ取得メソッド

#### `getMastersEvents(): Promise<MasterData[]>`
種目マスタデータを取得します。

- **戻り値**: `Promise<MasterData[]>`

#### `getMastersRaceDivisions(): Promise<MasterData[]>`
レース区分マスタデータを取得します。

- **戻り値**: `Promise<MasterData[]>`

---


#### `RaceStatus`
レース結果取得時に指定するデータの状態です。

- `RaceStatus.RESULT` (= 9): 確定したレース結果
- `RaceStatus.IN_PROGRESS` (= 1): レース進行中のデータ

---


- `raceResults`から得られる`swimmer_code`は、APIのエンドポイントで使用するID（`athleteId`）とは異なる場合があります。
- `searchAthletes`メソッドの`params`オブジェクトに`code`パラメータを指定して、`swimmer_code`を検索条件として使用できます。
- `searchAthletes`の結果として得られる`Athlete`オブジェクトの`swimmer_code`や`entry_group.code`は、`getV1Athlete`などのエンドポイントで使用する`athleteId`として有効でない場合があります。
- `searchAthletes`で得られた選手情報から、他の選手情報取得APIを呼び出すには、`athleteId`を特定する必要があります。`Athlete`インターフェースに`athleteId`に相当するフィールドが存在しない場合、他のAPIは失敗します。

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
