import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { startRecording, stopRecording } from "@/lib/audioRecorder";
import { startSpeechRecognition, stopSpeechRecognition } from "@/lib/speechRecognition";
import { Mic, X, Loader2 } from "lucide-react";

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
  futuristicStyle?: boolean;
}

export default function VoiceInput({ 
  onTranscription, 
  isProcessing, 
  futuristicStyle = false 
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [statusMessage, setStatusMessage] = useState("Ready");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  useEffect(() => {
    // Clean up on component unmount
    return () => {
      if (isRecording) {
        stopRecording(mediaRecorderRef.current);
        stopSpeechRecognition();
      }
    };
  }, [isRecording]);

  const toggleRecording = async () => {
    if (isProcessing) return;
    
    if (!isRecording) {
      try {
        setStatusMessage("Listening...");
        setTranscription("");
        
        // Start recording audio
        const recorder = await startRecording();
        mediaRecorderRef.current = recorder;
        
        // Start speech recognition
        startSpeechRecognition(
          (result) => {
            setTranscription(result);
          },
          (error) => {
            console.error("Speech recognition error:", error);
            setStatusMessage("Error recognizing speech. Try again.");
            handleStopRecording();
          }
        );
        
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
        setStatusMessage("Could not access microphone. Please check permissions.");
      }
    } else {
      handleStopRecording();
      
      if (transcription) {
        setStatusMessage("Processing...");
        onTranscription(transcription);
      } else {
        setStatusMessage("No speech detected. Try again.");
        setTimeout(() => {
          setStatusMessage("Ready");
        }, 2000);
      }
    }
  };
  
  const handleCancelRecording = () => {
    if (!isRecording) return;
    
    handleStopRecording();
    setStatusMessage("Cancelled");
    
    setTimeout(() => {
      setStatusMessage("Ready");
    }, 1500);
  };
  
  const handleStopRecording = () => {
    stopRecording(mediaRecorderRef.current);
    stopSpeechRecognition();
    setIsRecording(false);
  };
  
  if (futuristicStyle) {
    return (
      <div className="flex flex-col items-center relative">
        {/* Futuristic voice button */}
        <div className="relative">
          {/* Technical background */}
          <div className="absolute -left-4 -right-4 -top-4 -bottom-4 rounded-lg border border-primary/20 bg-black/60 backdrop-blur-sm opacity-80 z-0"></div>
          
          {/* Status text */}
          <div className="absolute -top-8 left-0 right-0 text-[10px] font-mono text-primary/70 flex justify-between">
            <span>MIC.ACTIVE</span>
            <span>{isProcessing ? "SYS.BUSY" : isRecording ? "REC.ON" : "READY"}</span>
          </div>
          
          {/* Tech lines */}
          <div className="absolute left-0 right-0 -top-2 h-px bg-primary/20"></div>
          <div className="absolute left-0 right-0 -bottom-2 h-px bg-primary/20"></div>
          
          {/* Scanning effect when recording */}
          <div className={`absolute inset-0 rounded-full overflow-hidden ${isRecording ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 z-10`}>
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-scan"></div>
          </div>
          
          {/* Voice button */}
          <button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`w-12 h-12 rounded-full transition-all duration-300 relative overflow-hidden z-20
                        ${isRecording 
                          ? 'bg-black border-2 border-primary/70 shadow-[0_0_15px_rgba(0,195,255,0.5)]' 
                          : 'bg-black border border-primary/40 hover:border-primary/70'}`}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/10 via-transparent to-transparent"></div>
            
            {isProcessing ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin relative z-30" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Mic className={`h-5 w-5 text-primary ${isRecording ? 'opacity-0' : 'opacity-100'} transition-opacity z-30`} />
                <div className={`h-2 w-2 bg-primary rounded-full ${isRecording ? 'opacity-100 animate-pulse' : 'opacity-0'} transition-opacity z-30`}></div>
              </div>
            )}
            
            {/* Inner circle decoration */}
            <div className="absolute inset-[3px] rounded-full border border-primary/30 z-20"></div>
          </button>
          
          {/* Ripple effects */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20
                          ${isRecording ? 'w-20 h-20 opacity-100' : 'w-12 h-12 opacity-0'} 
                          transition-all duration-1000 z-10`}></div>
          
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40
                          ${isRecording ? 'w-16 h-16 opacity-100' : 'w-12 h-12 opacity-0'} 
                          transition-all duration-700 z-10`}></div>
          
          {/* Technical markers */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <div 
              key={angle} 
              className={`absolute w-1 h-1 bg-primary/40 rounded-full transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-60'}`}
              style={{
                left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 14}px)`,
                top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 14}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
          ))}
        </div>
        
        {/* Transcription indicator (minimalist) */}
        {isRecording && transcription && (
          <div className="fixed bottom-24 right-10 max-w-xs bg-black/70 backdrop-blur-sm border border-primary/20 rounded px-3 py-1.5 text-xs text-white/80">
            <p className="line-clamp-2">{transcription}</p>
          </div>
        )}
      </div>
    );
  }
  
  // Original design (fallback)
  return (
    <div className="flex flex-col items-center space-y-3 mb-4 relative z-10">
      {/* Transcription display */}
      {isRecording && transcription && (
        <div className="w-full max-w-2xl mx-auto bg-card rounded-lg p-3 border border-border text-muted-foreground text-sm italic">
          <p>{transcription}</p>
        </div>
      )}

      {/* Status message */}
      <div className="text-sm text-muted-foreground">
        <p>{isProcessing ? "Processing request..." : statusMessage}</p>
      </div>

      {/* Recording button */}
      <div className="flex items-center justify-center relative">
        {/* Outer ring animation (when recording) */}
        <div 
          className={`absolute w-24 h-24 rounded-full border-4 border-red-500 
                    ${isRecording ? 'opacity-80 scale-110 animate-pulse' : 'opacity-0 scale-100'} 
                    transition-all duration-300`}
        ></div>
        
        {/* Button */}
        <Button 
          onClick={toggleRecording}
          disabled={isProcessing}
          size="icon"
          className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
            isRecording 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="h-7 w-7 text-white animate-spin" />
          ) : (
            <Mic className={`h-7 w-7 text-white ${isRecording ? 'hidden' : 'block'}`} />
          )}
          {isRecording && !isProcessing && (
            <span className="h-5 w-5 bg-white rounded-sm"></span>
          )}
        </Button>

        {/* Cancel button (appears when recording) */}
        <Button
          onClick={handleCancelRecording}
          size="icon"
          variant="secondary"
          className={`absolute -right-12 w-10 h-10 rounded-full 
                     ${isRecording ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
                     transition-all duration-300`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Processing indicator (appears when sending to webhook) */}
      {isProcessing && (
        <div className="fixed bottom-28 inset-x-0 flex justify-center items-center z-50">
          <div className="bg-card rounded-full px-4 py-2 shadow-lg border border-border flex items-center space-x-2">
            <div className="w-5 h-5 relative">
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
            <span className="text-sm text-card-foreground">Processing request...</span>
          </div>
        </div>
      )}
    </div>
  );
}
