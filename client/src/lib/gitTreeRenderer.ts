import * as d3 from 'd3';
import { GitState, Commit, Branch } from '@/components/GitLearningTool/types';

interface RenderOptions {
  width: number;
  height: number;
  scale: number;
}

// Layout constants
const NODE_RADIUS = 15;
const VERTICAL_SPACING = 70;
const HORIZONTAL_SPACING = 120;
const BRANCH_OFFSET = 40;

export function renderGitTree(
  svgElement: SVGSVGElement,
  gitState: GitState,
  options: RenderOptions
): void {
  const { commits, branches } = gitState;
  const { width, height, scale } = options;
  
  if (commits.length === 0) return;
  
  // Create main SVG element
  const svg = d3.select(svgElement);
  
  // Clear previous rendering
  svg.selectAll('*').remove();
  
  // Create a container group that will be transformed
  const container = svg
    .append('g')
    .attr('transform', `scale(${scale})`);
  
  // Create layers for connections and nodes
  const connectionsGroup = container.append('g').attr('class', 'connections');
  const nodesGroup = container.append('g').attr('class', 'nodes');
  
  // Assign positions to commits
  const processedCommits = assignPositions(commits, branches);
  
  // Draw connections first (so they're behind nodes)
  drawConnections(connectionsGroup, processedCommits);
  
  // Draw commit nodes
  drawNodes(nodesGroup, processedCommits, gitState.currentCommit);
  
  // Center the visualization
  const bounds = svgElement.getBBox();
  const centerX = width / 2 / scale;
  const centerY = height / 2 / scale;
  const boundsWidth = bounds.width || 100;
  const boundsHeight = bounds.height || 100;
  
  container.attr(
    'transform',
    `scale(${scale}) translate(${centerX - boundsWidth / 2}, ${centerY - boundsHeight / 2})`
  );
}

function assignPositions(commits: Commit[], branches: Branch[]): Commit[] {
  if (commits.length === 0) return [];
  
  // Create a copy of commits to work with
  const processedCommits = [...commits];
  
  // Create a map of branch names to horizontal positions
  const branchPositions: Record<string, number> = {};
  branches.forEach((branch, index) => {
    branchPositions[branch.name] = index * BRANCH_OFFSET;
  });
  
  // Topologically sort commits (simplified approach for the demo)
  const commitsByParent: Record<string, Commit[]> = {};
  
  // First, find root commits (no parent)
  const rootCommits = processedCommits.filter(commit => commit.parentId === null);
  
  // Group other commits by parent ID
  processedCommits.forEach(commit => {
    if (commit.parentId) {
      if (!commitsByParent[commit.parentId]) {
        commitsByParent[commit.parentId] = [];
      }
      commitsByParent[commit.parentId].push(commit);
    }
  });
  
  // Assign vertical positions by traversing the graph from roots
  let currentLevel = 0;
  
  // Function to recursively assign positions
  function assignPositionsRecursive(commits: Commit[], level: number) {
    commits.forEach((commit, index) => {
      // Assign vertical position
      commit.y = level * VERTICAL_SPACING + 50;
      
      // Assign horizontal position based on branch
      const branchPos = branchPositions[commit.branch] || 0;
      commit.x = HORIZONTAL_SPACING + branchPos;
      
      // If this commit has children, process them next
      const children = commitsByParent[commit.id] || [];
      if (children.length > 0) {
        assignPositionsRecursive(children, level + 1);
      }
    });
  }
  
  // Start assigning from root commits
  assignPositionsRecursive(rootCommits, 0);
  
  return processedCommits;
}

function drawConnections(group: d3.Selection<SVGGElement, unknown, null, undefined>, commits: Commit[]): void {
  commits.forEach(commit => {
    if (commit.parentId) {
      const parent = commits.find(c => c.id === commit.parentId);
      if (parent && commit.x !== undefined && commit.y !== undefined && 
          parent.x !== undefined && parent.y !== undefined) {
          
        // Calculate path control points for a curved line (MusicBlocks style)
        const startX = parent.x;
        const startY = parent.y;
        const endX = commit.x;
        const endY = commit.y;
        const midY = (startY + endY) / 2;
        
        // Create a nice curved path MusicBlocks style
        const path = d3.path();
        path.moveTo(startX, startY);
        
        // Different path style based on branch relationship
        if (Math.abs(startX - endX) > 10) {
          // Curved connections between different branches
          const controlPoint1X = startX;
          const controlPoint1Y = midY;
          const controlPoint2X = endX;
          const controlPoint2Y = midY;
          
          path.bezierCurveTo(
            controlPoint1X, controlPoint1Y,
            controlPoint2X, controlPoint2Y,
            endX, endY
          );
        } else {
          // Straighter line for same branch
          path.lineTo(endX, endY);
        }
        
        // Draw the path with decorative styling
        group
          .append('path')
          .attr('d', path.toString())
          .attr('fill', 'none')
          .attr('stroke', commit.color || '#26A69A')
          .attr('stroke-width', 2)
          .attr('stroke-linecap', 'round')
          .attr('class', 'git-edge');
          
        // Add subtle gradient overlay for depth effect
        group
          .append('path')
          .attr('d', path.toString())
          .attr('fill', 'none')
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.3)
          .attr('stroke-dasharray', '2,4')
          .attr('class', 'git-edge-highlight');
      }
    }
  });
}

function drawNodes(
  group: d3.Selection<SVGGElement, unknown, null, undefined>, 
  commits: Commit[],
  currentCommitId: string | null
): void {
  commits.forEach(commit => {
    if (commit.x === undefined || commit.y === undefined) return;
    
    // Create a group for each commit node with pointer cursor and hover effects
    const nodeGroup = group
      .append('g')
      .attr('transform', `translate(${commit.x},${commit.y})`)
      .attr('class', 'commit-node')
      .attr('data-id', commit.id)
      .style('cursor', 'pointer');
    
    // MusicBlocks-style node (hexagon shape for commits)
    const hexSize = NODE_RADIUS * 1.1;
    const hexagonPoints = [
      [0, -hexSize],                        // top point
      [hexSize * 0.866, -hexSize * 0.5],    // top right
      [hexSize * 0.866, hexSize * 0.5],     // bottom right
      [0, hexSize],                         // bottom point
      [-hexSize * 0.866, hexSize * 0.5],    // bottom left
      [-hexSize * 0.866, -hexSize * 0.5],   // top left
    ].map(point => point.join(',')).join(' ');

    // Draw hexagon for commit
    nodeGroup
      .append('polygon')
      .attr('points', hexagonPoints)
      .attr('fill', commit.color || '#26A69A')
      .attr('stroke', currentCommitId === commit.id ? '#000' : '#444')
      .attr('stroke-width', currentCommitId === commit.id ? 3 : 1.5)
      .attr('class', 'git-node git-node-commit')
      .attr('filter', currentCommitId === commit.id ? 'drop-shadow(0 3px 5px rgba(0, 0, 0, 0.3))' : 'none');
    
    // Add small center circle for emphasis (MusicBlocks style)
    nodeGroup
      .append('circle')
      .attr('r', NODE_RADIUS * 0.3)
      .attr('fill', 'white')
      .attr('stroke', '#444')
      .attr('stroke-width', 1);
    
    // Draw message box with subtle styling (MusicBlocks style)
    const textPadding = 8;
    const messageText = commit.message.length > 20 ? 
      commit.message.slice(0, 20) + '...' : commit.message;
    const textWidth = messageText.length * 7;  // Rough estimation of text width
    
    nodeGroup
      .append('rect')
      .attr('x', -textWidth/2 - textPadding)
      .attr('y', NODE_RADIUS * 1.4)
      .attr('width', textWidth + textPadding*2)
      .attr('height', 22)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', commit.color || '#26A69A')
      .attr('fill-opacity', 0.2)
      .attr('stroke', commit.color || '#26A69A')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.5);
    
    // Add commit message with improved styling
    nodeGroup
      .append('text')
      .attr('class', 'node-label git-node-text')
      .attr('text-anchor', 'middle')
      .attr('dy', NODE_RADIUS * 2)
      .attr('font-weight', 'medium')
      .attr('fill', '#333')
      .text(messageText);
    
    // Add commit ID (shortened) with improved styling
    nodeGroup
      .append('text')
      .attr('class', 'node-id git-node-id')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('dy', NODE_RADIUS * 2.8)
      .attr('fill', '#666')
      .text(commit.id.slice(0, 7));
    
    // Add tooltip
    nodeGroup
      .append('title')
      .text(`${commit.message}\n\nID: ${commit.id}\nBranch: ${commit.branch}`);
    
    // If this is the current commit, add a highlight effect
    if (currentCommitId === commit.id) {
      // Add a MusicBlocks-style pulse effect for current node
      nodeGroup
        .append('circle')
        .attr('r', NODE_RADIUS * 1.5)
        .attr('fill', 'none')
        .attr('stroke', commit.color || '#26A69A')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('class', 'animate-pulse')
        .attr('opacity', 0.6);
    }
  });
}
