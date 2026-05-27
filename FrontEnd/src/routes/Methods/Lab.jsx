// src/routes/Methods/Lab.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import gsap from "gsap";
import "./Lab.css";
import FaultyTerminal from "../../components/bg/FaultyTerminal.jsx";
import { metodos } from "../../util/metodos.js";
import { CodeBlock, ExampleBlock } from "../../components/cards/CodeBlock.jsx";
import LabEditor from "../../components/cards/LabEditor.jsx";
import TextType from "../../components/text/TextType.jsx";
import DecryptedText from "../../components/text/DecryptedText.jsx";
import { api } from "../../util/api.js";
import Welcome from "../../assets/welcome.gif";
import Waiting from "../../assets/waiting.gif";
import Help from "../../assets/help.gif";
import Happy from "../../assets/happy.gif";
import Sad from "../../assets/sad.gif";

function formatParams(paramList) {
  if (!Array.isArray(paramList)) return "";
  return paramList.map(([nombre, tipo]) => `${nombre}: ${tipo}`).join(", ");
}

export default function Lab() {
  console.log("iasd");
  const { metodo } = useParams();
  const LabData = metodos[metodo];

  if (!LabData || !LabData.lab_cifrado || !LabData.lab_descifrado) {
    return <Navigate to="/404" replace />;
  }

  const encrypt = LabData.lab_cifrado;
  const decrypt = LabData.lab_descifrado;

  const encryptParams = formatParams(encrypt.parametros);
  const decryptParams = formatParams(decrypt.parametros);

  const encryptCode = `def ${LabData.clave}_encrypt(*, ${encryptParams}) -> ${encrypt.salida}:
    \"\"\"${encrypt.descripcion}\"\"\"
    # TODO: Implementar lógica de cifrado
    return 'MENSAJE ENCRIPTADO'`;

  const decryptCode = `def ${LabData.clave}_decrypt(*, ${decryptParams}) -> ${decrypt.salida}:
    \"\"\"${decrypt.descripcion}\"\"\"
    # TODO: Implementar lógica de descifrado
    return 'MENSAJE DESCIFRADO'`;

  const configBlock = LabData.config
    ? `${LabData.config}\n`
    : `# USA EL ALFABETO INGLES EN MAYUSCULAS\n\n`;

  const defaultCode = `${configBlock}${encryptCode}\n\n${decryptCode}`;
  const storageKey = `cf_lab_code_${metodo}`;

  const [userCode, setUserCode] = useState(() => {
    const savedCode = localStorage.getItem(storageKey);
    return savedCode ?? defaultCode;
  });

  useEffect(() => {
    const savedCode = localStorage.getItem(storageKey);
    setUserCode(savedCode ?? defaultCode);
  }, [storageKey, defaultCode]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [waitingOpen, setWaitingOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultData, setResultData] = useState(null);

  // Refs para GSAP
  const headerRef = useRef(null);
  const panelsRef = useRef([]);
  const editorRef = useRef(null);

  // Animación inicial al montar
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      if (panelsRef.current.length > 0) {
        gsap.from(panelsRef.current, {
          y: 25,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.1,
        });
      }

      if (editorRef.current) {
        gsap.from(editorRef.current, {
          y: 25,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.4,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Animaciones basadas en scroll con IntersectionObserver
  useEffect(() => {
    const elements = [...panelsRef.current, editorRef.current].filter(Boolean);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
            });
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    elements.forEach((el) => {
      gsap.set(el, { y: 18, opacity: 0 });
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleConfirmSend = async () => {
    setConfirmOpen(false);
    setWaitingOpen(true);

    localStorage.setItem(storageKey, userCode);

    try {
      const result = await api.getScore(userCode, metodo);
      const passed = result.score >= 3;

      const message = passed
        ? "¡Has aprobado el laboratorio! Buen trabajo, puedes seguir con el siguiente módulo."
        : "Has perdido la nota de este intento. Revisa tu código y vuelve a intentarlo.";

      setWaitingOpen(false);
      setResultData({
        passed,
        score: result.score,
        message,
        encrypt: result.encrypt,
        decrypt: result.decrypt,
      });
      setResultOpen(true);
    } catch (error) {
      setWaitingOpen(false);
      setResultData({
        passed: false,
        score: 0,
        message:
          error.message ??
          "Ocurrió un error al calificar tu código. Intenta de nuevo.",
        encrypt: null,
        decrypt: null,
      });
      setResultOpen(true);
    }
  };

  const handleCloseResult = () => {
    setResultOpen(false);
  };

  const handleClickSend = () => {
    if (!userCode.trim()) {
      alert("El código está vacío. Escribe o edita algo antes de enviar.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleResetCode = () => {
    localStorage.removeItem(storageKey);
    setUserCode(defaultCode);
  };

  return (
    <div className="cf-lab-page">
      {/* FONDO FAULTY TERMINAL + VELO OSCURO */}
      <div className="cf-lab-bg">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#138245"
          mouseReact
          mouseStrength={0.5}
          pageLoadAnimation
          brightness={0.6}
        />
        <div className="cf-lab-bg-overlay" />
      </div>

      {/* CONTENIDO DEL LAB */}
      <main className="cf-lab-content">
        <header ref={headerRef} className="cf-lab-header text-center">
          <div>
            <p className="cf-lab-badge"> Laboratorio interactivo </p>
            <h1 className="cf-lab-title">
              <DecryptedText
                text={`Método ${LabData.nombre}`}
                className="cf-lab-title"
                encryptedClassName="cf-lab-title--encrypted"
                speed={120}
                maxIterations={60}
              />
            </h1>
            <div className="cf-lab-subtitle">
              <TextType
                text={LabData.descripcion}
                as="p"
                typingSpeed={25}
                deletingSpeed={65}
                pauseDuration={1800}
              />
            </div>
          </div>
          <img
            src={Welcome}
            alt="Bienvenida al laboratorio"
            className="cf-lab-header-img"
          />
        </header>

        {/* FILA DE PANELES */}
        <section className="cf-lab-panels row justify-content-center">
          <article
            ref={(el) => (panelsRef.current[0] = el)}
            className="cf-lab-panel cf-lab-panel--encrypt col-11 col-md-10 col-lg-5"
          >
            <h2 className="cf-lab-panel-title mb-2">
              <DecryptedText
                text="Cifrado"
                className="cf-lab-panel-title"
                encryptedClassName="cf-lab-panel-title--encrypted"
                speed={120}
                maxIterations={60}
              />
            </h2>
            <div className="cf-lab-panel-description">
              <TextType
                text="Utiliza esta plantilla para asegurar la correcta verificación de tu implementación."
                as="p"
                typingSpeed={25}
                deletingSpeed={65}
                pauseDuration={1800}
              />
            </div>
            <CodeBlock code={encryptCode} language="python" />
            {encrypt.ejemplos && encrypt.ejemplos.length > 0 && (
              <div className="cf-lab-examples mt-3">
                <h3 className="cf-lab-examples-title">Ejemplos</h3>
                <div className="cf-lab-examples-colab">
                  {encrypt.ejemplos.map((ej, idx) => (
                    <ExampleBlock
                      key={idx}
                      fnName={`${LabData.clave}_encrypt`}
                      params={ej.parametros}
                      paramMeta={encrypt.parametros}
                      result={ej.resultados}
                      language="python"
                    />
                  ))}
                </div>
              </div>
            )}
          </article>

          <article
            ref={(el) => (panelsRef.current[1] = el)}
            className="cf-lab-panel cf-lab-panel--decrypt col-11 col-md-10 col-lg-5"
          >
            <h2 className="cf-lab-panel-title mb-2">
              <DecryptedText
                text="Descifrado"
                className="cf-lab-panel-title"
                encryptedClassName="cf-lab-panel-title--encrypted"
                speed={120}
                maxIterations={60}
              />
            </h2>
            <div className="cf-lab-panel-description">
              <TextType
                text="Utiliza esta plantilla para asegurar la correcta verificación de tu implementación."
                as="p"
                typingSpeed={25}
                deletingSpeed={65}
                pauseDuration={1800}
              />
            </div>
            <CodeBlock code={decryptCode} language="python" />
            {decrypt.ejemplos && decrypt.ejemplos.length > 0 && (
              <div className="cf-lab-examples mt-3">
                <h3 className="cf-lab-examples-title">Ejemplos</h3>
                <div className="cf-lab-examples-colab">
                  {decrypt.ejemplos.map((ej, idx) => (
                    <ExampleBlock
                      key={idx}
                      fnName={`${LabData.clave}_decrypt`}
                      params={ej.parametros}
                      paramMeta={decrypt.parametros}
                      result={ej.resultados}
                      language="python"
                    />
                  ))}
                </div>
              </div>
            )}
          </article>
        </section>

        {/* EDITOR DE CÓDIGO INTERACTIVO */}
        <section className="cf-lab-input row justify-content-center mt-4">
          <div className="col-11 col-md-10 col-lg-10">
            <label className="cf-lab-input-label mb-2" htmlFor="lab-code-input">
              Ingrese / edite el código del laboratorio
            </label>

            <div ref={editorRef}>
              <LabEditor
                value={userCode}
                language="python"
                onChange={(value) => {
                  setUserCode(value);
                }}
              />
            </div>

            <button
              className="cf-btn cf-btn-primary mt-3"
              type="button"
              onClick={handleClickSend}
            >
              Enviar y Calificar Código
            </button>

            <button
              className="cf-btn cf-btn-secondary mt-3 ms-2"
              type="button"
              onClick={handleResetCode}
            >
              Restablecer código
            </button>
          </div>
        </section>
      </main>

      {/* MODAL DE CONFIRMACIÓN */}
      {confirmOpen && (
        <div className="cf-modal-backdrop">
          <div className="cf-modal">
            <div className="cf-modal-illustration">
              <img src={Help} alt="Confirmación de envío" />
            </div>
            <h2 className="cf-modal-title">
              ¿Estás seguro de enviar este código?
            </h2>
            <p className="cf-modal-text">
              Se simulará la calificación del laboratorio con la versión actual
              de tu código. Podrás volver a intentarlo si no apruebas.
            </p>
            <div className="cf-modal-actions">
              <button
                type="button"
                className="cf-btn cf-btn-secondary"
                onClick={() => setConfirmOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="cf-btn cf-btn-primary"
                onClick={handleConfirmSend}
              >
                Sí, enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ESPERA / CALIFICANDO */}
      {waitingOpen && (
        <div className="cf-modal-backdrop">
          <div className="cf-modal">
            <div className="cf-modal-illustration">
              <img src={Waiting} alt="Calificando tu laboratorio" />
            </div>
            <h2 className="cf-modal-title">Calificando tu laboratorio...</h2>
            <p className="cf-modal-text">
              Estamos simulando la evaluación automática de tu código. Este
              proceso puede tardar algunos segundos.
            </p>
            <div className="cf-modal-spinner" />
          </div>
        </div>
      )}

      {/* MODAL DE RESULTADO */}
      {resultOpen && resultData && (
        <div className="cf-modal-backdrop">
          <div className="cf-modal">
            <div className="cf-modal-illustration">
              {resultData.passed ? (
                <img src={Happy} alt="Laboratorio aprobado" />
              ) : (
                <img src={Sad} alt="Laboratorio no aprobado" />
              )}
            </div>
            <h2 className="cf-modal-title">
              {resultData.passed
                ? "¡Laboratorio aprobado!"
                : "Laboratorio no aprobado"}
            </h2>
            <p className="cf-modal-text">{resultData.message}</p>
            <p className="cf-modal-score">Resultado: {resultData.score} / 5</p>

            {resultData.encrypt && resultData.decrypt && (
              <div className="cf-modal-breakdown">
                <p>
                  Cifrado: {resultData.encrypt.passed}/
                  {resultData.encrypt.total} casos correctos
                </p>
                <p>
                  Descifrado: {resultData.decrypt.passed}/
                  {resultData.decrypt.total} casos correctos
                </p>
              </div>
            )}

            <div className="cf-modal-actions">
              <button
                type="button"
                className="cf-btn cf-btn-primary"
                onClick={handleCloseResult}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

