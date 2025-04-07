import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGit, GitState } from './GitContext';
import { lessons } from '@/data/lessons';

// Define types
export interface LessonStep {
  title: string;
  description: string;
  action: string;
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

// Create context
const LessonContext = createContext<LessonContextType | undefined>(undefined);

// Create provider
export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: gitState } = useGit();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  
  // Initialize lesson progress
  useEffect(() => {
    const savedProgress = localStorage.getItem('lessonProgress');
    
    if (savedProgress) {
      setLessonProgress(JSON.parse(savedProgress));
    } else {
      // Initialize progress for all lessons
      const initialProgress: Record<string, LessonProgress> = {};
      
      lessons.forEach(lesson => {
        initialProgress[lesson.id] = {
          lessonId: lesson.id,
          currentStep: 1,
          completed: false,
          totalSteps: lesson.steps.length,
          progress: 0,
        };
      });
      
      setLessonProgress(initialProgress);
    }
  }, []);
  
  // Save progress whenever it changes
  useEffect(() => {
    if (Object.keys(lessonProgress).length > 0) {
      localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
    }
  }, [lessonProgress]);
  
  const setCurrentLessonById = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
    }
  };
  
  const nextStep = () => {
    if (!currentLesson) return;
    
    const progress = lessonProgress[currentLesson.id];
    
    if (progress.currentStep < currentLesson.steps.length) {
      // Move to next step
      const newStep = progress.currentStep + 1;
      const newProgress = Math.round((newStep / currentLesson.steps.length) * 100);
      
      setLessonProgress({
        ...lessonProgress,
        [currentLesson.id]: {
          ...progress,
          currentStep: newStep,
          progress: newProgress,
          completed: newStep === currentLesson.steps.length,
        },
      });
    }
  };
  
  const previousStep = () => {
    if (!currentLesson) return;
    
    const progress = lessonProgress[currentLesson.id];
    
    if (progress.currentStep > 1) {
      // Move to previous step
      const newStep = progress.currentStep - 1;
      const newProgress = Math.round((newStep / currentLesson.steps.length) * 100);
      
      setLessonProgress({
        ...lessonProgress,
        [currentLesson.id]: {
          ...progress,
          currentStep: newStep,
          progress: newProgress,
          completed: false,
        },
      });
    }
  };
  
  const checkStepCompletion = (gitState: GitState): boolean => {
    if (!currentLesson) return false;
    
    const progress = lessonProgress[currentLesson.id];
    const currentStep = currentLesson.steps[progress.currentStep - 1];
    
    // If there's an expected result function, use it to check completion
    if (currentStep.expectedResult) {
      return currentStep.expectedResult(gitState);
    }
    
    // Default to true if no expected result is defined
    return true;
  };
  
  const resetProgress = () => {
    // Reset progress for all lessons
    const resetLessonProgress: Record<string, LessonProgress> = {};
    
    lessons.forEach(lesson => {
      resetLessonProgress[lesson.id] = {
        lessonId: lesson.id,
        currentStep: 1,
        completed: false,
        totalSteps: lesson.steps.length,
        progress: 0,
      };
    });
    
    setLessonProgress(resetLessonProgress);
    localStorage.setItem('lessonProgress', JSON.stringify(resetLessonProgress));
    setCurrentLesson(null);
  };
  
  const contextValue: LessonContextType = {
    lessons,
    currentLesson,
    lessonProgress,
    setCurrentLesson: setCurrentLessonById,
    nextStep,
    previousStep,
    checkStepCompletion,
    resetProgress,
  };
  
  return (
    <LessonContext.Provider value={contextValue}>
      {children}
    </LessonContext.Provider>
  );
};

// Create hook for using the context
export const useLesson = (): LessonContextType => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within a LessonProvider');
  }
  return context;
};