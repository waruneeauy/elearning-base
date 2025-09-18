import { NextFunction, Response } from "express";
import HttpSuccess from "../../config/httpSuccess";
import {
  postLogin,
  postSignup,
  getProfile,
  updateAccount,
  submitCode,
  changePassword,
  changePhoto,
} from "../../services/app/account.service";
import { RequestLogin } from "../../interfaces/user.interface";
import {
  RequestChangePassword,
  RequestChangePhoto,
  RequestCreateAccount,
  RequestUpdateAccount,
} from "../../interfaces/app/account.interface";
import { CustomRequest } from "../../interfaces/request.interface";

export const signup = async (req: RequestCreateAccount, res: Response, next: NextFunction) => {
  try {
    const token = await postSignup(req.body);

    // res.cookie("access_token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Only set secure in production
    //   sameSite: "strict", // Prevent CSRF
    //   maxAge: 24 * 60 * 60 * 1000, // Cookie will last for 1 day
    // });
    res.send(new HttpSuccess(token));
  } catch (error) {
    next(error);
  }
};

export const signin = async (req: RequestLogin, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const token = await postLogin(email, password);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure in production
      sameSite: "strict", // Prevent CSRF
      maxAge: 24 * 60 * 60 * 1000, // Cookie will last for 1 day
    });
    res.send(new HttpSuccess(token));
  } catch (error) {
    next(error);
  }
};

export const profile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await getProfile(req);
    res.send(new HttpSuccess(profile));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: RequestUpdateAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await updateAccount(req);
    res.send(new HttpSuccess(profile));
  } catch (error) {
    next(error);
  }
};

export const postSubmitCode = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { code, courseId } = req.body;
    const userId = req.user.id;
    await submitCode(code, courseId, userId);
    res.send(new HttpSuccess());
  } catch (error) {
    next(error);
  }
};

export const putChangePassword = async (
  req: RequestChangePassword,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;
    const lists = await changePassword(data, req.user.id);
    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};

export const updatePhoto = async (req: RequestChangePhoto, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const lists = await changePhoto(data, req.user.id);
    res.send(new HttpSuccess(lists));
  } catch (error) {
    next(error);
  }
};
