import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSOPs } from "../api/sop";
import Layout from "../components/Layout";
import "./Dashboard.css";

const QUICK_ASKS = [
  "What's our hallucination policy for agent responses?",
  "How do I escalate a P1 security incident?",
  "Travel reimbursement limit for international trips?",
  "Who approves vendor onboarding over $10K?",
];

const MOCK_QUERIES = [
  { q: "How do I process a refund over $500?", user: "PRIYA S.", time: "2M AGO", sources: 3, conf: 97 },
  { q: "What is the escalation matrix for P1 incidents?", user: "MARCUS D.", time: "11M AGO", sources: 2, conf: 94 },
  { q: "Onboarding checklist for new vendors", user: "AYAAN K.", time: "34M AGO", sources: 5, conf: 99 },
  { q: "Data retention policy for customer PII", user: "ELENA M.", time: "1H AGO", sources: 4, conf: 96 },
];

const TOP_DOCS = [
  { name: "Refund & Returns Policy", count: 2847 },
  { name: "Incident Response Playbook", count: 2184 },
  { name: "Customer Support Runbook", count: 1611 },
  { name: "Data Handling Guidelines", count: 1223 },
  { name: "Vendor Onboarding SOP", count: 698 },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quickQuery, setQuickQuery] = useState("");
  const [sopCount, setSopCount] = useState(542);
  const isAdmin = user?.role === "admin";
  const firstName = user?.name?.split(" ")[0] || "there";

  useEffect(() => {
    getSOPs()
      .then((data) => {
        if (Array.isArray(data)) setSopCount(data.length);
      })
      .catch(() => {});
  }, []);

  const handleAsk = () => {
    if (quickQuery.trim()) {
      navigate(`/ask?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  return (
    <Layout>
      <div className="dash">
        {/* Header */}
        <div className="dash-header">
          <div>
            <p className="dash-breadcrumb">WORKSPACE · ACME CORP · {isAdmin ? "ADMIN CONSOLE" : "EMPLOYEE"}</p>
            <h1 className="dash-title">{getGreeting()}, {firstName}.</h1>
            {isAdmin ? (
              <p className="dash-sub">
                Your knowledge brain has ingested <strong>{sopCount} SOPs</strong> and answered{" "}
                <strong>14,023 queries</strong> with <strong>99.99%</strong> source accuracy.
              </p>
            ) : (
              <p className="dash-sub">
                Ask anything about company policies — every answer is cited back to the exact SOP page.{" "}
                <strong>{sopCount} SOPs</strong> are ready to search.
              </p>
            )}
          </div>
          <div className="dash-status">
            <span className="status-dot" />
            All systems operational
            <span className="version-badge">V2.4.1</span>
          </div>
        </div>

        {/* Quick Ask */}
        <div className="quick-ask-card">
          <div className="quick-ask-label">
            <span>✳</span> QUICK ASK
          </div>
          <h2 className="quick-ask-title">What do you need to know today?</h2>
          <div className="quick-ask-input-row">
            <input
              className="quick-ask-input"
              type="text"
              placeholder='e.g. "What is the SLA for a P1 incident escalation?"'
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button className="quick-ask-btn" onClick={handleAsk}>
              Ask ↗
            </button>
          </div>
          <div className="quick-ask-chips">
            {QUICK_ASKS.map((q) => (
              <button key={q} className="chip" onClick={() => navigate(`/ask?q=${encodeURIComponent(q)}`)}>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard icon="≡" label="SOPS INDEXED" value={sopCount} sub="+12 this week" />
          <StatCard icon="◎" label="QUERIES ANSWERED" value="14,023" sub="+1,204 / 7d" />
          <StatCard icon="⊙" label="HALLUCINATION RATE" value="0.01%" sub="All answers cited" subGreen />
          <StatCard icon="◷" label="AVG LATENCY" value="1.2s" sub="p95 · 21s" />
        </div>

        {/* Bottom Section */}
        <div className="dash-bottom">
          {/* Live Feed */}
          <div className="live-feed">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">LIVE FEED</p>
                <h3 className="section-title">Recent Queries</h3>
              </div>
              <Link to="/ask" className="section-link">Open Ask Agent →</Link>
            </div>
            <div className="query-list">
              {MOCK_QUERIES.map((item, i) => (
                <div key={i} className="query-item">
                  <div className="query-main">
                    <p className="query-text">{item.q}</p>
                    <p className="query-meta">
                      {item.user} · {item.time} · {item.sources} SOURCES
                    </p>
                  </div>
                  <span className="conf-badge">{item.conf}% conf</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Docs */}
          <div className="top-docs">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">MOST-CITED SOPS</p>
                <h3 className="section-title">Top Documents</h3>
              </div>
            </div>
            <div className="doc-list">
              {TOP_DOCS.map((doc, i) => (
                <div key={i} className="doc-item">
                  <span className="doc-name">{doc.name}</span>
                  <span className="doc-count">{doc.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
            {isAdmin && (
              <Link to="/knowledge-base" className="manage-kb-link">
                Manage Knowledge Base →
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, label, value, sub, subGreen }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-expand">↗</span>
      </div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className={`stat-sub ${subGreen ? "green" : ""}`}>{sub}</p>
    </div>
  );
}
