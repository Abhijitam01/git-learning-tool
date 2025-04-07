# gitTreeRenderer Utility

## Overview

The `gitTreeRenderer` utility is responsible for visualizing the Git repository using D3.js. It renders commits as hexagonal nodes, branches as colored paths, and shows the relationships between different commits in a tree-like structure.

**File Location:** `client/src/lib/gitTreeRenderer.ts`

## Primary Functions

### renderGitTree

```typescript
export function renderGitTree(
  svgElement: SVGSVGElement,
  gitState: GitState,
  options: RenderOptions
): void
```

This is the main entry point for rendering the Git tree visualization. It:
1. Clears the existing SVG content
2. Assigns positions to commits
3. Calculates the appropriate scale and translation
4. Renders commits and connections

#### Parameters

- `svgElement`: The SVG element to render into
- `gitState`: The current Git repository state
- `options`: Rendering options (width, height, scale)

### assignPositions

```typescript
function assignPositions(commits: Commit[], branches: Branch[]): Commit[]
```

Calculates the x and y coordinates for each commit in the visualization:
1. Creates a map of commits by ID
2. Recursively traverses the commit tree starting from branch heads
3. Assigns y-positions based on commit depth (timeline)
4. Assigns x-positions to avoid overlapping

### drawConnections

```typescript
function drawConnections(
  group: d3.Selection<SVGGElement, unknown, null, undefined>, 
  commits: Commit[]
): void
```

Renders the connections (lines) between commits:
1. For each commit, finds its parent
2. Creates a line or path connecting the commit to its parent
3. Styles the line based on the branch color
4. Adds animations for the connections

### drawNodes

```typescript
function drawNodes(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  commits: Commit[],
  currentCommit: string | null
): void
```

Renders the commit nodes:
1. For each commit, creates a hexagonal node
2. Styles the node based on the branch color
3. Adds the commit message and ID as a tooltip
4. Highlights the current commit
5. Adds animations for node creation and updates

## Visual Style

The visualization follows the MusicBlocks style with:
1. Hexagonal nodes instead of circles
2. Vibrant colors for branches
3. Smooth animations for transitions
4. Interactive elements for better user experience
5. Responsive scaling based on zoom level

## D3.js Integration

The utility leverages D3.js features:
1. **Selections** - For manipulating SVG elements
2. **Transitions** - For smooth animations
3. **Scales** - For mapping data values to visual properties
4. **Shapes** - For creating hexagons and paths
5. **Events** - For handling interactions

## Example Usage

```typescript
import { renderGitTree } from '@/lib/gitTreeRenderer';
import { useGit } from '@/context/GitContext';
import { useEffect, useRef, useState } from 'react';

const GitVisualization = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useGit();
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    if (svgRef.current) {
      // Render the Git tree
      renderGitTree(svgRef.current, state, {
        width: 800,
        height: 600,
        scale,
      });
    }
  }, [state, scale]);
  
  return (
    <div className="git-visualization">
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};
```

## Performance Considerations

The renderer includes optimizations for better performance:
1. **Memoization** - Caches calculated positions when possible
2. **Selective Updates** - Only updates changed elements
3. **Throttling** - Limits render frequency during rapid changes
4. **Cleanup** - Properly removes old elements to prevent memory leaks

## Customization

The visual appearance can be customized by modifying:
1. Node shapes and sizes
2. Connection styles and animations
3. Color schemes for branches
4. Text formatting and tooltips
5. Animation timing and easing functions
