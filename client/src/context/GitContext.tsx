import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GitState, Commit, Branch, GitBlockType, SerializedGitState } from '@/components/GitLearningTool/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Initial state for Git context
const initialState: GitState = {
  commits: [],
  branches: [
    { name: 'main', headCommitId: null, color: '#26A69A', isActive: true }
  ],
  currentBranch: 'main',
  currentCommit: null,
};

// Action types for the reducer
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

// Context interface
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

// Create the context
const GitContext = createContext<GitContextType | undefined>(undefined);

// Helper functions for the reducer
const getColorForBranch = () => {
  const colors = ['#7E57C2', '#42A5F5', '#FF9800', '#EC407A', '#66BB6A'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const findCommitById = (commits: Commit[], id: string): Commit | undefined => {
  return commits.find(commit => commit.id === id);
};

const findBranchByName = (branches: Branch[], name: string): Branch | undefined => {
  return branches.find(branch => branch.name === name);
};

// Git reducer function
const gitReducer = (state: GitState, action: GitAction): GitState => {
  switch (action.type) {
    case 'CREATE_COMMIT': {
      const { message } = action.payload;
      const currentBranch = findBranchByName(state.branches, state.currentBranch);
      
      if (!currentBranch) return state;
      
      const parentId = currentBranch.headCommitId;
      const newCommit: Commit = {
        id: uuidv4(),
        message,
        timestamp: new Date(),
        parentId,
        branch: currentBranch.name,
        color: currentBranch.color,
      };
      
      // Update branches with new head commit
      const updatedBranches = state.branches.map(branch => {
        if (branch.name === currentBranch.name) {
          return { ...branch, headCommitId: newCommit.id };
        }
        return branch;
      });
      
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
      if (state.branches.some(branch => branch.name === name)) {
        return state;
      }
      
      const currentBranch = findBranchByName(state.branches, state.currentBranch);
      if (!currentBranch) return state;
      
      // Create new branch from current commit
      const newBranch: Branch = {
        name,
        headCommitId: currentBranch.headCommitId,
        color: getColorForBranch(),
        isActive: true,
      };
      
      // Deactivate all other branches
      const updatedBranches = state.branches.map(branch => ({
        ...branch,
        isActive: false
      }));
      
      return {
        ...state,
        branches: [...updatedBranches, newBranch],
        currentBranch: name,
        currentCommit: newBranch.headCommitId,
      };
    }
    
    case 'MERGE_BRANCH': {
      const { sourceBranch } = action.payload;
      const currentBranch = findBranchByName(state.branches, state.currentBranch);
      const sourceB = findBranchByName(state.branches, sourceBranch);
      
      if (!currentBranch || !sourceB || !sourceB.headCommitId || !currentBranch.headCommitId) {
        return state;
      }
      
      const sourceCommit = findCommitById(state.commits, sourceB.headCommitId);
      if (!sourceCommit) return state;
      
      // Create merge commit
      const mergeCommit: Commit = {
        id: uuidv4(),
        message: `Merge branch '${sourceBranch}' into ${currentBranch.name}`,
        timestamp: new Date(),
        parentId: currentBranch.headCommitId,
        branch: currentBranch.name,
        color: currentBranch.color,
      };
      
      // Update current branch head
      const updatedBranches = state.branches.map(branch => {
        if (branch.name === currentBranch.name) {
          return { ...branch, headCommitId: mergeCommit.id };
        }
        return branch;
      });
      
      return {
        ...state,
        commits: [...state.commits, mergeCommit],
        branches: updatedBranches,
        currentCommit: mergeCommit.id,
      };
    }
    
    case 'CHECKOUT': {
      const { target } = action.payload;
      
      // Check if target is a branch name
      const targetBranch = findBranchByName(state.branches, target);
      if (targetBranch) {
        // Deactivate all branches and activate target branch
        const updatedBranches = state.branches.map(branch => ({
          ...branch,
          isActive: branch.name === target
        }));
        
        return {
          ...state,
          branches: updatedBranches,
          currentBranch: target,
          currentCommit: targetBranch.headCommitId,
        };
      }
      
      // Check if target is a commit id
      const targetCommit = findCommitById(state.commits, target);
      if (targetCommit) {
        return {
          ...state,
          currentCommit: target,
        };
      }
      
      return state;
    }
    
    case 'REVERT_COMMIT': {
      const { commitId } = action.payload;
      const currentBranch = findBranchByName(state.branches, state.currentBranch);
      
      if (!currentBranch || !currentBranch.headCommitId) return state;
      
      const commitToRevert = findCommitById(state.commits, commitId);
      if (!commitToRevert) return state;
      
      // Create revert commit
      const revertCommit: Commit = {
        id: uuidv4(),
        message: `Revert "${commitToRevert.message}"`,
        timestamp: new Date(),
        parentId: currentBranch.headCommitId,
        branch: currentBranch.name,
        color: currentBranch.color,
      };
      
      // Update branch head
      const updatedBranches = state.branches.map(branch => {
        if (branch.name === currentBranch.name) {
          return { ...branch, headCommitId: revertCommit.id };
        }
        return branch;
      });
      
      return {
        ...state,
        commits: [...state.commits, revertCommit],
        branches: updatedBranches,
        currentCommit: revertCommit.id,
      };
    }
    
    case 'CREATE_ISSUE': {
      // In a real application, this would create an issue in a Git service
      // For this educational tool, we'll just note it in the console
      console.log('Issue created:', action.payload);
      return state;
    }
    
    case 'RESET_STATE': {
      return initialState;
    }
    
    case 'LOAD_STATE': {
      return action.payload;
    }
    
    case 'SET_ACTIVE_BRANCH': {
      const { name } = action.payload;
      const branch = findBranchByName(state.branches, name);
      
      if (!branch) return state;
      
      const updatedBranches = state.branches.map(b => ({
        ...b,
        isActive: b.name === name
      }));
      
      return {
        ...state,
        branches: updatedBranches,
        currentBranch: name,
        currentCommit: branch.headCommitId,
      };
    }
    
    default:
      return state;
  }
};

// Provider component
export const GitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gitReducer, initialState);
  const { setItem, getItem } = useLocalStorage();

  // Persist state to localStorage when it changes
  useEffect(() => {
    const saveStateToStorage = () => {
      setItem('gitLearningToolState', JSON.stringify(state));
    };

    // Throttle saving to prevent excessive writes
    const timeoutId = setTimeout(saveStateToStorage, 500);
    
    return () => clearTimeout(timeoutId);
  }, [state, setItem]);

  // Actions
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
  };

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

  // Load saved state on initial render
  useEffect(() => {
    loadState();
  }, []);

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

  return <GitContext.Provider value={contextValue}>{children}</GitContext.Provider>;
};

// Custom hook to use the Git context
export const useGit = (): GitContextType => {
  const context = useContext(GitContext);
  if (context === undefined) {
    throw new Error('useGit must be used within a GitProvider');
  }
  return context;
};
