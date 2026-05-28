// src/components/Hero.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Orb from '../components/bg/Orb.jsx';
import DecryptedText from '../components/text/DecryptedText.jsx';
import TextType from '../components/text/TextType.jsx';
import Welcome from '../assets/welcome.gif';
import './Home.css';
import { Methods_Short, More_Short } from '../components/cards/Methods.jsx';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const [featuredMethods, setFeaturedMethods] = useState([]);
    useEffect(() => {
        const allMethods = Methods_Short();
        const shuffled = [...allMethods].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3);
        setFeaturedMethods(selected);
    }, []);

    const heroRef = useRef(null);
    const metodosRef = useRef(null);

    // Claves para forzar re-montaje y reinicio de animaciones
    const [heroTitleKey, setHeroTitleKey] = useState(0);
    const [metodosTypingKey, setMetodosTypingKey] = useState(0);

    // ======================
    // HERO
    // ======================
    useEffect(() => {
        if (!heroRef.current) return;
        const ctx = gsap.context(() => {
            const section = heroRef.current;
            const orb = section.querySelector('.cf-hero-orb-layer');
            const logoEl = section.querySelector('.cf-hero-logo');
            const text = section.querySelector('.cf-hero-subtitle');
            const buttons = section.querySelectorAll('.cf-hero-actions .cf-hero-btn');

            // Estado inicial
            gsap.set(orb, { opacity: 0, scale: 1.1 });
            gsap.set(logoEl, { opacity: 0, y: 30 });
            gsap.set(text, { opacity: 0, y: 20 });
            gsap.set(buttons, { opacity: 0, y: 15 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 40%',
                    toggleActions: 'play none none reverse',
                    // Se ejecuta al entrar por primera vez
                    onEnter: () => {
                        setHeroTitleKey((k) => k + 1);
                    },
                    // Se ejecuta al volver a entrar desde abajo (scroll hacia arriba)
                    onEnterBack: () => {
                        setHeroTitleKey((k) => k + 1);
                    },
                },
            });

            tl.to(orb, {
                opacity: 1,
                scale: 1,
                duration: 0.9,
                ease: 'power2.out',
            })
                .to(
                    logoEl,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                    },
                    '-=0.5'
                )
                .to(
                    text,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '-=0.25'
                )
                .to(
                    buttons,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        stagger: 0.1,
                    },
                    '-=0.15'
                );
        }, heroRef);
        return () => ctx.revert();
    }, []);

    // ======================
    // MÉTODOS
    // ======================
    useEffect(() => {
        if (!metodosRef.current) return;
        const ctx = gsap.context(() => {
            const section = metodosRef.current;
            const header = section.querySelector('.cf-metodos-header');
            const cards = section.querySelectorAll('.cf-metodos-slide-wrapper');

            gsap.set([header, cards], {
                opacity: 0,
                y: 30,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'bottom 40%',
                    toggleActions: 'play none none reverse',
                    // Reinicia el typing del subtítulo de métodos
                    onEnter: () => {
                        setMetodosTypingKey((k) => k + 1);
                    },
                },
            });

            tl.to(header, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
            }).to(
                cards,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    stagger: 0.15,
                },
                '-=0.2'
            );
        }, metodosRef);
        return () => ctx.revert();
    }, []);

    return (
        <>
            {/* HERO */}
            <section className="cf-hero" ref={heroRef}>
                <div className="cf-hero-orb-layer">
                    <Orb hue={130} />
                </div>
                <div className="cf-hero-content">
                    <div className="cf-hero-logo">
                        <img src={Welcome} alt="CypherFox logo" className="cf-hero-logo-img" />
                        <h1 className="logo cf-hero-logo-text">
                            <DecryptedText
                                key={heroTitleKey}
                                text="CypherFox"
                                className="logo cf-hero-logo-text"
                                encryptedClassName="logo cf-hero-logo-text--encrypted"
                                speed={120}
                                maxIterations={60}
                                sequential={true}
                                revealDirection="start"
                                useOriginalCharsOnly={false}
                                animateOn="both"
                            />
                        </h1>
                    </div>
                    <p>
                        <TextType
                            text="Domina el arte de la criptografía aprende los fundamentos de la criptografía a través de simulaciones interactivas, visualizaciones claras y desafíos prácticos evaluados automáticamente."
                            as="span"
                            className="cf-hero-subtitle"
                            typingSpeed={35}
                            loop={false}
                            showCursor={true}
                            cursorCharacter="|"
                        />
                    </p>
                    <div className="cf-hero-actions">
                        <Link to="/metodos" className="cf-hero-btn cf-hero-btn-primary">
                            Explorar Métodos
                        </Link>
                    </div>
                </div>
            </section>

            {/* MÉTODOS */}
            <section className="cf-metodos" ref={metodosRef}>
                <div className="cf-metodos-header">
                    <h2 className="cf-metodos-title">Métodos Criptográficos</h2>
                    <TextType
                        key={metodosTypingKey}
                        text="Explora diversas técnicas y algoritmos criptográficos."
                        as="span"
                        className="cf-metodos-subtitle"
                        typingSpeed={40}
                        loop={false}
                        showCursor={true}
                        cursorCharacter="|"
                    />
                </div>
                <div className="cf-metodos-list">
                    {featuredMethods.map((card, index) => (
                        <div key={index} className="cf-metodos-slide-wrapper">
                            {card}
                        </div>
                    ))}
                    <div className="cf-metodos-slide-wrapper">
                        <More_Short />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;