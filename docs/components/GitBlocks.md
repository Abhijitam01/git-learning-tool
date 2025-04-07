# GitBlocks Component

## Overview

The GitBlocks component displays a collection of interactive blocks representing different Git operations. These blocks can be clicked to open a form for executing Git operations or dragged into the visualization area.

**File Location:** `client/src/components/GitLearningTool/GitBlocks.tsx`

## Props

| Prop | Type | Description |
|------|------|-------------|
| onBlockClick | (blockType: GitBlockType) => void | Callback function triggered when a block is clicked |

## Block Types

The component renders blocks for the following Git operations:

1. **Commit** - Create a snapshot of changes
2. **Branch** - Create a new line of development
3. **Merge** - Combine changes from different branches
4. **Checkout** - Switch between branches or commits
5. **Revert** - Undo changes from a specific commit
6. **Issue** - Create an issue (simulated)

## Component Structure

Each block consists of:
- A colorful header with an icon
- A label describing the Git operation
- Input placeholders (visual only)
- Click and drag event handlers

## Animations

The component includes several animations for better user experience:

1. **Ripple Effect** - When a block is clicked
2. **Drag Animation** - Scales the block slightly when dragging
3. **Hover Effect** - Subtle shadow enhancement on hover

## Example Usage

```tsx
import GitBlocks from '@/components/GitLearningTool/GitBlocks';
import { useGitOperations } from '@/hooks/useGitOperations';

const MyComponent = () => {
  const { openForm } = useGitOperations();
  
  return (
    <div className="sidebar">
      <GitBlocks onBlockClick={openForm} />
    </div>
  );
};
```

## Component Implementation

The component uses:
- TypeScript interfaces for type safety
- CSS modules for styling
- Custom animations for interactions
- Event handlers for click and drag operations

## Integration Points

This component integrates with:
- `useGitOperations` hook for executing Git operations
- Drag-and-drop functionality to interact with GitVisualization
- MusicBlocks-style UI design for educational aesthetics
