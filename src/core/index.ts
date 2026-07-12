import fs from 'fs';
import { Parser } from 'json2csv';
import { fetchJson } from './scraper';
import { parseRaceResults, RaceResult } from './parser';
import { Game, Athlete, FinaPoint, GameListResponse } from './types';

export class SwimLiveScraper {
  // Helper for query params
  private static serializeParams(params: Record<string, string | number>): string {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  }

  // --- Core Methods ---
  static async getMemberGroupGames(groupCode: number | string): Promise<any> {
    const url = `https://live-results.swim.or.jp/api/games/member_group/${groupCode}`;
    return await fetchJson(url);
  }

  static async getGameDetails(gameCode: string): Promise<any> {
    const url = `https://live-results.swim.or.jp/api/games/${gameCode}`;
    return await fetchJson(url);
  }

  static async getRaceListByGameDate(gameCode: string, date: string): Promise<any> {
    const url = `https://live-results.swim.or.jp/api/race_heats/race_list/${gameCode}?game_date=${date}`;
    return await fetchJson(url);
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

  static async getGames(): Promise<any> {
    return await fetchJson('https://live-results.swim.or.jp/api/games/');
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
  private static async getV1(path: string, params?: Record<string, string | number>): Promise<any> {
    const queryString = params ? this.serializeParams(params) : '';
    const url = `https://result.swim.or.jp/api/v1/${path.startsWith('/') ? path.slice(1) : path}${queryString ? '?' + queryString : ''}`;
    return await fetchJson(url);
  }

  // Games
  static async getV1Games(params: Record<string, string | number>): Promise<GameListResponse> { return this.getV1('games', params); }
  static async getV1Game(gameId: string): Promise<Game> { return this.getV1(`games/${gameId}`); }
  static async getV1GameClasses(gameId: string): Promise<any> { return this.getV1(`games/${gameId}/classes`); }
  static async getV1GameRaces(gameId: string): Promise<any> { return this.getV1(`games/${gameId}/races`); }

  // Athlete Results/Histories
  static async getV1AthleteResults(athleteId: string, waterway: string, style: string, distance: string, type: 'best' | 'graphs' | 'records', params?: Record<string, string | number>): Promise<any> {
    return this.getV1(`athletes/${athleteId}/results/waterways/${waterway}/swimming_styles/${style}/distances/${distance}/${type}`, params);
  }

  static async getV1AthleteHistories(athleteId: string, waterway: string, style: string, distance: string, raceDivision: string, params?: Record<string, string | number>): Promise<any> {
    return this.getV1(`athletes/${athleteId}/histories/waterways/${waterway}/swimming_styles/${style}/distances/${distance}/race_divisions/${raceDivision}`, params);
  }

  static async getV1AthleteCompare(athleteId: string, waterway: string, style: string, distance: string, raceDivision: string, type: 'histories' | 'results', params: Record<string, string | number>): Promise<any> {
    const path = type === 'histories'
      ? `athletes/${athleteId}/histories/waterways/${waterway}/swimming_styles/${style}/distances/${distance}/race_divisions/${raceDivision}/comparing`
      : `athletes/${athleteId}/results/genders/${waterway}/swimming_styles/${style}/distances/${distance}/classes/${raceDivision}/race_divisions/${distance}/heats/1/comparing`; // Note: This structure seems complex based on HAR, need verification
    return this.getV1(path, params);
  }

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
  static async searchGames(name: string, year: number = 2026): Promise<Game[]> {
    const params: Record<string, string | number> = { year, name, game_status: 5, page: 1, sort_order: 'ascend', official_code: 1 };
    return await this.getV1('games', params);
  }

  // NOTE: HARには athletes/ 検索エンドポイントは直接ないため、ゲーム検索から辿る必要がある
  // ここでは要望に応じ、ゲーム検索機能を拡張

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
