import { NextFunction, Request, Response } from "express";
import { db } from "../../firebase";
import jwt_decode from "jwt-decode";

export const verifyPermission = (permissionRequired: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization'];
        const decoded: any = await jwt_decode(token);
        const user = await db.collection("users").doc(decoded.user_id).get();
        const { permission } = user.data();
        
        if(permissionRequired < permission){
            return res.status(401).json({ msg: "Você não possui permissão para fazer esta requisição." });
        }
    
        next();
    } catch (error: any) {
        return res.status(400).json({ msg: "Ocorreu um erro ao verificar sua permissão.", debug: error });
    }
  };
};