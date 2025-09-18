import { CustomRequest } from "./request.interface";

export interface RequestLogin extends CustomRequest {
  body: {
    email: string;
    password: string;
  };
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface RequestCreateUser extends CustomRequest {
  body: CreateUser;
}
