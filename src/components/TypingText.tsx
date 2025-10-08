import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  style?: React.CSSProperties;
}

export const TypingText: React.FC<TypingTextProps> = ({ text, speed = 50, style }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span style={style}>
      {displayedText}
      {currentIndex < text.length && (
        <span style={{
          borderRight: '2px solid currentColor',
          animation: 'blink-caret 0.75s step-end infinite',
          paddingRight: '2px',
          marginLeft: '2px'
        }}>

        </span>
      )}
    </span>
  );
};
