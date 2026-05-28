import React, { useState } from 'react';
import './Admin.css';

import { api } from "../../util/api";

import Happy from "../../assets/happy.gif";
import Waiting from "../../assets/waiting.gif";
import Help from "../../assets/help.gif";
import Sad from "../../assets/sad.gif";

const evaluableAlgorithms = [
    { label: "One-Time Pad", slug: "one-time-pad" },
    { label: "Playfair", slug: "playfair" },
    { label: "Caesar", slug: "caesar" },
    { label: "Vigenère", slug: "vigenere" },
    { label: "Hill", slug: "hill" },
    { label: "Homophonic", slug: "homophonic" },
    { label: "Turning Grille", slug: "turning-grille" },
    { label: "DES", slug: "des" },
    { label: "AES", slug: "aes" },
];

const Admin = () => {
    const [studentEmails, setStudentEmails] = useState("");
    const [deadlines, setDeadlines] = useState({});
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [waitingOpen, setWaitingOpen] = useState(false);
    const [resultOpen, setResultOpen] = useState(false);
    const [resultData, setResultData] = useState(null);

    const handleSaveDeadlines = (e) => {
        e.preventDefault();
        setConfirmOpen(true);
    };

    const handleConfirmSave = async () => { // Marcado como async
        setConfirmOpen(false);
        setWaitingOpen(true);

        const emailList = studentEmails.split('\n')
            .map(e => e.trim())
            .filter(e => e !== "");
        
        // Aseguramos que se envíe una fecha para CADA algoritmo, usando 'today' por defecto
        const formattedDeadlines = evaluableAlgorithms.map((algo) => {
            const selectedDate = deadlines[algo.slug] || today;
            const localLimit = new Date(`${selectedDate}T23:59:59-05:00`);
            return {
                algoritmo: algo.slug,
                due_date: localLimit.toISOString() 
            };
        });

        try {
            const blob = await api.getGradesReport(emailList, formattedDeadlines);

            // Crear link de descarga
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Reporte_Notas_CypherFox.xlsx"; // Nombre del archivo
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Limpiar el URL del objeto

            setWaitingOpen(false);
            setResultData({
                success: true,
                message: "El reporte de notas ha sido generado y descargado correctamente."
            });
            setResultOpen(true);
        } catch (error) {
            setWaitingOpen(false);
            setResultData({ success: false, message: "Error al generar el reporte: " + error.message });
            setResultOpen(true);
        }
    };

    const handleCloseResult = () => {
        setResultOpen(false);
        setResultData(null);
    };

    return (
        <section className="cf-teacher-panel-wrapper"> {/* Nuevo contenedor para el posicionamiento relativo */}
            {/* El contenido real del panel, que tendrá la animación */}
            <div className="cf-teacher-panel"> 
            <header className="cf-profile-hero">
                <span className="cf-profile-kicker">Administración</span>
                <h2 className="cf-profile-title">Gestión de Entregas</h2>
            </header>

            <form className="cf-teacher-form" onSubmit={handleSaveDeadlines}>
                <div className="cf-form-group">
                    <label htmlFor="emails" className="cf-form-label">Correos de Estudiantes (uno por línea):</label>
                    <textarea
                        id="emails"
                        className="cf-teacher-textarea"
                        placeholder="ejemplo@unal.edu.co&#10;otro@unal.edu.co"
                        value={studentEmails}
                        onChange={(e) => setStudentEmails(e.target.value)}
                        required
                    />
                </div>

                <div className="cf-deadlines-grid-wrap">
                    <h3 className="cf-deadlines-title">Fechas de Cierre (GMT-5)</h3>
                    <div className="cf-deadlines-list">
                        {evaluableAlgorithms.map((algo) => (
                            <div key={algo.slug} className="cf-deadline-row">
                                <span>{algo.label}</span>
                                <input
                                    type="date"
                                    className="cf-deadline-input"
                                    value={deadlines[algo.slug] || today}
                                    onChange={(e) => setDeadlines({
                                        ...deadlines,
                                        [algo.slug]: e.target.value
                                    })}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="cf-btn cf-btn-primary">
                    Guardar Configuración
                </button>
            </form>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {confirmOpen && (
                <div className="cf-modal-backdrop">
                    <div className="cf-modal">
                        <div className="cf-modal-illustration">
                            <img src={Help} alt="Confirmación" />
                        </div>
                        <h2 className="cf-modal-title">¿Guardar cambios?</h2>
                        <p className="cf-modal-text">
                            Se actualizarán las fechas de cierre y la lista de estudiantes autorizados para los laboratorios.
                        </p>
                        <div className="cf-modal-actions">
                            <button
                                type="button"
                                className="cf-btn cf-btn-secondary"
                                onClick={() => setConfirmOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="cf-btn cf-btn-primary"
                                onClick={handleConfirmSave}
                            >
                                Sí, guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE ESPERA */}
            {waitingOpen && (
                <div className="cf-modal-backdrop">
                    <div className="cf-modal">
                        <div className="cf-modal-illustration">
                            <img src={Waiting} alt="Procesando" />
                        </div>
                        <h2 className="cf-modal-title">Actualizando...</h2>
                        <p className="cf-modal-text">
                            Estamos registrando la nueva configuración de la clase.
                        </p>
                        <div className="cf-modal-spinner" />
                    </div>
                </div>
            )}

            {/* MODAL DE RESULTADO */}
            {resultOpen && resultData && (
                <div className="cf-modal-backdrop">
                    <div className="cf-modal">
                        <div className="cf-modal-illustration">
                            <img src={resultData.success ? Happy : Sad} alt={resultData.success ? "Éxito" : "Error"} />
                        </div>
                        <h2 className="cf-modal-title">
                            {resultData.success ? "¡Configuración aplicada!" : "Error al guardar"}
                        </h2>
                        <p className="cf-modal-text">{resultData.message}</p>
                        <div className="cf-modal-actions">
                            <button
                                type="button"
                                className="cf-btn cf-btn-primary"
                                onClick={handleCloseResult}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Admin;