# Storage Implementation

## Overview

The `storage.ts` file implements the data access layer for the Git Learning Tool application. It provides a consistent interface for performing CRUD operations on the application data, regardless of the underlying storage mechanism.

**File Location:** `server/storage.ts`

## Storage Interface

```typescript
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
```

This interface defines methods for:
1. **User Management** - Creating and retrieving user accounts
2. **Git Session Management** - Storing and retrieving Git repository states
3. **Lesson Progress Tracking** - Monitoring user progress through lessons

## Database Storage Implementation

The `DatabaseStorage` class implements the `IStorage` interface using PostgreSQL with Drizzle ORM:

```typescript
export class DatabaseStorage implements IStorage {
  // User methods
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

  // Git Session methods
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

  // Lesson Progress methods
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
```

## Usage Example

```typescript
import { storage } from "@/server/storage";
import { insertUserSchema } from "@/shared/schema";
import express from "express";

const router = express.Router();

// Get user by ID
router.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  
  try {
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new user
router.post("/users", async (req, res) => {
  try {
    // Validate request body
    const newUser = insertUserSchema.parse(req.body);
    
    // Create user
    const user = await storage.createUser(newUser);
    
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(400).json({ error: "Invalid user data" });
  }
});
```

## Migration from In-Memory Storage

The application initially used in-memory storage for simplicity during development:

```typescript
// Previous in-memory implementation (now replaced)
export class MemStorage implements IStorage {
  private users: User[] = [];
  private sessions: GitSession[] = [];
  private progress: LessonProgress[] = [];
  
  // Implementation of IStorage methods using in-memory arrays
}
```

The migration to database storage provides:
1. **Persistence** - Data survives server restarts
2. **Scalability** - Can handle larger data volumes
3. **Concurrency** - Better handling of multiple users
4. **Transactions** - ACID-compliant operations
5. **Backup** - Standard database backup procedures

## Storage Instance Export

The file exports a singleton instance of the storage implementation:

```typescript
export const storage = new DatabaseStorage();
```

This ensures that the same storage instance is used throughout the application.
