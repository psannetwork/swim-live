import { fetchJson } from '../scrapers/scraper';
import { normalizeRaceList, normalizeGameDetail, normalizeLiveGame, createMasterMap, parseRaceResults } from '../parsers/parser';
import { NormalizedRace, GameDetail, NormalizedGame, RaceResult, RaceStatus } from '../types/types';

const BASE_URL = 'https://live-results.swim.or.jp/api';

export const LiveApi = {
    getGames: async (): Promise<any[]> => await fetchJson<any[]>(`${BASE_URL}/games/`),
    getGameDetails: async (gameCode: string): Promise<any> => await fetchJson<any>(`${BASE_URL}/games/${gameCode}`),
    
    getRaceListByGameDate: async (gameCode: string, date: string): Promise<any[]> => 
        await fetchJson<any[]>(`${BASE_URL}/race_heats/race_list/${gameCode}?game_date=${date}`),
    
    getRaceStatus: async (gameCode: string, programId: string, heat: string): Promise<any> => 
        await fetchJson(`${BASE_URL}/race_heats/race?game_code=${gameCode}&program_id=${programId}&heat=${heat}`),
        
    getRaceResults: async (gameCode: string, programId: string, heat: string, raceStatus: RaceStatus = RaceStatus.RESULT): Promise<any> => 
        await fetchJson(`${BASE_URL}/result/race?game_code=${gameCode}&program_id=${programId}&heat=${heat}&raceStatus=${raceStatus}`),
        
    getSearchedRaces: async (gameCode: string, params: Record<string, string>): Promise<any> => {
        const query = new URLSearchParams(params).toString();
        return await fetchJson(`${BASE_URL}/race_heats/searchedRaceHeats/${gameCode}?${query}`);
    },

    getInProgressCount: async () => await fetchJson(`${BASE_URL}/games/in_progress_count`),
    getMemberGroupGames: async (groupCode: number | string) => await fetchJson<any[]>(`${BASE_URL}/games/member_group/${groupCode}`),
    getMastersMemberGroups: async () => await fetchJson(`${BASE_URL}/masters/member_groups`),
    getMastersEvents: async () => await fetchJson(`${BASE_URL}/masters/events`),
    getRaceMessages: async (gameCode: string) => await fetchJson(`${BASE_URL}/race_heats/messages/${gameCode}`),
    getNextRace: async (gameCode: string, programId: string, heat: string, raceDate: string) => 
        await fetchJson(`${BASE_URL}/race_heats/next?game_code=${gameCode}&program_id=${programId}&heat=${heat}&race_date=${raceDate}`),
    getSelectDateList: async (gameCode: string) => await fetchJson(`${BASE_URL}/race_heats/select_date/${gameCode}`)
};