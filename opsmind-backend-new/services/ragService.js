const fs = require("fs");
const pdfParse = require("pdf-parse");
const { getEmbedding } = require("./geminiService");
const { Chunk } = require("../models/sop");

// ── 1. Extract text from PDF ──────────────────────────────────────────────────
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return {
    text: data.text,
    totalPages: data.numpages,
  };
}

// ── 2. Split text into overlapping chunks ─────────────────────────────────────
// Each chunk ~500 chars with 100 char overlap to preserve context across splits
function splitIntoChunks(text, chunkSize = 500, overlap = 100) {
  const chunks = [];
  let start = 0;

  // Clean up text
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    let chunk = cleaned.slice(start, end);

    // Try to end at a sentence boundary
    const lastPeriod = chunk.lastIndexOf(".");
    const lastNewline = chunk.lastIndexOf("\n");
    const boundary = Math.max(lastPeriod, lastNewline);

    if (boundary > chunkSize * 0.6 && end < cleaned.length) {
      chunk = cleaned.slice(start, start + boundary + 1);
      start = start + boundary + 1 - overlap;
    } else {
      start = end - overlap;
    }

    if (chunk.trim().length > 50) {
      chunks.push(chunk.trim());
    }
  }

  return chunks;
}

// ── 3. Estimate page number for a chunk ──────────────────────────────────────
function estimatePage(chunkIndex, totalChunks, totalPages) {
  if (totalPages <= 1) return 1;
  return Math.ceil(((chunkIndex + 1) / totalChunks) * totalPages);
}

// ── 4. Full indexing pipeline: extract → chunk → embed → store ───────────────
async function indexSOP(sopId, sopTitle, filePath) {
  // Step 1: Extract text
  const { text, totalPages } = await extractTextFromPDF(filePath);

  // Step 2: Chunk
  const rawChunks = splitIntoChunks(text);

  if (rawChunks.length === 0) {
    throw new Error("No text could be extracted from this PDF.");
  }

  // Step 3: Delete old chunks for this SOP (re-indexing support)
  await Chunk.deleteMany({ sopId });

  // Step 4: Embed each chunk and save (batch with small delay to avoid rate limits)
  const savedChunks = [];

  for (let i = 0; i < rawChunks.length; i++) {
    const chunkText = rawChunks[i];

    // Get embedding from Gemini
    const embedding = await getEmbedding(chunkText);

    const chunk = await Chunk.create({
      text: chunkText,
      page: estimatePage(i, rawChunks.length, totalPages),
      sopId,
      sopTitle,
      embedding,
    });

    savedChunks.push(chunk);

    // Small delay every 10 chunks to avoid hitting Gemini rate limits
    if (i > 0 && i % 10 === 0) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return { totalChunks: savedChunks.length, totalPages };
}

// ── 5. Cosine similarity between two vectors ──────────────────────────────────
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ── 6. Semantic search — find top-k most relevant chunks ─────────────────────
async function semanticSearch(question, topK = 5) {
  // Embed the question
  const queryEmbedding = await getEmbedding(question);

  // Load all chunks from DB
  // NOTE: For production with 10k+ chunks, use MongoDB Atlas Vector Search index
  // For now this works well up to ~5000 chunks
  const allChunks = await Chunk.find({}).lean();

  if (allChunks.length === 0) {
    return [];
  }

  // Score each chunk
  const scored = allChunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  // Sort by score descending and return top K
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

module.exports = { indexSOP, semanticSearch, extractTextFromPDF };
