// BackEnd\src\modules\evaluate\evaluate.service.js
import { loadPyodide } from "pyodide";
import { supabase, supabaseFromToken } from "../../config/supabase.js";
import { getTestCases } from "./evaluate.test_cases.js";

// Pyodide se carga UNA sola vez al iniciar el servidor
let pyodide = null;
(async () => {
    console.log("Cargando Pyodide...");
    pyodide = await loadPyodide();
    console.log("Pyodide listo ✓");
})();

// Limpia el namespace global de Python entre evaluaciones
const clearPythonNamespace = async () => {
    await pyodide.runPythonAsync(`
    keys_to_delete = [k for k in globals().keys() if not k.startswith('__')]
    for k in keys_to_delete:
        del globals()[k]
  `);
};

// Construye el string de llamada a la función según el método
const buildFunctionCall = (method, tipo, caso) => {
    switch (method) {
        case "caesar":
            return tipo === "encrypt"
                ? `caesar_encrypt(k=${caso.k}, mensaje="${caso.mensaje}")`
                : `caesar_decrypt(k=${caso.k}, cifrado="${caso.cifrado}")`;

        case "vigenere":
            return tipo === "encrypt"
                ? `vigenere_encrypt(mensaje="${caso.mensaje}", clave="${caso.clave}")`
                : `vigenere_decrypt(cifrado="${caso.cifrado}", clave="${caso.clave}")`;

        case "one-time-pad":
            return tipo === "encrypt"
                ? `one_time_pad_encrypt(mensaje="${caso.mensaje}", clave="${caso.clave}")`
                : `one_time_pad_decrypt(cifrado="${caso.cifrado}", clave="${caso.clave}")`;

        case "playfair":
            return tipo === "encrypt"
                ? `playfair_encrypt(mensaje="${caso.mensaje}", clave="${caso.clave}")`
                : `playfair_decrypt(cifrado="${caso.cifrado}", clave="${caso.clave}")`;

        case "hill":
            return tipo === "encrypt"
                ? `hill_encrypt(mensaje="${caso.mensaje}", clave="${caso.clave}")`
                : `hill_decrypt(cifrado="${caso.cifrado}", clave="${caso.clave}")`;

        case "homophonic":
            // clave suele ser la variable 'alfabeto' definida en el config
            return tipo === "encrypt"
                ? `homophonic_encrypt(mensaje="${caso.mensaje}", clave=${caso.clave})`
                : `homophonic_decrypt(cifrado=${JSON.stringify(caso.cifrado)}, clave=${caso.clave})`;

        case "turning-grille":
            const pySentido = caso.sentido ? "True" : "False";
            return tipo === "encrypt"
                ? `turning_grille_encrypt(reticula=${caso.reticula}, sentido=${pySentido}, agujeros=${caso.agujeros}, mensaje="${caso.mensaje}")`
                : `turning_grille_decrypt(reticula=${caso.reticula}, sentido=${pySentido}, agujeros=${caso.agujeros}, clave="${caso.clave}")`;

        case "des":
            return tipo === "encrypt"
                ? `des_encrypt(mensaje="${caso.mensaje}", clave="${caso.clave}")`
                : `des_decrypt(cifrado="${caso.cifrado}", clave="${caso.clave}")`;

        case "aes":
            return tipo === "encrypt"
                ? `aes_encrypt(mensaje="${caso.mensaje}", clave="${caso.clave}")`
                : `aes_decrypt(cifrado="${caso.cifrado}", clave="${caso.clave}")`;

        default:
            throw new Error(`Método desconocido: ${method}`);
    }
};

// Corre los casos de prueba para un tipo (encrypt o decrypt)
const runCases = async (cases, method, tipo) => {
    const results = [];
    for (const caso of (cases || [])) {
        try {
            let got = await pyodide.runPythonAsync(buildFunctionCall(method, tipo, caso));

            // Convertir PyProxy a JS si el resultado es una lista o dict (ej: Homophonic)
            if (got && typeof got.toJs === 'function') {
                got = got.toJs();
            }

            // Comparación profunda usando JSON stringify para manejar arrays/objetos
            const passed = JSON.stringify(got) === JSON.stringify(caso.esperado);

            results.push({
                passed,
                feedback: passed ? "Correcto ✓" : `Incorrecto con los parámetros dados`,
            });
        } catch (e) {
            results.push({
                passed: false,
                feedback: `Error al llamar la función: ${e.message}`,
            });
        }
    }
    return results;
};

export const evaluateService = {
    async evaluate_code({ code = "", method = "", userId = null, token = null }) {
        if (!pyodide) throw new Error("Pyodide aún no está listo, intenta de nuevo.");

        const cases = await getTestCases(method);

        if (!cases) {
            const error = new Error(`Método de cifrado no soportado: ${method}`);
            error.status = 400;
            throw error;
        }

        try {
            // 1. Limpiar namespace del estudiante anterior
            await clearPythonNamespace();
            // 2. Ejecutar el código del estudiante
            await pyodide.runPythonAsync(code);
        } catch (e) {
            // Error de sintaxis o runtime en el código del estudiante
            const error = new Error("Error al ejecutar el código enviado");
            error.status = 400;
            error.hint = e.message;
            throw error;
        }

        // 3. Correr los casos de prueba
        const encryptResults = await runCases(cases.encrypt, method, "encrypt");
        const decryptResults = await runCases(cases.decrypt, method, "decrypt");

        // 4. Calcular score
        const allResults = [...encryptResults, ...decryptResults];
        const passed = allResults.filter((r) => r.passed).length;
        const score = Math.round((passed / allResults.length) * 5);

        // HU-04: Si el usuario está autenticado, guardamos la submission
        if (userId && token) {
            const userClient = supabaseFromToken(token);
            const { error: dbError } = await userClient
                .from("submissions")
                .insert({
                    user_id: userId,
                    algoritmo: method,
                    raw_score: score,
                    passed_cases: passed,
                    total_cases: allResults.length
                });

            if (dbError) {
                console.error("Error al guardar la entrega:", dbError.message);
                // No lanzamos error aquí para que el usuario al menos vea su puntaje
                // aunque no se haya guardado.
            }
        }

        return {
            method,
            score,
            passed,
            total: allResults.length,
            encrypt: {
                passed: encryptResults.filter((r) => r.passed).length,
                total: encryptResults.length,
                results: encryptResults,
            },
            decrypt: {
                passed: decryptResults.filter((r) => r.passed).length,
                total: decryptResults.length,
                results: decryptResults,
            },
        };

    }
}