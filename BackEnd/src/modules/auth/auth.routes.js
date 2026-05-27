// BackEnd/src/modules/auth/auth.routes.js
import { Router } from "express";
import { authController } from "./auth.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const authRouter = Router();

// Inicia el flujo OAuth — devuelve la URL del proveedor
// GET /api/auth/login?provider=google
// GET /api/auth/login?provider=github
authRouter.get("/login", authController.login);

// Intercambia el code por una sesión (lo llama el frontend tras el callback)
// GET /api/auth/callback?code=...
authRouter.get("/callback", authController.callback);

// Devuelve el usuario autenticado (requiere token JWT en Authorization header)
// GET /api/auth/me
authRouter.get("/me", requireAuth, authController.me);

// Cierra la sesión
// POST /api/auth/logout
authRouter.post("/logout", requireAuth, authController.logout);

export default authRouter;
