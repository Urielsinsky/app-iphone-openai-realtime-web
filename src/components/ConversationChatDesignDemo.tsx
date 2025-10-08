import React, { useState } from 'react';
import { Scenario } from './ScenarioSelector';

interface ConversationChatDesignDemoProps {
  scenario: Scenario;
  onBack: () => void;
}

export const ConversationChatDesignDemo: React.FC<ConversationChatDesignDemoProps> = ({ scenario, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const phrases = scenario.phrases[selectedLevel];

  const colorScheme = scenario.language === 'spanish'
    ? { primary: '#8A9900', light: '#f9fdf0', shadow: 'rgba(138, 153, 0, 0.15)' }
    : { primary: '#008CB8', light: '#f0f9ff', shadow: 'rgba(0, 140, 184, 0.15)' };

  return (
    <div style={{
      height: '90vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header minimalista con branding */}
      <div style={{
        height: '70px',
        background: '#ffffff',
        borderBottom: '02px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        zIndex: 100
      }}>
        {/* Logo y Back */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={onBack}
            style={{
              background: '#ffffff',
              border: '2px solid #1a1a1a',
              borderRadius: '10px',
              padding: '8px 16px',
              color: '#1a1a1a',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#1a1a1a';
            }}
          >
            ← Back
          </button>

          <div style={{
            width: '2px',
            height: '25px',
            background: '#e5e7eb'
          }} />

          <h1 style={{
            fontSize: '1.3rem',
            fontWeight: 900,
            color: '#1a1a1a',
            margin: 0
          }}>
            ChidoLingo
          </h1>
        </div>

        {/* Badges de sesión */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            background: colorScheme.primary,
            padding: '6px 12px',
            borderRadius: '100px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.3px'
          }}>
            {scenario.language === 'spanish' ? '🇪🇸 ESPAÑOL' : '🇬🇧 ENGLISH'}
          </div>
          <div style={{
            background: '#f3f4f6',
            padding: '6px 12px',
            borderRadius: '100px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#6b7280'
          }}>
            {scenario.difficulty === 'easy' ? 'A1-A2' : 'B1-B2'}
          </div>
          <div style={{
            background: '#CA035E',
            padding: '6px 12px',
            borderRadius: '100px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 8px #00ff88'
            }} />
            LIVE
          </div>
        </div>
      </div>

      {/* Contenido principal - Split horizontal */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 440px',
        height: 'calc(100vh - 70px)',
        overflow: 'hidden',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        gap: '32px',
        padding: '0 32px'
      }}>
        {/* Panel izquierdo - Conversación */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '32px',
          background: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '2px solid #000000'
        }}>
          {/* Decoración de marca con colores de empresa */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            display: 'flex',
            gap: '6px'
          }}>
            <div style={{
              width: '40px',
              height: '3px',
              background: '#CA035E',
              borderRadius: '2px'
            }} />
            <div style={{
              width: '25px',
              height: '3px',
              background: '#8A9900',
              borderRadius: '2px'
            }} />
            <div style={{
              width: '30px',
              height: '3px',
              background: '#008CB8',
              borderRadius: '2px'
            }} />
          </div>

          {/* Título del escenario */}
          <div style={{
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: '#1a1a1a',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
              lineHeight: '1.1'
            }}>
              {scenario.title}
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.5',
              fontWeight: 500,
              maxWidth: '600px'
            }}>
              {scenario.description}
            </p>
          </div>

          {/* Mensaje de Chip - Grande y centrado */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.primary}02)`,
            border: `3px solid ${colorScheme.primary}`,
            borderRadius: '24px',
            padding: '30px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 0
          }}>
            {/* Efecto de onda de fondo */}
            <div style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              border: `2px solid ${colorScheme.primary}15`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'orbWave 3s ease-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              border: `2px solid ${colorScheme.primary}20`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'orbWave 3s ease-out infinite',
              animationDelay: '0.5s'
            }} />

            <div style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 10
            }}>
              {/* Imagen de Chip */}
              <div style={{
                width: '90px',
                height: '90px',
                background: 'linear-gradient(135deg, #CA035E, #008CB8)',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(202, 3, 94, 0.4)',
                border: '3px solid #ffffff',
                padding: '6px'
              }}>
                <img
                  src="/chip.png"
                  alt="Chip"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>

              <p style={{
                fontSize: '1.6rem',
                lineHeight: '1.3',
                fontWeight: 800,
                color: '#1a1a1a',
                marginBottom: '0',
                letterSpacing: '-0.5px'
              }}>
                "¡Hola! Soy Chip.<br />¿Listo para practicar?"
              </p>
            </div>
          </div>

          {/* Controles inferiores */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '24px',
            justifyContent: 'center'
          }}>
            <button style={{
              background: 'linear-gradient(135deg, #CA035E, #008CB8)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 32px',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(202, 3, 94, 0.3)',
              transition: 'all 0.2s ease',
              letterSpacing: '0px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(202, 3, 94, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(202, 3, 94, 0.4)';
            }}>
              🎤 Empezar a Practicar
            </button>
          </div>
        </div>

        {/* Panel derecho - Frases y stats */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '2px solid #000000',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Stats superiores */}
          <div style={{
            padding: '15px',
            background: '#ffffff',
            borderBottom: '2px solid #f3f4f6',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px'
          }}>
            <div style={{
              background: colorScheme.light,
              border: `2px solid ${colorScheme.primary}`,
              borderRadius: '12px',
              padding: '10px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: colorScheme.primary,
                marginBottom: '2px'
              }}>
                {scenario.duration}
              </div>
              <div style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Duración
              </div>
            </div>

            <div style={{
              background: '#fef3f2',
              border: '2px solid #CA035E',
              borderRadius: '12px',
              padding: '10px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: '#CA035E',
                marginBottom: '2px'
              }}>
                0:00
              </div>
              <div style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Tiempo
              </div>
            </div>
          </div>

          {/* Sección de frases */}
          <div style={{
            flex: 1,
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: '#1a1a1a',
              marginBottom: '14px',
              letterSpacing: '0px'
            }}>
              💬 Frases Sugeridas
            </h3>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '16px',
              background: '#f9fafb',
              padding: '4px',
              borderRadius: '10px'
            }}>
              {(['basic', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  style={{
                    flex: 1,
                    background: selectedLevel === level
                      ? `linear-gradient(135deg, ${colorScheme.primary}, #CA035E)`
                      : 'transparent',
                    border: 'none',
                    padding: '8px 14px',
                    color: selectedLevel === level ? '#ffffff' : '#9ca3af',
                    fontSize: '0.85rem',
                    fontWeight: selectedLevel === level ? 700 : 600,
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedLevel === level ? `0 2px 4px ${colorScheme.shadow}` : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (selectedLevel !== level) {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.color = '#1a1a1a';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedLevel !== level) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }
                  }}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Lista de frases */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {phrases.map((phrase, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    background: colorScheme.light,
                    border: `2px solid ${colorScheme.light}`,
                    borderRadius: '10px',
                    fontSize: '1.05rem',
                    color: '#4b5563',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = colorScheme.primary;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = colorScheme.light;
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {phrase}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
