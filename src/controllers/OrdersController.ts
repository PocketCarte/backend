import { Request, Response } from "express";
import { db } from "../../firebase";
import { Order } from "../models/order";
import { clients } from "../../index";
import { Product } from "src/models/product";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const tablesSnapshot = await db.collection("tables").get();
    let orders: Order[] = [];
    for (const tableDoc of tablesSnapshot.docs) {
      const ordersSnapshot = await tableDoc.ref.collection("orders").get();

      for (const orderDoc of ordersSnapshot.docs) {
        const order: Order = {
          id: orderDoc.id,
          table_id: tableDoc.id,
          table_name: tableDoc.data().name,
          description: orderDoc.data().name,
          product_name: orderDoc.data().product_name,
          product_quantity: orderDoc.data().product_quantity,
          price_unity: orderDoc.data().price_unity,
          price_total: orderDoc.data().price_total,
          status: orderDoc.data().status,
          created_at: orderDoc.data().created_at,
        };
        console.log("orderDoc", orderDoc);
        orders.push(order);
      }
    }

    if(req.params['order_id']){
      const order = orders.filter((ord) => ord.id === req.params['order_id'])[0];

      if(!order){
        return res.status(404).json({ msg: "O pedido não foi encontrado" });
      }

      return order;
    }

    return res.status(200).json(
      orders.sort(function (a, b) {
        return a.created_at < b.created_at
          ? 1
          : a.created_at > b.created_at
          ? -1
          : 0;
      })
    );
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const tablesSnapshot = await db.collection("tables").get();
    let order: Order;
    for (const tableDoc of tablesSnapshot.docs) {
      const orderDoc = await tableDoc.ref.collection("orders").doc(id).get();

      if(orderDoc.exists){
        order = {
          id: orderDoc.id,
          table_id: tableDoc.id,
          table_name: tableDoc.data().name,
          description: orderDoc.data().name,
          product_name: orderDoc.data().product_name,
          product_quantity: orderDoc.data().product_quantity,
          price_unity: orderDoc.data().price_unity,
          price_total: orderDoc.data().price_total,
          status: orderDoc.data().status,
          created_at: orderDoc.data().created_at,
        }
      }

      if(!order){
        return res.status(404).json({ msg: "Pedido não encontrado!" });
      }
    }
    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { table_id, description, product_id, quantity } = req.body;
    const snapshotTable = await db.collection("tables").doc(table_id).get();
    if (!snapshotTable.exists) {
      return res.status(404).json({ msg: "Mesa não encontrada!" });
    }
    const snapshotCategories = await db.collection("categories").get();
    let product: Product;
    for (const docCategory of snapshotCategories.docs) {
      const snapshotProduct = await docCategory.ref
        .collection("products")
        .doc(product_id)
        .get();

      if (snapshotProduct.exists) {
        product = {
          id: product_id,
          category_id: docCategory.id,
          name: snapshotProduct.data().name,
          image: snapshotProduct.data().image,
          price: snapshotProduct.data().price,
        };
      }
    }

    if (!product) {
      return res.status(404).json({ msg: "Produto não encontrado!" });
    }

    await snapshotTable.ref.collection("orders").add({
      description,
      product_name: product.name,
      product_quantity: quantity,
      price_unity: product.price,
      price_total: (product.price * quantity).toFixed(2),
      created_at: new Date().toISOString(),
      status: "pending",
    });
    for (let client of clients) {
      client.emit("refresh_orders");
    }
    return res.status(200).json({ msg: "Pedido criado com sucesso!" });
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const params = {};
    if (req.body["description"]) {
      params["description"] = req.body.description;
    }
    if (req.body["product_id"]) {
      const { product_id, quantity } = req.body;
      const snapshotCategories = await db.collection("categories").get();
      let product: Product;
      for (const docCategory of snapshotCategories.docs) {
        const snapshotProduct = await docCategory.ref
          .collection("products")
          .doc(product_id)
          .get();

        if (snapshotProduct.exists) {
          product = {
            id: product_id,
            category_id: docCategory.id,
            name: snapshotProduct.data().name,
            image: snapshotProduct.data().image,
            price: snapshotProduct.data().price,
          };
        }
      }

      if (!product) {
        return res.status(404).json({ msg: "Produto não encontrado!" });
      }

      params["product_name"] = product.name;
      params["product_quantity"] = quantity;
      params["price_unity"] = product.price;
      params["price_total"] = (product.price * quantity).toFixed(2);
    }
    if (req.body["status"]) {
      params["status"] = req.body.status;
    }
    let updated = false;
    const snapshotTables = await db.collection("tables").get();
    for (const docTable of snapshotTables.docs) {
      const snapshotProduct = await docTable.ref
        .collection("orders")
        .doc(id)
        .get();

      if(snapshotProduct.exists){
        await docTable.ref
        .collection("orders")
        .doc(id)
        .update(params);
        updated = true;
      }
    }

    if(!updated){
      return res.status(404).json({ msg: "Pedido não encontrado." });
    }

    for (let client of clients) {
      client.emit("refresh_orders");
    }
    return res.status(200).json({ msg: "Pedido atualizado com sucesso!" });
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};
