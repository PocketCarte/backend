import { NextFunction, Request, Response } from "express";

export const verifyBodyUser = (req: Request, res: Response, next: NextFunction) => {
    const { name, permission } = req.body;
    if(!name){
        return res.status(404).json({ msg: "O campo 'name' é necessário" });
    }
    if(!permission){
        return res.status(404).json({ msg: "O campo 'permission' é necessário" });
    }

    next();
}