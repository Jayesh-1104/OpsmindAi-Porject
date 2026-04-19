import React, { useState, useEffect } from "react";
import { getSOPs } from "../api/sop";
import Layout from "../components/Layout";
import "./DocumentViewer.css";

export default function DocumentViewer() {
  const [sops, setSops] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSOPs()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.sops || [];
        setSops(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="dv-page">
        <div className="dv-header">
          <p className="dv-breadcrumb">WORKSPACE · ADMIN · DOCUMENT VIEWER</p>
          <h1 className="dv-title">Document Viewer</h1>
        </div>

        <div className="dv-layout">
          {/* Sidebar List */}
          <div className="dv-list">
            <p className="dv-list-label">ALL DOCUMENTS</p>
            {loading ? (
              <p className="dv-loading-text">Loading...</p>
            ) : sops.length === 0 ? (
              <p className="dv-empty-text">No documents found.</p>
            ) : (
              sops.map((sop) => (
                <button
                  key={sop._id}
                  className={`dv-list-item ${selected?._id === sop._id ? "active" : ""}`}
                  onClick={() => setSelected(sop)}
                >
                  <span className="dv-list-icon">◻</span>
                  <div>
                    <p className="dv-list-name">{sop.title || sop.filename || "Unnamed SOP"}</p>
                    <p className="dv-list-meta">
                      {sop.fileType || "PDF"} ·{" "}
                      {sop.createdAt ? new Date(sop.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Viewer Panel */}
          <div className="dv-viewer">
            {!selected ? (
              <div className="dv-viewer-empty">
                <p className="dv-viewer-empty-icon">◻</p>
                <p>Select a document to preview</p>
              </div>
            ) : (
              <>
                <div className="dv-viewer-header">
                  <div>
                    <p className="dv-viewer-name">{selected.title || selected.filename}</p>
                    <p className="dv-viewer-meta">
                      {selected.fileType || "PDF"} · Uploaded{" "}
                      {selected.createdAt
                        ? new Date(selected.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div className="dv-viewer-actions">
                    <span className={`status-pill ${selected.status === "pending" ? "pending" : "indexed"}`}>
                      {selected.status?.toUpperCase() || "INDEXED"}
                    </span>
                    {selected.fileUrl && (
                      <a
                        href={selected.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="open-link"
                      >
                        Open ↗
                      </a>
                    )}
                  </div>
                </div>

                <div className="dv-viewer-body">
                  {selected.fileUrl ? (
                    <iframe
                      src={selected.fileUrl}
                      title={selected.title}
                      className="dv-iframe"
                    />
                  ) : (
                    <div className="dv-no-preview">
                      <p className="dv-no-preview-icon">◻</p>
                      <p className="dv-no-preview-title">No preview available</p>
                      <p className="dv-no-preview-sub">
                        The document was uploaded but no preview URL is available.
                        Check your backend to ensure <code>fileUrl</code> is returned in the SOP data.
                      </p>
                      <div className="dv-meta-grid">
                        {[
                          ["ID", selected._id],
                          ["File Type", selected.fileType || "—"],
                          ["Status", selected.status || "indexed"],
                          ["Uploaded", selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"],
                        ].map(([k, v]) => (
                          <div key={k} className="dv-meta-row">
                            <span className="dv-meta-key">{k}</span>
                            <span className="dv-meta-val">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
