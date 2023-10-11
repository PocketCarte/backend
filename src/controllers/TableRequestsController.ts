import { Request, Response } from "express";
import { db } from "../../firebase";
import { TableRequest } from "../models/table_request";

export const getTableRequests = async (req: Request, res: Response) => {
  try {
    const snapshotTables = await db.collection("tables").get();
    let tableRequests: TableRequest[] = [];
    for (const docTable of snapshotTables.docs) {
      const snapshotTableRequests = await docTable.ref
        .collection("requests")
        .get();

      for (const docTableRequests of snapshotTableRequests.docs) {
        const tableRequest: TableRequest = {
          id: docTableRequests.id,
          table_id: docTable.id,
          active: docTableRequests.data().active,
        };
        tableRequests.push(tableRequest);
      }
    }
    return res.status(200).json(tableRequests);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const getTableRequestsByTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snapshotTable = await db.collection("tables").doc(id).get();
    let tableRequests: TableRequest[] = [];
    const snapshotTableRequests = await snapshotTable.ref
      .collection("requests")
      .get();
    for (const docTableRequests of snapshotTableRequests.docs) {
      const tableRequest: TableRequest = {
        id: docTableRequests.id,
        table_id: snapshotTable.id,
        active: docTableRequests.data().active,
      };
      tableRequests.push(tableRequest);
    }
    return res.status(200).json(tableRequests);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const getTableRequest = async (req: Request, res: Response) => {
  try {
    const { id, tableRequestId } = req.params;
    const snapshotTable = await db.collection("tables").doc(id).get();
    const snapshotTableRequest = await snapshotTable.ref
      .collection("requests")
      .doc(tableRequestId)
      .get();
    const tableRequest: TableRequest = {
      id: snapshotTableRequest.id,
      table_id: snapshotTable.id,
      active: snapshotTableRequest.data().active,
    };
    return res.status(200).json(tableRequest);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const addTableRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tableRequest: TableRequest = {
      active: false,
    };
    const snapshotTableRequest = await db
      .collection("tables")
      .doc(id)
      .collection("requests")
      .add(tableRequest);

    return res.status(200).json({ snapshotTableRequest });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const updateTableRequest = async (req: Request, res: Response) => {
  try {
    const { id, tableRequestId } = req.params;
    const { active } = req.params;
    const tableRequest: TableRequest = {
      active: !!active,
    };
    const snapshotTableRequest = await db
      .collection("tables")
      .doc(id)
      .collection("requests")
      .doc(tableRequestId)
      .update(tableRequest);

    return res.status(200).json({ snapshotTableRequest });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const deleteTableRequest = async (req: Request, res: Response) => {
  try {
    const { id, tableRequestId } = req.params;
    const snapshotTableRequest = await db
      .collection("tables")
      .doc(id)
      .collection("requests")
      .doc(tableRequestId)
      .delete();

    return res.status(200).json({ snapshotTableRequest });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};
