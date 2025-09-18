import { Request } from "express";

export interface Answer {
  setNo: string;
  // sectionType: SectionKeyName;
  sectionPartId: string;
  questionId: string;
  partNo: number;
  partId: string;
  questionNo: number;
  answerId: string;
  runningNo: number;
}
export interface PostAnswer {
  setNo: string;
  answers: Answer[];
}

export interface RequestPostAnswer extends CustomRequest {
  body: PostAnswer;
}
export interface CustomRequest extends Request {
  user?: any;
}

export interface FileRequest extends CustomRequest {
  file: any;
}
