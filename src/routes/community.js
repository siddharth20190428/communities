const express = require("express");
const {
  createCommunity,
  getAllCommunities,
} = require("../controllers/community");

const router = express.Router();

router.post("/", createCommunity);
router.get("/", getAllCommunities);

module.exports = router;
