import fs from 'fs';
import { Parser } from 'json2csv';
import { fetchJson } from './scraper';
import { parseRaceResults, RaceResult, normalizeRaceList, normalizeGameDetail, normalizeGame, normalizeLiveGame, createMasterMap } from './parser';
import { Game, Athlete, FinaPoint, GameListResponse, Announcement, AthleteListResponse, SearchGameParams, NormalizedRace, GameDetail, NormalizedGame } from './types';

export class SwimLiveScraper {
  private static memberGroupsCache: any[] | null = null;
  private static schoolClassesCache: any[] | null = null;
  private static gendersCache: any[] | null = null;

  // Helper for query params
  private static serializeParams(params: Record<string, string | number | (string | number)[]>): string {
    return Object.entries(params)
      .flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(v => `${key}[]=${encodeURIComponent(String(v))}`);
        }
        return `${key}=${encodeURIComponent(String(value))}`;
      })
      .join('&');
  }

  private static async getCachedMemberGroups(): Promise<any[]> {
    if (!this.memberGroupsCache) {
      this.memberGroupsCache = await this.getV1MastersMemberGroups();
    }
    return this.memberGroupsCache!;
  }

  private static async getCachedSchoolClasses(): Promise<any[]> {
    if (!this.schoolClassesCache) {
      this.schoolClassesCache = await this.getV1MastersSchoolClasses();
    }
    return this.schoolClassesCache!;
  }

  private static async getCachedGenders(): Promise<any[]> {
    if (!this.gendersCache) {
      this.gendersCache = await this.getV1MastersGenders();
    }
    return this.gendersCache!;
  }

  private static async enrichGames(games: any[]): Promise<NormalizedGame[]> {
    const groups = await this.getCachedMemberGroups();
    const groupMap = createMasterMap(groups);
    return games.map(game => normalizeLiveGame(game, groupMap));
  }

  // --- Core Methods ---
  static async getGameComprehensiveData(gameCode: string, date?: string): Promise<{
    raceList: any;
    availableDates: any;
    messages: any;
  }> {
    const [availableDates, messages] = await Promise.all([
      this.getSelectDateList(gameCode),
      this.getRaceMessages(gameCode),
    ]);

    const targetDate = date || (Array.isArray(availableDates) && availableDates.length > 0 ? availableDates[0].race_date : '');
    const raceList = targetDate ? await this.getRaceListByGameDate(gameCode, targetDate) : null;

    return { raceList, availableDates, messages };
  }

  static async getMemberGroupGames(groupCode: number | string): Promise<NormalizedGame[]> {
    const url = `https://live-results.swim.or.jp/api/games/member_group/${groupCode}`;
    const games = await fetchJson<any[]>(url);
    return Array.isArray(games) ? await this.enrichGames(games) : [];
  }

  static async getGameDetails(gameCode: string): Promise<GameDetail> {
    const url = `https://live-results.swim.or.jp/api/games/${gameCode}`;
    const raw = await fetchJson<any>(url);
    return normalizeGameDetail(raw);
  }

  static async getRaceListByGameDate(gameCode: string, date: string): Promise<NormalizedRace[]> {
    const url = `https://live-results.swim.or.jp/api/race_heats/race_list/${gameCode}?game_date=${date}`;
    const raw = await fetchJson<any[]>(url);
    return normalizeRaceList(raw);
  }

  static async getRaceStatus(gameCode: string, programId: string, heat: string): Promise<any> {
    const url = `https://live-results.swim.or.jp/api/race_heats/race?game_code=${gameCode}&program_id=${programId}&heat=${heat}`;
    return await fetchJson(url);
  }

  static async getRaceResults(gameCode: string, programId: string, heat: string): Promise<RaceResult[]> {
    const url = ` https://live-results.swim.or.jp/api/result/race?game_code=${gameCode}&program_id=${programId}&heat=${heat}&raceStatus=9`;
    const raw = await fetchJson(url);
    return parseRaceResults(raw);
  }

  static async getSearchedRaces(gameCode: string, playerName: string | null = null, belongName: string | null = null, eventName: string | null = null): Promise<any> {
    let url = ` https://live-results.swim.or.jp/api/race_heats/searchedRaceHeats/${gameCode}`;
    const params: string[] = [];

    if (playerName) params.push(`playerName=${encodeURIComponent(playerName)}`);
    if (belongName) params.push(`belongName=${encodeURIComponent(belongName)}`);
    if (eventName) params.push(`eventName=${encodeURIComponent(eventName)}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return await fetchJson(url);
  }

  static async getGames(): Promise<NormalizedGame[]> {
    const games = await fetchJson<any[]>('https://live-results.swim.or.jp/api/games/');
    return Array.isArray(games) ? await this.enrichGames(games) : [];
  }

  static async getInProgressCount(): Promise<any> {
    return await fetchJson('https://live-results.swim.or.jp/api/games/in_progress_count');
  }

  static async getMastersMemberGroups(): Promise<any> {
    return await fetchJson('https://live-results.swim.or.jp/api/masters/member_groups');
  }

  static async getRaceMessages(gameCode: string): Promise<any> {
    return await fetchJson(`https://live-results.swim.or.jp/api/race_heats/messages/${gameCode}`);
  }

  static async getNextRace(gameCode: string, programId: string, heat: string, raceDate: string): Promise<any> {
    const url = `https://live-results.swim.or.jp/api/race_heats/next?game_code=${gameCode}&program_id=${programId}&heat=${heat}&race_date=${raceDate}`;
    return await fetchJson(url);
  }

  static async getSelectDateList(gameCode: string): Promise<any> {
    return await fetchJson(`https://live-results.swim.or.jp/api/race_heats/select_date/${gameCode}`);
  }

  // --- V1 Dedicated API Wrappers ---
  public static async getV1(path: string, params?: Record<string, string | number | (string | number)[]>): Promise<any> {
    const queryString = params ? this.serializeParams(params) : '';
    
    // URLに既にクエリが含まれている場合を考慮
    const separator = path.includes('?') ? '&' : '?';
    const url = `https://result.swim.or.jp/api/v1/${path.startsWith('/') ? path.slice(1) : path}${queryString ? separator + queryString : ''}`;
    return await fetchJson(url);
  }

  // Generic Comparing Wrapper
  static async getV1Comparing(path: string, params?: Record<string, string | number | (string | number)[]>): Promise<any> {
    return this.getV1(`${path}/comparing`, params);
  }

  // Games
  static async getV1Games(params: Record<string, string | number>): Promise<GameListResponse> { return this.getV1('games', params); }
  static async getV1Game(gameId: string): Promise<Game> { return this.getV1(`games/${gameId}`); }
  static async getV1GameClasses(gameId: string): Promise<any> { return this.getV1(`games/${gameId}/classes`); }
  static async getV1GameRaces(gameId: string): Promise<any> { return this.getV1(`games/${gameId}/races`); }
  static async getV1GameHeats(gameId: string, gender: string, style: string, distance: string, classCode: string): Promise<any> {
    return this.getV1(`games/${gameId}/heats/genders/${gender}/swimming_styles/${style}/distances/${distance}/classes/${classCode}`);
  }
  static async getV1GameResults(gameId: string, gender: string, style: string, distance: string, classCode: string, division: string, heat: string): Promise<any> {
    return this.getV1(`games/${gameId}/results/genders/${gender}/swimming_styles/${style}/distances/${distance}/classes/${classCode}/race_divisions/${division}/heats/${heat}`);
  }
  static async getV1GameResultsComparing(gameId: string, gender: string | number, style: string | number, distance: string | number, classCode: string | number, division: string | number, heat: string | number, resultIds: (string | number)[], params?: Record<string, string | number | (string | number)[]>): Promise<any> {
    const p = params || {};
    return this.getV1(`games/${gameId}/results/genders/${gender}/swimming_styles/${style}/distances/${distance}/classes/${classCode}/race_divisions/${division}/heats/${heat}/comparing`, { ...p, result_ids: resultIds });
  }

  // Athlete Details & Analysis
  static async getV1Athlete(athleteId: string): Promise<Athlete> { return this.getV1(`athletes/${athleteId}`); }
  static async getV1AthleteBestFinaPoints(athleteId: string, year?: number, waterwayCode?: number): Promise<any> {
    const params: Record<string, string | number> = {};
    if (year) params.year = year;
    if (waterwayCode) params.waterway_code = waterwayCode;
    return this.getV1(`athletes/${athleteId}/best_fina_points`, params);
  }
  static async getV1AthleteCareers(athleteId: string): Promise<any> { return this.getV1(`athletes/${athleteId}/careers`); }
  static async getV1AthleteEntries(athleteId: string, params?: Record<string, string | number>): Promise<any> {
    return this.getV1(`athletes/${athleteId}/entries`, params);
  }
  static async getV1AthleteSwimedRaces(athleteId: string, periodCode?: number, waterwayCode?: number): Promise<any> {
    const params: Record<string, string | number> = {};
    if (periodCode) params.period_code = periodCode;
    if (waterwayCode) params.waterway_code = waterwayCode;
    return this.getV1(`athletes/${athleteId}/swimed_races`, params);
  }
  
  // Athlete Results/Histories
  static async getV1AthleteResults(
    athleteId: string, 
    waterwayCode: number | string, 
    styleCode: number | string, 
    distanceCode: number | string, 
    type: 'best' | 'graphs' | 'records' = 'best',
    params?: Record<string, string | number>
  ): Promise<any> {
    return this.getV1(
      `athletes/${athleteId}/results/waterways/${waterwayCode}/swimming_styles/${styleCode}/distances/${distanceCode}/${type}`, 
      params
    );
  }

  // 比較機能追加
  static async getV1AthleteHistoriesComparing(athleteId: string, waterway: string, style: string, distance: string, raceDivision: string, resultIds: string[], params?: Record<string, string | number | (string | number)[]>): Promise<any> {
    const p = params || {};
    return await this.getV1(
      `athletes/${athleteId}/histories/waterways/${waterway}/swimming_styles/${style}/distances/${distance}/race_divisions/${raceDivision}/comparing`, 
      { ...p, result_ids: resultIds }
    );
  }

  static async getV1AthleteHistories(athleteId: string, waterway: string, style: string, distance: string, raceDivision: string, params?: Record<string, string | number>): Promise<any> {
    return this.getV1(`athletes/${athleteId}/histories/waterways/${waterway}/swimming_styles/${style}/distances/${distance}/race_divisions/${raceDivision}`, params);
  }

  // Utilities
  static async getV1AnnouncementsLatest(): Promise<Announcement[]> { return this.getV1('announcements/latest'); }
  static async getV1RankingsUpdatedTime(): Promise<any> { return this.getV1('rankings/updated_time'); }
  static async getV1StandardRecordBreakersUpdatedTime(): Promise<any> { return this.getV1('standard_record_breakers/updated_time'); }

  // Masters (Static)
  static async getV1MastersDisplayYear(): Promise<any> { return this.getV1('masters/display_year'); }
  static async getV1MastersDistances(): Promise<any> { return this.getV1('masters/distances'); }
  static async getV1MastersGameStatuses(): Promise<any> { return this.getV1('masters/game_statuses'); }
  static async getV1MastersGenders(): Promise<any> { return this.getV1('masters/genders'); }
  static async getV1MastersMemberGroups(): Promise<any> { return this.getV1('masters/member_groups'); }
  static async getV1MastersNavigations(): Promise<any> { return this.getV1('masters/navigations'); }
  static async getV1MastersPeriods(): Promise<any> { return this.getV1('masters/periods'); }
  static async getV1MastersRaceDivisions(): Promise<any> { return this.getV1('masters/race_divisions'); }
  static async getV1MastersSchoolClasses(): Promise<any> { return this.getV1('masters/school_classes'); }
  static async getV1MastersSwimmingStyles(): Promise<any> { return this.getV1('masters/swimming_styles'); }
  static async getV1MastersWaterways(): Promise<any> { return this.getV1('masters/waterways'); }
  static async getV1MastersYears(): Promise<any> { return this.getV1('masters/years'); }

  // Search functionalities
  static async searchGames(params: SearchGameParams): Promise<GameListResponse> {
    const defaultParams = { year: 2026, game_status: 5, page: 1, sort_order: 'ascend', official_code: 1, ...params };
    return await this.getV1('games', defaultParams as Record<string, string | number>);
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

    const apiParams: Record<string, string | number> = {
      page: params.page || 1,
      official_code: 1,
      name: params.name || '',
      entry_group_name: params.entry_group_name || '',
      member_group_code: (memberGroup && memberGroup.code !== null) ? memberGroup.code : 99,
      school_class_code: (schoolClass && schoolClass.code !== null) ? schoolClass.code : 99,
      gender_code: (gender && gender.code !== null) ? gender.code : 99,
    };

    return await this.getV1('athletes', apiParams);
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
