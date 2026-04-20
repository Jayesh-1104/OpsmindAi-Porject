const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");
const { askQuestion, askQuestionStream } = require("../controllers/askController");

// Regular POST
router.post("/", protect, askQuestion);

// SSE streaming GET (token passed as query param for EventSource compatibility)
router.get("/stream", protect, askQuestionStream);

module.exports = router;
