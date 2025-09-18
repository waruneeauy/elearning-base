import { CustomRequest } from "./request.interface";

export interface CreateBanner {
  type: string;
  image: string;
  title?: string;
  description?: string;
  link?: string;
  isActive: boolean;
  isLocked: boolean;
  usePoint: number;
}

export interface RequestCreateBanner extends CustomRequest {
  body: CreateBanner;
}
