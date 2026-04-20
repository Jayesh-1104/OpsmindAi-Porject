const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate embedding vector for a piece of text (768 dimensions)
async function getEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// Build prompt with SOP context
function buildPrompt(question, chunks) {
  const context = chunks
    .map(
      (c, i) =>
        `[Source ${i + 1}: ${c.sopTitle}, Page ${c.page}${
          c.section ? ", Section " + c.section : ""
        }]\n${c.text}`
    )
    .join("\n\n---\n\n");

  return `You are an expert corporate knowledge assistant for OpsMind AI.
Your job is to answer employee questions strictly based on the company's Standard Operating Procedures (SOPs).

STRICT RULES:
1. ONLY use information from the provided SOP context below. Never use outside knowledge.
2. ALWAYS cite your source like: "According to [Document Title] (Page X, Section Y)..."
3. If the answer is not found in context, respond exactly: "I couldn't find this in the indexed SOPs. Please contact your HR/Operations team."
4. Be concise, accurate, and professional.
5. Never hallucinate or fabricate information.

SOP CONTEXT:
${context}

EMPLOYEE QUESTION: ${question}

ANSWER:`;
}

// Regular (non-streaming) answer
async function generateAnswer(question, chunks) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(buildPrompt(question, chunks));
  return result.response.text();
}

// Streaming answer — calls onChunk(text) for each token, then onDone()
async function streamAnswer(question, chunks, onChunk, onDone) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContentStream(buildPrompt(question, chunks));

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) onChunk(text);
  }
  onDone();
}

module.exports = { getEmbedding, generateAnswer, streamAnswer };
