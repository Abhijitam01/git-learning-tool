import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gitSessions, insertGitSessionSchema, insertLessonProgressSchema } from "../shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for Git Learning Tool

  // Get all Git sessions for a user
  app.get("/api/git-sessions", async (req, res) => {
    try {
      const sessions = await storage.getGitSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error getting git sessions:", error);
      res.status(500).json({ message: "Failed to get git sessions" });
    }
  });

  // Get a specific Git session
  app.get("/api/git-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      const session = await storage.getGitSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error getting git session:", error);
      res.status(500).json({ message: "Failed to get git session" });
    }
  });

  // Create a new Git session
  app.post("/api/git-sessions", async (req, res) => {
    try {
      const result = insertGitSessionSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid session data",
          errors: result.error.errors 
        });
      }
      
      const session = await storage.createGitSession(result.data);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating git session:", error);
      res.status(500).json({ message: "Failed to create git session" });
    }
  });

  // Update a Git session
  app.put("/api/git-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      const sessionSchema = z.object({
        name: z.string().optional(),
        data: z.any().optional(),
      });
      
      const result = sessionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid session data",
          errors: result.error.errors 
        });
      }
      
      const updatedSession = await storage.updateGitSession(id, result.data);
      if (!updatedSession) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(updatedSession);
    } catch (error) {
      console.error("Error updating git session:", error);
      res.status(500).json({ message: "Failed to update git session" });
    }
  });

  // Update or create lesson progress
  app.post("/api/lesson-progress", async (req, res) => {
    try {
      const result = insertLessonProgressSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid lesson progress data",
          errors: result.error.errors 
        });
      }
      
      const progress = await storage.upsertLessonProgress(result.data);
      res.status(201).json(progress);
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ message: "Failed to update lesson progress" });
    }
  });

  // Get all lesson progress for a user
  app.get("/api/lesson-progress", async (req, res) => {
    try {
      const progress = await storage.getLessonProgress();
      res.json(progress);
    } catch (error) {
      console.error("Error getting lesson progress:", error);
      res.status(500).json({ message: "Failed to get lesson progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
