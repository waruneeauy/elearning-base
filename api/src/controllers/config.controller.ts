import { NextFunction, Response } from "express";
import HttpSuccess from "../config/httpSuccess";
import { CustomRequest } from "../interfaces/request.interface";
import { getAll, updateConfig } from "../services/config.service";
import { RequestCreateConfig } from "../interfaces/config.interface";

export const getLists = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const lists = await getAll();
    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const createData = async (req: RequestCreateConfig, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await updateConfig(id, req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};
