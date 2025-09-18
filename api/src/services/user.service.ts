import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CreateUser } from "../interfaces/user.interface";
import { NotFoundError } from "../errors/CustomError";
import { randomPass } from "../utils/function";
import { CustomRequest } from "../interfaces/request.interface";

export const getUserAll = async (
  page: number = 1,
  pageSize: number = 10,
  keyword: string = "",
  sortBy: string = "updatedAt",
  descending: boolean = true
) => {
  const total = await prisma.learnerUser.count({
    where: {
      OR: [
        {
          email: {
            contains: keyword,
          },
        },
        {
          name: {
            contains: keyword,
          },
        },
        {
          phoneNumber: {
            contains: keyword,
          },
        },
        {
          profile: {
            companyName: {
              contains: keyword,
            },
          },
        },
        {
          profile: {
            position: {
              contains: keyword,
            },
          },
        },
      ],
    },
  });

  const items = await prisma.learnerUser.findMany({
    select: {
      learnerId: true,
      email: true,
      name: true,
      phoneNumber: true,
      pwd: true,
      updatedAt: true,
      profile: true,
    },
    where: {
      OR: [
        {
          email: {
            contains: keyword,
          },
        },
        {
          name: {
            contains: keyword,
          },
        },
        {
          phoneNumber: {
            contains: keyword,
          },
        },
        {
          profile: {
            companyName: {
              contains: keyword,
            },
          },
        },
        {
          profile: {
            position: {
              contains: keyword,
            },
          },
        },
      ],
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy:
      sortBy == "companyName" || sortBy == "position"
        ? {
            profile: {
              [sortBy]: descending ? "desc" : "asc",
            },
          }
        : { [sortBy]: descending ? "desc" : "asc" },
  });

  const userList = await items.map((user) => ({
    learnerId: user.learnerId,
    email: user.email,
    name: user.name,
    pwd: user.pwd,
    updatedAt: user.updatedAt,
    companyName: user.profile?.companyName,
    position: user.profile?.position,
    phoneNumber: user.phoneNumber,
  }));

  return { total, items: userList };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }

  return user;
};

export const createUser = async (data: CreateUser) => {
  const hashPass = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashPass,
      name: data.name,
    },
  });

  if (!user) {
    throw new NotFoundError(`Failed to create user`);
  }

  return user;
};

export const updateUser = async (id: string, data: CreateUser) => {
  const hashPass = await hashPassword(data.password);
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }

  user.email = data.email;
  user.password = hashPass;
  user.name = data.name;
  user.updatedAt = new Date();

  return user;
};

export const resetPass = async (learnerId: string, req: CustomRequest) => {
  const user = await prisma.learnerUser.findFirst({
    where: {
      learnerId,
    },
  });

  if (!user) {
    throw new NotFoundError(`User with ID ${learnerId} not found`);
  }

  const pwd = await randomPass(8);
  const hashPass = await hashPassword(pwd);

  await prisma.learnerUser.update({
    where: {
      learnerId,
    },
    data: {
      pwd: pwd,
      password: hashPass,
      updatedAt: new Date(),
      updatedBy: req.user.id,
    },
  });

  return true;
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
};

export const postLogin = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) throw new Error(`Invalid username or password`);

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) throw new Error(`Invalid username or password`);

  const token = jwt.sign(
    { id: user.id, username: user.email, name: user.name },
    process.env.SECRET_KEY ?? "defaultSecretKey",
    {
      expiresIn: "24h",
    }
  );

  return token;
};

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 15;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
