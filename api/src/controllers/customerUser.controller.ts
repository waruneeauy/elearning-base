import { NextFunction, Response } from "express";
import HttpSuccess from "../config/httpSuccess";
import {
  generateCode,
  getUserAll,
  deleteUser,
  updateCompleted,
  getVideoDetail,
  getResult,
  updateDate,
} from "../services/customerUser.service";
import { CustomRequest } from "../interfaces/request.interface";
import { RequestUserGenerateCode } from "../interfaces/customer.interface";

export const getByOrgIdAndSetNo = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { customerId, courseId } = req.params;
    const { page, pageSize, status, keyword, sortBy, descending } = req.query;
    const sortByV = sortBy ? (sortBy as string) : "updatedAt";
    const descendingV = sortBy ? (descending == "true" ? true : false) : true;

    const users = await getUserAll(
      customerId,
      courseId,
      Number(page),
      Number(pageSize),
      !status ? undefined : status === "true" ? true : false,
      keyword?.toString() || "",
      sortByV,
      descendingV,
    );
    res.send(new HttpSuccess(users));
  } catch (error) {
    next(error);
  }
};

export const createData = async (
  req: RequestUserGenerateCode,
  res: Response,
  next: NextFunction,
) => {
  try {
    await generateCode(req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
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

export const completed = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    await updateCompleted(req.body.ids, req.user.id);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const getDataById = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const users = await getVideoDetail(id);
    res.send(new HttpSuccess(users));
  } catch (error) {
    next(error);
  }
};

export const postReport = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const data = await getResult(req.body.ids);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const putExpdate = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await updateDate(id, req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};
