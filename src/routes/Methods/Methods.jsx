// src/routes/Methods/Methods.jsx
import React, { useState } from 'react';
import './Methods.css';
import LightPillar from '../../components/LightPillar';
import { Methods_Full } from '../../components/Methods';

const Methods = () => {
  const [labsUsuario, setLabsUsuario] = useState({
    'One-Time Pad': true,
    Caesar: true,
    Vigenère: false,
    Hill: true,
  });

  // Obtenemos el array de cards JSX
  const metodoCards = Methods_Full({ labs_usuario: labsUsuario });

  return (
    <div className="cf-methods-page">
      <div className="cf-methods-bg">
        <LightPillar
          topColor="#075f2f"
          bottomColor="#03411f"
          intensity={1.5}
          rotationSpeed={1.5}
          glowAmount={0.005}
          pillarHeight={1}
          pillarRotation={200}
          className="cf-methods-bg-pillar"
          mixBlendMode="screen"
        />
      </div>

      <div className="cf-methods-content">
        <section className="cf-methods-header">
          <h1 className="cf-methods-header-title">Métodos de Encriptación</h1>
          <p className="cf-methods-header-description">
            Explora en detalle cada técnica criptográfica, desde los métodos
            clásicos hasta los algoritmos modernos más avanzados
          </p>
        </section>

        <section className="cf-methods-list container-lg">
          <div className="row g-4">
            {metodoCards.map((card) => (
              <div
                key={card.key}
                className="col-12 col-md-6 col-xl-4 d-flex"
              >
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

export default Methods;