const express = require("express");
const {
  createCommunity,
  getAllCommunities,
  getAllCommunityMembers,
  getAllOwnedCommunities,
} = require("../controllers/community");

const router = express.Router();

router.post("/", createCommunity);
router.get("/", getAllCommunities);
router.get("/:id/members", getAllCommunityMembers);
router.get("/me/owner", getAllOwnedCommunities);

module.exports = router;
