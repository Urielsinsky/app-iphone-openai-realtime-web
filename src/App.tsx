import React, { useState } from 'react';
import './App.css';
import { ConversationChat } from './components/ConversationChat';
import { ConversationChatDesignDemo } from './components/ConversationChatDesignDemo';
import { ScenarioSelector, Scenario } from './components/ScenarioSelector';

function App() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isDesignMode, setIsDesignMode] = useState(false);

  return (
    <div className="App">
      {/* Header con degradado ChidoLingo */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'linear-gradient(135deg, #CA035E 0%, #008CB8 100%)',
        padding: '8px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Logo */}
        <img
          src="https://i0.wp.com/chidolingo.com/wp-content/uploads/2022/01/logo-600x120.png"
          alt="ChidoLingo"
          style={{
            height: '28px'
          }}
        />

        {/* Botón Download App */}
        <a
          href="https://apps.apple.com/us/app/chidolingo-tutor/id6742847227"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 18px',
            color: '#CA035E',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'Nunito, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          <span style={{ fontSize: '1rem' }}></span>
          Download App
        </a>
      </header>

      <div className="App-header">
        {!selectedScenario ? (
          <ScenarioSelector
            onSelectScenario={setSelectedScenario}
            onDesignModeSelect={(scenario) => {
              setSelectedScenario(scenario);
              setIsDesignMode(true);
            }}
          />
        ) : isDesignMode ? (
          <ConversationChatDesignDemo
            scenario={selectedScenario}
            onBack={() => {
              setSelectedScenario(null);
              setIsDesignMode(false);
            }}
          />
        ) : (
          <ConversationChat
            scenario={selectedScenario}
            onBack={() => setSelectedScenario(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
