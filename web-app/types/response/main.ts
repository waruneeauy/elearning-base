interface ProfileResponse {
  email: string;
  name: string;
  phoneNumber: string | null;
  photo: string | null;
  profile: {
    birthday: string | null;
    gender: string | null;
    position: string | null;
    address: string | null;
  };
}

export type { ProfileResponse };
