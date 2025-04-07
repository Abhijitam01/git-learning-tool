import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GitState, GitBlockType, Position } from './types';
import { useDrag } from '@/hooks/useDrag';
import { renderGitTree } from '@/lib/gitTreeRenderer';

interface GitVisualizationProps {
  gitState: GitState;
  scale: number;
  onBlockDrop: (blockType: GitBlockType) => void;
}

const GitVisualization: React.FC<GitVisualizationProps> = ({ 
  gitState, 
  scale,
  onBlockDrop 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropHelpers, setDropHelpers] = useState(false);
  const { handleDragOver, handleDrop } = useDrag();
  
  // Visualize the Git tree whenever the state changes
  useEffect(() => {
    if (svgRef.current && containerRef.current) {
      // Clear previous visualization
      d3.select(svgRef.current).selectAll('*').remove();
      
      // Get container dimensions
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Create new visualization
      renderGitTree(svgRef.current, gitState, { width, height, scale });
    }
  }, [gitState, scale]);
  
  const [dropTarget, setDropTarget] = useState<{ x: number; y: number } | null>(null);
  
  const handleDragOverVisualization = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropHelpers(true);
    
    // Calculate position relative to the container
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropTarget({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    handleDragOver(e);
  };
  
  const handleDragLeave = () => {
    setDropHelpers(false);
    setDropTarget(null);
  };
  
  const handleDropOnVisualization = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropHelpers(false);
    setDropTarget(null);
    
    const result = handleDrop(e);
    if (result && result.blockType) {
      onBlockDrop(result.blockType);
      
      // Visual feedback for successful drop with improved ripple effect
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Create outer ripple effect with enhanced animation
        const ripple = document.createElement('div');
        ripple.className = 'absolute rounded-full bg-primary opacity-30 animate-ripple z-10';
        ripple.style.left = `${e.clientX - rect.left - 60}px`;
        ripple.style.top = `${e.clientY - rect.top - 60}px`;
        ripple.style.width = '120px';
        ripple.style.height = '120px';
        containerRef.current.appendChild(ripple);
        
        // Create middle ripple for a more layered effect
        const middleRipple = document.createElement('div');
        middleRipple.className = 'absolute rounded-full bg-blue-400 opacity-40 animate-ripple z-15';
        middleRipple.style.left = `${e.clientX - rect.left - 45}px`;
        middleRipple.style.top = `${e.clientY - rect.top - 45}px`;
        middleRipple.style.width = '90px';
        middleRipple.style.height = '90px';
        containerRef.current.appendChild(middleRipple);
        
        // Create inner ripple with slight delay for layered effect
        setTimeout(() => {
          if (containerRef.current) {
            const innerRipple = document.createElement('div');
            innerRipple.className = 'absolute rounded-full bg-white opacity-60 animate-ripple z-20';
            innerRipple.style.left = `${e.clientX - rect.left - 30}px`;
            innerRipple.style.top = `${e.clientY - rect.top - 30}px`;
            innerRipple.style.width = '60px';
            innerRipple.style.height = '60px';
            containerRef.current.appendChild(innerRipple);
            
            // Remove all ripples after animation completes
            setTimeout(() => {
              if (containerRef.current) {
                containerRef.current.contains(ripple) && containerRef.current.removeChild(ripple);
                containerRef.current.contains(middleRipple) && containerRef.current.removeChild(middleRipple);
                containerRef.current.contains(innerRipple) && containerRef.current.removeChild(innerRipple);
              }
            }, 800);
          }
        }, 150);
      }
    }
  };
  
  // Determine if we show empty state
  const showEmptyState = gitState.commits.length === 0;
  
  return (
    <div 
      ref={containerRef}
      className="flex-grow overflow-hidden relative bg-gray-50"
      onDragOver={handleDragOverVisualization}
      onDragLeave={handleDragLeave}
      onDrop={handleDropOnVisualization}
    >
      {/* Target Drop Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          ref={svgRef}
          className="w-full h-full"
        ></svg>
        
        {/* Empty State with enhanced styling and animations */}
        {showEmptyState && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 animate-fade-in">
            <div className="relative mb-6">
              <svg className="w-28 h-28 text-primary opacity-20 animate-slow-spin" viewBox="0 0 92 92" fill="currentColor">
                <path d="M90.156,41.965l-14.211-14.22c-0.303-0.303-0.701-0.453-1.104-0.453c-0.398,0-0.8,0.151-1.104,0.453
                  l-3.030,3.029l5.929,5.93c0.304,0.303,0.304,0.796,0,1.099c-0.305,0.303-0.801,0.303-1.105,0l-5.929-5.93l-3.032,3.032
                  c-0.303,0.303-0.453,0.702-0.453,1.104v3.030h-9.12v-3.030c0-0.403-0.151-0.802-0.453-1.104l-3.031-3.032l-5.93,5.93
                  c-0.303,0.303-0.8,0.303-1.104,0c-0.303-0.303-0.303-0.796,0-1.099l5.929-5.93l-3.029-3.029c-0.303-0.303-0.702-0.453-1.104-0.453
                  c-0.403,0-0.801,0.151-1.104,0.453l-3.030,3.029l5.929,5.93c0.303,0.303,0.303,0.796,0,1.099c-0.304,0.303-0.801,0.303-1.104,0
                  l-5.929-5.93l-3.032,3.032c-0.303,0.303-0.452,0.702-0.452,1.104v3.030h-9.12v-3.030c0-0.403-0.151-0.802-0.453-1.104l-3.031-3.032
                  l-5.93,5.93c-0.303,0.303-0.801,0.303-1.104,0c-0.303-0.303-0.303-0.796,0-1.099l5.93-5.93l-3.031-3.029
                  c-0.302-0.303-0.701-0.453-1.104-0.453c-0.402,0-0.8,0.151-1.103,0.453L1.843,41.965c-0.302,0.302-0.453,0.702-0.453,1.104
                  c0,0.402,0.151,0.801,0.453,1.104l14.218,14.217c0.302,0.302,0.702,0.453,1.103,0.453c0.403,0,0.802-0.151,1.104-0.453
                  l3.031-3.031l-5.93-5.93c-0.303-0.302-0.303-0.795,0-1.098c0.303-0.302,0.801-0.302,1.104,0l5.93,5.93l3.032-3.032
                  c0.302-0.302,0.453-0.701,0.453-1.104v-3.030h9.119v3.030c0,0.403,0.151,0.802,0.453,1.104l3.031,3.032l5.929-5.931
                  c0.303-0.302,0.801-0.302,1.104,0c0.303,0.304,0.303,0.797,0,1.099l-5.929,5.931l3.032,3.031c0.302,0.303,0.701,0.453,1.104,0.453
                  c0.402,0,0.801-0.151,1.103-0.453l3.030-3.031l-5.929-5.931c-0.303-0.303-0.303-0.796,0-1.099c0.304-0.302,0.801-0.302,1.105,0
                  l5.929,5.931l3.032-3.032c0.302-0.302,0.452-0.701,0.452-1.104v-3.030h9.12v3.030c0,0.403,0.151,0.802,0.453,1.104l3.031,3.032
                  l5.929-5.931c0.303-0.302,0.801-0.302,1.104,0c0.304,0.304,0.304,0.797,0,1.099l-5.929,5.931l3.029,3.031
                  c0.304,0.303,0.702,0.453,1.104,0.453c0.403,0,0.802-0.151,1.104-0.453l14.218-14.217c0.302-0.303,0.453-0.702,0.453-1.104
                  C90.608,42.667,90.458,42.267,90.156,41.965z"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-primary font-bold text-lg animate-bounce-subtle">Git</div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-gray-700 drop-shadow-sm">Start Your Git Journey</h3>
            <p className="text-center max-w-md mb-6 text-gray-500">
              Drag a <span className="font-semibold text-primary">commit</span> block from the toolbox 
              to create your first commit and begin learning Git visually.
            </p>
            
            <div className="flex space-x-4">
              <button 
                className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-md shadow-sm transition-all duration-200 flex items-center animate-ripple focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                onClick={() => onBlockDrop('commit')}
              >
                <i className="fas fa-play mr-2"></i> Start Demo Project
              </button>
              
              <button 
                className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-5 py-2.5 rounded-md shadow-sm transition-all duration-200"
                onClick={() => window.open('https://git-scm.com/book/en/v2', '_blank')}
              >
                <i className="fas fa-book mr-2"></i> Learn More
              </button>
            </div>
            
            <div className="mt-8 text-xs text-gray-400 flex items-center">
              <div className="w-16 h-px bg-gray-200 mr-3"></div>
              Tip: You can also complete step-by-step lessons from the sidebar
              <div className="w-16 h-px bg-gray-200 ml-3"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Helper Lines for Drop Visualization - Enhanced with gradients and animations */}
      {dropHelpers && (
        <div className="pointer-events-none absolute inset-0">
          {/* Top border with gradient and animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse"></div>
          
          {/* Bottom border with gradient and animation */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse"></div>
          
          {/* Left border with gradient and animation */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent opacity-50 animate-pulse"></div>
          
          {/* Right border with gradient and animation */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent opacity-50 animate-pulse"></div>
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary opacity-70"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary opacity-70"></div>
          
          {/* Target indicator with more advanced animations and styling */}
          {dropTarget && (
            <div className="absolute pointer-events-none" style={{ 
              left: dropTarget.x, 
              top: dropTarget.y,
              transform: 'translate(-50%, -50%)'
            }}>
              {/* Outer ripple effect */}
              <div className="absolute rounded-full border-4 border-primary opacity-20 animate-pulse"
                style={{ 
                  left: -50, 
                  top: -50,
                  width: '100px',
                  height: '100px'
                }}
              ></div>
              
              {/* Secondary ripple with different timing */}
              <div className="absolute rounded-full border-2 border-blue-400 opacity-30"
                style={{ 
                  left: -45, 
                  top: -45,
                  width: '90px',
                  height: '90px',
                  animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s'
                }}
              ></div>
              
              {/* Middle ring with rotating gradient */}
              <div className="absolute rounded-full border-2 border-dashed opacity-50 animate-spin"
                style={{ 
                  left: -30, 
                  top: -30,
                  width: '60px',
                  height: '60px',
                  borderImage: 'linear-gradient(45deg, #3b82f6, #93c5fd) 1',
                  animationDuration: '8s'
                }}
              ></div>
              
              {/* Inner rotating ring */}
              <div className="absolute rounded-full border border-primary opacity-70 animate-spin"
                style={{ 
                  left: -20, 
                  top: -20,
                  width: '40px',
                  height: '40px',
                  animationDirection: 'reverse',
                  animationDuration: '5s'
                }}
              ></div>
              
              {/* Inner circle with gradient */}
              <div className="absolute rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-40"
                style={{ 
                  left: -12, 
                  top: -12,
                  width: '24px',
                  height: '24px',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                }}
              ></div>
              
              {/* Enhanced crosshair with gradients */}
              <div className="absolute h-0.5 opacity-70" 
                style={{ 
                  left: -40, 
                  top: -0.5, 
                  width: '80px',
                  background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)'
                }}
              ></div>
              <div className="absolute w-0.5 opacity-70" 
                style={{ 
                  left: -0.5, 
                  top: -40, 
                  height: '80px',
                  background: 'linear-gradient(180deg, transparent, #3b82f6, transparent)'
                }}
              ></div>
              
              {/* "Drop here" label */}
              <div className="absolute whitespace-nowrap text-xs font-medium text-primary bg-white bg-opacity-80 px-2 py-0.5 rounded-full shadow-sm"
                style={{
                  top: 30,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                Drop here
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitVisualization;
