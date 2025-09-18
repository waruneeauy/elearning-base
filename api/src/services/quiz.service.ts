import { Answer } from "./../interfaces/request.interface";
import prisma from "../config/prisma";
import { NotFoundError } from "../errors/CustomError";
import {
  Choice,
  RequestAnswer,
  RequestCreateQuiz,
  RequestUpdateQuestion,
} from "../interfaces/question.interface";

export const getQuizLists = async (id: string) => {
  const lists = await prisma.courseQuiz.findMany({
    where: {
      courseChildId: id,
    },
  });

  return lists;
};

export const createQuiz = async (id: string, req: RequestCreateQuiz) => {
  const data = await req.body;
  const choices = await data.choices.map((answer: Choice, i: number) => {
    return {
      no: answer.no,
      description: answer.description,
      isCorrect: answer.isCorrect,
      ordering: i,
    };
  });

  const contentData = await prisma.courseQuiz.create({
    data: {
      no: data.no,
      subNo: data.subNo ?? undefined,
      type: data.type,
      description: data.description,
      explanation: data.explanation,
      score: 1,
      courseChildId: id,
      courseQuizAnswer: {
        create: choices,
      },
      createdBy: req.user.id,
      createdAt: new Date(),
    },
  });

  if (!contentData) {
    throw new NotFoundError(`Failed to create content`);
  }

  return true;
};

export const editQuiz = async (id: string, req: RequestUpdateQuestion) => {
  const data = await req.body;
  const choices = await data.choices.map((answer: Choice, i: number) => {
    return {
      no: answer.no,
      description: answer.description,
      isCorrect: answer.isCorrect,
      ordering: i,
    };
  });

  await prisma.courseQuizAnswer.deleteMany({
    where: {
      quizId: id,
      no: 1,
    },
  });
  const contentData = await prisma.courseQuiz.update({
    where: {
      id,
    },
    data: {
      no: Number(data.no),
      subNo: Number(data.subNo) ?? undefined,
      type: data.type,
      description: data.description,
      explanation: data.explanation,
      score: 1,
      courseQuizAnswer: {
        create: choices,
      },
      updatedBy: req.user.id,
      updatedAt: new Date(),
    },
  });

  if (!contentData) {
    throw new NotFoundError(`Failed to update content with id ${id}`);
  }

  return contentData;
};

export const deleteQuizById = async (quizId: string) => {
  await prisma.courseQuizAnswer.deleteMany({ where: { quizId } });
  await prisma.courseQuiz.delete({
    where: {
      id: quizId,
    },
  });

  return true;
};

export const createAnswer = async (req: RequestAnswer) => {
  const data = req.body;

  let i = 0;
  for (const c of data.choices) {
    const test = await prisma.courseQuizAnswer.create({
      data: {
        no: c.no,
        description: c.description,
        isCorrect: c.isCorrect,
        quizId: c.quizId,
        ordering: i,
      },
    });
    i++;
  }

  return true;
};

export const updateAnswer = async (
  id: string,
  no: number,
  req: RequestAnswer
) => {
  const data = req.body;

  await prisma.courseQuizAnswer.deleteMany({
    where: {
      quizId: id,
      no,
    },
  });

  let i = 0;
  for (const c of data.choices) {
    await prisma.courseQuizAnswer.create({
      data: {
        no: c.no,
        description: c.description,
        isCorrect: c.isCorrect,
        quizId: c.quizId,
        ordering: i,
      },
    });
    i++;
  }
  return true;
};

export const deleteAnswerByQuizId = async (quizId: string, no: number) => {
  await prisma.courseQuizAnswer.deleteMany({ where: { quizId, no } });

  return true;
};
