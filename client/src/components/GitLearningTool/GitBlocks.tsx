import React, { useState } from 'react';
import { GitBlockType } from './types';
import { useDrag } from '@/hooks/useDrag';

interface GitBlocksProps {
  onBlockClick: (blockType: GitBlockType) => void;
}

interface BlockProps {
  type: GitBlockType;
  label: string;
  icon: string;
  color: string;
  tooltip: string;
  inputs: {
    placeholder: string;
    name: string;
  }[];
  onClick: () => void;
}

const Block: React.FC<BlockProps> = ({ type, label, icon, color, tooltip, inputs, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { handleDragStart, handleDragEnd } = useDrag();
  
  // Create a lighter shade of the color for input slots and subtle effects
  const lightColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Create a lighter, more pastel version for backgrounds
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  };
  
  // Define multiple animation types for different blocks
  const animations = {
    commit: 'animate-pulse',
    branch: 'animate-bounce',
    merge: 'animate-spin',
    checkout: 'animate-pulse',
    revert: 'animate-spin',
    issue: 'animate-bounce'
  };
  
  // Add ripple effect when clicked
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Store a reference to the current target
    const currentTarget = e.currentTarget;
    
    // Create ripple effect
    const rect = currentTarget.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size/2}px`;
    ripple.style.top = `${e.clientY - rect.top - size/2}px`;
    ripple.classList.add('absolute', 'rounded-full', 'bg-white', 'opacity-30', 'animate-ripple', 'pointer-events-none');
    
    currentTarget.appendChild(ripple);
    
    // Remove the ripple after animation completes
    setTimeout(() => {
      try {
        // Check if elements still exist in the DOM before manipulating them
        if (ripple && ripple.parentNode === currentTarget) {
          currentTarget.removeChild(ripple);
        }
      } catch (error) {
        // Silently handle any errors that might occur if elements
        // have been removed from the DOM
        console.log("Ripple removal error handled gracefully");
      }
    }, 600);
    
    // Execute the onClick callback
    onClick();
  };
  
  return (
    <div 
      className="block-container relative mb-3.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Indicator for connected blocks (MusicBlocks style) */}
      {isHovered && (
        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-2.5 h-10 rounded-l-full" 
             style={{ backgroundColor: color, opacity: 0.5 }}></div>
      )}
      
      <div
        className={`music-block cursor-grab overflow-hidden transition-all duration-200 rounded-md shadow-md 
                  ${isHovered ? 'transform translate-x-1 scale-101' : ''}`}
        data-block-type={type}
        onClick={handleClick}
        draggable
        onDragStart={(e) => handleDragStart(e, type)}
        onDragEnd={handleDragEnd}
        style={{ boxShadow: `0 2px 8px ${lightColor(color)}, 0 1px 3px rgba(0,0,0,0.1)` }}
      >
        {/* MusicBlocks-style header with notch and connector designs */}
        <div className="relative">
          {/* Main header background */}
          <div 
            className={`flex items-center text-white px-3 py-2 rounded-t-md relative z-10`} 
            style={{ backgroundColor: color }}
          >
            {/* Block icon with animation */}
            <div className={`w-6 h-6 flex items-center justify-center rounded-full bg-white bg-opacity-30 mr-2 
                           ${type === 'merge' || type === 'revert' ? animations[type as keyof typeof animations] : ''}`}>
              <i className={`${icon} text-white text-sm`}></i>
            </div>
            
            <div className="flex-1">
              <span className="font-medium">{label}</span>
            </div>
            
            {/* Handle for dragging */}
            <div className="block-handle ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-white bg-opacity-20 cursor-grab hover:bg-opacity-30 transition-colors">
              <i className="fas fa-grip-lines text-xs text-white"></i>
            </div>
          </div>
          
          {/* Decorative connector notches (MusicBlocks style) */}
          <div className="absolute top-0 right-1/4 w-2 h-2 bg-white opacity-20 rounded-full"></div>
          <div className="absolute bottom-0 right-1/3 w-2 h-2 bg-white opacity-20 rounded-full"></div>
        </div>
        
        {/* MusicBlocks-style input slots with indicators */}
        <div className="block-body bg-white rounded-b-md relative" style={{ backgroundColor: '#FAFAFA' }}>
          {/* Left decoration strip */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: color, opacity: 0.3 }}></div>
          
          {inputs.map((input, index) => (
            <div 
              key={index} 
              className="block-input relative mx-3 px-3 py-2 my-2 rounded text-sm font-mono text-gray-700 flex items-center"
              style={{
                backgroundColor: lightColor(color),
                borderLeft: `3px solid ${color}`
              }}
            >
              {/* Input icon indicator */}
              <div className="absolute -left-1.5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full" 
                   style={{ backgroundColor: color }}></div>
              
              <i className="fas fa-terminal text-xs mr-2 opacity-60" style={{ color }}></i>
              <span>{input.placeholder}</span>
            </div>
          ))}
          
          {/* Bottom decoration (MusicBlocks style) */}
          <div className="h-1 bg-gray-100 border-t border-gray-200"></div>
        </div>
        
        {/* Enhanced MusicBlocks-style tooltip */}
        {isHovered && (
          <div className="tooltip absolute left-full ml-3 p-3 bg-gray-900 bg-opacity-95 text-white text-xs rounded-md max-w-xs z-10 shadow-lg" 
               style={{ width: '180px', top: '50%', transform: 'translateY(-50%)' }}>
            {/* Header with icon */}
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 rounded-full mr-2 flex items-center justify-center" style={{ backgroundColor: color }}>
                <i className={`${icon} text-white text-xs`}></i>
              </div>
              <div className="font-bold text-sm">{label}</div>
            </div>
            
            <div className="text-gray-300 leading-tight">{tooltip}</div>
            
            {/* Usage hint */}
            <div className="mt-2 text-blue-200 text-xs flex items-center border-t border-gray-700 pt-2">
              <i className="fas fa-lightbulb mr-1.5"></i>
              <span>Drag to add to workspace</span>
            </div>
            
            {/* Tooltip arrow */}
            <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
              <div className="border-8 border-transparent border-r-gray-900 border-opacity-95"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GitBlocks: React.FC<GitBlocksProps> = ({ onBlockClick }) => {
  // Define Git blocks configuration with enhanced MusicBlocks style
  const blocks = [
    {
      type: 'commit' as GitBlockType,
      label: 'commit',
      icon: 'fas fa-code-commit',
      color: '#26A69A',
      tooltip: 'Create a new commit with your changes. A commit is a snapshot of your project at a specific point in time.',
      inputs: [{ placeholder: 'commit message', name: 'message' }],
    },
    {
      type: 'branch' as GitBlockType,
      label: 'branch',
      icon: 'fas fa-code-branch',
      color: '#7E57C2',
      tooltip: 'Create a new branch from current position. Branches let you develop features in isolation.',
      inputs: [{ placeholder: 'branch name', name: 'branchName' }],
    },
    {
      type: 'merge' as GitBlockType,
      label: 'merge',
      icon: 'fas fa-code-merge',
      color: '#FF9800',
      tooltip: 'Merge another branch into current branch. This combines the changes from both branches.',
      inputs: [{ placeholder: 'branch to merge', name: 'branchToMerge' }],
    },
    {
      type: 'checkout' as GitBlockType,
      label: 'checkout',
      icon: 'fas fa-exchange-alt',
      color: '#42A5F5',
      tooltip: 'Switch to a different branch or commit. This changes your active working state.',
      inputs: [{ placeholder: 'branch/commit', name: 'target' }],
    },
    {
      type: 'revert' as GitBlockType,
      label: 'revert',
      icon: 'fas fa-history',
      color: '#EF5350',
      tooltip: 'Undo changes from a specific commit. Creates a new commit that undoes the specified changes.',
      inputs: [{ placeholder: 'commit ID', name: 'commitId' }],
    },
    {
      type: 'issue' as GitBlockType,
      label: 'new issue',
      icon: 'fas fa-exclamation-circle',
      color: '#F44336',
      tooltip: 'Create a new issue to track tasks or bugs. Issues help manage and prioritize work.',
      inputs: [
        { placeholder: 'issue title', name: 'title' },
        { placeholder: 'issue description', name: 'description' },
      ],
    },
  ];

  return (
    <div className="blocks-container px-1">
      {/* MusicBlocks-style category with decorative elements */}
      <div className="category-container mb-5">
        <div className="category-header flex items-center mb-2">
          <div className="w-5 h-5 rounded-full bg-[#26A69A] flex items-center justify-center mr-2">
            <i className="fas fa-cube text-white text-xs"></i>
          </div>
          <h3 className="font-bold text-gray-700">Basic Operations</h3>
        </div>
        
        {/* Left border decoration line (MusicBlocks style) */}
        <div className="category-blocks relative pl-3">
          <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#26A69A] to-[#7E57C2]"></div>
          
          {blocks.slice(0, 3).map(block => (
            <Block
              key={block.type}
              {...block}
              onClick={() => onBlockClick(block.type)}
            />
          ))}
        </div>
      </div>
      
      {/* Advanced Operations with MusicBlocks styling */}
      <div className="category-container mb-5">
        <div className="category-header flex items-center mb-2">
          <div className="w-5 h-5 rounded-full bg-[#42A5F5] flex items-center justify-center mr-2">
            <i className="fas fa-cogs text-white text-xs"></i>
          </div>
          <h3 className="font-bold text-gray-700">Advanced Operations</h3>
        </div>
        
        {/* Left border decoration line (MusicBlocks style) */}
        <div className="category-blocks relative pl-3">
          <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#42A5F5] to-[#F44336]"></div>
          
          {blocks.slice(3).map(block => (
            <Block
              key={block.type}
              {...block}
              onClick={() => onBlockClick(block.type)}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative MusicBlocks-style help note */}
      <div className="help-note bg-blue-50 p-2 rounded-md border-l-4 border-blue-300 mt-4 text-xs text-blue-600">
        <div className="flex items-center mb-1">
          <i className="fas fa-info-circle mr-1.5"></i>
          <span className="font-semibold">Tip: How blocks work</span>
        </div>
        <p className="text-blue-700 opacity-80 pl-1.5">
          Drag blocks to the workspace or click to configure them. Connect blocks to create Git operations.
        </p>
      </div>
    </div>
  );
};

export default GitBlocks;
