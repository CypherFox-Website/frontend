import { formatCodeForEval } from "./formatCode.js";
import { getSession } from "./auth.js";
import { encryptPayload } from "./crypto.js";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function authHeaders() {
  const session = await getSession();

  // Si no hay sesión, enviamos headers básicos (caso invitado)
  if (!session) return { "Content-Type": "application/json" };

  // Si hay sesión, adjuntamos el token (caso autenticado)
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function get(path) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(`API error ${res.status}: ${errorBody.error || res.statusText}`);
  }
  return res.json();
}

export const api = {
  getScore: async (rawCode = "", method = "") => {
    const dataToEncrypt = {
      code: formatCodeForEval(rawCode),
    };

    const encryptedBody = await encryptPayload(dataToEncrypt);
    const headers = await authHeaders();

    const res = await fetch(`${BASE_URL}/evaluate?method=${method}`, {
      method: "POST",
      headers,
      body: JSON.stringify(encryptedBody),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(`API error ${res.status}: ${errorBody.error || res.statusText}`);
    }
    return res.json();
  },

  getMe: async () => {
    const data = await get("/auth/me");
    return data.user;
  },
};
