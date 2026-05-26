// routes/Methods/Lecciones/Gamal.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import "katex/dist/katex.min.css"; import { BlockMath, InlineMath } from "react-katex";
import "./Gamal.css";
import Welcome from "../../../assets/welcome.gif";
import Study from "../../../assets/study.gif";
import Help from "../../../assets/help.gif";

import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";

import { gsap } from "gsap";

// Utilidades matemáticas (demo educativa: enteros normales; números pequeños)
const mod = (a, m) => ((a % m) + m) % m;
const gcd = (a, b) => {
    let x = Math.abs(a), y = Math.abs(b);
    while (y) {
        [x, y] = [y, x % y]
    } return x
};
const powMod = (base, exp, modulus) => {
    let b = mod(base, modulus), e = Math.floor(exp), r = 1 % modulus;
    while (e > 0) {
        if (e & 1) r = mod(r * b, modulus);
        b = mod(b * b, modulus); e >>= 1
    } return r
};

function Gamal() {
    // Parámetros por defecto tomados del ejemplo del material
    const [p, setP] = useState(2579);
    const [a, setA] = useState(2);
    const [secret, setSecret] = useState(765);
    const [k, setK] = useState(853);
    const [m, setM] = useState(1299);
    const [h, setH] = useState(!1);
    // Valores derivados
    const beta = useMemo(() => powMod(a, secret, p), [a, secret, p]);
    const gamma = useMemo(() => powMod(a, k, p), [a, k, p]);
    const deltaPrime = useMemo(() => powMod(beta, k, p), [beta, k, p]);
    const delta = useMemo(() => mod(m * deltaPrime, p), [m, deltaPrime, p]);
    const pPrime = useMemo(() => p - 1 - secret, [p, secret]);
    const mPrime = useMemo(() => powMod(gamma, pPrime, p), [gamma, pPrime, p]);
    const decrypted = useMemo(() => mod(delta * mPrime, p), [delta, mPrime, p]);
    const validPrimeRange = useMemo(() => p > 3 && Number.isFinite(p), [p]);
    const validInputs = useMemo(() => {
        if (!validPrimeRange) return !1;
        if (a <= 1 || a >= p) return !1;
        if (secret < 1 || secret > p - 2) return !1;
        if (k < 1 || k > p - 2) return !1;
        if (m < 1 || m > p - 1) return !1;
        return !0;
    }, [validPrimeRange, p, a, secret, k, m]);
    // refs para animaciones (misma coreografía que Caesar)
    const r1 = useRef(null), r2 = useRef(null), r3 = useRef(null), r4 = useRef(null), r5 = useRef(null), r6 = useRef(null), r7 = useRef(null);
    useEffect(() => {
        const c = gsap.context(() => {
            const t = gsap.timeline({ defaults: { ease: "power3.out", duration: .6 } });
            t.from(r1.current, { opacity: 0, y: 20 })
                .from(r2.current, { opacity: 0, scale: .8 }, "-=0.3")
                .from(r3.current, { opacity: 0, x: -20 }, "-=0.4")
                .from(r4.current, { opacity: 0, y: 24 }, "-=0.2")
                .from(r5.current, { opacity: 0, y: 24 }, "+=0.1")
                .from(r6.current, { opacity: 0, y: 24 }, "-=0.3")
                .from(r7.current, { opacity: 0, y: 24 }, "+=0.1")
        }); return () => c.revert()
    }, []);
    const clampInt = (v, min, max) => {
        const n = Number(v);
        if (!Number.isFinite(n)) return min;
        return Math.max(min, Math.min(max, Math.floor(n)));
    };
    return (
        <div className="gamal-page">
            <div className="container gamal-shell">
                <section className="gamal-hero">
                    <div className="hero-copy" ref={r1}>
                        <span className="hero-badge">Lección · Clave pública</span>
                        <h1>Juega con <DecryptedText text="Gamal" className="hero-copy-tittle" encryptedClassName="hero-copy-tittle text-encrypted" speed={120} maxIterations={60} /></h1>
                        <div>
                            <TextType
                                text="Un primo p, un generador α, un secreto a y un nonce k. Mira cómo la dificultad del logaritmo discreto se convierte en un cifrado probabilístico con dos números (γ, δ)."
                                as="span" typingSpeed={25} deletingSpeed={65} pauseDuration={1800} textColors={["var(--cf-text)"]}
                            />
                        </div>
                        <p className="hero-secondary">Demo educativa con números pequeños (como en el ejemplo del curso). En sistemas reales se usan tamaños criptográficos grandes.</p>
                    </div>
                    <div className="hero-visual">
                        <img src={Welcome} alt="Fox" className="hero-mascot" ref={r3} />
                        <div className="hero-circle hero-circle-main" ref={r2}>
                            <div className="hero-circle-inner">
                                <span className="k-label">k</span>
                                <span className="k-value">{k}</span>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>
                <section className="gamal-band band-lab">
                    <div className="band-lab-inner" ref={r4}>
                        <div className="lab-core">
                            <header className="lab-header-row">
                                <div>
                                    <h2><DecryptedText text="Laboratorio Gamal" className="hero-copy-tittle" encryptedClassName="hero-copy-tittle text-encrypted" speed={120} maxIterations={60} /></h2>
                                    <div className="lab-subtitle">
                                        <TextType text="Ajusta (p, α, a, k, m). Calculamos β=α^a mod p, luego γ=α^k mod p y δ=m·β^k mod p. Finalmente recuperamos m con γ^(p−1−a)." as="span" typingSpeed={25} deletingSpeed={65} pauseDuration={1800} textColors={["var(--cf-text)"]} />
                                    </div>
                                </div>
                                <div className="lab-slider">
                                    <span className="slider-label">Estado</span>
                                    <span className="eq-pill"><strong>{validInputs ? "OK" : "Revisa"}</strong> <span>{validInputs ? "parámetros" : "rangos"}</span></span>
                                </div>
                            </header>
                            <div className="lab-grid">
                                <div className="key-card">
                                    <h4>Claves</h4>
                                    <div className="key-row"><span className="label">p</span><span className="value">{p}</span><span className="label">α</span><span className="value">{a}</span></div>
                                    <div className="key-row" style={{ marginTop: ".35rem" }}><span className="label">a</span><span className="value">{secret}</span><span className="label">β</span><span className="value">{beta}</span></div>
                                    <p className="key-note">Pública: <InlineMath math="(p,\alpha,\beta)" /> · Secreta: <InlineMath math="a" />.</p>
                                </div>
                                <div className="key-card">
                                    <h4>Cifrado</h4>
                                    <div className="key-row"><span className="label">m</span><span className="value">{m}</span><span className="label">k</span><span className="value">{k}</span></div>
                                    <div className="key-row" style={{ marginTop: ".35rem" }}><span className="label">γ</span><span className="value">{gamma}</span><span className="label">δ</span><span className="value">{delta}</span></div>
                                    <p className="key-note">Cifrado: <InlineMath math="(\gamma,\delta)" />. El nonce <InlineMath math="k" /> debe ser aleatorio y no reutilizarse.</p>
                                </div>
                            </div>
                            <div className="lab-controls">
                                <label>Primo p
                                    <input type="number" className="form-control" value={p} onChange={e => setP(clampInt(e.target.value, 5, 100000))} />
                                </label>
                                <label>Generador α
                                    <input type="number" className="form-control" value={a} onChange={e => setA(clampInt(e.target.value, 2, Math.max(2, p - 2)))} />
                                </label>
                                <label>Secreto a
                                    <input type="number" className="form-control" value={secret} onChange={e => setSecret(clampInt(e.target.value, 1, Math.max(1, p - 2)))} />
                                </label>
                                <label>Nonce k
                                    <input type="number" className="form-control" value={k} onChange={e => setK(clampInt(e.target.value, 1, Math.max(1, p - 2)))} />
                                </label>
                                <label>Mensaje m (en <InlineMath math="\mathbb {Z}_p^*" />)
                                    <input type="number" className="form-control" value={m} onChange={e => setM(clampInt(e.target.value, 1, Math.max(1, p - 1)))} />
                                </label>
                            </div>
                            <div className="lab-results">
                                <div>
                                    <span className="example-label">Paso intermedio</span>
                                    <ScrambledText radius={10} duration={5} speed={.1} className="p">{`δ' = β^k mod p = ${deltaPrime}`}</ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">Descifrado</span>
                                    <ScrambledText radius={10} duration={5} speed={.1} className="p">{`m = (δ · γ^(p−1−a)) mod p = ${decrypted}`}</ScrambledText>
                                </div>
                            </div>
                        </div>
                        <aside className="history-floating" ref={r7}>
                            <h3><DecryptedText text="Contexto histórico" className="h3" encryptedClassName="h3 text-encrypted" speed={120} maxIterations={60} /></h3>
                            <TextType
                                text="En el material del curso se atribuye a Taher ElGamal (1984). La idea central es aprovechar la dificultad del logaritmo discreto: publicar β=α^a mod p sin revelar a, y usar un k efímero para que el cifrado sea probabilístico."
                                as="p" typingSpeed={25} deletingSpeed={65} pauseDuration={1800} textColors={["var(--cf-text)"]}
                            />
                            <p className="key-note">Tip: si reutilizas el mismo <InlineMath math="k" />, puedes filtrar información del secreto en esquemas de este estilo.</p>
                        </aside>
                    </div>
                </section>
                <section className="gamal-band band-bottom">
                    <div className="band-grid">
                        <div className="card-free math-card" ref={r5}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2><DecryptedText text="El modelo matemático" className="h2" encryptedClassName="h2 text-encrypted" speed={120} maxIterations={60} /></h2>
                                </div>
                                <button type="button" className="math-help-button" onClick={() => setH(!0)}>¿Por qué funciona?</button>
                            </div>
                            <p>Trabajamos en <InlineMath math="\mathbb{Z}_p^*" /> con un primo <InlineMath math="p" /> y un generador <InlineMath math="\alpha" />. La clave pública incluye:</p>
                            <ul className="math-list">
                                <li><InlineMath math="\beta \equiv \alpha^a \pmod p" /> con <InlineMath math="a" /> secreto.</li>
                                <li>El cifrado de un mensaje <InlineMath math="m" /> usa un nonce aleatorio <InlineMath math="k" />.</li>
                            </ul>
                            <div className="math-formula">
                                <BlockMath math="\gamma = \alpha^k \bmod p" />
                                <BlockMath math="\delta = m\,\beta^k \bmod p" />
                            </div>
                            <p className="math-explanation">Descifrado (como en las diapositivas):</p>
                            <div className="math-formula">
                                <BlockMath math="p' = p - 1 - a" />
                                <BlockMath math="m' = \gamma^{p'} \bmod p" />
                                <BlockMath math="m = \delta\, m' \bmod p" />
                            </div>
                            <p>La intuición: <InlineMath math="\beta^k=(\alpha^a)^k=\alpha^{ak}" /> y <InlineMath math="\gamma=\alpha^k" />. Entonces <InlineMath math="\gamma^{p-1-a}\equiv(\gamma^a)^{-1}\pmod p" />, lo que cancela el factor <InlineMath math="\beta^k" />.</p>
                        </div>
                        <div className="card-free game-card" ref={r6}>
                            <h2><DecryptedText text="Reproduce el ejemplo del curso" className="h2" encryptedClassName="h2 text-encrypted" speed={120} maxIterations={60} /></h2>
                            <TextType
                                text="Pon p=2579, α=2, a=765, k=853, m=1299. Debes obtener β=949, γ=435, δ'=2424, δ=2396 y recuperar m=1299."
                                as="p" typingSpeed={25} deletingSpeed={65} pauseDuration={1800} textColors={["var(--cf-text)"]}
                            />
                            <div className="lab-controls" style={{ marginTop: ".6rem" }}>
                                <label>Primo p
                                    <input type="number" className="form-control" value={p} onChange={e => setP(clampInt(e.target.value, 5, 100000))} />
                                </label>
                                <label>Generador α
                                    <input type="number" className="form-control" value={a} onChange={e => setA(clampInt(e.target.value, 2, Math.max(2, p - 2)))} />
                                </label>
                                <label>Secreto a
                                    <input type="number" className="form-control" value={secret} onChange={e => setSecret(clampInt(e.target.value, 1, Math.max(1, p - 2)))} />
                                </label>
                                <label>Nonce k
                                    <input type="number" className="form-control" value={k} onChange={e => setK(clampInt(e.target.value, 1, Math.max(1, p - 2)))} />
                                </label>
                                <label>Mensaje m (en <InlineMath math="\mathbb {Z}_p^*"/>)
                                    <input type="number" className="form-control" value={m} onChange={e => setM(clampInt(e.target.value, 1, Math.max(1, p - 1)))} />
                                </label>
                            </div>
                            <p className="game-tip">Si quieres probar el ejercicio: cambia m a 688 (con el mismo k) y observa el nuevo (γ, δ).</p>
                            <img src={Study} alt="Study" className="math-mascot" />
                        </div>
                    </div>
                </section>
                {h && (
                    <div className="modal-backdrop" onClick={() => setH(!1)} role="dialog" aria-modal="true">
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header-with-fox">
                                <h3>¿Por qué usamos <InlineMath math="p-1-a" />?</h3>
                                <img src={Help} alt="Help" className="modal-mascot" />
                            </div>
                            <p>En <InlineMath math="\mathbb{Z}_p^*" /> se cumple <InlineMath math="x^{p-1}\equiv 1\pmod p" /> para <InlineMath math="x\neq 0" />. Como <InlineMath math="\gamma=\alpha^k" />, entonces <InlineMath math="\gamma^{p-1-a}=\gamma^{p-1}\cdot \gamma^{-a}\equiv (\gamma^a)^{-1}\pmod p" />.</p>
                            <p>Y como <InlineMath math="\gamma^a=(\alpha^k)^a=\alpha^{ka}=\beta^k" />, multiplicar <InlineMath math="\delta=m\beta^k" /> por ese inverso cancela el factor y recupera <InlineMath math="m" />.</p>
                            <button type="button" className="close-button" onClick={() => setH(!1)}>Entendido</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Gamal;
