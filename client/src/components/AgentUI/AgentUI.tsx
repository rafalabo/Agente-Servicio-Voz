import React, { useState } from 'react';
import Header from './Header';
import Visualizer from './Visualizer';
import Controls from './Controls';
import styles from './AgentUI.module.css';
import { startRecording, stopRecording } from "@/lib/audioRecorder";
import { startSpeechRecognition, stopSpeechRecognition } from "@/lib/speechRecognition";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/lib/types";

const AgentUI: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { toast } = useToast();
  
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

  const handleStartSpeaking = async () => {
    if (isProcessing) return;
    
    if (!isListening) {
      try {
        setCurrentMessage("");
        setTranscription("");
        
        // Iniciar grabación de audio
        const recorder = await startRecording();
        mediaRecorderRef.current = recorder;
        
        // Iniciar reconocimiento de voz
        startSpeechRecognition(
          (result) => {
            setTranscription(result);
          },
          (error) => {
            console.error("Error de reconocimiento de voz:", error);
            toast({
              title: "Error",
              description: "Error al reconocer el habla. Inténtalo de nuevo.",
              variant: "destructive",
            });
            handleStopRecording();
          }
        );
        
        setIsListening(true);
      } catch (error) {
        console.error("Error al iniciar la grabación:", error);
        toast({
          title: "Error de acceso",
          description: "No se pudo acceder al micrófono. Por favor, verifica los permisos.",
          variant: "destructive",
        });
      }
    } else {
      handleStopRecording();
      
      if (transcription) {
        await processTranscription(transcription);
      } else {
        toast({
          title: "Sin voz detectada",
          description: "No se detectó ninguna voz. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleStopRecording = () => {
    stopRecording(mediaRecorderRef.current);
    stopSpeechRecognition();
    setIsListening(false);
  };
  
  const processTranscription = async (text: string) => {
    if (!text.trim()) return;
    
    setCurrentMessage(text);
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    try {
      setIsProcessing(true);
      
      // Enviar a la API
      const response = await apiRequest("POST", "/api/chat", {
        message: text,
      });
      
      const data = await response.json();
      
      // Agregar respuesta del asistente
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response,
        timestamp: new Date(),
        audioUrl: audioEnabled ? data.audioUrl : undefined,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      // Mostrar la respuesta del asistente
      setCurrentMessage(data.response);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast({
        title: "Error al procesar mensaje",
        description: "Hubo un error al comunicarse con el asistente. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <Visualizer 
        message={currentMessage} 
        isProcessing={isProcessing} 
        isListening={isListening}
      />
      <Controls 
        onStartSpeaking={handleStartSpeaking} 
        isListening={isListening}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default AgentUI;