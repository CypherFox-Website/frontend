import { Fingerprint, Activity, Lock } from 'lucide-react';
import './ReflectiveCard.css';

const ReflectiveCard = ({
  // Visual / efecto
  blurStrength = 12,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(255, 255, 255, 0.1)',
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  className = '',
  style = {},

  // Fondo
  backgroundImage,
  backgroundAlt = 'Card background',

  // Contenido
  secureLabel = 'SECURE ACCESS',
  showSecureIcon = true,
  showStatusIcon = true,

  userName = 'ALEXANDER DOE',
  userRole = 'SENIOR DEVELOPER',

  idLabel = 'ID NUMBER',
  idValue = '8901-2345-6789',

  showFingerprint = true,
}) => {
  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation,
  };

  return (
    <div
      className={`reflective-card-container ${className}`}
      style={{ ...style, ...cssVariables }}
    >
      {/* Filtros SVG para el efecto metálico / vidrio */}
      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="turbulence"
              baseFrequency={baseFrequency}
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      {/* Fondo: imagen en lugar de cámara */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt={backgroundAlt}
          className="reflective-background-image"
        />
      )}

      {/* Capas de ruido / brillo / borde */}
      <div className="reflective-noise" />
      <div className="reflective-sheen" />
      <div className="reflective-border" />

      {/* Contenido de la card */}
      <div className="reflective-content">
        <div className="card-header">
          <div className="security-badge">
            {showSecureIcon && <Lock size={14} className="security-icon" />}
            <span>{secureLabel}</span>
          </div>
          {showStatusIcon && <Activity className="status-icon" size={20} />}
        </div>

        <div className="card-body">
          <div className="user-info">
            <h2 className="user-name">{userName}</h2>
            <p className="user-role">{userRole}</p>
          </div>
        </div>

        <div className="card-footer">
          <div className="id-section">
            <span className="label">{idLabel}</span>
            <span className="value">{idValue}</span>
          </div>
          {showFingerprint && (
            <div className="fingerprint-section">
              <Fingerprint size={32} className="fingerprint-icon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;