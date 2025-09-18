interface Option {
  label: string;
  value: string;
}
interface SectionResponse {
  id: string;
  type: string;
  partNo: number;
  partTitle: string;
  partDirections: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
  setNo: string;
}

interface QuestionResponse {
  id: string;
  courseChildId: string;
  no: number;
  subNo: number;
  type: string;
  description: string;
  explanation: string;
  score: number;
  CourseQuizAnswer: Answer[];
}

interface Answer {
  no: number;
  answers: Choice[];
}

interface Choice {
  id: string;
  no: number;
  description: string;
  isCorrect: boolean;
  quizId: string;
}

export type { SectionResponse, QuestionResponse, Option, Choice, Answer };
