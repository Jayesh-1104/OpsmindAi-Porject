import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Topbar.css";

export default function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/ask?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-search">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search SOPs, sections, or queries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
        <kbd className="search-kbd">⌘ K</kbd>
      </div>

      <div className="topbar-right">
        {user?.role === "admin" && (
          <button className="settings-btn" title="Settings">⚙</button>
        )}
        <div className="topbar-user">
          <div className="user-avatar">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role">{user?.role?.toUpperCase() || "EMPLOYEE"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
