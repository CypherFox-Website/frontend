// routes/Methods/Lecciones/Caesar.jsx
import { useState, useRef, useEffect } from "react";

import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

import "./Caesar.css";

import Disk from "../../../assets/caesar-disk.png";
import Welcome from "../../../assets/welcome.gif";
import Study from "../../../assets/study.gif";
import Help from "../../../assets/help.gif";
import Happy from "../../../assets/happy.gif";
import Sad from "../../../assets/sad.gif";

import { missions_caesar as missions } from "../../../util/missions";

import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";

import { gsap } from "gsap";

function Caesar() {
    const [shift, setShift] = useState(7);
    const [plainText, setPlainText] = useState("CAESAR");
    const [showMathHelp, setShowMathHelp] = useState(false);
    const [activeMission, setActiveMission] = useState(1);
    const [missionTitleKey, setMissionTitleKey] = useState(0);
    const [answer, setAnswer] = useState("");
    const [modalAnswer, setModalAnswer] = useState(false);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const n = alphabet.length;

    const encodeChar = (ch, k) => {
        const idx = alphabet.indexOf(ch.toUpperCase());
        if (idx === -1) return ch;
        return alphabet[(idx + (k % n) + n) % n];
    };

    const encodedText = plainText
        .split("")
        .map((ch) => encodeChar(ch, shift))
        .join("");

    const currentMission = missions.find((m) => m.id === activeMission);

    // ---------- REFS PARA GSAP ----------
    const heroRef = useRef(null);
    const heroCircleRef = useRef(null);
    const heroMascotRef = useRef(null);
    const labBandRef = useRef(null);
    const mathCardRef = useRef(null);
    const gameCardRef = useRef(null);
    const missionsCardRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out", duration: 0.6 },
            });

            // Hero: texto
            tl.from(heroRef.current, {
                opacity: 0,
                y: 20,
            });

            // Hero: círculo central
            tl.from(
                heroCircleRef.current,
                {
                    opacity: 0,
                    scale: 0.8,
                },
                "-=0.3"
            );

            // Hero: mascota
            tl.from(
                heroMascotRef.current,
                {
                    opacity: 0,
                    x: -20,
                },
                "-=0.4"
            );

            // Banda laboratorio
            tl.from(
                labBandRef.current,
                {
                    opacity: 0,
                    y: 24,
                },
                "-=0.2"
            );

            // Pizarra matemática
            tl.from(
                mathCardRef.current,
                {
                    opacity: 0,
                    y: 24,
                },
                "+=0.1"
            );

            // Juego de cifrado
            tl.from(
                gameCardRef.current,
                {
                    opacity: 0,
                    y: 24,
                },
                "-=0.3"
            );

            // Tarjeta de misiones
            tl.from(
                missionsCardRef.current,
                {
                    opacity: 0,
                    y: 24,
                },
                "+=0.1"
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="caesar-page">
            <div className="container caesar-shell">
                {/* HERO tipo landing */}
                <section className="caesar-hero">
                    <div className="hero-copy" ref={heroRef}>
                        <span className="hero-badge">Lección · Método clásico</span>
                        <h1>
                            Juega con el{" "}
                            <DecryptedText
                                text="Cifrado César"
                                className="hero-copy-tittle"
                                encryptedClassName="hero-copy-tittle text-encrypted"
                                speed={120}
                                maxIterations={60}
                            />
                        </h1>
                        <p>
                            <TextType
                                text=" Un alfabeto que gira, una clave k y mucha curiosidad. Explora cómo un truco antiguo se convierte en una regla matemática sencilla mientras cifras tus propios mensajes."
                                as="span"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                        </p>
                    </div>

                    <div className="hero-visual">
                        <img
                            src={Welcome}
                            alt="CypherFox dando la bienvenida"
                            className="hero-mascot"
                            ref={heroMascotRef}
                        />
                        <div
                            className="hero-circle hero-circle-main"
                            ref={heroCircleRef}
                        >
                            <div className="hero-circle-inner">
                                <span className="k-label">k</span>
                                <span className="k-value">{shift}</span>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

                {/* FRANJA 1: laboratorio + bloque de historia superpuesto */}
                <section className="caesar-band band-lab">
                    <div className="band-lab-inner" ref={labBandRef}>
                        {/* Laboratorio */}
                        <div className="lab-core">
                            <header className="lab-header-row">
                                <div>
                                    <h2>
                                        <DecryptedText
                                            text="Gira el alfabeto"
                                            className="hero-copy-tittle"
                                            encryptedClassName="hero-copy-tittle text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                    <p className="lab-subtitle">
                                        <TextType
                                            text="El anillo exterior muestra el alfabeto en claro; el interior, girado por la clave k, nos da el alfabeto cifrado."
                                            as="span"
                                            typingSpeed={25}
                                            deletingSpeed={65}
                                            pauseDuration={1800}
                                            textColors={["var(--cf-text)"]}
                                        />
                                    </p>
                                </div>
                                <div className="lab-slider">
                                    <span className="slider-label">Clave</span>
                                    <div className="slider-stack">
                                        <small>
                                            <InlineMath math="k" />
                                        </small>
                                        <input
                                            type="range"
                                            className="form-range"
                                            min="0"
                                            max={n - 1}
                                            value={shift}
                                            onChange={(e) => setShift(Number(e.target.value))}
                                        />
                                    </div>
                                    <span className="slider-pill">{shift}</span>
                                </div>
                            </header>

                            {/* Disco circular basado en imagen */}
                            <div className="disk-zone">
                                <div className="disk-wrapper">
                                    <div className="disk-layer disk-outer">
                                        <img src={Disk} alt="Disco de letras exterior" />
                                    </div>

                                    <div
                                        className="disk-layer disk-inner"
                                        style={{
                                            transform: `translate(-50%, -50%) rotate(${(-shift / n) * 360}deg)`,
                                        }}
                                    >
                                        <img src={Disk} alt="Disco de letras interior" />
                                    </div>
                                </div>

                                <div className="disk-legend">
                                    <span className="dot dot-outer" /> Exterior
                                    <span className="dot dot-inner ms-3" /> Interior (girado k)
                                </div>
                            </div>

                            <div className="lab-example-inline">
                                <span>Ejemplo rápido:</span>
                                <span className="lab-example-text">
                                    CAESAR →{" "}
                                    <strong>
                                        {encodeChar("C", shift)}
                                        {encodeChar("A", shift)}
                                        {encodeChar("E", shift)}
                                        {encodeChar("S", shift)}
                                        {encodeChar("A", shift)}
                                        {encodeChar("R", shift)}
                                    </strong>
                                </span>
                            </div>
                        </div>

                        {/* Historia flotante */}
                        <aside className="history-floating">
                            <h3>
                                <DecryptedText
                                    text="¿Qué estamos imitando?"
                                    className="h3"
                                    encryptedClassName="h3 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h3>
                            <TextType
                                text={`Se dice que Julio César desplazaba el alfabeto unas pocas posiciones para ocultar mensajes militares. Quien sabía la regla podía “deshacer” el giro y leer el texto original. Es un método muy débil frente a las técnicas modernas, porque solo hay ${n} posibles claves y las frecuencias de las letras del idioma se conservan casi intactas.`}
                                as="p"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                        </aside>
                    </div>
                </section>

                {/* FRANJA 2: juego de mensajes + pizarra matemática */}
                <section className="caesar-band band-bottom">
                    <div className="band-grid">
                        {/* Pizarra matemática */}
                        <div className="card-free math-card" ref={mathCardRef}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2>
                                        <DecryptedText
                                            text="La regla detrás del juego"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    className="math-help-button"
                                    onClick={() => setShowMathHelp(true)}
                                >
                                    ¿Módulo?
                                </button>
                            </div>

                            <p>
                                Vamos a traducir el disco a lenguaje matemático. Primero
                                numeramos las letras del alfabeto de 0 a {n - 1}. Eso significa
                                que:
                            </p>

                            <ul className="math-list">
                                <li>A → 0, B → 1, C → 2, …, Z → {n - 1}.</li>
                                <li>
                                    <InlineMath math="k" /> es la clave: cuántas posiciones
                                    giramos el anillo interior.
                                </li>
                            </ul>

                            <p>
                                Si llamamos <InlineMath math="x" /> al número de una letra en
                                claro, la letra cifrada se obtiene sumando la clave y “volviendo
                                a empezar” cuando nos salimos del alfabeto. Eso se escribe así:
                            </p>

                            <div className="math-formula">
                                <BlockMath math={`E_k(x) = (x + k) \\bmod ${n}`} />
                            </div>

                            <p className="math-explanation">
                                ¿Qué significa cada parte de{" "}
                                <InlineMath math="E_k(x) = (x + k) \bmod n" />?
                            </p>

                            <ul className="math-list">
                                <li>
                                    <InlineMath math="E_k(x)" /> es el resultado de cifrar la
                                    letra con número <InlineMath math="x" /> usando la clave{" "}
                                    <InlineMath math="k" />.
                                </li>
                                <li>
                                    <InlineMath math="x" /> es el número de la letra original (por
                                    ejemplo, A = 0, C = 2, etc.).
                                </li>
                                <li>
                                    <InlineMath math="k" /> es el desplazamiento que eliges en el
                                    disco (la misma <InlineMath math="k" /> que mueves con el
                                    deslizador).
                                </li>
                                <li>
                                    <InlineMath math={`\\bmod ${n}`} /> indica que, si te pasas de{" "}
                                    <InlineMath math={`${n - 1}`} />, vuelves a empezar desde 0
                                    (igual que dar una vuelta completa al disco).
                                </li>
                            </ul>

                            <p>
                                Para deshacer el cifrado hacemos lo contrario: restamos la misma
                                clave y volvemos a aplicar{" "}
                                <InlineMath math={`\\bmod ${n}`} /> para regresar al rango de
                                letras:
                            </p>

                            <div className="math-formula">
                                <BlockMath math={`D_k(y) = (y - k) \\bmod ${n}`} />
                            </div>

                            <p className="math-explanation">
                                En esta expresión{" "}
                                <InlineMath math="D_k(y) = (y - k) \bmod n" />:
                            </p>

                            <ul className="math-list">
                                <li>
                                    <InlineMath math="D_k(y)" /> es el número de la letra en claro
                                    que recuperamos.
                                </li>
                                <li>
                                    <InlineMath math="y" /> es el número de la letra cifrada.
                                </li>
                                <li>
                                    Restar <InlineMath math="k" /> es como girar el disco en
                                    sentido contrario.
                                </li>
                            </ul>

                            <p>
                                Con este modelo tan simple ya podemos hablar de{" "}
                                <strong>espacio de claves</strong> (hay exactamente {n} valores
                                posibles de <InlineMath math="k" />),{" "}
                                <strong>ataques de fuerza bruta</strong> (probar todas las
                                claves) y <strong>patrones de frecuencia</strong> (las letras
                                más usadas en el idioma siguen siendo las más frecuentes después
                                de cifrar).
                            </p>
                        </div>

                        {/* Juego de cifrado */}
                        <div className="card-free game-card" ref={gameCardRef}>
                            <h2>
                                <DecryptedText
                                    text="Escribe tu propio mensaje secreto"
                                    className="h2"
                                    encryptedClassName="h2 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h2>
                            <TextType
                                text={`Usa el mismo valor de k para todas las letras. Observa cómo la "forma" de las palabras se conserva, aunque sus letras cambien: esa pista es la que los criptólogos aprovechan para romper este cifrado con análisis de frecuencia.`}
                                as="p"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />

                            <div className="example-controls">
                                <label>
                                    Texto en claro
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={plainText}
                                        onChange={(e) => setPlainText(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Clave k
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        max={n - 1}
                                        value={shift}
                                        onChange={(e) => setShift(Number(e.target.value))}
                                    />
                                </label>
                            </div>

                            <div className="example-results">
                                <div>
                                    <span className="example-label">Claro</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {plainText}
                                    </ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">Cifrado</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {encodedText}
                                    </ScrambledText>
                                </div>
                            </div>

                            <p className="game-tip">
                                <TextType
                                    text={`Prueba distintos valores de k. ¿Cuántos intentos necesitarías, como máximo, para adivinar la clave si solo tienes un mensaje cifrado?`}
                                    as="p"
                                    typingSpeed={25}
                                    deletingSpeed={65}
                                    pauseDuration={1800}
                                    textColors={["var(--cf-text)"]}
                                />
                            </p>

                            <img
                                src={Study}
                                alt="CypherFox estudiando las fórmulas"
                                className="math-mascot"
                            />
                        </div>
                    </div>
                </section>

                {/* Modal ayuda módulo */}
                {showMathHelp && (
                    <div
                        className="modal-backdrop"
                        onClick={() => setShowMathHelp(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header-with-fox">
                                <h3>
                                    ¿Qué significa <InlineMath math={`\\bmod ${n}`} />?
                                </h3>
                                <img
                                    src={Help}
                                    alt="CypherFox confundido con un signo de interrogación"
                                    className="modal-mascot"
                                />
                            </div>

                            <p>
                                Trabajar <InlineMath math={`\\bmod ${n}`} /> es como contar en
                                un reloj que no tiene 12 horas, sino {n}. Cuando llegas al
                                número {n}, no sigues en {n + 1}, sino que vuelves a 0 y
                                empiezas otra vuelta.
                            </p>

                            <p>
                                En el cifrado César, primero convertimos cada letra en un número
                                entre 0 y {n - 1}. Por ejemplo: A → 0, B → 1, C → 2, …, Z →{" "}
                                {n - 1}. Luego, para cifrar, sumamos siempre la misma clave{" "}
                                <InlineMath math={"k"} />:
                            </p>

                            <ul className="math-list">
                                <li>
                                    Empiezas en un número <InlineMath math="x" /> (la letra
                                    original).
                                </li>
                                <li>
                                    Calculas <InlineMath math="x + k" />.
                                </li>
                                <li>
                                    Si el resultado se pasa de {n - 1}, das una vuelta y cuentas
                                    el resto al dividir entre {n}: eso es{" "}
                                    <InlineMath math={`\\bmod ${n}`} />.
                                </li>
                            </ul>

                            <p>Ejemplo rápido con un reloj de {n} horas:</p>

                            <ul className="math-list">
                                <li>
                                    Estás en la "hora" {n - 1} y sumas 2. Obtienes {n + 1}.
                                </li>
                                <li>
                                    Módulo {n}, {n + 1} es igual a 1: diste una vuelta completa
                                    (de 0 a {n - 1}) y avanzaste 1 más.
                                </li>
                            </ul>

                            <p>
                                En el disco de Caesar pasa lo mismo: cuando giras el anillo
                                interior, las letras que se "pasan del final" reaparecen al
                                comienzo. Gracias a{" "}
                                <InlineMath math={`\\bmod ${n}`} />, la fórmula
                            </p>

                            <div className="math-formula">
                                <BlockMath math={`E_k(x) = (x + k) \\bmod ${n}`} />
                            </div>

                            <p>
                                siempre devuelve un número entre 0 y {n - 1}, es decir, siempre
                                una letra válida del alfabeto.
                            </p>

                            <button
                                type="button"
                                className="close-button"
                                onClick={() => setShowMathHelp(false)}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )}

                {/* BLOQUE DE MISIONES / ACTIVIDADES RÁPIDAS */}
                <section className="caesar-band caesar-missions">
                    <div className="missions-header">
                        <h2>
                            <DecryptedText
                                text="Desafíos rápidos"
                                className="h2"
                                encryptedClassName="h2 text-encrypted"
                                speed={100}
                                maxIterations={60}
                            />                            
                        </h2>
                        <p>
                            <TextType
                                text={`Completa estas pequeñas misiones usando el disco y el cifrador. Así conectas la idea de “girar el alfabeto” con pensar como criptógrafo.`}
                                as="p"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                        </p>
                    </div>

                    <div className="missions-grid">
                        {missions.map((mission) => (
                            <button
                                key={mission.id}
                                type="button"
                                className={
                                    "mission-pill" +
                                    (mission.id === activeMission ? " mission-pill-active" : "")
                                }
                                onClick={() => {
                                    setActiveMission(mission.id);
                                    setMissionTitleKey((prev) => prev + 1);
                                    setAnswer("");
                                }}
                            >
                                {mission.title}
                            </button>
                        ))}
                    </div>

                    <div className="mission-card" ref={missionsCardRef}>
                        <h3>
                            <DecryptedText
                                key={missionTitleKey}
                                text={currentMission.title}
                                className="h3"
                                encryptedClassName="h3 text-encrypted"
                                speed={100}
                                maxIterations={60}
                            />
                        </h3>
                        <p>
                            <TextType
                                key={missionTitleKey + "-desc"}
                                text={currentMission.description}
                                as="p"
                                typingSpeed={15}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                        </p>

                        <input
                            type="text"
                            className="form-answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Escribe tu respuesta aquí…"
                        />

                        <button
                            type="button"
                            className="close-button"
                            onClick={() => {
                                if (answer.trim() !== "") {
                                    setModalAnswer(true);
                                }
                            }}
                        >
                            Comprobar
                        </button>

                        {modalAnswer && (
                            <div
                                className="modal-backdrop"
                                onClick={() => setModalAnswer(false)}
                            >
                                <div
                                    className="modal-content"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h3>
                                        <DecryptedText
                                            text="Resultado de la misión"
                                            className="h3"
                                            encryptedClassName="h3 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h3>

                                    {answer.trim().toUpperCase() ===
                                        currentMission.answer.toUpperCase() ? (
                                        <div className="mission-feedback mission-correct">
                                            <img
                                                src={Happy}
                                                alt="CypherFox celebrando el acierto"
                                                className="mission-mascot"
                                            />
                                            <p>
                                                <TextType
                                                    text="¡Correcto! Has encontrado la respuesta esperada."
                                                    as="p"
                                                    typingSpeed={15}
                                                    deletingSpeed={65}
                                                    pauseDuration={1800}
                                                    textColors={["var(--cf-text)"]}
                                                />
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mission-feedback mission-incorrect">
                                            <img
                                                src={Sad}
                                                alt="CypherFox pensativo mostrando un error"
                                                className="mission-mascot"
                                            />
                                            <p>
                                                <TextType
                                                    text={currentMission.hint}
                                                    as="p"
                                                    typingSpeed={15}
                                                    deletingSpeed={65}
                                                    pauseDuration={1800}
                                                    textColors={["var(--cf-text)"]}
                                                />
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        className="close-button"
                                        onClick={() => setModalAnswer(false)}
                                    >
                                        Entendido
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Caesar;