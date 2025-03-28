import fs from "fs";
import path from "path";
import { apiRequest } from "../utils/api";

// ElevenLabs API integration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default voice

// A simple in-memory cache to avoid regenerating the same audio
const audioCache = new Map<string, string>();

/**
 * Generates voice audio from text using ElevenLabs API
 * @param text The text to convert to speech
 * @returns URL to the generated audio file
 */
export async function generateVoice(text: string): Promise<string> {
  // Simplistic caching based on text content
  const cacheKey = `${text}_${ELEVENLABS_VOICE_ID}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  try {
    // Create directory for audio files if it doesn't exist
    const audioDir = path.join(process.cwd(), "dist", "public", "audio");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Create a unique filename
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.mp3`;
    const filePath = path.join(audioDir, filename);
    
    // ElevenLabs API request
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Get the audio as arrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Save the file
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    
    // Return the URL to the audio file
    const audioUrl = `/audio/${filename}`;
    
    // Cache the result
    audioCache.set(cacheKey, audioUrl);
    
    return audioUrl;
  } catch (error) {
    console.error("Error generating voice with ElevenLabs:", error);
    throw error;
  }
}

// Utility function to clean up old audio files (optional, not used in this implementation)
export function cleanupOldAudioFiles(maxAgeMs = 24 * 60 * 60 * 1000): void {
  try {
    const audioDir = path.join(process.cwd(), "dist", "public", "audio");
    if (!fs.existsSync(audioDir)) return;
    
    const now = Date.now();
    const files = fs.readdirSync(audioDir);
    
    for (const file of files) {
      const filePath = path.join(audioDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > maxAgeMs) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error("Error cleaning up audio files:", error);
  }
}
