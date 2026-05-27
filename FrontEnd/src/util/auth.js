// FrontEnd/src/util/auth.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ALLOWED_DOMAIN = "@unal.edu.co";

/**
 * Inicia sesión con Google.
 * Redirige al usuario al proveedor OAuth — Supabase maneja el callback.
 */
export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
}

/**
 * Obtiene la sesión activa actual.
 * Retorna null si no hay sesión.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session ?? null;
}

/**
 * Obtiene el usuario autenticado actual.
 * Valida que el correo sea @unal.edu.co.
 * Retorna null si no hay sesión o el correo no es institucional.
 */
export async function getUser() {
  const session = await getSession();
  if (!session) return null;

  const user = session.user;
  if (!user.email?.endsWith(ALLOWED_DOMAIN)) return null;

  return user;
}

/**
 * Cierra la sesión activa.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/**
 * Escucha cambios en el estado de autenticación.
 * Útil para actualizar la UI cuando el usuario inicia o cierra sesión.
 *
 * Uso:
 *   const { data: { subscription } } = onAuthChange((session) => { ... });
 *   // Para limpiar: subscription.unsubscribe();
 */
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}

/**
 * Retorna el access token del usuario actual.
 * Se usa para llamar al backend con Authorization: Bearer <token>.
 */
export async function getAccessToken() {
  const session = await getSession();
  return session?.access_token ?? null;
}
