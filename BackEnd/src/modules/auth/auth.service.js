// BackEnd/src/modules/auth/auth.service.js
import { supabase, supabaseFromToken } from "../../config/supabase.js";
import { buildNotasFromSubmissions } from "../../utils/profileGrades.js";

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

    // HU-03: Obtenemos los datos del perfil y sus entregas (submissions)
    // Usamos supabaseFromToken para que la consulta actúe en nombre del usuario (útil si tienes RLS activo)
    const userClient = supabaseFromToken(token);
    const { data: profileData, error: dbError } = await userClient
      .from("profiles")
      .select("id, nombre, correo, rol, submissions(algoritmo, raw_score)")
      .eq("id", data.user.id)
      .single();

    if (dbError) {
      console.error("Error DB Profiles:", dbError.message, dbError.code);
      const err = new Error(dbError.code === 'PGRST116' ? "Perfil no encontrado." : "Error de base de datos.");
      err.status = dbError.code === 'PGRST116' ? 404 : 500;
      throw err;
    }

    if (!profileData) {
      const err = new Error("No se encontró un perfil de usuario en la base de datos.");
      err.status = 404;
      throw err;
    }

    // Separamos la info del perfil de la lista de submissions
    const { submissions, ...profile } = profileData;

    // Procesamos las notas usando tu utilidad para quedarnos solo con la mejor por algoritmo
    const bestNotasMap = buildNotasFromSubmissions(submissions);

    // Convertimos el objeto de mejores notas al formato de array que espera el FrontEnd
    profile.notas = Object.values(bestNotasMap).map(item => ({
      metodo: item.algoritmo,
      nota: item.nota
    }));

    return profile;
  },
};
