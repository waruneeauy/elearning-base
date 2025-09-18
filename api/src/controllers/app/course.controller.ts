import { NextFunction, Response } from "express";
import HttpSuccess from "../../config/httpSuccess";
import { CustomRequest } from "../../interfaces/request.interface";
import {
  courseGetById,
  courseLists,
  myCourseLists,
  myRanking,
  viewVideo,
} from "../../services/app/course.service";

export const getCourseLists = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const lists = await courseLists();

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const getMyCourseLists = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const lists = await myCourseLists(req.user.id);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const getCourseDataById = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lists = await courseGetById(id);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const getRank = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const lists = await myRanking(req.user.id);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const putViewVideo = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const lists = await viewVideo(id, userId);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};
