// BackEnd/src/middlewares/requireAuth.js
import { authService } from "../modules/auth/auth.service.js";

/**
 * Middleware que protege rutas que requieren autenticación.
 * Espera el token JWT en el header: Authorization: Bearer <token>
 */
export const requireAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("No autorizado. Falta el token de acceso.");
      error.status = 401;
      return next(error);
    }

    const token = authHeader.split(" ")[1];
    const user = await authService.getUserFromToken(token);

    req.user = user; // disponible en los controllers como req.user
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware opcional: Si hay token, identifica al usuario en req.user.
 * Si no hay token, simplemente continúa como invitado (req.user será null).
 */
export const tryAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const user = await authService.getUserFromToken(token);
    req.user = user;
    next();
  } catch (error) {
    // Si el token es inválido (expirado, etc.), fallamos por seguridad
    next(error);
  }
};
