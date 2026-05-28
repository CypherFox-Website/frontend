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

export function buildNotasForTeacher(submissions = [], dueDates = []) {
    const scoresMap = {};
    const dueDatesMap = {};

    for (const item of dueDates) {
        dueDatesMap[item.algoritmo] = item.due_date;
    }

    for (const nombreVisible in algoritmos) {
        scoresMap[nombreVisible] = {
            algoritmo: nombreVisible,
            nota: 0,
        };
    }

    for (const submission of submissions) {
        const algoritmoDb = submission.algoritmo;
        const rawScore = Number(submission.raw_score ?? 0);
        const nombreVisible = Object.keys(algoritmos).find((key) => algoritmos[key] === algoritmoDb);

        if (!nombreVisible) continue;
        const dueDate = dueDatesMap[algoritmoDb];

        const penalty = getPenalty(submission.submitted_at, dueDate);
        const finalScore = Math.max(0, rawScore - penalty);
        if (finalScore > scoresMap[nombreVisible].nota) scoresMap[nombreVisible].nota = finalScore;
    }
    return scoresMap;
}

function getPenalty(submittedAt, dueDate) {
    if (!submittedAt || !dueDate) return 0;
    const submittedMs = new Date(submittedAt).getTime();
    const dueMs = new Date(dueDate).getTime();

    if (Number.isNaN(submittedMs) || Number.isNaN(dueMs)) return 0;
    const delayMs = submittedMs - dueMs;

    if (delayMs <= 0) return 0;

    const HOUR = 60 * 60 * 1000;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY; // Aproximación para un mes (30 días)

    // Aplicar penalizaciones de mayor a menor retraso para asegurar rangos correctos
    if (delayMs > MONTH) { // Después de 1 mes
        return 2.0;
    } else if (delayMs > WEEK && delayMs <= MONTH) { // Después de 7 días pero antes o igual a 1 mes
        // Esta regla cubre el rango (7 días, 1 mes]
        return 1.5;
    } else if (delayMs > DAY && delayMs <= WEEK) { // Después de 24 horas pero antes o igual a 7 días
        // Esta regla cubre el rango (24 horas, 7 días]
        return 1.0;
    } else if (delayMs > 6 * HOUR && delayMs <= DAY) { // Después de 6 horas pero antes o igual a 24 horas
        // Esta regla cubre el rango (6 horas, 24 horas]
        return 0.5;
    } else if (delayMs > 0 && delayMs <= 6 * HOUR) { // Entre 0 y 6 horas de retraso
        return 0.2;
    }
    return 0;
}