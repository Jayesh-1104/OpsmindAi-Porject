const fs = require("fs");
const { SOP, Chunk } = require("../models/sop");
const { indexSOP } = require("../services/ragService");

exports.uploadSOP = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const sop = await SOP.create({
      title: file.originalname,
      filePath: file.path,
      fileType: file.mimetype?.includes("pdf") ? "PDF" : "DOC",
      status: "processing",
    });

    res.json({ msg: "SOP upload started. Indexing in background.", sop });

    indexSOP(sop._id, sop.title, file.path)
      .then(async ({ totalChunks, totalPages }) => {
        await SOP.findByIdAndUpdate(sop._id, { status: "indexed", totalChunks, totalPages });
        console.log("Indexed:", sop.title, totalChunks, "chunks");
      })
      .catch(async (err) => {
        await SOP.findByIdAndUpdate(sop._id, { status: "failed", errorMessage: err.message });
        console.error("Index failed:", err.message);
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSOPs = async (req, res) => {
  try {
    const sops = await SOP.find().sort({ createdAt: -1 });
    res.json(sops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSOP = async (req, res) => {
  try {
    const sop = await SOP.findById(req.params.id);
    if (!sop) return res.status(404).json({ msg: "SOP not found" });

    if (fs.existsSync(sop.filePath)) fs.unlinkSync(sop.filePath);
    await Chunk.deleteMany({ sopId: sop._id });
    await sop.deleteOne();

    res.json({ msg: "SOP and all indexed chunks deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reindexSOP = async (req, res) => {
  try {
    const sop = await SOP.findById(req.params.id);
    if (!sop) return res.status(404).json({ msg: "SOP not found" });

    await SOP.findByIdAndUpdate(sop._id, { status: "processing" });
    res.json({ msg: "Re-indexing started", sopId: sop._id });

    indexSOP(sop._id, sop.title, sop.filePath)
      .then(async ({ totalChunks, totalPages }) => {
        await SOP.findByIdAndUpdate(sop._id, { status: "indexed", totalChunks, totalPages });
        console.log("Re-indexed:", sop.title);
      })
      .catch(async (err) => {
        await SOP.findByIdAndUpdate(sop._id, { status: "failed", errorMessage: err.message });
        console.error("Re-index failed:", err.message);
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
