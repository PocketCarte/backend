import { Category } from "src/models/category";
import { Request, Response } from "express";
import { db } from "../../firebase";
import { generateLog } from "./LogsController";

export const getCategories = async (req: Request, res: Response) => {
  const snapshot = await db.collection("categories").get();
  const categories: Category[] = snapshot.docs.map((doc) => {
    const { name, products } = doc.data();
    return { id: doc.id, name, products };
  });

  generateLog(req, `get categories`);
  return res.status(200).json(categories);
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const snapshot = await db.collection("categories").doc(id).get();
    const { name } = snapshot.data();
    const category: Category = { id: snapshot.id, name };

    generateLog(req, `get category ${id}`);
    return res.status(200).json(category);
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  const category: Category = req.body;
  try {
    const categorySnapshot = await db.collection("categories").add(category);

    generateLog(req, `added category ${categorySnapshot.id}`);
    return res.status(200).json({ categorySnapshot });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const categorySnapshot = await db.collection("categories").doc(id).delete();

    generateLog(req, `deleted category ${id}`);
    return res.status(200).json({ categorySnapshot });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category: Category = req.body;
  try {
    const categorySnapshot = await db
      .collection("categories")
      .doc(id)
      .set(category);

    generateLog(req, `updated category ${id}`);
    return res.status(200).json({ categorySnapshot });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};
