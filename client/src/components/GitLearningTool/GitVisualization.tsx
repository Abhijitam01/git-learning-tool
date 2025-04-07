import React, { useRef, useEffect } from 'react';
import { renderGitTree } from '@/lib/gitTreeRenderer';
import { GitState } from '@/context/GitContext';
import { GitBlockType } from '@/hooks/useGitOperations';
import { useDrag } from '@/hooks/useDrag';

interface GitVisualizationProps {
  gitState: GitState;
  scale: number;
  onBlockDrop: (blockType: GitBlockType) => void;
}

const GitVisualization: React.FC<GitVisualizationProps> = ({
  gitState,
  scale,
  onBlockDrop,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { handleDragOver, handleDrop } = useDrag();
  
  // Render the Git tree when state changes
  useEffect(() => {
    if (svgRef.current) {
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;
      
      renderGitTree(svgRef.current, gitState, {
        width,
        height,
        scale,
      });
    }
  }, [gitState, scale]);
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const result = handleDrop(e);
    
    if (result && result.blockType) {
      onBlockDrop(result.blockType);
    }
  };
  
  return (
    <div 
      className="git-visualization w-full h-full border-t border-gray-200 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        className="bg-white"
      ></svg>
      
      {gitState.commits.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <i className="fas fa-code-branch text-5xl mb-2"></i>
            <p>Drag and drop Git blocks or use the sidebar to create commits</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitVisualization;