import express from "express";
import { createUser, deleteUser, getUsers, getUser, updateUser } from "../controllers/UsersController";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { verifyBodyUser } from "../middlewares/UsersMiddleware";

const router = express.Router();

router.get('/users', verifyToken, getUsers)
router.get('/users/:id', verifyToken, getUser)
router.post('/users', verifyToken, verifyBodyUser, createUser)
router.put('/users/:id', verifyToken, verifyBodyUser, updateUser)
router.delete('/users/:id', verifyToken, deleteUser)

export default router;