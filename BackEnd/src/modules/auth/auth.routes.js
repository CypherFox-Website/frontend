// BackEnd/src/modules/auth/auth.routes.js
import { Router } from "express";
import { authController } from "./auth.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const authRouter = Router();

// Devuelve el usuario autenticado (requiere token JWT en Authorization header)
// El login, callback y logout los maneja el frontend directamente con Supabase
// GET /api/auth/me
authRouter.get("/me", requireAuth, authController.me);

export default authRouter;
