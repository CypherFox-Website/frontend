// src/components/Footer.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import logo from '../assets/logo.svg';
import { items } from '../util/index.js';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const footerRef = useRef(null);

    useEffect(() => {
        if (!footerRef.current) return;

        const ctx = gsap.context(() => {
            const section = footerRef.current;
            const brand = section.querySelector('.cf-footer-brand');
            const columns = section.querySelectorAll('.cf-footer-column');
            const bottom = section.querySelector('.cf-footer-bottom');

            // Estado inicial
            gsap.set(brand, { opacity: 0, y: 30 });
            gsap.set(columns, { opacity: 0, y: 30 });
            gsap.set(bottom, { opacity: 0, y: 20 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 90%',
                    end: 'bottom 70%',
                    toggleActions: 'play none none',
                },
            });

            tl.to(brand, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
            })
                .to(
                    columns,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                        stagger: 0.1,
                    },
                    '-=0.25'
                )
                .to(
                    bottom,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                    },
                    '-=0.2'
                );
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer className="cf-footer" ref={footerRef}>
            <div className="cf-footer-inner">
                {/* Marca y descripción */}
                <div className="cf-footer-brand">
                    <div className="cf-footer-logo">
                        <img src={logo} alt="CypherFox logo" className="cf-footer-logo-img" />
                        <span className="logo cf-footer-logo-text">CypherFox</span>
                    </div>
                    <p className="cf-footer-description">
                        Plataforma web interactiva para aprender criptografía básica, visualizar métodos
                        y evaluar laboratorios de forma automatizada.
                    </p>
                </div>

                {/* Navegación */}
                <div className="cf-footer-links">
                    {items.map((section) => (
                        <div key={section.label} className="cf-footer-column">
                            <h4 className="cf-footer-column-title">{section.label}</h4>
                            <ul className="cf-footer-column-list">
                                {section.links?.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="cf-footer-link"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Línea inferior */}
            <div className="cf-footer-bottom">
                <span className="cf-footer-copy">
                    © {new Date().getFullYear()} CypherFox. Todos los derechos reservados.
                </span>
                <span className="cf-footer-note">
                    Proyecto académico – Plataforma para enseñanza interactiva de criptografía.
                </span>
            </div>
        </footer>
    );
};

export default Footer;