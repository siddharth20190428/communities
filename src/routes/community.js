const express = require("express");
const {
  createCommunity,
  getAllCommunities,
  getAllMembers,
} = require("../controllers/community");

const router = express.Router();

router.post("/", createCommunity);
router.get("/", getAllCommunities);
router.get("/:id/members", getAllMembers);

module.exports = router;
