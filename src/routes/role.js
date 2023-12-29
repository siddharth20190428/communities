const express = require("express");
const { createRole, getAllRoles } = require("../controllers/role");

const router = express.Router();

router.post("/", createRole);
router.get("/", getAllRoles);

module.exports = router;
