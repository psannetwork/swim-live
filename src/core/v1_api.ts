import { fetchJson } from './scraper';
import { Game, Athlete, FinaPoint, GameListResponse, Announcement, AthleteListResponse, SearchGameParams, MasterData } from './types';

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

    // Games
    getGames: (params: Record<string, string | number>) => fetchJson<GameListResponse>(buildUrl('games', params)),
    
    // Athletes
    getAthlete: (athleteId: string) => fetchJson<Athlete>(buildUrl(`athletes/${athleteId}`)),
    
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
