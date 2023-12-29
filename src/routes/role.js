const express = require("express");
const { createRole, getAll } = require("../controllers/role");

const router = express.Router();

router.post("/", createRole);
router.get("/", getAll);

module.exports = router;
