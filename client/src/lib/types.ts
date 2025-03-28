export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface ChatResponse {
  response: string;
  audioUrl?: string;
}
