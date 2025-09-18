import { CustomRequest } from "./request.interface";

export interface CreateConfig {
  textResult: string;
  testTimeMinute: number;
}

export interface RequestCreateConfig extends CustomRequest {
  body: CreateConfig;
}
