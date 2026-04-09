import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import "./TurningGrille.css";
import WelcomeGif from "../../../assets/welcome.gif";
import StudyGif from "../../../assets/study.gif";
import HelpGif from "../../../assets/help.gif";
import HappyGif from "../../../assets/happy.gif";
import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";
import { gsap } from "gsap";

/* =========================================================
   Helpers & Cipher logic
========================================================= */
// Normalize and protect inputs: always returns uppercase letters with no whitespace
const normalize = (s) => String(s || "").replace(/\s+/g, "").toUpperCase();

function rotateHoles(holes, n, anticlockwise) {
  if (anticlockwise) return holes.map(([r, c]) => [n - 1 - c, r]);
  return holes.map(([r, c]) => [c, n - 1 - r]);
}

function getHolesForStep(initialHoles, step, n, anticlockwise) {
  let h = initialHoles;
  for (let i = 0; i < step; i++) h = rotateHoles(h, n, anticlockwise);
  return h;
}

function isValidGrille(holes, n) {
  const allPositions = new Set();
  let current = holes;
  for (let i = 0; i < 4; i++) {
    for (const [r, c] of current) {
      const key = `${r},${c}`;
      if (allPositions.has(key)) return { valid: false, conflictStep: i };
      allPositions.add(key);
    }
    current = rotateHoles(current, n, false);
  }
  return { valid: allPositions.size === n * n, conflictStep: -1 };
}

// Signatures use (holesArray, n, anticlockwise, message)
function turningGrilleEncrypt(holes, n, anticlockwise, message = "") {
  const clean = normalize(message);
  const totalCells = n * n;
  const padded = clean.padEnd(totalCells, "X").slice(0, totalCells);
  const matrix = Array.from({ length: n }, () => Array(n).fill(""));
  let pos = 0;
  let currentHoles = holes;
  for (let step = 0; step < 4; step++) {
    const sorted = [...currentHoles].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    for (const [r, c] of sorted) {
      if (pos < padded.length) {
        matrix[r][c] = padded[pos++];
      }
    }
    currentHoles = rotateHoles(currentHoles, n, anticlockwise);
  }
  const flat = matrix.flat().join("");
  return Array.from({ length: n }, (_, i) => flat.slice(i * n, (i + 1) * n)).join(" ");
}

function turningGrilleDecrypt(holes, n, anticlockwise, cipher = "") {
  const clean = normalize(cipher);
  const total = n * n;
  const padded = clean.padEnd(total, "X").slice(0, total);
  // build matrix row-major
  const matrix = Array.from({ length: n }, (_, r) => padded.slice(r * n, r * n + n).split(""));
  const extracted = [];
  let currentHoles = holes;
  for (let step = 0; step < 4; step++) {
    const sorted = [...currentHoles].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    for (const [r, c] of sorted) {
      extracted.push(matrix[r][c] ?? "X");
    }
    currentHoles = rotateHoles(currentHoles, n, anticlockwise);
  }
  const msg = extracted.join("");
  return Array.from({ length: n }, (_, i) => msg.slice(i * n, (i + 1) * n)).join(" ");
}

/* =========================================================
   Component
========================================================= */
const DEFAULT_N = 4;

function TurningGrille() {
  // state
  const [n] = useState(DEFAULT_N); // keep grid size fixed here; adapt if you want selectable sizes
  const [holes, setHoles] = useState(new Set(["0,0", "2,1", "2,3", "3,2"]));
  const [anticlockwise, setAnticlockwise] = useState(true);
  const [inputText, setInputText] = useState("JIMA TTAC KSAT DAWN");
  const [mode, setMode] = useState("encrypt"); // 'encrypt' or 'decrypt'
  const [animStep, setAnimStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMathHelp, setShowMathHelp] = useState(false);
  const [showHistoryHelp, setShowHistoryHelp] = useState(false);
  const [showRotationHelp, setShowRotationHelp] = useState(false);

  // refs for animations
  const heroRef = useRef(null);
  const heroCircleRef = useRef(null);
  const heroMascotRef = useRef(null);
  const bandLabRef = useRef(null);
  const mathCardRef = useRef(null);
  const gameCardRef = useRef(null);
  const grilleRef = useRef(null);

  // derived
  const holesList = useMemo(() => [...holes].map((k) => k.split(",").map(Number)), [holes]);
  const REQUIRED_HOLES = (n * n) / 4;

  const validation = useMemo(() => {
    if (holes.size < REQUIRED_HOLES)
      return { status: "incomplete", msg: `Selecciona ${REQUIRED_HOLES - holes.size} agujero(s) más.` };
    if (holes.size > REQUIRED_HOLES)
      return { status: "toomany", msg: `Tienes demasiados agujeros (${holes.size}). Deben ser ${REQUIRED_HOLES}.` };
    const { valid, conflictStep } = isValidGrille(holesList, n);
    if (!valid) return { status: "invalid", msg: `Grilla inválida: solapamiento en rotación ${conflictStep + 1}.` };
    return { status: "valid", msg: `¡Grilla válida!` };
  }, [holes, holesList, n]);

  const isValid = validation.status === "valid";

  const currentStepHoles = useMemo(() => new Set(getHolesForStep(holesList, animStep, n, anticlockwise).map(([r, c]) => `${r},${c}`)), [holesList, animStep, n, anticlockwise]);

  const normalizedInput = useMemo(() => normalize(inputText), [inputText]);

  // encryptedText: when encrypt mode, compute from input (writing through holes);
  // when decrypt mode, format user's ciphertext into rows for display
  const encryptedText = useMemo(() => {
    if (!isValid) return "——";
    if (mode === "encrypt") {
      return turningGrilleEncrypt(holesList, n, anticlockwise, inputText);
    }
    // mode === 'decrypt' -> show user-provided ciphertext formatted row-major
    const flat = normalizedInput.padEnd(n * n, "X").slice(0, n * n);
    return Array.from({ length: n }, (_, i) => flat.slice(i * n, (i + 1) * n)).join(" ");
  }, [isValid, holesList, n, anticlockwise, inputText, normalizedInput, mode]);

  // decryptedText: always compute by running turningGrilleDecrypt on row-major ciphertext
  const decryptedText = useMemo(() => {
    if (!isValid) return "——";
    const cipherForDecrypt = mode === "encrypt" ? encryptedText : normalizedInput.padEnd(n * n, "X").slice(0, n * n).match(new RegExp(`.{1,${n}}`, "g")).join(" ");
    return turningGrilleDecrypt(holesList, n, anticlockwise, cipherForDecrypt);
  }, [isValid, holesList, n, anticlockwise, encryptedText, normalizedInput, mode]);

  // build filledMatrix for visualization
  const filledMatrix = useMemo(() => {
    const matrix = Array.from({ length: n }, () => Array(n).fill(""));
    if (!isValid) return matrix;

    if (mode === "encrypt") {
      const clean = normalize(inputText).padEnd(n * n, "X").slice(0, n * n);
      let pos = 0;
      let current = holesList.map((h) => [...h]);
      for (let step = 0; step < 4; step++) {
        if (step > animStep) break;
        const sorted = current.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        for (const [r, c] of sorted) {
          matrix[r][c] = clean[pos++] || "X";
        }
        current = rotateHoles(current, n, anticlockwise);
      }
      return matrix;
    }

    // decrypt: fill row-major with the ciphertext provided by user (normalizedInput)
    const flat = normalizedInput.padEnd(n * n, "X").slice(0, n * n);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) matrix[r][c] = flat[r * n + c];
    return matrix;
  }, [isValid, holesList, n, anticlockwise, animStep, inputText, normalizedInput, mode]);

  // toggle cell
  const toggleCell = useCallback((r, c) => {
    const key = `${r},${c}`;
    setHoles((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    setAnimStep(0);
  }, []);

  // animation controls
  const stepForward = useCallback(() => { if (animStep < 3) setAnimStep((s) => s + 1); }, [animStep]);
  const stepBack = useCallback(() => { if (animStep > 0) setAnimStep((s) => s - 1); }, [animStep]);

  const autoAnimate = useCallback(() => {
    if (!isValid || isAnimating) return;
    setIsAnimating(true);
    setAnimStep(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      if (step <= 3) {
        setAnimStep(step);
        if (grilleRef.current) {
          gsap.fromTo(grilleRef.current, { rotation: 0 }, {
            rotation: anticlockwise ? -90 : 90,
            duration: 0.5, ease: "power2.inOut",
            onComplete: () => gsap.set(grilleRef.current, { rotation: 0 }),
          });
        }
      } else {
        clearInterval(iv);
        setIsAnimating(false);
      }
    }, 850);
  }, [isValid, isAnimating, anticlockwise]);

  // GSAP entrance
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

  // render grid
  const renderGrille = (interactive = false) => (
    <div className="tg-grid-wrapper">
      <div className={`tg-grid tg-grid-${n}`} ref={interactive ? null : grilleRef}>
        {Array.from({ length: n }, (_, r) =>
          Array.from({ length: n }, (_, c) => {
            const key = `${r},${c}`;
            const isHole = interactive ? holes.has(key) : currentStepHoles.has(key);
            const hasLetter = !interactive && filledMatrix[r][c] !== "";
            const isCurrentStep = !interactive && currentStepHoles.has(key);
            return (
              <div
                key={key}
                className={[
                  "tg-cell",
                  isHole ? "tg-cell-hole" : "tg-cell-solid",
                  hasLetter && !isCurrentStep ? "tg-cell-filled" : "",
                  hasLetter && isCurrentStep ? "tg-cell-active" : "",
                  interactive ? "tg-cell-interactive" : "",
                ].join(" ")}
                onClick={interactive ? () => toggleCell(r, c) : undefined}
              >
                {interactive ? (isHole ? "○" : "■") : (filledMatrix[r][c] || (isHole ? "○" : ""))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="tg-page">
      <div className="container tg-shell">
        {/* ════════════ HERO ════════════ */}
                <section className="tg-hero" ref={heroRef}>
                    <div className="hero-copy">
                        <span className="hero-badge">Lección · Cifrado por transposición</span>
                        <h1 className="hero-copy-tittle">
                            Juega con la{" "}
                            <DecryptedText
                                text="Rejilla Girante"
                                className="hero-copy-tittle"
                                encryptedClassName="hero-copy-tittle text-encrypted"
                                speed={120}
                                maxIterations={60}
                            />
                        </h1>
                        <TextType
                            as="p"
                            text="Una rejilla con agujeros, cuatro rotaciones de 90° y un mensaje que aparece celda a celda. Descubre cómo la geometría puede ocultar información."
                            typingSpeed={25}
                            deletingSpeed={65}
                            pauseDuration={1800}
                            textColors={["var(--cf-text)"]}
                        />
                    </div>
                    <div className="hero-visual">
                        <img
                            ref={heroMascotRef}
                            src={WelcomeGif}
                            alt="Mascota CypherFox"
                            className="hero-mascot"
                        />
                        <div ref={heroCircleRef} className="hero-circle hero-circle-main">
                            <div className="hero-circle-inner">
                                <div className="k-label">Paso</div>
                                <div className="k-value">{animStep + 1}/4</div>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

        {/* LAB */}
        <section className="tg-band band-lab">
          <div className="band-lab-inner" ref={bandLabRef}>
            <div className="lab-core">
              <div className="lab-header-row">
                <div>
                  <h2>
                                        <DecryptedText
                                            text="Construye tu rejilla"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                  <p className="lab-subtitle">
                                        Haz clic en las celdas para perforar agujeros. Necesitas exactamente{" "}
                                        <strong>{REQUIRED_HOLES}</strong> agujeros cuyas 4 rotaciones cubran
                                        todas las <strong>{DEFAULT_N * DEFAULT_N}</strong> celdas sin solapamiento.
                                    </p>
                </div>
                <div className="tg-direction-toggle">
                                    <span className="slider-label">Sentido de giro</span>
                                    <div className="tg-toggle-group">
                                        <button
                                            className={`toggle-btn ${!anticlockwise ? "active" : ""}`}
                                            onClick={() => { setAnticlockwise(false); setAnimStep(0); }}
                                        >↻ Horario</button>
                                        <button
                                            className={`toggle-btn ${anticlockwise ? "active" : ""}`}
                                            onClick={() => { setAnticlockwise(true); setAnimStep(0); }}
                                        >↺ Antihorario</button>
                                    </div>
                                </div>
              </div>

              <div className="tg-lab-grid-row">
                <div className="tg-builder-side">
                  <p className="tg-grid-caption">← Haz clic para perforar / tapar</p>
                  {renderGrille(true)}
                  <div className={`tg-validation-badge tg-badge-${validation.status}`}>
                    <span className="tg-badge-icon">{validation.status === "valid" ? "✅" : validation.status === "incomplete" ? "🔲" : "❌"}</span>
                    <span>{validation.msg}</span>
                  </div>
                  <div className="tg-hole-counter">
                    {[...Array(REQUIRED_HOLES)].map((_, i) => (
                      <span key={i} className={`tg-hole-dot ${i < holes.size ? "filled" : ""}`} />
                    ))}
                    <span className="tg-hole-count">{holes.size} / {REQUIRED_HOLES}</span>
                  </div>
                </div>

                <div className="tg-rotations-preview">
                  <p className="tg-grid-caption">Preview de las 4 rotaciones</p>
                  <div className="tg-rotations-row">
                    {[0, 1, 2, 3].map((step) => {
                      const stepHoles = new Set(getHolesForStep(holesList, step, n, anticlockwise).map(([r, c]) => `${r},${c}`));
                      return (
                        <div key={step} className="tg-rotation-mini">
                          <span className="tg-rotation-label">{step === 0 ? "Original" : `+${step * 90}°`}</span>
                          <div className={`tg-mini-grid tg-grid-${n}`}>
                            {Array.from({ length: n }, (_, r) =>
                              Array.from({ length: n }, (_, c) => (
                                <div key={`${r},${c}`} className={`tg-mini-cell ${stepHoles.has(`${r},${c}`) ? "mini-hole" : "mini-solid"}`} />
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Historia flotante */}
                        <aside className="history-floating">
                            <h3>
                                <DecryptedText
                                    text="Una rejilla que gira"
                                    className="h3"
                                    encryptedClassName="h3 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h3>
                            <TextType
                                as="p"
                                text="El cifrado de Rejilla Girante fue inventado por Edouard Fleissner von Wostrowitz en 1881. Una tarjeta perforada se coloca sobre el papel, se escriben letras por los agujeros, luego se gira 90° y se repite. El receptor necesita la misma rejilla para descifrar."
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                            <button className="math-help-button" onClick={() => setShowHistoryHelp(true)}>
                                Leer más →
                            </button>
                        </aside>
          </div>
        </section>

        {/* ANIMACION */}
        {isValid && (
          <section className="tg-band band-anim">
            <div className="band-anim-inner">
              <div className="anim-header">
                <h2>Visualiza el cifrado</h2>
                <p className="lab-subtitle">Observa cómo la rejilla gira 4 veces y va llenando la matriz con las letras del mensaje.</p>
              </div>
              <div className="anim-body">
                <div className="anim-grid-section" ref={grilleRef}>
                  <div className="anim-step-label">Paso {animStep + 1} de 4 — Rotación: {animStep * 90}°</div>
                  {renderGrille(false)}
                </div>
                <div className="anim-controls">
                  <button className="anim-btn" onClick={stepBack} disabled={animStep === 0}>← Anterior</button>
                  <button className="anim-btn anim-btn-play" onClick={autoAnimate} disabled={isAnimating}>{isAnimating ? "Animando…" : "▶ Auto"}</button>
                  <button className="anim-btn" onClick={stepForward} disabled={animStep === 3}>Siguiente →</button>
                </div>
                <div className="anim-step-desc">
                  {animStep === 0 && <p>Posición <strong>original</strong>. Se escriben las primeras {REQUIRED_HOLES} letras por los agujeros.</p>}
                  {animStep === 1 && <p>La rejilla gira <strong>90°</strong>. Se escriben las siguientes {REQUIRED_HOLES} letras.</p>}
                  {animStep === 2 && <p>La rejilla gira <strong>180°</strong>. Tercera tanda de {REQUIRED_HOLES} letras.</p>}
                  {animStep === 3 && <p>La rejilla gira <strong>270°</strong>. Últimas {REQUIRED_HOLES} letras. ¡Matriz completa!</p>}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MATH + GAME */}
        <section className="tg-band band-bottom">
          <div className="band-grid">
            {/* ── MATH CARD ── */}
                        <div className="card-free math-card" ref={mathCardRef}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2>
                                        <DecryptedText
                                            text="La geometría del cifrado"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                </div>
                                <button className="math-help-button" onClick={() => setShowRotationHelp(true)}>¿Rotación?</button>
                                <button className="math-help-button" onClick={() => setShowMathHelp(true)}>¿Validez?</button>
                            </div>

                            <p>
                                La rejilla es una matriz <InlineMath math="n \times n" /> con{" "}
                                <InlineMath math="n^2/4" /> agujeros. La condición de validez es que
                                las posiciones de los agujeros en las 4 rotaciones sean todas
                                distintas y cubran exactamente las <InlineMath math="n^2" /> celdas:
                            </p>
                            <BlockMath math="\bigcup_{k=0}^{3} R^k(H) = \{(r,c) \mid 0 \leq r,c < n\}" />
                            <p className="math-explanation">
                                donde <InlineMath math="H" /> es el conjunto de agujeros originales y{" "}
                                <InlineMath math="R" /> es el operador de rotación 90° en sentido horario:
                            </p>
                            <BlockMath math="R(r, c) = (c,\; n-1-r)" />
                            <p className="math-explanation">
                                Para el giro antihorario:
                            </p>
                            <BlockMath math="R^{-1}(r, c) = (n-1-c,\; r)" />
                            <p>
                                El cifrado es puramente por <strong>transposición</strong>: las letras
                                no cambian, solo reordenan su posición. A diferencia de sustituciones
                                como César o Vigenère, el análisis de frecuencias revela las letras
                                originales de inmediato — la seguridad reside únicamente en el
                                secreto de la rejilla y el orden de rotación.
                            </p>
                            <ul className="math-list">
                                <li>
                                    El espacio de claves para <InlineMath math="n=4" /> es{" "}
                                    <InlineMath math="\binom{16}{4} = 1820" /> grillas posibles,
                                    multiplicado por 2 (sentido horario/antihorario).
                                </li>
                                <li>
                                    Para <InlineMath math="n=6" /> el espacio crece a{" "}
                                    <InlineMath math="\binom{36}{9} \approx 94\,M" /> combinaciones.
                                </li>
                                <li>
                                    Históricamente se usó en combinación con cifrados de sustitución
                                    para aumentar la seguridad global del sistema.
                                </li>
                            </ul>
                            <img src={StudyGif} alt="Mascota estudiando" className="math-mascot" />
                        </div>

            <div className="card-free game-card" ref={gameCardRef}>
              <h2>Cifra tu mensaje secreto</h2>
              <TextType as="p" text="Construye una grilla válida arriba, luego escribe o pega texto y prueba cifrar/descifrar." />

              <div className="hill-mode-toggle">
                <button className={`toggle-btn ${mode === "encrypt" ? "active" : ""}`} onClick={() => { setMode("encrypt"); setAnimStep(0); }}>Cifrar</button>
                <button className={`toggle-btn ${mode === "decrypt" ? "active" : ""}`} onClick={() => { setMode("decrypt"); setAnimStep(0); }}>Descifrar</button>
              </div>

              <div className="example-controls">
                <label>
                  {mode === "encrypt" ? "Texto en claro" : "Texto cifrado"}
                  <input type="text" className="form-control" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={mode === "encrypt" ? "Ej. ATTACK AT DAWN" : "Pega aquí el texto cifrado (sin saltos)"} />
                </label>
              </div>

              {!isValid && <div className="tg-game-warning">⚠ Configura una grilla válida para habilitar el proceso.</div>}

              <div className="example-results">
                <div>
                  <span className="example-label">Preparado ({n * n} celdas)</span>
                  <p style={{ color: "var(--cf-orange)", letterSpacing: "0.1em" }}>{isValid ? (mode === "encrypt" ? inputText.replace(/\s/g, "").padEnd(n * n, "X").match(new RegExp(`.{1,${n}}`, "g")).join(" ") : encryptedText) : "——"}</p>
                </div>

                <div>
                  <span className="example-label">{mode === "encrypt" ? "Cifrado" : "Descifrado"}</span>
                  <ScrambledText radius={10} duration={5} speed={0.1} className="p">{isValid ? (mode === "encrypt" ? encryptedText : decryptedText) : "——"}</ScrambledText>
                </div>

                {mode === "encrypt" && isValid && (
                  <div>
                    <span className="example-label">Verificación (descifrado)</span>
                    <ScrambledText radius={10} duration={5} speed={0.1} className="p">{decryptedText}</ScrambledText>
                  </div>
                )}
              </div>

              {isValid && (
                <div className="tg-success-banner">
                  <img src={HappyGif} alt="CypherFox feliz" className="tg-success-gif" />
                  <p>¡Grilla válida y activa!</p>
                </div>
              )}

            </div>
          </div>
        </section>

      </div>

      {/* ════════════ MODALES ════════════ */}

            {/* Modal 1 — Historia */}
            {showHistoryHelp && (
                <div className="modal-backdrop" onClick={() => setShowHistoryHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>Historia de la Rejilla Girante</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            El cifrado de Rejilla Girante (<em>Turning Grille</em> o{" "}
                            <em>Grille Cipher</em>) fue inventado en <strong>1881</strong> por el
                            coronel austriaco <strong>Edouard Fleissner von Wostrowitz</strong> y
                            publicado en su obra <em>Handbuch der Kryptographie</em>. La idea era
                            elegante y física: una tarjeta rígida perforada que se coloca sobre el
                            papel, se escriben letras en los huecos, luego se rota 90° y se repite.
                        </p>
                        <h4 style={{ marginTop: "1rem" }}>Uso militar</h4>
                        <p>
                            El cifrado fue adoptado por el ejército <strong>alemán</strong> durante
                            la <strong>Primera Guerra Mundial</strong>. Su ventaja táctica era la
                            operación puramente física: no requería tablas, claves alfanuméricas ni
                            cálculos. El mensajero simplemente llevaba la tarjeta perforada.
                        </p>
                        <h4 style={{ marginTop: "1rem" }}>Ruptura del cifrado</h4>
                        <p>
                            A pesar de su ingenio mecánico, el cifrado fue roto por los
                            criptoanalistas aliados. Al ser una transposición pura, las frecuencias
                            de letras se conservan intactas — un analista que detecte la distribución
                            normal del idioma sabe inmediatamente que está frente a una transposición,
                            no una sustitución. Con suficiente texto cifrado y conocimiento del idioma,
                            la rejilla puede reconstruirse por fuerza bruta o análisis estadístico.
                        </p>
                        <h4 style={{ marginTop: "1rem" }}>Aparición en la literatura</h4>
                        <p>
                            El cifrado aparece en la novela <em>Abenteuer des Kapitän Mors</em> y fue
                            referenciado en múltiples textos de criptografía del siglo XX. Influenció
                            el diseño de herramientas mecánicas de cifrado previas a Enigma.
                        </p>
                        <button className="close-button" onClick={() => setShowHistoryHelp(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            {/* Modal 2 — ¿Cómo funciona la rotación? */}
            {showRotationHelp && (
                <div className="modal-backdrop" onClick={() => setShowRotationHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>¿Cómo se rota la rejilla?</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            Rotar una rejilla <InlineMath math="n \times n" /> 90° en sentido{" "}
                            <strong>horario</strong> transforma cada posición{" "}
                            <InlineMath math="(r, c)" /> de la siguiente manera:
                        </p>
                        <BlockMath math="R_{\text{horario}}(r, c) = (c,\; n-1-r)" />
                        <p>
                            Y en sentido <strong>antihorario</strong>:
                        </p>
                        <BlockMath math="R_{\text{antihorario}}(r, c) = (n-1-c,\; r)" />
                        <p>
                            Ejemplo para <InlineMath math="n=4" />, agujero en{" "}
                            <InlineMath math="(0, 0)" />:
                        </p>
                        <ul className="math-list">
                            <li>Original: <InlineMath math="(0, 0)" /></li>
                            <li>Rotación 1 (horario): <InlineMath math="(0, 3)" /></li>
                            <li>Rotación 2 (180°): <InlineMath math="(3, 3)" /></li>
                            <li>Rotación 3 (270°): <InlineMath math="(3, 0)" /></li>
                        </ul>
                        <p>
                            Estas 4 posiciones nunca se solapan, por eso <InlineMath math="(0,0)" /> es
                            un agujero válido para empezar. El desafío es encontrar{" "}
                            <InlineMath math="\frac{n^2}{4}" /> agujeros tales que{" "}
                            <strong>todas sus órbitas bajo R sean disjuntas</strong>.
                        </p>
                        <button className="close-button" onClick={() => setShowRotationHelp(false)}>Entendido</button>
                    </div>
                </div>
            )}

            {/* Modal 3 — ¿Qué hace válida una grilla? */}
            {showMathHelp && (
                <div className="modal-backdrop" onClick={() => setShowMathHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>¿Qué hace válida una grilla?</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            Para que una rejilla <InlineMath math="n \times n" /> sea válida, su
                            conjunto de agujeros <InlineMath math="H" /> debe cumplir:
                        </p>
                        <BlockMath math="|H| = \frac{n^2}{4}" />
                        <BlockMath math="H \cap R(H) = \emptyset \quad \text{y} \quad H \cup R(H) \cup R^2(H) \cup R^3(H) = \text{todas las celdas}" />
                        <p>
                            Esto garantiza que cada celda de la matriz sea llenada{" "}
                            <strong>exactamente una vez</strong> durante las 4 rotaciones — ni más,
                            ni menos. Si dos rotaciones coinciden en la misma celda, una letra
                            sobreescribiría a otra.
                        </p>
                        <p>
                            Una forma práctica de construir grillas válidas: divide la matriz en
                            4 cuadrantes de <InlineMath math="(n/2) \times (n/2)" /> celdas. Elige
                            exactamente un agujero de cada grupo de 4 celdas que sean órbitas entre sí.
                            Para <InlineMath math="n=4" />, cada celda <InlineMath math="(r,c)" /> con{" "}
                            <InlineMath math="r,c \in \{0,1\}" /> define una órbita única de 4 celdas.
                            Elige una por órbita.
                        </p>
                        <button className="close-button" onClick={() => setShowMathHelp(false)}>Entendido</button>
                    </div>
                </div>
            )}
        </div>
  );
}

export default TurningGrille;