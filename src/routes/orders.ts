import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
import { addOrder, getOrders, updateOrder } from "../controllers/OrdersController";
import { verifySystemToken } from "../middlewares/SystemTokenMiddleware";
const router = express.Router();

router.post('/new_order', verifySystemToken, addOrder);

router.post('/orders', verifyToken, verifyPermission(Permissions.Garcom), addOrder);
router.put('/orders/:id', verifyToken, verifyPermission(Permissions.Garcom), updateOrder);
router.get('/orders', verifyToken, verifyPermission(Permissions.Garcom), getOrders);
router.get('/orders/:id', verifyToken, verifyPermission(Permissions.Garcom), getOrders);

export default router;