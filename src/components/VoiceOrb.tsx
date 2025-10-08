import React from 'react';

interface VoiceOrbProps {
  isActive: boolean;
  gradient?: string;
  primaryColor?: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isActive,
  gradient = 'linear-gradient(135deg, #CA035E, #008CB8)',
  primaryColor = '#CA035E'
}) => {
  return (
    <div style={{
      position: 'relative',
      width: '200px',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto'
    }}>
      {/* Ondas externas animadas */}
      {isActive && (
        <>
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: `4px solid ${primaryColor}`,
            opacity: 0.7,
            animation: 'orbWave 1.5s ease-out infinite',
            animationDelay: '0s'
          } as React.CSSProperties} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: `4px solid ${primaryColor}`,
            opacity: 0.5,
            animation: 'orbWave 1.5s ease-out infinite',
            animationDelay: '0.3s'
          } as React.CSSProperties} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: `4px solid ${primaryColor}`,
            opacity: 0.3,
            animation: 'orbWave 1.5s ease-out infinite',
            animationDelay: '0.6s'
          } as React.CSSProperties} />
        </>
      )}

      {/* Resplandor externo */}
      {isActive && (
        <div style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}40, transparent)`,
          filter: 'blur(20px)',
          animation: 'orbPulse 1.5s ease-in-out infinite'
        }} />
      )}

      {/* Orbe central */}
      <div style={{
        position: 'relative',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: isActive
          ? gradient
          : 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
        boxShadow: isActive
          ? `0 0 60px ${primaryColor}aa, 0 0 120px ${primaryColor}60, inset 0 0 30px rgba(255,255,255,0.2)`
          : '0 0 20px rgba(156, 163, 175, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: isActive ? 'orbPulse 1.5s ease-in-out infinite' : 'none',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
        border: isActive ? '2px solid rgba(255,255,255,0.3)' : 'none'
      }}>
        {/* Brillo interno animado */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: isActive
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent)'
            : 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(20px)',
          animation: isActive ? 'orbPulse 1.5s ease-in-out infinite' : 'none'
        }} />

        {/* Partículas giratorias */}
        {isActive && (
          <>
            <div style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ffffff',
              top: '20%',
              right: '30%',
              animation: 'float 3s ease-in-out infinite',
              boxShadow: '0 0 10px #ffffff'
            } as React.CSSProperties} />
            <div style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#ffffff',
              bottom: '25%',
              left: '25%',
              animation: 'float 2.5s ease-in-out infinite',
              animationDelay: '0.5s',
              boxShadow: '0 0 8px #ffffff'
            } as React.CSSProperties} />
            <div style={{
              position: 'absolute',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#ffffff',
              top: '40%',
              left: '20%',
              animation: 'float 2.8s ease-in-out infinite',
              animationDelay: '1s',
              boxShadow: '0 0 9px #ffffff'
            } as React.CSSProperties} />
          </>
        )}
      </div>
    </div>
  );
};
