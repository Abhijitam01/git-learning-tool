import React from 'react';
import { Button } from '../../components/ui/button';

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
  return (
    <div className="git-toolbar p-2 flex items-center justify-between border-b border-gray-200 bg-gray-50">
      <div className="flex items-center">
        <div className="font-medium text-gray-700 mr-2">Current Branch:</div>
        <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-mono text-sm">
          {currentBranch}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onZoomIn}
          className="w-8 h-8 p-0" 
          title="Zoom In"
        >
          <i className="fas fa-plus"></i>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onZoomOut}
          className="w-8 h-8 p-0" 
          title="Zoom Out"
        >
          <i className="fas fa-minus"></i>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onFitView}
          className="w-8 h-8 p-0" 
          title="Fit View"
        >
          <i className="fas fa-compress-arrows-alt"></i>
        </Button>
      </div>
    </div>
  );
};

export default GitToolbar;