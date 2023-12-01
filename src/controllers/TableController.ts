import { Request, Response } from "express";
import { db } from "../../firebase";
import { generateLog } from "./LogsController";
import { Table } from "../models/table";
import qrcode from "qrcode";
import { Order } from "src/models/order";

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
    const ordersSnapshot = await snapshot.ref.collection("orders").get();

    let ordersList: Order[] = []
    let canFinish = true;
    let totalPrice = 0;

    for (const orderDoc of ordersSnapshot.docs) {
      const { status, price_total } = orderDoc.data();
      if(status === "pending" || status === "doing"){
        canFinish = false;
      }
      if(status !== "canceled"){
        totalPrice += Number(price_total);
      }
      const order: Order = {
        id: orderDoc.id,
        table_id: snapshot.id,
        table_name: snapshot.data().name,
        description: orderDoc.data().description,
        category_id: orderDoc.data().category_id,
        product_id: orderDoc.data().product_id,
        product_name: orderDoc.data().product_name,
        product_quantity: orderDoc.data().product_quantity,
        price_unity: orderDoc.data().price_unity,
        price_total: Number(orderDoc.data().price_total),
        status: orderDoc.data().status,
        created_at: orderDoc.data().created_at,
      };
      ordersList.push(order);
    }

    const table: Table = {
      id: snapshot.id,
      name,
      qr_code,
      status,
      orders: {
        list: ordersList,
        total_price: totalPrice,
        can_finish: canFinish
      }
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
    const qr_code = await qrcode.toDataURL(`http://192.168.3.13:4200/menu?table_id=${tableSnapshot.id}`);
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

export const finishTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snapshot = await db.collection("tables").doc(id).get();
    const { name, qr_code, status } = snapshot.data();
    const ordersSnapshot = await snapshot.ref.collection("orders").get();
    const requestsSnapshot = await snapshot.ref.collection("requests").get();

    let ordersList: Order[] = []
    let canFinish = true;
    let totalPrice = 0;

    for (const orderDoc of ordersSnapshot.docs) {
      const { status, price_total } = orderDoc.data();
      if(status !== "canceled"){
        totalPrice += parseInt(price_total);
      }
      let order: Order = {
        id: orderDoc.id,
        table_id: snapshot.id,
        table_name: snapshot.data().name,
        category_id: orderDoc.data().category_id,
        product_id: orderDoc.data().product_id,
        product_name: orderDoc.data().product_name,
        product_quantity: orderDoc.data().product_quantity,
        price_unity: orderDoc.data().price_unity,
        price_total: orderDoc.data().price_total,
        status: orderDoc.data().status,
        created_at: orderDoc.data().created_at,
      };
      if(orderDoc.data().description){
        order['description'] = orderDoc.data().description;
      }
      ordersList.push(order);
    }

    const table: Table = {
      id: snapshot.id,
      name,
      qr_code,
      status,
      orders: {
        list: ordersList,
        total_price: totalPrice,
        can_finish: canFinish
      }
    };

    if(!req.body['cancel']){
      await db.collection("tables_finished").add({ finished_at: new Date().toISOString(), ...table })
    }
    await db.collection("tables").doc(id).update({
      status: 0
    })
    for (const orderDoc of ordersSnapshot.docs) {
      orderDoc.ref.delete();
    }

    for (const requestDoc of requestsSnapshot.docs) {
      requestDoc.ref.delete();
    }

    generateLog(req, `get table ${id}`);
    return res.status(200).json({ msg: "Mesa finalizada com sucesso!" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ error });
  }
}
