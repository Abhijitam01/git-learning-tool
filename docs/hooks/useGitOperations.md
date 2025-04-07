# useGitOperations Hook

## Overview

The `useGitOperations` hook manages the state and logic for Git operation forms. It handles opening and closing forms, managing form inputs, and executing Git operations through the GitContext.

**File Location:** `client/src/hooks/useGitOperations.tsx`

## Interface

```typescript
interface FormState {
  isOpen: boolean;               // Whether the form is open
  blockType: GitBlockType | null; // Type of Git operation
  inputs: Record<string, string>; // Form input values
}

interface UseGitOperationsReturn {
  formState: FormState;             // Current form state
  openForm: (blockType: GitBlockType) => void; // Open form for operation
  closeForm: () => void;            // Close the form
  handleInputChange: (name: string, value: string) => void; // Update input
  executeOperation: () => boolean;  // Execute the operation
}
```

## Implementation

The hook encapsulates:

1. **Form State Management** - Tracks form open/close state and input values
2. **Input Handling** - Manages changes to form inputs
3. **Form Opening Logic** - Sets up the appropriate form for a Git operation
4. **Operation Execution** - Delegates to the GitContext to perform operations
5. **Toast Notifications** - Shows success/error messages after operations

```typescript
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
  
  // Open a form for a specific operation
  const openForm = (blockType: GitBlockType) => {
    setFormState({
      isOpen: true,
      blockType,
      inputs: {},
    });
  };
  
  // Close the form
  const closeForm = () => {
    setFormState({
      ...formState,
      isOpen: false,
    });
  };
  
  // Handle input changes
  const handleInputChange = (name: string, value: string) => {
    setFormState({
      ...formState,
      inputs: {
        ...formState.inputs,
        [name]: value,
      },
    });
  };
  
  // Execute the Git operation
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
      
      // Show success message
      toast({
        title: "Success",
        description: `${formState.blockType} operation completed successfully.`,
      });
      
      // Close the form
      closeForm();
      return true;
    } catch (error) {
      // Show error message
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
```

## Usage Example

```tsx
import { useGitOperations } from '@/hooks/useGitOperations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const GitOperationComponent = () => {
  const { 
    formState, 
    openForm, 
    closeForm, 
    handleInputChange, 
    executeOperation 
  } = useGitOperations();
  
  return (
    <>
      <Button onClick={() => openForm('commit')}>
        Create Commit
      </Button>
      
      <Dialog open={formState.isOpen} onOpenChange={closeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formState.blockType && 
               formState.blockType.charAt(0).toUpperCase() + 
               formState.blockType.slice(1)}
            </DialogTitle>
          </DialogHeader>
          
          {formState.blockType === 'commit' && (
            <div>
              <label>Commit Message</label>
              <Input
                value={formState.inputs.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button onClick={executeOperation}>
              Execute
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
```

## Integration

This hook integrates with:

1. **GitContext** - For executing Git operations
2. **Toast Component** - For displaying notifications
3. **Dialog Component** - For rendering the operation form
