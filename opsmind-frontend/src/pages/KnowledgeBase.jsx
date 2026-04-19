import React, { useState, useEffect, useRef } from "react";
import { getSOPs, uploadSOP, deleteSOP } from "../api/sop";
import Layout from "../components/Layout";
import "./KnowledgeBase.css";

export default function KnowledgeBase() {
  const [sops, setSops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef();

  const fetchSops = async () => {
    setLoading(true);
    try {
      const data = await getSOPs();
      setSops(Array.isArray(data) ? data : data.sops || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSops(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      await uploadSOP(file);
      setSuccess(`"${file.name}" uploaded successfully.`);
      fetchSops();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteSOP(id);
      setSops((prev) => prev.filter((s) => s._id !== id));
      setSuccess(`"${name}" deleted.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="kb-page">
        <div className="kb-header">
          <div>
            <p className="kb-breadcrumb">WORKSPACE · ADMIN · KNOWLEDGE BASE</p>
            <h1 className="kb-title">Knowledge Base</h1>
          </div>
          <button
            className="upload-btn"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "+ Upload SOP"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </div>

        {error && <div className="kb-toast error">{error}</div>}
        {success && <div className="kb-toast success">{success}</div>}

        {loading ? (
          <div className="kb-loading">
            <div className="loading-spin">◎</div>
            Loading knowledge base...
          </div>
        ) : sops.length === 0 ? (
          <div className="kb-empty">
            <p className="kb-empty-icon">≡</p>
            <p>No SOPs uploaded yet. Click "Upload SOP" to get started.</p>
          </div>
        ) : (
          <div className="kb-table-wrap">
            <table className="kb-table">
              <thead>
                <tr>
                  <th>DOCUMENT NAME</th>
                  <th>TYPE</th>
                  <th>UPLOADED</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sops.map((sop) => (
                  <tr key={sop._id}>
                    <td className="doc-name-cell">
                      <span className="doc-icon">◻</span>
                      {sop.title || sop.name || sop.filename || "Unnamed SOP"}
                    </td>
                    <td>
                      <span className="type-badge">
                        {sop.fileType || sop.type || "PDF"}
                      </span>
                    </td>
                    <td className="date-cell">
                      {sop.createdAt
                        ? new Date(sop.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <span className={`status-pill ${sop.status === "pending" ? "pending" : "indexed"}`}>
                        {sop.status || "INDEXED"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(sop._id, sop.title || sop.filename)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
