// Git Types
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

export interface Position {
  x: number;
  y: number;
}

// Drag and Drop Types
export interface DragState {
  isDragging: boolean;
  dragType: GitBlockType | null;
  position: Position | null;
}

export type GitBlockType = 'commit' | 'branch' | 'merge' | 'checkout' | 'revert' | 'issue';

export interface GitBlock {
  type: GitBlockType;
  label: string;
  icon: string;
  color: string;
  tooltip: string;
  inputs: {
    placeholder: string;
    name: string;
  }[];
}

// Lesson Types
export interface LessonStep {
  title: string;
  description: string;
  action: GitBlockType;
  actionDescription?: string;
  expectedResult?: (state: GitState) => boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
  requirements?: string[];
}

export interface LessonProgress {
  lessonId: string;
  currentStep: number;
  completed: boolean;
  totalSteps: number;
  progress: number;
}

// Serialized Git State for Storage
export interface SerializedGitState {
  commits: Commit[];
  branches: Branch[];
  currentBranch: string;
  currentCommit: string | null;
  lessonProgress: Record<string, LessonProgress>;
}
