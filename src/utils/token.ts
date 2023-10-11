import { Request } from "express";
import jwt_decode from "jwt-decode";

export const getTokenDecoded = async (req: Request) => {
    const regex = /Bearer (.+)/i;
    const token = req.headers['authorization'].match(regex)?.[1];
    const tokenDecoded: any = await jwt_decode(token);
    return tokenDecoded;
}