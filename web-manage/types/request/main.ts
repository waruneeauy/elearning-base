interface LoginRequest {
  email: string;
  password: string;
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
}

export type { LoginRequest };
