import { Lesson } from '@/context/LessonContext';
import { GitState } from '@/context/GitContext';

// Helper functions for checking lesson completion
const hasCommitWithMessage = (state: GitState, message: string): boolean => {
  return state.commits.some(commit => commit.message.toLowerCase().includes(message.toLowerCase()));
};

const hasBranch = (state: GitState, branchName: string): boolean => {
  return state.branches.some(branch => branch.name === branchName);
};

const hasMerged = (state: GitState, sourceBranch: string, targetBranch: string): boolean => {
  // Check if there's a merge commit that mentions both branches
  return state.commits.some(commit => 
    commit.message.includes(`Merge branch '${sourceBranch}'`) && 
    commit.message.includes(`into ${targetBranch}`)
  );
};

// Define the lessons
export const lessons: Lesson[] = [
  {
    id: 'git-basics',
    title: 'Git Basics',
    description: 'Learn the fundamental Git commands and concepts.',
    steps: [
      {
        title: 'Your First Commit',
        description: 'Create your first commit to start tracking your project. Use the "commit" block and enter "Initial commit" as the message.',
        action: 'commit',
        actionDescription: 'Create a commit with the message "Initial commit"',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Initial commit')
      },
      {
        title: 'Adding Documentation',
        description: 'Good projects have documentation. Create a commit that adds a README file.',
        action: 'commit',
        actionDescription: 'Create a commit with a message about adding README',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Add README file')
      },
      {
        title: 'Project Structure',
        description: 'Set up your project structure with folders and files. Create a commit to track these changes.',
        action: 'commit',
        actionDescription: 'Create a commit for adding project structure',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Add project structure')
      }
    ]
  },
  {
    id: 'branching-merging',
    title: 'Branching and Merging',
    description: 'Learn how to create branches, work on features separately, and merge changes.',
    steps: [
      {
        title: 'Create a Feature Branch',
        description: 'Create a new branch called "feature" to work on a new feature.',
        action: 'branch',
        actionDescription: 'Create a branch named "feature"',
        expectedResult: (state: GitState) => hasBranch(state, 'feature')
      },
      {
        title: 'Checkout the Feature Branch',
        description: 'Switch to the "feature" branch to start working on your feature.',
        action: 'checkout',
        actionDescription: 'Checkout the "feature" branch',
        expectedResult: (state: GitState) => {
          return state.currentBranch === 'feature';
        }
      },
      {
        title: 'Add Feature Commit',
        description: 'Add a commit for your new login feature while on the feature branch.',
        action: 'commit',
        actionDescription: 'Create a commit with a message about adding login functionality',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'login functionality')
      },
      {
        title: 'Switch Back to Main',
        description: 'Switch back to the main branch to prepare for merging.',
        action: 'checkout',
        actionDescription: 'Checkout the "main" branch',
        expectedResult: (state: GitState) => state.currentBranch === 'main'
      },
      {
        title: 'Merge the Feature',
        description: 'Merge the feature branch into the main branch to incorporate your changes.',
        action: 'merge',
        actionDescription: 'Merge the "feature" branch into "main"',
        expectedResult: (state: GitState) => hasMerged(state, 'feature', 'main')
      }
    ]
  },
  {
    id: 'advanced-git',
    title: 'Advanced Git Operations',
    description: 'Learn more advanced Git operations like reverting changes and creating tags.',
    steps: [
      {
        title: 'Important Milestone Commit',
        description: 'Create a commit for an important milestone in your project.',
        action: 'commit',
        actionDescription: 'Create a commit with "Important milestone" in the message',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Important milestone')
      },
      {
        title: 'Problem Commit',
        description: 'Oops! Create a commit that introduces a bug or problem.',
        action: 'commit',
        actionDescription: 'Create a commit with "Fix bug" in the message',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Fix bug')
      },
      {
        title: 'Revert the Problem',
        description: 'Revert the problematic commit to undo the changes.',
        action: 'revert',
        actionDescription: 'Revert the commit that introduced the bug',
        expectedResult: (state: GitState) => {
          return state.commits.some(c => c.message.includes('Revert'));
        }
      }
    ]
  }
];