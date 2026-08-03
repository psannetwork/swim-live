import { fetchJson } from '../scrapers/scraper';
import { Game, Athlete, FinaPoint, GameListResponse, Announcement, AthleteListResponse, SearchGameParams, MasterData, AthleteSwimedRace, AthleteEntry, AthleteRecordsResponse, AthleteBestRecord, AthleteGraphData, GameClassApiResponse, AthleteHistoryResponse, ComparisonResponse } from '../types/types';

const BASE_URL = 'https://result.swim.or.jp/api/v1';

// Helper for query params
const serializeParams = (params: Record<string, string | number | (string | number)[]>): string => {
    return Object.entries(params)
        .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map(v => `${key}[]=${encodeURIComponent(String(v))}`);
            }
            return `${key}=${encodeURIComponent(String(value))}`;
        })
        .join('&');
};

const buildUrl = (path: string, params?: Record<string, string | number | (string | number)[]>): string => {
    const queryString = params ? serializeParams(params) : '';
    const separator = path.includes('?') ? '&' : '?';
    return `${BASE_URL}/${path.startsWith('/') ? path.slice(1) : path}${queryString ? separator + queryString : ''}`;
};

export const V1Api = {
    get: async (path: string, params?: Record<string, string | number | (string | number)[]>): Promise<any> => {
        return await fetchJson(buildUrl(path, params));
    },

    // Masters
    getMastersSchoolClasses: () => fetchJson<MasterData[]>(buildUrl('masters/school_classes')),
    getMastersMemberGroups: () => fetchJson<MasterData[]>(buildUrl('masters/member_groups')),
    getMastersGenders: () => fetchJson<MasterData[]>(buildUrl('masters/genders')),
    getMastersRaceDivisions: () => fetchJson<MasterData[]>(buildUrl('masters/race_divisions')),

    // Games
    getGames: (params: Record<string, string | number>) => fetchJson<GameListResponse>(buildUrl('games', params)),
    
    // Game Class Info
    getGameClassInfo: (gameCode: string) => fetchJson<GameClassApiResponse>(buildUrl(`games/${gameCode}/classes`)),

    // Athletes
    getAthlete: (athleteId: string) => fetchJson<Athlete>(buildUrl(`athletes/${athleteId}`)),
    
    // Athlete History
    getAthleteHistory: (athleteId: string, waterwayCode: number, styleCode: number, distanceCode: number, divisionCode: number, params?: { period_code?: number; game_category_codes?: number[]; page?: number; per_page?: number }) => {
        const queryParams: Record<string, any> = {};
        if (params?.period_code !== undefined) queryParams.period_code = params.period_code;
        if (params?.game_category_codes !== undefined) queryParams.game_category_codes = params.game_category_codes;
        if (params?.page !== undefined) queryParams.page = params.page;
        if (params?.per_page !== undefined) queryParams.per_page = params.per_page;
        
        return fetchJson<AthleteHistoryResponse>(
            buildUrl(`athletes/${athleteId}/histories/waterways/${waterwayCode}/swimming_styles/${styleCode}/distances/${distanceCode}/race_divisions/${divisionCode}`, queryParams)
        );
    },

    // Athlete Comparison
    getAthleteComparison: (athleteId: string, waterwayCode: number, styleCode: number, distanceCode: number, divisionCode: number, resultIds: number[]) => {
        const queryParams: Record<string, any> = {};
        queryParams.result_ids = resultIds;
        return fetchJson<ComparisonResponse>(
            buildUrl(`athletes/${athleteId}/histories/waterways/${waterwayCode}/swimming_styles/${styleCode}/distances/${distanceCode}/race_divisions/${divisionCode}/comparing`, queryParams)
        );
    },

    // Athlete Data APIs
    getAthleteBestFinaPoints: (athleteId: string, year?: number, waterwayCode?: number) => {
        const params: Record<string, number> = {};
        if (year !== undefined) params.year = year;
        if (waterwayCode !== undefined) params.waterway_code = waterwayCode;
        return fetchJson<FinaPoint[]>(buildUrl(`athletes/${athleteId}/best_fina_points`, params));
    },
    
    getAthleteSwimedRaces: (athleteId: string, periodCode?: number, waterwayCode?: number) => {
        const params: Record<string, number> = {};
        if (periodCode !== undefined) params.period_code = periodCode;
        if (waterwayCode !== undefined) params.waterway_code = waterwayCode;
        return fetchJson<AthleteSwimedRace[]>(buildUrl(`athletes/${athleteId}/swimed_races`, params));
    },
    
    getAthleteEntries: (athleteId: string) => {
        return fetchJson<AthleteEntry[]>(buildUrl(`athletes/${athleteId}/entries`));
    },
    
    getAthleteRecords: (athleteId: string, waterwayCode: number, styleCode: number, distanceCode: number, periodCode?: number) => {
        const params: Record<string, number> = {};
        if (periodCode !== undefined) params.period_code = periodCode;
        return fetchJson<AthleteRecordsResponse>(
            buildUrl(`athletes/${athleteId}/results/waterways/${waterwayCode}/swimming_styles/${styleCode}/distances/${distanceCode}/records`, params)
        );
    },
    
    getAthleteBestRecord: (athleteId: string, waterwayCode: number, styleCode: number, distanceCode: number) => {
        return fetchJson<AthleteBestRecord>(
            buildUrl(`athletes/${athleteId}/results/waterways/${waterwayCode}/swimming_styles/${styleCode}/distances/${distanceCode}/best`)
        );
    },
    
    getAthleteGraphs: (athleteId: string, waterwayCode: number, styleCode: number, distanceCode: number) => {
        return fetchJson<AthleteGraphData>(
            buildUrl(`athletes/${athleteId}/results/waterways/${waterwayCode}/swimming_styles/${styleCode}/distances/${distanceCode}/graphs`)
        );
    },

    // Search
    searchGames: (params: SearchGameParams) => {
        const defaultParams = { year: 2026, game_status: 5, page: 1, sort_order: 'ascend', official_code: 1, ...params };
        return fetchJson<GameListResponse>(buildUrl('games', defaultParams as Record<string, string | number>));
    },
    
    searchAthletes: (params: Record<string, any>, memberGroupCode: number, schoolClassCode: number, genderCode: number) => {
        const apiParams: Record<string, string | number> = {
            page: params.page || 1,
            official_code: 1,
            name: params.name || '',
            entry_group_name: params.entry_group_name || '',
            member_group_code: memberGroupCode,
            school_class_code: schoolClassCode,
            gender_code: genderCode,
        };
        return fetchJson<AthleteListResponse>(buildUrl('athletes', apiParams));
    }
};