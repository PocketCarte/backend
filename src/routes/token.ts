import express from "express";
import { check, generate } from "../controllers/TokenController";

const router = express.Router();

router.post('/token', generate)
router.get('/token/check', check)

export default router;