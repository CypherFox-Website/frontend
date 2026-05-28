// BackEnd/src/config/supabase.js
import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false },
});

export function supabaseFromToken(token) {
    return createClient(env.supabaseUrl, env.supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        auth: { persistSession: false },
    });
}