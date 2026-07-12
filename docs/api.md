# API Documentation

## SwimLiveScraper

### Core Methods

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

### V1 Dedicated Methods

#### `getV1Games(params: string): Promise<any>`
Fetches games list (v1 API). Required `params` (e.g., 'year=2026&game_status=3').

#### `getV1Game(gameId: string): Promise<any>`
Fetches specific game details (v1 API).

#### `getV1GameClasses(gameId: string): Promise<any>`
Fetches game classes (v1 API).

#### `getV1GameRaces(gameId: string): Promise<any>`
Fetches game races (v1 API).

#### `getV1Athlete(athleteId: string): Promise<any>`
Fetches athlete details (v1 API).

#### `getV1AthleteBestFinaPoints(athleteId: string, params: string): Promise<any>`
Fetches athlete FINA points (v1 API).

#### `getV1AthleteCareers(athleteId: string): Promise<any>`
Fetches athlete careers (v1 API).

#### `getV1AthleteEntries(athleteId: string, params: string = ''): Promise<any>`
Fetches athlete entries (v1 API).

#### `getV1AthleteSwimedRaces(athleteId: string, params: string): Promise<any>`
Fetches athlete swam races (v1 API).

#### `getV1Masters*()`
Collection of static masters endpoints (e.g., `getV1MastersDisplayYear`, `getV1MastersDistances`, `getV1MastersGenders`, etc.).

#### `getV1AnnouncementsLatest(): Promise<any>`
Fetches latest announcements (v1 API).

#### `getV1RankingsUpdatedTime(): Promise<any>`
Fetches rankings updated time (v1 API).

#### `getV1StandardRecordBreakersUpdatedTime(): Promise<any>`
Fetches standard record breakers updated time (v1 API).
