import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGit } from '@/context/GitContext';

interface GitToolbarProps {
  currentBranch: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

const GitToolbar: React.FC<GitToolbarProps> = ({
  currentBranch,
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  const { createCommit, createBranch, mergeBranch, checkout, revertCommit, state } = useGit();
  
  return (
    <div className="p-2 bg-[#F5F5F5] border-b border-gray-200 flex justify-between items-center">
      {/* Left section with visualization controls (MusicBlocks style) */}
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-full p-1.5"
          onClick={onZoomIn}
          title="Zoom In"
        >
          <i className="fas fa-search-plus"></i>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-full p-1.5"
          onClick={onZoomOut}
          title="Zoom Out"
        >
          <i className="fas fa-search-minus"></i>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-full p-1.5"
          onClick={onFitView}
          title="Fit to View"
        >
          <i className="fas fa-expand"></i>
        </Button>
        <div className="h-8 mx-2 border-l border-gray-300"></div>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-full p-1.5"
          title="Toggle Grid"
        >
          <i className="fas fa-border-all"></i>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-full p-1.5"
          title="Toggle Minimap"
        >
          <i className="fas fa-map"></i>
        </Button>
      </div>
      
      {/* Center section with branch info (MusicBlocks style) */}
      <div className="flex items-center px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-200">
        <span className="mr-2 text-gray-500 text-sm font-medium">Branch:</span>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full mr-1.5" style={{backgroundColor: state.branches.find(b => b.name === currentBranch)?.color || '#7E57C2'}}></span>
          <span id="current-branch" className="font-mono text-sm font-medium">{currentBranch}</span>
        </div>
      </div>
      
      {/* Right section with actions (MusicBlocks style) */}
      <div className="flex items-center space-x-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#2196F3] text-white px-3 py-1.5 rounded-full shadow-sm font-medium hover:bg-blue-600 flex items-center space-x-1.5">
              <i className="fas fa-plus"></i>
              <span>Actions</span>
              <i className="fas fa-chevron-down text-xs ml-1 opacity-70"></i>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1">
            <DropdownMenuItem className="cursor-pointer rounded-md mb-1 p-2 hover:bg-blue-50" onClick={() => document.dispatchEvent(new CustomEvent('openGitModal', { detail: 'commit' }))}>
              <div className="w-6 h-6 rounded-full bg-[#26A69A] flex items-center justify-center text-white mr-2">
                <i className="fas fa-code-commit text-xs"></i>
              </div>
              <span>Commit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md mb-1 p-2 hover:bg-blue-50" onClick={() => document.dispatchEvent(new CustomEvent('openGitModal', { detail: 'branch' }))}>
              <div className="w-6 h-6 rounded-full bg-[#7E57C2] flex items-center justify-center text-white mr-2">
                <i className="fas fa-code-branch text-xs"></i>
              </div>
              <span>Branch</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md mb-1 p-2 hover:bg-blue-50" onClick={() => document.dispatchEvent(new CustomEvent('openGitModal', { detail: 'merge' }))}>
              <div className="w-6 h-6 rounded-full bg-[#FF9800] flex items-center justify-center text-white mr-2">
                <i className="fas fa-code-merge text-xs"></i>
              </div>
              <span>Merge</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-md mb-1 p-2 hover:bg-blue-50" onClick={() => document.dispatchEvent(new CustomEvent('openGitModal', { detail: 'checkout' }))}>
              <div className="w-6 h-6 rounded-full bg-[#42A5F5] flex items-center justify-center text-white mr-2">
                <i className="fas fa-exchange-alt text-xs"></i>
              </div>
              <span>Checkout</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md p-2 hover:bg-blue-50" onClick={() => document.dispatchEvent(new CustomEvent('openGitModal', { detail: 'revert' }))}>
              <div className="w-6 h-6 rounded-full bg-[#EF5350] flex items-center justify-center text-white mr-2">
                <i className="fas fa-history text-xs"></i>
              </div>
              <span>Revert</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full px-3 py-1.5 flex items-center space-x-1.5"
        >
          <i className="fas fa-camera"></i>
          <span className="text-sm">Snapshot</span>
        </Button>
      </div>
    </div>
  );
};

export default GitToolbar;
