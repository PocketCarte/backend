import { Request, Response } from "express";
import { Log } from "../models/logs";
import { db } from "../../firebase";
import jwt_decode from "jwt-decode";

export const getLogs = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("logs").get();
    const logs: Log[] = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        user_id: doc.data().user_id,
        description: doc.data().description,
        created_at: doc.data().created_at,
      };
    });
    return res.status(200).json(logs);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const getLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snapshot = await db.collection("logs").doc(id).get();
    const log: Log = {
      id: snapshot.id,
      user_id: snapshot.data().user_id,
      description: snapshot.data().description,
      created_at: snapshot.data().created_at,
    };
    return res.status(200).json(log);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar o log" });
  }
};

export const generateLog = async (req: Request, description: string): Promise<string> => {
  try {
    const token = req.headers['authorization'];
    const decoded: any = await jwt_decode(token);

    const createdLog = await db.collection("logs").add({
        user_id: decoded.user_id,
        description,
        created_at: new Date().toLocaleString()
    });
    return createdLog.id;
  } catch (error: any) {
    return null;
  }
};
