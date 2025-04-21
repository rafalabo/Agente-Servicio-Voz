import { useState } from "react";
import { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AgentUI } from "@/components/AgentUI";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { toast } = useToast();
  
  const handleStartSpeaking = async () => {
    // Esta función se actualizará más adelante para incluir grabación 
    // y reconocimiento de voz real con la API actual
    
    // Por ahora es un simple placeholder
    console.log("Iniciando grabación de voz...");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <AgentUI />
      </div>
    </div>
  );
}
