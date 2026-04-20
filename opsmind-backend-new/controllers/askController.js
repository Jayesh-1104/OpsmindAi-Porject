const { semanticSearch } = require("../services/ragService");
const { generateAnswer, streamAnswer } = require("../services/geminiService");
const { Chunk } = require("../models/sop");

// Regular POST ask
exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Check if any chunks exist
    const chunkCount = await Chunk.countDocuments();
    if (chunkCount === 0) {
      return res.json({
        question,
        answer: "No SOPs have been indexed yet. Please ask an admin to upload SOP documents first.",
        sources: [],
        confidence: 0,
      });
    }

    // Semantic search — find top 5 relevant chunks
    const relevantChunks = await semanticSearch(question, 5);

    if (relevantChunks.length === 0) {
      return res.json({
        question,
        answer: "I couldn't find relevant information in the indexed SOPs. Please contact your HR/Operations team.",
        sources: [],
        confidence: 0,
      });
    }

    // Generate answer using Gemini with retrieved context
    const answer = await generateAnswer(question, relevantChunks);

    // Build source citations
    const sources = relevantChunks.map((c) => ({
      sopTitle: c.sopTitle,
      page: c.page,
      section: c.section || null,
      excerpt: c.text.slice(0, 150) + "...",
      score: Math.round(c.score * 100),
    }));

    // Deduplicate sources by SOP title
    const uniqueSources = sources.filter(
      (s, i, arr) => arr.findIndex((x) => x.sopTitle === s.sopTitle && x.page === s.page) === i
    );

    res.json({
      question,
      answer,
      sources: uniqueSources,
      confidence: Math.round(relevantChunks[0].score * 100),
    });
  } catch (err) {
    console.error("Ask error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// SSE streaming ask — streams tokens to frontend in real time
exports.askQuestionStream = async (req, res) => {
  const { question } = req.query;

  if (!question) {
    res.status(400).json({ error: "Question is required" });
    return;
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  const sendRaw = (text) => res.write(`data: ${text}\n\n`);

  try {
    const chunkCount = await Chunk.countDocuments();
    if (chunkCount === 0) {
      send({ type: "error", message: "No SOPs indexed yet." });
      sendRaw("[DONE]");
      res.end();
      return;
    }

    const relevantChunks = await semanticSearch(question, 5);

    if (relevantChunks.length === 0) {
      send({ type: "token", text: "I couldn't find relevant information in the indexed SOPs." });
      sendRaw("[DONE]");
      res.end();
      return;
    }

    // Send sources first
    const sources = relevantChunks.map((c) => ({
      sopTitle: c.sopTitle,
      page: c.page,
      section: c.section || null,
      score: Math.round(c.score * 100),
    }));
    send({ type: "sources", sources });

    // Stream answer tokens
    await streamAnswer(
      question,
      relevantChunks,
      (tokenText) => {
        send({ type: "token", text: tokenText });
      },
      () => {
        sendRaw("[DONE]");
        res.end();
      }
    );
  } catch (err) {
    console.error("Stream error:", err.message);
    send({ type: "error", message: err.message });
    sendRaw("[DONE]");
    res.end();
  }
};
