import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/CustomError";
import { CustomRequest } from "../interfaces/request.interface";

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY ?? "defaultSecretKey");
    req.user = decoded;

    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};

export const authenticateJWTUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_CLIENT ?? "defaultSecretClientKey");
    req.user = decoded;

    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};
