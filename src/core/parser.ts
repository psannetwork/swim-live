export interface RaceResult {
  rank: string | null;
  swimmer_name: string | null;
  school_name: string | null;
  entry_group_name1: string | null;
  entry_group_name2: string | null;
  entry_group_name3: string | null;
  result_time: string | null;
  reaction_time: string | null;
  lap25: string | null;
  lap50: string | null;
  lap75: string | null;
  lap100: string | null;
  lap125: string | null;
  lap150: string | null;
  lap175: string | null;
  lap200: string | null;
  heat: string | null;
  game_code: string | null;
  program_id: string | null;
  display_program_id: string | null;
  swimming_style_code: string | null;
  swimming_style_name: string | null;
  distance: string | null;
  distance_name: string | null;
  race_division_name: string | null;
  gender_code: string | null;
  gender_name: string | null;
  class_name: string | null;
  game_date: string | null;
  race_status: string | null;
  is_finished: boolean | null;
  has_reaction_time: boolean | null;
  has_lap_time: boolean | null;
}

export function parseRaceResults(data: any[]): RaceResult[] {
  return data.map((entry: any) => ({
    rank: entry.rank ?? null,
    swimmer_name: entry.swimmer_name ?? null,
    school_name: entry.school_name ?? null,
    entry_group_name1: entry.entry_group_name1 ?? null,
    entry_group_name2: entry.entry_group_name2 ?? null,
    entry_group_name3: entry.entry_group_name3 ?? null,
    result_time: entry.result_time ?? null,
    reaction_time: entry.reaction_time ?? null,
    lap25: entry.lap25 ?? null,
    lap50: entry.lap50 ?? null,
    lap75: entry.lap75 ?? null,
    lap100: entry.lap100 ?? null,
    lap125: entry.lap125 ?? null,
    lap150: entry.lap150 ?? null,
    lap175: entry.lap175 ?? null,
    lap200: entry.lap200 ?? null,
    heat: entry.heat ?? null,
    game_code: entry.game_code ?? null,
    program_id: entry.program_id ?? null,
    display_program_id: entry.display_program_id ?? null,
    swimming_style_code: entry.swimming_style_code ?? null,
    swimming_style_name: entry.swimming_style_name ?? null,
    distance: entry.distance ?? null,
    distance_name: entry.distance_name ?? null,
    race_division_name: entry.race_division_name ?? null,
    gender_code: entry.gender_code ?? null,
    gender_name: entry.gender_name ?? null,
    class_name: entry.class_name ?? null,
    game_date: entry.race_date ?? null,
    race_status: entry.race_status ?? null,
    is_finished: entry.is_finished ?? null,
    has_reaction_time: entry.has_reaction_time ?? null,
    has_lap_time: entry.has_lap_time ?? null
  }));
}

import { NormalizedRace, GameDetail, NormalizedGame, Master, RawGame, LiveGame } from './types';

export function createMasterMap(data: Master[]): Record<number, string> {
  return data.reduce((acc, curr) => {
    if (curr.code !== null) acc[curr.code] = curr.name;
    return acc;
  }, {} as Record<number, string>);
}

export function normalizeRaceList(data: any[]): NormalizedRace[] {
// ... existing implementation ...
  return data.map((entry: any) => ({
    program_id: entry.program_id,
    race_name: `${entry.swimming_style_name} ${entry.gender_name} ${entry.distance_name}`,
    class_name: entry.class_name,
    division_name: entry.race_division_name,
    start_time: entry.game_time,
    status: entry.status_text,
    is_finished: entry.is_finished === 'true' || entry.is_finished === true
  }));
}

export function normalizeGameDetail(data: any): GameDetail {
  const detail = Array.isArray(data) ? data[0] : data;
  return {
    game_code: detail.game_code,
    game_name: detail.game_name,
    start_date: detail.date_start,
    end_date: detail.date_end,
    pool: detail.pool,
    waterway_code: detail.waterway_code
  };
}

export function normalizeGame(data: RawGame, groupMap: Record<number, string>): NormalizedGame {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  const now = new Date();

  // 期間フォーマット: MM.DD(曜日)
  const format = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}(${['日','月','火','水','木','金','土'][d.getDay()]})`;

  return {
    game_code: data.game_code,
    game_name: data.game_name,
    period: `${format(start)}${data.start_date !== data.end_date ? ` ～ ${format(end)}` : ''}`,
    waterway_name: data.waterway.name,
    status_label: end < now ? '大会終了' : '開催中',
    group_name: groupMap[data.group.code ?? 0] || '不明',
    pool_name: data.pool
  };
}

export function normalizeLiveGame(data: LiveGame, groupMap: Record<number, string>): NormalizedGame {
  const start = new Date(data.date_start);
  const end = new Date(data.date_end);
  const now = new Date();

  // 期間フォーマット: MM.DD(曜日)
  const format = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}(${['日','月','火','水','木','金','土'][d.getDay()]})`;

  const waterwayMap: Record<number, string> = { 1: '室内長水路', 2: '室外長水路', 3: '室内短水路' };

  return {
    game_code: data.game_code,
    game_name: data.game_name,
    period: `${format(start)}${data.date_start !== data.date_end ? ` ～ ${format(end)}` : ''}`,
    waterway_name: waterwayMap[data.waterway_code] || '不明',
    status_label: end < now ? '大会終了' : '開催中',
    group_name: groupMap[Number(data.member_group_code) ?? 0] || '不明',
    pool_name: data.pool
  };
}
