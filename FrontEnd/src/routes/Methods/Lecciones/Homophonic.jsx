// routes/Methods/Lecciones/Homophonic.jsx
import { useState, useRef, useEffect } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./Homophonic.css";
import WelcomeGif from "../../../assets/welcome.gif";
import StudyGif from "../../../assets/study.gif";
import HelpGif from "../../../assets/help.gif";
import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";
import { gsap } from "gsap";

/* =========================================================
   CIPHER LOGIC  (Python → JS)
   ========================================================= */
const ALFABETO = {
    A: [9, 12, 33, 47, 53, 67, 78, 92],
    B: [48, 81],
    C: [13, 41, 62],
    D: [1, 3, 45, 79],
    E: [14, 16, 24, 44, 46, 55, 57, 64, 74, 82, 87, 98],
    F: [10, 31],
    G: [6, 25],
    H: [23, 39, 50, 56, 65, 68],
    I: [32, 70, 73, 83, 88, 93],
    J: [15],
    K: [4],
    L: [26, 37, 51, 84],
    M: [22, 27],
    N: [18, 58, 59, 66, 71, 91],
    O: [0, 5, 7, 54, 72, 90, 99],
    P: [38, 95],
    Q: [94],
    R: [29, 35, 40, 42, 77, 80],
    S: [11, 19, 36, 76, 86, 96],
    T: [17, 20, 30, 43, 49, 69, 75, 85, 97],
    U: [8, 61, 63],
    V: [34],
    W: [60, 89],
    X: [28],
    Y: [21, 52],
    Z: [2],
};

// Mapa inverso: número → letra
const INVERSE_MAP = {};
Object.entries(ALFABETO).forEach(([letra, nums]) => {
    nums.forEach((n) => { INVERSE_MAP[n] = letra; });
});

function seededRandom(seed) {
    let s = seed;
    return function () {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
    };
}

function homophonic_encrypt(mensaje, clave = ALFABETO, seed = null) {
    const rng = seed !== null ? seededRandom(seed) : Math.random.bind(Math);
    const resultado = [];
    for (const letra of mensaje.toUpperCase()) {
        if (letra === " ") continue;
        const lista = clave[letra];
        if (lista) {
            const idx = Math.floor(rng() * lista.length);
            resultado.push(lista[idx]);
        }
    }
    return resultado;
}

function homophonic_decrypt(cifrado, clave = ALFABETO) {
    return cifrado.map((num) => INVERSE_MAP[num] ?? "?").join("");
}

/* =========================================================
   COMPONENT
   ========================================================= */
function Homophonic() {
    /* ── STATE ── */
    const [plainText, setPlainText] = useState("CRYPTOISFUN");
    const [encryptedNums, setEncryptedNums] = useState([]);
    const [decryptedText, setDecryptedText] = useState("");
    const [showMathHelp, setShowMathHelp] = useState(false);
    const [showHistoryHelp, setShowHistoryHelp] = useState(false);
    const [showEntropyHelp, setShowEntropyHelp] = useState(false);
    const [heroNumIndex, setHeroNumIndex] = useState(0);
    const [heroLetter, setHeroLetter] = useState("A");

    /* ── REFS ── */
    const heroRef = useRef(null);
    const heroCircleRef = useRef(null);
    const heroMascotRef = useRef(null);
    const bandLabRef = useRef(null);
    const mathCardRef = useRef(null);
    const gameCardRef = useRef(null);

    /* ── COMPUTED ── */
    const safePlain = plainText.toUpperCase().replace(/[^A-Z ]/g, "");

    /* Encrypt on mount and when plainText changes (random each time) */
    useEffect(() => {
        const nums = homophonic_encrypt(safePlain);
        setEncryptedNums(nums);
        setDecryptedText(homophonic_decrypt(nums));
    }, [safePlain]);

    /* Hero circle: cycle through letters of the alphabet showing a random homophone */
    useEffect(() => {
        const letters = Object.keys(ALFABETO);
        let i = 0;
        const interval = setInterval(() => {
            const letter = letters[i % letters.length];
            const pool = ALFABETO[letter];
            const pick = pool[Math.floor(Math.random() * pool.length)];
            setHeroLetter(letter);
            setHeroNumIndex(pick);
            i++;
        }, 900);
        return () => clearInterval(interval);
    }, []);

    /* ── GSAP ── */
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

    /* ── HANDLER: re-encrypt with new random choices ── */
    const handleReEncrypt = () => {
        const nums = homophonic_encrypt(safePlain);
        setEncryptedNums(nums);
        setDecryptedText(homophonic_decrypt(nums));
    };

    /* ── HELPERS ── */
    const letterFrequency = Object.entries(ALFABETO).map(([letter, pool]) => ({
        letter,
        count: pool.length,
    }));

    /* Mapping table: active row based on first letter of safePlain */
    const firstLetter = safePlain.replace(/ /g, "")[0] || "A";

    /* ── RENDER ── */
    return (
        <div className="homophonic-page">
            <div className="container homophonic-shell">

                {/* ════════════════════════════════════════
            HERO
            ════════════════════════════════════════ */}
                <section className="homophonic-hero" ref={heroRef}>
                    <div className="hero-copy">
                        <span className="hero-badge">Lección · Cifrado de Sustitución Múltiple</span>
                        <h1 className="hero-copy-tittle">
                            Juega con el{" "}
                            <DecryptedText
                                text="Cifrado Homofonico"
                                className="hero-copy-tittle"
                                encryptedClassName="hero-copy-tittle text-encrypted"
                                speed={120}
                                maxIterations={60}
                            />
                        </h1>
                        <TextType
                            as="p"
                            text="Una letra, muchos números posibles. El cifrado homofonico rompe el análisis de frecuencias asignando varios símbolos a cada letra según qué tan común es. Descubre cómo un poco de aleatoriedad cambia las reglas del juego."
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
                                <div className="k-label">{heroLetter}</div>
                                <div className="k-value">{String(heroNumIndex).padStart(2, "0")}</div>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

                {/* ════════════════════════════════════════
            BANDA 1 — LABORATORIO + HISTORIA FLOTANTE
            ════════════════════════════════════════ */}
                <section className="homophonic-band band-lab">
                    <div className="band-lab-inner" ref={bandLabRef}>
                        <div className="lab-core">
                            {/* Título y subtítulo */}
                            <div className="lab-header-row">
                                <div>
                                    <h2>
                                        <DecryptedText
                                            text="El pool de homófonos"
                                            encryptedClassName="text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                    <p className="lab-subtitle">
                                        Cada letra tiene asignados entre 1 y 12 números (del 0 al 99).
                                        Las letras más frecuentes reciben más opciones para diluir su
                                        huella estadística. El número de homofonos es proporcional a
                                        la frecuencia esperada de cada letra en inglés.
                                    </p>
                                </div>
                            </div>

                            {/* Tabla + Mensaje Cifrado en fila */}
                            <div className="lab-table-cipher-row">

                                {/* Tabla: solo Letra + Valores disponibles */}
                                <div className="homophones-table-wrapper">
                                    <table className="homophones-table">
                                        <thead>
                                            <tr>
                                                <th className="ht-header">Letra</th>
                                                <th className="ht-header">Valores disponibles</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {letterFrequency.map(({ letter }) => {
                                                const isActive = letter === firstLetter;
                                                return (
                                                    <tr key={letter} className={isActive ? "ht-row-active" : "ht-row"}>
                                                        <td className="ht-cell ht-letter">{letter}</td>
                                                        <td className="ht-cell ht-pool">
                                                            {ALFABETO[letter].join(", ")}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mensaje Cifrado como lista */}
                                <div className="cipher-list-panel">
                                    <h3 className="cipher-list-title">Mensaje Cifrado</h3>
                                    <ul className="cipher-list">
                                        {safePlain.replace(/ /g, "").split("").map((ch, i) => (
                                            <li key={i} className="cipher-list-item">
                                                <span className="cl-letter">{ch}</span>
                                                <span className="cl-arrow">→</span>
                                                <span className="cl-num">
                                                    {encryptedNums[i] !== undefined
                                                        ? String(encryptedNums[i]).padStart(2, "0")
                                                        : "—"}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>

                        {/* Historia Flotante — SIN CAMBIOS */}
                        <aside className="history-floating">
                            <h3>
                                <DecryptedText
                                    text="El cifrado que venció al análisis"
                                    encryptedClassName="text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h3>
                            <TextType
                                as="p"
                                text="El cifrado homofonico surgió como respuesta directa al análisis de frecuencias de Al-Kindi. Al mapear una sola letra a múltiples símbolos, un adversario ya no puede inferir qué letra es la 'E' por ser la más repetida en el texto cifrado."
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

                {/* ════════════════════════════════════════
            BANDA 2 — PIZARRA MATEMÁTICA + JUEGO
            ════════════════════════════════════════ */}
                <section className="homophonic-band band-bottom">
                    <div className="band-grid">

                        {/* ── MATH CARD ── */}
                        <div className="card-free math-card" ref={mathCardRef}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2>
                                        <DecryptedText
                                            text="La lógica detrás del caos"
                                            encryptedClassName="text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                </div>
                                <button className="math-help-button" onClick={() => setShowMathHelp(true)}>
                                    ¿Homófonos?
                                </button>
                                <button className="math-help-button" onClick={() => setShowEntropyHelp(true)}>
                                    ¿Entropía?
                                </button>
                            </div>

                            <p>
                                Sea <InlineMath math="\Sigma = \{A, B, \ldots, Z\}" /> el alfabeto en claro
                                y <InlineMath math="\mathcal{C} = \{0, 1, \ldots, 99\}" /> el alfabeto cifrado
                                (100 símbolos). Se define una función de asignación{" "}
                                <InlineMath math="f : \Sigma \to \mathcal{P}(\mathcal{C})" /> tal que los
                                conjuntos son disjuntos:
                            </p>

                            <BlockMath math="\forall\, a \neq b \in \Sigma,\quad f(a) \cap f(b) = \emptyset" />

                            <p className="math-explanation">Cifrado:</p>
                            <BlockMath math="E(m_i) = \text{random}\bigl(f(m_i)\bigr)" />

                            <p>
                                Para cada letra <InlineMath math="m_i" /> del mensaje se elige{" "}
                                <em>uniformemente al azar</em> uno de los valores de su pool{" "}
                                <InlineMath math="f(m_i)" />.
                            </p>

                            <p className="math-explanation">Descifrado:</p>
                            <BlockMath math="D(c_j) = f^{-1}(c_j)" />

                            <p>
                                El mapa inverso <InlineMath math="f^{-1}" /> es biyectivo (pues los pools son
                                disjuntos), por lo tanto el descifrado es{" "}
                                <strong>determinístico y sin ambigüedad</strong>, aunque el cifrado sea
                                probabilístico.
                            </p>

                            <p className="math-explanation">Tamaño óptimo del pool:</p>
                            <BlockMath math="|f(\ell)| \;\propto\; p(\ell)" />

                            <p>
                                El número de homófonos asignado a cada letra es proporcional a su
                                frecuencia <InlineMath math="p(\ell)" /> en el idioma. Si la E tiene el
                                12 % de frecuencia y el espacio cifrado tiene 100 símbolos, se le asignan
                                12 símbolos. El resultado es que{" "}
                                <strong>cada símbolo del criptograma tiene la misma probabilidad</strong>{" "}
                                de aparecer ≈ 1%.
                            </p>

                            <ul className="math-list">
                                <li>
                                    El análisis de frecuencia clásico{" "}
                                    <strong>falla completamente</strong>: la distribución del criptograma es
                                    aproximadamente uniforme.
                                </li>
                                <li>
                                    El texto cifrado no es determinístico: la misma palabra puede producir
                                    secuencias de números completamente distintas en cada cifrado.
                                </li>
                                <li>
                                    La clave <InlineMath math="f" /> debe mantenerse secreta y compartirse de
                                    forma segura entre emisor y receptor.
                                </li>
                                <li>
                                    Con suficiente texto cifrado, ataques estadísticos de mayor orden
                                    (bigramas, trigramas) siguen siendo posibles.
                                </li>
                            </ul>

                            <img src={StudyGif} alt="Mascota estudiando" className="math-mascot" />
                        </div>

                        {/* ── GAME CARD ── */}
                        <div className="card-free game-card" ref={gameCardRef}>
                            <h2>
                                <DecryptedText
                                    text="Cifra tu mensaje"
                                    encryptedClassName="text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h2>
                            <TextType
                                as="p"
                                text="Escribe un mensaje y observa que cada vez que pulsas «Reencriptar» obtienes una secuencia de números diferente, aunque el mensaje sea el mismo. ¡Eso es la aleatoriedad del cifrado homofonico!"
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
                                        onChange={(e) =>
                                            setPlainText(e.target.value.toUpperCase().replace(/[^A-Z ]/g, ""))
                                        }
                                        placeholder="Ej. CRYPTOISFUN"
                                        maxLength={30}
                                    />
                                </label>
                            </div>

                            <div className="example-results">
                                <div>
                                    <span className="example-label">Claro</span>
                                    <p>{safePlain.replace(/ /g, "") || "—"}</p>
                                </div>
                                <div>
                                    <span className="example-label">Cifrado (números)</span>
                                    <ScrambledText radius={10} duration={5} speed={0.1} className="p">
                                        {encryptedNums.length > 0
                                            ? encryptedNums.map((n) => String(n).padStart(2, "0")).join("-")
                                            : "—"}
                                    </ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">Descifrado</span>
                                    <ScrambledText radius={10} duration={5} speed={0.1} className="p">
                                        {decryptedText || "—"}
                                    </ScrambledText>
                                </div>
                            </div>

                            <button className="homo-reencrypt-btn" onClick={handleReEncrypt}>
                                🔀 Reencriptar (nueva aleatoriedad)
                            </button>

                            <TextType
                                as="p"
                                className="game-tip"
                                text="¿Notas que el texto descifrado siempre coincide con tu mensaje, sin importar qué números se eligieron? La magia del mapa inverso garantiza la unicidad del descifrado."
                                typingSpeed={22}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                        </div>

                    </div>
                </section>
            </div>

            {/* ════════════════════════════════════════
          MODAL 1 — Historia
          ════════════════════════════════════════ */}
            {showHistoryHelp && (
                <div className="modal-backdrop" onClick={() => setShowHistoryHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>Historia del Cifrado Homofonico</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>

                        <p>
                            El cifrado homofonico es una de las respuestas más antiguas y elegantes al{" "}
                            <strong>análisis de frecuencias</strong>, técnica inventada por el polímata árabe{" "}
                            <strong>Al-Kindi</strong> alrededor del siglo IX en su obra{" "}
                            <em>"Manuscrito sobre el desciframiento de mensajes criptográficos"</em>. Al-Kindi
                            observó que en cualquier idioma ciertas letras aparecen mucho más que otras (en
                            inglés, la E es la más frecuente con un ~12.7%), lo que permite identificar letras
                            en un cifrado de sustitución simple contando frecuencias.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>🔐 Origen y primeros usos</h4>
                        <p>
                            El cifrado homofonico como concepto formal apareció al menos desde el siglo XIV.
                            Una de las implementaciones documentadas más antiguas se atribuye al duque{" "}
                            <strong>Mantua</strong> en la Italia renacentista, donde se usaban múltiples
                            símbolos para las letras más comunes. El objetivo era que la distribución de
                            símbolos en el criptograma pareciera lo más uniforme posible.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>🏰 Usos históricos notables</h4>
                        <p>
                            Durante los siglos XVI al XVIII, las cortes europeas utilizaron variantes
                            homofónicas en su correspondencia diplomática. Los cifrados de la{" "}
                            <strong>Gran Cifra de Luis XIV</strong> de Francia (diseñados por Antoine y
                            Bonaventure Rossignol) usaban más de 580 símbolos para ~26 letras, una forma
                            sofisticada de homofonia. Este sistema fue tan robusto que no fue descifrado
                            hasta 1893, más de 200 años después.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>🔓 ¿Cómo se rompe?</h4>
                        <p>
                            Aunque el cifrado homofonico resiste el análisis de frecuencias de primer orden,
                            ataques de <strong>bigramas y trigramas</strong> siguen siendo efectivos con
                            suficiente texto cifrado. También es vulnerable si el tamaño del pool no es
                            verdaderamente proporcional a las frecuencias del idioma, o si la misma clave
                            se reutiliza en múltiples mensajes.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>🌐 Legado moderno</h4>
                        <p>
                            El principio homofonico —esconder patrones a través de la aleatoriedad— está en
                            la base de cifrados modernos como <strong>AES</strong> con modos de operación
                            aleatorios (CBC con IV aleatorio, GCM). La idea de que el mismo mensaje en claro
                            produce diferentes textos cifrados es hoy un requisito de seguridad conocido como{" "}
                            <strong>seguridad semántica o IND-CPA</strong>.
                        </p>

                        <button className="close-button" onClick={() => setShowHistoryHelp(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
          MODAL 2 — ¿Qué son los homófonos?
          ════════════════════════════════════════ */}
            {showMathHelp && (
                <div className="modal-backdrop" onClick={() => setShowMathHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>¿Qué son los homófonos?</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>

                        <p>
                            En criptografía, un <strong>homófono</strong> es cualquiera de los múltiples
                            símbolos cifrados que pueden representar una misma letra del mensaje original.
                            En nuestro sistema usamos números del 0 al 99 (100 símbolos en total).
                        </p>

                        <p>
                            La letra <strong>E</strong>, la más frecuente en inglés (~12.7%), recibe{" "}
                            <strong>12 homófonos</strong>: {ALFABETO.E.join(", ")}. La letra{" "}
                            <strong>Z</strong>, la más rara, solo tiene <strong>1 homófono</strong>: {ALFABETO.Z[0]}.
                        </p>

                        <BlockMath math="|f(E)| = 12 \approx 100 \times 0.127" />

                        <p>
                            Cuando ciframos la E, elegimos uno de esos 12 números{" "}
                            <strong>uniformemente al azar</strong>. Si en el criptograma aparece el
                            número 14, sabemos con certeza que era una E — pero el adversario que ve
                            una secuencia de números no puede agrupar fácilmente todos los homófonos
                            de la E, ya que están distribuidos a lo largo del rango 0-99.
                        </p>

                        <p>
                            El requisito clave es que los pools sean{" "}
                            <strong>disjuntos</strong>: ningún número puede pertenecer a dos letras al
                            mismo tiempo. Esto garantiza que el descifrado sea único.
                        </p>

                        <button className="close-button" onClick={() => setShowMathHelp(false)}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
          MODAL 3 — Entropía y seguridad
          ════════════════════════════════════════ */}
            {showEntropyHelp && (
                <div className="modal-backdrop" onClick={() => setShowEntropyHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>Entropía y seguridad homofonicas</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>

                        <p>
                            La <strong>entropía de Shannon</strong>{" "}
                            <InlineMath math="H(X) = -\sum_i p_i \log_2 p_i" /> mide cuánta información
                            en promedio contiene un símbolo. Un cifrado de sustitución simple tiene la misma
                            distribución que el idioma (entropía baja); un cifrado homofonico ideal tiene
                            una distribución uniforme sobre el alfabeto cifrado (entropía máxima).
                        </p>

                        <p className="math-explanation">Distribución uniforme ideal:</p>
                        <BlockMath math="H_{\max} = \log_2 |\mathcal{C}| = \log_2 100 \approx 6.64 \text{ bits/símbolo}" />

                        <p>
                            Si el pool de cada letra tiene exactamente{" "}
                            <InlineMath math="|f(\ell)| = \lfloor 100 \cdot p(\ell) \rceil" /> homófonos y
                            se elige uniformemente, la probabilidad de que aparezca cualquier símbolo{" "}
                            <InlineMath math="c \in \mathcal{C}" /> en el criptograma es:
                        </p>

                        <BlockMath math="P(c_j) = \frac{|f^{-1}(c_j)|}{100} \cdot p\!\left(f^{-1}(c_j)\right) \approx \frac{1}{100}" />

                        <p>
                            En la práctica, la asignación no es perfectamente proporcional, así que la
                            distribución no es exactamente uniforme, pero se acerca mucho más que un cifrado
                            de sustitución simple. El análisis de frecuencias de primer orden queda inutilizado.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>⚠️ Limitaciones</h4>
                        <ul className="math-list">
                            <li>
                                <strong>Bigramas y trigramas:</strong> patrones de pares o trios de letras
                                siguen apareciendo en el criptograma con frecuencias distinguibles si se tiene
                                suficiente texto.
                            </li>
                            <li>
                                <strong>Clave fija:</strong> si el adversario conoce el número de homófonos de
                                cada letra, puede intentar inferir la correspondencia con análisis estadístico.
                            </li>
                            <li>
                                <strong>No es seguro semánticamente</strong> en el sentido moderno sin fuente de
                                aleatoriedad criptográficamente segura.
                            </li>
                        </ul>

                        <button className="close-button" onClick={() => setShowEntropyHelp(false)}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Homophonic;