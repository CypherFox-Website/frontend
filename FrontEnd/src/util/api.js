import { formatCodeForEval } from './formatCode.js';
import { supabase } from './auth.js';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function get(path) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getScore: async (rawCode = '', method = '') => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/evaluate?method=${method}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code: formatCodeForEval(rawCode) }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },

  getMe: async () => get('/auth/me'),
};
