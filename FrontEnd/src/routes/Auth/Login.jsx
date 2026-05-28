// src/routes/Auth/Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';

import { loginWithGoogle } from '../../util/auth.js';

import DecryptedText from '../../components/text/DecryptedText.jsx';
import TextType from '../../components/text/TextType.jsx';

import Study from '../../assets/study.gif';

import './Login.css';

const Login = () => {
    const onGoogleClick = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="cf-login-page">
            <div className="cf-login-shell">
                <div className="cf-login-hero">
                    {/* Copy */}
                    <div className="cf-login-copy">
                        <span className="hero-badge">Acceso seguro</span>

                        <h1 className="hero-copy-tittle">
                            <DecryptedText
                                text="CypherFox"
                                className="hero-copy-tittle"
                                encryptedClassName="hero-copy-tittle hero-copy-tittle--encrypted"
                                speed={120}
                                maxIterations={60}
                                sequential={true}
                                revealDirection="start"
                                useOriginalCharsOnly={false}
                                animateOn="both"
                            />
                        </h1>

                        <p className="cf-login-lead">
                            <TextType
                                text="Inicia sesión con Google para guardar tu progreso, desbloquear el laboratorio evaluable y registrar tus misiones."
                                as="span"
                                className="cf-login-lead"
                                typingSpeed={28}
                                loop={false}
                                showCursor={true}
                                cursorCharacter="|"
                            />
                        </p>

                        <div className="cf-login-perks">
                            <div className="cf-login-perk">
                                <span className="cf-login-perk-dot" aria-hidden="true" />
                                <span>Historial de intentos y resultados.</span>
                            </div>
                            <div className="cf-login-perk">
                                <span className="cf-login-perk-dot" aria-hidden="true" />
                                <span>Acceso a prácticas con evaluación automática.</span>
                            </div>
                            <div className="cf-login-perk">
                                <span className="cf-login-perk-dot" aria-hidden="true" />
                                <span>Sin contraseñas: autenticación por Google.</span>
                            </div>
                        </div>

                        <div className="hero-cta">
                            <button
                                type="button"
                                className="cf-login-google hero-button"
                                onClick={onGoogleClick}
                            >
                                <span className="cf-login-google-mark" aria-hidden="true">G</span>
                                Continuar con Google
                            </button>

                            <Link to="/" className="cf-login-secondary hero-secondary">
                                Volver al inicio
                            </Link>
                        </div>

                        <p className="cf-login-legal">
                            Al continuar, aceptas los <Link to="/terminos" className="cf-login-legal-link">
                                términos y condiciones
                            </Link> del proyecto.
                            <span className="cf-login-legal-muted"> No almacenamos tu contraseña.</span>
                        </p>
                    </div>

                    {/* Visual */}
                    <div className="cf-login-visual" aria-hidden="true">

                        <div className="hero-circle hero-circle-main">
                            <div className="hero-circle-inner">
                            </div>
                        </div>

                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />

                        <div className="cf-login-float card-free">
                            <div className="cf-login-float-row">
                                <img src={Study} alt="" className="cf-login-float-img" />
                                <div>
                                    <h3 className="cf-login-float-title">Tip rápido</h3>
                                    <p className="cf-login-float-text">
                                        La seguridad depende de la clave, no del secreto del sistema.
                                        <span className="cf-login-float-em"> (Kerckhoffs)</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;