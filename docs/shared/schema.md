# Database Schema

## Overview

The `schema.ts` file defines the database schema for the Git Learning Tool application using Drizzle ORM. It includes tables for users, Git sessions, and lesson progress.

**File Location:** `shared/schema.ts`

## Tables

### Users Table

```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

Stores user account information:
- `id`: Unique identifier (auto-incrementing)
- `username`: User's unique username
- `passwordHash`: Hashed password for authentication
- `email`: User's email address
- `createdAt`: When the user account was created
- `updatedAt`: When the user account was last updated

### Git Sessions Table

```typescript
export const gitSessions = pgTable("git_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  state: jsonb("state").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

Stores Git repository states:
- `id`: Unique identifier (auto-incrementing)
- `userId`: Reference to the user who owns the session
- `state`: JSON representation of the Git repository state
- `createdAt`: When the session was created
- `updatedAt`: When the session was last updated

### Lesson Progress Table

```typescript
export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  lessonId: text("lesson_id").notNull(),
  currentStep: integer("current_step").default(1),
  completed: boolean("completed").default(false),
  progress: numeric("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

Tracks user progress through lessons:
- `id`: Unique identifier (auto-incrementing)
- `userId`: Reference to the user
- `lessonId`: Identifier for the lesson
- `currentStep`: Current step in the lesson (1-based index)
- `completed`: Whether the lesson is completed
- `progress`: Progress percentage (0-100)
- `createdAt`: When the progress record was created
- `updatedAt`: When the progress record was last updated

## Insert Schemas

The file also defines Zod schemas for inserting records:

```typescript
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  passwordHash: true,
  email: true,
});

export const insertGitSessionSchema = createInsertSchema(gitSessions).pick({
  userId: true,
  state: true,
});

export const insertLessonProgressSchema = createInsertSchema(lessonProgress).pick({
  userId: true,
  lessonId: true,
  currentStep: true,
  completed: true,
  progress: true,
});
```

These schemas:
1. Ensure type safety when inserting records
2. Allow for validation of input data
3. Exclude auto-generated fields

## Type Exports

The file exports TypeScript types for use throughout the application:

```typescript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGitSession = z.infer<typeof insertGitSessionSchema>;
export type GitSession = typeof gitSessions.$inferSelect;

export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type LessonProgress = typeof lessonProgress.$inferSelect;
```

These types provide:
1. Strong typing for database operations
2. Consistent interfaces between frontend and backend
3. Auto-completion and type checking in the IDE

## Usage Example

```typescript
import { db } from "@/server/db";
import { users, insertUserSchema, type InsertUser } from "@/shared/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

// Validate user input using the schema
const validateUser = (data: unknown): InsertUser => {
  return insertUserSchema.parse(data);
};

// Create a new user
const createUser = async (userData: Omit<InsertUser, "passwordHash"> & { password: string }): Promise<User> => {
  // Hash the password
  const passwordHash = await bcrypt.hash(userData.password, 10);
  
  // Insert the user
  const [user] = await db
    .insert(users)
    .values({
      username: userData.username,
      email: userData.email,
      passwordHash
    })
    .returning();
    
  return user;
};

// Get a user by username
const getUserByUsername = async (username: string): Promise<User | undefined> => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
    
  return user;
};
```

## Database Migrations

The schema is used with Drizzle Kit to generate and apply migrations:

1. **Generate Migration**:
   ```bash
   npm run db:generate
   ```
   
2. **Apply Migration**:
   ```bash
   npm run db:push
   ```

This ensures that the database structure matches the schema definition.
