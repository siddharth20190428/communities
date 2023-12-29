const express = require("express");
const { addMember, deleteMember } = require("../controllers/member");

const router = express.Router();

router.post("/", addMember);
router.delete("/:id", deleteMember);

module.exports = router;
