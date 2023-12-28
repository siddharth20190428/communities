const express = require("express");
const { signup, signin, getMe } = require("../controllers/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getme", getMe);

module.exports = router;
