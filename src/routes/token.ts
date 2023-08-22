import express from "express";
import { generate } from "../controllers/TokenController";

const router = express.Router();

router.get('/token', generate)

export default router;