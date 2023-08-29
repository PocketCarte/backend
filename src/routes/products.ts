import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
import { getProducts, getProductsByCategory, getProductByCategoryAndProductId, addProduct, updateProduct, deleteProduct } from "../controllers/ProductsController";
const router = express.Router();

router.get('/categories/:id/products', verifyToken, verifyPermission(Permissions.Gerente), getProductsByCategory);
router.post('/categories/:id/products', verifyToken, verifyPermission(Permissions.Gerente), addProduct);
router.get('/categories/:id/products/:productId', verifyToken, verifyPermission(Permissions.Gerente), getProductByCategoryAndProductId);
router.put('/categories/:id/products/:productId', verifyToken, verifyPermission(Permissions.Gerente), updateProduct);
router.delete('/categories/:id/products/:productId', verifyToken, verifyPermission(Permissions.Gerente), deleteProduct);
router.get('/products', verifyToken, verifyPermission(Permissions.Gerente), getProducts);

export default router;