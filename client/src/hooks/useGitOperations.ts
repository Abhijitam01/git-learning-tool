import { useState } from 'react';
import { useGit } from '@/context/GitContext';
import { GitBlockType } from '@/components/GitLearningTool/types';
import { useLesson } from '@/context/LessonContext';
import { useToast } from '@/hooks/use-toast';

interface FormState {
  isOpen: boolean;
  blockType: GitBlockType | null;
  inputs: Record<string, string>;
}

interface UseGitOperationsReturn {
  formState: FormState;
  openForm: (blockType: GitBlockType) => void;
  closeForm: () => void;
  handleInputChange: (name: string, value: string) => void;
  executeOperation: () => boolean;
}

export function useGitOperations(): UseGitOperationsReturn {
  const { toast } = useToast();
  const { 
    createCommit, 
    createBranch, 
    mergeBranch, 
    checkout, 
    revertCommit, 
    createIssue 
  } = useGit();
  
  const { currentLesson, lessonProgress, nextStep } = useLesson();
  
  const [formState, setFormState] = useState<FormState>({
    isOpen: false,
    blockType: null,
    inputs: {}
  });

  const openForm = (blockType: GitBlockType) => {
    // Initialize with empty inputs
    setFormState({
      isOpen: true,
      blockType,
      inputs: {}
    });
  };

  const closeForm = () => {
    setFormState({
      isOpen: false,
      blockType: null,
      inputs: {}
    });
  };

  const handleInputChange = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [name]: value
      }
    }));
  };

  const validateInputs = (): boolean => {
    const { blockType, inputs } = formState;
    
    if (!blockType) return false;
    
    switch (blockType) {
      case 'commit':
        return !!inputs.message;
      case 'branch':
        return !!inputs.name;
      case 'merge':
        return !!inputs.sourceBranch;
      case 'checkout':
        return !!inputs.target;
      case 'revert':
        return !!inputs.commitId;
      case 'issue':
        return !!inputs.title;
      default:
        return false;
    }
  };

  const executeOperation = (): boolean => {
    const { blockType, inputs } = formState;
    
    if (!blockType || !validateInputs()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      switch (blockType) {
        case 'commit':
          createCommit(inputs.message);
          toast({
            title: "Success",
            description: `Created commit: ${inputs.message}`,
          });
          break;
          
        case 'branch':
          createBranch(inputs.name);
          toast({
            title: "Success",
            description: `Created branch: ${inputs.name}`,
          });
          break;
          
        case 'merge':
          mergeBranch(inputs.sourceBranch);
          toast({
            title: "Success",
            description: `Merged branch: ${inputs.sourceBranch}`,
          });
          break;
          
        case 'checkout':
          checkout(inputs.target);
          toast({
            title: "Success",
            description: `Checked out: ${inputs.target}`,
          });
          break;
          
        case 'revert':
          revertCommit(inputs.commitId);
          toast({
            title: "Success",
            description: `Reverted commit: ${inputs.commitId}`,
          });
          break;
          
        case 'issue':
          createIssue(inputs.title, inputs.description || '');
          toast({
            title: "Success",
            description: `Created issue: ${inputs.title}`,
          });
          break;
          
        default:
          return false;
      }
      
      // If we're in a lesson, check if this operation completes the current step
      if (currentLesson) {
        const progress = lessonProgress[currentLesson.id];
        const currentStep = currentLesson.steps[progress.currentStep - 1];
        
        if (currentStep.action === blockType) {
          nextStep();
          toast({
            title: "Lesson Progress",
            description: "Great job! Moving to the next step.",
          });
        }
      }
      
      closeForm();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: `Operation failed: ${(error as Error).message}`,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    formState,
    openForm,
    closeForm,
    handleInputChange,
    executeOperation
  };
}
