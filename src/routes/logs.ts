import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
const router = express.Router();

router.get('/logs', verifyToken, verifyPermission(Permissions.Administrador));
router.get('/logs/:id', verifyToken, verifyPermission(Permissions.Administrador));

export default router;