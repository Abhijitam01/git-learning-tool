# Git Learning Tool Documentation

This document provides detailed information about each component and file in the Git Learning Tool application.

## Table of Contents

1. [Setup and Installation](#setup-and-installation)
2. [Project Overview](#project-overview)
3. [File Structure](#file-structure)
4. [Core Components](#core-components)
5. [Context Providers](#context-providers)
6. [Custom Hooks](#custom-hooks)
7. [Utility Functions](#utility-functions)
8. [Data Models](#data-models)
9. [Styling](#styling)
10. [Database Integration](#database-integration)
11. [Architecture & Data Flow](#architecture--data-flow)
12. [Troubleshooting](#troubleshooting)

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL database (if using database storage)
- Git installed on your machine

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/git-learning-tool.git
   cd git-learning-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database (optional)**
   
   If you want to use database storage instead of in-memory storage:
   
   - Create a PostgreSQL database
   - Set the `DATABASE_URL` environment variable to your PostgreSQL connection string
   - Run the database migration:
     ```bash
     npm run db:push
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   This will start the application on port 5000. Open `http://localhost:5000` in your browser to access the Git Learning Tool.

5. **Build for production (optional)**
   ```bash
   npm run build
   npm run start
   ```

### Configuration Options

- **Theme**: You can customize the application theme by editing the `theme.json` file
- **Database**: Toggle between in-memory and database storage in `server/storage.ts`
- **Lessons**: Customize lessons in `client/src/data/lessons.ts`

## Project Overview

The Git Learning Tool is a block-based, interactive visualization tool designed to help beginners learn Git concepts through hands-on practice. Users can drag and drop Git command blocks to perform operations like creating commits, branches, merges, and more, with instant visual feedback.

### Key Features

- Block-based Git operations with drag and drop functionality
- Interactive Git repository visualization
- Guided lessons with step-by-step instructions
- Progress tracking for each lesson
- MusicBlocks-style UI with vibrant colors and animations
- Persistent state with local storage and database support

## File Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GitLearningTool/    # Main components for the Git Learning Tool
│   │   │   │   ├── GitBlocks.tsx   # Block representation of Git commands
│   │   │   │   ├── GitToolbar.tsx  # Toolbar component with zoom controls
│   │   │   │   ├── GitVisualization.tsx  # Visual representation of Git repository
│   │   │   │   ├── HelpModal.tsx   # Help and documentation modal
│   │   │   │   ├── InstructionPanel.tsx  # Instructions for current step
│   │   │   │   ├── LessonCard.tsx  # Card component for lessons
│   │   │   │   └── types.ts        # TypeScript interfaces for Git operations
│   │   │   └── ui/                 # UI components from shadcn
│   │   ├── context/
│   │   │   ├── GitContext.tsx      # Context provider for Git state
│   │   │   └── LessonContext.tsx   # Context provider for lessons and progress
│   │   ├── data/
│   │   │   └── lessons.ts          # Predefined lessons data
│   │   ├── hooks/
│   │   │   ├── useDrag.ts          # Hook for drag-and-drop functionality
│   │   │   ├── useGitOperations.ts # Hook for Git operation forms
│   │   │   └── useLocalStorage.ts  # Hook for local storage operations
│   │   ├── lib/
│   │   │   ├── gitTreeRenderer.ts  # D3.js renderer for Git graph visualization
│   │   │   ├── queryClient.ts      # TanStack Query setup
│   │   │   └── utils.ts            # Utility functions
│   │   ├── pages/
│   │   │   ├── GitLearningTool.tsx # Main page component
│   │   │   └── not-found.tsx       # 404 page component
│   │   ├── App.tsx                 # Root component with providers
│   │   ├── index.css               # Global CSS styles
│   │   └── main.tsx                # Entry point
├── server/
│   ├── db.ts                       # Database connection
│   ├── index.ts                    # Express server setup
│   ├── routes.ts                   # API routes
│   ├── storage.ts                  # Storage interface
│   └── vite.ts                     # Vite server configuration
├── shared/
│   └── schema.ts                   # Shared database schema definitions
```

## Core Components

### GitBlocks.tsx

This component renders the available Git command blocks that users can interact with.

```typescript
interface GitBlocksProps {
  onBlockClick: (blockType: GitBlockType) => void;
}
```

The component defines different types of Git operations as blocks:
- Commit: Create a snapshot of changes
- Branch: Create a new branch
- Merge: Combine changes from different branches
- Checkout: Switch to different branch or commit
- Revert: Undo changes from a specific commit
- Issue: Create an issue for tracking tasks/bugs

Each block has a colorful header, inputs for required parameters, and animations for user interaction. When a block is clicked or dragged, it triggers the corresponding Git operation.

### GitVisualization.tsx

Renders the visual representation of the Git repository using D3.js.

```typescript
interface GitVisualizationProps {
  gitState: GitState;
  scale: number;
  onBlockDrop: (blockType: GitBlockType) => void;
}
```

Key features:
- Visualizes commits as hexagonal nodes
- Shows branches with different colors
- Renders connections between commits
- Handles zooming and panning
- Provides a drop zone for Git blocks

The visualization updates automatically when the Git state changes, showing new commits, branches, and relationships.

### GitToolbar.tsx

Provides controls for interacting with the Git visualization.

```typescript
interface GitToolbarProps {
  currentBranch: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}
```

Features:
- Zoom controls for the visualization
- Current branch indicator
- Dropdown menu for Git operations
- Grid and minimap toggles
- Snapshot button for saving the current view

### InstructionPanel.tsx

Displays instructions for the current lesson step.

```typescript
const InstructionPanel: React.FC = () => {
  // Implementation details
}
```

Features:
- Shows the current step title and description
- Provides hints for completing the step
- Includes navigation buttons for previous/next steps
- Shows progress indicators
- Displays completion status

### LessonCard.tsx

Represents individual lessons in the sidebar.

```typescript
interface LessonCardProps {
  lesson: Lesson;
  progress: LessonProgress;
  isActive: boolean;
  onClick: () => void;
}
```

Features:
- Shows lesson title
- Displays progress indicator
- Highlights active lesson
- Provides visual feedback on interaction

## Context Providers

### GitContext.tsx

Manages the state of the Git repository and provides operations to manipulate it.

```typescript
interface GitContextType {
  state: GitState;
  createCommit: (message: string) => void;
  createBranch: (name: string) => void;
  mergeBranch: (sourceBranch: string) => void;
  checkout: (target: string) => void;
  revertCommit: (commitId: string) => void;
  createIssue: (title: string, description: string) => void;
  resetState: () => void;
  saveState: () => void;
  loadState: () => void;
}
```

The context uses a reducer pattern to manage Git operations:
- CREATE_COMMIT: Creates a new commit in the current branch
- CREATE_BRANCH: Creates a new branch from the current position
- MERGE_BRANCH: Merges a source branch into the current branch
- CHECKOUT: Switches to a different branch or commit
- REVERT_COMMIT: Creates a commit that undoes changes from another commit
- CREATE_ISSUE: Logs an issue (simulated)
- RESET_STATE: Resets to initial state
- LOAD_STATE: Loads state from external source

State is automatically persisted to localStorage and can optionally be saved to a database.

### LessonContext.tsx

Manages the state of lessons and user progress.

```typescript
interface LessonContextType {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  lessonProgress: Record<string, LessonProgress>;
  setCurrentLesson: (lessonId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  checkStepCompletion: (gitState: GitState) => boolean;
  resetProgress: () => void;
}
```

Features:
- Tracks progress across multiple lessons
- Manages current lesson and step
- Verifies step completion based on Git state
- Persists progress to localStorage
- Provides navigation between steps and lessons

## Custom Hooks

### useDrag.ts

Provides drag-and-drop functionality for Git blocks.

```typescript
interface UseDragReturn {
  isDragging: boolean;
  dragType: GitBlockType | null;
  dragPosition: Position | null;
  handleDragStart: (e: DragEvent<HTMLDivElement>, blockType: GitBlockType) => void;
  handleDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => { blockType: GitBlockType, position: Position } | null;
}
```

This hook manages the state and events for dragging Git blocks onto the visualization area.

### useGitOperations.ts

Manages forms for Git operations.

```typescript
interface UseGitOperationsReturn {
  formState: FormState;
  openForm: (blockType: GitBlockType) => void;
  closeForm: () => void;
  handleInputChange: (name: string, value: string) => void;
  executeOperation: () => boolean;
}
```

This hook handles:
- Opening and closing operation forms
- Managing form inputs
- Executing Git operations based on form data
- Form state management

### useLocalStorage.ts

Provides an interface for interacting with localStorage.

```typescript
interface UseLocalStorageReturn {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}
```

Wraps localStorage methods in a React hook for easier use in components.

## Utility Functions

### gitTreeRenderer.ts

Renders the Git repository visualization using D3.js.

```typescript
export function renderGitTree(
  svgElement: SVGSVGElement,
  gitState: GitState,
  options: RenderOptions
): void
```

Key functions:
- assignPositions: Calculates positions for commits in the visualization
- drawConnections: Renders connections between commits
- drawNodes: Renders commit nodes with styled MusicBlocks design
- drawBranchLabels: Renders branch labels

### utils.ts

Contains utility functions used throughout the application.

```typescript
export function cn(...inputs: ClassValue[]): string
```

Provides utility functions for:
- Class name generation with Tailwind CSS
- Date formatting
- Object manipulation
- Color utilities

## Data Models

### types.ts

Defines the core data types used in the application.

```typescript
export interface Commit {
  id: string;
  message: string;
  timestamp: Date;
  parentId: string | null;
  branch: string;
  color?: string;
  x?: number;
  y?: number;
}

export interface Branch {
  name: string;
  headCommitId: string | null;
  color: string;
  isActive: boolean;
}

export interface GitState {
  commits: Commit[];
  branches: Branch[];
  currentBranch: string;
  currentCommit: string | null;
}

export type GitBlockType = 'commit' | 'branch' | 'merge' | 'checkout' | 'revert' | 'issue';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
  requirements?: string[];
}

export interface LessonStep {
  title: string;
  description: string;
  action: GitBlockType;
  actionDescription?: string;
  expectedResult?: (state: GitState) => boolean;
}

export interface LessonProgress {
  lessonId: string;
  currentStep: number;
  completed: boolean;
  totalSteps: number;
  progress: number;
}
```

These types form the foundation of the application's data structure.

### schema.ts

Defines the database schema for persistent storage.

```typescript
export const users = pgTable("users", {
  // User table schema
});

export const gitSessions = pgTable("git_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  state: jsonb("state").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

These schemas define the structure for PostgreSQL database tables.

## Styling

### index.css

Contains global styles and MusicBlocks-specific styling.

Key features:
- MusicBlocks-style color scheme and animations
- Custom animations for nodes and edges
- Responsive layout utilities
- Interactive effects for blocks and buttons

### theme.json

Defines the theme configuration for the application.

```json
{
  "variant": "vibrant",
  "primary": "hsl(207, 90%, 54%)",
  "appearance": "light",
  "radius": 0.75
}
```

This configuration is used by the shadcn UI components to maintain a consistent look.

## Database Integration

### storage.ts

Provides an interface for storing and retrieving data from the database.

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

The DatabaseStorage class implements this interface to provide PostgreSQL database access.

### db.ts

Sets up the database connection using Drizzle ORM.

```typescript
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

## Architecture & Data Flow

The application follows a unidirectional data flow pattern:

1. User interactions (click, drag) -> 
2. Context actions (GitContext, LessonContext) -> 
3. State updates -> 
4. Component re-renders -> 
5. Visual feedback to user

The main data flows are:

- **Git Operations Flow**:
  - User clicks/drags a Git block
  - Form opens for parameter input
  - Form data is passed to GitContext
  - GitContext updates the state
  - State changes trigger re-renders
  - gitTreeRenderer updates the visualization

- **Lesson Progression Flow**:
  - User selects a lesson from sidebar
  - LessonContext loads lesson data
  - Current step is displayed in instruction panel
  - User performs Git operations to complete step
  - LessonContext verifies completion
  - User advances to next step
  - Progress is saved to localStorage/database

## Troubleshooting

### Common Issues

1. **Circular Dependencies**:
   - Problem: Circular dependencies between GitContext and LessonContext
   - Solution: Ensure proper provider nesting in App.tsx with both providers at appropriate levels

2. **Ripple Effect Errors**:
   - Problem: Cannot read properties of null (reading 'contains')
   - Solution: Use proper reference handling in setTimeout callback for ripple effects

3. **Drag and Drop Issues**:
   - Problem: Drop events not registering
   - Solution: Ensure proper event handling and prevent default behaviors

4. **Visualization Rendering**:
   - Problem: Nodes not appearing or incorrectly positioned
   - Solution: Check D3.js rendering logic and ensure DOM elements are properly initialized

5. **State Persistence**:
   - Problem: State not saving or loading correctly
   - Solution: Verify localStorage/database operations and error handling