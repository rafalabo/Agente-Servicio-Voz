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
            <span className="text-primary tracking-wider font-light text-lg">JUANMA</span>
          </div>
          <div className="text-xs text-primary/80 flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Online
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center relative bg-black">
        {/* Dark background with grid-like pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
        
        {/* Advanced circular interface */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Horizontal scan lines in background */}
          <div className="absolute left-[-300px] right-[-300px] flex flex-col space-y-6">
            <div className="h-px bg-primary/30 w-full transform translate-y-[-120px]"></div>
            <div className="h-px bg-primary/20 w-full transform translate-y-[-80px]"></div>
            <div className="h-px bg-primary/40 w-full"></div>
            <div className="h-px bg-primary/20 w-full transform translate-y-[80px]"></div>
            <div className="h-px bg-primary/30 w-full transform translate-y-[120px]"></div>
          </div>
          
          {/* Animated dots */}
          <div className="absolute left-[-180px] top-[30px]">
            <span className="inline-block h-1 w-1 rounded-full bg-primary/80 animate-ping"></span>
          </div>
          <div className="absolute right-[-190px] bottom-[50px]">
            <span className="inline-block h-1 w-1 rounded-full bg-primary/80 animate-ping delay-75"></span>
          </div>
          <div className="absolute left-[-220px] bottom-[20px]">
            <span className="inline-block h-1 w-1 rounded-full bg-primary/60 animate-ping delay-150"></span>
          </div>
          
          {/* Status labels */}
          <div className="absolute right-[-180px] top-[-40px] text-xs text-primary/70 font-mono">
            <div>SYS_STATUS: OPTIMAL</div>
            <div className="mt-1">AUDIO_PROC: ACTIVE</div>
            <div className="mt-1">CONN: SECURE</div>
          </div>
          
          <div className="absolute left-[-180px] bottom-[-30px] text-xs text-primary/70 font-mono">
            <div>SESSION: {Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</div>
            <div className="mt-1">UPTIME: 00:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}</div>
          </div>
          
          {/* The main circular display component */}
          <div className="circular-display">
            {/* Scan line animation */}
            <div className="scan-line"></div>
            
            {/* Technical tick marks in circular pattern */}
            <div className="tick-marks"></div>
            
            {/* Rotating circle */}
            <div className="rotating-circle"></div>
            
            {/* Outer segmented border */}
            <div className="outer-ring"></div>
            
            {/* Rotating segment for radar effect */}
            <div className="rotating-segment"></div>
            
            {/* Tech text elements */}
            <div className="tech-text tech-text-1">sys.initialize()</div>
            <div className="tech-text tech-text-2">audio.stream.active</div>
            
            {/* Central circle with message */}
            <div className="inner-circle">
              <div className="center-dot"></div>
              <div className="z-10 text-center w-[140px] text-white text-opacity-90 text-sm px-2 flex items-center justify-center h-full">
                <div>
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    currentMessage || "JUANMA"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elevenlabs ConvAI Widget is now added directly to the index.html */}
        
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
