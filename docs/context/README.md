# Context Providers Documentation

This directory contains documentation for the context providers used in the Git Learning Tool application.

## Context Overview

The application uses React Context API to manage state and provide data to components throughout the component tree without having to pass props down manually at every level.

## Context Providers

The application has two main context providers:

1. [GitContext](GitContext.md) - Manages the Git repository state and operations
2. [LessonContext](LessonContext.md) - Manages lessons and user progress

## Provider Architecture

The context providers are structured to avoid circular dependencies:

```tsx
<QueryClientProvider>
  <GitProvider>
    <LessonProvider>
      <AppContent />
    </LessonProvider>
  </GitProvider>
</QueryClientProvider>
```

This structure ensures that:
- `GitProvider` can be used without depending on `LessonProvider`
- `LessonProvider` can access `GitProvider` when needed
- Both providers are accessible to all components in the application

## Using Context in Components

Context is accessed using custom hooks exposed by each provider:

```tsx
import { useGit } from '@/context/GitContext';
import { useLesson } from '@/context/LessonContext';

const MyComponent = () => {
  const { state, createCommit } = useGit();
  const { currentLesson, nextStep } = useLesson();
  
  // Component logic
};
```

This pattern ensures that:
- Components only access the context they need
- Errors are thrown if a context is used outside its provider
- Type safety is maintained through TypeScript interfaces
