export const formatCodeForEval = (code) => {
    return code
        // Normalizar saltos de línea (Windows usa \r\n, Mac antiguo \r)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        // Eliminar líneas que sean solo espacios/tabs
        .replace(/^[ \t]+$/gm, "")
        // Eliminar espacios/tabs al final de cada línea
        .replace(/[ \t]+$/gm, "")
        // Eliminar líneas en blanco al inicio y al final del código
        .trim();
};