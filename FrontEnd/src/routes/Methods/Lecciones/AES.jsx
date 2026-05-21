import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import "./AES.css";
import WelcomeGif from "../../../assets/welcome.gif";
import StudyGif from "../../../assets/study.gif";
import HelpGif from "../../../assets/help.gif";
import HappyGif from "../../../assets/happy.gif";
import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";
import { gsap } from "gsap";

/* =========================================================
   Helpers & AES logic
========================================================= */
const SBOX = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
];

const INV_SBOX = (() => {
    const inv = new Array(256).fill(0);
    SBOX.forEach((value, index) => { inv[value] = index; });
    return inv;
})();

const VARIANTS = {
    "AES-128": { nk: 4, nr: 10, keyBytes: 16 },
    "AES-192": { nk: 6, nr: 12, keyBytes: 24 },
    "AES-256": { nk: 8, nr: 14, keyBytes: 32 },
};

const DEFAULT_VARIANT = "AES-128";

const toHex = (n) => n.toString(16).padStart(2, "0").toUpperCase();
const normalizeAscii = (s) => String(s || "").slice(0, 16);
const normalizeHex = (s) => String(s || "").replace(/[^0-9a-f]/gi, "").toUpperCase();
const xorBytes = (a, b) => a.map((v, i) => v ^ b[i]);
const bytesToHex = (bytes) => bytes.map(toHex).join(" ");

function asciiToBytes(text) {
    const clean = normalizeAscii(text);
    return Array.from({ length: 16 }, (_, i) => clean.charCodeAt(i) || 32);
}

function hexToBytes(hex, length) {
    const clean = normalizeHex(hex);
    const bytes = [];
    for (let i = 0; i < clean.length; i += 2) {
        if (bytes.length >= length) break;
        const pair = clean.slice(i, i + 2);
        if (pair.length === 2) bytes.push(parseInt(pair, 16));
    }
    while (bytes.length < length) bytes.push(0x00);
    return bytes;
}

function bytesToMatrix(bytes) {
    return Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => bytes[r * 4 + c]));
}

function matrixToBytes(matrix) {
    return matrix.flat();
}

function subBytes(bytes) {
    return bytes.map((b) => SBOX[b]);
}

function invSubBytes(bytes) {
    return bytes.map((b) => INV_SBOX[b]);
}

function shiftRows(bytes) {
    const m = bytesToMatrix(bytes);
    const shifted = m.map((row, r) => row.slice(r).concat(row.slice(0, r)));
    return matrixToBytes(shifted);
}

function invShiftRows(bytes) {
    const m = bytesToMatrix(bytes);
    const shifted = m.map((row, r) => row.slice(4 - r).concat(row.slice(0, 4 - r)));
    return matrixToBytes(shifted);
}

function gmul(a, b) {
    let p = 0;
    let aa = a;
    let bb = b;
    for (let i = 0; i < 8; i++) {
        if (bb & 1) p ^= aa;
        const hiBit = aa & 0x80;
        aa = (aa << 1) & 0xff;
        if (hiBit) aa ^= 0x1b;
        bb >>= 1;
    }
    return p;
}

function mixColumns(bytes) {
    const m = bytesToMatrix(bytes);
    const out = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let c = 0; c < 4; c++) {
        const a0 = m[0][c], a1 = m[1][c], a2 = m[2][c], a3 = m[3][c];
        out[0][c] = gmul(a0, 2) ^ gmul(a1, 3) ^ a2 ^ a3;
        out[1][c] = a0 ^ gmul(a1, 2) ^ gmul(a2, 3) ^ a3;
        out[2][c] = a0 ^ a1 ^ gmul(a2, 2) ^ gmul(a3, 3);
        out[3][c] = gmul(a0, 3) ^ a1 ^ a2 ^ gmul(a3, 2);
    }
    return matrixToBytes(out);
}

function invMixColumns(bytes) {
    const m = bytesToMatrix(bytes);
    const out = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let c = 0; c < 4; c++) {
        const a0 = m[0][c], a1 = m[1][c], a2 = m[2][c], a3 = m[3][c];
        out[0][c] = gmul(a0, 14) ^ gmul(a1, 11) ^ gmul(a2, 13) ^ gmul(a3, 9);
        out[1][c] = gmul(a0, 9) ^ gmul(a1, 14) ^ gmul(a2, 11) ^ gmul(a3, 13);
        out[2][c] = gmul(a0, 13) ^ gmul(a1, 9) ^ gmul(a2, 14) ^ gmul(a3, 11);
        out[3][c] = gmul(a0, 11) ^ gmul(a1, 13) ^ gmul(a2, 9) ^ gmul(a3, 14);
    }
    return matrixToBytes(out);
}

function formatRows(bytes) {
    return Array.from({ length: 4 }, (_, i) => bytes.slice(i * 4, i * 4 + 4).map(toHex).join(" ")).join("  ");
}

/* =========================================================
   Component
========================================================= */
function AES() {
    const [variant, setVariant] = useState(DEFAULT_VARIANT);
    const [inputText, setInputText] = useState("Advanced Encryption Standard");
    const [keyInput, setKeyInput] = useState("2B7E151628AED2A6ABF7158809CF4F3C");
    const [mode, setMode] = useState("encrypt");
    const [animStep, setAnimStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showMathHelp, setShowMathHelp] = useState(false);
    const [showHistoryHelp, setShowHistoryHelp] = useState(false);
    const [showRoundHelp, setShowRoundHelp] = useState(false);

    const heroRef = useRef(null);
    const heroCircleRef = useRef(null);
    const heroMascotRef = useRef(null);
    const bandLabRef = useRef(null);
    const mathCardRef = useRef(null);
    const gameCardRef = useRef(null);
    const stateRef = useRef(null);

    const variantInfo = VARIANTS[variant];
    const plaintextBytes = useMemo(() => asciiToBytes(inputText), [inputText]);
    const keyBytes = useMemo(() => hexToBytes(keyInput, variantInfo.keyBytes), [keyInput, variantInfo.keyBytes]);
    const roundKey = useMemo(() => keyBytes.slice(0, 16), [keyBytes]);

    const validation = useMemo(() => {
        const clean = normalizeHex(keyInput);
        const expected = variantInfo.keyBytes * 2;
        if (clean.length < expected) return { status: "incomplete", msg: `Faltan ${expected - clean.length} dígitos hexadecimales.` };
        if (clean.length > expected) return { status: "toomany", msg: `Sobran dígitos; solo se usan los primeros ${expected}.` };
        return { status: "valid", msg: `Clave válida para ${variant}.` };
    }, [keyInput, variant, variantInfo.keyBytes]);

    const isValid = validation.status === "valid" || validation.status === "toomany";

    const encryptStates = useMemo(() => {
        const ark = xorBytes(plaintextBytes, roundKey);
        const sb = subBytes(ark);
        const sr = shiftRows(sb);
        const mc = mixColumns(sr);
        return { start: plaintextBytes, ark, sb, sr, mc };
    }, [plaintextBytes, roundKey]);

    const decryptStates = useMemo(() => {
        const cipher = encryptStates.mc;
        const imc = invMixColumns(cipher);
        const isr = invShiftRows(imc);
        const isb = invSubBytes(isr);
        const ark = xorBytes(isb, roundKey);
        return { start: cipher, imc, isr, isb, ark };
    }, [encryptStates.mc, roundKey]);

    const activeBytes = useMemo(() => {
        if (mode === "encrypt") {
            return [encryptStates.start, encryptStates.ark, encryptStates.sb, encryptStates.sr, encryptStates.mc][animStep];
        }
        return [decryptStates.start, decryptStates.imc, decryptStates.isr, decryptStates.isb, decryptStates.ark][animStep];
    }, [mode, animStep, encryptStates, decryptStates]);

    const activeLabel = useMemo(() => {
        if (mode === "encrypt") return ["Estado inicial", "AddRoundKey", "SubBytes", "ShiftRows", "MixColumns"][animStep];
        return ["Estado cifrado", "InvMixColumns", "InvShiftRows", "InvSubBytes", "AddRoundKey"][animStep];
    }, [mode, animStep]);

    const stepDescription = useMemo(() => {
        if (mode === "encrypt") {
            return [
                "Se carga el bloque de texto plano en una matriz de 4×4 bytes.",
                "La subclave de ronda se aplica con XOR para volver el proceso dependiente de la clave.",
                "Cada byte pasa por la S-Box para introducir no linealidad.",
                "Las filas se desplazan cíclicamente a la izquierda para repartir la información.",
                "Las columnas se mezclan en GF(2^8) para reforzar la difusión.",
            ][animStep];
        }
        return [
            "Partimos del estado cifrado mostrado como matriz de 4×4 bytes.",
            "Se aplica la transformación inversa de mezcla de columnas.",
            "Las filas se desplazan ahora en sentido inverso.",
            "Cada byte busca su valor original usando la InvSBox.",
            "La clave vuelve a combinarse con XOR para recuperar el texto base.",
        ][animStep];
    }, [mode, animStep]);

    const cipherHex = useMemo(() => bytesToHex(encryptStates.mc), [encryptStates.mc]);
    const clearHex = useMemo(() => bytesToHex(plaintextBytes), [plaintextBytes]);
    const recoveredText = useMemo(() => String.fromCharCode(...decryptStates.ark).replace(/\s+$/g, ""), [decryptStates.ark]);

    const stepForward = useCallback(() => { if (animStep < 4) setAnimStep((s) => s + 1); }, [animStep]);
    const stepBack = useCallback(() => { if (animStep > 0) setAnimStep((s) => s - 1); }, [animStep]);

    const autoAnimate = useCallback(() => {
        if (!isValid || isAnimating) return;
        setIsAnimating(true);
        setAnimStep(0);
        let step = 0;
        const iv = setInterval(() => {
            step += 1;
            if (step <= 4) {
                setAnimStep(step);
                if (stateRef.current) {
                    gsap.fromTo(stateRef.current, { scale: 0.96, opacity: 0.75 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" });
                }
            } else {
                clearInterval(iv);
                setIsAnimating(false);
            }
        }, 850);
    }, [isValid, isAnimating]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline()
                .from(heroRef.current, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" })
                .from(heroCircleRef.current, { opacity: 0, scale: 0.85, duration: 0.5, ease: "back.out(1.4)" }, "-=0.3")
                .from(heroMascotRef.current, { opacity: 0, x: 18, duration: 0.5, ease: "power2.out" }, "-=0.3")
                .from(bandLabRef.current, { opacity: 0, y: 16, duration: 0.55, ease: "power2.out" }, "-=0.1")
                .from(mathCardRef.current, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, "-=0.2")
                .from(gameCardRef.current, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, "-=0.3");
        });
        return () => ctx.revert();
    }, []);

    const renderState = (bytes) => (
        <div className="aes-grid-wrapper">
            <div className="aes-grid aes-grid-4" ref={stateRef}>
                {bytesToMatrix(bytes).map((row, r) =>
                    row.map((cell, c) => (
                        <div key={`${r},${c}`} className="aes-cell aes-cell-active">{toHex(cell)}</div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="aes-page">
            <div className="container aes-shell">
                <section className="aes-hero" ref={heroRef}>
                    <div className="hero-copy">
                        <span className="hero-badge">Lección · Cifrado por bloques</span>
                        <h1 className="hero-copy-tittle">
                            Juega con el{" "}
                            <DecryptedText
                                text="Advanced Encryption Standard"
                                className="hero-copy-tittle"
                                encryptedClassName="hero-copy-tittle text-encrypted"
                                speed={120}
                                maxIterations={60}
                            />
                        </h1>
                        <TextType
                            as="p"
                            text="Un bloque de 128 bits, una clave secreta y una secuencia de transformaciones que mezclan bytes, filas y columnas hasta volver ilegible el mensaje."
                            typingSpeed={25}
                            deletingSpeed={65}
                            pauseDuration={1800}
                            textColors={["var(--cf-text)"]}
                        />
                    </div>
                    <div className="hero-visual">
                        <img ref={heroMascotRef} src={WelcomeGif} alt="Mascota CypherFox" className="hero-mascot" />
                        <div ref={heroCircleRef} className="hero-circle hero-circle-main">
                            <div className="hero-circle-inner">
                                <div className="k-label">Ronda</div>
                                <div className="k-value">{variantInfo.nr}</div>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

                <section className="aes-band band-lab">
                    <div className="band-lab-inner" ref={bandLabRef}>
                        <div className="lab-core">
                            <div className="lab-header-row">
                                <div>
                                    <h2>
                                        <DecryptedText
                                            text="Construye tu estado AES"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                    <p className="lab-subtitle">
                                        Elige una variante, carga un bloque de <strong>16 bytes</strong> y observa cómo una ronda transforma el estado <strong>4×4</strong> mediante <strong>AddRoundKey</strong>, <strong>SubBytes</strong>, <strong>ShiftRows</strong> y <strong>MixColumns</strong>.
                                    </p>
                                </div>
                                <div className="tg-direction-toggle">
                                    <span className="slider-label">Variante AES</span>
                                    <div className="tg-toggle-group">
                                        {Object.keys(VARIANTS).map((name) => (
                                            <button key={name} className={`toggle-btn ${variant === name ? "active" : ""}`} onClick={() => { setVariant(name); setAnimStep(0); }}>
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="aes-lab-grid-row">
                                <div className="aes-builder-side">
                                    <label className="aes-control-block">
                                        <span className="tg-grid-caption">Texto plano (máx. 16 caracteres)</span>
                                        <input type="text" className="form-control" value={inputText} onChange={(e) => { setInputText(e.target.value); setAnimStep(0); }} />
                                    </label>
                                    <label className="aes-control-block">
                                        <span className="tg-grid-caption">Clave hexadecimal</span>
                                        <input type="text" className="form-control" value={keyInput} onChange={(e) => { setKeyInput(e.target.value); setAnimStep(0); }} />
                                    </label>
                                    <div className={`tg-validation-badge tg-badge-${validation.status}`}>
                                        <span className="tg-badge-icon">{validation.status === "valid" ? "✅" : validation.status === "incomplete" ? "🔲" : "⚠️"}</span>
                                        <span>{validation.msg}</span>
                                    </div>
                                    <div className="tg-hole-counter">
                                        {[...Array(variantInfo.keyBytes / 4)].map((_, i) => (
                                            <span key={i} className={`tg-hole-dot ${i < Math.ceil(Math.min(normalizeHex(keyInput).length, variantInfo.keyBytes * 2) / 8) ? "filled" : ""}`} />
                                        ))}
                                        <span className="tg-hole-count">{variantInfo.keyBytes} bytes</span>
                                    </div>
                                </div>

                                <div className="tg-rotations-preview">
                                    <p className="tg-grid-caption">Preview de una ronda</p>
                                    <div className="tg-rotations-row aes-round-previews">
                                        {[encryptStates.start, encryptStates.ark, encryptStates.sb, encryptStates.sr, encryptStates.mc].map((state, index) => (
                                            <div key={index} className="tg-rotation-mini aes-rotation-mini">
                                                <span className="tg-rotation-label">{["Input", "ARK", "SB", "SR", "MC"][index]}</span>
                                                <div className="aes-mini-grid aes-grid-4">
                                                    {bytesToMatrix(state).map((row, r) =>
                                                        row.map((cell, c) => (
                                                            <div key={`${index}-${r}-${c}`} className="aes-mini-cell">{toHex(cell)}</div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="history-floating">
                            <h3>
                                <DecryptedText
                                    text="De Rijndael a AES"
                                    className="h3"
                                    encryptedClassName="h3 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h3>
                            <TextType
                                as="p"
                                text="Rijndael fue creado por Joan Daemen y Vincent Rijmen en 1997. NIST lanzó la iniciativa AES y, tras evaluar 15 candidatos, lo seleccionó en 2001 como nuevo estándar FIPS por su seguridad y eficiencia."
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                            <button className="math-help-button" onClick={() => setShowHistoryHelp(true)}>Leer más →</button>
                        </aside>
                    </div>
                </section>

                {isValid && (
                    <section className="aes-band band-anim">
                        <div className="band-anim-inner">
                            <div className="anim-header">
                                <h2>Visualiza una ronda</h2>
                                <p className="lab-subtitle">Observa cómo cambia la matriz 4×4 en cada transformación de AES.</p>
                            </div>
                            <div className="anim-body">
                                <div className="anim-grid-section">
                                    <div className="anim-step-label">Paso {animStep + 1} de 5 — {activeLabel}</div>
                                    {renderState(activeBytes)}
                                </div>
                                <div className="anim-controls">
                                    <button className="anim-btn" onClick={stepBack} disabled={animStep === 0}>← Anterior</button>
                                    <button className="anim-btn anim-btn-play" onClick={autoAnimate} disabled={isAnimating}>{isAnimating ? "Animando…" : "▶ Auto"}</button>
                                    <button className="anim-btn" onClick={stepForward} disabled={animStep === 4}>Siguiente →</button>
                                </div>
                                <div className="anim-step-desc">
                                    <p>{stepDescription}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="aes-band band-bottom">
                    <div className="band-grid">
                        <div className="card-free math-card" ref={mathCardRef}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2>
                                        <DecryptedText
                                            text="La matemática de AES"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                </div>
                                <button className="math-help-button" onClick={() => setShowRoundHelp(true)}>¿Rondas?</button>
                                <button className="math-help-button" onClick={() => setShowMathHelp(true)}>¿S-Box?</button>
                            </div>

                            <p>
                                AES trabaja sobre una matriz <InlineMath math="4 \times 4" /> de bytes llamada <em>state</em>. El número de rondas depende del tamaño de la clave y cumple <InlineMath math="N_r = N_k + 6" />.
                            </p>
                            <BlockMath math="\text{AES-128}: N_r=10 \qquad \text{AES-192}: N_r=12 \qquad \text{AES-256}: N_r=14" />
                            <p className="math-explanation">
                                Durante el cifrado se aplican, en orden, la suma de clave, la sustitución no lineal, el desplazamiento de filas y la mezcla de columnas:
                            </p>
                            <BlockMath math="\text{AddRoundKey} \rightarrow \text{SubBytes} \rightarrow \text{ShiftRows} \rightarrow \text{MixColumns}" />
                            <p>
                                La transformación de mezcla opera en <strong>GF(2^8)</strong>, mientras que <strong>SubBytes</strong> usa una tabla S-Box para introducir confusión y romper patrones lineales.
                            </p>
                            <ul className="math-list">
                                <li>El bloque siempre tiene <InlineMath math="128" /> bits.</li>
                                <li>La clave puede tener <InlineMath math="128, 192, 256" /> bits.</li>
                                <li>La última ronda omite <InlineMath math="\text{MixColumns}" />.</li>
                            </ul>
                            <img src={StudyGif} alt="Mascota estudiando" className="math-mascot" />
                        </div>

                        <div className="card-free game-card" ref={gameCardRef}>
                            <h2>Cifra y descifra tu bloque</h2>
                            <TextType as="p" text="Usa el mismo bloque y la misma clave para explorar cifrado y descifrado pedagógico dentro de una sola ronda." />

                            <div className="hill-mode-toggle">
                                <button className={`toggle-btn ${mode === "encrypt" ? "active" : ""}`} onClick={() => { setMode("encrypt"); setAnimStep(0); }}>Cifrar</button>
                                <button className={`toggle-btn ${mode === "decrypt" ? "active" : ""}`} onClick={() => { setMode("decrypt"); setAnimStep(0); }}>Descifrar</button>
                            </div>

                            <div className="example-controls">
                                <label>
                                    {mode === "encrypt" ? "Texto en claro" : "Bloque recuperado"}
                                    <input type="text" className="form-control" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ej. Advanced Encryption Standard" />
                                </label>
                            </div>

                            {!isValid && <div className="tg-game-warning">⚠ Configura una clave válida para habilitar el proceso.</div>}

                            <div className="example-results">
                                <div>
                                    <span className="example-label">Estado base</span>
                                    <p style={{ color: "var(--cf-orange)", letterSpacing: "0.1em" }}>{formatRows(plaintextBytes)}</p>
                                </div>

                                <div>
                                    <span className="example-label">Resultado de ronda</span>
                                    <ScrambledText radius={10} duration={5} speed={0.1} className="p">{isValid ? formatRows(encryptStates.mc) : "——"}</ScrambledText>
                                </div>

                                <div>
                                    <span className="example-label">Verificación</span>
                                    <ScrambledText radius={10} duration={5} speed={0.1} className="p">{isValid ? recoveredText || "Advanced Encryption Standard" : "——"}</ScrambledText>
                                </div>
                            </div>

                            {isValid && (
                                <div className="tg-success-banner">
                                    <img src={HappyGif} alt="CypherFox feliz" className="tg-success-gif" />
                                    <p>¡Clave válida y laboratorio activo!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {showHistoryHelp && (
                <div className="modal-backdrop" onClick={() => setShowHistoryHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>Historia de AES</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            AES proviene del cifrado <strong>Rijndael</strong>, diseñado por <strong>Joan Daemen</strong> y <strong>Vincent Rijmen</strong> en 1997. NIST abrió una convocatoria para elegir el nuevo estándar de cifrado simétrico y aceptó 15 candidatos.
                        </p>
                        <h4 style={{ marginTop: "1rem" }}>Selección del estándar</h4>
                        <p>
                            En octubre de 2001, Rijndael fue seleccionado como el nuevo <strong>Advanced Encryption Standard</strong> por su seguridad, eficiencia y facilidad de implementación en hardware y software.
                        </p>
                        <h4 style={{ marginTop: "1rem" }}>Uso actual</h4>
                        <p>
                            AES se convirtió en uno de los pilares de la seguridad moderna. El documento base lo presenta como la tecnología de cifrado más fuerte del momento y distingue entre el uso de AES-128 para datos sensibles y AES-192/AES-256 para niveles más altos de clasificación.
                        </p>
                        <button className="close-button" onClick={() => setShowHistoryHelp(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            {showRoundHelp && (
                <div className="modal-backdrop" onClick={() => setShowRoundHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>¿Cómo funcionan las rondas?</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            AES siempre trabaja con bloques de <InlineMath math="128" /> bits, pero el número de rondas depende del tamaño de la clave:
                        </p>
                        <BlockMath math="N_r = N_k + 6" />
                        <ul className="math-list">
                            <li><InlineMath math="AES\text{-}128 \Rightarrow 10" /> rondas</li>
                            <li><InlineMath math="AES\text{-}192 \Rightarrow 12" /> rondas</li>
                            <li><InlineMath math="AES\text{-}256 \Rightarrow 14" /> rondas</li>
                        </ul>
                        <p>
                            La ronda inicial aplica <strong>AddRoundKey</strong>. Las rondas intermedias ejecutan <strong>SubBytes</strong>, <strong>ShiftRows</strong>, <strong>MixColumns</strong> y <strong>AddRoundKey</strong>. La ronda final omite <strong>MixColumns</strong>.
                        </p>
                        <button className="close-button" onClick={() => setShowRoundHelp(false)}>Entendido</button>
                    </div>
                </div>
            )}

            {showMathHelp && (
                <div className="modal-backdrop" onClick={() => setShowMathHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>¿Qué hace la S-Box?</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            La operación <strong>SubBytes</strong> reemplaza cada byte del estado usando una tabla de sustitución llamada <strong>S-Box</strong>. Su objetivo es introducir <strong>no linealidad</strong> y aumentar la confusión del algoritmo.
                        </p>
                        <BlockMath math="b' = S(b)" />
                        <p>
                            En el descifrado se usa la <strong>InvSBox</strong>, que aplica el proceso inverso. Junto con ShiftRows, MixColumns y AddRoundKey, esta tabla convierte a AES en un cifrado resistente a análisis simples de estructura.
                        </p>
                        <button className="close-button" onClick={() => setShowMathHelp(false)}>Entendido</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AES;