// src/routes/Methods/Metodos.jsx
import { useParams, Navigate, Link } from "react-router-dom";

import Hyperspeed from "../../components/bg/Hyperspeed";

import Caesar from "../Methods/Lecciones/Caesar";

import "./Metodos.css";

const lessonsMap = {
    "caesar": Caesar
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
        sticks: 0x138245,
    },
};

export default function Metodos() {
    const { metodo } = useParams();
    const LessonComponent = lessonsMap[metodo];

    if (!LessonComponent) {
        return <Navigate to="/404" replace />;
    }
    
    return (
        <div className="cf-lesson-page">
            {/* FONDO HYPERSPEED + VELO OSCURO */}
            <div className="cf-lesson-bg">
                <Hyperspeed effectOptions={HYPERSPEED_OPTIONS} />
                <div className="cf-lesson-bg-overlay" />
            </div>
            {/* CONTENIDO DE LA LECCIÓN */}
            <div className="cf-lesson-content">
                <LessonComponent />

                <Link to={`/lab/${metodo}`} className="cf-lesson-link-lab">
                    <i className="fa-solid fa-bolt" aria-hidden="true"></i>
                    <span>Es momento de practicar con código</span>
                </Link>
            </div>
        </div>
    );
}