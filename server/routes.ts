import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema } from "@shared/schema";
import { generateVoice } from "./services/elevenlabs";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate request
      const result = chatRequestSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request",
          errors: result.error.format() 
        });
      }

      const { message } = result.data;

      // Save user message
      await storage.saveMessage({
        content: message,
        isUserMessage: true
      });

      // In a real app, here you would call an external API or LLM service
      // For now, we'll create a simple response
      const response = `I received your message: "${message}". This is a demo response from Thomas.`;

      // Determine if we should generate voice
      const generateAudio = req.query.audio !== "false";
      let audioUrl: string | undefined;

      if (generateAudio) {
        try {
          // Generate voice response using ElevenLabs
          audioUrl = await generateVoice(response);
        } catch (error) {
          console.error("Error generating voice:", error);
          // Continue without audio if it fails
        }
      }

      // Save AI response
      await storage.saveMessage({
        content: response,
        isUserMessage: false,
        audioUrl
      });

      // Return the response
      return res.status(200).json({
        response,
        audioUrl
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get conversation history
  app.get("/api/history", async (req, res) => {
    try {
      const limitParam = req.query.limit;
      const limit = limitParam ? parseInt(limitParam as string, 10) : undefined;
      
      const history = await storage.getConversationHistory(limit);
      return res.status(200).json(history);
    } catch (error) {
      console.error("Error fetching history:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
