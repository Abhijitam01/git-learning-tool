import { pgTable, serial, text, timestamp, integer, jsonb, boolean, numeric } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  passwordHash: true,
  email: true,
});

// Git sessions table
export const gitSessions = pgTable("git_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  state: jsonb("state").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGitSessionSchema = createInsertSchema(gitSessions).pick({
  userId: true,
  state: true,
});

// Lesson progress table
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

export const insertLessonProgressSchema = createInsertSchema(lessonProgress).pick({
  userId: true,
  lessonId: true,
  currentStep: true,
  completed: true,
  progress: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGitSession = z.infer<typeof insertGitSessionSchema>;
export type GitSession = typeof gitSessions.$inferSelect;

export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type LessonProgress = typeof lessonProgress.$inferSelect;