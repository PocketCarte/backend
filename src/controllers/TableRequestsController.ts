import { Request, Response } from "express";
import { db } from "../../firebase";
import { TableRequest } from "../models/table_request";
import jwt from "jsonwebtoken";
import { clients } from "../../index";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET || "adasdasa";

export const getTableRequests = async (req: Request, res: Response) => {
  try {
    const snapshotTables = await db.collection("tables").get();
    let tableRequests: TableRequest[] = [];
    for (const docTable of snapshotTables.docs) {
      const snapshotTableRequests = await docTable.ref
        .collection("requests")
        .where('active', '!=', true)
        .get();

      for (const docTableRequests of snapshotTableRequests.docs) {
        const tableRequest: TableRequest = {
          id: docTableRequests.id,
          table_id: docTable.id,
          token: docTableRequests.data().token,
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

export const checkTableRequestToken = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      jwt.verify(id, SECRET);
    } catch (error) {
      return res.status(200).json({ logged: false, valid: false, msg: "Token inválido" });
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
      return res.status(200).json({ logged: false, valid: false, msg: "Requisição de mesa não encontrada." });
    }

    if (!tableRequest.active) {
      return res.status(200).json({ logged: true, valid: false, msg: "Token não está ativo" });
    }

    return res
      .status(200)
      .json({ logged: true, valid: true, msg: "Token válido." });
  } catch (error: any) {
    return res.status(200).json({ logged: true, valid: false, msg: "Erro interno ao verificar token" });
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

export const generateTableRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snapshotTable = await db.collection("tables").doc(id).get();
    if (!snapshotTable.exists) {
      return res.status(404).json({ msg: "Mesa não encontrada!" });
    }

    const tableRequest: TableRequest = {
      table_id: id,
      active: false,
    };

    const snapshotTableRequest = await db
      .collection("tables")
      .doc(id)
      .collection("requests")
      .add(tableRequest);

    let token = jwt.sign(
      { id: snapshotTableRequest.id, table_id: id },
      SECRET
    );

    await db
      .collection("tables")
      .doc(id)
      .collection("requests")
      .doc(snapshotTableRequest.id)
      .update({ token });

    for (let client of clients) {
      client.emit("refresh_table_requests");
    }

    const updatedTableRequest = await db
    .collection("tables")
    .doc(id)
    .collection("requests")
    .doc(snapshotTableRequest.id).get()

    const tableRequestUpdated: TableRequest = {
      id: updatedTableRequest.id,
      table_id: snapshotTable.id,
      token: updatedTableRequest.data().token,
      active: updatedTableRequest.data().active,
    };

    return res.status(200).json(tableRequestUpdated);
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const approveTableRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snapshotTables = await db.collection("tables").get();
    let tableRequest: TableRequest;
    for (const docTable of snapshotTables.docs) {
      const snapshotTableRequests = await docTable.ref
        .collection("requests")
        .where('active', '!=', true)
        .get();

      for (const docTableRequests of snapshotTableRequests.docs) {
        if (docTableRequests.id === id) {
          const tr: TableRequest = {
            id: docTableRequests.id,
            table_id: docTable.id,
            active: docTableRequests.data().active,
          };

          tableRequest = tr;
        }
      }
    }

    if (!tableRequest) {
      return res.status(404).json({ msg: "Requisição de mesa não encontrada" });
    }

    await db
      .collection("tables")
      .doc(tableRequest.table_id)
      .collection("requests")
      .doc(tableRequest.id)
      .update({ active: true });

      for (let client of clients) {
        client.emit("refresh_table_requests");
      }

    return res
      .status(200)
      .json({ msg: "Requisição de mesa aprovada com sucesso." });
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const declineTableRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snapshotTables = await db.collection("tables").get();
    let tableRequest: TableRequest;
    for (const docTable of snapshotTables.docs) {
      const snapshotTableRequests = await docTable.ref
        .collection("requests")
        .where('active', '!=', true)
        .get();

      for (const docTableRequests of snapshotTableRequests.docs) {
        if (docTableRequests.id === id) {
          const tr: TableRequest = {
            id: docTableRequests.id,
            table_id: docTable.id,
            active: docTableRequests.data().active,
          };

          tableRequest = tr;
        }
      }
    }

    if (!tableRequest) {
      return res.status(404).json({ msg: "Requisição de mesa não encontrada" });
    }

    await db
      .collection("tables")
      .doc(tableRequest.table_id)
      .collection("requests")
      .doc(tableRequest.id)
      .delete();

      for (let client of clients) {
        client.emit("refresh_table_requests");
      }

    return res
      .status(200)
      .json({ msg: "Requisição de mesa rejeitada com sucesso." });
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const updateTableRequest = async (req: Request, res: Response) => {
  try {
    const { id, tableRequestId } = req.params;
    const { active } = req.params;
    const tableRequest: TableRequest = {
      table_id: id,
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
