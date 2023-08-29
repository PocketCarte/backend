import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/CategoriesController";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";

const router = express.Router();

router.get(
  "/categories",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  getCategories
);
router.get(
  "/categories/:id",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  getCategory
);
router.post(
  "/categories",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  addCategory
);
router.delete(
  "/categories/:id",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  deleteCategory
);
router.put(
  "/categories/:id",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  updateCategory
);

export default router;
