// BackEnd\src\config\env.js
import "dotenv/config";

const requiredEnvVars = [
  "ENCRYPTION_SECRET"
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.warn(`Warning: Missing required env var: ${key}. Usando valor por defecto para desarrollo.`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
};
