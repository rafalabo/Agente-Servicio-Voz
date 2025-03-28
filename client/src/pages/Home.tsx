import { useState, useRef, useEffect } from "react";
import VoiceInput from "@/components/VoiceInput";
import { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const { toast } = useToast();
  
  const handleTranscription = async (transcription: string) => {
    if (!transcription.trim()) {
      toast({
        title: "No speech detected",
        description: "Please try speaking again.",
        variant: "destructive",
      });
      return;
    }

    // Display the current transcription
    setCurrentMessage(transcription);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: transcription,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    try {
      setIsProcessing(true);
      
      // Send to API
      const response = await apiRequest("POST", "/api/chat", {
        message: transcription,
      });
      
      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response,
        timestamp: new Date(),
        audioUrl: audioEnabled ? data.audioUrl : undefined,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      // Display the AI response
      setCurrentMessage(data.response);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error processing message",
        description: "There was an error communicating with JuanMa. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-black text-blue-50 flex flex-col min-h-screen overflow-hidden">
      {/* Header - simplified to just a brand name */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary/80 glow-effect"></div>
            <span className="text-primary tracking-wider font-light text-lg">JARVIS</span>
          </div>
          <div className="text-xs text-primary/80 flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Online
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center relative">
        {/* Dark background with grid-like pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Central orb */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Outer rings */}
          <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/20 animate-pulse-slow"></div>
          <div className="absolute w-[300px] h-[300px] rounded-full border border-primary/30"></div>
          <div className="absolute w-[200px] h-[200px] rounded-full border border-primary/40"></div>
          
          {/* Horizontal scan lines */}
          <div className="absolute left-[-200px] right-[-200px] flex flex-col space-y-2">
            <div className="h-px bg-primary/30 w-full transform translate-y-[-100px]"></div>
            <div className="h-px bg-primary/20 w-full transform translate-y-[-50px]"></div>
            <div className="h-px bg-primary/40 w-full"></div>
            <div className="h-px bg-primary/20 w-full transform translate-y-[50px]"></div>
            <div className="h-px bg-primary/30 w-full transform translate-y-[100px]"></div>
          </div>
          
          {/* Status labels */}
          <div className="absolute right-[-160px] top-0 text-xs text-primary/70">
            <div>SYS_STATUS: OPTIMAL</div>
            <div className="mt-1">CONN: SECURE</div>
          </div>
          
          {/* Animated dots */}
          <div className="absolute left-[-150px] top-[30px]">
            <span className="inline-block h-1 w-1 rounded-full bg-primary/80 animate-ping"></span>
          </div>
          <div className="absolute right-[-120px] bottom-[50px]">
            <span className="inline-block h-1 w-1 rounded-full bg-primary/80 animate-ping delay-75"></span>
          </div>
          
          {/* Central glowing orb */}
          <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-b from-primary/80 to-primary/40 flex items-center justify-center shadow-[0_0_60px_20px_rgba(0,195,255,0.3)] relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
            <div className="z-10 text-center max-w-[120px] overflow-hidden text-white text-opacity-90 text-sm">
              {currentMessage || (isProcessing ? "Processing..." : "Voice assistant ready")}
            </div>
          </div>
        </div>
        
        {/* End call button */}
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-gray-100 bg-opacity-90 rounded-full flex items-center pl-3 pr-5 py-2 shadow-lg">
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-b from-primary to-blue-700"></div>
            </div>
            <span className="text-black font-medium flex items-center">
              End <X className="ml-1 w-4 h-4" />
            </span>
          </div>
        </div>
        
        {/* Voice input - moved to a less visible position but still functional */}
        <div className="fixed bottom-10 right-10 z-30">
          <VoiceInput 
            onTranscription={handleTranscription} 
            isProcessing={isProcessing}
            futuristicStyle={true}
          />
        </div>
      </main>
      
      {/* All CSS moved to index.css */}
    </div>
  );
}
