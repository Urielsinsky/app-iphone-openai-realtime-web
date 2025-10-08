import React from 'react';

interface ChatBubbleProps {
  message: string;
  isAI: boolean;
  timestamp?: Date;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isAI, timestamp }) => {
  const messageContent = message.replace(/^(AI|Tú): /, '').trim();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      margin: '3px 0',
      maxWidth: '75%',
      padding: '8px 12px',
      borderRadius: '18px',
      boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
      alignSelf: isAI ? 'flex-start' : 'flex-end',
      backgroundColor: isAI ? '#F0F0F2' : '#007AFF',
      color: isAI ? '#333333' : '#FFFFFF',
      borderTopRightRadius: isAI ? '18px' : '4px',
      borderTopLeftRadius: isAI ? '4px' : '18px',
      marginLeft: isAI ? '0' : '25%',
      marginRight: isAI ? '25%' : '0',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '15px',
      lineHeight: '19px',
      letterSpacing: '0.1px'
    }}>
      <span>{messageContent}</span>

      {timestamp && (
        <span style={{
          fontSize: '10px',
          color: 'rgba(0,0,0,0.5)',
          alignSelf: 'flex-end',
          marginTop: '2px'
        }}>
          {formatTime(timestamp)}
        </span>
      )}
    </div>
  );
};