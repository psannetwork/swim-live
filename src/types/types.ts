export interface RaceResult {
  rank: number | null;
  lane: string | null;
  lane_adjusted: string | null;
  result_time: string | null;
  reaction_time: string | null;
  swimmer_name: string | null;
  swimmer_code: string | null;
  entry_group_name1: string | null;
  entry_group_name2: string | null;
  entry_group_name3: string | null;
  school_name: string | null;
  school_class: number | null;
  school_class_code: number | null;
  career_best_time: string | null;
  qualifying_time: string | null;
  qualification_level: string | null;
  lap50: string | null;
  lap100: string | null;
  lap150: string | null;
  lap200: string | null;
  lap250: string | null;
  lap300: string | null;
  lap400: string | null;
  has_reaction_time: boolean;
  has_lap_time: boolean;
  status_text: string | null;
  status_name: string | null;
}

export interface Game {
  game_code: string;
  start_date: string;
  end_date: string;
  group: { code: number; name: string };
  waterway: { code: number; name: string };
  game_name: string;
  pool: string | null;
  contestants: number;
  game_status: { code: number; name: string };
  is_official_games: boolean;
  delivery_status: number;
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
  pool: string | null;
  contestants: number;
  game_status: Master;
  is_official_games: boolean;
  delivery_status: number;
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
  waterway_code: number; // 数値コードを追加
  waterway_name: string; // 変換済み水路種別
  status_label: '開催中' | '大会終了'; // 判定済みステータス
  group_name: string; // 変換済み地域名
  pool_name: string | null; // プール名
  delivery_status_code: number;
  is_delivery_active: boolean;
  delivery_status_label: string;
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
  waterways: Master[];
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
  waterway_name: string;
}

export interface NormalizedRace {
  program_id: string;
  display_program_id: string;
  heat: string;
  race_name: string;
  class_name: string;
  division_name: string;
  status: string;
  start_time: string | null;
  start_list_num: number;

  // 進行状態
  is_finished: boolean;
  has_started: boolean;
  is_relay: boolean;
  has_relay_members: boolean;
  has_reaction_time: boolean;
  has_lap_time: boolean;

  // 公開設定・状態
  startlist_pub_setting: string;
  relay_pub_setting: string;
  race_pub_setting: string;
  startlist_pub_status: string;
  relay_order_pub_status: string;
  race_pub_status: string;

  // 統計・集計カウント
  heats_count_per_taikai: number;
  startlist_count_per_taikai: number;
  program_race_num: number;
  program_race_finished_num: number;
  program_empty_race_num: number;
  incomplete_race_num: number;

  // エラー/内部監視
  has_reaction_time_check_err: boolean;
  has_lap_time_check_err: boolean;
  has_multi_incomplete_race_err: boolean;
  has_incomplete_race_num: boolean;

  // 内部判定用
  program_status: number;
  race_status: number;
  alarm_status: number;

  // ステージング/内部順序
  stg_has_reaction_times: boolean;
  stg_has_lap_times: boolean;
  stg_max_unfinished_race_to_err: number;
  incomplete_order: number;
  lag_race_order: number;

  // その他
  updated_at: string;
  game_date: string;
}

// 追加分
export interface Period extends MasterData {}
export interface Waterway extends MasterData {}
export interface RaceDivision extends MasterData {}

export interface AthleteSwimedRace {
  swimming_style: MasterData;
  distances: {
    distance: MasterData;
    fina_point: number;
    appearances: number;
    percentage: number;
  }[];
}

export interface AthleteEntry {
  distance: { code: number; name: string; name_for_relay: string | null };
  swimming_style: MasterData;
  waterways: Waterway[];
  divisions: {
    division: RaceDivision;
    waterways: Waterway[];
  }[];
}

export interface RaceRecordData {
  result_id: number;
  result_time: string;
  game_name: string;
  division: RaceDivision;
  result_date: string;
  is_best_record: boolean;
}

export interface AthleteRecordsResponse {
  upperLimit: string;
  lowerLimit: string;
  result: {
    year: number;
    data: RaceRecordData[];
  }[];
}

export interface AthleteBestRecord {
  year: number;
  result_time: string;
  result_date: string;
  fina_point: number;
  percentage: number;
  game_name: string;
  game_code: string;
  class_code: number;
  race_division_code: number;
  heat: number;
  rankings: {
    title: string;
    ranking: number;
    total: number;
  }[];
}

export interface Distribution {
  from: string;
  to: string;
  numbers: number;
  percentage: string;
}

export interface AthleteGraphData {
  records: {
    school_class: {
      code: number;
      name: string;
      grades: number[];
      member_group: MasterData;
    };
    record: {
      record: string;
      achieve_date: string;
      is_new: boolean;
    };
  }[];
  japan_record: {
    record: string;
    achieve_date: string;
    is_new: boolean;
  };
  graphs: {
    max_time: string;
    min_time: string;
    data: {
      school_class: { code: number; name: string; grades: number[] };
      total: number;
      distributions: Distribution[];
    }[];
  };
}

export interface GameClass {
  gender: MasterData;
  held_styles: {
    swimming_style: MasterData;
    held_distances: {
      distance: { code: number; name: string; name_for_relay: string | null };
      classes: MasterData[];
    }[];
  }[];
}

export interface GameClassResponse {
  data: GameClass[];
}

// 新しい型定義：大会クラス情報
export interface GameClassInfo {
  gender: { code: number; name: string };
  held_styles: {
    swimming_style: { code: number; name: string };
    held_distances: {
      distance: { code: number; name: string; name_for_relay: string | null };
      classes: { code: number; name: string }[];
    }[];
  }[];
}

export interface GameClassApiResponse {
  data: GameClassInfo[];
}

// 新しい型定義：選手履歴
export interface AthleteHistoryLapDetail {
  distance: number;
  passing_time: string;
  rank: number;
  lap_time: string;
  lap_time_rank: number;
}

export interface AthleteHistory {
  result_id: number;
  result_time: string;
  is_relay_first: boolean;
  entry_group: {
    code: string;
    name: string;
    short_name: string;
    member_group: { code: number; name: string };
  };
  school_class: {
    code: number;
    name: string;
    school_grades: number;
  };
  game_name: string;
  division: { code: number; name: string };
  ranking: number;
  result_date: string;
  lap_details: AthleteHistoryLapDetail[];
}

export interface AthleteHistoryResponse {
  data: AthleteHistory[];
  links: Links;
  meta: MetaData;
}

// 新しい型定義：記録比較
export interface ComparisonLapData {
  passing_time: string;
  gap_with_top: string;
  lap_time: string;
}

export interface ComparisonSelectedData {
  result_id: number;
  result_time: string;
  result_date: string;
  game_name: string;
  game_short_name: string | null;
  division: { code: number; name: string };
  data: {
    base_on_50: ComparisonLapData[];
    base_on_100: ComparisonLapData[];
    base_on_200: ComparisonLapData[];
  };
}

export interface ComparisonResponse {
  race_graph: {
    upperLimit: string;
  };
  lap_graph: {
    upperLimit_50m: string;
    upperLimit_100m: string;
    upperLimit_200m: string;
    lowerLimit_50m: string;
    lowerLimit_100m: string;
    lowerLimit_200m: string;
  };
  selected: ComparisonSelectedData[];
}