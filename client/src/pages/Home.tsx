import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import ConversationHistory from "@/components/ConversationHistory";
import VoiceInput from "@/components/VoiceInput";
import Footer from "@/components/Footer";
import { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: "Hello! I'm JuanMa, your AI assistant. Feel free to ask me anything by clicking the microphone button and speaking your request.",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTranscription = async (transcription: string) => {
    if (!transcription.trim()) {
      toast({
        title: "No speech detected",
        description: "Please try speaking again.",
        variant: "destructive",
      });
      return;
    }

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

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast({
      title: `Voice response ${!audioEnabled ? "enabled" : "disabled"}`,
      description: `JuanMa will ${!audioEnabled ? "now" : "no longer"} respond with voice.`,
    });
  };

  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-indigo-600 rounded-full filter blur-3xl"></div>
        </div>

        {/* Welcome message */}
        <div className="text-center mb-8 mt-2 relative">
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome to JuanMa Assistant</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            How can I help you today? Click the microphone button below to start speaking.
          </p>
        </div>

        <ConversationHistory messages={messages} ref={conversationEndRef} />
        
        <VoiceInput 
          onTranscription={handleTranscription} 
          isProcessing={isProcessing} 
        />
      </main>
      
      <Footer 
        audioEnabled={audioEnabled}
        onToggleAudio={toggleAudio}
      />
    </div>
  );
}
