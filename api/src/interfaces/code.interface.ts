import { CustomRequest } from "./request.interface";

export interface GenerateCode {
  amount: number;
  point: number;
}

export interface RequestGenerateCode extends CustomRequest {
  body: GenerateCode;
}
