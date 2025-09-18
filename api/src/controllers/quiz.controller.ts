import { NextFunction, Response } from "express";
import HttpSuccess from "../config/httpSuccess";
import { CustomRequest } from "../interfaces/request.interface";
import {
  createAnswer,
  createQuiz,
  deleteAnswerByQuizId,
  deleteQuizById,
  editQuiz,
  getQuizLists,
  updateAnswer,
} from "../services/quiz.service";
import {
  RequestAnswer,
  RequestCreateQuiz,
  RequestUpdateQuestion,
} from "../interfaces/question.interface";

export const getQuiz = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lists = await getQuizLists(id);
    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const createDataById = async (req: RequestCreateQuiz, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await createQuiz(id, req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const updateData = async (req: RequestUpdateQuestion, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await editQuiz(id, req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const deleteData = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await deleteQuizById(id);
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};

export const postAnswerChoice = async (req: RequestAnswer, res: Response, next: NextFunction) => {
  try {
    await createAnswer(req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const putAnswerChoice = async (req: RequestAnswer, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { no } = req.query;
  try {
    await updateAnswer(id, Number(no), req);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const deleteAnswerChoice = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { no } = req.query;
    const data = await deleteAnswerByQuizId(id, Number(no));
    res.send(new HttpSuccess(data));
  } catch (error) {
    next(error);
  }
};
