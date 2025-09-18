import { NextFunction, Response } from "express";
import HttpSuccess from "../config/httpSuccess";
import { postLogin } from "../services/user.service";
import { RequestLogin } from "../interfaces/user.interface";

export const login = async (req: RequestLogin, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const token = await postLogin(email, password);

    // res.cookie("access_token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Only set secure in production
    //   sameSite: "strict", // Prevent CSRF
    //   maxAge: 3600 * 24000, // 24 hour
    // });
    res.send(new HttpSuccess(token));
  } catch (error) {
    next(error);
  }
};
