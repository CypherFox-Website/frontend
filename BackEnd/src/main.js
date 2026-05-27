// BackEnd\src\main.js
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import mainRouter from "./routes/main.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Frontend en desarrollo (Vite)
  "https://cypherfox.vercel.app", // Frontend en Producción
];

app.use(cors({
  origin: allowedOrigins,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use((req, _res, next) => {
  // eslint-disable-next-line no-console
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

// Cargar documentación Swagger
const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "CypherFox API is running",
    docs: "/api/docs",
  });
});

app.use("/api", mainRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`BE listening on http://localhost:${env.port}`);
});
