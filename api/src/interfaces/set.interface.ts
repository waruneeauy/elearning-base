import { CustomRequest } from "./request.interface";

export interface CreateSectionSet {
  setImage: string;
  setName: string;
  setDesc: string;
  isActive: boolean;
  isLocked: boolean;
  usePoint: number;
}

export interface RequestCreateSectionSet extends CustomRequest {
  body: CreateSectionSet;
}
