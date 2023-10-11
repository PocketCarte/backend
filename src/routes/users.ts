import express from "express";
import { createUser, deleteUser, getUsers, getUser, updateUser, loadUser } from "../controllers/UsersController";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyBodyUser } from "../middlewares/UsersMiddleware";
import { verifyPermission } from "../middlewares/PermissionMiddleware";
import { Permissions } from "../models/permissions";

const router = express.Router();

router.get('/user', verifyToken, loadUser);

router.get('/users', verifyToken, verifyPermission(Permissions.Administrador), getUsers)
router.get('/users/:id', verifyToken, getUser)
router.post('/users', verifyToken, verifyPermission(Permissions.Administrador), verifyBodyUser, createUser)
router.put('/users/:id', verifyToken, verifyPermission(Permissions.Administrador), verifyBodyUser, updateUser)
router.delete('/users/:id', verifyToken, verifyPermission(Permissions.Administrador), deleteUser)

export default router;