import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
import {
  addTableRequest,
  deleteTableRequest,
  getTableRequest,
  getTableRequests,
  getTableRequestsByTable,
  updateTableRequest,
} from "../controllers/TableRequestsController";

const router = express.Router();

router.get(
  "/table_requests",
  verifyToken,
  verifyPermission(Permissions.Garcom),
  getTableRequests
);
router.get(
  "/tables/:id/table_requests",
  verifyToken,
  verifyPermission(Permissions.Garcom),
  getTableRequestsByTable
);
router.post(
  "/tables/:id/table_requests",
  verifyToken,
  verifyPermission(Permissions.Garcom),
  addTableRequest
);
router.put(
  "/tables/:id/table_requests/:tableRequestId",
  verifyToken,
  verifyPermission(Permissions.Garcom),
  updateTableRequest
);
router.delete(
  "/tables/:id/table_requests/:tableRequestId",
  verifyToken,
  verifyPermission(Permissions.Garcom),
  deleteTableRequest
);
router.get(
  "/tables/:id/table_requests/:tableRequestId",
  verifyToken,
  verifyPermission(Permissions.Garcom),
  getTableRequest
);

export default router;
