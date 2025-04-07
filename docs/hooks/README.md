# Custom Hooks Documentation

This directory contains documentation for the custom React hooks used in the Git Learning Tool application.

## Hook Overview

Custom hooks in this application encapsulate complex logic and state management, making components cleaner and more focused. The key hooks are:

1. [useDrag.ts](useDrag.md) - Manages drag and drop operations for Git blocks
2. [useGitOperations.ts](useGitOperations.md) - Manages Git operation forms and execution
3. [useLocalStorage.ts](useLocalStorage.md) - Provides an interface for localStorage operations
4. [useIsMobile.ts](useIsMobile.md) - Detects if the current device is mobile
5. [useToast.ts](useToast.md) - Manages toast notifications

## Custom Hook Pattern

Each custom hook follows a common pattern:

1. **State Management** - Uses React's useState for internal state
2. **Effect Management** - Uses useEffect for side effects
3. **Callback Functions** - Implements memoized functions with useCallback
4. **Typed Interface** - Provides TypeScript interfaces for inputs and outputs
5. **Encapsulated Logic** - Keeps implementation details hidden from components

## Using Custom Hooks

Custom hooks are used in components like regular React hooks:

```tsx
import { useDrag } from '@/hooks/useDrag';
import { useGitOperations } from '@/hooks/useGitOperations';

const MyComponent = () => {
  // Use the drag hook
  const { 
    isDragging, 
    dragType, 
    handleDragStart, 
    handleDrop 
  } = useDrag();
  
  // Use the Git operations hook
  const { 
    formState, 
    openForm, 
    executeOperation 
  } = useGitOperations();
  
  // Component logic using the hooks
};
```

## Best Practices

When working with these hooks:

1. **Destructure Only What You Need** - Only destructure the values you need from the hook
2. **Keep Hook Logic Separate** - Don't mix hook logic in component functions
3. **Follow the Rules of Hooks** - Call hooks only at the top level of your components
4. **Memoize Event Handlers** - Use useCallback for event handlers that are passed to children
