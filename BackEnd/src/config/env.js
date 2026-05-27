// BackEnd/src/config/env.js
import "dotenv/config";

const requiredEnvVars = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "FRONTEND_URL",
  "ENCRYPTION_SECRET",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.warn(
      `Warning: Missing required env var: ${key}. Usando valor por defecto para desarrollo.`,
    );
  }
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  frontendUrl: process.env.FRONTEND_URL,
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
};
