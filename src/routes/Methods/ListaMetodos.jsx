// src/routes/Methods/Methods.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ListaMetodos.css';

import { Methods_Full } from '../../components/cards/Methods';

import Study from '../../assets/study.gif'

import FloatingLines from '../../components/bg/FloatingLines';
import DecryptedText from '../../components/text/DecryptedText';
import TextType from '../../components/text/TextType';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ListaMetodos = () => {
  const [labsUsuario, setLabsUsuario] = useState({ 'One-Time Pad': true, 'Caesar': true, 'Vigenère': false, 'Hill': true }); // Para pruebas

  const metodoCards = Methods_Full({ labs_usuario: labsUsuario });

  const headerRef = useRef(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      const title = headerRef.current.querySelector('.cf-methods-header-title');
      const description = headerRef.current.querySelector('.cf-methods-header-description');

      gsap.set([title, description], { opacity: 0, y: 40 });

      gsap
        .timeline()
        .to(title, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
        })
        .to(
          description,
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
          },
          '-=0.4'
        );
    }

    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.querySelectorAll('.cf-method-card-full');

      gsap.set(cards, { opacity: 0, y: 50 });

      gsap.to(cards, {
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: 'top 80%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.18,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.globalTimeline.clear();
    };
  }, []);

  return (
    <div className="cf-methods-page">
      <div className="cf-methods-bg">
        <FloatingLines
          linesGradient={['#138245', '#06040E', '#E78F41']}
          enabledWaves={['middle', 'top', 'bottom']}
          lineCount={8}
          lineDistance={100}
          bendRadius={1}
          bendStrength={0}
          mixBlendMode="normal"
          interactive={false}
          backgroundHex="#050211"
          backgroundMix={0.8}
        />
      </div>

      {/* Mascota flotante tipo pop-up que acompaña al usuario */}
      <div className="cf-methods-mascot-floating">
        <img
          src={Study}
          alt="CypherFox estudiando criptografía"
          className="cf-methods-mascot-floating-img"
        />
      </div>

      <div className="cf-methods-content">
        <section className="cf-methods-header" ref={headerRef}>
          <h1 className="cf-methods-header-title">
            <DecryptedText
              text="Métodos de Encriptación"
              className="cf-methods-header-title"
              encryptedClassName="cf-methods-header-title--encrypted"
              speed={120}
              maxIterations={60}
              sequential={true}
              revealDirection="start"
              useOriginalCharsOnly={false}
              animateOn="both"
            />
          </h1>
          <p className="cf-methods-header-description">
            <TextType
              text="Explora en detalle cada técnica criptográfica, desde los métodos clásicos hasta los algoritmos modernos más avanzados."
              as="span"
              className="cf-methods-header-description"
              typingSpeed={35}
              loop={false}
              showCursor={true}
              cursorCharacter="|"
            />
          </p>
        </section>

        <section className="cf-methods-list container-lg">
          <div className="row g-4" ref={cardsContainerRef}>
            {metodoCards.map((card) => (
              <div key={card.key} className="col-12 col-md-6 col-xl-4 d-flex">
                <div className="flex-grow-1">
                  {card}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ListaMetodos;