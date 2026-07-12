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

export interface GameListResponse {
  data: Game[];
  links: { first: string; last: string; prev: string | null; next: string | null };
  meta: { current_page: number; from: number; last_page: number; path: string; per_page: number; to: number; total: number };
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
