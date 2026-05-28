/**
 * Middleware para verificar si el usuario autenticado tiene el rol necesario.
 * Debe ejecutarse después de requireAuth, ya que depende de req.user.
 * @param {string} requiredRole - El rol esperado (ej: 'teacher').
 */
export const checkRole = (requiredRole) => {
  return (req, res, next) => {
    // El objeto req.user es inyectado por requireAuth llamando a authService
    if (!req.user || req.user.rol !== requiredRole) {
      const error = new Error("Acceso denegado. No tienes los permisos necesarios para realizar esta acción.");
      error.status = 403;
      return next(error);
    }
    next();
  };
};