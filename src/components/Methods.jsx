// src/components/Methods_Short.jsx
import { metodos } from '../util/metodos.js';
import './Methods.css';

export const Methods_Short = () => {
    return metodos.map((metodo) => (
        <a
            key={metodo.nombre}
            href={metodo.href}
            className="cf-method-card"
        >
            <div className="cf-method-icon">
                <i className={metodo.icono} aria-hidden="true"></i>
            </div>

            <div className="cf-method-info">
                <h3 className="cf-method-name">{metodo.nombre}</h3>
                <p className="cf-method-description">{metodo.descripcion_corta}</p>
            </div>
        </a>
    ));
};

export const More_Short = () => {
    return (
        <a href="/metodos" className="cf-method-card">
            <div className="cf-method-icon">
                <i className="fa-solid fa-plus" aria-hidden="true"></i>
            </div>

            <div className="cf-method-info">
                <h3 className="cf-method-name">Más...</h3>
                <p className="cf-method-description">
                    Muchos más cifrados...
                </p>
            </div>
        </a>
    );
}

