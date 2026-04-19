import { useState, useRef, useCallback } from "react";
import BASE_URL from "../api/config";

// SSE streaming hook — ready for when AI streaming is added to backend
// Usage: const { streamedText, isStreaming, startStream, stopStream } = useSSEAsk();
export function useSSEAsk() {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  const startStream = useCallback((question) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setStreamedText("");
    setError(null);
    setIsStreaming(true);

    const token = localStorage.getItem("token");
    const url = `${BASE_URL}/ask/stream?question=${encodeURIComponent(question)}&token=${token}`;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      if (e.data === "[DONE]") {
        es.close();
        setIsStreaming(false);
        return;
      }
      setStreamedText((prev) => prev + e.data);
    };

    es.onerror = () => {
      es.close();
      setIsStreaming(false);
      setError("Stream connection failed");
    };
  }, []);

  const stopStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsStreaming(false);
  }, []);

  return { streamedText, isStreaming, error, startStream, stopStream };
}
