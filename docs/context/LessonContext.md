# LessonContext

## Overview

The LessonContext manages the state of lessons and user progress in the Git Learning Tool. It provides functionality for navigating through lessons, tracking progress, and verifying the completion of lesson steps.

**File Location:** `client/src/context/LessonContext.tsx`

## Context Interface

```typescript
interface LessonContextType {
  lessons: Lesson[];                         // All available lessons
  currentLesson: Lesson | null;              // Currently active lesson
  lessonProgress: Record<string, LessonProgress>; // Progress for all lessons
  setCurrentLesson: (lessonId: string) => void;   // Set active lesson
  nextStep: () => void;                      // Move to next step in lesson
  previousStep: () => void;                  // Move to previous step in lesson
  checkStepCompletion: (gitState: GitState) => boolean; // Check if current step is complete
  resetProgress: () => void;                 // Reset all progress
}
```

## State Structure

```typescript
interface Lesson {
  id: string;                  // Unique identifier
  title: string;               // Lesson title
  description: string;         // Lesson description
  steps: LessonStep[];         // Steps to complete the lesson
  requirements?: string[];     // Prerequisites for the lesson
}

interface LessonStep {
  title: string;               // Step title
  description: string;         // Step instructions
  action: GitBlockType;        // Required Git action
  actionDescription?: string;  // Additional action details
  expectedResult?: (state: GitState) => boolean; // Verification function
}

interface LessonProgress {
  lessonId: string;            // Associated lesson
  currentStep: number;         // Current step index (1-based)
  completed: boolean;          // Whether lesson is completed
  totalSteps: number;          // Total number of steps
  progress: number;            // Progress percentage (0-100)
}
```

## Key Functionality

### Setting the Current Lesson

```typescript
const setCurrentLesson = (lessonId: string) => {
  const lesson = lessons.find(l => l.id === lessonId);
  if (lesson) {
    setCurrentLessonState(lesson);
  }
};
```

### Navigation Between Steps

```typescript
const nextStep = () => {
  if (!currentLesson) return;
  
  const currentProgress = lessonProgress[currentLesson.id];
  if (currentProgress.currentStep < currentProgress.totalSteps) {
    updateProgress(currentLesson.id, {
      ...currentProgress,
      currentStep: currentProgress.currentStep + 1,
      progress: ((currentProgress.currentStep) / currentProgress.totalSteps) * 100
    });
  } else {
    updateProgress(currentLesson.id, {
      ...currentProgress,
      completed: true,
      progress: 100
    });
  }
};

const previousStep = () => {
  if (!currentLesson) return;
  
  const currentProgress = lessonProgress[currentLesson.id];
  if (currentProgress.currentStep > 1) {
    updateProgress(currentLesson.id, {
      ...currentProgress,
      currentStep: currentProgress.currentStep - 1,
      progress: ((currentProgress.currentStep - 2) / currentProgress.totalSteps) * 100
    });
  }
};
```

### Checking Step Completion

```typescript
const checkStepCompletion = (gitState: GitState): boolean => {
  if (!currentLesson) return false;
  
  const currentProgress = lessonProgress[currentLesson.id];
  const currentStepIndex = currentProgress.currentStep - 1;
  
  if (currentStepIndex >= currentLesson.steps.length) return true;
  
  const step = currentLesson.steps[currentStepIndex];
  
  // If step has an expectedResult function, use it to verify
  if (step.expectedResult) {
    return step.expectedResult(gitState);
  }
  
  // Otherwise, assume the step is complete
  return true;
};
```

## Persistence

The LessonContext persists progress to localStorage:

```typescript
// Save progress to localStorage
useEffect(() => {
  setItem('lessonProgress', JSON.stringify(lessonProgress));
}, [lessonProgress, setItem]);

// Load progress from localStorage
useEffect(() => {
  const savedProgress = getItem('lessonProgress');
  if (savedProgress) {
    try {
      const parsed = JSON.parse(savedProgress);
      setLessonProgress(parsed);
    } catch (error) {
      console.error('Error parsing saved lesson progress:', error);
    }
  }
}, [getItem]);
```

## Usage

```tsx
import { useLesson } from '@/context/LessonContext';
import { useGit } from '@/context/GitContext';

const MyComponent = () => {
  const { 
    currentLesson, 
    lessonProgress,
    nextStep,
    checkStepCompletion
  } = useLesson();
  
  const { state } = useGit();
  
  // Check if current step is complete
  const isStepComplete = checkStepCompletion(state);
  
  // Get current step information
  const currentStep = currentLesson?.steps[
    lessonProgress[currentLesson.id].currentStep - 1
  ];
  
  // Handle next step button click
  const handleNextStep = () => {
    if (isStepComplete) {
      nextStep();
    } else {
      // Show error or hint
    }
  };
  
  // Render component
};
```

## Integration with Database

Similar to GitContext, LessonContext does not directly interact with the database. To add database integration:

1. Create API endpoints for saving/loading lesson progress
2. Add methods to the context to call these endpoints
3. Implement synchronization between local and server state
