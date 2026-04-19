

import BASE_URL from "./config";

async function safeJson(res) {
  const text = await res.text();
  if (!text) throw new Error(`Server error (${res.status}) — empty response`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Server error (${res.status}): ${text.slice(0, 120)}`);
  }
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.msg || data.message || data.error || "Login failed");
  return data;
}

export async function registerUser({ name, email, password, role }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.msg || data.message || data.error || "Register failed");
  return data;
}
