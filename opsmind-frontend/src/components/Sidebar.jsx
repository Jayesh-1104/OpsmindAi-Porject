import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const EMPLOYEE_NAV = [
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/ask", icon: "◎", label: "Ask Agent" },
];

const ADMIN_NAV = [
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/ask", icon: "◎", label: "Ask Agent" },
  { to: "/knowledge-base", icon: "≡", label: "Knowledge Base" },
  { to: "/document-viewer", icon: "◻", label: "Document Viewer" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const navItems = isAdmin ? ADMIN_NAV : EMPLOYEE_NAV;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sb-logo">
        <div className="sb-logo-icon">✳</div>
        <div>
          <div className="sb-logo-text">OpsMind.</div>
          <div className="sb-logo-sub">KNOWLEDGE BRAIN</div>
        </div>
      </div>

      {/* Workspace Badge */}
      <div className="sb-workspace">
        <span className="sb-workspace-label">WORKSPACE</span>
        <span className={`sb-role-badge ${isAdmin ? "admin" : "employee"}`}>
          {isAdmin ? "⬡ ADMIN" : "△ EMPLOYEE"}
        </span>
      </div>

      {/* Nav */}
      <nav className="sb-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `sb-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sb-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Info box */}
      {!isAdmin && (
        <div className="sb-info-box">
          <span className="sb-info-icon">◉</span>
          <p>Knowledge Base management is admin-only. Ask your ops lead to upload new SOPs.</p>
        </div>
      )}

      {/* Logout */}
      <button className="sb-logout" onClick={handleLogout}>
        ↩ Sign out
      </button>
    </aside>
  );
}
