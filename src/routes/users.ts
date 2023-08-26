import express from "express";
import { createUser, deleteUser, getUsers, getUser, updateUser } from "../controllers/UsersController";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyBodyUser } from "../middlewares/UsersMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";

const router = express.Router();

router.get('/users', verifyToken, verifyPermission(Permissions.Gerente), getUsers)
router.get('/users/:id', verifyToken, getUser)
router.post('/users', verifyToken, verifyPermission(Permissions.Gerente), verifyBodyUser, createUser)
router.put('/users/:id', verifyToken, verifyPermission(Permissions.Gerente), verifyBodyUser, updateUser)
router.delete('/users/:id', verifyToken, verifyPermission(Permissions.Gerente), deleteUser)

export default router;