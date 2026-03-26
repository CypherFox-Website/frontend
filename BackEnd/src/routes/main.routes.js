// BackEnd\src\routes\main.routes.js
import { Router } from "express";
import evaluateRouter from "../modules/evaluate/evaluate.routes.js";

const mainRouter = Router();

mainRouter.get("/", (_req, res) => {
  res.status(200).json({
    service: "CypherFox Backend",
    basePath: "/api",
    availableCalls: {
      health: {
        method: "GET",
        path: "/api/health",
      },
      heartbeat: {
        method: "GET",
        path: "/api/heartbeat",
      },
      evaluate: {
        method: "POST",
        path: "/api/evaluate",
      },
    },
  });
});

mainRouter.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
  });
});

mainRouter.use("/heartbeat", (_req, res) => {
  res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    response: 'thump-thump'
  });
});

mainRouter.use("/evaluate", evaluateRouter);


export default mainRouter;
