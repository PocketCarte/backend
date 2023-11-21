import { NextFunction, Request, Response } from "express";
import { auth, db } from "../../firebase";
import { TableRequest } from "src/models/table_request";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET || "adasdasa";

export const verifySystemToken = async (req: Request, res: Response, next: NextFunction) => {
  const regex = /Bearer (.+)/i;
  try {
    const id = req.headers['authorization'].match(regex)?.[1];

    try {
      jwt.verify(id, SECRET);
    } catch (error) {
      return res.status(401).json({ msg: "Token inválido" });
    }

    const snapshotTables = await db.collection("tables").get();
    let tableRequest: TableRequest;
    for (const docTable of snapshotTables.docs) {
      const snapshotTableRequests = await docTable.ref
        .collection("requests")
        .get();

      for (const docTableRequests of snapshotTableRequests.docs) {
        if (docTableRequests.data().token === id) {
          const tr: TableRequest = {
            id: docTableRequests.id,
            table_id: docTable.id,
            token: docTableRequests.data().token,
            active: docTableRequests.data().active,
          };

          tableRequest = tr;
        }
      }
    }

    if (!tableRequest) {
      return res.status(404).json({ msg: "Requisição de mesa não encontrada." });
    }

    if (!tableRequest.active) {
      return res.status(401).json({ msg: "Token não está ativo" });
    }

    next();
  } catch (error: any) {
    return res.status(400).json({ msg: "Token inválido" });
  }
};
