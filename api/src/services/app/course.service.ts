import prisma from "../../config/prisma";
import { NotFoundError } from "../../errors/CustomError";

export const courseLists = async () => {
  const lists = await prisma.course.findMany({
    where: { isActive: true },
    include: { courseRoot: true },
  });
  return lists.map((list) => ({
    id: list.id,
    category: {
      name: "การใช้งานระบบ",
    },
    title: list.name,
    description: list.description,
    authen: "Bangkok Metropolitan Administration",
    lessons: list.courseRoot.length,
  }));
};

export const myCourseLists = async (learnerId: string) => {
  const learnerCodes = await prisma.learnerCode.findMany({
    select: {
      id: true,
      code: true,
      usedAt: true,
      status: true,
      courseId: true,
      score: true,
      scoreTotal: true,
      deadlineDate: true,
      course: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
    orderBy: { usedAt: "desc" },
    where: { learnerId },
  });

  let items: any = [];
  let i = 1;
  for await (const learnerCode of learnerCodes) {
    let scoreAll = 0;
    let scoreFullAll = 0;

    const courseRoots = await prisma.courseRoot.findMany({
      where: { courseId: learnerCode.courseId },
      orderBy: { ordering: "asc" },
    });
    let curriculum = [];
    for (let element of courseRoots) {
      const children = await prisma.courseChild.findMany({
        where: { courseRootId: element.id },
        orderBy: { ordering: "asc" },
      });

      let childs: any = [];
      let totalScore = 0;
      let fullScore = 0;
      for await (const child of children) {
        const learnerChild = await prisma.learnerCourse.findFirst({
          where: {
            courseChildId: child.id,
            learnerCodeId: learnerCode.id,
            learnerId,
          },
        });

        let scoreNow = 0;
        let totalQuiz = 0;
        if (child.type === "QUIZ" && learnerCode.status !== "DONE") {
          // score total
          const x = await prisma.courseQuizAnswer.groupBy({
            by: ["quizId"],
            _max: {
              no: true,
            },
            where: {
              quiz: {
                courseChildId: child.id, // Ensure the relationship exists
              },
            },
          });

          const scoreTotal = await x.reduce(
            (acc, cur) => acc + Number(cur._max.no),
            0
          );

          const childC = await prisma.courseChild.findUnique({
            select: {
              type: true,
              isMain: true,
              courseQuiz: { select: { id: true } },
            },
            where: { id: child.id },
          });
          if (!childC) throw new NotFoundError("Course child not found!");

          const idArr = await childC.courseQuiz.map((item) => item.id);

          const score = await prisma.learnerQuizAnswer.aggregate({
            _sum: { score: true },
            _count: true,
            where: { learnerCodeId: learnerCode.id, quizId: { in: idArr } },
          });
          scoreNow = score._sum.score ?? 0;
          totalQuiz = scoreTotal ?? 0;
        } else if (child.type === "QUIZ" && learnerCode.status == "DONE") {
          const score = await prisma.learnerQuizAnswer.aggregate({
            _sum: { score: true },
            _count: true,
            where: { learnerCodeId: learnerCode.id, courseChildId: child.id },
          });
          scoreNow = score._sum.score ?? 0;
          totalQuiz = score._count ?? 0;
        }

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
          score: scoreNow,
          fullScore: totalQuiz,
        });

        totalScore += scoreNow;
        fullScore += totalQuiz;
      }

      scoreAll += totalScore;
      scoreFullAll += fullScore;
      curriculum.push({
        id: element.id,
        label: element.title,
        description: element.description,
        totatScore: totalScore,
        fullScore: fullScore,
        collapsed: false,
        list: childs,
      });
    }

    const progressDone = await prisma.learnerCourse.aggregate({
      _count: true,
      where: { learnerCodeId: learnerCode.id, status: "DONE", isMain: true },
    });

    const progressTotal = await prisma.learnerCourse.aggregate({
      _count: true,
      where: { learnerCodeId: learnerCode.id, isMain: true },
    });

    const progress = (progressDone._count / progressTotal._count) * 100;

    const currentTimestamp = new Date();
    const deadlineDate = learnerCode.deadlineDate
      ? new Date(learnerCode.deadlineDate)
      : null;
    const isView =
      learnerCode.status !== "DONE"
        ? true
        : i === 1 && deadlineDate && currentTimestamp < deadlineDate
          ? true
          : false;
    items.push({
      learnerCodeId: learnerCode.id,
      status: learnerCode.status,
      category: {
        name: "การใช้งานระบบ",
      },
      usedAt: learnerCode.usedAt,
      title: learnerCode.course.name,
      description: learnerCode.course.description,
      authen: "Bangkok Metropolitan Administration",
      lessons: courseRoots.length,
      score: learnerCode.score === 0 ? scoreAll : learnerCode.score,
      scoreTotal: learnerCode.scoreTotal,
      scoreFullAll,
      isView: isView,
      progress,
      curriculum,
    });

    i++;
  }

  return items;
};

export const courseGetById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: { courseRoot: true },
  });

  if (!course) throw new NotFoundError("Course not found!");
  return {
    id: course.id,
    category: {
      name: "การใช้งานระบบ",
    },
    title: course.name,
    description: course.description,
    authen: "Bangkok Metropolitan Administration",
    lessons: course.courseRoot.length,
  };
};

export const myRanking = async (learnerId: string) => {
  const customer = await prisma.learnerCode.findFirst({
    where: { learnerId },
    select: { customerId: true },
  });
  if (!customer) {
    return [];
  }

  const ranking = await prisma.learnerCode.groupBy({
    by: ["learnerId"],
    _max: { score: true },
    orderBy: { _max: { score: "desc" } },
    where: { customerId: customer.customerId, status: "DONE" }, // , deadlineDate: { gte: new Date() }
    take: 10,
  });

  const detailedRanking = await Promise.all(
    ranking.map(async (r, i) => {
      const learner = await prisma.learnerUser.findUnique({
        where: { learnerId: r.learnerId! },
        select: { name: true, photo: true },
      });
      return {
        rankNo: getOrdinalSuffix(i),
        score: r._max.score,
        learner,
        isYou: r.learnerId === learnerId,
      };
    })
  );

  return detailedRanking;
};

export const viewVideo = async (courseId: string, learnerId: string) => {
  const check = await prisma.learnerCourse.findFirst({
    where: { courseChildId: courseId, learnerId },
  });

  if (check?.startAt === null) {
    await prisma.learnerCourse.updateMany({
      where: { courseChildId: courseId, learnerId },
      data: { startAt: new Date() },
    });
  }

  return true;
};

function getOrdinalSuffix(rank: number): string {
  const ordinals = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
  ];
  return ordinals[rank];
}
