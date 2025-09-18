import { NextFunction, Response } from "express";
import HttpSuccess from "../config/httpSuccess";
import { CustomRequest } from "../interfaces/request.interface";
import {
  courseList,
  courseLists,
  addCourse,
  updateCourse,
  deleteCourse,
  getCurriculumData,
  addCurriculumRoot,
  addCurriculumChild,
  updateCurriculumRoot,
  deleteCurriculumRoot,
  updateCurriculumChild,
  deleteCurriculumChild,
  updateOrdering,
} from "../services/course.service";

export const getList = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const list = await courseList();
    res.send(new HttpSuccess(list));
  } catch (error) {
    next(error);
  }
};

export const getDataAll = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, pageSize, status, keyword, sortBy, descending } = req.query;
    const sortByV = sortBy ? (sortBy as string) : "updatedAt";
    const descendingV = sortBy ? (descending == "true" ? true : false) : true;

    const lists = await courseLists(
      Number(page),
      Number(pageSize),
      !status ? undefined : status === "true" ? true : false,
      keyword as string,
      sortByV,
      descendingV
    );
    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const createData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await addCourse(req);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const updateData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await updateCourse(req);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const deleteData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await deleteCourse(req);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const getCurriculumById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const lists = await getCurriculumData(courseId);
    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const postRoot = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await addCurriculumRoot(req);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const putRoot = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await updateCurriculumRoot(req);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const deleteRoot = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await deleteCurriculumRoot(req);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const postChild = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const lists = await addCurriculumChild(req);
    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const putChild = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await updateCurriculumChild(req);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const deleteChild = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await deleteCurriculumChild(req);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const putOrdering = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await updateOrdering(id);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};
