interface LoginRequest {
  email: string;
  password: string;
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  phoneNumber?: string;
}

export type { LoginRequest, RegisterRequest };
