import * as d3 from 'd3';
import { GitState, Commit, Branch } from '@/context/GitContext';

interface RenderOptions {
  width: number;
  height: number;
  scale: number;
}

export function renderGitTree(
  svgElement: SVGSVGElement,
  gitState: GitState,
  options: RenderOptions
): void {
  // Clear existing SVG content
  d3.select(svgElement).selectAll("*").remove();
  
  const { width, height, scale } = options;
  
  // Create root group with zoom/pan
  const svg = d3.select(svgElement);
  const g = svg.append("g");
  
  // Assign positions to commits for visualization
  const commits = assignPositions(gitState.commits, gitState.branches);
  
  // Apply scale and center the visualization
  const maxX = Math.max(...commits.map(c => c.x || 0), 1);
  const maxY = Math.max(...commits.map(c => c.y || 0), 1);
  
  // Calculate translation to center the graph
  const translateX = width / 2 - (maxX * scale) / 2;
  const translateY = height / 2 - (maxY * scale) / 2;
  
  g.attr("transform", `translate(${translateX}, ${translateY}) scale(${scale})`);
  
  // Draw connections between commits
  drawConnections(g, commits);
  
  // Draw commit nodes
  drawNodes(g, commits, gitState.currentCommit);
}

function assignPositions(commits: Commit[], branches: Branch[]): Commit[] {
  if (commits.length === 0) return [];
  
  // Create a map for quick access to commits by ID
  const commitMap = new Map<string, Commit>();
  commits.forEach(commit => {
    commitMap.set(commit.id, { ...commit });
  });
  
  // Find root commits (no parents)
  const rootCommits = commits.filter(commit => !commit.parentId);
  
  // Track which positions have been used at each level
  const positions = new Map<number, Set<number>>();
  
  // Create a copy of commits with positions
  const positionedCommits: Commit[] = [];
  
  // Start vertical position from the bottom
  let maxLevel = 0;
  
  // Assign positions recursively starting from branch heads
  const branchHeads = branches
    .filter(branch => branch.headCommitId)
    .map(branch => {
      const commit = commitMap.get(branch.headCommitId!);
      return commit ? { ...commit, color: branch.color } : null;
    })
    .filter(Boolean) as Commit[];
  
  // Function to assign positions recursively
  function assignPositionsRecursive(commits: Commit[], level: number) {
    if (level > maxLevel) maxLevel = level;
    
    commits.forEach(commit => {
      if (!positions.has(level)) {
        positions.set(level, new Set<number>());
      }
      
      // Find horizontal position
      let x = 0;
      while (positions.get(level)!.has(x)) {
        x += 100;
      }
      
      // Mark position as used
      positions.get(level)!.add(x);
      
      // Update commit with position
      const updatedCommit = {
        ...commit,
        x,
        y: level * 100,
      };
      
      positionedCommits.push(updatedCommit);
      
      // Process parent commit if it exists
      if (commit.parentId) {
        const parent = commitMap.get(commit.parentId);
        if (parent) {
          assignPositionsRecursive([parent], level + 1);
        }
      }
    });
  }
  
  // Start assigning positions from branch heads
  assignPositionsRecursive(branchHeads, 0);
  
  // Process any unassigned commits (should be rare)
  const assignedCommitIds = new Set(positionedCommits.map(c => c.id));
  const unassignedCommits = commits.filter(c => !assignedCommitIds.has(c.id));
  
  if (unassignedCommits.length > 0) {
    assignPositionsRecursive(unassignedCommits, maxLevel + 1);
  }
  
  return positionedCommits;
}

function drawConnections(group: d3.Selection<SVGGElement, unknown, null, undefined>, commits: Commit[]): void {
  // Create a map for quick access to commits by ID
  const commitMap = new Map<string, Commit>();
  commits.forEach(commit => {
    commitMap.set(commit.id, commit);
  });
  
  // Draw connections from each commit to its parent
  commits.forEach(commit => {
    if (commit.parentId) {
      const parent = commitMap.get(commit.parentId);
      
      if (parent && parent.x !== undefined && parent.y !== undefined) {
        // Draw line from commit to parent
        group.append("path")
          .attr("d", `M${commit.x},${commit.y} L${parent.x},${parent.y}`)
          .attr("stroke", commit.color || "#888")
          .attr("stroke-width", 2)
          .attr("fill", "none");
      }
    }
  });
}

function drawNodes(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  commits: Commit[],
  currentCommit: string | null
): void {
  // Draw each commit as a hexagon
  commits.forEach(commit => {
    const hexagonSize = 20;
    const hexagonPath = hexagonPoints(commit.x!, commit.y!, hexagonSize);
    
    // Node group
    const nodeGroup = group.append("g")
      .attr("class", "commit-node")
      .attr("data-id", commit.id);
    
    // Hexagon shape
    nodeGroup.append("path")
      .attr("d", hexagonPath)
      .attr("fill", commit.color || "#2196F3")
      .attr("stroke", currentCommit === commit.id ? "#333" : "#fff")
      .attr("stroke-width", currentCommit === commit.id ? 3 : 1)
      .attr("cursor", "pointer");
    
    // First character of commit message
    nodeGroup.append("text")
      .attr("x", commit.x!)
      .attr("y", commit.y! + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .attr("cursor", "pointer")
      .text(commit.message.charAt(0));
    
    // Tooltip
    nodeGroup.append("title")
      .text(`${commit.message}\n${new Date(commit.timestamp).toLocaleString()}\nID: ${commit.id.slice(0, 8)}`);
  });
}

// Helper function to generate hexagon points
function hexagonPoints(x: number, y: number, size: number): string {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    points.push(`${px},${py}`);
  }
  return `M${points.join("L")}Z`;
}