// src/pages/Terms.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import DecryptedText from '../../components/text/DecryptedText.jsx';
import Orb from '../../components/bg/Orb.jsx';
import './Terms.css';

const Terms = () => {
    const termsRef = useRef(null);

    // Scroll top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Simple fade-in animation for content
    useEffect(() => {
        if (!termsRef.current) return;

        const ctx = gsap.context(() => {
            const sections = termsRef.current.querySelectorAll('.cf-terms-section');
            const header = termsRef.current.querySelector('.cf-terms-header');

            gsap.from(header, {
                opacity: 0,
                y: -20,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.from(sections, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: termsRef.current,
                    start: 'top 80%',
                }
            });
        }, termsRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="cf-terms-page" ref={termsRef}>
            {/* Background Orb for subtle ambient light */}
            <div className="cf-terms-orb-layer">
                <Orb hue={210} intensity={0.5} />
            </div>

            <div className="cf-terms-container">
                <div className="cf-terms-header">
                    <h1 className="cf-terms-title">
                        <DecryptedText
                            text="TÉRMINOS Y CONDICIONES"
                            speed={90}
                            maxIterations={40}
                            sequential={true}
                            revealDirection="start"
                            useOriginalCharsOnly={false}
                            animateOn="view"
                            encryptedClassName="text-encrypted"
                        />
                    </h1>
                    <p className="cf-terms-last-updated">Última actualización: 27 de Mayo de 2026</p>
                </div>

                <div className="cf-terms-content">

                    <section className="cf-terms-section">
                        <h2>1. Introducción</h2>
                        <p>
                            Bienvenido a CypherFox. Al acceder y utilizar esta plataforma educativa
                            (en adelante, el "Sitio"), usted acepta estar sujeto a los siguientes
                            Términos y Condiciones. Si no está de acuerdo con alguna parte de estos
                            términos, le rogamos que no utilice nuestro Sitio.
                        </p>
                        <p>
                            CypherFox es una plataforma diseñada exclusivamente con fines educativos
                            y académicos, orientada a la enseñanza interactiva de la criptografía.
                        </p>
                    </section>

                    <section className="cf-terms-section">
                        <h2>2. Uso de la Plataforma</h2>
                        <p>
                            El acceso a CypherFox está destinado a estudiantes, profesores y entusiastas
                            de la seguridad informática. Usted se compromete a utilizar el Sitio
                            únicamente para fines lícitos y de una manera que no infrinja los derechos
                            de, restrinja o inhiba el uso y disfrute del Sitio por parte de cualquier tercero.
                        </p>
                        <ul>
                            <li>No debe intentar obtener acceso no autorizado a ninguna parte del Sitio.</li>
                            <li>No debe utilizar el Sitio para distribuir material malicioso o dañino.</li>
                            <li>Los simuladores criptográficos proporcionados son para fines de aprendizaje; no deben utilizarse para cifrar información confidencial real.</li>
                        </ul>
                    </section>

                    <section className="cf-terms-section">
                        <h2>3. Propiedad Intelectual</h2>
                        <p>
                            Todo el contenido, diseño, textos, gráficos, interfaces, código fuente y
                            software de CypherFox están protegidos por derechos de propiedad intelectual.
                            El uso de los simuladores y algoritmos presentados (como AES, RSA, DES) se
                            basa en implementaciones de estándares públicos y abiertos, utilizados aquí
                            con fines pedagógicos.
                        </p>
                        <p>
                            Usted puede visualizar, copiar e imprimir partes del material de este
                            sitio únicamente para su propio uso personal e instructivo.
                        </p>
                    </section>

                    <section className="cf-terms-section">
                        <h2>4. Privacidad y Datos de Usuario</h2>
                        <p>
                            En CypherFox valoramos su privacidad. Actualmente, nuestra plataforma
                            educativa no recopila información personal identificable sensible más
                            allá de lo necesario para el funcionamiento básico del sitio y la
                            evaluación automática de los módulos de aprendizaje.
                        </p>
                        <p>
                            El progreso, las puntuaciones y las interacciones con los laboratorios
                            criptográficos pueden ser almacenados localmente en su dispositivo
                            o temporalmente en nuestros servidores para mejorar su experiencia de estudio.
                        </p>
                    </section>

                    <section className="cf-terms-section">
                        <h2>5. Limitación de Responsabilidad</h2>
                        <p>
                            CypherFox se proporciona "tal cual" y "según disponibilidad". No garantizamos
                            que el Sitio sea ininterrumpido o esté libre de errores. Las implementaciones
                            criptográficas mostradas están simplificadas para la educación y <strong>no deben
                            utilizarse en entornos de producción</strong> donde se requiera seguridad real.
                        </p>
                        <p>
                            Los desarrolladores de CypherFox no serán responsables de ninguna pérdida
                            o daño directo, indirecto o consecuente derivado del uso de esta plataforma.
                        </p>
                    </section>

                    <section className="cf-terms-section">
                        <h2>6. Modificaciones de los Términos</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos Términos y Condiciones en
                            cualquier momento. Cualquier cambio se publicará en esta página y entrará
                            en vigencia inmediatamente después de su publicación. Es su responsabilidad
                            revisar periódicamente esta página.
                        </p>
                    </section>

                    <section className="cf-terms-section">
                        <h2>7. Contacto</h2>
                        <p>
                            Si tiene alguna pregunta, inquietud o sugerencia técnica sobre estos Términos,
                            el funcionamiento de los cifrados o el proyecto en general, puede contactarnos a
                            través de los canales académicos correspondientes o enviando un mensaje al
                            equipo de desarrollo.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Terms;