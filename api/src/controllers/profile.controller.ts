import { NextFunction, Response } from "express";
import HttpSuccess from "../config/httpSuccess";
import { CustomRequest } from "../interfaces/request.interface";

export const getDataAll = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    res.send(new HttpSuccess(req.user));
  } catch (error) {
    next(error);
  }
};
