# API Documentation

## SwimLiveScraper

### Methods

#### `getMemberGroupGames(groupCode: number | string): Promise<any>`
Fetches the list of games for a member group.

#### `getGameDetails(gameCode: string): Promise<any>`
Fetches details of a specific game.

#### `getRaceListByGameDate(gameCode: string, date: string): Promise<any>`
Fetches the race list for a specific game and date.

#### `getRaceStatus(gameCode: string, programId: string, heat: string): Promise<any>`
Fetches the status of a race.

#### `getRaceResults(gameCode: string, programId: string, heat: string): Promise<RaceResult[]>`
Fetches and parses the results of a race.

#### `getSearchedRaces(gameCode: string, playerName: string | null, belongName: string | null, eventName: string | null): Promise<any>`
Searches for races based on player name, belong name, and event name.

#### `getGames(): Promise<any>`
Fetches the list of games.

#### `getInProgressCount(): Promise<any>`
Fetches the count of games in progress.

#### `getMastersMemberGroups(): Promise<any>`
Fetches the masters member groups.

#### `getRaceMessages(gameCode: string): Promise<any>`
Fetches messages for a specific game.

#### `getNextRace(gameCode: string, programId: string, heat: string, raceDate: string): Promise<any>`
Fetches the next race info.

#### `getSelectDateList(gameCode: string): Promise<any>`
Fetches the available dates for a game.
