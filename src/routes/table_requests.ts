import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";
import {
  generateTableRequest,
  deleteTableRequest,
  getTableRequest,
  getTableRequests,
  getTableRequestsByTable,
  updateTableRequest,
  approveTableRequest,
  declineTableRequest,
  checkTableRequestToken,
} from "../controllers/TableRequestsController";

const router = express.Router();

router.post(
  "/table_requests/:id/check",
  checkTableRequestToken
);

router.post(
  "/tables/:id/table_requests",
  generateTableRequest
);

router.get(
  "/table_requests",
  verifyToken,
  getTableRequests
);


router.put(
  "/table_requests/:id/approve",
  verifyToken,
  verifyPermission(Permissions.Garcom),
  approveTableRequest
);
router.put(
  "/table_requests/:id/decline",
  verifyToken,
  verifyPermission(Permissions.Garcom),
  declineTableRequest
);

router.get(
  "/tables/:id/table_requests",
  verifyToken,
  getTableRequestsByTable
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
  getTableRequest
);

export default router;
