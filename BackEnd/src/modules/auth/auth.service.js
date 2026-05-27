// BackEnd/src/modules/auth/auth.service.js
import { supabase } from "../../config/supabase.js";
import { env } from "../../config/env.js";

export const authService = {
  /**
   * Genera la URL de redirección hacia el proveedor OAuth (Google o GitHub).
   * El frontend redirige al usuario a esta URL.
   */
  async getOAuthUrl(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${env.frontendUrl}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      const err = new Error(error.message);
      err.status = 400;
      throw err;
    }

    return { url: data.url };
  },

  /**
   * Intercambia el código de autorización por una sesión de Supabase.
   * Se llama desde el frontend después del callback del proveedor.
   */
  async exchangeCode(code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const err = new Error(error.message);
      err.status = 401;
      throw err;
    }

    return { session: data.session };
  },

  /**
   * Obtiene el usuario autenticado a partir de un JWT.
   */
  async getUserFromToken(token) {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      const err = new Error("Token inválido o expirado.");
      err.status = 401;
      throw err;
    }

    return data.user;
  },

  /**
   * Cierra la sesión activa.
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      const err = new Error(error.message);
      err.status = 500;
      throw err;
    }
  },
};
