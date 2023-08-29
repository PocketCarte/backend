import { Request, Response } from "express";
import { db } from "../../firebase";
import { Product } from "../models/product";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const snapshotCategories = await db.collection("categories").get();
    let products: Product[] = [];
    for (const docCategory of snapshotCategories.docs) {
      const snapshotProducts = await docCategory.ref
        .collection("products")
        .get();

      for (const docProducts of snapshotProducts.docs) {
        const product: Product = {
          id: docProducts.id,
          category_id: docCategory.id,
          name: docProducts.data().name,
          price: docProducts.data().price,
          image: docProducts.data().image,
        };
        products.push(product);
      }
    }
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snapshotCategory = await db.collection("categories").doc(id).get();
    const snapshotProducts = await snapshotCategory.ref
      .collection("products")
      .get();
    let products: Product[] = [];
    for (const docProducts of snapshotProducts.docs) {
      const product: Product = {
        id: docProducts.id,
        category_id: snapshotCategory.id,
        name: docProducts.data().name,
        price: docProducts.data().price,
        image: docProducts.data().image,
      };
      products.push(product);
    }
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const getProductByCategoryAndProductId = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, productId } = req.params;
    const snapshotCategory = await db.collection("categories").doc(id).get();
    const snapshotProducts = await snapshotCategory.ref
      .collection("products")
      .doc(productId)
      .get();
    let product: Product = {
      id: snapshotProducts.id,
      category_id: snapshotCategory.id,
      name: snapshotProducts.data().name,
      price: snapshotProducts.data().price,
      image: snapshotProducts.data().image,
    };
    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};
