import prisma from "../config/prisma";
import { NotFoundError } from "../errors/CustomError";
import { RequestContent } from "../interfaces/question.interface";

export const getContentData = async (id: string) => {
  const data = await prisma.courseChild.findFirst({
    select: {
      title: true,
      description: true,
      type: true,
      minute: true,
      isLocked: true,
      courseContent: true,
      courseQuiz: {
        select: {
          id: true,
          no: true,
          subNo: true,
          type: true,
          description: true,
          explanation: true,
          score: true,
          courseQuizAnswer: {
            select: {
              id: true,
              no: true,
              description: true,
              isCorrect: true,
              quizId: true,
            },
            orderBy: { ordering: "asc" },
          },
        },
        orderBy: [{ no: "asc" }, { subNo: "asc" }],
      },
    },
    where: { id },
  });

  if (!data) {
    throw new NotFoundError(`Content with id ${id} not found`);
  }

  let quiz = [];
  if (data.courseQuiz.length > 0) {
    for await (const q of data.courseQuiz) {
      const groupedAnswers = Object.entries(
        q.courseQuizAnswer.reduce((acc: any, answer) => {
          if (!acc[answer.no]) {
            acc[answer.no] = [];
          }
          acc[answer.no].push({
            id: answer.id,
            description: answer.description,
            isCorrect: answer.isCorrect,
            quizId: answer.quizId,
            no: answer.no,
          });
          return acc;
        }, {})
      ).map(([no, answers]) => ({
        no: Number(no), // Convert key to number
        answers: answers,
      }));

      quiz.push({
        id: q.id,
        no: q.no,
        subNo: q.subNo,
        type: q.type,
        description: q.description,
        explanation: q.explanation,
        score: q.score,
        CourseQuizAnswer: groupedAnswers,
      });
    }
  }

  const content = {
    title: data.title,
    description: data.description,
    type: data.type,
    minute: data.minute,
    isLocked: data.isLocked,
    content: data.courseContent || null,
    quiz,
  };

  return content;
};

export const createContent = async (id: string, req: RequestContent) => {
  const data = await req.body;
  const contentData = await prisma.courseContent.create({
    data: {
      title: data.title,
      content: data.content,
      videoUrl: data.videoUrl,
      courseChildId: id,
      createdBy: req.user.id,
      createdAt: new Date(),
    },
  });

  if (!contentData) {
    throw new NotFoundError(`Failed to create content`);
  }

  return true;
};

export const editContent = async (id: string, req: RequestContent) => {
  const data = await req.body;

  const contentData = await prisma.courseContent.update({
    where: {
      courseChildId: id,
    },
    data: {
      title: data.title,
      content: data.content,
      videoUrl: data.videoUrl,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    },
  });

  if (!contentData) {
    throw new NotFoundError(`Failed to update content with id ${id}`);
  }

  return contentData;
};
