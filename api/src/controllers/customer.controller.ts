import { NextFunction, Response } from "express";
import HttpSuccess from "../config/httpSuccess";
import { CustomRequest } from "../interfaces/request.interface";
import {
  getAll,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customer.service";
import { RequestCreateOrg } from "../interfaces/customer.interface";

export const getDataAll = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize, status, keyword, sortBy, descending } = req.query;
    const sortByV = sortBy ? (sortBy as string) : "updatedAt";
    const descendingV = sortBy ? (descending == "true" ? true : false) : true;
    const lists = await getAll(
      Number(page),
      Number(pageSize),
      !status ? undefined : status === "true" ? true : false,
      keyword as string,
      sortByV,
      descendingV,
    );
    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const createData = async (req: RequestCreateOrg, res: Response, next: NextFunction) => {
  try {
    const id = await createCustomer(req);
    res.send(new HttpSuccess(id));
  } catch (error) {
    next(error);
  }
};

export const updateData = async (req: RequestCreateOrg, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await updateCustomer(id, req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const deleteData = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await deleteCustomer(id);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};
