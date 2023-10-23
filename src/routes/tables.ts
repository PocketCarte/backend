import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
import {
  addTable,
  deleteTable,
  finishTable,
  getTable,
  getTables,
  updateTable,
} from "../controllers/TableController";

const router = express.Router();

router.get(
  "/tables",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  getTables
);
router.get(
  "/tables/:id",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  getTable
);
router.post(
  "/tables",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  addTable
);
router.delete(
  "/tables/:id",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  deleteTable
);
router.put(
  "/tables/:id",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  updateTable
);
router.post(
  "/tables/:id/finish",
  verifyToken,
  verifyPermission(Permissions.Gerente),
  finishTable
);

export default router;
