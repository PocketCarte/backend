import { NextFunction, Request, Response } from "express";
import { auth } from "../../firebase";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const regex = /Bearer (.+)/i;

  try {
    const idToken = req.headers['authorization'].match(regex)?.[1];
    const token = await auth.verifyIdToken(idToken);
    next();
  } catch (error: any) {
    return res.status(401).json({ msg: "Token inválido.", error });
  }
};
