import prisma from "../config/prisma";
import { NotFoundError } from "../errors/CustomError";
import { CustomRequest } from "../interfaces/request.interface";

export const courseList = async () => {
  const data = await prisma.course.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
  });
  return data;
};

export const courseLists = async (
  page: number = 1,
  pageSize: number = 10,
  status: boolean = true,
  keyword: string = "",
  sortBy: string = "updatedAt",
  descending: boolean = true
) => {
  const total = await prisma.course.count({
    where: {
      name: {
        contains: keyword,
      },
      description: {
        contains: keyword,
      },
      isActive: status,
    },
  });

  const data = await prisma.course.findMany({
    where: {
      name: {
        contains: keyword,
      },
      description: {
        contains: keyword,
      },
      isActive: status,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { [sortBy]: descending ? "desc" : "asc" },
  });
  const items = await data.map((item) => ({
    ...item,
    // logo: item.logo ? item.logo : "logo-default.png",
  }));
  return { total, items };
};

export const addCourse = async (req: CustomRequest) => {
  const model = await req.body;
  const list = await prisma.course.create({
    data: {
      name: model.name,
      description: model.description,
      createdBy: req.user.id,
      createdAt: new Date(),
      isActive: model.isActive,
    },
  });

  if (!list) {
    throw new NotFoundError(`Failed to create course`);
  }

  return list.id;
};

export const updateCourse = async (req: CustomRequest) => {
  const model = await req.body;

  const list = await prisma.course.update({
    data: {
      name: model.name,
      description: model.description,
      isActive: model.isActive,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    },
    where: {
      id: req.params.id,
    },
  });

  if (!list) {
    throw new NotFoundError(`Failed to update course`);
  }

  return list.id;
};

export const deleteCourse = async (req: CustomRequest) => {
  const data = await prisma.course.delete({
    where: { id: req.params.id },
  });

  return data ? true : false;
};

export const getCurriculumData = async (courseId: string) => {
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

    curriculum.push({
      id: element.id,
      label: element.title,
      description: element.description,
      level: 0,
      ordering: element.ordering,
      isMain: element.isMain,
      children: children.map((child) => {
        return {
          id: child.id,
          label: child.title,
          level: 1,
          description: child.description,
          duration: child.minute,
          isLocked: child.isLocked,
          type: child.type,
          ordering: child.ordering,
        };
      }),
    });
  }

  return curriculum;
};

export const addCurriculumRoot = async (req: CustomRequest) => {
  const model = await req.body;
  const maxOrder = await prisma.courseRoot.findFirst({
    select: { ordering: true },
    orderBy: {
      ordering: "desc",
    },
  });

  const list = await prisma.courseRoot.create({
    data: {
      title: model.label,
      description: model.description,
      createdBy: req.user.id,
      createdAt: new Date(),
      courseId: model.courseId,
      isMain: model.isMain,
      ordering: maxOrder ? maxOrder.ordering + 1 : 1,
    },
  });

  if (!list) {
    throw new NotFoundError(`Failed to create course curriculum`);
  }

  return list.id;
};

export const updateCurriculumRoot = async (req: CustomRequest) => {
  const model = await req.body;

  const list = await prisma.courseRoot.update({
    data: {
      title: model.label,
      description: model.description,
      isMain: model.isMain,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    },
    where: {
      id: req.params.id,
    },
  });

  if (!list) {
    throw new NotFoundError(`Failed to update course curriculum`);
  }

  return list.id;
};

export const deleteCurriculumRoot = async (req: CustomRequest) => {
  const data = await prisma.courseRoot.delete({
    where: { id: req.params.id },
  });

  return data ? true : false;
};

export const addCurriculumChild = async (req: CustomRequest) => {
  const model = await req.body;

  let maxOrder = model.ordering ? Number(model.ordering) : 0;
  if (!model.ordering || model.ordering === 0) {
    const maxOrderResult = await prisma.courseChild.findFirst({
      select: { ordering: true, isMain: true },
      orderBy: {
        ordering: "desc",
      },
    });

    maxOrder = maxOrderResult ? maxOrderResult.ordering + 1 : 1;
  }

  const list = await prisma.courseChild.create({
    data: {
      title: model.label,
      description: model.description,
      type: model.type,
      minute: model.minute,
      isLocked: model.isLocked,
      createdBy: req.user.id,
      createdAt: new Date(),
      courseRootId: model.courseRootId,
      ordering: maxOrder,
      isMain: model.isMain,
    },
  });

  if (!list) {
    throw new NotFoundError(`Failed to create course curriculum`);
  }

  return list.id;
};

export const updateCurriculumChild = async (req: CustomRequest) => {
  const model = await req.body;

  const list = await prisma.courseChild.update({
    data: {
      title: model.label,
      description: model.description,
      type: model.type,
      minute: model.minute,
      isLocked: model.isLocked,
      updatedBy: req.user.id,
      updatedAt: new Date(),
      ordering: Number(model.ordering),
      isMain: model.isMain,
    },
    where: {
      id: req.params.id,
    },
  });

  if (!list) {
    throw new NotFoundError(`Failed to create course curriculum`);
  }

  return list.id;
};

export const deleteCurriculumChild = async (req: CustomRequest) => {
  await prisma.courseContent.deleteMany({
    where: { courseChildId: req.params.id },
  });
  const data = await prisma.courseChild.delete({
    where: { id: req.params.id },
  });

  return data ? true : false;
};

export const updateOrdering = async (courseId: string) => {
  const lists = await prisma.courseRoot.findMany({
    select: { id: true },
    where: { courseId },
    orderBy: [{ ordering: "asc" }],
  });

  let i = 1;

  for await (const item of lists) {
    const courseChild = await prisma.courseChild.findMany({
      where: { courseRootId: item.id },
      orderBy: { ordering: "asc" },
    });
    for await (const child of courseChild) {
      await prisma.courseChild.update({
        data: {
          ordering: i,
        },
        where: {
          id: child.id,
        },
      });
      i++;
    }
  }
  return true;
};
