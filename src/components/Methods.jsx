// src/components/Methods.jsx

import { Link } from 'react-router-dom';
import { metodos } from '../util/metodos.js';
import './Methods.css';

import DecyptedText from '../components/DecryptedText.jsx';
import TextType from '../components/TextType.jsx';

export const Methods_Short = () => {
    return metodos.map((metodo) => (
        <Link
            key={metodo.nombre}
            to={metodo.href}
            className="cf-method-card"
        >
            <div className="cf-method-icon">
                <i className={metodo.icono} aria-hidden="true"></i>
            </div>

            <div className="cf-method-info">
                <h3 className="cf-method-name">{metodo.nombre}</h3>
                <p className="cf-method-description">{metodo.descripcion_corta}</p>
            </div>
        </Link>
    ));
};

export const Methods_Full = ({ labs_usuario = {} }) => {
    // labs_usuario tiene una estructura { nombre_metodo: boolean, ... }

    return metodos.map((metodo) => (
        <div
            key={metodo.nombre}
            className={`cf-method-card-full ${labs_usuario[metodo.nombre] ? 'cf-method-card-full--completed' : ''
                }`}
        >
            <div className="cf-method-card-full-icon">
                <i className={`fa-solid fa-circle ${labs_usuario[metodo.nombre] ? 'cf-method-card-full-lab-completed' : 'cf-method-card-full-lab-pending'}`}></i>
                <i className={metodo.icono} aria-hidden="true"></i>
            </div>

            <div className="cf-method-card-full-info">
                <h3 className="cf-method-card-full-name">
                    <DecyptedText
                        text={metodo.nombre}
                        className="cf-method-card-full-name"
                        encryptedClassName='cf-method-card-full-name-encrypted'
                        speed={120}
                        maxIterations={60}
                        sequential={true}
                        revealDirection="start"
                        useOriginalCharsOnly={false}
                        animateOn="both"
                    />
                </h3>
                <p className="cf-method-card-full-description">
                    <TextType
                        text={metodo.descripcion}
                        as="span"
                        className="cf-method-card-full-description"
                        typingSpeed={25}
                        loop={false}
                        showCursor={true}
                        cursorCharacter="|"
                    />
                </p>
            </div>

            <div className="cf-method-card-full-link-container">
                <Link to={metodo.href} className="cf-method-card-full-link cf-method-card-full-link-explanation">
                    <i className="fa-solid fa-graduation-cap"></i>
                    Ver explicación
                </Link>

                <Link to={`lab/${metodo.href.slice(9)}`} className="cf-method-card-full-link cf-method-card-full-link-lab">
                    <i className="fa-solid fa-bolt"></i>
                    Practicar
                </Link>
            </div>
        </div>
    ));
};

export const More_Short = () => {
    return (
        <Link to="/metodos" className="cf-method-card">
            <div className="cf-method-icon">
                <i className="fa-solid fa-plus" aria-hidden="true"></i>
            </div>

            <div className="cf-method-info">
                <h3 className="cf-method-name">Más...</h3>
                <p className="cf-method-description">
                    Muchos más cifrados...
                </p>
            </div>
        </Link>
    );
};