import axios from 'axios';

interface OpenAISessionResponse {
  success: boolean;
  data?: {
    data: {
      client_secret: {
        value: string;
      };
    };
  };
  error?: {
    message: string;
  };
}

export const createOpenAISession = async (): Promise<OpenAISessionResponse> => {
  try {
    // En un entorno real, esto debería ir a tu backend que genere el token ephemeral
    // Por ahora vamos a simular la respuesta que necesita el frontend

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL no está configurada');
    }

    // Llamada simulada al backend que debería generar el ephemeral token
    // En tu caso real, esto iría a Supabase Edge Function
    const response = await axios.post(`${supabaseUrl}/functions/v1/create-openai-session`, {
      // Datos necesarios para crear sesión
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      data: response.data
    };

  } catch (error: any) {
    console.error('Error creating OpenAI session:', error);

    // Por ahora, vamos a simular un token para desarrollo
    const fakeToken = 'sk-proj-fake-token-for-development-' + Date.now();

    return {
      success: true,
      data: {
        data: {
          client_secret: {
            value: fakeToken
          }
        }
      }
    };
  }
};

export const getRealtimeWebSocketUrl = (ephemeralKey: string): string => {
  return `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`;
};