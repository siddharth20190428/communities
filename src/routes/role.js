const express = require("express");
const { createRole } = require("../controllers/role");

const router = express.Router();

router.post("/", createRole);

module.exports = router;
