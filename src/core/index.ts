import fs from 'fs';
import { Parser } from 'json2csv';
import { LiveApi } from '../apis/live_api';
import { V1Api } from '../apis/v1_api';
import { parseRaceResults, normalizeRaceList, normalizeGameDetail, normalizeLiveGame, createMasterMap, parseAthlete, parseFinaPoints, parseAthleteSwimedRaces, parseAthleteEntries, parseAthleteRecords, parseAthleteBestRecord, parseAthleteGraphs, parseGameClassInfo, parseAthleteHistory, parseComparisonData, normalizeRaceHeatsList } from '../parsers/parser';
import { Game, Athlete, FinaPoint, GameListResponse, Announcement, AthleteListResponse, SearchGameParams, NormalizedRace, GameDetail, NormalizedGame, RaceResult, AthleteSwimedRace, AthleteEntry, AthleteRecordsResponse, AthleteBestRecord, AthleteGraphData, GameClassApiResponse, AthleteHistoryResponse, ComparisonResponse, MasterData } from '../types/types';

export { createMasterMap };

export class SwimLiveScraper {
  private static memberGroupsCache: any[] | null = null;
  private static schoolClassesCache: any[] | null = null;
  private static gendersCache: any[] | null = null;

  private static async getCachedMemberGroups(): Promise<any[]> {
    if (!this.memberGroupsCache) {
      this.memberGroupsCache = await V1Api.getMastersMemberGroups();
    }
    return this.memberGroupsCache!;
  }

  private static async getCachedSchoolClasses(): Promise<any[]> {
    if (!this.schoolClassesCache) {
      this.schoolClassesCache = await V1Api.getMastersSchoolClasses();
    }
    return this.schoolClassesCache!;
  }

  private static async getCachedGenders(): Promise<any[]> {
    if (!this.gendersCache) {
      this.gendersCache = await V1Api.getMastersGenders();
    }
    return this.gendersCache!;
  }

  private static async enrichGames(games: any[]): Promise<NormalizedGame[]> {
    const groups = await this.getCachedMemberGroups();
    const groupMap = createMasterMap(groups);
    return games.map(game => normalizeLiveGame(game, groupMap));
  }

  // --- Core Methods (using LiveApi) ---
  static async getGameComprehensiveData(gameCode: string, date?: string): Promise<{
    raceList: any;
    availableDates: any;
    messages: any;
  }> {
    const [availableDates, messages] = await Promise.all([
      LiveApi.getSelectDateList(gameCode),
      LiveApi.getRaceMessages(gameCode),
    ]);

    const targetDate = date || (Array.isArray(availableDates) && availableDates.length > 0 ? availableDates[0].race_date : '');
    const raceList = targetDate ? await LiveApi.getRaceListByGameDate(gameCode, targetDate) : null;

    return { raceList, availableDates, messages };
  }

  static async getMemberGroupGames(groupCode: number | string): Promise<NormalizedGame[]> {
    const games = await LiveApi.getMemberGroupGames(groupCode);
    return Array.isArray(games) ? await this.enrichGames(games) : [];
  }

  static async getGameDetails(gameCode: string): Promise<GameDetail> {
    const raw = await LiveApi.getGameDetails(gameCode);
    return normalizeGameDetail(raw);
  }

  static async getRaceListByGameDate(gameCode: string, date: string): Promise<NormalizedRace[]> {
    const raw = await LiveApi.getRaceListByGameDate(gameCode, date);
    return normalizeRaceList(raw);
  }

  static async getRaceHeatsListByGameDate(gameCode: string, date: string): Promise<NormalizedRace[]> {
    const raw = await LiveApi.getRaceListByGameDate(gameCode, date);
    return normalizeRaceHeatsList(raw);
  }

  static async getRaceStatus(gameCode: string, programId: string, heat: string): Promise<any> {
    return await LiveApi.getRaceStatus(gameCode, programId, heat);
  }

  static async getRaceResults(gameCode: string, programId: string, heat: string): Promise<RaceResult[]> {
    const raw = await LiveApi.getRaceResults(gameCode, programId, heat);
    return parseRaceResults(raw);
  }

  static async getSearchedRaces(gameCode: string, playerName: string | null = null, belongName: string | null = null, eventName: string | null = null): Promise<any> {
    const params: Record<string, string> = {};
    if (playerName) params.playerName = playerName;
    if (belongName) params.belongName = belongName;
    if (eventName) params.eventName = eventName;
    return await LiveApi.getSearchedRaces(gameCode, params);
  }

  static async getGames(): Promise<NormalizedGame[]> {
    const games = await LiveApi.getGames();
    return Array.isArray(games) ? await this.enrichGames(games) : [];
  }

  static async getInProgressCount(): Promise<any> {
    return await LiveApi.getInProgressCount();
  }

  // --- Athlete Data API Methods (using V1Api) ---
  static async getAthleteDetails(swimmerCode: string): Promise<Athlete> {
    const raw = await V1Api.getAthlete(swimmerCode);
    return parseAthlete(raw);
  }

  static async getAthleteBestFinaPoints(swimmerCode: string, year?: number, waterwayCode?: number): Promise<FinaPoint[]> {
    const raw = await V1Api.getAthleteBestFinaPoints(swimmerCode, year, waterwayCode);
    return parseFinaPoints(raw);
  }

  static async getAthleteSwimedRaces(swimmerCode: string, periodCode?: number, waterwayCode?: number): Promise<AthleteSwimedRace[]> {
    const raw = await V1Api.getAthleteSwimedRaces(swimmerCode, periodCode, waterwayCode);
    return parseAthleteSwimedRaces(raw);
  }

  static async getAthleteEntries(swimmerCode: string): Promise<AthleteEntry[]> {
    const raw = await V1Api.getAthleteEntries(swimmerCode);
    return parseAthleteEntries(raw);
  }

  static async getAthleteRecords(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number, periodCode?: number): Promise<AthleteRecordsResponse> {
    const raw = await V1Api.getAthleteRecords(swimmerCode, waterwayCode, styleCode, distanceCode, periodCode);
    return parseAthleteRecords(raw);
  }

  static async getAthleteBestRecord(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number): Promise<AthleteBestRecord> {
    const raw = await V1Api.getAthleteBestRecord(swimmerCode, waterwayCode, styleCode, distanceCode);
    return parseAthleteBestRecord(raw);
  }

  static async getAthleteGraphs(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number): Promise<AthleteGraphData> {
    const raw = await V1Api.getAthleteGraphs(swimmerCode, waterwayCode, styleCode, distanceCode);
    return parseAthleteGraphs(raw);
  }

  // --- New API Methods ---
  static async getGameClassInfo(gameCode: string): Promise<GameClassApiResponse> {
    const raw = await V1Api.getGameClassInfo(gameCode);
    return parseGameClassInfo(raw);
  }

  static async getMastersRaceDivisions(): Promise<MasterData[]> {
    return await V1Api.getMastersRaceDivisions();
  }

  static async getAthleteHistory(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number, divisionCode: number, params?: { period_code?: number; game_category_codes?: number[]; page?: number; per_page?: number }): Promise<AthleteHistoryResponse> {
    const raw = await V1Api.getAthleteHistory(swimmerCode, waterwayCode, styleCode, distanceCode, divisionCode, params);
    return parseAthleteHistory(raw);
  }

  static async getAthleteComparison(swimmerCode: string, waterwayCode: number, styleCode: number, distanceCode: number, divisionCode: number, resultIds: number[]): Promise<ComparisonResponse> {
    const raw = await V1Api.getAthleteComparison(swimmerCode, waterwayCode, styleCode, distanceCode, divisionCode, resultIds);
    return parseComparisonData(raw);
  }

  // --- V1 Dedicated API Wrappers (using V1Api) ---
  static async getV1Games(params: Record<string, string | number>): Promise<GameListResponse> { return V1Api.getGames(params); }
  static async getV1Game(gameId: string): Promise<Game> { return V1Api.get('games/' + gameId); }
  static async getV1MastersSchoolClasses(): Promise<any> { return V1Api.getMastersSchoolClasses(); }
  static async getV1MastersMemberGroups(): Promise<any> { return V1Api.getMastersMemberGroups(); }
  static async getV1MastersGenders(): Promise<any> { return V1Api.getMastersGenders(); }
  
  static async searchGames(params: SearchGameParams): Promise<GameListResponse> {
    return await V1Api.searchGames(params);
  }

    static async searchAthletes(params: {
        name?: string;
        member_group_name?: string;
        school_class_name?: string;
        gender_name?: string;
        entry_group_name?: string;
        page?: number;
    }): Promise<AthleteListResponse> {
        const groups = await this.getCachedMemberGroups() || [];
        const classes = await this.getCachedSchoolClasses() || [];
        const genders = await this.getCachedGenders() || [];

        const memberGroup = groups.find(g => g.member_group_name === params.member_group_name);
        const schoolClass = classes.find(c => c.school_class_name === params.school_class_name);
        const gender = genders.find(g => g.gender_name === params.gender_name);

        return await V1Api.searchAthletes(
            params,
            (memberGroup && memberGroup.code !== null) ? memberGroup.code : 99,
            (schoolClass && schoolClass.code !== null) ? schoolClass.code : 99,
            (gender && gender.code !== null) ? gender.code : 99
        );
    }

    // 選手コードをAPI IDに変換するヘルパー関数
    static swimmerCodeToApiId(swimmerCode: string): string {
        const e = parseInt(swimmerCode, 10);
        if (isNaN(e)) {
            throw new Error(`Invalid swimmer code: ${swimmerCode}`);
        }
        const apiId = (e + 10000000) * 3 + 3;
        return apiId.toString();
    }

  // CSV
  static exportToCSV(data: any[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn("データが空です。デフォルトのヘッダーのみで出力します。");
      
      const defaultFields = [
        "swimmer_name", "entry_group_name1", "heat", "lane",
        "game_code", "program_id", "display_program_id", "distance",
        "race_date", "status_name", "result_time"
      ];
      const parser = new Parser({ fields: defaultFields });
      const csv = parser.parse([]);
      
      fs.writeFileSync(filename, csv);
      console.log(`${filename} へ空のCSVを出力しました。`);
      return;
    }

    try {
      const parser = new Parser();
      const csv = parser.parse(data);
      fs.writeFileSync(filename, csv);
      console.log(`${filename} へ出力しました。`);
    } catch (err: any) {
      console.error("CSV出力中にエラー:", err.message);
    }
  }
}