import React, { useState, useRef, useEffect } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import "./DES.css";

import Welcome from "../../../assets/welcome.gif";
import Study from "../../../assets/study.gif";
import Help from "../../../assets/help.gif";

import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";

import { gsap } from "gsap";

/* ---------------------------
   Tablas DES (constantes)
   --------------------------- */
// Permutación inicial (IP)
const IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

// Permutación inversa (IP⁻¹)
const IP_INV = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

// Expansión E (32 -> 48)
const E = [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1
];

// Permutación P (32 bits)
const P = [
    16, 7, 20, 21, 29, 12, 28, 17,
    1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9,
    19, 13, 30, 6, 22, 11, 4, 25
];

// S-boxes (8 cajas)
const SBOX = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
];

// PC-1 y PC-2 para key schedule
const PC1 = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
];

const PC2 = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
];

// Rotaciones por ronda (desplazamientos)
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

/* ---------------------------
   Funciones auxiliares
   --------------------------- */

// Convierte hex -> binario (string)
function hexToBin(hex) {
    return hex
        .padStart(16, "0")
        .split("")
        .map(h => parseInt(h, 16).toString(2).padStart(4, "0"))
        .join("");
}

// Convierte binario (string) -> hex (uppercase)
function binToHex(bin) {
    const groups = bin.match(/.{1,4}/g) || [];
    return groups.map(g => parseInt(g, 2).toString(16)).join("").toUpperCase();
}

// Aplica una permutación (tabla) sobre un string de bits
function permute(inputBits, table) {
    return table.map(pos => inputBits[pos - 1]).join("");
}

// Rotación cíclica a la izquierda sobre string de bits
function rotateLeft(bitStr, n) {
    return bitStr.slice(n) + bitStr.slice(0, n);
}

// XOR bit a bit (dos strings iguales de length)
function xorBits(a, b) {
    let out = "";
    for (let i = 0; i < a.length; i++) out += a[i] === b[i] ? "0" : "1";
    return out;
}

/* ---------------------------
   Key schedule y funciones f
   --------------------------- */

// Genera 16 subclaves (48 bits) a partir de una clave hex (16 hex chars)
function generateSubkeys(keyHex) {
    // keyHex => 64 bits hex -> bin
    const keyBin = hexToBin(keyHex);
    const perm56 = permute(keyBin, PC1); // 56 bits
    let C = perm56.slice(0, 28);
    let D = perm56.slice(28, 56);
    const subkeys = [];
    for (let i = 0; i < 16; i++) {
        C = rotateLeft(C, SHIFTS[i]);
        D = rotateLeft(D, SHIFTS[i]);
        const CD = C + D; // 56 bits
        const Ki = permute(CD, PC2); // 48 bits
        subkeys.push(Ki);
    }
    return subkeys;
}

// Aplica las S-boxes: entrada 48 bits (8 grupos de 6) -> salida 32 bits
function sboxSubstitute(bits48) {
    const groups = bits48.match(/.{1,6}/g) || [];
    let out = "";
    for (let i = 0; i < 8; i++) {
        const g = groups[i];
        const row = parseInt(g[0] + g[5], 2);
        const col = parseInt(g.slice(1, 5), 2);
        const val = SBOX[i][row][col];
        out += val.toString(2).padStart(4, "0");
    }
    return out;
}

// Función Feistel f(R, Ki)
function feistelFunction(R32, Ki48) {
    const expanded = permute(R32, E);        // 48 bits
    const xored = xorBits(expanded, Ki48);   // 48 bits
    const substituted = sboxSubstitute(xored); // 32 bits
    const permuted = permute(substituted, P); // 32 bits
    return permuted;
}

function desEncryptBlock(plainHex, keyHex, traceEnabled = false) {
    const plainBin = hexToBin(plainHex);
    const subkeys = generateSubkeys(keyHex);

    // Permutación inicial
    const ipBits = permute(plainBin, IP);
    let L = ipBits.slice(0, 32);
    let R = ipBits.slice(32, 64);

    const steps = [];
    if (traceEnabled) {
        steps.push({ ip: binToHex(ipBits) });
    }

    // 16 rondas Feistel
    for (let i = 0; i < 16; i++) {
        const fOut = feistelFunction(R, subkeys[i]);
        const newR = xorBits(L, fOut);
        L = R;
        R = newR;

        if (traceEnabled) {
            steps.push({
                round: i + 1,
                subkey: binToHex(subkeys[i]),
                fOut: binToHex(fOut),
                L: binToHex(L),
                R: binToHex(R),
            });
        }
    }

    // Swap final + IP inversa
    const preOutput = R + L; // R16 || L16
    const cipherBin = permute(preOutput, IP_INV);
    const cipherHex = binToHex(cipherBin);

    if (traceEnabled) {
        return { cipherHex, steps };
    }
    return cipherHex;
}

function DES() {
    // --- Estado general ---
    const [showModes, setShowModes] = useState(false);
    const [selectedMode, setSelectedMode] = useState(null);

    // interaction inputs
    const [plainHex, setPlainHex] = useState('0123456789ABCDEF');
    const [keyHex, setKeyHex] = useState('133457799BBCDFF1');
    const [cipherHex, setCipherHex] = useState('');
    const [trace, setTrace] = useState(null);

    // ---------- REFS PARA GSAP ----------
    const heroRef = useRef(null);
    const heroCircleRef = useRef(null);
    const heroMascotRef = useRef(null);
    const bandBinaryRef = useRef(null);
    const mathBinaryRef = useRef(null);
    const mathAlphaRef = useRef(null);
    const gameAlphaRef = useRef(null);

    function runEncrypt(traceEnabled = true) {
        try {
            const result = desEncryptBlock(plainHex, keyHex, traceEnabled);
            if (traceEnabled) {
                setTrace(result.steps);
                setCipherHex(result.cipherHex);
            } else {
                setCipherHex(result);
                setTrace(null);
            }
        } catch (e) {
            console.error(e);
            setCipherHex('ERROR');
            setTrace(null);
        }
    }

    // initialize with example
    useEffect(() => { runEncrypt(true); }, []);

    return (
        <div className="des-page">
            <div className="container des-shell">
                {/* HERO */}
                <section className="des-hero">
                    <div className="hero-copy" ref={heroRef}>
                        <span className="hero-badge">Lección · Cifrado por Bloques</span>
                        <h1>
                            Juega con el{' '}
                            <DecryptedText
                                text="DES"
                                className="hero-copy-tittle"
                                encryptedClassName="hero-copy-tittle text-encrypted"
                                speed={120}
                                maxIterations={60}
                            />
                        </h1>
                        <div>
                            <TextType
                                text="Cifrado simétrico de bloque que opera sobre bloques de 64 bits con claves efectivas de 56 bits. Fue estándar durante décadas, pero hoy se considera vulnerable frente a ataques de fuerza bruta. Variantes como 2DES y 3DES aplican múltiples rondas para ampliar la seguridad y la vida útil."
                                as="span"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                        </div>
                    </div>

                    <div className="hero-visual">
                        <img
                            src={Welcome}
                            alt="CypherFox dando la bienvenida al DES"
                            className="hero-mascot"
                            ref={heroMascotRef}
                        />
                        <div className="hero-circle hero-circle-main" ref={heroCircleRef}>
                            <div className="hero-circle-inner">DES</div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

                {/* FRANJA 1: Laboratorio binario + explicación matemática XOR */}
                <section className="des-band band-binary">
                    <div className="band-binary-inner" ref={bandBinaryRef}>
                        <div className="lab-core">
                            <h2>
                                <DecryptedText
                                    text="Laboratorio: cifra un bloque"
                                    className="hero-copy-tittle"
                                    encryptedClassName="hero-copy-tittle text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h2>
                            <header className="lab-header-row row g-2 align-items-start">
                                {/* Columna izquierda: título + 2 líneas de descripción (6 columnas en lg) */}
                                <div className="col-12 col-lg-6">
                                    <div className="lab-subtitle">
                                        <TextType
                                            text="Aquí puedes cifrar cualquier bloque de 64 bits (16 hex chars) con una clave de 64 bits (16 hex chars). El resultado es el bloque cifrado en hexadecimal. También puedes activar el trazado paso a paso para ver cómo se transforma el bloque en cada ronda."
                                            as="span"
                                            typingSpeed={25}
                                            deletingSpeed={65}
                                            pauseDuration={1800}
                                            textColors={["var(--cf-text)"]}
                                        />
                                    </div>
                                </div>

                                {/* Columna derecha: botones (4 columnas en lg) */}
                                <div className="col-12 col-lg-4 d-flex flex-column align-items-lg-end align-items-start">
                                    <button
                                        type="button"
                                        className="math-help-button"
                                        onClick={() => setShowModes(true)}
                                    >
                                        ¿Modos de Operación?
                                    </button>
                                </div>
                            </header>

                            <div className="game-tip">
                                <TextType
                                    text="Podrás ver el resultado de cada paso en la sección de trazado, incluyendo la IP, las subclaves, las salidas de f, y los valores de L y R en cada ronda."
                                    as="p"
                                    typingSpeed={25}
                                    deletingSpeed={65}
                                    pauseDuration={1800}
                                    textColors={["var(--cf-text)"]}
                                />
                            </div>

                            <div className="trace-area">
                                <h3>Trazado paso a paso</h3>
                                {trace && trace.length > 0 && (
                                    <div className="trace-list">
                                        <div className="trace-item">
                                            <strong>IP (bits):</strong>
                                            <pre>{trace.length > 0 && trace[0].ip ? trace[0].ip : '(mostrado parcialmente en rondas)'}</pre>
                                        </div>
                                        {trace.filter(t => t.round).map((t, idx) => (
                                            <div key={idx} className="trace-item">
                                                <strong>Ronda {t.round}</strong>
                                                <div className="trace-grid">
                                                    <div><small>Subclave k{t.round} (48b)</small><pre className="mono">{t.subkey}</pre></div>
                                                    <div><small>f(R, k)</small><pre className="mono">{t.fOut}</pre></div>
                                                    <div><small>L_{t.round}</small><pre className="mono">{t.L}</pre></div>
                                                    <div><small>R_{t.round}</small><pre className="mono">{t.R}</pre></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <img
                                src={Study}
                                alt="CypherFox estudiando bits y XOR"
                                className="math-mascot"
                            />
                        </div>

                        {/* Pizarra matemática binaria */}
                        <aside className="history-floating">
                            <h3>
                                <DecryptedText
                                    text="Resumen matemático"
                                    className="h2"
                                    encryptedClassName="h2 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h3>
                            <TextType
                                text="DES aplica: IP → 16 rondas Feistel → IP⁻¹."
                                as="p"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                            <BlockMath math="L_i = R_{i-1},\; R_i = L_{i-1} \oplus f(R_{i-1},k_i)" />
                        </aside>
                    </div>
                </section>

                {/* FRANJA 2: OTP en alfabeto completo */}
                <section className="des-band band-alpha">
                    <div className="band-grid">
                        {/* Pizarra matemática alfabética */}
                        <div className="card-free math-card" ref={mathAlphaRef}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2>
                                        <DecryptedText
                                            text="Explicación paso a paso"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                </div>
                            </div>
                            <p>Usamos el vector clásico de ejemplo:</p>
                            <div className="example-params">
                                <div><strong>Mensaje (hex):</strong> 0123456789ABCDEF</div>
                                <div><strong>Clave (hex):</strong> 133457799BBCDFF1</div>
                            </div>

                            <strong>1) Generación de subclaves</strong>
                            <p>
                                La clave de 64 bits contiene 8 bits de paridad. Se aplica <InlineMath math="\text{PC-1}" />
                                para obtener 56 bits y se divide en <InlineMath math="C_0" /> (28 bits) y <InlineMath math="D_0" />
                                (28 bits). Luego para cada ronda se rotan (1 o 2 bits) y se aplica <InlineMath math="\text{PC-2}" />
                                para obtener <InlineMath math="k_i" /> (48 bits).
                            </p>

                            <strong>2) Permutación Inicial (IP)</strong>
                            <p>
                                El bloque de 64 bits se reordena con la tabla IP y se divide en <InlineMath math="L_0 | R_0" />
                                {" "}(32 bits cada uno).
                            </p>

                            <strong>3) Rondas <InlineMath math="(i = 1..16)" /> </strong>
                            <p>Cada ronda hace:</p>
                            <BlockMath math="L_i = R_{i-1}" />
                            <BlockMath math="R_i = L_{i-1} \oplus f(R_{i-1},k_i)" />
                            <p>
                                La función <InlineMath math="f" /> consiste en: <InlineMath math="\text{E}(32 → 48 \text{ bits})" />
                                {" "}<InlineMath math="\oplus" /> con la subclave, 8 cajas de
                                <InlineMath math="\text{S-boxes}(6 → 4 \text{ bits}) " /> y una permutación de
                                {" "}<InlineMath math="\text{P}(32 \text{ bits})" />.
                            </p>

                            <strong>4) Permutación Final <InlineMath math="IP^{-1}" /></strong>
                            <p>Al terminar las 16 rondas se concatenan <InlineMath math="R_{16} | L_{16}" /> y se aplica <InlineMath math="IP^{-1}" />
                                {" "}para obtener el texto cifrado final.</p>

                            <strong>5) Resultado numérico</strong>
                            <p>
                                Para <InlineMath math="m = 0123456789ABCDEF" /> y <InlineMath math="k = 133457799BBCDFF1" />, el
                                resultado es <InlineMath math="85E813540F0AB405" />
                            </p>

                            <p>
                                Si te enredas: céntrate en una ronda. Observa <InlineMath math="E(R)" />, la <InlineMath math="\oplus" />
                                {" "}con la subclave, cómo se dividen los <InlineMath math="48" /> bits en <InlineMath math="8" /> grupos
                                de <InlineMath math="6" />, la salida de las <InlineMath math="\text{S-boxes}" /> y la permutación de
                                {" "}<InlineMath math="\text{P}" />.
                            </p>

                            <div className="math-mascot">
                                <img src={Study} alt="CypherFox estudiando" />

                            </div>
                        </div>

                        {/* Juego alfabético */}
                        <div className="card-free game-card" ref={gameAlphaRef}>
                            <h2>
                                <DecryptedText
                                    text="Cifra un bloque"
                                    className="h2"
                                    encryptedClassName="h2 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h2>
                            <TextType
                                text="Introduce un bloque de texto plano (en hexadecimal) y una clave (en hexadecimal) para cifrar usando DES. Puedes usar cualquier valor de 16 caracteres hexadecimales (64 bits). El resultado será el bloque cifrado en hexadecimal. ¡Pruébalo con el vector de ejemplo o con tus propios valores!"
                                as="p"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />

                            <div className="example-controls">
                                <label>
                                    Texto plano (hex, 16 hex digits):
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={plainHex}
                                        onChange={(e) =>
                                            setPlainHex(
                                                e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 16)
                                            )
                                        }
                                        placeholder="Ej. HOLA MUNDO"
                                        maxLength={30}
                                    />
                                </label>
                                <label>
                                    Clave (hex, 16 hex digits):
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={keyHex}
                                        onChange={(e) =>
                                            setKeyHex(
                                                e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 16)
                                            )
                                        }
                                        placeholder="Ej. HOLA MUNDO"
                                        maxLength={30}
                                    />
                                </label>

                            </div>

                            <button onClick={() => runEncrypt(true)} className="run-button">Cifrar</button>

                            <div className="example-results">
                                <div>
                                    <span className="example-label">Resultado</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {cipherHex || "—"}
                                    </ScrambledText>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >

            {/* MODAL MODES */}
            {showModes && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowModes(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header-with-fox">
                            <h3>Modos de Operación</h3>
                            <img src={Help} alt="Mascota ayuda" className="modal-mascot" />
                        </div>

                        <div className="modal-body">
                            <p className="modal-intro">
                                DES cifra bloques de <InlineMath math="n = 64" /> bits. Selecciona
                                un modo para ver su explicación detallada.
                            </p>

                            {/* Tabla interactiva */}
                            <div className="modes-table-wrapper">
                                <table className="modes-table">
                                    <thead>
                                        <tr>
                                            <th>Modo</th>
                                            <th>Plaintext idéntico → mismo cifrado</th>
                                            <th>Encadenamiento</th>
                                            <th>Propaga errores</th>
                                            <th>Recupera errores</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { key: "ecb", label: "ECB", same: true, chain: false, prop: false, rec: false },
                                            { key: "cbc", label: "CBC", same: false, chain: true, prop: true, rec: true },
                                            { key: "cfb", label: "CFB", same: false, chain: true, prop: true, rec: true },
                                            { key: "ofb", label: "OFB", same: false, chain: false, prop: false, rec: true },
                                            { key: "ctr", label: "CTR", same: false, chain: false, prop: false, rec: true },
                                        ].map(({ key, label, same, chain, prop, rec }) => (
                                            <tr
                                                key={key}
                                                className={`mode-row ${selectedMode === key ? "mode-row--active" : ""}`}
                                                onClick={() =>
                                                    setSelectedMode(selectedMode === key ? null : key)
                                                }
                                            >
                                                <td>
                                                    <button className={`mode-badge ${key}`}>{label}</button>
                                                </td>
                                                <td className={same ? "prop-yes" : "prop-no"}>{same ? "✔ SÍ" : "✘ NO"}</td>
                                                <td className={chain ? "prop-yes" : "prop-no"}>{chain ? "✔ SÍ" : "✘ NO"}</td>
                                                <td className={prop ? "prop-yes" : "prop-no"}>{prop ? "✔ SÍ" : "✘ NO"}</td>
                                                <td className={rec ? "prop-yes" : "prop-no"}>{rec ? "✔ SÍ" : rec === null ? "—" : "✘ NO"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Panel de detalle */}
                            <div className="mode-detail-panel">

                                {!selectedMode && (
                                    <p className="mode-detail-placeholder">
                                        👆 Haz clic en una fila para ver los detalles del modo.
                                    </p>
                                )}

                                {selectedMode === "ecb" && (
                                    <div className="mode-card ecb-card">
                                        <div className="mode-card-header ecb-header">
                                            <span className="mode-badge ecb">ECB</span>
                                            <span>Electronic Code Book</span>
                                        </div>
                                        <div className="mode-card-body">
                                            <p>
                                                Funciona como un libro de códigos: cada bloque de texto plano
                                                mapea <strong>siempre al mismo bloque cifrado</strong>. Es el
                                                modo más simple, pero si el mismo patrón aparece en el mensaje,
                                                siempre se cifra igual — su mayor debilidad.
                                            </p>
                                            <div className="pseudo-code">
                                                <span className="pseudo-label">Cifrado</span>
                                                <BlockMath math="C_i = E_k(m_i)" />
                                                <span className="pseudo-label">Descifrado</span>
                                                <BlockMath math="m_i = E_k^{-1}(C_i)" />
                                            </div>
                                            <div className="mode-example">
                                                <span className="example-label">Ejemplo:</span>
                                                <div className="example-row"><InlineMath math="m = \texttt{1011\ 0001\ 0100\ 1010}" /></div>
                                                <div className="example-row"><InlineMath math="c = \texttt{0111\ 0010\ 1000\ 0101}" /></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedMode === "cbc" && (
                                    <div className="mode-card cbc-card">
                                        <div className="mode-card-header cbc-header">
                                            <span className="mode-badge cbc">CBC</span>
                                            <span>Cipher-Block Chaining</span>
                                        </div>
                                        <div className="mode-card-body">
                                            <p>
                                                Cada bloque de texto plano es <strong>XOR-eado con el bloque
                                                    cifrado anterior</strong> antes de cifrarse. Requiere un vector
                                                de inicialización <InlineMath math="IV" />. Patrones idénticos
                                                producen cifrados completamente distintos.
                                            </p>
                                            <div className="pseudo-code">
                                                <span className="pseudo-label">Cifrado</span>
                                                <BlockMath math="C_0 = IV" />
                                                <BlockMath math="C_i = E_k(C_{i-1} \oplus m_i)" />
                                                <span className="pseudo-label">Descifrado</span>
                                                <BlockMath math="m_i = C_{i-1} \oplus E_k^{-1}(C_i)" />
                                            </div>
                                            <div className="mode-example">
                                                <span className="example-label">Ejemplo (<InlineMath math="IV = 1010" />):</span>
                                                <div className="example-row"><InlineMath math="m = \texttt{1011\ 0001\ 0100\ 1010}" /></div>
                                                <div className="example-row"><InlineMath math="c = \texttt{0010\ 0110\ 0100\ 1101}" /></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedMode === "cfb" && (
                                    <div className="mode-card cfb-card">
                                        <div className="mode-card-header cfb-header">
                                            <span className="mode-badge cfb">CFB</span>
                                            <span>Cipher Feedback</span>
                                        </div>
                                        <div className="mode-card-body">
                                            <p>
                                                Similar a CBC pero cifra datos de <InlineMath math="r" /> bits
                                                a la vez (<InlineMath math="r \leq n" />). Ideal para flujos en
                                                tiempo real. El throughput es{" "}
                                                <InlineMath math="\lceil n/r \rceil" /> operaciones por bloque.
                                            </p>
                                            <div className="pseudo-code">
                                                <span className="pseudo-label">Cifrado</span>
                                                <BlockMath math="I_1 = IV" />
                                                <BlockMath math="I_{j+1} = (2^r \cdot I_j + C_j) \mod 2^n" />
                                                <BlockMath math="C_j = m_j \oplus \text{MSB}_r(E_k(I_j))" />
                                                <span className="pseudo-label">Descifrado</span>
                                                <BlockMath math="m_j = C_j \oplus \text{MSB}_r(E_k(I_j))" />
                                            </div>
                                            <div className="mode-example">
                                                <span className="example-label">Ejemplo (<InlineMath math="r=3,\ IV=1010" />):</span>
                                                <div className="example-row"><InlineMath math="m = \texttt{101\ 100\ 010\ 100\ 101}" /></div>
                                                <div className="example-row"><InlineMath math="c = \texttt{111\ 011\ 001\ 101\ 000}" /></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedMode === "ofb" && (
                                    <div className="mode-card ofb-card">
                                        <div className="mode-card-header ofb-header">
                                            <span className="mode-badge ofb">OFB</span>
                                            <span>Output Feedback</span>
                                        </div>
                                        <div className="mode-card-body">
                                            <p>
                                                Casi idéntico a CFB, pero la retroalimentación viene de la{" "}
                                                <strong>salida de la función de cifrado</strong>, no del
                                                ciphertext. Un error en transmisión afecta{" "}
                                                <strong>solo 1 bit</strong> en el descifrado.
                                            </p>
                                            <div className="pseudo-code">
                                                <span className="pseudo-label">Cifrado</span>
                                                <BlockMath math="I_1 = IV" />
                                                <BlockMath math="O_j = \text{MSB}_r(E_k(I_j))" />
                                                <BlockMath math="I_{j+1} = (2^r \cdot I_j + O_j) \mod 2^n" />
                                                <BlockMath math="C_j = m_j \oplus O_j" />
                                                <span className="pseudo-label">Descifrado</span>
                                                <BlockMath math="m_j = C_j \oplus O_j" />
                                            </div>
                                            <div className="mode-example">
                                                <span className="example-label">Ejemplo (<InlineMath math="r=3,\ IV=1010" />):</span>
                                                <div className="example-row"><InlineMath math="m = \texttt{101\ 100\ 010\ 100\ 101}" /></div>
                                                <div className="example-row"><InlineMath math="c = \texttt{111\ 001\ 000\ 001\ 111}" /></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedMode === "ctr" && (
                                    <div className="mode-card ctr-card">
                                        <div className="mode-card-header ctr-header">
                                            <span className="mode-badge ctr">CTR</span>
                                            <span>Counter Mode</span>
                                        </div>
                                        <div className="mode-card-body">
                                            <p>
                                                <strong>Sin retroalimentación.</strong> Usa un{" "}
                                                <strong>contador</strong> que se incrementa en cada bloque,
                                                combinado con un <InlineMath math="\text{nonce}" /> (número
                                                usado una sola vez). Permite cifrado/descifrado{" "}
                                                <strong>en paralelo</strong>.
                                            </p>
                                            <div className="pseudo-code">
                                                <span className="pseudo-label">Cifrado</span>
                                                <BlockMath math="C_i = m_i \oplus E_k(\text{nonce} \parallel i)" />
                                                <span className="pseudo-label">Descifrado</span>
                                                <BlockMath math="m_i = C_i \oplus E_k(\text{nonce} \parallel i)" />
                                            </div>
                                            <div className="mode-note">
                                                💡 <em>
                                                    El <InlineMath math="\text{nonce}" /> es único por sesión;{" "}
                                                    <InlineMath math="\parallel" /> indica concatenación de bits.
                                                </em>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>{/* fin detail panel */}
                        </div>{/* fin modal-body */}

                        <button
                            className="close-button"
                            onClick={() => setShowModes(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

        </div >
    );
}

export default DES;