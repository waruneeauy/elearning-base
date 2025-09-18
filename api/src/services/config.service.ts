import prisma from "../config/prisma";
import { NotFoundError } from "../errors/CustomError";
import { RequestCreateConfig } from "../interfaces/config.interface";

export const getAll = async () => {
  const lists = await prisma.configData.findMany({ select: { key: true, content: true } });
  return {
    textResult: lists.find((list) => list.key === "RESULT_DESC")?.content,
    testTimeMinute: Number(lists.find((list) => list.key === "TEST_TIME")?.content),
  };
};

export const updateConfig = async (id: string, data: RequestCreateConfig) => {
  const updateResult = await prisma.configData.update({
    where: {
      key: "RESULT_DESC",
    },
    data: {
      content: data.body.textResult,
      updatedBy: data.user.id,
      updatedAt: new Date(),
    },
  });

  if (!updateResult) {
    throw new NotFoundError(`Failed to update config with id RESULT_DESC`);
  }

  const updateTime = await prisma.configData.update({
    where: {
      key: "TEST_TIME",
    },
    data: {
      content: data.body.testTimeMinute.toString(),
      updatedBy: data.user.id,
      updatedAt: new Date(),
    },
  });

  if (!updateTime) {
    throw new NotFoundError(`Failed to update config with id TEST_TIME`);
  }

  return true;
};
