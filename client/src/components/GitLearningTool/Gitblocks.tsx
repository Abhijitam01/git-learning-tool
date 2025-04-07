import React from 'react';
import { useDrag } from '@/hooks/useDrag';
import { GitBlockType } from '@/hooks/useGitOperations';

interface GitBlocksProps {
  onBlockClick: (blockType: GitBlockType) => void;
}

const GitBlocks: React.FC<GitBlocksProps> = ({ onBlockClick }) => {
  const { handleDragStart, handleDragEnd } = useDrag();
  
  const blocks = [
    {
      type: 'commit' as GitBlockType,
      label: 'Commit',
      icon: 'fa-plus',
      color: '#4CAF50',
      tooltip: 'Create a new commit',
      inputs: [
        {
          placeholder: 'Enter commit message',
          name: 'message',
        },
      ],
    },
    {
      type: 'branch' as GitBlockType,
      label: 'Branch',
      icon: 'fa-code-branch',
      color: '#2196F3',
      tooltip: 'Create a new branch',
      inputs: [
        {
          placeholder: 'Enter branch name',
          name: 'name',
        },
      ],
    },
    {
      type: 'merge' as GitBlockType,
      label: 'Merge',
      icon: 'fa-code-merge',
      color: '#9C27B0',
      tooltip: 'Merge a branch into current branch',
      inputs: [
        {
          placeholder: 'Enter source branch name',
          name: 'sourceBranch',
        },
      ],
    },
    {
      type: 'checkout' as GitBlockType,
      label: 'Checkout',
      icon: 'fa-exchange-alt',
      color: '#FF9800',
      tooltip: 'Switch to a different branch or commit',
      inputs: [
        {
          placeholder: 'Enter branch name or commit ID',
          name: 'target',
        },
      ],
    },
    {
      type: 'revert' as GitBlockType,
      label: 'Revert',
      icon: 'fa-undo',
      color: '#F44336',
      tooltip: 'Revert a previous commit',
      inputs: [
        {
          placeholder: 'Enter commit ID to revert',
          name: 'commitId',
        },
      ],
    },
    {
      type: 'issue' as GitBlockType,
      label: 'Issue',
      icon: 'fa-exclamation-circle',
      color: '#607D8B',
      tooltip: 'Create an issue ticket',
      inputs: [
        {
          placeholder: 'Enter issue title',
          name: 'title',
        },
        {
          placeholder: 'Enter issue description',
          name: 'description',
        },
      ],
    },
  ];
  
  return (
    <div className="git-blocks p-4">
      <h3 className="text-lg font-bold mb-3">Git Blocks</h3>
      <div className="grid grid-cols-2 gap-3">
        {blocks.map((block) => (
          <div
            key={block.type}
            className="block-item p-3 rounded-lg shadow-sm cursor-pointer transform transition-transform hover:scale-105"
            style={{ backgroundColor: block.color }}
            onClick={() => onBlockClick(block.type)}
            draggable
            onDragStart={(e) => handleDragStart(e, block.type)}
            onDragEnd={handleDragEnd}
            title={block.tooltip}
          >
            <div className="flex items-center text-white">
              <div className="flex-shrink-0 mr-2 bg-white bg-opacity-20 w-8 h-8 rounded-md flex items-center justify-center">
                <i className={`fas ${block.icon}`}></i>
              </div>
              <span className="font-medium">{block.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitBlocks;