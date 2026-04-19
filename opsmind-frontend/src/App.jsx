import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AskAgent from "./pages/AskAgent";
import KnowledgeBase from "./pages/KnowledgeBase";
import DocumentViewer from "./pages/DocumentViewer";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected - all logged-in users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ask"
            element={
              <ProtectedRoute>
                <AskAgent />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/knowledge-base"
            element={
              <AdminRoute>
                <KnowledgeBase />
              </AdminRoute>
            }
          />
          <Route
            path="/document-viewer"
            element={
              <AdminRoute>
                <DocumentViewer />
              </AdminRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
