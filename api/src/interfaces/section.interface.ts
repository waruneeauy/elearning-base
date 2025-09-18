import { CustomRequest } from "./request.interface";

enum SectionKeyName {
  LISTENING = "LISTENING",
  READING = "READING",
}

export interface CreateSection {
  type: SectionKeyName;
  partNo: number;
  partTitle: string;
  partDirections?: string;
  isActive: boolean;
  userId: string;
  setNo: string;
  isOneTime: boolean;
}

export interface RequestCreateSection extends CustomRequest {
  body: CreateSection;
}
