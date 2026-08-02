export interface Game {
  game_code: string;
  start_date: string;
  end_date: string;
  group: { code: number; name: string };
  waterway: { code: number; name: string };
  game_name: string;
  pool: string;
  contestants: number;
  game_status: { code: number; name: string };
  is_official_games: boolean;
  delivery_status_code: number;
}

export interface Master {
  code: number | null;
  name: string;
}

export interface RawGame {
  game_code: string;
  start_date: string;
  end_date: string;
  group: Master;
  waterway: Master;
  game_name: string;
  pool: string;
  contestants: number;
  game_status: Master;
  is_official_games: boolean;
  delivery_status_code: number;
}

export interface LiveGame {
  game_code: string;
  member_group_code: string;
  game_name: string;
  date_start: string;
  date_end: string;
  waterway_code: number;
  pool: string | null;
  status: string | null;
}

export interface NormalizedGame {
  game_code: string;
  game_name: string;
  period: string; // 期間 (例: "08.02(日)")
  waterway_name: string; // 変換済み水路種別
  status_label: '開催中' | '大会終了'; // 判定済みステータス
  group_name: string; // 変換済み地域名
  pool_name: string | null; // プール名
}

export interface MetaData {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface GameListResponse {
  data: Game[];
  links: Links;
  meta: MetaData;
}

export interface Athlete {
  swimmer_name: string;
  swimmer_code: string;
  entry_group: {
    code: string;
    name: string;
    short_name: string;
    member_group: { code: number; name: string };
  };
  school_class: {
    code: number;
    name: string;
    school_grades: string[];
  };
  gender: { code: number; name: string };
  swimmer_name_roman: string;
  member_group: { code: number; name: string };
  birthday: string;
  age: number;
  entry_groups: {
    code: string;
    name: string;
    short_name: string;
    member_group: { code: number; name: string };
  }[];
  updated_at: string;
}

export interface AthleteListResponse {
  data: Athlete[];
  links: Links;
  meta: MetaData;
}

export interface FinaPoint {
  distance: { code: number; name: string; name_for_relay: string | null };
  swimming_style: { code: number; name: string };
  fina_point: number;
  percentage: number;
  result_time: string;
  result_date: string;
  game_name: string;
  game_short_name: string;
  game_code: string;
  class_code: number;
  race_division_code: number;
  heat: number;
  heat_distance_code: number;
  heat_swimming_style_code: number;
  heat_gender_code: number;
  ranking: number;
  race_count: number;
}

export interface AthleteCareer {
  year: number;
  game_name: string;
  game_code: string;
  game_short_name: string;
  start_date: string;
  end_date: string;
  waterway_code: number;
}

export interface Announcement {
  title: string;
  content: string;
  updated_at: string;
}

export interface MasterData {
  code: number;
  name: string;
}

export interface SearchGameParams {
  name?: string;
  year?: number;
  game_status?: number;
  page?: number;
  sort_order?: 'ascend' | 'descend';
  official_code?: number;
}

export interface GameDetail {
  game_code: string;
  game_name: string;
  start_date: string;
  end_date: string;
  pool: string | null;
  waterway_code: number;
}

export interface NormalizedRace {
  program_id: string;
  race_name: string;
  class_name: string;
  division_name: string;
  start_time: string | null;
  status: string;
  is_finished: boolean;
}
