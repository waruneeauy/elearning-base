import { NextFunction, Response } from "express";
import HttpSuccess from "../config/httpSuccess";
import {
  createUser,
  getUserAll,
  getUserById,
  updateUser,
  deleteUser,
  resetPass,
} from "../services/user.service";
import { RequestCreateUser } from "../interfaces/user.interface";
import { CustomRequest } from "../interfaces/request.interface";
import { updateDate } from "../services/customerUser.service";

export const getDataAll = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize, keyword, sortBy, descending } = req.query;
    const sortByV = sortBy ? (sortBy as string) : "updatedAt";
    const descendingV = sortBy ? (descending == "true" ? true : false) : true;

    const users = await getUserAll(
      Number(page),
      Number(pageSize),
      keyword as string,
      sortByV,
      descendingV,
    );
    res.send(new HttpSuccess(users));
  } catch (error) {
    next(error);
  }
};

export const updateData = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await resetPass(id, req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const getDataById = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    res.send(new HttpSuccess(user));
  } catch (error) {
    next(error);
  }
};

export const createData = async (req: RequestCreateUser, res: Response, next: NextFunction) => {
  try {
    await createUser(req.body);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const putDateExp = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await updateDate(id, req.body);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const changeData = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  res.send(`Change status user with ID ${id}`);
};

export const deleteData = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};
