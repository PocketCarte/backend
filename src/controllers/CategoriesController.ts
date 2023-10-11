import { Category } from "src/models/category";
import { Request, Response } from "express";
import { db } from "../../firebase";
import { generateLog } from "./LogsController";

export const getCategories = async (req: Request, res: Response) => {
  const snapshot = await db.collection("categories").orderBy('order', 'asc').get();
  const categories: Category[] = snapshot.docs.map((doc) => {
    const { name, products, order } = doc.data();
    return { id: doc.id, name, products, order };
  });

  generateLog(req, `get categories`);
  return res.status(200).json(categories);
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const snapshot = await db.collection("categories").doc(id).get();
    const { name, order } = snapshot.data();
    const category: Category = { id: snapshot.id, name, order };

    generateLog(req, `get category ${id}`);
    return res.status(200).json(category);
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const category: Category = req.body;
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
  try {
    const category: Category = req.body;
    const categorySnapshot = await db
      .collection("categories")
      .doc(id)
      .update(category);

    generateLog(req, `updated category ${id}`);
    return res.status(200).json({ categorySnapshot });
  } catch (error: any) {
    return res.status(400).json({ error });
  }
};
