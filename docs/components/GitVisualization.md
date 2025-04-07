# GitVisualization Component

## Overview

The GitVisualization component renders an interactive visualization of a Git repository using D3.js. It displays commits as nodes, branches as colored lines, and shows the relationships between different commits.

**File Location:** `client/src/components/GitLearningTool/GitVisualization.tsx`

## Props

| Prop | Type | Description |
|------|------|-------------|
| gitState | GitState | Current state of the Git repository |
| scale | number | Zoom level for the visualization |
| onBlockDrop | (blockType: GitBlockType) => void | Callback function triggered when a Git block is dropped onto the visualization |

## Features

1. **Commit Visualization** - Displays commits as hexagonal nodes with messages
2. **Branch Visualization** - Shows branches as colored paths connecting commits
3. **Current Branch Highlighting** - Highlights the active branch
4. **Interactive Elements** - Clickable nodes for checkout operations
5. **Drag and Drop Support** - Accept Git blocks dropped from the sidebar
6. **Zoom Controls** - Supports zooming in and out for better navigation
7. **Pan Support** - Allows panning around the visualization

## Component Structure

The component consists of:
- An SVG container for the D3.js visualization
- A drop zone for Git blocks
- Event handlers for interactions
- Integration with the gitTreeRenderer utility

## D3.js Integration

The component integrates with D3.js through the `gitTreeRenderer.ts` utility:
- Calculates positions for commits in a tree layout
- Draws connections between related commits
- Renders commit nodes with appropriate styling
- Handles animations and transitions

## Example Usage

```tsx
import GitVisualization from '@/components/GitLearningTool/GitVisualization';
import { useGit } from '@/context/GitContext';
import { useGitOperations } from '@/hooks/useGitOperations';

const MyComponent = () => {
  const { state } = useGit();
  const { openForm } = useGitOperations();
  const [scale, setScale] = useState(1);
  
  return (
    <div className="visualization-container">
      <GitVisualization 
        gitState={state}
        scale={scale}
        onBlockDrop={openForm}
      />
    </div>
  );
};
```

## Component Implementation

The component uses:
- React's useRef and useEffect hooks for DOM manipulation
- D3.js for creating and updating the visualization
- Event listeners for handling interactions
- CSS for styling the SVG elements
- gitTreeRenderer for complex rendering logic

## Integration Points

This component integrates with:
- `GitContext` to access the current Git state
- `useDrag` hook for handling drag and drop operations
- `gitTreeRenderer` utility for D3.js visualization
- `GitToolbar` component for zoom controls
