// BackEnd\src\config\env.js
import "dotenv/config";

const requiredEnvVars = [];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
};
