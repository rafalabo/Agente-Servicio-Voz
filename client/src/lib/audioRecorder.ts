export async function startRecording(): Promise<MediaRecorder> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.start();
    
    return mediaRecorder;
  } catch (error) {
    console.error("Error accessing microphone:", error);
    throw new Error("Could not access microphone");
  }
}

export function stopRecording(mediaRecorder: MediaRecorder | null): void {
  if (!mediaRecorder) return;
  
  mediaRecorder.stop();
  
  // Stop all audio tracks
  mediaRecorder.stream.getTracks().forEach(track => track.stop());
}
