import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { OpenAIRealtimeService } from '../services/openai-realtime';
import { Scenario } from './ScenarioSelector';
import { VoiceOrb } from './VoiceOrb';
import { TypingText } from './TypingText';
import { useDailyLimit } from '../hooks/useDailyLimit';

interface ConversationChatProps {
  scenario: Scenario;
  onBack: () => void;
}

export const ConversationChat: React.FC<ConversationChatProps> = ({ scenario, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [currentChipMessage, setCurrentChipMessage] = useState<string>('');
  const [messageKey, setMessageKey] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const realtimeServiceRef = useRef<OpenAIRealtimeService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingUserTranscript = useRef<string | null>(null);
  const orbTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hook de límite diario
  const {
    timeRemaining,
    isLimitReached,
    startTracking,
    stopTracking,
    formatTimeRemaining
  } = useDailyLimit();

  const handleOpenAIMessage = useCallback((message: any) => {
    console.log('📨 Mensaje OpenAI:', message.type, message);

    switch (message.type) {
      case 'response.created':
        // Respuesta iniciada - activar orbe
        console.log('🎤 Chip está preparando respuesta...');
        // Limpiar timeout anterior si existe
        if (orbTimeoutRef.current) {
          clearTimeout(orbTimeoutRef.current);
          orbTimeoutRef.current = null;
        }
        setIsAISpeaking(true);
        setIsTyping(true);
        break;

      case 'response.audio.delta':
        // Audio de la IA - activar orbe mientras hay audio
        console.log('🔊 Audio de Chip llegando...', message);
        // Limpiar timeout anterior
        if (orbTimeoutRef.current) {
          clearTimeout(orbTimeoutRef.current);
          orbTimeoutRef.current = null;
        }
        setIsAISpeaking(true);
        break;

      case 'response.audio_transcript.delta':
        // Transcripción parcial de la respuesta de la IA
        if (message.delta) {
          console.log('🎙️ IA transcribiendo:', message.delta);
          setIsTyping(true);
          // Limpiar timeout anterior
          if (orbTimeoutRef.current) {
            clearTimeout(orbTimeoutRef.current);
            orbTimeoutRef.current = null;
          }
          setIsAISpeaking(true); // Mantener orbe activo
        }
        break;

      case 'response.audio_transcript.done':
        // Transcripción completa de la respuesta de la IA - mostrar solo mensaje actual
        if (message.transcript) {
          console.log('✅ Transcripción de Chip completada:', message.transcript);

          // Guardar para historial completo
          setMessages(prev => {
            const newMessages = [...prev];

            // Primero agregar mensaje del usuario si está pendiente
            if (pendingUserTranscript.current) {
              console.log('📝 Agregando mensaje del usuario pendiente:', pendingUserTranscript.current);
              newMessages.push({
                id: `user-${Date.now()}`,
                role: 'user',
                content: pendingUserTranscript.current,
                timestamp: new Date()
              });
              pendingUserTranscript.current = null;
            }

            // Luego agregar mensaje de la IA
            newMessages.push({
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: message.transcript,
              timestamp: new Date()
            });

            return newMessages;
          });

          // Mostrar el mensaje actual de Chip con fade in
          setIsTyping(false);
          setCurrentChipMessage(message.transcript);
          setMessageKey(prev => prev + 1); // Forzar re-animación
        }
        break;

      case 'conversation.item.input_audio_transcription.completed':
        // Transcripción del usuario - guardar como pendiente
        if (message.transcript) {
          console.log('✅ Transcripción del usuario completada:', message.transcript);
          pendingUserTranscript.current = message.transcript;
        }
        break;

      case 'response.audio.done':
        // Audio completado - desactivar orbe con delay para que termine de reproducirse
        console.log('🔇 Audio de Chip enviado completamente, esperando reproducción...');
        setIsTyping(false);
        // Mantener orbe activo por 2 segundos más para dar tiempo al audio de reproducirse
        orbTimeoutRef.current = setTimeout(() => {
          console.log('🔇 Desactivando orbe después de reproducción');
          setIsAISpeaking(false);
          orbTimeoutRef.current = null;
        }, 2000);
        break;

      case 'response.done':
        // Respuesta completada
        console.log('✅ Respuesta completada');
        // Si no hay timeout activo, desactivar inmediatamente
        if (!orbTimeoutRef.current) {
          setIsAISpeaking(false);
        }
        setIsTyping(false);
        break;

      case 'input_audio_buffer.speech_started':
        console.log('👤 Usuario empezó a hablar');
        // Si el usuario empieza a hablar, desactivar orbe inmediatamente
        if (orbTimeoutRef.current) {
          clearTimeout(orbTimeoutRef.current);
          orbTimeoutRef.current = null;
        }
        setIsAISpeaking(false);
        break;

      case 'input_audio_buffer.speech_stopped':
        console.log('👤 Usuario terminó de hablar');
        // Mostrar typing cuando el usuario termina de hablar (Chip va a responder)
        setIsTyping(true);
        // Fade out del mensaje anterior de Chip con animación
        if (currentChipMessage) {
          setIsExiting(true);
          setTimeout(() => {
            setCurrentChipMessage('');
            setIsExiting(false);
          }, 400);
        }
        break;

      case 'session.updated':
        console.log('⚙️ Sesión actualizada');
        break;
    }
  }, []);

  const connectToOpenAI = useCallback(async () => {
    // Verificar límite diario
    if (isLimitReached) {
      alert('Has alcanzado tu límite de 5 minutos por hoy. Vuelve mañana para seguir practicando! 🌟');
      return;
    }

    try {
      console.log('🔄 Conectando a OpenAI Realtime API...');

      // Obtener la API key desde las variables de entorno
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

      if (!apiKey) {
        throw new Error('OpenAI API Key not configured. Add REACT_APP_OPENAI_API_KEY to your .env file');
      }

      realtimeServiceRef.current = new OpenAIRealtimeService(apiKey, scenario.prompt);

      // Configurar callbacks
      realtimeServiceRef.current.onMessage((message) => {
        handleOpenAIMessage(message);
      });

      realtimeServiceRef.current.onDisconnect(() => {
        console.log('🔴 Disconnection detected');
        setIsConnected(false);
        stopTracking(); // Detener tracking al desconectar
      });

      // Connect to OpenAI
      await realtimeServiceRef.current.connect();

      setIsConnected(true);
      startTracking(); // Iniciar tracking de tiempo
      console.log('✅ Successfully connected to OpenAI Realtime API');

      // Initial message
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hey! I'm Chip, your tutor. Go ahead and start speaking, I'm listening 🎤",
        timestamp: new Date()
      };

      setMessages([initialMessage]);
      setCurrentChipMessage("Hey! I'm Chip, your tutor. Go ahead and start speaking, I'm listening 🎤");

    } catch (error) {
      console.error('❌ Connection error:', error);
      setIsConnected(false);

      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Could not connect'}`,
        timestamp: new Date()
      };
      setMessages([errorMessage]);
    }
  }, [handleOpenAIMessage, isLimitReached, startTracking, stopTracking, scenario.prompt]);

  const disconnect = useCallback(() => {
    if (realtimeServiceRef.current) {
      realtimeServiceRef.current.disconnect();
      realtimeServiceRef.current = null;
    }

    // Limpiar timeout del orbe si existe
    if (orbTimeoutRef.current) {
      clearTimeout(orbTimeoutRef.current);
      orbTimeoutRef.current = null;
    }

    // Detener tracking de tiempo
    stopTracking();

    setIsConnected(false);
    setMessages([]);
    setIsAISpeaking(false);
    setCurrentChipMessage('');
    setIsExiting(false);
    pendingUserTranscript.current = null;

    console.log('🔌 Disconnected from OpenAI Realtime API');
  }, [stopTracking]);

  // Smooth scroll cuando se agregan mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Debug: Log when orb state changes
  useEffect(() => {
    console.log('🎙️ Orb state changed:', isAISpeaking ? 'ACTIVE ✅' : 'INACTIVE ❌');
  }, [isAISpeaking]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Desconectar automáticamente cuando se alcanza el límite
  useEffect(() => {
    if (isLimitReached && isConnected) {
      alert('⏰ Se acabó tu tiempo de práctica por hoy! Has usado tus 5 minutos. Vuelve mañana para seguir practicando! 🌟');
      disconnect();
    }
  }, [isLimitReached, isConnected, disconnect]);

  const phrases = scenario.phrases[selectedLevel];

  // Determine color scheme based on language
  const colorScheme = scenario.language === 'spanish'
    ? {
        primary: '#8A9900',
        gradient: 'linear-gradient(135deg, #8A9900, #6d7a00)',
        light: '#f9fdf0',
        shadow: 'rgba(138, 153, 0, 0.3)'
      }
    : {
        primary: '#008CB8',
        gradient: 'linear-gradient(135deg, #008CB8, #006a8f)',
        light: '#f0f9ff',
        shadow: 'rgba(0, 140, 184, 0.3)'
      };

  return (
    <div style={{
      display: 'flex',
      gap: '40px',
      width: '100%',
      maxWidth: '1400px',
      height: 'calc(100vh - 120px)',
      fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '0 20px'
    }}>
      {/* Columna Izquierda - Escenario y Chip */}
      <div style={{
        flex: '0 0 65%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Botón Back */}
        <button
          onClick={onBack}
          disabled={isConnected}
          style={{
            background: 'transparent',
            border: 'none',
            color: isConnected ? '#9ca3af' : '#1a1a1a',
            fontSize: '1rem',
            cursor: isConnected ? 'not-allowed' : 'pointer',
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            fontFamily: 'Nunito, sans-serif',
            alignSelf: 'flex-start'
          }}
          onMouseOver={(e) => {
            if (!isConnected) {
              e.currentTarget.style.opacity = '0.7';
            }
          }}
          onMouseOut={(e) => {
            if (!isConnected) {
              e.currentTarget.style.opacity = '1';
            }
          }}
        >
          ← Back
        </button>

        {/* Título y descripción */}
        <div>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '-1px',
            lineHeight: '1.1'
          }}>{scenario.title}</h1>
          <p style={{
            margin: 0,
            fontSize: '1.1rem',
            color: '#6b7280',
            fontWeight: 600
          }}>
            {scenario.description}
          </p>
        </div>

        {/* Recuadro con Chip */}
        <div style={{
          background: `linear-gradient(135deg,
            rgba(255, 255, 255, 1) 0%,
            ${scenario.language === 'spanish' ? 'rgba(249, 253, 240, 0.5)' : 'rgba(240, 249, 255, 0.5)'} 100%)`,
          border: `4px solid ${scenario.language === 'spanish' ? '#8A9900' : '#008CB8'}`,
          borderRadius: '24px',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          minHeight: '420px',
          position: 'relative',
          boxShadow: `
            0 2px 4px rgba(0, 0, 0, 0.02),
            0 4px 8px rgba(0, 0, 0, 0.03),
            0 8px 16px rgba(0, 0, 0, 0.04),
            0 16px 32px rgba(0, 0, 0, 0.05),
            inset 0 0 0 1px rgba(255, 255, 255, 0.5)
          `,
          backdropFilter: 'blur(10px)'
        }}>
          {/* Chip character - solo mostrar cuando NO está conectado */}
          {!isConnected && (
            <img
              src="/chip.png"
              alt="Chip"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))',
                animation: 'breathing 3s ease-in-out infinite'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}

          {/* Chip cuando está conectado - con animación de fade out */}
          {isConnected && currentChipMessage === '' && (
            <img
              src="/chip.png"
              alt="Chip"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))',
                animation: 'chipFadeOut 0.6s ease-out forwards'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}

          {/* Mensaje de Chip */}
          {!isConnected ? (
            <div style={{
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: '1.4',
                margin: 0
              }}>
                "<TypingText text="Hi! I'm Chip. Ready to practice?" speed={60} />"
              </p>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {!currentChipMessage ? (
                <p style={{
                  fontSize: '1.2rem',
                  color: '#9ca3af',
                  fontWeight: 600,
                  opacity: isTyping ? 0.5 : 1,
                  transition: 'opacity 0.3s ease',
                  margin: 0
                }}>
                  {isTyping ? 'Chip is thinking...' : 'Start talking...'}
                </p>
              ) : (
                <div
                  key={messageKey}
                  className={isExiting ? 'chip-message-exit' : 'chip-message-enter'}
                  style={{
                    fontSize: '1.3rem',
                    lineHeight: '1.5',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    margin: 0
                  }}>
                  "{currentChipMessage}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón Start Practicing o Voice Orb */}
        {!isConnected ? (
          <button
            onClick={connectToOpenAI}
            disabled={isLimitReached}
            style={{
              background: isLimitReached ? '#9ca3af' : '#008CB8',
              border: 'none',
              borderRadius: '12px',
              padding: '18px 32px',
              color: '#ffffff',
              fontSize: '1.1rem',
              cursor: isLimitReached ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              boxShadow: isLimitReached ? 'none' : '0 4px 16px rgba(0, 140, 184, 0.3)',
              transition: 'all 0.2s ease',
              fontFamily: 'Nunito, sans-serif',
              width: '100%',
              opacity: isLimitReached ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!isLimitReached) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 140, 184, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLimitReached) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 140, 184, 0.3)';
              }
            }}
          >
            {isLimitReached ? '🔒 Limit Reached' : 'Start Practicing'}
          </button>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Orbe ocultado temporalmente */}
            {/* <VoiceOrb
              isActive={isAISpeaking}
              gradient={colorScheme.gradient}
              primaryColor={colorScheme.primary}
            /> */}

            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              fontWeight: 600,
              textAlign: 'center',
              margin: 0
            }}>
              {isAISpeaking ? '🎤 Chip is speaking...' : '👂 Speak freely, I\'m listening'}
            </p>

            <button
              onClick={disconnect}
              style={{
                background: '#ffffff',
                border: '2px solid #CA035E',
                borderRadius: '50px',
                padding: '12px 32px',
                color: '#CA035E',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(202, 3, 94, 0.1)',
                transition: 'all 0.3s ease',
                fontFamily: 'Nunito, sans-serif'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#CA035E';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#CA035E';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              End Conversation
            </button>
          </div>
        )}
      </div>

      {/* Columna Derecha - Información y Frases */}
      <div style={{
        flex: '0 0 35%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: `
          0 2px 4px rgba(0, 0, 0, 0.02),
          0 4px 8px rgba(0, 0, 0, 0.03),
          0 8px 16px rgba(0, 0, 0, 0.04),
          0 16px 32px rgba(0, 0, 0, 0.05),
          inset 0 0 0 1px rgba(255, 255, 255, 0.6)
        `,
        border: '1px solid rgba(229, 231, 235, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Badges superiores */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* TIME badge */}
          <div style={{
            background: 'linear-gradient(135deg, #FFF0F8 0%, #FFE5F3 100%)',
            border: '2px solid #CA035E',
            color: '#CA035E',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(202, 3, 94, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            TIME: {scenario.duration}
          </div>

          {/* LANGUAGE badge */}
          <div style={{
            background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${scenario.language === 'spanish' ? '#6d7a00' : '#006a8f'} 100%)`,
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: `0 2px 8px ${colorScheme.shadow}, 0 1px 3px rgba(0, 0, 0, 0.1)`
          }}>
            {scenario.language === 'spanish' ? 'ESPAÑOL' : 'ENGLISH'}
          </div>

          {/* LEVEL badge */}
          <div style={{
            background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
            color: '#6b7280',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            {scenario.difficulty === 'easy' ? 'A1-A2' : 'B1-B2'}
          </div>

          {/* LIVE badge */}
          {isConnected && (
            <div style={{
              background: 'linear-gradient(135deg, #CA035E 0%, #9B0248 100%)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'pulse 2s infinite',
              boxShadow: '0 2px 8px rgba(202, 3, 94, 0.3), 0 4px 16px rgba(202, 3, 94, 0.15)'
            }}>
              ⚫ LIVE
            </div>
          )}
        </div>

        {/* Daily time limit indicator */}
        <div style={{
          background: isLimitReached
            ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
            : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: `2px solid ${isLimitReached ? '#ef4444' : '#22c55e'}`,
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>
              {isLimitReached ? '🔒' : '⏰'}
            </span>
            <div>
              <p style={{
                margin: 0,
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {isLimitReached ? 'Limit reached' : 'Time remaining today'}
              </p>
              <p style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 900,
                color: isLimitReached ? '#ef4444' : '#22c55e',
                letterSpacing: '-0.5px'
              }}>
                {formatTimeRemaining()}
              </p>
            </div>
          </div>
          {isLimitReached && (
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: '#ef4444',
              fontWeight: 600,
              maxWidth: '140px',
              lineHeight: '1.3'
            }}>
              Come back tomorrow to continue practicing
            </p>
          )}
        </div>

        {/* Suggested Phrases */}
        <div>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            💬 Suggested Phrases
          </h3>

          {/* Tabs como botones */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            justifyContent: 'center',
            background: '#f3f4f6',
            padding: '6px',
            borderRadius: '12px'
          }}>
            <button
              onClick={() => setSelectedLevel('basic')}
              style={{
                background: selectedLevel === 'basic'
                  ? `linear-gradient(135deg, ${colorScheme.primary} 0%, ${scenario.language === 'spanish' ? '#6d7a00' : '#006a8f'} 100%)`
                  : 'transparent',
                border: 'none',
                padding: '10px 20px',
                color: selectedLevel === 'basic' ? '#ffffff' : '#6b7280',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                flex: 1,
                boxShadow: selectedLevel === 'basic'
                  ? `0 2px 8px ${colorScheme.shadow}, 0 1px 3px rgba(0, 0, 0, 0.1)`
                  : 'none',
                transform: selectedLevel === 'basic' ? 'translateY(-1px)' : 'none'
              }}
              onMouseOver={(e) => {
                if (selectedLevel !== 'basic') {
                  e.currentTarget.style.background = '#e5e7eb';
                }
              }}
              onMouseOut={(e) => {
                if (selectedLevel !== 'basic') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}>
              Basic
            </button>
            <button
              onClick={() => setSelectedLevel('intermediate')}
              style={{
                background: selectedLevel === 'intermediate'
                  ? `linear-gradient(135deg, ${colorScheme.primary} 0%, ${scenario.language === 'spanish' ? '#6d7a00' : '#006a8f'} 100%)`
                  : 'transparent',
                border: 'none',
                padding: '10px 20px',
                color: selectedLevel === 'intermediate' ? '#ffffff' : '#6b7280',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                flex: 1,
                boxShadow: selectedLevel === 'intermediate'
                  ? `0 2px 8px ${colorScheme.shadow}, 0 1px 3px rgba(0, 0, 0, 0.1)`
                  : 'none',
                transform: selectedLevel === 'intermediate' ? 'translateY(-1px)' : 'none'
              }}
              onMouseOver={(e) => {
                if (selectedLevel !== 'intermediate') {
                  e.currentTarget.style.background = '#e5e7eb';
                }
              }}
              onMouseOut={(e) => {
                if (selectedLevel !== 'intermediate') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}>
              Intermediate
            </button>
            <button
              onClick={() => setSelectedLevel('advanced')}
              style={{
                background: selectedLevel === 'advanced'
                  ? `linear-gradient(135deg, ${colorScheme.primary} 0%, ${scenario.language === 'spanish' ? '#6d7a00' : '#006a8f'} 100%)`
                  : 'transparent',
                border: 'none',
                padding: '10px 20px',
                color: selectedLevel === 'advanced' ? '#ffffff' : '#6b7280',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                flex: 1,
                boxShadow: selectedLevel === 'advanced'
                  ? `0 2px 8px ${colorScheme.shadow}, 0 1px 3px rgba(0, 0, 0, 0.1)`
                  : 'none',
                transform: selectedLevel === 'advanced' ? 'translateY(-1px)' : 'none'
              }}
              onMouseOver={(e) => {
                if (selectedLevel !== 'advanced') {
                  e.currentTarget.style.background = '#e5e7eb';
                }
              }}
              onMouseOut={(e) => {
                if (selectedLevel !== 'advanced') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}>
              Advanced
            </button>
          </div>

          {/* Lista de frases */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {phrases.map((phrase, i) => (
              <div key={i} style={{
                padding: '16px 20px',
                background: `linear-gradient(135deg, ${colorScheme.light} 0%, rgba(255, 255, 255, 0.8) 100%)`,
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
                fontSize: '1rem',
                color: '#1a1a1a',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: `
                  0 1px 2px rgba(0, 0, 0, 0.03),
                  0 2px 4px rgba(0, 0, 0, 0.04),
                  0 4px 8px rgba(0, 0, 0, 0.05),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.3)
                `
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateX(4px) translateY(-1px)';
                e.currentTarget.style.boxShadow = `
                  0 4px 8px rgba(0, 0, 0, 0.08),
                  0 6px 12px rgba(0, 0, 0, 0.06),
                  0 0 0 2px ${colorScheme.primary}30
                `;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateX(0) translateY(0)';
                e.currentTarget.style.boxShadow = `
                  0 1px 2px rgba(0, 0, 0, 0.03),
                  0 2px 4px rgba(0, 0, 0, 0.04),
                  0 4px 8px rgba(0, 0, 0, 0.05),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.3)
                `;
              }}>
                {phrase}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};