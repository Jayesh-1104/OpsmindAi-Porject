# OpsMind AI — Backend Setup

## 1. Install dependencies
```bash
npm install
```

## 2. Add your Gemini API Key to .env
Get a free key from: https://aistudio.google.com/app/apikey

```
GEMINI_API_KEY=your_key_here
```

## 3. Run the server
```bash
npm run dev
```

## 4. How the RAG Pipeline works
1. Admin uploads a PDF via `/api/sop/upload`
2. Backend extracts text using `pdf-parse`
3. Text is split into ~500 char chunks with overlap
4. Each chunk is embedded using Gemini `text-embedding-004` (768 dimensions)
5. Embeddings are stored in MongoDB `chunks` collection
6. When employee asks a question:
   - Question is embedded
   - Cosine similarity search finds top 5 relevant chunks
   - Gemini Flash generates a cited answer from those chunks
   - Sources are returned with page numbers

## 5. API Endpoints

### Auth
- `POST /api/auth/register` — `{ name, email, password, role }`
- `POST /api/auth/login` — `{ email, password }`

### SOP (Admin only for write)
- `GET /api/sop` — get all SOPs
- `POST /api/sop/upload` — upload PDF (multipart/form-data, field: `file`)
- `DELETE /api/sop/:id` — delete SOP + chunks
- `POST /api/sop/reindex/:id` — re-trigger indexing

### Ask
- `POST /api/ask` — `{ question }` → `{ answer, sources, confidence }`
- `GET /api/ask/stream?question=...&token=...` — SSE streaming answer

## 6. Source citation format
Every answer includes sources like:
```json
{
  "sources": [
    { "sopTitle": "Refund Policy", "page": 12, "score": 94 }
  ]
}
```
