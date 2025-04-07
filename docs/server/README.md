# Server Documentation

This directory contains documentation for the server-side components of the Git Learning Tool application.

## Overview

The server component of the Git Learning Tool handles:
1. API endpoints for data persistence
2. Database operations through Drizzle ORM
3. Static file serving for the client application
4. Session management and authentication

## Key Files

1. [index.ts](index.md) - Entry point for the Express server
2. [routes.ts](routes.md) - API route definitions
3. [storage.ts](storage.md) - Storage interface and implementation
4. [db.ts](db.md) - Database connection setup
5. [vite.ts](vite.md) - Vite development server integration

## Architecture

The server follows a layered architecture:

```
Client <-> Express Server <-> Storage Layer <-> Database
```

1. **Express Server** - Handles HTTP requests and responses
2. **Routes** - Define API endpoints and validate input
3. **Storage Layer** - Implements data access operations
4. **Database** - PostgreSQL database with Drizzle ORM

## API Endpoints

The server provides the following API endpoints:

1. **User Management**
   - `GET /api/users/:id` - Get user by ID
   - `POST /api/users` - Create a new user

2. **Git Session Management**
   - `GET /api/git-sessions` - Get all Git sessions
   - `GET /api/git-sessions/:id` - Get Git session by ID
   - `POST /api/git-sessions` - Create a new Git session
   - `PATCH /api/git-sessions/:id` - Update a Git session

3. **Lesson Progress**
   - `GET /api/lesson-progress` - Get all lesson progress
   - `GET /api/lesson-progress/:lessonId` - Get progress for a specific lesson
   - `POST /api/lesson-progress` - Create or update lesson progress

## Database Integration

The server uses PostgreSQL with Drizzle ORM for database operations:

1. **Connection Setup** - Configured in `db.ts`
2. **Schema Definition** - Defined in `shared/schema.ts`
3. **Query Operations** - Implemented in `storage.ts`
4. **Migrations** - Managed through Drizzle Kit

## Authentication

The application uses a simple authentication system:

1. **User Registration** - Create a new user account
2. **User Login** - Authenticate with username and password
3. **Session Management** - Track authenticated sessions
