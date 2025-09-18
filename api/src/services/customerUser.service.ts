import prisma from "../config/prisma";
import { NotFoundError } from "../errors/CustomError";
import {
  RequestUpdateDate,
  RequestUserGenerateCode,
} from "../interfaces/customer.interface";

export const getUserAll = async (
  customerId: string,
  courseId: string,
  page: number = 1,
  pageSize: number = 10,
  isUsed: undefined | boolean = undefined,
  keyword: string = "",
  sortBy: string = "createdAt",
  descending: boolean = false
) => {
  const total = await prisma.learnerCode.count({
    where: {
      customerId,
      courseId,
      isUsed: typeof isUsed === "boolean" ? isUsed : undefined,
      OR:
        typeof keyword === "string"
          ? [
              { code: { contains: keyword } },
              { learner: { name: { contains: keyword } } },
            ]
          : undefined,
    },
  });
  const items = await prisma.learnerCode.findMany({
    select: {
      id: true,
      code: true,
      isUsed: true,
      status: true,
      usedAt: true,
      expiredDate: true,
      deadlineDate: true,
      completedDate: true,
      learner: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
      createdBy: true,
      createdAt: true,
    },
    where: {
      customerId,
      courseId,
      isUsed: typeof isUsed === "boolean" ? isUsed : undefined,
      OR:
        typeof keyword === "string"
          ? [
              { code: { contains: keyword } },
              { learner: { name: { contains: keyword } } },
            ]
          : undefined,
    },
    skip: page ? (+page - 1) * +(pageSize || 10) : 0,
    take: pageSize ? +pageSize : 10,
    orderBy:
      sortBy === "learnerUser"
        ? { learner: { name: descending ? "desc" : "asc" } }
        : { [sortBy]: descending ? "desc" : "asc" },
  });

  return {
    total,
    items,
  };
};

export const generateCode = async (req: RequestUserGenerateCode) => {
  let lists = [];
  for (let i = 0; i < req.body.amount; i++) {
    const code = await createRandomString(6);
    const checkCode = await prisma.learnerCode.findFirst({ where: { code } });
    if (checkCode) {
      i--;
      continue;
    }

    await lists.push({
      code: createRandomString(6),
      customerId: req.body.customerId,
      courseId: req.body.courseId,
      createdBy: req.user.id,
      expiredDate: new Date(req.body.expiredAt),
      deadlineDate: new Date(req.body.deadlineDate),
      createdAt: new Date(),
    });
  }

  const code = await prisma.learnerCode.createMany({
    data: lists,
  });

  if (!code) {
    throw new NotFoundError(`Failed to create code`);
  }
};

export const updateDate = async (id: string, req: RequestUpdateDate) => {
  return await prisma.learnerCode.update({
    where: { id },
    data: {
      expiredDate: new Date(req.body.expiredAt),
      deadlineDate: new Date(req.body.deadlineDate),
    },
  });
};

export const deleteUser = async (id: string) => {
  return await prisma.learnerCode.delete({
    where: {
      id: id,
    },
  });
};

export const updateCompleted = async (ids: string[], userId: string) => {
  for await (const id of ids) {
    const data = await prisma.learnerQuizAnswer.aggregate({
      _sum: { score: true },
      where: {
        learnerCodeId: id,
      },
    });

    if (!data) {
      throw new NotFoundError(`Code not found`);
    }

    // score total
    const x = await prisma.courseQuizAnswer.groupBy({
      by: ["quizId"],
      _max: {
        no: true,
      },
      // where: {
      //   quiz: {
      //     courseChildId: child.id, // Ensure the relationship exists
      //   },
      // },
    });

    const scoreTotal = await x.reduce(
      (acc, cur) => acc + Number(cur._max.no),
      0
    );

    await prisma.learnerCode.update({
      where: { id },
      data: {
        status: "DONE",
        scoreTotal: scoreTotal,
        score: Number(data._sum?.score),
        updatedAt: new Date(),
        updatedBy: userId,
        completedDate: new Date(),
      },
    });
  }

  return true;
};

export const getVideoDetail = async (id: string) => {
  const items = await prisma.learnerCourse.findMany({
    select: {
      courseChildId: true,
      scoreAmount: true,
      minute: true,
      startAt: true,
      endAt: true,
      courseChild: {
        select: {
          title: true,
          type: true,
        },
      },
    },
    where: {
      learnerCodeId: id,
    },
    orderBy: { ordering: "asc" },
  });

  if (!items) {
    throw new NotFoundError(`Code not found`);
  }

  let list = [];
  for await (const item of items) {
    let totalQuiz = 0;
    if (item.courseChild.type === "QUIZ") {
      const x = await prisma.courseQuizAnswer.groupBy({
        by: ["quizId"],
        _max: {
          no: true,
        },
        where: {
          quiz: {
            courseChildId: item.courseChildId, // Ensure the relationship exists
          },
        },
      });

      totalQuiz = await x.reduce((acc, cur) => acc + Number(cur._max.no), 0);
    }
    list.push({
      id: item.courseChildId,
      title: item.courseChild.title,
      type: item.courseChild.type,
      score: item.courseChild.type === "QUIZ" ? item.scoreAmount : 0,
      fullScore: item.courseChild.type === "QUIZ" ? totalQuiz : 0,
      minute:
        item.courseChild.type === "VIDEO"
          ? item.minute >= 60
            ? `${Math.floor(item.minute / 60)}min`
            : `${item.minute}s`
          : "-",
      startTime: item.startAt,
      endTime: item.endAt,
    });
  }

  return list;
};

export const getResult = async (ids: string[]) => {
  const lists = await prisma.learnerCode.findMany({
    select: {
      id: true,
      usedAt: true,
      completedDate: true,
      updatedAt: true,
      score: true,
      scoreTotal: true,
      status: true,
      learner: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          profile: {
            select: {
              companyName: true,
              position: true,
            },
          },
        },
      },
      course: {
        select: {
          name: true,
        },
      },
    },
    where: {
      id: { in: ids },
    },
    orderBy: { completedDate: "asc" },
  });

  let items = [];
  let i = 1;
  for await (const item of lists) {
    const progressDone = await prisma.learnerCourse.aggregate({
      _count: true,
      _sum: { scoreAmount: true },
      where: { learnerCodeId: item.id, status: "DONE", isMain: true },
    });

    const progressTotal = await prisma.learnerCourse.aggregate({
      _count: true,
      where: { learnerCodeId: item.id, isMain: true },
    });

    const progress = (progressDone._count / progressTotal._count) * 100;

    let scoreTotal = 0;
    // if (item.status === "DONE") {
    //   const total = await prisma.learnerQuizAnswer.aggregate({
    //     _count: true,
    //     where: {
    //       learnerCodeId: item.id,
    //     },
    //   });
    //   scoreTotal = total._count;
    // } else {
    const x = await prisma.courseQuizAnswer.groupBy({
      by: ["quizId"],
      _max: {
        no: true,
      },
      // where: {
      //   quiz: {
      //     courseChildId: child.id, // Ensure the relationship exists
      //   },
      // },
    });

    scoreTotal = await x.reduce((acc, cur) => acc + Number(cur._max.no), 0);
    // }

    items.push({
      no: i,
      name: item.learner?.name,
      email: item.learner?.email,
      phoneNumber: item.learner?.phoneNumber,
      companyName: item.learner?.profile?.companyName,
      position: item.learner?.profile?.position,
      courseTitle: item.course?.name,
      dateStarted: item.usedAt,
      dateCompleted: item.completedDate,
      learningProgress: Math.floor(progress),
      latestAccess: item.updatedAt,
      score: item.score === 0 ? progressDone._sum?.scoreAmount : item.score,
      scoreTotal: scoreTotal,
    });
    i++;
  }

  return items;
};

function createRandomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
