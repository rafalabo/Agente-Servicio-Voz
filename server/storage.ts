import { messages, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  saveMessage(message: InsertMessage): Promise<Message>;
  getConversationHistory(limit?: number): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private currentId: number;

  constructor() {
    this.messages = new Map();
    this.currentId = 1;
  }

  async saveMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const timestamp = new Date();
    const message: Message = { ...insertMessage, id, timestamp };
    this.messages.set(id, message);
    return message;
  }

  async getConversationHistory(limit = 100): Promise<Message[]> {
    return Array.from(this.messages.values())
      .sort((a, b) => a.id - b.id)
      .slice(-limit);
  }
}

export const storage = new MemStorage();
