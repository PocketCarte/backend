import express from "express";
import categories from "./categories";
import test from "./test";
import token from "./token";
import users from "./users";
import logs from "./logs";
import products from "./products";
import tables from "./tables";
import orders from "./orders";
import table_requests from "./table_requests";
import dashboard from "./dashboard";

const router = express.Router();

router.use(test);
router.use(categories);
router.use(token);
router.use(users);
router.use(logs);
router.use(products);
router.use(tables);
router.use(orders);
router.use(table_requests);
router.use(dashboard);

export default router;
