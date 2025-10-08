export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ConversationState {
  isConnected: boolean;
  isRecording: boolean;
  messages: ChatMessage[];
  currentScenario?: string;
}

export interface OpenAIRealtimeConfig {
  apiKey: string;
  model?: string;
  voice?: string;
  temperature?: number;
}

export interface AudioState {
  isRecording: boolean;
  audioLevel: number;
  error?: string;
}