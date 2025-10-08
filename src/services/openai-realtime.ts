export class OpenAIRealtimeService {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private localStream: MediaStream | null = null;
  private isConnected: boolean = false;
  private messageCallbacks: Array<(message: any) => void> = [];
  private onDisconnectCallback: (() => void) | null = null;
  private scenarioPrompt: string;

  constructor(private ephemeralKey: string, scenarioPrompt?: string) {
    this.scenarioPrompt = scenarioPrompt || `# Role & Objective
You are Chip, a friendly and patient Spanish tutor.
Goal: Help the user practice Spanish through natural conversation.

# Personality & Tone
- Encouraging, warm, supportive
- 1-2 sentences per turn
- Speak slowly but naturally

# Language
- ONLY respond in Spanish (A1-A2 level vocabulary)
- Use simple, basic words ONLY
- IF user speaks English, say: "Practiquemos en español"

# Unclear Audio
- ONLY respond to clear audio or text
- IF audio is unclear/noisy/silent/unintelligible, ask for clarification
- Sample phrases (VARY):
  * "¿Perdón? No te escuché"
  * "¿Puedes repetir?"
  * "No escuché bien"

# Variety Rule
DO NOT repeat the same sentence twice. Sound natural and human, not robotic.

# Corrections
- IF user makes mistake, correct gently AFTER responding
- Example: "¡Bien! (Se dice 'estoy', no 'soy')"`;
  }

  async connect(): Promise<void> {
    try {
      console.log('🔄 Iniciando conexión WebRTC a OpenAI Realtime API...');

      // Crear conexión WebRTC
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      // Monitorear estado de conexión
      this.peerConnection.addEventListener('connectionstatechange', () => {
        console.log('📡 Estado de conexión:', this.peerConnection?.connectionState);

        if (this.peerConnection?.connectionState === 'connected') {
          this.isConnected = true;
          console.log('✅ Conexión WebRTC establecida');
        } else if (this.peerConnection?.connectionState === 'failed' ||
                   this.peerConnection?.connectionState === 'disconnected') {
          this.isConnected = false;
          console.log('❌ Conexión WebRTC perdida');
          if (this.onDisconnectCallback) {
            this.onDisconnectCallback();
          }
        }
      });

      // Configurar manejo de audio remoto
      this.peerConnection.addEventListener('track', (event) => {
        console.log('🎵 Track de audio recibido');
        if (event.streams && event.streams[0]) {
          const remoteAudio = new Audio();
          remoteAudio.srcObject = event.streams[0];
          remoteAudio.play().catch(err => console.error('Error reproduciendo audio:', err));
        }
      });

      // Obtener stream de micrófono
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      console.log('🎤 Micrófono capturado');

      // Agregar tracks de audio a la conexión
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });

      // Crear canal de datos para eventos
      this.dataChannel = this.peerConnection.createDataChannel('oai-events', {
        ordered: true
      });

      this.dataChannel.addEventListener('open', () => {
        console.log('📡 Canal de datos abierto');
        this.sendSessionUpdate();
      });

      this.dataChannel.addEventListener('message', (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Mensaje recibido:', message.type);
          this.messageCallbacks.forEach(callback => callback(message));
        } catch (error) {
          console.error('Error procesando mensaje:', error);
        }
      });

      // Crear oferta SDP
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });

      await this.peerConnection.setLocalDescription(offer);

      // Enviar oferta a OpenAI
      const model = 'gpt-4o-mini-realtime-preview-2024-12-17';
      const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
        body: this.peerConnection.localDescription?.sdp
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        throw new Error(`Error de OpenAI (${sdpResponse.status}): ${errorText}`);
      }

      // Configurar respuesta SDP
      const answerSdp = await sdpResponse.text();
      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: answerSdp
      };

      await this.peerConnection.setRemoteDescription(answer);

      console.log('✅ Conexión WebRTC establecida exitosamente');

    } catch (error) {
      console.error('❌ Error en conexión WebRTC:', error);
      this.disconnect();
      throw error;
    }
  }

  private sendSessionUpdate(): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('Canal de datos no está listo');
      return;
    }

    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: this.scenarioPrompt,
        voice: 'cedar',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 700,
          create_response: true
        },
        temperature: 0.8,
        max_response_output_tokens: 4096
      }
    };

    this.dataChannel.send(JSON.stringify(sessionConfig));
    console.log('⚙️ Configuración de sesión enviada');
  }

  disconnect(): void {
    console.log('🔌 Desconectando servicio OpenAI Realtime...');

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.isConnected = false;
    this.messageCallbacks = [];
  }

  isReady(): boolean {
    return this.isConnected &&
           this.peerConnection?.connectionState === 'connected' &&
           this.dataChannel?.readyState === 'open';
  }

  onMessage(callback: (message: any) => void): void {
    this.messageCallbacks.push(callback);
  }

  onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }
}