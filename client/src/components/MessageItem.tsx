import { useEffect, useRef } from "react";
import { Message } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (message.type === "ai" && message.audioUrl && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
      });
    }
  }, [message.audioUrl, message.type]);

  if (message.type === "user") {
    return (
      <div className="flex items-start justify-end space-x-2 animate-fade-in">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg rounded-tr-none p-3 max-w-4xl shadow-md">
          <p className="text-white">{message.content}</p>
          <div className="mt-1 flex items-center justify-end">
            <span className="text-xs text-primary-200">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
          <i className="fas fa-user text-gray-300 text-xs"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-2 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-indigo-600 flex items-center justify-center shrink-0">
        <i className="fas fa-robot text-white text-xs"></i>
      </div>
      <div className="bg-card rounded-lg rounded-tl-none p-3 max-w-4xl shadow-md border border-border">
        <p className="text-card-foreground">{message.content}</p>
        <div className="mt-1 flex items-center justify-end">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
        {message.audioUrl && (
          <audio ref={audioRef} src={message.audioUrl} className="hidden" />
        )}
      </div>
    </div>
  );
}
