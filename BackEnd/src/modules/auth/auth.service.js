// BackEnd/src/modules/auth/auth.service.js
import { supabase } from "../../config/supabase.js";

const ALLOWED_DOMAIN = "@unal.edu.co";

export const authService = {
  /**
   * Obtiene el usuario autenticado a partir de un JWT
   * y valida que pertenezca al dominio institucional @unal.edu.co.
   */
  async getUserFromToken(token) {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      const err = new Error("Token inválido o expirado.");
      err.status = 401;
      throw err;
    }

    const email = data.user.email ?? "";

    // HU-02: solo se permite el dominio institucional
    if (!email.endsWith(ALLOWED_DOMAIN)) {
      const err = new Error(
        `Acceso restringido. Solo se permite el correo institucional ${ALLOWED_DOMAIN}.`
      );
      err.status = 403;
      throw err;
    }

    return data.user;
  },
};
