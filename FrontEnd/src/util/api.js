import { formatCodeForEval } from "../util/formatCode.js";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function get(path) {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export const api = {
    getScore: async (rawCode = '', method = '') => {
        const res = await fetch(`${BASE_URL}/evaluate?method=${method}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: formatCodeForEval(rawCode),
            }),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
    },
};