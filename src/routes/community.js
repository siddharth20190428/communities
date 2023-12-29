const express = require("express");
const { createCommunity } = require("../controllers/community");

const router = express.Router();

router.post("/", createCommunity);

module.exports = router;
