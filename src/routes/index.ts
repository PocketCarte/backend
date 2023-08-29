import express from "express";
import categories from "./categories";
import test from "./test";
import token from "./token";
import users from "./users";
import logs from "./logs";
import products from "./products";

const router = express.Router();

router.use(test);
router.use(categories);
router.use(token);
router.use(users);
router.use(logs);
router.use(products);

export default router;
