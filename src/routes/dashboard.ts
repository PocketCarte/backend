import express from "express";
import { verifyToken } from "../middlewares/TokenMiddleware";
import { getDashboardData } from "../controllers/DashboardController";
const router = express.Router();

router.get('/dashboard', verifyToken, getDashboardData);

export default router;