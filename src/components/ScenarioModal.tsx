import React from 'react';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  scenario: {
    title: string;
    description: string;
    image: string;
    objective: string;
    vocabulary: string[];
    duration: string;
    language: 'spanish' | 'english';
  };
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({
  isOpen,
  onClose,
  onStart,
  scenario
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          fontFamily: 'Nunito, sans-serif',
          animation: 'slideUpModal 0.4s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #CA035E, #008CB8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            padding: '20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
          }}>
            <img
              src={scenario.image}
              alt={scenario.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: '#1a1a1a',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            {scenario.title}
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            fontWeight: 500
          }}>
            {scenario.description}
          </p>
        </div>

        {/* Objective */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.4rem' }}>🎯</span>
            What you'll practice
          </h3>
          <p style={{
            fontSize: '0.95rem',
            color: '#4b5563',
            lineHeight: '1.6',
            fontWeight: 600
          }}>
            {scenario.objective}
          </p>
        </div>

        {/* Vocabulary */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.4rem' }}>📝</span>
            Phrases you'll need
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {scenario.vocabulary.map((word, index) => (
              <span
                key={index}
                style={{
                  background: 'linear-gradient(to right, #CA035E10, #008CB820)',
                  color: '#1a1a1a',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: '2px solid #CA035E30'
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.4rem' }}>⏱️</span>
            How long it takes
          </h3>
          <p style={{
            fontSize: '0.95rem',
            color: '#4b5563',
            fontWeight: 600
          }}>
            {scenario.duration}
          </p>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: '#ffffff',
              border: '2px solid #d1d5db',
              borderRadius: '12px',
              padding: '14px 24px',
              color: '#6b7280',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: 700,
              fontFamily: 'Nunito, sans-serif',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            style={{
              flex: 2,
              background: 'linear-gradient(to right, #CA035E, #008CB8)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              color: '#ffffff',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: 700,
              fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 4px 12px rgba(202, 3, 94, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(202, 3, 94, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(202, 3, 94, 0.3)';
            }}
          >
            Let's Go! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
