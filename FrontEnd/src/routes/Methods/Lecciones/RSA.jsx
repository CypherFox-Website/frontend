// routes/Methods/Lecciones/RSA.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import "katex/dist/katex.min.css"; import { BlockMath, InlineMath } from "react-katex";
import "./RSA.css";

import Welcome from "../../../assets/welcome.gif";
import Study from "../../../assets/study.gif";
import Help from "../../../assets/help.gif";

import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";

import { gsap } from "gsap";

function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b); while (b !== 0) {
        const t = a % b; a = b; b = t
    }
    return a
}

function egcd(a, b) {
    let old_r = a, r = b;
    let old_s = 1, s = 0;
    let old_t = 0, t = 1;

    while (r !== 0) {
        const q = Math.trunc(old_r / r);
        [old_r, r] = [r, old_r - q * r];
        [old_s, s] = [s, old_s - q * s];
        [old_t, t] = [t, old_t - q * t]
    }
    return { g: old_r, x: old_s, y: old_t }
}

function mod(n, m) { return ((n % m) + m) % m }

function modInverse(e, phi) {
    const { g, x } = egcd(phi, e);
    if (g !== 1) return null;

    const { y } = egcd(phi, e);
    return mod(y, phi)
}

function powMod(base, exp, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    let b = mod(base, modulus);
    let e = exp;

    while (e > 0) {
        if (e % 2 === 1) result = mod(result * b, modulus);
        e = Math.trunc(e / 2);
        b = mod(b * b, modulus)
    }
    return result
}

function isPrime(n) {
    if (n < 2) return false;
    if (n % 2 === 0) return n === 2;
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false
    }
    return true
}

function RSA() {
    // demo defaults match the example in the lecture notes
    const [p, setP] = useState(47);
    const [q, setQ] = useState(71);
    const [e, setE] = useState(79);
    const [m, setM] = useState(688);
    const [h, setH] = useState(false);

    const n = useMemo(() => Number(p || 0) * Number(q || 0), [p, q]);
    const phi = useMemo(() => {
        const pp = Number(p || 0), qq = Number(q || 0);
        return (pp > 0 && qq > 0) ? (pp - 1) * (qq - 1) : 0
    }, [p, q]
    );

    const g = useMemo(() => gcd(Number(e || 0), Number(phi || 0)), [e, phi]);
    const d = useMemo(() => {
        const ee = Number(e || 0), ph = Number(phi || 0);
        if (ph <= 0 || ee <= 0) return null;
        if (gcd(ee, ph) !== 1) return null;
        return modInverse(ee, ph)
    }, [e, phi]
    );

    const c = useMemo(() => {
        const ee = Number(e || 0), mm = Number(m || 0);
        if (!n || !ee || mm < 0) return null;
        if (mm >= n) return null;
        return powMod(mm, ee, n)
    }, [m, e, n]);

    const m2 = useMemo(() => {
        if (c == null || d == null || !n) return null;
        return powMod(c, d, n)
    }, [c, d, n]);

    const pOk = isPrime(Number(p || 0));
    const qOk = isPrime(Number(q || 0));
    const pqOk = Number(p || 0) !== Number(q || 0);
    const eRangeOk = Number(e || 0) > 1 && Number(e || 0) < Number(phi || 0);
    const gcdOk = g === 1;
    const mOk = Number(m || 0) >= 0 && Number(m || 0) < Number(n || 0);

    const r1 = useRef(null), r2 = useRef(null), r3 = useRef(null), r4 = useRef(null), r5 = useRef(null), r6 = useRef(null), r7 = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const t = gsap.timeline({ defaults: { ease: "power3.out", duration: .6 } });
            t.from(r1.current, { opacity: 0, y: 20 })
                .from(r2.current, { opacity: 0, scale: .8 }, "-=0.3")
                .from(r3.current, { opacity: 0, x: -20 }, "-=0.4")
                .from(r4.current, { opacity: 0, y: 24 }, "-=0.2")
                .from(r5.current, { opacity: 0, y: 24 }, "+=0.1")
                .from(r6.current, { opacity: 0, y: 24 }, "-=0.3")
                .from(r7.current, { opacity: 0, y: 24 }, "+=0.1")
        }); return () => ctx.revert()
    }, []);

    const clampInt = (v, min, max) => {
        const x = Number(v); if (Number.isNaN(x)) return min;
        return Math.max(min, Math.min(max, Math.trunc(x)))
    };

    const setPrimeish = (setter, v) => setter(clampInt(v, 2, 997));

    return (
        <div className="rsa-page">
            <div className="container rsa-shell">
                <section className="rsa-hero">
                    <div className="hero-copy" ref={r1}>
                        <span className="hero-badge">Lección · Clave pública</span>
                        <h1>
                            Juega con el <DecryptedText text="RSA" className="hero-copy-tittle" encryptedClassName="hero-copy-tittle text-encrypted" speed={120} maxIterations={60} />
                        </h1>
                        <div>
                            <TextType
                                text="Elige primos p y q, construye n y ϕ(n), encuentra la clave secreta d y prueba el cifrado: c ≡ m^e (mod n)."
                                as="span" typingSpeed={25} deletingSpeed={65} pauseDuration={1800} textColors={["var(--cf-text)"]}
                            />
                        </div>
                    </div>

                    <div className="hero-visual">
                        <img src={Welcome} alt="Fox" className="hero-mascot" ref={r3} />
                        <div className="hero-circle hero-circle-main" ref={r2}>
                            <div className="hero-circle-inner">
                                <span className="k-label">n</span>
                                <span className="k-value">{n || "–"}</span>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

                <section className="rsa-band band-lab">
                    <div className="band-lab-inner" ref={r4}>
                        <div className="lab-core">
                            <header className="lab-header-row">
                                <div>
                                    <h2><DecryptedText text="Construye tus llaves" className="hero-copy-tittle" encryptedClassName="hero-copy-tittle text-encrypted" speed={120} maxIterations={60} /></h2>
                                    <div className="lab-subtitle">
                                        <TextType
                                            text="En modo demostración usamos números pequeños: el objetivo es ver la mecánica (primos → n, ϕ → inverso modular → d)."
                                            as="span" typingSpeed={25} deletingSpeed={65} pauseDuration={1800} textColors={["var(--cf-text)"]}
                                        />
                                    </div>
                                </div>

                                <div className="lab-slider rsa-mini-status">
                                    <span className="slider-label">Validez</span>
                                    <div className="slider-stack">
                                        <small>
                                            <InlineMath math={gcdOk ? "\\gcd(e,\\varphi)=1" : "\\gcd(e,\\varphi)\\ne 1"} />
                                        </small>
                                        <div className="rsa-badges">
                                            <span className={`rsa-pill ${pOk ? "ok" : "bad"}`}>p {pOk ? "primo" : "no primo"}</span>
                                            <span className={`rsa-pill ${qOk ? "ok" : "bad"}`}>q {qOk ? "primo" : "no primo"}</span>
                                            <span className={`rsa-pill ${pqOk ? "ok" : "bad"}`}>p≠q</span>
                                            <span className={`rsa-pill ${(eRangeOk && gcdOk) ? "ok" : "bad"}`}>e válido</span>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            <div className="rsa-keygrid">
                                <div className="rsa-keycard">
                                    <h3 className="rsa-card-title">Parámetros</h3>
                                    <div className="example-controls">
                                        <label>p (primo)
                                            <input type="number" className="form-control" value={p} onChange={ev => setPrimeish(setP, ev.target.value)} />
                                        </label>
                                        <label>q (primo)
                                            <input type="number" className="form-control" value={q} onChange={ev => setPrimeish(setQ, ev.target.value)} />
                                        </label>
                                        <label>e (pública)
                                            <input type="number" className="form-control" value={e} onChange={ev => setE(clampInt(ev.target.value, 2, 9999))} />
                                        </label>
                                        <label>m (mensaje)
                                            <input type="number" className="form-control" value={m} onChange={ev => setM(clampInt(ev.target.value, 0, 999999))} />
                                            <small className={`rsa-hint ${mOk ? "ok" : "bad"}`}>Debe cumplirse: <InlineMath math="0\le m < n" />.</small>
                                        </label>
                                    </div>
                                </div>

                                <div className="rsa-keycard">
                                    <h3 className="rsa-card-title">Resultados</h3>
                                    <div className="rsa-results">
                                        <div className="rsa-row"><span className="rsa-k">n</span><span className="rsa-v">{n || "–"}</span><span className="rsa-k2"><InlineMath math="n=pq" /></span></div>
                                        <div className="rsa-row"><span className="rsa-k">ϕ(n)</span><span className="rsa-v">{phi || "–"}</span><span className="rsa-k2"><InlineMath math="\varphi=(p-1)(q-1)" /></span></div>
                                        <div className="rsa-row"><span className="rsa-k">gcd(e,ϕ)</span><span className="rsa-v">{phi ? g : "–"}</span><span className="rsa-k2"><InlineMath math="\gcd(e,\varphi)=1" /></span></div>
                                        <div className="rsa-row"><span className="rsa-k">d</span><span className="rsa-v">{d == null ? "–" : d}</span><span className="rsa-k2"><InlineMath math="ed\equiv 1\ (\bmod\ \varphi)" /></span></div>
                                        <div className="rsa-row"><span className="rsa-k">c</span><span className="rsa-v">{c == null ? "–" : c}</span><span className="rsa-k2"><InlineMath math="c\equiv m^e\ (\bmod\ n)" /></span></div>
                                        <div className="rsa-row"><span className="rsa-k">m'</span><span className="rsa-v">{m2 == null ? "–" : m2}</span><span className="rsa-k2"><InlineMath math="m'\equiv c^d\ (\bmod\ n)" /></span></div>
                                    </div>

                                    <div className="lab-example-inline">
                                        <span>Llave pública:</span>
                                        <span className="lab-example-text"><strong>({e || "–"}, {n || "–"})</strong></span>
                                        <span className="ms-3">Llave privada:</span>
                                        <span className="lab-example-text"><strong>({d == null ? "–" : d}, {n || "–"})</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="history-floating">
                            <h3><DecryptedText text="¿Por qué funciona?" className="h3" encryptedClassName="h3 text-encrypted" speed={120} maxIterations={60} /></h3>
                            <TextType
                                text="RSA separa lo público de lo secreto: cualquiera cifra con (e,n), pero solo quien conoce d puede descifrar. En clase lo verás con números pequeños; en la vida real, p y q son enormes y factorizar n es inviable."
                                as="p" typingSpeed={25} deletingSpeed={65} pauseDuration={1800} textColors={["var(--cf-text)"]}
                            />
                        </aside>
                    </div>
                </section>

                <section className="rsa-band band-bottom">
                    <div className="band-grid">

                        <div className="card-free math-card" ref={r5}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2><DecryptedText text="La receta matemática" className="h2" encryptedClassName="h2 text-encrypted" speed={120} maxIterations={60} /></h2>
                                </div>
                                <button type="button" className="math-help-button" onClick={() => setH(true)}>¿Inverso?</button>
                            </div>

                            <p>RSA (clave pública) se define por tres piezas: dos primos <InlineMath math="p,q" />, el módulo <InlineMath math="n=pq" /> y una clave pública <InlineMath math="e" />. Con ellas construimos:</p>
                            <ul className="math-list">
                                <li><InlineMath math="n=pq" /> (módulo).</li>
                                <li><InlineMath math="\varphi(n)=(p-1)(q-1)" /> (función totiente para el caso RSA).</li>
                                <li>Elegimos <InlineMath math="e" /> con <InlineMath math="1<e<\varphi(n)" /> y <InlineMath math="\gcd(e,\varphi(n))=1" />.</li>
                            </ul>

                            <p>La clave privada <InlineMath math="d" /> se define como el inverso modular de <InlineMath math="e" /> en <InlineMath math="\varphi(n)" />:</p>
                            <div className="math-formula"><BlockMath math="ed\equiv 1\ (\bmod\ \varphi(n))" /></div>

                            <p>Con eso, para un mensaje numérico <InlineMath math="m" /> que cumpla <InlineMath math="0\le m < n" />, el cifrado y descifrado quedan:</p>
                            <div className="math-formula"><BlockMath math="c\equiv m^e\ (\bmod\ n)" /></div>
                            <div className="math-formula"><BlockMath math="m\equiv c^d\ (\bmod\ n)" /></div>

                            <p className="math-explanation">En esta lección lo hacemos con números pequeños para ver el proceso. En un sistema real, el mensaje se transforma y rellena (padding) antes de aplicar RSA.</p>
                        </div>

                        <div className="card-free game-card" ref={r6}>
                            <h2><DecryptedText text="Prueba: cifra y descifra" className="h2" encryptedClassName="h2 text-encrypted" speed={120} maxIterations={60} /></h2>
                            <TextType
                                text="Cambia p, q, e y el mensaje m. Si e no es coprimo con ϕ(n) o si m ≥ n, el ‘experimento’ se rompe (a propósito)."
                                as="p" typingSpeed={25} deletingSpeed={65} pauseDuration={1800} textColors={["var(--cf-text)"]}
                            />

                            <div className="example-results rsa-example-results">
                                <div>
                                    <span className="example-label">m</span>
                                    <ScrambledText radius={10} duration={5} speed={.1} className="p">{String(m)}</ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">c</span>
                                    <ScrambledText radius={10} duration={5} speed={.1} className="p">{c == null ? "–" : String(c)}</ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">m'</span>
                                    <ScrambledText radius={10} duration={5} speed={.1} className="p">{m2 == null ? "–" : String(m2)}</ScrambledText>
                                </div>
                            </div>

                            <div className="rsa-warnings" ref={r7}>
                                {!pOk && <div className="rsa-warning">p debe ser primo.</div>}
                                {!qOk && <div className="rsa-warning">q debe ser primo.</div>}
                                {!pqOk && <div className="rsa-warning">p y q deben ser distintos.</div>}
                                {phi > 0 && !eRangeOk && <div className="rsa-warning">e debe cumplir: <InlineMath math="1<e<\varphi(n)" />.</div>}
                                {phi > 0 && !gcdOk && <div className="rsa-warning">Necesitas <InlineMath math="\gcd(e,\varphi(n))=1" /> para que exista <InlineMath math="d" />.</div>}
                                {!mOk && <div className="rsa-warning">El mensaje debe cumplir: <InlineMath math="0\le m < n" />.</div>}
                            </div>

                            <img src={Study} alt="Study" className="math-mascot" />
                        </div>

                    </div>
                </section>

                {h && (
                    <div className="modal-backdrop" onClick={() => setH(false)} role="dialog" aria-modal="true">
                        <div className="modal-content" onClick={ev => ev.stopPropagation()}>
                            <div className="modal-header-with-fox">
                                <h3>¿Qué es el inverso modular?</h3>
                                <img src={Help} alt="Help" className="modal-mascot" />
                            </div>

                            <p>
                                Decir que <InlineMath math="d" /> es el inverso modular de <InlineMath math="e" /> módulo <InlineMath math="\varphi" /> significa que al multiplicarlos obtenemos 1 “en reloj modular”:
                            </p>
                            <div className="math-formula"><BlockMath math="ed\equiv 1\ (\bmod\ \varphi)" /></div>

                            <p>
                                Este <InlineMath math="d" /> existe <strong>solo si</strong> <InlineMath math="\gcd(e,\varphi)=1" />. Para hallarlo usamos el Algoritmo de Euclides Extendido (EEA), que encuentra números <InlineMath math="x,y" /> tales que:
                            </p>
                            <div className="math-formula"><BlockMath math="\varphi x + ey = 1" /></div>

                            <p>
                                Tomando módulo <InlineMath math="\varphi" />, queda <InlineMath math="ey\equiv 1\ (\bmod\ \varphi)" />, así que <InlineMath math="d\equiv y\ (\bmod\ \varphi)" />.
                            </p>

                            <button type="button" className="close-button" onClick={() => setH(false)}>Entendido</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default RSA;