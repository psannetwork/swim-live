# Swim-Live API Documentation

This library provides a robust, type-safe, and normalized interface to access swim-live results data.

## Core Design Principles

1.  **Robust Error Handling**: Communication errors are handled via a custom `SwimApiError` hierarchy.
2.  **Type Safety & Normalization**:
    - Divergent structures from Live (`LiveGame`) and V1 (`RawGame`) APIs are normalized into a unified `NormalizedGame` type.
    - Master data (e.g., `member_groups`) is automatically integrated via `createMasterMap` for efficient O(1) attribute resolution.
3.  **Automatic Enrichment**:開催地 (venue), ステータス (status) metadata are automatically joined via the `enrichGames` logic.

---

## 1. SwimLiveScraper API Methods

All interactions are managed through the `SwimLiveScraper` static class.

### Normalized Game Data

#### `getGames(): Promise<NormalizedGame[]>`
Fetches and normalizes game data from both Live and V1 endpoints.

- **Returns**: `Promise<NormalizedGame[]>`

#### `getGameDetails(gameCode: string): Promise<GameDetail>`
Fetches detailed information for a specific game.

- **Arguments**:
    - `gameCode` (string): The unique identifier for the game.
- **Returns**: `Promise<GameDetail>`

### V1 Dedicated Search Methods

#### `searchGames(params: SearchGameParams): Promise<RawGame[]>`
Direct V1 API search for games.

- **Arguments**:
    - `params` (`SearchGameParams`): Object containing search criteria (e.g., year, keyword).
- **Returns**: `Promise<RawGame[]>`

#### `searchAthletes(params: SearchAthleteParams): Promise<Athlete[]>`
Search for athletes.

- **Arguments**:
    - `params` (`SearchAthleteParams`): Search criteria.
- **Returns**: `Promise<Athlete[]>`

### Athlete Profile Endpoints

#### `getV1Athlete(athleteId: string): Promise<Athlete>`
Fetches profile information for a specific athlete.

- **Arguments**:
    - `athleteId` (string): Unique athlete identifier.
- **Returns**: `Promise<Athlete>`

#### `getV1AthleteCareers(athleteId: string): Promise<AthleteCareer[]>`
Fetches the career summary for an athlete.

- **Arguments**:
    - `athleteId` (string): Unique athlete identifier.
- **Returns**: `Promise<AthleteCareer[]>`

#### `getV1AthleteBestFinaPoints(athleteId: string, year?: number, waterwayCode?: number): Promise<FinaPoint[]>`
Fetches the best FINA points for an athlete.

- **Arguments**:
    - `athleteId` (string)
    - `year` (number, optional)
    - `waterwayCode` (number, optional)
- **Returns**: `Promise<FinaPoint[]>`

---

## Appendix: API Code Mapping

For comprehensive understanding of the API numerical codes and statuses, refer to the following mapping tables.

### 1. Race Status (`program_status` / `race_status`)

| Code | Meaning | Display Text |
| :--- | :--- | :--- |
| 0 | Unstarted | "未開始" |
| 1 | Startlist Published | "スタートリスト公開" |
| 2 | In Progress | "進行中" |
| 3 | Finished (Unconfirmed) | "終了（未確定）" |
| 4 | Result Confirmed (Tentative) | "結果確定（暫定）" |
| 5 | Result Confirmed (Official) | "結果確定（公式）" |
| 8 | Data Inputting | "データ入力中" |
| **9** | **Data Entry Completed** | **"データ登録完了"** |

### 2. Publication Status (`*_pub_status`)

| Code | Meaning |
| :--- | :--- |
| 0 | Unpublished |
| **1** | **Published** |
| 9 | Publishing Completed (Data Finalized) |

### 3. Publication Policy (`*_publishing_setting`)

| Code | Meaning |
| :--- | :--- |
| **1** | **Publish immediately after registration** |
| 2 | Publish after approval |
| 3 | Unpublished |

---

## 4. Usage Examples

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

// Example: Get normalized game list (Auto-integrates master data)
async function fetchGames() {
  const games = await SwimLiveScraper.getGames();
  
  // NormalizedGame objects are ready to use
  games.forEach(game => {
    console.log(`${game.game_name} - Status: ${game.status_label}`);
  });
}
```

*Note: For debugging, `console.debug` outputs the request URLs, allowing for network monitoring.*
