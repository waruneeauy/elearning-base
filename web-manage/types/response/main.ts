interface AccountResponse {
  id: number;
  username: string;
  email: string | null;
  photo: string | null;
  first_name: string | null;
  last_name: string | null;
  team: {
    team_id: number;
    member_no: number;
    team_name: string;
    step_no: number;
    step_status: number;
  };
  room: RoomResponse;
  role: string;
  budget: {
    initial_budget: number;
    remaining_budget: number;
  };
}

interface RoomResponse {
  id: number;
  room_name: string;
  session_code: string;
  sheet_id: string;
  total_team: number;
  round_no: number;
  turn_no: number;
  step_no: number;
  sub_step_no: number;
  status: number;
  created_at: number;
  created_by: number;
  updated_by: number;
  updated_at: number;
}

export type { AccountResponse, RoomResponse };
