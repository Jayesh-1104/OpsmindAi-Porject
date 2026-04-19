const SOP = require("../models/sop");

exports.uploadSOP = async (req, res) => {
  try {
    const file = req.file;

    const sop = await SOP.create({
      title: file.originalname,
      filePath: file.path,
    });

    res.json({ msg: "SOP uploaded", sop });
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

const fs = require("fs");

exports.deleteSOP = async (req, res) => {
  try {
    const sop = await SOP.findById(req.params.id);

    if (!sop) {
      return res.status(404).json({ msg: "SOP not found" });
    }

    // delete file from uploads folder
    fs.unlinkSync(sop.filePath);

    // delete from DB
    await sop.deleteOne();

    res.json({ msg: "SOP deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};