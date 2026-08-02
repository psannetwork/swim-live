# swim-live-scraper

A library to fetch live scores from the JASF official swim competition live score API.

## Installation

```bash
npm install swim-live-scraper
```

## Usage

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

// Example: Search for games
const games = await SwimLiveScraper.searchGames({ name: '日本選手権', year: 2026 });
console.log(games.data);

// Example: Search for athletes
const athletes = await SwimLiveScraper.searchAthletes({ 
  name: '田中', 
  school_class_code: 1, 
  gender_code: 1 
});
console.log(athletes.data);
```

## Documentation

See [API Documentation](docs/api.md) for more details.

## Example

Check `example/example_usage.ts` for more examples.
