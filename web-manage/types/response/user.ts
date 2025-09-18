interface CodeResponse {
  id: string;
  code: string;
  isUsed: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
}

interface Option {
  value: boolean | null;
  label: string;
}
interface OptionText {
  value: string;
  label: string;
}
interface LearnerResponse {
  id: string;
  status: string;
  learnerName: string;
  learnerEmail: string;
  learnerPhoneNumber: string;
  setName: string;
  createdAt: Date;
}

interface UserResponse {
  email: string;
  learnerId: string;
  name: string;
  pwd: string;
}

export type { CodeResponse, Option, LearnerResponse, OptionText, UserResponse };
