const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authmiddleware");
const { uploadSOP, getSOPs, deleteSOP, reindexSOP } = require("../controllers/sopcontroller");

router.get("/", protect, getSOPs);
router.post("/upload", protect, adminOnly, upload.single("file"), uploadSOP);
router.delete("/:id", protect, adminOnly, deleteSOP);
router.post("/reindex/:id", protect, adminOnly, reindexSOP);

module.exports = router;
