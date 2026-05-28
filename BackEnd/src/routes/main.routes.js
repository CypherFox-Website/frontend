// BackEnd/src/routes/main.routes.js
import { Router } from "express";
import evaluateRouter from "../modules/evaluate/evaluate.routes.js";
import authRouter from "../modules/auth/auth.routes.js";
import adminRouter from "../modules/admin/admin.routes.js";

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
      auth: {
        me: "GET /api/auth/me  (requiere Bearer token — solo @unal.edu.co)",
      },
      admin: {
        gradesReport: "POST /api/admin/grades-report (requiere Bearer token)",
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
    response: "thump-thump",
  });
});

mainRouter.use("/evaluate", evaluateRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/admin", adminRouter);

export default mainRouter;
