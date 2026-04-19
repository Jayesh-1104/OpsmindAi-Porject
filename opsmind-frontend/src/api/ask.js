import BASE_URL from "./config";

// Regular POST ask
export async function askQuestion(question) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Ask failed");
  return data;
}
