import { Express } from 'express';
import { Server } from 'http';
import { storage } from './storage';
import { insertUserSchema, insertGitSessionSchema, insertLessonProgressSchema } from '@shared/schema';

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const newUser = insertUserSchema.parse(req.body);
      const user = await storage.createUser(newUser);
      return res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(400).json({ error: 'Invalid user data' });
    }
  });

  // Git session routes
  app.get('/api/git-sessions', async (req, res) => {
    try {
      const sessions = await storage.getGitSessions();
      return res.json(sessions);
    } catch (error) {
      console.error('Error getting git sessions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/git-sessions/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }
    
    try {
      const session = await storage.getGitSession(id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      return res.json(session);
    } catch (error) {
      console.error('Error getting git session:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/git-sessions', async (req, res) => {
    try {
      const newSession = insertGitSessionSchema.parse(req.body);
      const session = await storage.createGitSession(newSession);
      return res.status(201).json(session);
    } catch (error) {
      console.error('Error creating git session:', error);
      return res.status(400).json({ error: 'Invalid session data' });
    }
  });

  app.patch('/api/git-sessions/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }
    
    try {
      const updateData = req.body;
      const updatedSession = await storage.updateGitSession(id, updateData);
      
      if (!updatedSession) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      return res.json(updatedSession);
    } catch (error) {
      console.error('Error updating git session:', error);
      return res.status(400).json({ error: 'Invalid update data' });
    }
  });

  // Lesson progress routes
  app.get('/api/lesson-progress', async (req, res) => {
    try {
      const progress = await storage.getLessonProgress();
      return res.json(progress);
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/lesson-progress/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    
    try {
      const progress = await storage.getLessonProgressByLessonId(lessonId);
      if (!progress) {
        return res.status(404).json({ error: 'Progress not found' });
      }
      
      return res.json(progress);
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/lesson-progress', async (req, res) => {
    try {
      const progressData = insertLessonProgressSchema.parse(req.body);
      const progress = await storage.upsertLessonProgress(progressData);
      return res.status(201).json(progress);
    } catch (error) {
      console.error('Error creating/updating lesson progress:', error);
      return res.status(400).json({ error: 'Invalid progress data' });
    }
  });

  return app;
}