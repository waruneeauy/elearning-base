import { CustomRequest } from "../request.interface";

export interface RequestLogin extends CustomRequest {
  body: {
    email: string;
    password: string;
  };
}

export interface CreateAccount {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  facebookID?: string;
  googleID?: string;
  position?: string;
  companyName?: string;
}

export interface RequestCreateAccount extends CustomRequest {
  body: CreateAccount;
}

export interface UpdateAccount {
  name: string;
  email: string;
  phoneNumber: string;
  profile: Profile;
}

export interface Profile {
  name: string;
  phoneNumber: string;
  birthday: Date;
  gender?: string;
  position?: string;
  address?: string;
  companyName?: string;
}

export interface RequestUpdateAccount extends CustomRequest {
  body: UpdateAccount;
}

export interface ChangePassword {
  oldPassword?: string;
  password: string;
}
export interface RequestChangePassword extends CustomRequest {
  body: ChangePassword;
}
export interface ChangePhoto {
  photo: string;
}
export interface RequestChangePhoto extends CustomRequest {
  body: ChangePhoto;
}
