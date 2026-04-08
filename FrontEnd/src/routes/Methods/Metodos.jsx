// src/routes/Methods/Metodos.jsx
import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";

import Hyperspeed from "../../components/bg/Hyperspeed";

import OneTimePad from "../Methods/Lecciones/OneTimePad";
import Playfair from "../Methods/Lecciones/Playfair";
import Caesar from "../Methods/Lecciones/Caesar";
import Vigenere from "../Methods/Lecciones/Vigenere";
import Hill from "../Methods/Lecciones/Hill";
import Homophonic from "../Methods/Lecciones/Homophonic";

import DecryptedText from "../../components/text/DecryptedText";
import TextType from "../../components/text/TextType";

import Happy from "../../assets/happy.gif";
import Sad from "../../assets/sad.gif";

import { methodMissionsConfig } from "../../util/missions";

import "./Metodos.css";

const lessonsMap = {
    "one-time-pad": OneTimePad,
    caesar: Caesar,
    vigenere: Vigenere,
    playfair: Playfair,
    hill: Hill,
    homophonic: Homophonic
};

const HYPERSPEED_OPTIONS = {
    distortion: "turbulentDistortion",
    length: 260,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 70,
    fovSpeedUp: 110,
    speedUp: 0.8,
    carLightsFade: 0.4,
    totalSideLightSticks: 10,
    lightPairsPerRoadWay: 22,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.08,
    brokenLinesLengthPercentage: 0.45,
    lightStickWidth: [0.08, 0.35],
    lightStickHeight: [1.0, 1.4],
    movingAwaySpeed: [30, 45],
    movingCloserSpeed: [-55, -80],
    carLightsLength: [10, 45],
    carLightsRadius: [0.04, 0.10],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.6, 0.6],
    carFloorSeparation: [0, 3],
    colors: {
        roadColor: 0x06040e,
        islandColor: 0x080910,
        background: 0x000000,
        shoulderLines: 0xe78f41,
        brokenLines: 0xe78f41,
        leftCars: [0xe78f41, 0x138245, 0xf9f4f4],
        rightCars: [0x138245, 0xf9f4f4, 0xe78f41],
        sticks: 0x138245
    }
};

export default function Metodos() {
    const { metodo } = useParams();
    const LessonComponent = lessonsMap[metodo];

    const missionsConfig = methodMissionsConfig[metodo];

    // Estado compartido para las misiones (vale para cualquier método)
    const [activeMission, setActiveMission] = useState(
        missionsConfig?.missions[0]?.id ?? 1
    );
    const [missionTitleKey, setMissionTitleKey] = useState(0);
    const [answer, setAnswer] = useState("");
    const [modalAnswer, setModalAnswer] = useState(false);

    if (!LessonComponent) {
        return <Navigate to="/404" replace />;
    }

    const missions = missionsConfig?.missions ?? [];
    const currentMission =
        missions.find((m) => m.id === activeMission) || missions[0];

    const isCorrect = () => {
        if (!currentMission) return false;
        const user = answer.trim().toUpperCase();
        const expected = String(currentMission.answer).trim().toUpperCase();
        return user === expected;
    };

    return (
        <div className="cf-lesson-page">
            {/* FONDO HYPERSPEED + VELO OSCURO */}
            <div className="cf-lesson-bg">
                <Hyperspeed effectOptions={HYPERSPEED_OPTIONS} />
                <div className="cf-lesson-bg-overlay" />
            </div>

            {/* CONTENIDO DE LA LECCIÓN + MISIONES */}
            <div className="cf-lesson-content">
                <LessonComponent />

                {/* BLOQUE DE MISIONES COMÚN */}
                {missionsConfig && missions.length > 0 && (
                    <section className="missions-band">
                        <div className="missions-header">
                            <h2>
                                <DecryptedText
                                    text={missionsConfig.title}
                                    className="h2"
                                    encryptedClassName="h2 text-encrypted"
                                    speed={100}
                                    maxIterations={60}
                                />
                            </h2>
                            <div>
                                <TextType
                                    text={missionsConfig.description}
                                    as="p"
                                    typingSpeed={25}
                                    deletingSpeed={65}
                                    pauseDuration={1800}
                                    textColors={["var(--cf-text)"]}
                                />
                            </div>
                        </div>

                        <div className="missions-grid">
                            {missions.map((mission) => (
                                <button
                                    key={mission.id}
                                    type="button"
                                    className={
                                        "mission-pill" +
                                        (mission.id === activeMission
                                            ? " mission-pill-active"
                                            : "")
                                    }
                                    onClick={() => {
                                        setActiveMission(mission.id);
                                        setMissionTitleKey((prev) => prev + 1);
                                        setAnswer("");
                                    }}
                                >
                                    {mission.title}
                                </button>
                            ))}
                        </div>

                        <div className="mission-card">
                            <h3>
                                <DecryptedText
                                    key={missionTitleKey}
                                    text={currentMission?.title || ""}
                                    className="h3"
                                    encryptedClassName="h3 text-encrypted"
                                    speed={100}
                                    maxIterations={60}
                                />
                            </h3>
                            <div>
                                <TextType
                                    key={missionTitleKey + "-desc"}
                                    text={currentMission?.description || ""}
                                    as="p"
                                    typingSpeed={15}
                                    deletingSpeed={65}
                                    pauseDuration={1800}
                                    textColors={["var(--cf-text)"]}
                                />
                            </div>

                            <input
                                type="text"
                                className="form-answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Escribe tu respuesta aquí…"
                            />

                            <button
                                type="button"
                                className="close-button"
                                onClick={() => {
                                    if (answer.trim() !== "") {
                                        setModalAnswer(true);
                                    }
                                }}
                            >
                                Comprobar
                            </button>
                        </div>
                    </section>
                )}

                {/* MODAL RESULTADO DE MISIÓN (COMÚN) */}
                {missionsConfig && modalAnswer && currentMission && (
                    <div
                        className="modal-backdrop"
                        onClick={() => setModalAnswer(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>
                                <DecryptedText
                                    text="Resultado de la misión"
                                    className="h3"
                                    encryptedClassName="h3 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h3>

                            {isCorrect() ? (
                                <div className="mission-feedback mission-correct">
                                    <img
                                        src={Happy}
                                        alt="CypherFox celebrando el acierto"
                                        className="mission-mascot"
                                    />
                                    <div>
                                        <TextType
                                            text={
                                                currentMission.successMessage ||
                                                "¡Correcto! Has encontrado la respuesta esperada."
                                            }
                                            as="p"
                                            typingSpeed={15}
                                            deletingSpeed={65}
                                            pauseDuration={1800}
                                            textColors={["var(--cf-text)"]}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="mission-feedback mission-incorrect">
                                    <img
                                        src={Sad}
                                        alt="CypherFox pensativo mostrando un error"
                                        className="mission-mascot"
                                    />
                                    <div>
                                        <TextType
                                            text={currentMission.hint}
                                            as="p"
                                            typingSpeed={15}
                                            deletingSpeed={65}
                                            pauseDuration={1800}
                                            textColors={["var(--cf-text)"]}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                className="close-button"
                                onClick={() => setModalAnswer(false)}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )}

                {/* LINK AL LAB */}
                <Link to={`/lab/${metodo}`} className="cf-lesson-link-lab">
                    <i className="fa-solid fa-bolt" aria-hidden="true"></i>
                    <span>Es momento de practicar con código</span>
                </Link>
            </div>
        </div>
    );
}