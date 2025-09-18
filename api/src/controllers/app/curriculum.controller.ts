import { getCurriculumProcess } from "./../../services/app/curriculum.service";
import { NextFunction, Response } from "express";
import HttpSuccess from "../../config/httpSuccess";
import { CustomRequest } from "../../interfaces/request.interface";
import {
  getCurriculum,
  getMyCurriculum,
  getById,
  postComplete,
  getMyCurriculumStatus,
  getScoreData,
} from "../../services/app/curriculum.service";

export const curriculumList = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const lists = await getCurriculum();

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const myCurriculumList = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const learnerId = req.user.id;
    const lists = await getMyCurriculum(learnerId, courseId);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const myCurriculumStatus = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const learnerId = req.user.id;
    const lists = await getMyCurriculumStatus(learnerId, courseId);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const getMyCurriculumProcess = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { learnerCodeId } = req.params;
    const learnerId = req.user.id;
    const lists = await getCurriculumProcess(learnerId, learnerCodeId);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const getCurriculumById = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { courseChildId, learnerCodeId } = req.params;

    const lists = await getById(courseChildId, learnerCodeId, req.user.id);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const postCurriculumComplete = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { courseChildId, learnerCodeId } = req.params;
    const data = await postComplete(courseChildId, learnerCodeId);

    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const getScore = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { courseChildId, learnerCodeId } = req.params;
    const data = await getScoreData(courseChildId, learnerCodeId);

    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};
