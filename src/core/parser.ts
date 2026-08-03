import { NormalizedRace, GameDetail, NormalizedGame, Master, RawGame, LiveGame, RaceResult } from './types';

export function parseRaceResults(data: any[]): RaceResult[] {
  const parseBool = (val: any) => val === 'true' || val === true;

  return data.map((entry: any) => ({
    rank: entry.rank ? Number(entry.rank) : null,
    lane: entry.lane ?? null,
    lane_adjusted: entry.lane_adjusted ?? null,
    result_time: entry.result_time ?? null,
    reaction_time: entry.reaction_time ?? null,
    swimmer_name: entry.swimmer_name ?? null,
    swimmer_code: entry.swimmer_code ?? null,
    entry_group_name1: entry.entry_group_name1 ?? null,
    entry_group_name2: entry.entry_group_name2 ?? null,
    entry_group_name3: entry.entry_group_name3 ?? null,
    school_name: entry.school_name ?? null,
    school_class: entry.school_class ? Number(entry.school_class) : null,
    school_class_code: entry.school_class_code ? Number(entry.school_class_code) : null,
    career_best_time: entry.career_best_time ?? null,
    qualifying_time: entry.qualifying_time ?? null,
    qualification_level: entry.qualification_level ?? null,
    lap50: entry.lap50 ?? null,
    lap100: entry.lap100 ?? null,
    lap150: entry.lap150 ?? null,
    lap200: entry.lap200 ?? null,
    lap250: entry.lap250 ?? null,
    lap300: entry.lap300 ?? null,
    lap400: entry.lap400 ?? null,
    has_reaction_time: parseBool(entry.has_reaction_time),
    has_lap_time: parseBool(entry.has_lap_time),
    status_text: entry.status_text ?? null,
    status_name: entry.status_name ?? null,
  }));
}

// --- マッピング定義 ---
export const WATERWAY_MAP: Record<number, string> = { 1: '長水路', 2: '短水路', 3: '室内短水路' };
export const STYLE_MAP: Record<number, string> = { 1: '自由形', 2: '背泳ぎ', 3: '平泳ぎ', 4: 'バタフライ', 5: '個人メドレー', 6: 'フリーリレー', 7: 'メドレーリレー' };
export const DISTANCE_MAP: Record<number, string> = { 1: '25m', 2: '50m', 3: '100m', 4: '200m', 5: '400m', 6: '800m', 7: '1500m' };
export const GENDER_MAP: Record<number, string> = { 1: '男子', 2: '女子', 3: '混合' };
export const DIVISION_MAP: Record<number, string> = { 1: '予選', 2: '準決勝', 3: 'タイム決勝', 4: '決勝', 5: 'B決勝' };
export const PUB_SETTING_MAP: Record<number, string> = { 1: '登録後即時公開', 2: '承認後公開', 3: '非公開' };
export const PUB_STATUS_MAP: Record<number, string> = { 0: '未公開', 1: '公開中', 9: '公開完了' };

// ステータス表示マッピング
export const PROGRAM_STATUS_MAP: Record<number, string> = {
  0: '開始前',
  1: '準備中', // スタートリスト公開中
  9: '終了',
  '-1': '未実施',
};

export const RACE_STATUS_MAP: Record<number, string> = {
  0: '開始前',
  1: 'スタートリスト', // レース未開始
  9: 'レース終了',
};

// --- 変換ヘルパー ---
export const getDynamicName = (code: number, masterMap: Record<number, string>, fallback: string = '不明'): string => {
  return masterMap[code] ?? fallback;
};

export const getWaterwayNameLive = (code: number): string => {
  if (code === 3) return '室内短水路'; 
  return WATERWAY_MAP[code] || `不明(${code})`;
};

export const getRaceStatusDisplay = (entry: any): string => {
  if (entry.status_text) return entry.status_text;
  
  const programStatus = Number(entry.program_status);
  const raceStatus = Number(entry.race_status);

  // 詳細ロジック（プログラム状態優先）
  if (programStatus === -1) return PROGRAM_STATUS_MAP[-1] || '未実施';
  if (programStatus === 0) return PROGRAM_STATUS_MAP[0] || '開始前';
  if (programStatus === 1) {
    return entry.has_started === 'true' || entry.has_started === true 
      ? 'レース中' 
      : (RACE_STATUS_MAP[raceStatus] || 'スタートリスト');
  }
  if (programStatus === 9) return PROGRAM_STATUS_MAP[9] || '終了';
  
  return 'ステータス不明';
};

export function createMasterMap(data: Master[]): Record<number, string> {
  return data.reduce((acc, curr) => {
    if (curr.code !== null) acc[curr.code] = curr.name;
    return acc;
  }, {} as Record<number, string>);
}

export function normalizeRaceList(data: any[]): NormalizedRace[] {
  const parseBool = (val: any) => val === 'true' || val === true;

  return data.map((entry: any) => {
    const style = entry.swimming_style_name || STYLE_MAP[Number(entry.swimming_style_code)] || '不明';
    const gender = entry.gender_name || GENDER_MAP[Number(entry.gender_code)] || '不明';
    const distance = entry.distance_name || DISTANCE_MAP[Number(entry.distance_code)] || '不明';

    return {
      program_id: entry.program_id,
      display_program_id: entry.display_program_id,
      heat: entry.heat,
      race_name: `${style} ${gender} ${distance}`.trim(),
      class_name: entry.class_name || '不明',
      division_name: entry.race_division_name || DIVISION_MAP[Number(entry.race_division_code)] || '不明',
      status: getRaceStatusDisplay(entry),
      start_time: entry.game_time,
      start_list_num: Number(entry.startlist_num) || 0,
      
      is_finished: parseBool(entry.is_finished),
      has_started: parseBool(entry.has_started),
      is_relay: parseBool(entry.is_relay),
      has_relay_members: parseBool(entry.has_relay_members),
      has_reaction_time: parseBool(entry.has_reaction_time),
      has_lap_time: parseBool(entry.has_lap_time),
      
      startlist_pub_setting: PUB_SETTING_MAP[Number(entry.startlist_publishing_setting)] || '不明',
      relay_pub_setting: PUB_SETTING_MAP[Number(entry.relay_publishing_setting)] || '不明',
      race_pub_setting: PUB_SETTING_MAP[Number(entry.race_publishing_setting)] || '不明',

      startlist_pub_status: PUB_STATUS_MAP[Number(entry.startlist_pub_status)] || '不明',
      relay_order_pub_status: PUB_STATUS_MAP[Number(entry.relay_order_pub_status)] || '不明',
      race_pub_status: PUB_STATUS_MAP[Number(entry.race_pub_status)] || '不明',
      
      heats_count_per_taikai: Number(entry.heats_count_per_taikai) || 0,
      startlist_count_per_taikai: Number(entry.startlist_count_per_taikai) || 0,
      program_race_num: Number(entry.program_race_num) || 0,
      program_race_finished_num: Number(entry.program_race_finished_num) || 0,
      program_empty_race_num: Number(entry.program_empty_race_num) || 0,
      incomplete_race_num: Number(entry.incomplete_race_num) || 0,

      has_reaction_time_check_err: parseBool(entry.has_reaction_time_check_err),
      has_lap_time_check_err: parseBool(entry.has_lap_time_check_err),
      has_multi_incomplete_race_err: parseBool(entry.has_multi_incomplete_race_err),
      has_incomplete_race_num: parseBool(entry.has_incomplete_race_num),

      program_status: Number(entry.program_status),
      race_status: Number(entry.race_status),
      alarm_status: Number(entry.alarm_status),

      stg_has_reaction_times: parseBool(entry.stg_has_reaction_times),
      stg_has_lap_times: parseBool(entry.stg_has_lap_times),
      stg_max_unfinished_race_to_err: Number(entry.stg_max_unfinished_race_to_err) || 0,
      incomplete_order: Number(entry.incomplete_order) || 0,
      lag_race_order: Number(entry.lag_race_order) || 0,

      updated_at: entry.updated_at,
      game_date: entry.game_date
    };
  });
}

// レースヒートリストの正規化関数
export function normalizeRaceHeatsList(data: any[]): NormalizedRace[] {
  const parseBool = (val: any) => val === 'true' || val === true;

  return data.map((entry: any) => {
    const style = entry.swimming_style_name || STYLE_MAP[Number(entry.swimming_style_code)] || '不明';
    const gender = entry.gender_name || GENDER_MAP[Number(entry.gender_code)] || '不明';
    const distance = entry.distance_name || DISTANCE_MAP[Number(entry.distance_code)] || '不明';

    return {
      program_id: entry.program_id,
      display_program_id: entry.display_program_id,
      heat: entry.heat,
      race_name: `${style} ${gender} ${distance}`.trim(),
      class_name: entry.class_name || '不明',
      division_name: entry.race_division_name || DIVISION_MAP[Number(entry.race_division_code)] || '不明',
      status: getRaceStatusDisplay(entry),
      start_time: entry.game_time,
      start_list_num: Number(entry.startlist_num) || 0,
      
      is_finished: parseBool(entry.is_finished),
      has_started: parseBool(entry.has_started),
      is_relay: parseBool(entry.is_relay),
      has_relay_members: parseBool(entry.has_relay_members),
      has_reaction_time: parseBool(entry.has_reaction_time),
      has_lap_time: parseBool(entry.has_lap_time),
      
      startlist_pub_setting: PUB_SETTING_MAP[Number(entry.startlist_publishing_setting)] || '不明',
      relay_pub_setting: PUB_SETTING_MAP[Number(entry.relay_publishing_setting)] || '不明',
      race_pub_setting: PUB_SETTING_MAP[Number(entry.race_publishing_setting)] || '不明',

      startlist_pub_status: PUB_STATUS_MAP[Number(entry.startlist_pub_status)] || '不明',
      relay_order_pub_status: PUB_STATUS_MAP[Number(entry.relay_order_pub_status)] || '不明',
      race_pub_status: PUB_STATUS_MAP[Number(entry.race_pub_status)] || '不明',
      
      heats_count_per_taikai: Number(entry.heats_count_per_taikai) || 0,
      startlist_count_per_taikai: Number(entry.startlist_count_per_taikai) || 0,
      program_race_num: Number(entry.program_race_num) || 0,
      program_race_finished_num: Number(entry.program_race_finished_num) || 0,
      program_empty_race_num: Number(entry.program_empty_race_num) || 0,
      incomplete_race_num: Number(entry.incomplete_race_num) || 0,

      has_reaction_time_check_err: parseBool(entry.has_reaction_time_check_err),
      has_lap_time_check_err: parseBool(entry.has_lap_time_check_err),
      has_multi_incomplete_race_err: parseBool(entry.has_multi_incomplete_race_err),
      has_incomplete_race_num: parseBool(entry.has_incomplete_race_num),

      program_status: Number(entry.program_status),
      race_status: Number(entry.race_status),
      alarm_status: Number(entry.alarm_status),

      stg_has_reaction_times: parseBool(entry.stg_has_reaction_times),
      stg_has_lap_times: parseBool(entry.stg_has_lap_times),
      stg_max_unfinished_race_to_err: Number(entry.stg_max_unfinished_race_to_err) || 0,
      incomplete_order: Number(entry.incomplete_order) || 0,
      lag_race_order: Number(entry.lag_race_order) || 0,

      updated_at: entry.updated_at,
      game_date: entry.game_date
    };
  });
}

export function normalizeGameDetail(data: any): GameDetail {
  const detail = Array.isArray(data) ? data[0] : data;
  return {
    game_code: detail.game_code,
    game_name: detail.game_name,
    start_date: detail.date_start,
    end_date: detail.date_end,
    pool: detail.pool,
    waterway_code: detail.waterway_code,
    waterway_name: WATERWAY_MAP[detail.waterway_code] || '不明'
  };
}

export const getDeliveryStatusLabel = (deliveryStatusCode: number): string => {
  switch (deliveryStatusCode) {
    case 2: return '配信中';
    case -1: return '未配信';
    case 3: return '配信完了';
    default: return `不明(${deliveryStatusCode})`;
  }
};

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
    waterway_code: data.waterway.code ?? 0,
    waterway_name: data.waterway.name,
    status_label: new Date(data.end_date) < now ? '大会終了' : '開催中',
    group_name: groupMap[data.group.code ?? 0] || '不明',
    pool_name: data.pool,
    delivery_status_code: data.delivery_status_code,
    is_delivery_active: data.delivery_status_code === 2,
    delivery_status_label: getDeliveryStatusLabel(data.delivery_status_code)
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
    waterway_code: data.waterway_code,
    waterway_name: waterwayMap[data.waterway_code] || '不明',
    status_label: new Date(data.date_end) < now ? '大会終了' : '開催中',
    group_name: groupMap[Number(data.member_group_code) ?? 0] || '不明',
    pool_name: data.pool,
    // LiveGameにはdelivery_status_codeが含まれていないため、デフォルト値を使用
    delivery_status_code: 0,
    is_delivery_active: false,
    delivery_status_label: '不明'
  };
}
