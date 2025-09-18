import prisma from "../../config/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  ChangePassword,
  ChangePhoto,
  CreateAccount,
  RequestUpdateAccount,
} from "../../interfaces/app/account.interface";
import { NotFoundError } from "../../errors/CustomError";
import { CustomRequest } from "../../interfaces/request.interface";

export const getProfile = async (req: CustomRequest) => {
  const user = await prisma.learnerUser.findFirst({
    select: {
      email: true,
      name: true,
      phoneNumber: true,
      photo: true,
      profile: {
        select: {
          birthday: true,
          gender: true,
          position: true,
          address: true,
          companyName: true,
        },
      },
    },
    where: {
      learnerId: req.user.id,
    },
  });

  if (!user) {
    throw new NotFoundError(`User with ID ${req.user.id} not found`);
  }

  return user;
};

export const postSignup = async (data: CreateAccount) => {
  const check = await prisma.learnerUser.findFirst({
    where: { email: data.email },
  });
  if (check) throw new Error(`Email already registered!`);

  const checkLengthPassword = data.password ? data.password.length >= 6 : 0;
  if (!checkLengthPassword) throw new Error(`Password must be at least 6 characters long!`);

  const hashPass = await (data.password ? hashPassword(data.password) : "social");
  const totolUser = await prisma.learnerUser.count();
  const user = await prisma.learnerUser.create({
    data: {
      email: data.email,
      password: hashPass,
      name: data.name,
      phoneNumber: data.phoneNumber,
      userNo: totolUser + 1,
      profile: {
        create: {
          position: data?.position,
          companyName: data?.companyName,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError(`Failed to create learner`);
  }

  const token = jwt.sign(
    { id: user.learnerId, username: user.email, name: user.name },
    process.env.SECRET_KEY_CLIENT ?? "defaultSecretClientKey",
    {
      expiresIn: "24h",
    },
  );

  return token;
};

export const updateAccount = async (req: RequestUpdateAccount) => {
  const data = req.body;
  const user = await prisma.learnerUser.update({
    where: {
      learnerId: req.user.id,
    },
    data: {
      // email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      updatedAt: new Date(),
      updatedBy: req.user.id,
      profile: {
        update: {
          birthday: data.profile.birthday ? new Date(data.profile.birthday) : null,
          gender: data.profile.gender ?? "",
          position: data.profile.position,
          address: data.profile.address ?? null,
          companyName: data.profile.companyName,
        },
      },
    },
  });

  return true;
};

// export const deleteUser = async (id: string) => {
//   return await prisma.learnerUser.delete({
//     where: {
//       learnerId: id,
//     },
//   });
// };

export const postLogin = async (email: string, password: string) => {
  const user = await prisma.learnerUser.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) throw new Error(`Invalid username or password`);

  if (!user.password) throw new Error(`Invalid username or password`);
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) throw new Error(`Invalid username or password`);

  const token = jwt.sign(
    { id: user.learnerId, username: user.email, name: user.name },
    process.env.SECRET_KEY_CLIENT ?? "defaultSecretClientKey",
    {
      expiresIn: "24h",
    },
  );

  return token;
};

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 5;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export const submitCode = async (code: string, courseId: string, learnerId: string) => {
  const checkRegisCourse = await prisma.learnerCode.findFirst({
    where: {
      courseId,
      learnerId,
      // status: { in: ["START", "INPROGRESS"] },
    },
  });

  if (
    checkRegisCourse &&
    (checkRegisCourse.status === "START" || checkRegisCourse.status === "INPROGRESS")
  ) {
    throw new Error(`You already registered this course!`);
  }

  const checkIsUsed = await prisma.learnerCode.findFirst({
    where: {
      code,
    },
  });

  if (!checkIsUsed) throw new Error(`This code not found!`);
  if (checkIsUsed.isUsed === true) throw new Error(`This code is already used!`);
  if (checkIsUsed.expiredDate && checkIsUsed.expiredDate < new Date()) {
    throw new Error(`This code is already expired!`);
  }

  // check deadline
  if (
    checkRegisCourse &&
    checkIsUsed &&
    checkRegisCourse.status === "DONE" &&
    checkIsUsed.deadlineDate &&
    checkIsUsed.deadlineDate < new Date()
  ) {
    throw new Error(`This course is not deadline!`);
  }

  await prisma.learnerCode.updateMany({
    where: {
      code,
    },
    data: {
      isUsed: true,
      usedAt: new Date(),
      learnerId,
    },
  });

  const roots = await prisma.courseRoot.findMany({
    where: {
      courseId: checkIsUsed.courseId,
    },
  });

  for (const root of roots) {
    const children = await prisma.courseChild.findMany({
      where: {
        courseRootId: root.id,
      },
    });

    for (const child of children) {
      await prisma.learnerCourse.create({
        data: {
          courseChildId: child.id,
          learnerId,
          learnerCodeId: checkIsUsed.id,
          courseId: root.courseId,
          isLocked: child.isLocked,
          status: !child.isLocked ? "START" : "LOCKED",
          ordering: child.ordering,
          isMain: child.isMain,
        },
      });
    }
  }

  return true;
};

export const changePassword = async (data: ChangePassword, learnerId: string) => {
  const checkLengthPassword = data.password ? data.password.length >= 6 : 0;
  if (!checkLengthPassword) throw new Error(`Password must be at least 6 characters long!`);

  const password = await hashPassword(data.password);

  await prisma.learnerUser.update({
    where: {
      learnerId,
    },
    data: {
      password: password,
      updatedAt: new Date(),
      updatedBy: learnerId,
    },
  });

  return true;
};

export const changePhoto = async (data: ChangePhoto, learnerId: string) => {
  await prisma.learnerUser.update({
    where: {
      learnerId,
    },
    data: {
      photo: data.photo,
      updatedAt: new Date(),
      updatedBy: learnerId,
    },
  });

  return true;
};
