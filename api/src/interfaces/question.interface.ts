import { CustomRequest } from "./request.interface";

enum QuizType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
}

export interface Choice {
  description: string;
  quizId: string;
  isCorrect: boolean;
  no?: number;
}

export interface RequestAnswer extends CustomRequest {
  body: { quizId: string; choices: Choice[] };
}
export interface RequestQuiz {
  no: number;
  subNo?: number;
  type: QuizType;
  description: string;
  explanation?: string;
  score: number;
  choices: Choice[];
}

export interface RequestCreateQuiz extends CustomRequest {
  body: RequestQuiz;
}

export interface UpdateQuestion {
  no: number;
  subNo?: number;
  type: QuizType;
  description: string;
  explanation?: string;
  score: number;
  choices: Choice[];
}

export interface RequestUpdateQuestion extends CustomRequest {
  body: UpdateQuestion;
}

export interface CreateContent extends CustomRequest {
  title: string;
  content: string;
  videoUrl: string;
}
export interface RequestContent extends CustomRequest {
  body: CreateContent;
}
