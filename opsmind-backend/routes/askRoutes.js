const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authmiddleware");
const { askQuestion } = require("../controllers/askController");

router.post("/", protect, askQuestion);

module.exports = router;