# swim-live-scraper

A library to fetch live scores from the JASF official swim competition live score API.

## Installation

```bash
npm install swim-live-scraper
```

## Usage

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

// Example: Search for races
const races = await SwimLiveScraper.getSearchedRaces('3824703', 'Player Name', null, null);
console.log(races);
```

## Documentation

See [API Documentation](docs/api.md) for more details.

## Example

Check `example/example_usage.ts` for more examples.
