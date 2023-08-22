import express from "express";
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/CategoriesController"

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:id", getCategory);
router.post("/categories", addCategory);
router.delete("/categories/:id", deleteCategory);
router.put("/categories/:id", updateCategory);

export default router;
