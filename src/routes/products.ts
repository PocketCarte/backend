import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
import { getProducts, getProductsByCategory, getProductByCategoryAndProductId, addProduct, updateProduct, deleteProduct } from "../controllers/ProductsController";
import { upload } from "../utils/uploader"; 
const router = express.Router();

router.get('/categories/:id/products', getProductsByCategory);
router.post('/categories/:id/products', verifyToken, verifyPermission(Permissions.Gerente), upload.single("image"), addProduct);
router.get('/categories/:id/products/:productId', getProductByCategoryAndProductId);
router.put('/categories/:id/products/:productId', verifyToken, verifyPermission(Permissions.Gerente), upload.single("image"), updateProduct);
router.delete('/categories/:id/products/:productId', verifyToken, verifyPermission(Permissions.Gerente), deleteProduct);
router.get('/products', verifyToken, verifyPermission(Permissions.Gerente), getProducts);

export default router;