import express from "express";
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/CategoriesController"
import { verifyToken } from "../middlewares/TokenMiddleware";

const router = express.Router();

router.get("/categories", verifyToken, getCategories);
router.get("/categories/:id", verifyToken, getCategory);
router.post("/categories", verifyToken, addCategory);
router.delete("/categories/:id", verifyToken, deleteCategory);
router.put("/categories/:id", verifyToken, updateCategory);

export default router;
