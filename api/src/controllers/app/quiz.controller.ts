import { NextFunction, Response } from "express";
import HttpSuccess from "../../config/httpSuccess";
import { CustomRequest } from "../../interfaces/request.interface";
import { quizLists, saveQuiz, saveQuizGroup } from "../../services/app/quiz.service";

export const getQuiz = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { courseChildId, learnerCodeId } = req.params;
    const lists = await quizLists(courseChildId, learnerCodeId);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const postQuiz = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { result } = req.body;
    const lists = await saveQuiz(req.user.id, result);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const postQuizGroup = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { result } = req.body;
    const lists = await saveQuizGroup(req.user.id, result);

    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};
