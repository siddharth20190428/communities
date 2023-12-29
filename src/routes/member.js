const express = require("express");
const { addMember } = require("../controllers/member");

const router = express.Router();

router.post("/", addMember);

module.exports = router;
