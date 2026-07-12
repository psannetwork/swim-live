import fs from 'fs';
import { Parser } from 'json2csv';
import { fetchJson } from './scraper';
import { parseRaceResults, RaceResult } from './parser';

export class SwimLiveScraper {
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

  // Existing methods...
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

  // New API Wrappers (v1)
  static async getV1Games(params: string = ''): Promise<any> {
    return await fetchJson(`https://result.swim.or.jp/api/v1/games${params ? '?' + params : ''}`);
  }

  static async getV1GameDetails(gameId: string): Promise<any> {
    return await fetchJson(`https://result.swim.or.jp/api/v1/games/${gameId}`);
  }

  static async getV1GameClasses(gameId: string): Promise<any> {
    return await fetchJson(`https://result.swim.or.jp/api/v1/games/${gameId}/classes`);
  }

  static async getV1Athlete(athleteId: string): Promise<any> {
    return await fetchJson(`https://result.swim.or.jp/api/v1/athletes/${athleteId}`);
  }

  static async getV1MastersMasters(): Promise<any> {
    return await fetchJson('https://result.swim.or.jp/api/v1/masters/member_groups');
  }

  static async getV1RankingsUpdatedTime(): Promise<any> {
    return await fetchJson('https://result.swim.or.jp/api/v1/rankings/updated_time');
  }

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
