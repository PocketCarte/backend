import express from "express";
import categories from "./categories";
import test from "./test";
import token from "./token";
import users from "./users";
import logs from "./logs";

const router = express.Router();

router.use(test);
router.use(categories);
router.use(token);
router.use(users);
router.use(logs);

export default router;
