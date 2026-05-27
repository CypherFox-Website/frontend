import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, onAuthStateChange } from '../util/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = todavía cargando

  useEffect(() => {
    // Carga inicial de la sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
    });

    // Escucha cambios: login, logout, expiración
    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isLoading = session === undefined;
  const user = session?.user ?? null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ session, user, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
