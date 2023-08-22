import express from "express";
import categories from "./categories";
import test from "./test";
import token from "./token";

const router = express.Router();

router.use(test);
router.use(categories);
router.use(token);

export default router;
