import { users, type User, type InsertUser, gitSessions, type GitSession, type InsertGitSession, lessonProgress, type LessonProgress, type InsertLessonProgress } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
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
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getGitSessions(): Promise<GitSession[]> {
    return db.select().from(gitSessions);
  }

  async getGitSession(id: number): Promise<GitSession | undefined> {
    const [session] = await db.select().from(gitSessions).where(eq(gitSessions.id, id));
    return session || undefined;
  }

  async createGitSession(insertSession: InsertGitSession): Promise<GitSession> {
    const [session] = await db
      .insert(gitSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateGitSession(
    id: number,
    updateSession: Partial<InsertGitSession>
  ): Promise<GitSession | undefined> {
    const [session] = await db
      .update(gitSessions)
      .set({
        ...updateSession,
        updatedAt: new Date(),
      })
      .where(eq(gitSessions.id, id))
      .returning();
    return session || undefined;
  }

  async getLessonProgress(): Promise<LessonProgress[]> {
    return db.select().from(lessonProgress);
  }

  async getLessonProgressByLessonId(lessonId: string): Promise<LessonProgress | undefined> {
    const [progress] = await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.lessonId, lessonId));
    return progress || undefined;
  }

  async upsertLessonProgress(insertProgress: InsertLessonProgress): Promise<LessonProgress> {
    const { lessonId, userId } = insertProgress;
    
    // Check if progress exists
    const existingProgress = await this.getLessonProgressByLessonId(lessonId);
    
    if (existingProgress) {
      // Update existing progress
      const [progress] = await db
        .update(lessonProgress)
        .set({
          ...insertProgress,
          updatedAt: new Date(),
        })
        .where(eq(lessonProgress.id, existingProgress.id))
        .returning();
      return progress;
    } else {
      // Create new progress
      const [progress] = await db
        .insert(lessonProgress)
        .values(insertProgress)
        .returning();
      return progress;
    }
  }
}

export const storage = new DatabaseStorage();