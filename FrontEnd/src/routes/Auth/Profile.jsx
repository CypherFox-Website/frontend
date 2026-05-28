// src/routes/Auth/Profile.jsx
import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from "react-router-dom";
import { logout, supabase } from "../../util/auth";
import { api } from "../../util/api";

import DecryptedText from "../../components/text/DecryptedText";
import ScrambledText from "../../components/text/ScrambleText";

import Welcome from "../../assets/welcome.gif";
import Study from "../../assets/study.gif";

import './Profile.css';

function getStatus(nota) {
    if (nota >= 3) return 'Aprobado';
    else if (nota > 0) return 'Reprobado';
    else return 'Pendiente';
}

export default function Profile() {
    const navigate = useNavigate();

    const sectionRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function handleLogout() {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            console.error("Error cerrando sesión:", err.message);
        }
    }

    useEffect(() => {
        const checkAndFetch = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                try {
                    const userData = await api.getMe();
                    setProfile(userData);
                } catch (err) {
                    console.error("Error al obtener el perfil:", err.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkAndFetch();
    }, []);

    useEffect(() => {
        const id = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center', color: 'white' }}>Cargando perfil...</div>;
    }

    if (!profile) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'white' }}>
                No se pudo cargar la información del perfil.
            </div>
        );
    }

    return (
        <>
            <section className={`cf-profile ${ready ? 'is-ready' : ''}`} ref={sectionRef}>
                <div className="cf-profile-shell">
                    <aside className="cf-profile-panel">
                        <div className="cf-profile-avatar-wrap">
                            <div className="cf-profile-avatar" aria-hidden="true">
                                <img 
                                    src={Study} 
                                    alt="Avatar" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            </div>
                        </div>

                        <span className="cf-profile-badge">Perfil</span>
                        <h1 className="cf-profile-name">{profile.nombre}</h1>
                        <p className="cf-profile-email">{profile.correo}</p>
                        <p className="cf-profile-role">
                            Rol: <strong>{profile.rol}</strong>
                        </p>

                        <div className="cf-profile-mini-card">
                            <h2 className="cf-profile-mini-title">Estado académico</h2>
                            <p className="cf-profile-mini-text">
                                Este panel mostrará tu progreso general y las notas obtenidas hasta el momento.
                            </p>
                        </div>

                        <div className="profile-actions">
                            <button className="logout-btn" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </div>
                    </aside>

                    <main className="cf-profile-main">
                        <header className="cf-profile-hero">
                            <span className="cf-profile-kicker">Panel personal</span>
                            <h2 className="cf-profile-title">Tu progreso en criptografía interactiva</h2>
                        </header>

                        <section className="cf-profile-notes" aria-label="Resumen de notas">
                            <div className="cf-profile-notes-head">
                                <div>
                                    <h3 className="cf-profile-notes-title">Resumen por método</h3>
                                    <p className="cf-profile-notes-subtitle">Ten en cuenta que esta nota es provisional, puede tener cambios a la nota final debido a la fecha de entrega.</p>
                                </div>
                            </div>

                            <div className="cf-profile-notes-list">
                                {profile.notas.map((item, index) => (
                                    <article 
                                        className="cf-profile-note-row" 
                                        key={item.metodo}
                                        style={{ transitionDelay: `${0.18 + index * 0.08}s` }}
                                    >
                                        <p className="cf-profile-note-method">{item.metodo}</p>
                                        <p className="cf-profile-note-score">Nota: {item.nota.toFixed(1)}</p>
                                        <span
                                            className={`cf-profile-note-status ${getStatus(item.nota) === 'Aprobado' ? 'is-ok' : getStatus(item.nota) === 'Reprobado' ? 'is-error' : 'is-pending'
                                                }`}
                                        >
                                            {getStatus(item.nota)}
                                        </span>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <div className="cf-profile-actions">
                            <a className="cf-profile-button cf-profile-button-primary" href="/metodos">
                                Explorar métodos
                            </a>
                            <a className="cf-profile-button cf-profile-button-secondary" href="/">
                                Volver al inicio
                            </a>
                        </div>
                    </main>
                </div>
            </section>
        </>
    );
}