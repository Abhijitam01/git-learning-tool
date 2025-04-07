# Git Learning Tool Documentation

## Overview

The Git Learning Tool is an interactive web application designed to help beginners learn Git concepts through a block-based visual interface. The tool simulates a Git repository and provides guided lessons on essential Git operations.

This application was developed as part of a Google Summer of Code (GSoC) project with Sugar Labs for integration into the MusicalBlocks GitHub repository.

![Git Learning Tool Screenshot](/attached_assets/Screenshot%202025-04-07%20031424.png)

## Features

- **Drag-and-Drop Git Blocks** - Execute Git commands by dragging blocks
- **Visual Git Repository** - See commits, branches, and merges in a visual graph
- **Interactive Lessons** - Step-by-step guides for learning Git concepts
- **Progress Tracking** - Save and track progress through lessons
- **MusicBlocks-Inspired UI** - Styled to match the MusicBlocks application

## Documentation Structure

### Core Components

- [**App Component**](/docs/components/App.md) - Main application entry point
- [**GitLearningTool Component**](/docs/pages/GitLearningTool.md) - Primary interface for the tool
- [**GitBlocks Component**](/docs/components/GitBlocks.md) - Draggable blocks for Git operations
- [**GitVisualization Component**](/docs/components/GitVisualization.md) - Visual representation of the Git repository

### Context Providers

- [**GitContext**](/docs/context/GitContext.md) - Manages Git repository state
- [**LessonContext**](/docs/context/LessonContext.md) - Manages lesson state and progress

### Hooks

- [**useGitOperations**](/docs/hooks/useGitOperations.md) - Hook for Git operation forms
- [**useDrag**](/docs/hooks/useDrag.md) - Hook for drag-and-drop functionality
- [**useLocalStorage**](/docs/hooks/useLocalStorage.md) - Hook for client-side storage

### Utilities

- [**gitTreeRenderer**](/docs/lib/gitTreeRenderer.md) - D3.js based Git tree visualization
- [**queryClient**](/docs/lib/queryClient.md) - API client for server communication

### Server Components

- [**Server Overview**](/docs/server/README.md) - Overview of server architecture
- [**Routes**](/docs/server/routes.md) - API endpoint definitions
- [**Storage**](/docs/server/storage.md) - Data storage implementation
- [**Database Schema**](/docs/shared/schema.md) - Database model definitions

### Integration Guides

- [**GitHub Integration**](/docs/GitHubIntegration.md) - Guide for GitHub API integration
- [**MusicBlocks Integration**](/docs/MusicBlocksIntegration.md) - Guide for MusicBlocks integration

## Architecture

The Git Learning Tool follows a client-server architecture:

```
┌─────────────────┐     ┌─────────────────┐      ┌──────────────────┐
│                 │     │                 │      │                  │
│  React Frontend │◄────┤  Express Server │◄─────┤ PostgreSQL       │
│  (SPA)          │     │  (API Backend)  │      │ Database         │
│                 │     │                 │      │                  │
└─────────────────┘     └─────────────────┘      └──────────────────┘
```

## Technical Stack

- **Frontend**
  - React
  - TypeScript
  - TanStack Query (React Query)
  - D3.js (visualization)
  - ShadCN UI (components)
  - Tailwind CSS (styling)

- **Backend**
  - Express.js
  - Node.js
  - Drizzle ORM
  - PostgreSQL

