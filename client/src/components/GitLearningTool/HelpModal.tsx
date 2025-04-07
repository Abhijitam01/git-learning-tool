import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Git Learning Tool Help</DialogTitle>
          <DialogDescription>
            Learn how to use the Git Learning Tool
          </DialogDescription>
        </DialogHeader>
        
        <div className="help-content space-y-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
            <p className="text-sm text-gray-600">
              The Git Learning Tool helps you learn Git concepts through interactive visualization. 
              You can use the blocks on the left sidebar to perform Git operations, or follow guided lessons.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Git Blocks</h3>
            <p className="text-sm text-gray-600 mb-2">
              The colored blocks on the sidebar represent different Git operations:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li><span className="text-green-600 font-medium">Commit</span>: Create a new commit</li>
              <li><span className="text-blue-600 font-medium">Branch</span>: Create a new branch</li>
              <li><span className="text-purple-600 font-medium">Merge</span>: Merge branches</li>
              <li><span className="text-amber-600 font-medium">Checkout</span>: Switch branches or commits</li>
              <li><span className="text-red-600 font-medium">Revert</span>: Undo a commit</li>
              <li><span className="text-gray-600 font-medium">Issue</span>: Create an issue ticket</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Lessons</h3>
            <p className="text-sm text-gray-600">
              Follow guided lessons to learn Git concepts step by step. Each lesson consists of multiple steps 
              that will teach you different aspects of Git. Your progress is saved automatically.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Visualization</h3>
            <p className="text-sm text-gray-600">
              The visualization in the center shows your Git repository. Commits are shown as hexagons, 
              connected by lines representing the commit history. Each branch has a different color.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;