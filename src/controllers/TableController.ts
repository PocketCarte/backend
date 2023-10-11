import { Request, Response } from "express";
import { db } from "../../firebase";
import { generateLog } from "./LogsController";
import { Table } from "../models/table";
import qrcode from "qrcode";

export const getTables = async (req: Request, res: Response) => {
  const snapshot = await db.collection("tables").get();
  const tables: Table[] = snapshot.docs.map((doc) => {
    const { name, qr_code, status } = doc.data();
    return { id: doc.id, name, qr_code, status };
  });

  generateLog(req, `get tables`);
  return res.status(200).json(tables);
};

export const getTable = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const snapshot = await db.collection("tables").doc(id).get();
    const { name, qr_code, status } = snapshot.data();
    const table: Table = {
      id: snapshot.id,
      name,
      qr_code,
      status,
    };

    generateLog(req, `get table ${id}`);
    return res.status(200).json(table);
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const addTable = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const table: Table = {
      status: 0,
      name,
      qr_code: ''
    };
    const tableSnapshot = await db.collection("tables").add(table);
    const qr_code = await qrcode.toDataURL(`http://localhost:4200/tables/${tableSnapshot.id}`);
    await db.collection("tables").doc(tableSnapshot.id).update({
      qr_code
    })

    generateLog(req, `added table ${tableSnapshot.id}`);
    return res.status(200).json({ tableSnapshot });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const deleteTable = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tableSnapshot = await db.collection("tables").doc(id).delete();

    generateLog(req, `deleted table ${id}`);
    return res.status(200).json({ tableSnapshot });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const updateTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, name } = req.body;
    const table: Table = {
      status,
      name,
    };
    const tableSnapshot = await db
      .collection("tables")
      .doc(id)
      .update(table);

    generateLog(req, `updated table ${id}`);
    return res.status(200).json({ tableSnapshot });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};
