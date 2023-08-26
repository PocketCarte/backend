import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
import { getLogs, getLog } from "../controllers/LogsController";
const router = express.Router();

router.get('/logs', verifyToken, verifyPermission(Permissions.Administrador), getLogs);
router.get('/logs/:id', verifyToken, verifyPermission(Permissions.Administrador), getLog);

export default router;