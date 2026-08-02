# Swim-Live API Documentation (v1)

This documentation covers the `SwimLiveScraper` V1 API methods. All methods return a promise. For robust development, it is highly recommended to validate the response structure against expected types.

## General Usage

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

// Example: Fetch Athlete Details
const athlete = await SwimLiveScraper.getV1Athlete('54165999');
if (athlete && athlete.swimmer_name) {
  console.log(athlete.swimmer_name);
}
```

## Games Endpoints

### `getV1Games(params: Record<string, string | number>): Promise<GameListResponse>`
Fetches the list of games.
- **Required Params:** `year`, `game_status`.
- **Response Structure:** `{ data: Game[], links: Object, meta: Object }`

### `getV1Game(gameId: string): Promise<Game>`
Fetches details of a specific game.

## Athlete Endpoints

### `getV1Athlete(athleteId: string): Promise<Athlete>`
Fetches profile information for a specific athlete.

### `getV1AthleteCareers(athleteId: string): Promise<Career[]>`
Fetches the career summary (by year/waterway) for an athlete.

### `getV1AthleteBestFinaPoints(athleteId: string, year?: number, waterwayCode?: number): Promise<FinaPoint[]>`
Fetches the best FINA points achieved by the athlete.

### `getV1AthleteSwimedRaces(athleteId: string, periodCode?: number, waterwayCode?: number): Promise<SwimedRace[]>`
Fetches the summary of raced styles/distances.

## Masters & Metadata Endpoints

Static master data can be fetched using `getV1Masters*()` methods:
- `getV1MastersWaterways()`
- `getV1MastersSwimmingStyles()`
- `getV1MastersGenders()`
- `getV1MastersSchoolClasses()`
- ... (and others)

## Response Validation Strategy

To ensure type safety and handle API changes, implement validation:

```typescript
// Example: Validating Athlete Response
interface Athlete {
  swimmer_name: string;
  swimmer_code: string;
  // ... other fields
}

function isAthlete(data: any): data is Athlete {
  return typeof data === 'object' && 'swimmer_name' in data && 'swimmer_code' in data;
}

const data = await SwimLiveScraper.getV1Athlete('54165999');
if (isAthlete(data)) {
  // Safe to use data.swimmer_name
} else {
  throw new Error('Invalid API response structure');
}
```
