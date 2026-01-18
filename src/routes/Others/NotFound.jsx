import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';

import logo from '../../assets/logo.svg';
import './NotFound.css';
import TextType from '../../components/text/TextType';
import ScrambledText from '../../components/text/ScrambleText';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const section = sectionRef.current;

            const logoEl = section.querySelector('.cf-not-found-logo');
            const errorEl = section.querySelector('.cf-not-found-error');
            const titleEl = section.querySelector('.cf-not-found-title');
            const textEl = section.querySelector('.cf-not-found-text');
            const actionsEl = section.querySelector('.cf-not-found-actions');
            const buttons = section.querySelectorAll(
                '.cf-not-found-button-back, .cf-not-found-button-home'
            );

            // Estado inicial con algo de blur y desplazamiento
            gsap.set(logoEl, {
                opacity: 0,
                scale: 0.6,
                filter: 'blur(6px)',
                y: -10,
            });

            gsap.set(errorEl, {
                opacity: 0,
                y: -10,
                skewX: -8,
            });

            gsap.set(titleEl, {
                opacity: 0,
                y: 40,
            });

            gsap.set(textEl, {
                opacity: 0,
                y: 20,
                filter: 'blur(8px)',
            });

            gsap.set(actionsEl, {
                opacity: 0,
                y: 30,
            });

            gsap.set(buttons, {
                opacity: 0,
                y: 15,
                scale: 0.95,
            });

            // Timeline principal
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // 1. Logo: pop + blur
            tl.to(logoEl, {
                opacity: 1,
                scale: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.7,
            })

                // 2. error 404 con pequeño efecto "glitchy"
                .to(
                    errorEl,
                    {
                        opacity: 1,
                        y: 0,
                        skewX: 0,
                        duration: 0.5,
                    },
                    '-=0.3'
                )
                .to(
                    errorEl,
                    {
                        x: 3,
                        duration: 0.08,
                        yoyo: true,
                        repeat: 3,
                        ease: 'power1.inOut',
                    },
                    '-=0.4'
                )

                // 3. Título cae desde abajo
                .to(
                    titleEl,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                    },
                    '-=0.2'
                )

                // 4. Texto Scrambled: fade + blur-out
                .to(
                    textEl,
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.8,
                    },
                    '-=0.3'
                )

                // 5. Botones: stagger con ligera escala
                .to(
                    actionsEl,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                    },
                    '-=0.3'
                )
                .to(
                    buttons,
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.35,
                        stagger: 0.1,
                    },
                    '-=0.25'
                );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <section className="cf-not-found" ref={sectionRef}>
                {/* Content */}
                <img src={logo} alt="CypherFox Logo" className="cf-not-found-logo" />

                <TextType
                    text="error 404"
                    as="span" // para evitar el problema de la fuente con p global
                    className="cf-not-found-error"
                    typingSpeed={80}
                    deletingSpeed={65}
                    pauseDuration={1800}
                    loop={true}
                    showCursor={true}
                    cursorCharacter="|"
                    textColors={['var(--cf-green)']}
                />

                <h1 className="cf-not-found-title">Página no encontrada</h1>

                <ScrambledText
                    radius={60}
                    duration={5}
                    speed={0.1}
                    className="cf-not-found-text"
                >
                    La ruta que intentas visitar no existe o tal vez fue movida.
                    Revisa la URL o utiliza las opciones de navegación para continuar.
                </ScrambledText>

                {/* Actions */}
                <div className="cf-not-found-actions">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="cf-not-found-button-back"
                    >
                        ← Volver a la página anterior
                    </button>

                    <Link to="/" className="cf-not-found-button-home">
                        Ir al inicio
                    </Link>
                </div>
            </section>
        </>
    );
};

export default NotFoundPage;