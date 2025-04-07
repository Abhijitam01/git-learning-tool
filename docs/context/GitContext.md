# GitContext

## Overview

The GitContext provides state management and operations for the Git repository. It uses the reducer pattern to handle different Git operations and maintains the state of commits, branches, and repository status.

**File Location:** `client/src/context/GitContext.tsx`

## Context Interface

```typescript
interface GitContextType {
  state: GitState;                                 // Current Git repository state
  createCommit: (message: string) => void;         // Create a new commit
  createBranch: (name: string) => void;            // Create a new branch
  mergeBranch: (sourceBranch: string) => void;     // Merge a branch into current branch
  checkout: (target: string) => void;              // Switch to branch or commit
  revertCommit: (commitId: string) => void;        // Revert a specific commit
  createIssue: (title: string, description: string) => void; // Create issue (simulated)
  resetState: () => void;                          // Reset to initial state
  saveState: () => void;                           // Save state to storage
  loadState: () => void;                           // Load state from storage
}
```

## State Structure

```typescript
interface GitState {
  commits: Commit[];           // All commits in the repository
  branches: Branch[];          // All branches in the repository
  currentBranch: string;       // Name of active branch
  currentCommit: string | null; // ID of current commit
}

interface Commit {
  id: string;                  // Unique identifier
  message: string;             // Commit message
  timestamp: Date;             // When commit was created
  parentId: string | null;     // Parent commit ID or null for root
  branch: string;              // Branch name
  color?: string;              // For visualization
  x?: number;                  // For visualization
  y?: number;                  // For visualization
}

interface Branch {
  name: string;                // Branch name
  headCommitId: string | null; // Latest commit in branch
  color: string;               // Branch color for visualization
  isActive: boolean;           // Whether branch is active
}
```

## Actions

The context uses a reducer pattern with the following actions:

1. **CREATE_COMMIT** - Creates a new commit in the current branch
2. **CREATE_BRANCH** - Creates a new branch from the current position
3. **MERGE_BRANCH** - Merges a source branch into the current branch
4. **CHECKOUT** - Switches to a different branch or commit
5. **REVERT_COMMIT** - Creates a commit that undoes changes from another commit
6. **CREATE_ISSUE** - Logs an issue (simulated)
7. **RESET_STATE** - Resets to initial state
8. **LOAD_STATE** - Loads state from external source
9. **SET_ACTIVE_BRANCH** - Sets a branch as active

## Usage

```tsx
import { useGit } from '@/context/GitContext';

const MyComponent = () => {
  const { 
    state, 
    createCommit, 
    createBranch,
    checkout
  } = useGit();
  
  // Access current branch
  const currentBranch = state.currentBranch;
  
  // Create a new commit
  const handleCommit = () => {
    createCommit("Add new feature");
  };
  
  // Create a new branch
  const handleCreateBranch = () => {
    createBranch("feature-branch");
  };
  
  // Render component
};
```

## Persistence

The GitContext automatically persists state to localStorage when changes occur:

```typescript
useEffect(() => {
  const saveStateToStorage = () => {
    setItem('gitLearningToolState', JSON.stringify(state));
  };

  // Throttle saving to prevent excessive writes
  const timeoutId = setTimeout(saveStateToStorage, 500);
  
  return () => clearTimeout(timeoutId);
}, [state, setItem]);
```

It also provides methods to explicitly save and load state:

```typescript
const saveState = () => {
  setItem('gitLearningToolState', JSON.stringify(state));
};

const loadState = () => {
  const savedState = getItem('gitLearningToolState');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState) as GitState;
      dispatch({ type: 'LOAD_STATE', payload: parsedState });
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }
};
```

## Integration with Database

The context does not directly interact with the database. Instead, the server-side storage layer handles database operations through the API.

To add database integration:

1. Create API endpoints for saving/loading Git state
2. Add methods to the context to call these endpoints
3. Implement error handling for API failures
