// src/components/Footer.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import logo from '../../assets/logo.svg';
import { items } from '../../util/index.js';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {


    return (
        <footer className="cf-footer">
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