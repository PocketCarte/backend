import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
import { getProducts, getProductsByCategory, getProductByCategoryAndProductId } from "../controllers/ProductsController";
const router = express.Router();

router.get('/category/:id/products', verifyToken, verifyPermission(Permissions.Gerente), getProductsByCategory);
router.get('/category/:id/products/:productId', verifyToken, verifyPermission(Permissions.Gerente), getProductByCategoryAndProductId);
router.get('/products', verifyToken, verifyPermission(Permissions.Gerente), getProducts);

export default router;