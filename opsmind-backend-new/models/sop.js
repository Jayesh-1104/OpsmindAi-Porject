const mongoose = require("mongoose");

// Each chunk of text from a PDF with its embedding
const chunkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  page: { type: Number, default: 1 },
  section: { type: String, default: "" },
  embedding: { type: [Number], required: true },
  sopId: { type: mongoose.Schema.Types.ObjectId, ref: "SOP" },
  sopTitle: { type: String },
});

chunkSchema.index({ sopId: 1 });

const sopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, default: "PDF" },
    totalChunks: { type: Number, default: 0 },
    totalPages: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["processing", "indexed", "failed"],
      default: "processing",
    },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

const SOP = mongoose.model("SOP", sopSchema);
const Chunk = mongoose.model("Chunk", chunkSchema);

module.exports = { SOP, Chunk };
