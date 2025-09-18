import type { QuestionResponse } from "./question";

interface CourseResponse {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}
interface RequestCourse {
  id?: string;
  name: string;
  description?: string;
  isActive: boolean;
}
interface CourseRootResponse {
  id: string;
  label: string;
  description?: string;
  courseId: string;
  isMain: boolean;
}

interface RequestCourseRoot {
  id?: string;
  label: string;
  description: string;
  courseId: string;
  isMain: boolean;
}

interface CourseChildResponse {
  id: string;
  label: string;
  description?: string;
  type: string;
  duration: number;
  isLocked: boolean;
  courseRootId: string;
  ordering?: number;
}

interface RequestCourseChild {
  id?: string;
  label: string;
  description: string;
  type: string;
  minute: number;
  isLocked: boolean;
  courseRootId: string;
  ordering?: number;
}

interface Option {
  value: boolean;
  label: string;
}

interface CourseContent {
  title: string;
  content: string;
  videoUrl: string;
}
interface ContentDetail {
  title: string;
  description: string;
  type: string;
  minute: number;
  isLocked: boolean;
  content?: CourseContent | null;
  quiz?: QuestionResponse | null;
}
interface ViewVideoResponse {
  title: string;
  type: string;
  score: number;
  minute: string;
  startTime?: string;
  endTime?: string;
}
interface ResponseResult {
  no: number;
  name: string;
  email: string;
  courseTitle: string;
  dateStarted?: Date | null;
  dateCompleted?: Date | null;
  learningProgress: number;
  latestAccess?: Date | null;
  score: number;
  scoreTotal: number;
}

export type {
  CourseRootResponse,
  Option,
  RequestCourseRoot,
  CourseChildResponse,
  RequestCourseChild,
  ContentDetail,
  ViewVideoResponse,
  ResponseResult,
  CourseResponse,
  RequestCourse,
};
