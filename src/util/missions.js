export const missions_caesar = [
    {
        id: 1,
        title: "Misión 1 · Descubre la clave",
        description:
            "Tenemos el mensaje CAESAR cifrado como QOSGOF. ¿Cual es la clave k para obtener este cifrado?",
        answer: "14",
        hint:
            "Ajusta la clave k hasta que tu disco produzca QOSGOF a partir de CAESAR. Luego escribe el valor de k. (Usando alfabeto inglés)",
    },
    {
        id: 2,
        title: "Misión 2 · Un nuevo abecedario",
        description:
            "Supón que un atacante ha cifrado el silabario de hiragana japonés. ¿Qué tan grande sería este cifrado?",
        answer: "46",
        hint:
            "Tal vez quieras buscar cuántos caracteres tiene ese silabario. Ese número sería el tamaño del espacio de claves.",
    },
    {
        id: 3,
        title: "Misión 3 · ¿Cuántas claves hay?",
        description:
            "Para el alfabeto que usamos día a día, ¿cuántas claves diferentes de César existen en total?",
        answer: "27",
        hint:
            "Piensa en todas las letras que usamos, recuerda que usamos el espaÑol. Cada valor distinto de k define un cifrado distinto.",
    },
    {
        id: 4,
        title: "Misión 4 · La clave que no hace nada",
        description:
            "Hay un valor de k que no cambia ningún mensaje al cifrarlo: el resultado es exactamente el mismo texto en claro. ¿Cuál es ese valor de k?",
        answer: "0",
        hint:
            "Imagina que en tu disco no giras nada. ¿Qué valor de k corresponde a 'no desplazar' las letras?",
    },
    {
        id: 5,
        title: "Misión 5 · Deshacer una clave",
        description:
            "Si cifras un mensaje con k = 5 y luego vuelves a cifrar el resultado con otra clave k', ¿qué valor de k' necesitas para que el mensaje vuelva a ser el original?",
        answer: "21",
        hint:
            "Busca un número k' tal que 5 + k' sea múltiplo de 26. Recuerda que estamos trabajando módulo 26. (Usando alfabeto inglés)",
    },
    {
        id: 6,
        title: "Misión 6 · ¿Misma clave para todo?",
        description:
            "En un cifrado de César, ¿usar la misma clave k sirve tanto para cifrar como para descifrar? Responde con SI o NO.",
        answer: "NO",
        hint:
            "Para descifrar usamos D_k(y) = (y - k) mod 26. ¿Es lo mismo restar k que volver a sumar k?",
    },
    {
        id: 7,
        title: "Misión 7 · Alfabeto extendido",
        description:
            "Imagina que amplías tu alfabeto a no solo con las letras minúsculas, sino añadimos también las mayúsculas. ¿Cuántas claves posibles de César habría ahora?",
        answer: "52",
        hint:
            "El número de claves posibles siempre coincide con el tamaño del alfabeto que estás usando. (Usando alfabeto inglés)",
    },
];