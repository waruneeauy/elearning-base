interface FormContent {
  title: string;
  content: string;
  videoUrl: string;
}

interface PartRequest {
  sectionId: string;
  sectionType: string;
  partNo: number;
  template: string;
  questionNo: number;
  questionDesc: string;
  audio?: string | null;
  picture?: string | null;
  video?: string | null;
  content: string;
  isActive: boolean;
  setNo: string;
}

interface QuestionRequest {
  no: number;
  subNo: number;
  type: string;
  description: string;
  explanation?: string;
  score: number;
  choices: ChoiceRequest[];
}

interface ChoiceRequest {
  id: string;
  no: number;
  description: string;
  isCorrect: boolean;
  quizId: string;
}

interface RequestChoice {
  quizId: string;
  choices: ChoiceRequest[];
}

export type {
  FormContent,
  PartRequest,
  QuestionRequest,
  ChoiceRequest,
  RequestChoice,
};
