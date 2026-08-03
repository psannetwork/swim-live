# swim-live-scraper

A library to fetch live scores and V1 data from the JASF official swim competition API, providing type-safe, normalized data structures.

## Installation

```bash
npm install swim-live-scraper
```

## Usage

```typescript
import { SwimLiveScraper } from 'swim-live-scraper';

// Example: Get normalized game list (Auto-integrates master data)
const games = await SwimLiveScraper.getGames();
console.log(games); 
// Returns NormalizedGame[]: { game_name, group_name, status_label, ... }

// Example: Search for V1 athletes
const athletes = await SwimLiveScraper.searchAthletes({ 
  name: '田中', 
  school_class_code: 1, 
  gender_code: 1 
});
```

## Documentation

See [API Documentation](API.md) for more details.
