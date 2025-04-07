import { useState } from 'react';
import { useGit } from '@/context/GitContext';
import { useToast } from '@/hooks/use-toast';

export type GitBlockType = 'commit' | 'branch' | 'merge' | 'checkout' | 'revert' | 'issue';

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
  const [formState, setFormState] = useState<FormState>({
    isOpen: false,
    blockType: null,
    inputs: {},
  });
  
  const { 
    createCommit, 
    createBranch, 
    mergeBranch, 
    checkout, 
    revertCommit, 
    createIssue 
  } = useGit();
  
  const { toast } = useToast();
  
  const openForm = (blockType: GitBlockType) => {
    setFormState({
      isOpen: true,
      blockType,
      inputs: {},
    });
  };
  
  const closeForm = () => {
    setFormState({
      ...formState,
      isOpen: false,
    });
  };
  
  const handleInputChange = (name: string, value: string) => {
    setFormState({
      ...formState,
      inputs: {
        ...formState.inputs,
        [name]: value,
      },
    });
  };
  
  const executeOperation = (): boolean => {
    if (!formState.blockType) return false;
    
    try {
      switch (formState.blockType) {
        case 'commit':
          createCommit(formState.inputs.message);
          break;
        case 'branch':
          createBranch(formState.inputs.name);
          break;
        case 'merge':
          mergeBranch(formState.inputs.sourceBranch);
          break;
        case 'checkout':
          checkout(formState.inputs.target);
          break;
        case 'revert':
          revertCommit(formState.inputs.commitId);
          break;
        case 'issue':
          createIssue(
            formState.inputs.title,
            formState.inputs.description
          );
          break;
        default:
          return false;
      }
      
      toast({
        title: "Success",
        description: `${formState.blockType} operation completed successfully.`,
      });
      
      closeForm();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to execute ${formState.blockType} operation.`,
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    formState,
    openForm,
    closeForm,
    handleInputChange,
    executeOperation,
  };
}