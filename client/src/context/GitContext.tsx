import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define Git state types
export interface Commit {
  id: string;
  message: string;
  timestamp: Date;
  parentId: string | null;
  x?: number;
  y?: number;
  color?: string;
  branch: string;
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

const initialState: GitState = {
  commits: [],
  branches: [
    {
      name: 'main',
      headCommitId: null,
      color: '#2196F3',
      isActive: true,
    },
  ],
  currentBranch: 'main',
  currentCommit: null,
};

// Define action types
type GitAction =
  | { type: 'CREATE_COMMIT'; payload: { message: string } }
  | { type: 'CREATE_BRANCH'; payload: { name: string } }
  | { type: 'MERGE_BRANCH'; payload: { sourceBranch: string } }
  | { type: 'CHECKOUT'; payload: { target: string } }
  | { type: 'REVERT_COMMIT'; payload: { commitId: string } }
  | { type: 'CREATE_ISSUE'; payload: { title: string; description: string } }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_STATE'; payload: GitState }
  | { type: 'SET_ACTIVE_BRANCH'; payload: { name: string } };

// Define context type
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

// Create context
const GitContext = createContext<GitContextType | undefined>(undefined);

// Create reducer
const gitReducer = (state: GitState, action: GitAction): GitState => {
  switch (action.type) {
    case 'CREATE_COMMIT': {
      const { message } = action.payload;
      const activeBranch = state.branches.find(b => b.name === state.currentBranch)!;
      
      const newCommit: Commit = {
        id: uuidv4(),
        message,
        timestamp: new Date(),
        parentId: activeBranch.headCommitId,
        branch: activeBranch.name,
      };
      
      const updatedBranches = state.branches.map(branch => 
        branch.name === activeBranch.name 
          ? { ...branch, headCommitId: newCommit.id }
          : branch
      );
      
      return {
        ...state,
        commits: [...state.commits, newCommit],
        branches: updatedBranches,
        currentCommit: newCommit.id,
      };
    }
    
    case 'CREATE_BRANCH': {
      const { name } = action.payload;
      
      // Check if branch already exists
      if (state.branches.some(b => b.name === name)) {
        throw new Error(`Branch "${name}" already exists`);
      }
      
      const activeBranch = state.branches.find(b => b.name === state.currentBranch)!;
      
      // Generate a random color (exclude colors similar to existing branches)
      const existingColors = state.branches.map(b => b.color);
      let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      while (existingColors.includes(color)) {
        color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      }
      
      const newBranch: Branch = {
        name,
        headCommitId: activeBranch.headCommitId,
        color,
        isActive: false,
      };
      
      return {
        ...state,
        branches: [...state.branches, newBranch],
      };
    }
    
    case 'MERGE_BRANCH': {
      const { sourceBranch } = action.payload;
      
      // Find source and target branches
      const targetBranch = state.branches.find(b => b.name === state.currentBranch)!;
      const source = state.branches.find(b => b.name === sourceBranch);
      
      if (!source) {
        throw new Error(`Branch "${sourceBranch}" does not exist`);
      }
      
      if (!source.headCommitId) {
        throw new Error(`Branch "${sourceBranch}" has no commits`);
      }
      
      // Create a merge commit
      const mergeCommit: Commit = {
        id: uuidv4(),
        message: `Merge branch '${sourceBranch}' into ${state.currentBranch}`,
        timestamp: new Date(),
        parentId: targetBranch.headCommitId,
        branch: targetBranch.name,
      };
      
      // Update branches
      const updatedBranches = state.branches.map(branch => 
        branch.name === targetBranch.name 
          ? { ...branch, headCommitId: mergeCommit.id }
          : branch
      );
      
      return {
        ...state,
        commits: [...state.commits, mergeCommit],
        branches: updatedBranches,
        currentCommit: mergeCommit.id,
      };
    }
    
    case 'CHECKOUT': {
      const { target } = action.payload;
      
      // Check if target is a branch
      const isBranch = state.branches.some(b => b.name === target);
      
      if (isBranch) {
        // Update active branch
        const updatedBranches = state.branches.map(branch => ({
          ...branch,
          isActive: branch.name === target,
        }));
        
        // Find the branch
        const targetBranch = state.branches.find(b => b.name === target)!;
        
        return {
          ...state,
          branches: updatedBranches,
          currentBranch: target,
          currentCommit: targetBranch.headCommitId,
        };
      } else {
        // Assume target is a commit ID
        const targetCommit = state.commits.find(c => c.id === target);
        
        if (!targetCommit) {
          throw new Error(`Commit "${target}" does not exist`);
        }
        
        return {
          ...state,
          currentCommit: target,
        };
      }
    }
    
    case 'REVERT_COMMIT': {
      const { commitId } = action.payload;
      
      // Find the commit to revert
      const commitToRevert = state.commits.find(c => c.id === commitId);
      
      if (!commitToRevert) {
        throw new Error(`Commit "${commitId}" does not exist`);
      }
      
      // Create a revert commit
      const activeBranch = state.branches.find(b => b.name === state.currentBranch)!;
      
      const revertCommit: Commit = {
        id: uuidv4(),
        message: `Revert "${commitToRevert.message}"`,
        timestamp: new Date(),
        parentId: activeBranch.headCommitId,
        branch: activeBranch.name,
      };
      
      // Update branches
      const updatedBranches = state.branches.map(branch => 
        branch.name === activeBranch.name 
          ? { ...branch, headCommitId: revertCommit.id }
          : branch
      );
      
      return {
        ...state,
        commits: [...state.commits, revertCommit],
        branches: updatedBranches,
        currentCommit: revertCommit.id,
      };
    }
    
    case 'CREATE_ISSUE': {
      const { title, description } = action.payload;
      
      // Create an issue as a special type of commit
      const activeBranch = state.branches.find(b => b.name === state.currentBranch)!;
      
      const issueCommit: Commit = {
        id: uuidv4(),
        message: `Issue: ${title}\n${description}`,
        timestamp: new Date(),
        parentId: activeBranch.headCommitId,
        branch: activeBranch.name,
      };
      
      // Update branches
      const updatedBranches = state.branches.map(branch => 
        branch.name === activeBranch.name 
          ? { ...branch, headCommitId: issueCommit.id }
          : branch
      );
      
      return {
        ...state,
        commits: [...state.commits, issueCommit],
        branches: updatedBranches,
        currentCommit: issueCommit.id,
      };
    }
    
    case 'RESET_STATE':
      return initialState;
    
    case 'LOAD_STATE':
      return action.payload;
    
    case 'SET_ACTIVE_BRANCH': {
      const { name } = action.payload;
      
      const updatedBranches = state.branches.map(branch => ({
        ...branch,
        isActive: branch.name === name,
      }));
      
      return {
        ...state,
        branches: updatedBranches,
        currentBranch: name,
      };
    }
    
    default:
      return state;
  }
};

// Create provider
export const GitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gitReducer, initialState);
  
  // Load state from localStorage on init
  useEffect(() => {
    loadState();
  }, []);
  
  const createCommit = (message: string) => {
    dispatch({ type: 'CREATE_COMMIT', payload: { message } });
  };
  
  const createBranch = (name: string) => {
    dispatch({ type: 'CREATE_BRANCH', payload: { name } });
  };
  
  const mergeBranch = (sourceBranch: string) => {
    dispatch({ type: 'MERGE_BRANCH', payload: { sourceBranch } });
  };
  
  const checkout = (target: string) => {
    dispatch({ type: 'CHECKOUT', payload: { target } });
  };
  
  const revertCommit = (commitId: string) => {
    dispatch({ type: 'REVERT_COMMIT', payload: { commitId } });
  };
  
  const createIssue = (title: string, description: string) => {
    dispatch({ type: 'CREATE_ISSUE', payload: { title, description } });
  };
  
  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
    localStorage.removeItem('gitState');
  };
  
  const saveState = () => {
    localStorage.setItem('gitState', JSON.stringify(state));
  };
  
  const loadState = () => {
    const savedState = localStorage.getItem('gitState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      
      // Convert string dates back to Date objects
      const fixedState = {
        ...parsedState,
        commits: parsedState.commits.map((commit: any) => ({
          ...commit,
          timestamp: new Date(commit.timestamp),
        })),
      };
      
      dispatch({ type: 'LOAD_STATE', payload: fixedState });
    }
  };
  
  const contextValue: GitContextType = {
    state,
    createCommit,
    createBranch,
    mergeBranch,
    checkout,
    revertCommit,
    createIssue,
    resetState,
    saveState,
    loadState,
  };
  
  return (
    <GitContext.Provider value={contextValue}>
      {children}
    </GitContext.Provider>
  );
};

// Create hook for using the context
export const useGit = (): GitContextType => {
  const context = useContext(GitContext);
  if (!context) {
    throw new Error('useGit must be used within a GitProvider');
  }
  return context;
};