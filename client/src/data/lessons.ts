import { Lesson, GitState } from '@/components/GitLearningTool/types';

// Helper function to check if a commit with the given message exists
const hasCommitWithMessage = (state: GitState, message: string): boolean => {
  return state.commits.some(commit => commit.message.includes(message));
};

// Helper function to check if a branch exists
const hasBranch = (state: GitState, branchName: string): boolean => {
  return state.branches.some(branch => branch.name === branchName);
};

// Helper function to check if two branches have been merged
const hasMerged = (state: GitState, sourceBranch: string, targetBranch: string): boolean => {
  return state.commits.some(commit => 
    commit.message.includes(`Merge branch '${sourceBranch}'`) && 
    commit.branch === targetBranch
  );
};

export const lessons: Lesson[] = [
  {
    id: 'intro-to-git',
    title: '1. Intro to Git',
    description: 'Learn the basics of Git and understand its core concepts',
    steps: [
      {
        title: 'Welcome to Git',
        description: 'Git is a distributed version control system that helps track changes in your code.',
        action: 'commit',
        actionDescription: 'Let\'s start by making your first commit. Drag the commit block from the toolbox to the workspace.'
      },
      {
        title: 'Your First Commit',
        description: 'A commit is a snapshot of your code at a specific point in time.',
        action: 'commit',
        actionDescription: 'Create a commit with the message "Initial commit"',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Initial commit')
      },
      {
        title: 'Understanding the Git Graph',
        description: 'Each circle in the graph represents a commit. The lines show how commits are connected.',
        action: 'commit',
        actionDescription: 'Make another commit with the message "Add README file"',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Add README file')
      }
    ]
  },
  {
    id: 'creating-commits',
    title: '2. Creating Commits',
    description: 'Learn how to make changes and commit them to your repository',
    steps: [
      {
        title: 'Making Multiple Commits',
        description: 'Projects grow through a series of commits that build on each other.',
        action: 'commit',
        actionDescription: 'Create a new commit with the message "Add project structure"',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Add project structure')
      },
      {
        title: 'Commit Messages',
        description: 'Good commit messages explain what changes were made and why.',
        action: 'commit',
        actionDescription: 'Create a commit with a detailed message like "Implement login functionality"',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'login functionality')
      },
      {
        title: 'Viewing Commit History',
        description: 'The Git graph shows the history of your project through commits.',
        action: 'commit',
        actionDescription: 'Add one final commit to this lesson with the message "Fix bug in login form"',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Fix bug')
      }
    ]
  },
  {
    id: 'branching-merging',
    title: '3. Branching & Merging',
    description: 'Learn how to work on features in parallel using branches',
    steps: [
      {
        title: 'Creating a Branch',
        description: 'Branches allow you to work on different features without affecting the main codebase.',
        action: 'branch',
        actionDescription: 'Create a new branch called "feature"',
        expectedResult: (state: GitState) => hasBranch(state, 'feature')
      },
      {
        title: 'Working on a Branch',
        description: 'Each branch can have its own commits that don\'t affect other branches.',
        action: 'commit',
        actionDescription: 'Add a commit to the feature branch with the message "Add new feature"',
        expectedResult: (state: GitState) => {
          const onFeatureBranch = state.currentBranch === 'feature';
          const hasFeatureCommit = hasCommitWithMessage(state, 'Add new feature');
          return onFeatureBranch && hasFeatureCommit;
        }
      },
      {
        title: 'Merging Branches',
        description: 'Merging combines changes from one branch into another.',
        action: 'checkout',
        actionDescription: 'First, checkout the main branch',
        expectedResult: (state: GitState) => state.currentBranch === 'main'
      },
      {
        title: 'Completing the Merge',
        description: 'When you merge, all commits from the source branch become part of the target branch.',
        action: 'merge',
        actionDescription: 'Now merge the "feature" branch into "main"',
        expectedResult: (state: GitState) => hasMerged(state, 'feature', 'main')
      }
    ]
  },
  {
    id: 'advanced-git',
    title: '4. Advanced Git',
    description: 'Learn advanced Git operations like checkout and revert',
    steps: [
      {
        title: 'Checking Out Commits',
        description: 'You can checkout any commit to view your code at that point in time.',
        action: 'commit',
        actionDescription: 'First, let\'s create a commit to checkout later with the message "Important milestone"',
        expectedResult: (state: GitState) => hasCommitWithMessage(state, 'Important milestone')
      },
      {
        title: 'Finding Commit IDs',
        description: 'Each commit has a unique ID that you can use to reference it.',
        action: 'checkout',
        actionDescription: 'Checkout the commit you just created using its ID',
        expectedResult: (state: GitState) => {
          const milestone = state.commits.find(c => c.message.includes('Important milestone'));
          return milestone ? state.currentCommit === milestone.id : false;
        }
      },
      {
        title: 'Reverting Changes',
        description: 'Reverting creates a new commit that undoes the changes from a previous commit.',
        action: 'revert',
        actionDescription: 'Try reverting a commit to see how it works',
        expectedResult: (state: GitState) => state.commits.some(c => c.message.includes('Revert'))
      }
    ]
  }
];
