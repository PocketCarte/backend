import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
import { addOrder, getOrders, updateOrder } from "../controllers/OrdersController";
import { verifySystemToken } from "../middlewares/SystemTokenMiddleware";
const router = express.Router();

router.post('/new_order', verifySystemToken, addOrder);

router.post('/orders', verifyToken, verifyPermission(Permissions.Cozinha), addOrder);
router.put('/orders/:id', verifyToken, verifyPermission(Permissions.Cozinha), updateOrder);
router.get('/orders', verifyToken, verifyPermission(Permissions.Cozinha), getOrders);
router.get('/orders/:id', verifyToken, verifyPermission(Permissions.Cozinha), getOrders);

export default router;