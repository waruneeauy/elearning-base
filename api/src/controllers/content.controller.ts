import { NextFunction, Response } from "express";
import HttpSuccess from "../config/httpSuccess";
import { CustomRequest } from "../interfaces/request.interface";
import { getContentData, createContent, editContent } from "../services/content.service";
import { RequestContent } from "../interfaces/question.interface";

export const getDataById = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lists = await getContentData(id);
    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const createDataById = async (req: RequestContent, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await createContent(id, req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const updateData = async (req: RequestContent, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await editContent(id, req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};
