// src/pages/AuthCallback.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Orb from '../../components/bg/Orb.jsx';
import DecryptedText from '../../components/text/DecryptedText.jsx';
import { supabase, logout } from '../../util/auth';
import './AuthCallback.css';

const ALLOWED_DOMAIN = '@unal.edu.co';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Validando autenticación...');
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const finalizeAuth = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const errorParam = params.get('error');
                const errorDescription = params.get('error_description');

                if (errorParam) {
                    setStatus('error');
                    setMessage(errorDescription || 'No se pudo completar el inicio de sesión.');
                    return;
                }

                const { data, error } = await supabase.auth.getSession();
                if (error) throw new Error(error.message);

                const session = data.session;
                if (!session?.user) throw new Error('No se pudo recuperar la sesión del usuario.');

                const email = session.user.email ?? '';
                if (!email.endsWith(ALLOWED_DOMAIN)) {
                    await logout();
                    throw new Error('Solo se permiten correos institucionales @unal.edu.co.');
                }

                setStatus('success');
                setMessage('Autenticación completada correctamente. Redirigiendo...');
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Ocurrió un error inesperado durante la autenticación.');
            }
        };

        finalizeAuth();
    }, [location.search, navigate]);

    useEffect(() => {
        if (status !== 'success') return;

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    navigate('/perfil', { replace: true });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [status, navigate]);

    return (
        <section className="cf-authcb-page">
            <div className="cf-authcb-orb-layer">
                <Orb hue={130} />
            </div>

            <div className="cf-authcb-card">
                <div
                    className={`cf-authcb-badge ${status === 'loading'
                            ? 'cf-authcb-badge--loading'
                            : status === 'success'
                                ? 'cf-authcb-badge--success'
                                : 'cf-authcb-badge--error'
                        }`}
                >
                    {status === 'loading' && 'Procesando'}
                    {status === 'success' && 'Autenticado'}
                    {status === 'error' && 'Error'}
                </div>

                <h1 className="cf-authcb-title">
                    <DecryptedText
                        text={
                            status === 'loading'
                                ? 'VALIDANDO ACCESO'
                                : status === 'success'
                                    ? 'ACCESO CONCEDIDO'
                                    : 'ACCESO FALLIDO'
                        }
                        className="cf-authcb-title-text"
                        encryptedClassName="cf-authcb-title-text--encrypted"
                        speed={80}
                        maxIterations={40}
                        sequential={true}
                        revealDirection="start"
                        useOriginalCharsOnly={false}
                        animateOn="view"
                    />
                </h1>

                <p className="cf-authcb-message">{message}</p>

                {status === 'loading' && (
                    <div className="cf-authcb-loader-wrap">
                        <div className="cf-authcb-loader" />
                        <span className="cf-authcb-loader-text">
                            Espera un momento mientras verificamos tu sesión...
                        </span>
                    </div>
                )}

                {status === 'success' && (
                    <div className="cf-authcb-actions">
                        <p className="cf-authcb-redirect">
                            Serás redirigido en <strong>{countdown}</strong> segundos.
                        </p>
                        <Link to="/perfil" className="cf-authcb-btn cf-authcb-btn-primary">
                            Ir ahora
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="cf-authcb-actions">
                        <Link to="/login" className="cf-authcb-btn cf-authcb-btn-primary">
                            Volver a iniciar sesión
                        </Link>
                        <Link to="/" className="cf-authcb-btn cf-authcb-btn-secondary">
                            Ir al inicio
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AuthCallback;