# swim-live-scraper

JASF公式水泳大会のライブスコアAPIおよびV1 APIからデータを取得するライブラリで、型安全で正規化されたデータ構造を提供します。

## インストール

```bash
npm install swim-live-scraper
```

## 使用方法

### 基本的な使い方

#### 大会情報の取得

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

// 例: 正規化されたゲームリストを取得（マスターデータを自動統合）
const games = await SwimLiveScraper.getGames();
console.log(games); 
// NormalizedGame[]を返却: { game_name, group_name, status_label, ... }

// 例: 特定団体の大会を取得
const groupGames = await SwimLiveScraper.getMemberGroupGames(1);
console.log(groupGames);

// 例: 特定大会の詳細情報を取得
const gameDetails = await SwimLiveScraper.getGameDetails('1234567');
console.log(gameDetails);
```

#### レース情報の取得

```typescript
// 例: 特定日付のレースリストを取得
const raceList = await SwimLiveScraper.getRaceListByGameDate('1234567', '2026-08-01');
console.log(raceList);
// NormalizedRace[]を返却: { program_id, race_name, class_name, division_name, ... }

// 例: 特定日付のレースヒートリストを取得
const raceHeats = await SwimLiveScraper.getRaceHeatsListByGameDate('1234567', '2026-08-01');
console.log(raceHeats);

// 例: レース結果を取得
const raceResults = await SwimLiveScraper.getRaceResults('1234567', '1', '1');
console.log(raceResults);
// RaceResult[]を返却: { rank, result_time, swimmer_name, ... }
```

#### 選手情報の取得

```typescript
// 例: 選手情報を取得
const athlete = await SwimLiveScraper.getAthleteDetails('1234567');
console.log(athlete);

// 例: 選手のFINAポイント情報を取得
const finaPoints = await SwimLiveScraper.getAthleteBestFinaPoints('1234567');
console.log(finaPoints);

// 例: 選手の過去記録を取得
const history = await SwimLiveScraper.getAthleteHistory('1234567', 1, 1, 2, 4);
console.log(history);
```

#### 検索機能

```typescript
// 例: V1アスリートを検索
const athletes = await SwimLiveScraper.searchAthletes({ 
  name: '田中', 
  school_class_code: 1, 
  gender_code: 1 
});

// 例: 大会を検索
const games = await SwimLiveScraper.searchGames({
  name: '全国大会',
  year: 2026
});
```

## API メソッド一覧

### 大会関連 API

#### `getGames(): Promise<NormalizedGame[]>`
すべての大会情報を取得します。

- **戻り値**: `Promise<NormalizedGame[]>`
- **説明**: すべての大会情報を正規化して返却します

#### `getGameDetails(gameCode: string): Promise<GameDetail>`
特定の大会の詳細情報を取得します。

- **引数**: `gameCode` (string) - 大会コード
- **戻り値**: `Promise<GameDetail>`
- **説明**: 指定した大会コードの詳細情報を返却します

#### `getMemberGroupGames(groupCode: number | string): Promise<NormalizedGame[]>`
特定の団体コードに関連する大会情報を取得します。

- **引数**: `groupCode` (number | string) - 団体コード
- **戻り値**: `Promise<NormalizedGame[]>`
- **説明**: 指定した団体コードに関連する大会情報を返却します

#### `getGameComprehensiveData(gameCode: string, date?: string): Promise<{ raceList: any; availableDates: any; messages: any; }>`
大会に関する包括的なデータを取得します。

- **引数**: 
  - `gameCode` (string) - 大会コード
  - `date` (string, 省略可) - 日付（指定しない場合は最初の日付が使用されます）
- **戻り値**: `Promise<{ raceList: any; availableDates: any; messages: any; }>`
- **説明**: レースリスト、利用可能な日付、メッセージを返却します

#### `getInProgressCount(): Promise<any>`
進行中の大会数を取得します。

- **戻り値**: `Promise<any>`
- **説明**: 進行中の大会数を返却します

### レース関連 API

#### `getRaceListByGameDate(gameCode: string, date: string): Promise<NormalizedRace[]>`
特定の大会と日付のレースリストを取得します。

- **引数**: 
  - `gameCode` (string) - 大会コード
  - `date` (string) - 日付（YYYY-MM-DD形式）
- **戻り値**: `Promise<NormalizedRace[]>`
- **説明**: 指定した大会と日付のレース情報を正規化して返却します

#### `getRaceHeatsListByGameDate(gameCode: string, date: string): Promise<NormalizedRace[]>`
特定の大会と日付のレースヒートリストを取得します。

- **引数**: 
  - `gameCode` (string) - 大会コード
  - `date` (string) - 日付（YYYY-MM-DD形式）
- **戻り値**: `Promise<NormalizedRace[]>`
- **説明**: 指定した大会と日付のレースヒート情報を正規化して返却します

#### `getRaceStatus(gameCode: string, programId: string, heat: string): Promise<any>`
特定のレースのステータスを取得します。

- **引数**: 
  - `gameCode` (string) - 大会コード
  - `programId` (string) - プログラムID
  - `heat` (string) - ヒート番号
- **戻り値**: `Promise<any>`
- **説明**: 指定したレースのステータス情報を返却します

#### `getRaceResults(gameCode: string, programId: string, heat: string): Promise<RaceResult[]>`
特定のレースの結果を取得します。

- **引数**: 
  - `gameCode` (string) - 大会コード
  - `programId` (string) - プログラムID
  - `heat` (string) - ヒート番号
- **戻り値**: `Promise<RaceResult[]>`
- **説明**: 指定したレースの結果を正規化して返却します

#### `getSearchedRaces(gameCode: string, playerName?: string | null, belongName?: string | null, eventName?: string | null): Promise<any>`
レースを検索します。

- **引数**: 
  - `gameCode` (string) - 大会コード
  - `playerName` (string, 省略可) - 選手名
  - `belongName` (string, 省略可) - 所属名
  - `eventName` (string, 省略可) - 種目名
- **戻り値**: `Promise<any>`
- **説明**: 条件に一致するレースを返却します

### 選手関連 API

#### `getAthleteDetails(swimmerCode: string): Promise<Athlete>`
選手の基本情報を取得します。

- **引数**: `swimmerCode` (string) - 選手コード
- **戻り値**: `Promise<Athlete>`
- **説明**: 指定した選手コードの基本情報を返却します

#### `getAthleteBestFinaPoints(swimmerCode: string, year?: number, waterwayCode?: number): Promise<FinaPoint[]>`
選手の出場種目別ベスト（FINAポイント）を取得します。

- **引数**: 
  - `swimmerCode` (string) - 選手コード
  - `year` (number, 省略可) - 年
  - `waterwayCode` (number, 省略可) - 水路コード（1: 長水路, 2: 短水路）
- **戻り値**: `Promise<FinaPoint[]>`
- **説明**: 指定した選手のFINAポイント情報を返却します

#### `getAthleteSwimedRaces(swimmerCode: string, periodCode?: number, waterwayCode?: number): Promise<AthleteSwimedRace[]>`
選手の泳法別・距離別成績サマリーを取得します。

- **引数**: 
  - `swimmerCode` (string) - 選手コード
  - `periodCode` (number, 省略可) - 期間コード
  - `waterwayCode` (number, 省略可) - 水路コード（1: 長水路, 2: 短水路）
- **戻り値**: `Promise<AthleteSwimedRace[]>`
- **説明**: 指定した選手の泳法別・距離別成績サマリーを返却します

#### `getAthleteEntries(swimmerCode: string): Promise<AthleteEntry[]>`
選手の出場可能種目（エントリー区分）を取得します。

- **引数**: `swimmerCode` (string) - 選手コード
- **戻り値**: `Promise<AthleteEntry[]>`
- **説明**: 指定した選手の出場可能種目情報を返却します

#### `getAthleteRecords(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number, periodCode?: number): Promise<AthleteRecordsResponse>`
選手の種目別記録（年別）を取得します。

- **引数**: 
  - `swimmerCode` (string) - 選手コード
  - `waterwayCode` (number) - 水路コード（1: 長水路, 2: 短水路）
  - `styleCode` (number) - 泳法コード
  - `distanceCode` (number) - 距離コード
  - `periodCode` (number, 省略可) - 期間コード
- **戻り値**: `Promise<AthleteRecordsResponse>`
- **説明**: 指定した選手の特定種目における年別記録を返却します

#### `getAthleteBestRecord(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number): Promise<AthleteBestRecord>`
選手の種目別ベストタイムとランキングを取得します。

- **引数**: 
  - `swimmerCode` (string) - 選手コード
  - `waterwayCode` (number) - 水路コード（1: 長水路, 2: 短水路）
  - `styleCode` (number) - 泳法コード
  - `distanceCode` (number) - 距離コード
- **戻り値**: `Promise<AthleteBestRecord>`
- **説明**: 指定した選手の特定種目におけるベストタイムとランキングを返却します

#### `getAthleteGraphs(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number): Promise<AthleteGraphData>`
選手の種目別記録推移と分布グラフを取得します。

- **引数**: 
  - `swimmerCode` (string) - 選手コード
  - `waterwayCode` (number) - 水路コード（1: 長水路, 2: 短水路）
  - `styleCode` (number) - 泳法コード
  - `distanceCode` (number) - 距離コード
- **戻り値**: `Promise<AthleteGraphData>`
- **説明**: 指定した選手の特定種目における記録推移と分布グラフデータを返却します

#### `getAthleteHistory(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number, divisionCode: number, params?: { period_code?: number; game_category_codes?: number[]; page?: number; per_page?: number }): Promise<AthleteHistoryResponse>`
選手の過去記録を取得します。

- **引数**: 
  - `swimmerCode` (string) - 選手コード
  - `waterwayCode` (number) - 水路コード（1: 長水路, 2: 短水路）
  - `styleCode` (number) - 泳法コード
  - `distanceCode` (number) - 距離コード
  - `divisionCode` (number) - 区分コード（1: 予選, 2: 準決勝, 3: タイム決勝, 4: 決勝, 5: B決勝）
  - `params` (object, 省略可) - 追加パラメータ
- **戻り値**: `Promise<AthleteHistoryResponse>`
- **説明**: 指定した選手の過去記録を返却します

#### `getAthleteComparison(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number, divisionCode: number, resultIds: number[]): Promise<ComparisonResponse>`
複数の記録を比較します。

- **引数**: 
  - `swimmerCode` (string) - 選手コード
  - `waterwayCode` (number) - 水路コード（1: 長水路, 2: 短水路）
  - `styleCode` (number) - 泳法コード
  - `distanceCode` (number) - 距離コード
  - `divisionCode` (number) - 区分コード（1: 予選, 2: 準決勝, 3: タイム決勝, 4: 決勝, 5: B決勝）
  - `resultIds` (number[]) - 結果IDの配列
- **戻り値**: `Promise<ComparisonResponse>`
- **説明**: 指定した選手の記録比較データを返却します

### 検索 API

#### `searchGames(params: SearchGameParams): Promise<GameListResponse>`
大会を検索します。

- **引数**: `params` (SearchGameParams) - 検索パラメータ
- **戻り値**: `Promise<GameListResponse>`
- **説明**: 条件に一致する大会を検索して返却します

#### `searchAthletes(params: { name?: string; member_group_name?: string; school_class_name?: string; gender_name?: string; entry_group_name?: string; page?: number; }): Promise<AthleteListResponse>`
選手を検索します。

- **引数**: `params` (object) - 検索パラメータ
  - `name` (string, 省略可) - 名前
  - `member_group_name` (string, 省略可) - 団体名
  - `school_class_name` (string, 省略可) - 学年名
  - `gender_name` (string, 省略可) - 性別
  - `entry_group_name` (string, 省略可) - 登録団体名
  - `page` (number, 省略可) - ページ番号
- **戻り値**: `Promise<AthleteListResponse>`
- **説明**: 条件に一致する選手を検索して返却します

#### `getV1Games(params: Record<string, string | number>): Promise<GameListResponse>`
V1 APIから大会情報を取得します。

- **引数**: `params` (Record<string, string | number>) - パラメータ
- **戻り値**: `Promise<GameListResponse>`
- **説明**: V1 APIから大会情報を取得して返却します

#### `getV1Game(gameId: string): Promise<Game>`
V1 APIから特定の大会情報を取得します。

- **引数**: `gameId` (string) - 大会ID
- **戻り値**: `Promise<Game>`
- **説明**: V1 APIから特定の大会情報を取得して返却します

#### `getV1MastersSchoolClasses(): Promise<any>`
V1 APIから学校クラスのマスターデータを取得します。

- **戻り値**: `Promise<any>`
- **説明**: 学校クラスのマスターデータを返却します

#### `getV1MastersMemberGroups(): Promise<any>`
V1 APIから団体のマスターデータを取得します。

- **戻り値**: `Promise<any>`
- **説明**: 団体のマスターデータを返却します

#### `getV1MastersGenders(): Promise<any>`
V1 APIから性別のマスターデータを取得します。

- **戻り値**: `Promise<any>`
- **説明**: 性別のマスターデータを返却します

### その他の API

#### `getGameClassInfo(gameCode: string): Promise<GameClassApiResponse>`
大会の種目情報を取得します。

- **引数**: `gameCode` (string) - 大会コード
- **戻り値**: `Promise<GameClassApiResponse>`
- **説明**: 大会で行われる種目情報を返却します

#### `getMastersRaceDivisions(): Promise<MasterData[]>`
レース区分のマスターデータを取得します。

- **戻り値**: `Promise<MasterData[]>`
- **説明**: レース区分のマスターデータを返却します

#### `exportToCSV(data: any[], filename: string): void`
データをCSV形式でエクスポートします。

- **引数**: 
  - `data` (any[]) - エクスポートするデータ
  - `filename` (string) - 出力ファイル名
- **戻り値**: なし
- **説明**: 指定したデータをCSV形式でファイルに出力します

## 型定義

### 基本型

#### `NormalizedGame`
正規化された大会情報

```typescript
interface NormalizedGame {
  game_code: string;
  game_name: string;
  period: string; // 期間 (例: "08.02(日)")
  waterway_code: number; // 数値コードを追加
  waterway_name: string; // 変換済み水路種別
  status_label: '開催中' | '大会終了'; // 判定済みステータス
  group_name: string; // 変換済み地域名
  pool_name: string | null; // プール名
  delivery_status_code: number;
  is_delivery_active: boolean;
  delivery_status_label: string;
}
```

#### `NormalizedRace`
正規化されたレース情報

```typescript
interface NormalizedRace {
  program_id: string;
  display_program_id: string;
  heat: string;
  race_name: string;
  class_name: string;
  division_name: string;
  status: string;
  start_time: string | null;
  start_list_num: number;

  // 進行状態
  is_finished: boolean;
  has_started: boolean;
  is_relay: boolean;
  has_relay_members: boolean;
  has_reaction_time: boolean;
  has_lap_time: boolean;

  // 公開設定・状態
  startlist_pub_setting: string;
  relay_pub_setting: string;
  race_pub_setting: string;
  startlist_pub_status: string;
  relay_order_pub_status: string;
  race_pub_status: string;

  // 統計・集計カウント
  heats_count_per_taikai: number;
  startlist_count_per_taikai: number;
  program_race_num: number;
  program_race_finished_num: number;
  program_empty_race_num: number;
  incomplete_race_num: number;

  // エラー/内部監視
  has_reaction_time_check_err: boolean;
  has_lap_time_check_err: boolean;
  has_multi_incomplete_race_err: boolean;
  has_incomplete_race_num: boolean;

  // 内部判定用
  program_status: number;
  race_status: number;
  alarm_status: number;

  // ステージング/内部順序
  stg_has_reaction_times: boolean;
  stg_has_lap_times: boolean;
  stg_max_unfinished_race_to_err: number;
  incomplete_order: number;
  lag_race_order: number;

  // その他
  updated_at: string;
  game_date: string;
}
```

#### `RaceResult`
レース結果情報

```typescript
interface RaceResult {
  rank: number | null;
  lane: string | null;
  lane_adjusted: string | null;
  result_time: string | null;
  reaction_time: string | null;
  swimmer_name: string | null;
  swimmer_code: string | null;
  entry_group_name1: string | null;
  entry_group_name2: string | null;
  entry_group_name3: string | null;
  school_name: string | null;
  school_class: number | null;
  school_class_code: number | null;
  career_best_time: string | null;
  qualifying_time: string | null;
  qualification_level: string | null;
  lap50: string | null;
  lap100: string | null;
  lap150: string | null;
  lap200: string | null;
  lap250: string | null;
  lap300: string | null;
  lap400: string | null;
  has_reaction_time: boolean;
  has_lap_time: boolean;
  status_text: string | null;
  status_name: string | null;
}
```

### 選手関連型

#### `Athlete`
選手基本情報

```typescript
interface Athlete {
  swimmer_name: string;
  swimmer_code: string;
  entry_group: {
    code: string;
    name: string;
    short_name: string;
    member_group: { code: number; name: string };
  };
  school_class: {
    code: number;
    name: string;
    school_grades: string[];
  };
  gender: { code: number; name: string };
  swimmer_name_roman: string;
  member_group: { code: number; name: string };
  birthday: string;
  age: number;
  entry_groups: {
    code: string;
    name: string;
    short_name: string;
    member_group: { code: number; name: string };
  }[];
  updated_at: string;
}
```

#### `FinaPoint`
FINAポイント情報

```typescript
interface FinaPoint {
  distance: { code: number; name: string; name_for_relay: string | null };
  swimming_style: { code: number; name: string };
  fina_point: number;
  percentage: number;
  result_time: string;
  result_date: string;
  game_name: string;
  game_short_name: string;
  game_code: string;
  class_code: number;
  race_division_code: number;
  heat: number;
  heat_distance_code: number;
  heat_swimming_style_code: number;
  heat_gender_code: number;
  ranking: number;
  race_count: number;
}
```

#### `AthleteSwimedRace`
選手の泳法別・距離別成績サマリー

```typescript
interface AthleteSwimedRace {
  swimming_style: MasterData;
  distances: {
    distance: MasterData;
    fina_point: number;
    appearances: number;
    percentage: number;
  }[];
}
```

#### `AthleteEntry`
選手の出場可能種目情報

```typescript
interface AthleteEntry {
  distance: { code: number; name: string; name_for_relay: string | null };
  swimming_style: MasterData;
  waterways: Waterway[];
  divisions: {
    division: RaceDivision;
    waterways: Waterway[];
  }[];
}
```

#### `AthleteRecordsResponse`
選手の年別記録情報

```typescript
interface AthleteRecordsResponse {
  upperLimit: string;
  lowerLimit: string;
  result: {
    year: number;
    data: RaceRecordData[];
  }[];
}
```

#### `AthleteBestRecord`
選手のベストタイムとランキング

```typescript
interface AthleteBestRecord {
  year: number;
  result_time: string;
  result_date: string;
  fina_point: number;
  percentage: number;
  game_name: string;
  game_code: string;
  class_code: number;
  race_division_code: number;
  heat: number;
  rankings: {
    title: string;
    ranking: number;
    total: number;
  }[];
}
```

#### `AthleteGraphData`
選手の記録推移と分布グラフ

```typescript
interface AthleteGraphData {
  records: {
    school_class: {
      code: number;
      name: string;
      grades: number[];
      member_group: MasterData;
    };
    record: {
      record: string;
      achieve_date: string;
      is_new: boolean;
    };
  }[];
  japan_record: {
    record: string;
    achieve_date: string;
    is_new: boolean;
  };
  graphs: {
    max_time: string;
    min_time: string;
    data: {
      school_class: { code: number; name: string; grades: number[] };
      total: number;
      distributions: Distribution[];
    }[];
  };
}
```

## 使用例

### 大会情報の取得と表示

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

async function fetchGames() {
  try {
    // 全ての大会情報を取得
    const games = await SwimLiveScraper.getGames();
    
    // 各大会情報を表示
    games.forEach(game => {
      console.log(`${game.game_name} (${game.period}) - ${game.status_label}`);
    });
  } catch (error) {
    console.error('大会情報の取得に失敗しました:', error);
  }
}

fetchGames();
```

### 特定大会のレース情報取得

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

async function fetchRaceInfo(gameCode: string, date: string) {
  try {
    // 指定日のレース情報を取得
    const races = await SwimLiveScraper.getRaceListByGameDate(gameCode, date);
    
    // レース情報を表示
    races.forEach(race => {
      console.log(`${race.race_name} (${race.division_name}) - ${race.status}`);
    });
  } catch (error) {
    console.error('レース情報の取得に失敗しました:', error);
  }
}

fetchRaceInfo('1234567', '2026-08-01');
```

### 選手情報の取得と分析

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

async function analyzeAthlete(swimmerCode: string) {
  try {
    // 選手の基本情報を取得
    const athlete = await SwimLiveScraper.getAthleteDetails(swimmerCode);
    console.log('選手名:', athlete.swimmer_name);
    console.log('所属:', athlete.entry_group.name);
    
    // 選手のFINAポイント情報を取得
    const finaPoints = await SwimLiveScraper.getAthleteBestFinaPoints(swimmerCode, 2026, 1);
    console.log('種目別ベスト数:', finaPoints.length);
    
    // 最高FINAポイントを計算
    const maxFinaPoint = Math.max(...finaPoints.map(fp => fp.fina_point));
    console.log('最高FINAポイント:', maxFinaPoint);
    
    // 選手の泳法別成績を取得
    const swimedRaces = await SwimLiveScraper.getAthleteSwimedRaces(swimmerCode, 1, 1);
    console.log('泳法数:', swimedRaces.length);
    
    swimedRaces.forEach(style => {
      console.log(`${style.swimming_style.name}: ${style.distances.length}種目`);
    });
  } catch (error) {
    console.error('選手情報の取得に失敗しました:', error);
  }
}

analyzeAthlete('1234567');
```

### 大会結果のCSV出力

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

async function exportRaceResultsToCSV(gameCode: string, programId: string, heat: string, filename: string) {
  try {
    // レース結果を取得
    const results = await SwimLiveScraper.getRaceResults(gameCode, programId, heat);
    
    // CSV形式で出力
    SwimLiveScraper.exportToCSV(results, filename);
    console.log(`${filename} に出力しました`);
  } catch (error) {
    console.error('レース結果の出力に失敗しました:', error);
  }
}

exportRaceResultsToCSV('1234567', '1', '1', 'race_results.csv');
```

### 選手の種目別記録推移の取得

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

async function getAthletePerformanceTrend(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number) {
  try {
    // ベスト記録情報を取得
    const bestRecord = await SwimLiveScraper.getAthleteBestRecord(swimmerCode, waterwayCode, styleCode, distanceCode);
    console.log('ベストタイム:', bestRecord.result_time);
    console.log('記録日:', bestRecord.result_date);
    
    // 記録推移グラフ情報を取得
    const graphData = await SwimLiveScraper.getAthleteGraphs(swimmerCode, waterwayCode, styleCode, distanceCode);
    console.log('記録推移数:', graphData.records.length);
    console.log('日本記録:', graphData.japan_record.record);
    
    // 各学年の記録を表示
    graphData.records.forEach(record => {
      console.log(`${record.school_class.name}: ${record.record.record} (${record.record.achieve_date})`);
    });
  } catch (error) {
    console.error('選手記録の取得に失敗しました:', error);
  }
}

// 50m自由形（水路コード1、泳法コード1、距離コード2）の記録を取得
getAthletePerformanceTrend('1234567', 1, 1, 2);
```

## 便利なマッピング情報

### 水路コードマッピング

| コード | 名前 |
|--------|------|
| 1 | 長水路 |
| 2 | 短水路 |
| 3 | 室内短水路 |

### 泳法コードマッピング

| コード | 名前 |
|--------|------|
| 1 | 自由形 |
| 2 | 背泳ぎ |
| 3 | 平泳ぎ |
| 4 | バタフライ |
| 5 | 個人メドレー |
| 6 | フリーリレー |
| 7 | メドレーリレー |

### 距離コードマッピング

| コード | 名前 |
|--------|------|
| 1 | 25m |
| 2 | 50m |
| 3 | 100m |
| 4 | 200m |
| 5 | 400m |
| 6 | 800m |
| 7 | 1500m |

### 性別コードマッピング

| コード | 名前 |
|--------|------|
| 1 | 男子 |
| 2 | 女子 |
| 3 | 混合 |

### 区分コードマッピング

| コード | 名前 |
|--------|------|
| 1 | 予選 |
| 2 | 準決勝 |
| 3 | タイム決勝 |
| 4 | 決勝 |
| 5 | B決勝 |

このドキュメントは随時更新されます。