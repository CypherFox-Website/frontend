// FrontEnd/src/util/auth.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ALLOWED_DOMAIN = "@unal.edu.co";

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback`},
  });

  if (error) throw new Error(error.message);
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session ?? null;
}

export async function getUser() {
  const session = await getSession();
  if (!session) return null;
  const user = session.user;
  if (!user.email?.endsWith(ALLOWED_DOMAIN)) return null;
  return user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export const onAuthChange = onAuthStateChange;

export async function getAccessToken() {
  const session = await getSession();
  return session?.access_token ?? null;
}