import { CustomRequest } from "./request.interface";

export interface CreatePackage {
  image?: string;
  name: string;
  description?: string;
  point: number;
  price: number;
  isActive: boolean;
}

export interface RequestCreatePackage extends CustomRequest {
  body: CreatePackage;
}
