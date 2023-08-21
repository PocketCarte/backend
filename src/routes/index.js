const express = require("express");
const test = require("./test");

const router = express.Router();

router.use(test);

module.exports = router;