import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lesson, LessonProgress, GitState } from '@/components/GitLearningTool/types';
import { lessons } from '@/data/lessons';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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

const initialLessonProgress: Record<string, LessonProgress> = {};

// Initialize progress for all lessons
lessons.forEach(lesson => {
  initialLessonProgress[lesson.id] = {
    lessonId: lesson.id,
    currentStep: 1,
    completed: false,
    totalSteps: lesson.steps.length,
    progress: 0,
  };
});

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>(initialLessonProgress);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const { setItem, getItem } = useLocalStorage();
  
  // Load progress from local storage
  useEffect(() => {
    const savedProgress = getItem('lessonProgress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress) as Record<string, LessonProgress>;
        setLessonProgress(parsedProgress);
      } catch (error) {
        console.error('Error loading lesson progress:', error);
      }
    }
  }, [getItem]);
  
  // Save progress to local storage whenever it changes
  useEffect(() => {
    setItem('lessonProgress', JSON.stringify(lessonProgress));
  }, [lessonProgress, setItem]);
  
  // Select a lesson to work on
  const handleSetCurrentLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
    }
  };
  
  // Move to the next step in the lesson
  const nextStep = () => {
    if (!currentLesson) return;
    
    const currentProgress = lessonProgress[currentLesson.id];
    if (currentProgress.currentStep < currentLesson.steps.length) {
      // Update progress for this lesson
      const newProgress = {
        ...currentProgress,
        currentStep: currentProgress.currentStep + 1,
        progress: (currentProgress.currentStep + 1) / currentLesson.steps.length,
      };
      
      // Check if this completes the lesson
      if (newProgress.currentStep === currentLesson.steps.length) {
        newProgress.completed = true;
      }
      
      setLessonProgress({
        ...lessonProgress,
        [currentLesson.id]: newProgress,
      });
    }
  };
  
  // Move to the previous step in the lesson
  const previousStep = () => {
    if (!currentLesson) return;
    
    const currentProgress = lessonProgress[currentLesson.id];
    if (currentProgress.currentStep > 1) {
      const newProgress = {
        ...currentProgress,
        currentStep: currentProgress.currentStep - 1,
        progress: (currentProgress.currentStep - 1) / currentLesson.steps.length,
      };
      
      setLessonProgress({
        ...lessonProgress,
        [currentLesson.id]: newProgress,
      });
    }
  };
  
  // Check if the current step has been completed
  const checkStepCompletion = (gitState: GitState): boolean => {
    if (!currentLesson) return false;
    
    const progress = lessonProgress[currentLesson.id];
    const currentStep = currentLesson.steps[progress.currentStep - 1];
    
    // If the step has an expectedResult function, use it to check completion
    if (currentStep.expectedResult) {
      return currentStep.expectedResult(gitState);
    }
    
    // Otherwise, just return true (user can advance manually)
    return true;
  };
  
  // Reset all lesson progress
  const resetProgress = () => {
    setLessonProgress(initialLessonProgress);
    setCurrentLesson(null);
  };
  
  const contextValue: LessonContextType = {
    lessons,
    currentLesson,
    lessonProgress,
    setCurrentLesson: handleSetCurrentLesson,
    nextStep,
    previousStep,
    checkStepCompletion,
    resetProgress,
  };
  
  return <LessonContext.Provider value={contextValue}>{children}</LessonContext.Provider>;
};

// Custom hook to use the lesson context
export const useLesson = (): LessonContextType => {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error('useLesson must be used within a LessonProvider');
  }
  return context;
};
