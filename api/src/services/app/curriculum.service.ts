import prisma from "../../config/prisma";
import { NotFoundError } from "../../errors/CustomError";

export const getCurriculum = async () => {
  const lists = await prisma.courseRoot.findMany({
    orderBy: { ordering: "asc" },
  });
  let curriculum = [];
  for (let index = 0; index < lists.length; index++) {
    const element = lists[index];

    const children = await prisma.courseChild.findMany({
      where: { courseRootId: element.id },
      orderBy: [{ courseRoot: { ordering: "asc" } }, { ordering: "asc" }],
    });

    curriculum.push({
      id: element.id,
      label: element.title,
      description: element.description,
      collapsed: false,
      list: children.map((child) => {
        return {
          id: child.id,
          label: child.title,
          description: child.description,
          duration: child.minute,
          isLock: true,
          type: child.type,
        };
      }),
    });
  }

  return curriculum;
};

export const getMyCurriculum = async (learnerId: string, courseId: string) => {
  const check = await prisma.learnerCode.findFirst({
    where: { learnerId, courseId },
    orderBy: { usedAt: "desc" },
  });
  if (!check) throw new NotFoundError("Course is locked!");

  const lists = await prisma.courseRoot.findMany({
    where: { courseId },
    orderBy: { ordering: "asc" },
  });
  let curriculum = [];
  for (let index = 0; index < lists.length; index++) {
    const element = lists[index];

    const children = await prisma.courseChild.findMany({
      where: { courseRootId: element.id },
      orderBy: { ordering: "asc" },
    });

    let childs: any = [];
    let totalScore = 0;
    for await (const child of children) {
      const learnerChild = await prisma.learnerCourse.findFirst({
        where: { courseChildId: child.id, learnerCodeId: check.id, learnerId },
      });

      childs.push({
        id: child.id,
        label: child.title,
        description: child.description,
        duration: child.minute,
        type: child.type,
        status:
          !child.isLocked && learnerChild?.status !== "DONE"
            ? "INPROGRESS"
            : learnerChild?.status === "START"
              ? "INPROGRESS"
              : learnerChild?.status,
        score: learnerChild ? learnerChild?.scoreAmount : 0,
      });

      totalScore += learnerChild ? learnerChild?.scoreAmount : 0;
    }

    curriculum.push({
      id: element.id,
      label: element.title,
      description: element.description,
      totatScore: totalScore,
      collapsed: false,
      list: childs,
    });
  }

  return { learnerCodeId: check.id, curriculum };
};

export const getMyCurriculumStatus = async (
  learnerId: string,
  courseId: string
) => {
  const check = await prisma.learnerCode.count({
    where: { learnerId, courseId, status: { in: ["START", "INPROGRESS"] } },
  });

  return { isLocked: check > 0 ? false : true };
};

export const getCurriculumProcess = async (
  learnerId: string,
  learnerCodeId: string
) => {
  const check = await prisma.learnerCode.findFirst({
    where: { id: learnerCodeId, learnerId },
  });
  if (!check) throw new NotFoundError("Course is locked!");

  const lists = await prisma.learnerCourse.findMany({
    where: { learnerCodeId },
    orderBy: [
      { courseChild: { courseRoot: { ordering: "asc" } } },
      { ordering: "asc" },
    ],
  });

  const items = [];
  for await (const list of lists) {
    const course = await prisma.courseChild.findUnique({
      where: { id: list.courseChildId },
      select: { type: true, title: true, isMain: true },
    });

    items.push({
      ...list,
      type: course?.type,
      label: course?.title,
    });
  }

  return items;
};

export const getById = async (
  courseChildId: string,
  learnerCodeId: string,
  learnerId: string
) => {
  const check = await prisma.learnerCourse.findFirst({
    select: { status: true, ordering: true },
    where: { learnerCodeId, learnerId, courseChildId },
  });

  if (!check) throw new NotFoundError("Curriculum not found!");
  if (check.status === "LOCKED")
    throw new NotFoundError("Curriculum is locked!");

  await prisma.learnerCode.update({
    where: { id: learnerCodeId },
    data: { updatedAt: new Date() },
  });
  const course = await prisma.courseChild.findUnique({
    where: { id: courseChildId },
    select: { id: true, title: true, minute: true, type: true, isMain: true },
  });

  if (!course) throw new NotFoundError("Course not found!");

  let isNext = false;
  const checkOrder = await prisma.learnerCourse.aggregate({
    _max: { ordering: true },
  });

  if (!checkOrder) throw new NotFoundError("Check order course not found!");

  const orderNext = await (check.ordering + 1);

  if (orderNext <= Number(checkOrder._max.ordering)) {
    const next = await prisma.learnerCourse.findFirst({
      where: { learnerCodeId, ordering: orderNext },
    });

    if (next?.status !== "LOCKED") {
      isNext = true;
    }
  }

  const content = await prisma.courseContent.findUnique({
    where: { courseChildId },
    select: { courseChildId: true, title: true, content: true, videoUrl: true },
  });

  // Latest Access
  await prisma.learnerCode.update({
    where: { id: learnerCodeId },
    data: { updatedAt: new Date() },
  });

  return {
    isNext,
    course: {
      ...course,
      status: check.status,
      learnerCodeId,
    },
    content,
  };
};

export const postComplete = async (
  courseChildId: string,
  learnerCodeId: string
) => {
  const checkDone = await prisma.learnerCode.count({
    where: { id: learnerCodeId, status: "DONE" },
  });
  // Check if course is completed
  if (checkDone > 0) throw new NotFoundError("Course is completed!");

  const check = await prisma.learnerCourse.findFirst({
    where: { courseChildId, learnerCodeId },
  });

  if (!check) throw new NotFoundError("Curriculum not found!");

  const childC = await prisma.courseChild.findUnique({
    select: {
      type: true,
      minute: true,
      isMain: true,
      courseQuiz: { select: { id: true } },
    },
    where: { id: courseChildId },
  });
  if (!childC) throw new NotFoundError("Course child not found!");

  let scoreAmount = 0;
  if (childC.type === "QUIZ") {
    const idArr = await childC.courseQuiz.map((item) => item.id);

    const score = await prisma.learnerQuizAnswer.aggregate({
      _sum: { score: true },
      where: { learnerCodeId, quizId: { in: idArr }, courseChildId },
    });
    scoreAmount = score._sum.score ?? 0;
  }

  const endAt = new Date();
  const second = check.startAt
    ? Math.floor((endAt.getTime() - check.startAt.getTime()) / 1000)
    : 0;

  const updated = await prisma.learnerCourse.updateMany({
    where: {
      courseChildId,
      learnerCodeId,
    },
    data: {
      status: "DONE",
      scoreAmount: scoreAmount,
      viewVideo: childC.minute,
      minute: second,
      startAt: check.startAt ? check.startAt : endAt,
      endAt: endAt,
    },
  });

  if (updated.count === 0)
    throw new NotFoundError("Update complate not found!");

  const checkOrder = await prisma.learnerCourse.aggregate({
    // _min: { order: true },
    _max: { ordering: true },
  });

  if (!checkOrder) throw new NotFoundError("Check order course not found!");

  const orderNow = await (check.ordering + 1);

  if (orderNow <= Number(checkOrder._max.ordering)) {
    const checkDone = await prisma.learnerCourse.findFirst({
      select: { status: true },
      where: { learnerCodeId, ordering: orderNow },
    });

    if (checkDone?.status === "LOCKED") {
      await prisma.learnerCourse.updateMany({
        where: { learnerCodeId, ordering: orderNow },
        data: { isLocked: false, status: "INPROGRESS" },
      });
    }
  }

  if (orderNow === 2) {
    await prisma.learnerCode.update({
      where: { id: learnerCodeId },
      data: { status: "INPROGRESS" },
    });
  }

  return { isNext: true };
};

export const getScoreData = async (
  courseChildId: string,
  learnerCodeId: string
) => {
  const childC = await prisma.courseChild.findUnique({
    select: { type: true, isMain: true, courseQuiz: { select: { id: true } } },
    where: { id: courseChildId },
  });
  if (!childC) throw new NotFoundError("Course child not found!");

  let scoreAmount = 0;
  let scoreTotal = 0;
  if (childC.type === "QUIZ") {
    const idArr = await childC.courseQuiz.map((item) => item.id);

    const score = await prisma.learnerQuizAnswer.aggregate({
      _sum: { score: true },
      _count: true,
      where: { learnerCodeId, quizId: { in: idArr } },
    });
    scoreAmount = score._sum.score ?? 0;
    scoreTotal = await score._count;
  }

  return { score: scoreAmount, total: scoreTotal };
};
