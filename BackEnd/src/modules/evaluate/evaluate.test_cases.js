// BackEnd/src/modules/evaluate/evaluate.test_cases.js
import { supabase } from "../../config/supabase.js";

/**
 * Obtiene los casos de prueba desde la base de datos para un algoritmo específico.
 * @param {string} method - El nombre del algoritmo (ej: 'caesar').
 * @returns {Promise<Object|null>} - El payload con encrypt/decrypt o null si no existe.
 */
export const getTestCases = async (method) => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("payload")
    .eq("algoritmo", method)
    .single();

  if (error) {
    console.error(`Error al obtener test cases para ${method}:`, error.message);
    return null;
  }

  return data?.payload;
};