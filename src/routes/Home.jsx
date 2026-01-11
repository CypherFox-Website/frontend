// src/components/HomeHero.jsx
import React from 'react';
import Orb from '../components/Orb.jsx';
import logo from '../assets/logo.svg';
import './Home.css';

import { Methods_Short, More_Short } from '../components/Methods.jsx';

const fakeRanking = [
    { usuario: 'MaestroEncriptación', puntos: '8,247' },
    { usuario: 'CódigoSeguro', puntos: '7,156' },
    { usuario: 'CazadorHash', puntos: '6,923' },
    { usuario: 'SabioCifrado', puntos: '5,687' },
    { usuario: 'RompeClaves', puntos: '5,445' },
    { usuario: 'AlgoritmoAs', puntos: '4,892' },
    { usuario: 'CryptoNinja', puntos: '4,234' },
    { usuario: 'DescifraMax', puntos: '3,876' },
    { usuario: 'HashMaster', puntos: '3,567' },
    { usuario: 'CifradoPro', puntos: '3,234' }
];

const Home = () => {
    return (<>
        <section className="cf-hero">
            {/* Fondo Orb */}
            <div className="cf-hero-orb-layer">
                <Orb hue={130} /> {/* verde CypherFox */}
            </div>

            {/* Contenido encima del orb */}
            <div className="cf-hero-content">

                <div className="cf-hero-logo">
                    <img src={logo} alt="CypherFox logo" className="cf-hero-logo-img" />
                    <h1 className="logo cf-hero-logo-text">CypherFox</h1>
                </div>

                <p className="cf-hero-subtitle">
                    Domina el arte de la criptografía aprende los fundamentos de la criptografía
                    a través de simulaciones interactivas, visualizaciones claras y desafíos
                    prácticos evaluados automáticamente.
                </p>

                <div className="cf-hero-actions">
                    <a href="/metodos" className="cf-hero-btn cf-hero-btn-primary">
                        Explorar Métodos
                    </a>
                    <a href="/ranking" className="cf-hero-btn cf-hero-btn-secondary">
                        Ver Ranking
                    </a>
                </div>
            </div>
        </section>

        <section className="cf-metodos">
            <div className="cf-metodos-header">
                <h2 className="cf-metodos-title">Métodos Criptográficos</h2>
                <p className="cf-metodos-subtitle">
                    Explora diversas técnicas y algoritmos criptográficos
                </p>
            </div>

            <div className="cf-metodos-list">
                {Methods_Short()
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map((card, index) => (
                        <div key={index} className="cf-metodos-slide-wrapper">
                            {card}
                        </div>
                    ))}
                <div className="cf-metodos-slide-wrapper">
                    <More_Short />
                </div>

            </div>
        </section>

        <section className="cf-ranking">
            <div className="cf-ranking-header">
                <h2 className="cf-ranking-title">TABLA DE POSICIONES</h2>
                <p className="cf-ranking-subtitle">
                    Los mejores estudiantes en nuestros desafíos de criptografía
                </p>
                <h3 className="cf-ranking-period">TOP USUARIOS DEL SEMESTRE</h3>
            </div>
            <div className="cf-ranking-table-wrapper">
                <table className="cf-ranking-table">
                    <thead>
                        <tr>
                            <th>POSICIÓN</th>
                            <th>USUARIO</th>
                            <th>PUNTOS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fakeRanking.map((row, idx) => (
                            <tr key={row.usuario} className={idx % 2 === 0 ? 'cf-ranking-row--top' : 'cf-ranking-row--bot'}>
                                <td className="cf-ranking-pos">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx === 3 ? '🏅' : idx === 4 ? '🎖️' : ''} #{idx + 1}</td>
                                <td className="cf-ranking-user">{row.usuario}</td>
                                <td className="cf-ranking-points">{row.puntos}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <a href="/ranking" className="cf-ranking-link">
                    Ver Tabla Completa →
                </a>
            </div>
        </section>

    </>
    );
};

export default Home;