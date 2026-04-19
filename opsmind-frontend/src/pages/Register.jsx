import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import "./Register.css";

export default function Register() {
  const [role, setRole] = useState("employee");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password, role });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-root">
      {/* Left Panel */}
      <div className="reg-left">
        <div className="reg-logo">
          <div className="logo-icon">✳</div>
          <span className="logo-text">OpsMind.</span>
        </div>

        <div className="reg-hero">
          <p className="reg-eyebrow">
            <span className="eyebrow-line" /> CREATE YOUR ACCOUNT
          </p>
          <h1 className="reg-headline">
            Join your <em>team's</em>
            <br />
            knowledge brain.
          </h1>
          <p className="reg-subtext">
            Get instant cited answers from your company's SOPs. No hallucinations — every answer traced to its source.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button
            className={`role-btn ${role === "employee" ? "active" : ""}`}
            onClick={() => setRole("employee")}
            type="button"
          >
            <span>👤</span> Employee
          </button>
          <button
            className={`role-btn ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
            type="button"
          >
            <span>🛡</span> Admin
          </button>
        </div>
        <p className="role-desc">
          {role === "employee"
            ? "READ-ONLY ACCESS · ASK THE AGENT ANYTHING FROM INDEXED SOPS."
            : "FULL ACCESS · MANAGE SOPS, TRIGGER RE-INDEXING, AUDIT USAGE."}
        </p>

        {/* Form */}
        <form className="reg-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">FULL NAME</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Ayaan Khan"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">WORK EMAIL</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">CONFIRM PASSWORD</label>
              <input
                className="form-input"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className="form-error">⚠ {error}</p>}
          {success && <p className="form-success">✓ {success}</p>}

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : `Create ${role === "admin" ? "Admin" : "Employee"} Account →`}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/" className="login-link-a">Sign in →</Link>
        </p>

        <div className="reg-footer-badges">
          <span>✓ SOC 2 TYPE II</span>
          <span>·</span>
          <span>ISO 27001</span>
          <span>·</span>
          <span>GDPR READY</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="reg-right">
        <div className="right-overlay" />
        <div className="right-card">
          <p className="right-card-eyebrow">
            {role === "employee"
              ? "EMPLOYEE VIEW · ASK. GET CITED ANSWERS."
              : "ADMIN VIEW · CURATE. UPLOAD. AUDIT."}
          </p>
          <h3 className="right-card-quote">
            {role === "employee"
              ? '"How do I process a refund over $500?"'
              : '"2 new SOPs pending re-index approval."'}
          </h3>
          <p className="right-card-body">
            {role === "employee"
              ? "Regional Finance Lead approval required. Settled within 5 business days..."
              : "HR Leave Policy v2.1 and Travel Policy v1.4 awaiting ingestion review."}
          </p>
          <div className="right-card-tags">
            {role === "employee" ? (
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
