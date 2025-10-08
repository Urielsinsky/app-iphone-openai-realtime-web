import React from 'react';

interface VoiceChatProps {
  onStartConversation?: () => void;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ onStartConversation }) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      padding: '1.5rem',
      margin: '1rem 0',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      <h3 style={{ marginBottom: '1rem', color: '#FFE5B4' }}>
        🎤 Chat de Voz con IA
      </h3>
      <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
        Próximamente podrás hablar directamente con tu tutor de IA
      </p>
      <button
        style={{
          background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
          border: 'none',
          borderRadius: '25px',
          padding: '0.8rem 2rem',
          color: 'white',
          fontSize: '1rem',
          cursor: 'not-allowed',
          opacity: 0.6,
        }}
        disabled
      >
        🚧 En Desarrollo
      </button>
    </div>
  );
};