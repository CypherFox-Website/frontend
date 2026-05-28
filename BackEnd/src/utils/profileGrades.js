// BackEnd/src/utils/profileGrades.js

const algoritmos = {
    "One-Time Pad": "one-time-pad",
    "Playfair": "playfair",
    "Caesar": "caesar",
    "Vigenere": "vigenere",
    "Hill": "hill",
    "Homophonic": "homophonic",
    "Turning Grille": "turning-grille",
    "DES": "des",
    "AES": "aes"
}

export function buildNotasFromSubmissions(submissions = []) {
    const scoresMap = {};

    // Inicializamos todos los algoritmos definidos con nota 0
    // Esto asegura que si no hay entregas, el Front reciba la lista completa con 0
    for (const nombreVisible in algoritmos) {
        scoresMap[nombreVisible] = {
            algoritmo: nombreVisible,
            nota: 0,
        };
    }

    for (const submission of submissions) {
        const algoritmoDb = submission.algoritmo;
        const rawScore = Number(submission.raw_score ?? 0);

        // Buscamos el nombre del frontend que corresponde al valor de la base de datos
        const nombreVisible = Object.keys(algoritmos).find(
            (key) => algoritmos[key] === algoritmoDb
        );

        if (nombreVisible && rawScore > scoresMap[nombreVisible].nota) {
            scoresMap[nombreVisible].nota = rawScore;
        }
    }

    return scoresMap;
}