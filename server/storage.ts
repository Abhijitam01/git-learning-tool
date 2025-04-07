import { users, type User, type InsertUser, GitSession, InsertGitSession, LessonProgress, InsertLessonProgress, gitSessions, lessonProgress } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Extended storage interface including Git Learning Tool methods
export interface IStorage {
  // User methods (from template)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Git Session methods
  getGitSessions(): Promise<GitSession[]>;
  getGitSession(id: number): Promise<GitSession | undefined>;
  createGitSession(session: InsertGitSession): Promise<GitSession>;
  updateGitSession(id: number, session: Partial<InsertGitSession>): Promise<GitSession | undefined>;

  // Lesson Progress methods
  getLessonProgress(): Promise<LessonProgress[]>;
  getLessonProgressByLessonId(lessonId: string): Promise<LessonProgress | undefined>;
  upsertLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Git Session methods
  async getGitSessions(): Promise<GitSession[]> {
    return await db.select().from(gitSessions);
  }

  async getGitSession(id: number): Promise<GitSession | undefined> {
    const [session] = await db.select().from(gitSessions).where(eq(gitSessions.id, id));
    return session;
  }

  async createGitSession(insertSession: InsertGitSession): Promise<GitSession> {
    const now = new Date();
    const [session] = await db.insert(gitSessions)
      .values({
        ...insertSession,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return session;
  }

  async updateGitSession(
    id: number,
    updateData: Partial<InsertGitSession>
  ): Promise<GitSession | undefined> {
    const [updatedSession] = await db.update(gitSessions)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(gitSessions.id, id))
      .returning();
    
    return updatedSession;
  }

  // Lesson Progress methods
  async getLessonProgress(): Promise<LessonProgress[]> {
    return await db.select().from(lessonProgress);
  }

  async getLessonProgressByLessonId(lessonId: string): Promise<LessonProgress | undefined> {
    const [progress] = await db.select()
      .from(lessonProgress)
      .where(eq(lessonProgress.lessonId, lessonId));
    
    return progress;
  }

  async upsertLessonProgress(insertProgress: InsertLessonProgress): Promise<LessonProgress> {
    // Check if there's existing progress for this lesson and user
    const existingProgress = await this.getLessonProgressByLessonId(insertProgress.lessonId);
    
    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db.update(lessonProgress)
        .set({
          ...insertProgress,
          updatedAt: new Date(),
          // If lesson is completed and completedAt is not set, set it now
          ...(insertProgress.completed && !existingProgress.completedAt 
              ? { completedAt: new Date() } 
              : {})
        })
        .where(eq(lessonProgress.id, existingProgress.id))
        .returning();
      
      return updatedProgress;
    } else {
      // Create new progress
      const now = new Date();
      const [newProgress] = await db.insert(lessonProgress)
        .values({
          ...insertProgress,
          createdAt: now,
          updatedAt: now,
          completedAt: insertProgress.completed ? now : undefined
        })
        .returning();
      
      return newProgress;
    }
  }
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
