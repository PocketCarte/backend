import express from "express";
import categories from "./categories";
import test from "./test";
import token from "./token";
import users from "./users";

const router = express.Router();

router.use(test);
router.use(categories);
router.use(token);
router.use(users);

export default router;
