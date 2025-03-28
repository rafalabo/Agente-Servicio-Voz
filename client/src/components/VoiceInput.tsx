import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { startRecording, stopRecording } from "@/lib/audioRecorder";
import { startSpeechRecognition, stopSpeechRecognition } from "@/lib/speechRecognition";
import { Mic, X, Loader2 } from "lucide-react";

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
}

export default function VoiceInput({ onTranscription, isProcessing }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [statusMessage, setStatusMessage] = useState("Press the button and speak");
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
          setStatusMessage("Press the button and speak");
        }, 2000);
      }
    }
  };
  
  const handleCancelRecording = () => {
    if (!isRecording) return;
    
    handleStopRecording();
    setStatusMessage("Cancelled");
    
    setTimeout(() => {
      setStatusMessage("Press the button and speak");
    }, 1500);
  };
  
  const handleStopRecording = () => {
    stopRecording(mediaRecorderRef.current);
    stopSpeechRecognition();
    setIsRecording(false);
  };
  
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
