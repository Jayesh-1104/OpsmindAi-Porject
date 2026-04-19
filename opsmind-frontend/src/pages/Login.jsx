import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const SUGGESTED_EMPLOYEE = { email: "", password: "" };
const SUGGESTED_ADMIN = { email: "", password: "" };

export default function Login() {
  const [mode, setMode] = useState("employee"); // "employee" | "admin"
  const [email, setEmail] = useState(SUGGESTED_EMPLOYEE.email);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setEmail(m === "employee" ? SUGGESTED_EMPLOYEE.email : SUGGESTED_ADMIN.email);
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser({ email, password });

      // Enforce role matches the selected mode
      if (data.user.role !== mode) {
        setError(
          mode === "admin"
            ? "This account is not an admin. Please sign in as Employee."
            : "This is an admin account. Please use 'Sign in as Admin'."
        );
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isEmployee = mode === "employee";

  return (
    <div className="login-root">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-logo">
          <div className="logo-icon">✳</div>
          <span className="logo-text">OpsMind.</span>
        </div>

        <div className="login-hero">
          <p className="login-eyebrow">
            <span className="eyebrow-line" /> CORPORATE KNOWLEDGE BRAIN
          </p>
          <h1 className="login-headline">
            Ask <em>anything.</em>
            <br />
            Cited from your SOPs.
          </h1>
          <p className="login-subtext">
            Search 500+ pages of Standard Operating Procedures in natural
            language. Every answer traces back to its source — no hallucinations.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${isEmployee ? "active" : ""}`}
            onClick={() => switchMode("employee")}
          >
            <span className="mode-icon">👤</span> Sign in as Employee
          </button>
          <button
            className={`mode-btn ${!isEmployee ? "active" : ""}`}
            onClick={() => switchMode("admin")}
          >
            <span className="mode-icon">🛡</span> Sign in as Admin
          </button>
        </div>

        <p className="mode-description">
          {isEmployee
            ? "READ-ONLY ACCESS · ASK THE AGENT ANYTHING FROM INDEXED SOPS."
            : "FULL ACCESS · MANAGE SOPS, TRIGGER RE-INDEXING, AUDIT USAGE."}
        </p>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">WORK EMAIL</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading
              ? "Authenticating..."
              : `Continue as ${isEmployee ? "Employee" : "Admin"} →`}
          </button>
        </form>

        <p className="sso-note">🔒 SSO · SAML · SCIM supported</p>

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register" className="register-link-a">Create one →</Link>
        </p>

        <div className="login-footer-badges">
          <span>✓ SOC 2 TYPE II</span>
          <span>·</span>
          <span>ISO 27001</span>
          <span>·</span>
          <span>GDPR READY</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="right-overlay" />
        <div className="right-card">
          <p className="right-card-eyebrow">
            {isEmployee
              ? "EMPLOYEE VIEW · ASK. GET CITED ANSWERS."
              : "ADMIN VIEW · CURATE. UPLOAD. AUDIT."}
          </p>
          <h3 className="right-card-quote">
            {isEmployee
              ? '"How do I process a refund over $500?"'
              : '"2 new SOPs pending re-index approval."'}
          </h3>
          <p className="right-card-body">
            {isEmployee
              ? "Regional Finance Lead approval required. Settled within 5 business days..."
              : "HR Leave Policy v2.1 and Travel Policy v1.4 awaiting ingestion review."}
          </p>
          <div className="right-card-tags">
            {isEmployee ? (
              <>
                <span className="tag">REFUND POLICY · P.12 §3.1</span>
                <span className="tag">REFUND POLICY · P.14 §3.4</span>
              </>
            ) : (
              <>
                <span className="tag">ADMIN · INGEST QUEUE</span>
                <span className="tag pending">2 PENDING</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
