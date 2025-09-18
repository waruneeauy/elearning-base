import prisma from "../../config/prisma";
import { NotFoundError } from "../../errors/CustomError";

export const quizLists = async (
  courseChildId: string,
  learnerCodeId: string
) => {
  const quizlists = await prisma.courseQuiz.findMany({
    select: {
      id: true,
      no: true,
      subNo: true,
      type: true,
      description: true,
      explanation: true,
      courseQuizAnswer: {
        select: {
          id: true,
          description: true,
          no: true,
          isCorrect: true,
        },
        orderBy: [{ no: "asc" }, { ordering: "asc" }],
      },
    },
    where: { courseChildId },
    orderBy: [{ no: "asc" }, { subNo: "asc" }],
  });

  let items: any = [];
  for await (const quiz of quizlists) {
    const checkGroup = await quiz.courseQuizAnswer.reduce(
      (acc: Record<string, any[]>, item: { no: number }) => {
        (acc[item.no] ||= []).push(item);
        return acc;
      },
      {}
    );

    let answers: any = [];
    let results: any = [];

    if (Object.keys(checkGroup).length === 1) {
      const ans = await prisma.learnerQuizAnswer.findFirst({
        where: { quizId: quiz.id, answerNo: 1, learnerCodeId },
      });

      answers = await quiz.courseQuizAnswer.map((item) => ({
        id: item.id,
        description: item.description,
      }));

      results = {
        quizId: quiz.id,
        answerId: ans ? ans.answerId : null,
        correctAnswerId: ans
          ? quiz.courseQuizAnswer.find((item) => item.isCorrect)?.id
          : null,
        isCorrect: ans ? (ans.score > 0 ? true : false) : null,
        answerNo: 1,
        learnerCodeId,
      };
    } else {
      for await (const key of Object.keys(checkGroup)) {
        answers.push({
          no: `${quiz.no}.${key}`,
          items: checkGroup[key].map((item) => ({
            id: item.id,
            description: item.description,
          })),
        });
        const ans = await prisma.learnerQuizAnswer.findFirst({
          where: { quizId: quiz.id, answerNo: Number(key), learnerCodeId },
        });
        results.push({
          quizId: quiz.id,
          answerId: ans?.answerId ?? null,
          correctAnswerId: ans
            ? checkGroup[key].find((item) => item.isCorrect)?.id
            : null,
          isCorrect: ans ? (ans.score > 0 ? true : false) : null,
          answerNo: Number(key),
          learnerCodeId,
          courseChildId,
        });
      }
    }

    const checkArray = await (Array.isArray(results) ? true : false);
    const isAnswered = await (checkArray
      ? results.find((item: any) => item.answerId)
        ? true
        : false
      : results.answerId
        ? true
        : false);

    items.push({
      id: quiz.id,
      no: quiz.subNo > 0 ? `${quiz.no}.${quiz.subNo}` : quiz.no,
      set: quiz.no,
      type: quiz.type,
      description: quiz.description,
      explanation: quiz.explanation,
      format: Object.keys(checkGroup).length === 1 ? "normal" : "group",
      isAnswered,
      answers,
      results,
    });
  }

  return items;
};

export const saveQuiz = async (learnerId: string, data: any) => {
  const checkDone = await prisma.learnerCode.count({
    where: { id: data.learnerCodeId, status: "DONE" },
  });
  // Check if course is completed
  if (checkDone > 0) throw new NotFoundError("course is completed!");

  const quiz = await prisma.courseQuiz.findFirst({
    select: {
      score: true,
      courseChildId: true,
      courseQuizAnswer: { select: { id: true, isCorrect: true } },
    },
    where: { id: data.quizId },
  });

  if (!quiz) throw new NotFoundError("Quiz not found!");

  await prisma.learnerQuizAnswer.create({
    data: {
      learnerId,
      quizId: data.quizId,
      answerId: data.answerId,
      score: quiz.courseQuizAnswer.find((item) => item.id === data.answerId)
        ?.isCorrect
        ? quiz?.score
        : 0,
      answerNo: data.answerNo,
      learnerCodeId: data.learnerCodeId,
      createdAt: new Date(),
      answerCorrectId:
        quiz.courseQuizAnswer.find((item) => item.isCorrect)?.id ?? "",
      courseChildId: quiz.courseChildId,
    },
  });

  return true;
};

export const saveQuizGroup = async (learnerId: string, lists: any[]) => {
  const checkDone = await prisma.learnerCode.count({
    where: { id: lists[0].learnerCodeId, status: "DONE" },
  });
  // Check if course is completed
  if (checkDone > 0) throw new NotFoundError("Course is completed!");

  for await (const data of lists) {
    const quiz = await prisma.courseQuiz.findFirst({
      select: {
        score: true,
        courseChildId: true,
        courseQuizAnswer: { select: { id: true, isCorrect: true, no: true } },
      },
      where: { id: data.quizId },
    });

    if (!quiz) throw new NotFoundError("Quiz not found!");

    await prisma.learnerQuizAnswer.create({
      data: {
        learnerId,
        quizId: data.quizId,
        answerId: data.answerId,
        score: quiz.courseQuizAnswer.find(
          (item) => item.no === data.answerNo && item.id === data.answerId
        )?.isCorrect
          ? quiz?.score
          : 0,
        answerNo: data.answerNo,
        learnerCodeId: data.learnerCodeId,
        createdAt: new Date(),
        answerCorrectId:
          quiz.courseQuizAnswer.find(
            (item) => item.no === data.answerNo && item.isCorrect
          )?.id ?? "",
        courseChildId: quiz.courseChildId,
      },
    });
  }

  return true;
};
