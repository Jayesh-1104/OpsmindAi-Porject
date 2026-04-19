const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authmiddleware");
const { uploadSOP } = require("../controllers/sopcontroller");

router.post("/upload", protect, adminOnly, upload.single("file"), uploadSOP);
const { getSOPs, deleteSOP } = require("../controllers/sopcontroller");

// GET all SOPs
router.get("/", protect, getSOPs);

// DELETE SOP (admin only)
router.delete("/:id", protect, adminOnly, deleteSOP);

module.exports = router;