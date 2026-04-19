import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { askQuestion } from "../api/ask";
import { useSSEAsk } from "../hooks/useSSEAsk";
import Layout from "../components/Layout";
import "./AskAgent.css";

const SAMPLE_QUESTIONS = [
  "What is the SLA for a P1 incident escalation?",
  "What's our hallucination policy for agent responses?",
  "How do I escalate a P1 security incident?",
  "Travel reimbursement limit for international trips?",
  "Who approves vendor onboarding over $10K?",
  "Data retention policy for customer PII?",
];

export default function AskAgent() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // SSE streaming (ready for when AI is added)
  const { streamedText, isStreaming, startStream, stopStream } = useSSEAsk();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      handleSubmitQuery(q);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText]);

  const handleSubmitQuery = async (overrideQuery) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;

    const userMsg = { role: "user", content: q.trim(), time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const data = await askQuestion(q.trim());
      const answer = data.answer || data.message || data.response || JSON.stringify(data);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
          sources: data.sources || [],
          confidence: data.confidence || null,
          time: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err.message}`,
          isError: true,
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuery();
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <Layout>
      <div className="ask-page">
        {/* Header */}
        <div className="ask-header">
          <div>
            <p className="ask-breadcrumb">WORKSPACE · ASK AGENT</p>
            <h1 className="ask-title">Ask Agent</h1>
          </div>
          {messages.length > 0 && (
            <button className="clear-btn" onClick={clearChat}>
              ↺ Clear chat
            </button>
          )}
        </div>

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="ask-empty">
            <div className="ask-empty-icon">◎</div>
            <h2 className="ask-empty-title">What do you need to know?</h2>
            <p className="ask-empty-sub">
              Ask anything about company SOPs. Every answer is cited back to the source page.
            </p>
            <div className="sample-grid">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  className="sample-btn"
                  onClick={() => { setQuery(q); handleSubmitQuery(q); }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="messages-area">
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                {msg.role === "user" ? (
                  <div className="user-msg">
                    <div className="user-avatar-sm">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="msg-bubble user-bubble">{msg.content}</div>
                  </div>
                ) : (
                  <div className="assistant-msg">
                    <div className="agent-avatar">◎</div>
                    <div className={`msg-bubble agent-bubble ${msg.isError ? "error-bubble" : ""}`}>
                      <p className="agent-text">{msg.content}</p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="sources">
                          <p className="sources-label">SOURCES</p>
                          {msg.sources.map((s, si) => (
                            <span key={si} className="source-tag">{s}</span>
                          ))}
                        </div>
                      )}
                      {msg.confidence && (
                        <p className="conf-text">{msg.confidence}% confidence</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading / Streaming */}
            {loading && (
              <div className="message-row assistant">
                <div className="assistant-msg">
                  <div className="agent-avatar">◎</div>
                  <div className="msg-bubble agent-bubble">
                    <div className="typing-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SSE Streaming bubble (for future use) */}
            {isStreaming && streamedText && (
              <div className="message-row assistant">
                <div className="assistant-msg">
                  <div className="agent-avatar">◎</div>
                  <div className="msg-bubble agent-bubble streaming">
                    <p className="agent-text">{streamedText}<span className="cursor-blink">▋</span></p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="ask-input-area">
          <div className="ask-input-bar">
            <textarea
              className="ask-textarea"
              placeholder='e.g. "What is the SLA for a P1 incident escalation?"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button
              className="ask-send-btn"
              onClick={() => handleSubmitQuery()}
              disabled={loading || !query.trim()}
            >
              {loading ? "..." : "↗"}
            </button>
          </div>
          <p className="ask-hint">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </Layout>
  );
}
