// src/components/Navbar.jsx
import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';

import './Navbar.css';
import { items, buttons } from '../../util/index.js';
import logo from '../../assets/logo.svg';

const CardNav = ({
    logo = logo,
    logoAlt = 'CypherFox logo',
    items,
    buttons,
    className = '',
    ease = 'power3.out',
    baseColor = '#06040E',
    menuColor = '#138245',
    buttonBgColor = '#E78F41',
    buttonTextColor = '#06040E'
}) => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const navRef = useRef(null);
    const cardsRef = useRef([]);
    const tlRef = useRef(null);

    const calculateHeight = () => {
        const navEl = navRef.current;
        if (!navEl) return 260;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
            const contentEl = navEl.querySelector('.card-nav-content');
            if (contentEl) {
                const wasVisible = contentEl.style.visibility;
                const wasPointerEvents = contentEl.style.pointerEvents;
                const wasPosition = contentEl.style.position;
                const wasHeight = contentEl.style.height;

                contentEl.style.visibility = 'visible';
                contentEl.style.pointerEvents = 'auto';
                contentEl.style.position = 'static';
                contentEl.style.height = 'auto';

                // Forzar reflow
                contentEl.offsetHeight;

                const topBar = 60;
                const padding = 16;
                const contentHeight = contentEl.scrollHeight;

                contentEl.style.visibility = wasVisible;
                contentEl.style.pointerEvents = wasPointerEvents;
                contentEl.style.position = wasPosition;
                contentEl.style.height = wasHeight;

                return topBar + contentHeight + padding;
            }
        }

        return 260;
    };

    const createTimeline = () => {
        const navEl = navRef.current;
        if (!navEl) return null;

        gsap.set(navEl, { height: 60, overflow: 'hidden' });
        gsap.set(cardsRef.current, { y: 50, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        tl.to(navEl, {
            height: calculateHeight,
            duration: 0.4,
            ease
        });

        tl.to(
            cardsRef.current,
            { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
            '-=0.1'
        );

        return tl;
    };

    useLayoutEffect(() => {
        const tl = createTimeline();
        tlRef.current = tl;

        return () => {
            tl?.kill();
            tlRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ease, items]);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (!tlRef.current) return;

            if (isExpanded) {
                const newHeight = calculateHeight();
                gsap.set(navRef.current, { height: newHeight });

                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) {
                    newTl.progress(1);
                    tlRef.current = newTl;
                }
            } else {
                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) {
                    tlRef.current = newTl;
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded]);

    const toggleMenu = () => {
        const tl = tlRef.current;
        if (!tl) return;

        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            tl.play(0);
        } else {
            setIsHamburgerOpen(false);
            tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
            tl.reverse();
        }
    };

    const setCardRef = i => el => {
        if (el) cardsRef.current[i] = el;
    };

    return (
        <div className={`card-nav-container ${className}`}>
            <nav
                ref={navRef}
                className={`card-nav ${isExpanded ? 'open' : ''}`}
                style={{ backgroundColor: baseColor }}
            >
                <div className="card-nav-top">
                    {/* Hamburger */}
                    <div
                        className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                        role="button"
                        aria-label={isExpanded ? 'Cerrar menú' : 'Abrir menú'}
                        tabIndex={0}
                        style={{ color: menuColor }}
                    >
                        <div className="hamburger-line" />
                        <div className="hamburger-line" />
                    </div>

                    {/* Logo → ruta raíz */}
                    <div className="logo-container">
                        <Link to="/" className="logo-link">
                            <img src={logo} alt={logoAlt} className="logo-img" />
                            <span className="logo logo-text">CypherFox</span>
                        </Link>
                    </div>

                    {/* Botón Iniciar Sesión (top) */}
                    <Link
                        type="button"
                        className="card-nav-cta-button card-nav-cta-button--top"
                        style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                        to={buttons && buttons[0]?.href}
                    >
                        {buttons && buttons[0]?.label}
                    </Link>
                </div>

                <div className="card-nav-content" aria-hidden={!isExpanded}>
                    {/* Botón Iniciar Sesión (dentro del menú) */}
                    <div className="nav-card nav-card-login">
                        <Link
                            type="button"
                            className="card-nav-cta-button card-nav-cta-button--full"
                            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                            to={buttons && buttons[0]?.href}
                            onClick={() => {
                                // opcional: cerrar menú al navegar
                                if (isExpanded) toggleMenu();
                            }}
                        >
                            {buttons && buttons[0]?.label}
                        </Link>
                    </div>

                    {(items || []).slice(0, 3).map((item, idx) => (
                        <div
                            key={`${item.label}-${idx}`}
                            className="nav-card"
                            ref={setCardRef(idx)}
                            style={{
                                backgroundColor: item.bgColor,
                                color: item.textColor
                            }}
                        >
                            <div className="nav-card-label">{item.label}</div>
                            <div className="nav-card-links">
                                {item.links?.map((lnk, i) => (
                                    <Link
                                        key={`${lnk.label}-${i}`}
                                        className="nav-card-link"
                                        to={lnk.href}
                                        aria-label={lnk.ariaLabel || lnk.label}
                                        onClick={() => {
                                            if (isExpanded) toggleMenu();
                                        }}
                                    >
                                        <GoArrowUpRight
                                            className="nav-card-link-icon"
                                            aria-hidden="true"
                                        />
                                        {lnk.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export const Navbar = () => {
    return (
        <CardNav
            logo={logo}
            items={items}
            buttons={buttons}
        />
    );
};

export default Navbar;