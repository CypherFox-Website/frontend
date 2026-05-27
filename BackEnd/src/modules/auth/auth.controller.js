// BackEnd/src/modules/auth/auth.controller.js
import { handleAsync } from "../../utils/handleAsync.js";
import { authService } from "./auth.service.js";

export const authController = {
  // GET /api/auth/login?provider=google  OR  ?provider=github
  login: handleAsync(async (req, res) => {
    const { provider } = req.query;

    if (!provider || !["google", "github"].includes(provider)) {
      const error = new Error("Proveedor inválido. Usa 'google' o 'github'.");
      error.status = 400;
      throw error;
    }

    const { url } = await authService.getOAuthUrl(provider);
    res.status(200).json({ url });
  }),

  // GET /api/auth/callback?code=...
  callback: handleAsync(async (req, res) => {
    const { code } = req.query;

    if (!code) {
      const error = new Error("Falta el código de autorización.");
      error.status = 400;
      throw error;
    }

    const { session } = await authService.exchangeCode(code);
    res.status(200).json({ session });
  }),

  // GET /api/auth/me  (requiere token en Authorization header)
  me: handleAsync(async (req, res) => {
    const user = req.user;
    res.status(200).json({ user });
  }),

  // POST /api/auth/logout
  logout: handleAsync(async (req, res) => {
    await authService.logout();
    res.status(200).json({ message: "Sesión cerrada correctamente." });
  }),
};
