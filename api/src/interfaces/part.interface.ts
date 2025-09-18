import { CustomRequest } from "./request.interface";

enum SectionKeyName {
  LISTENING = "LISTENING",
  READING = "READING",
}

export interface CreatePart {
  sectionId: string;
  sectionType: SectionKeyName;
  partNo: number;
  template: string;
  questionNo: number;
  questionDesc: string;
  audio: string;
  picture: string;
  video: string;
  content: string;
  isActive: boolean;
  setNo: string;
  score: number;
}

export interface RequestCreatePart extends CustomRequest {
  body: CreatePart;
}

export interface UpdatePart {
  sectionType: SectionKeyName;
  partNo: number;
  template: string;
  questionNo: number;
  questionDesc: string;
  audio: string;
  picture: string;
  video: string;
  content: string;
  isActive: boolean;
  score: number;
}

export interface RequestUpdatePart extends CustomRequest {
  body: UpdatePart;
}
