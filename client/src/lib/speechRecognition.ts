// Define TypeScript interfaces for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Define the SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

// Get the appropriate constructor for SpeechRecognition
const SpeechRecognitionAPI = window.SpeechRecognition || 
                            (window as any).webkitSpeechRecognition;

// Global recognition instance
let recognition: SpeechRecognition | null = null;

export function startSpeechRecognition(
  onResult: (transcript: string) => void,
  onError: (error: Event) => void
): void {
  if (!SpeechRecognitionAPI) {
    console.error("Speech recognition not supported in this browser");
    onError(new Event("Speech recognition not supported"));
    return;
  }

  // Create a new recognition instance
  recognition = new SpeechRecognitionAPI();
  
  // Configure recognition
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US"; // Default to English - this could be made configurable
  
  // Set up the result handler
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(" ");
    
    onResult(transcript);
  };
  
  // Set up error handler
  recognition.onerror = (event) => {
    onError(event);
  };
  
  // Start recognition
  recognition.start();
}

export function stopSpeechRecognition(): void {
  if (!recognition) return;
  
  recognition.stop();
  recognition = null;
}
