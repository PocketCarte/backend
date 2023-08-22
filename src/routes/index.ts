import express from "express";
// import test from "./test";
import categories from "./categories";

const router = express.Router();

router.use(categories);

export default router;
