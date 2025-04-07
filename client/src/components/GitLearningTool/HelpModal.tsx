import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Git Learning Tool Help</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg mb-2">Getting Started</h3>
            <p className="mb-4">
              Welcome to the Git Learning Tool! This interactive platform helps you understand Git concepts through
              hands-on practice with a visual interface.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">How to Use the Tool</h3>
            <ol className="list-decimal pl-5 mb-4 space-y-2">
              <li>Drag Git operation blocks from the left toolbox to the visualization area</li>
              <li>Fill in required information (e.g., commit messages, branch names)</li>
              <li>Watch how the Git graph updates with your actions</li>
              <li>Follow lesson guides to learn Git concepts step by step</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Git Operations</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-1 text-[#26A69A]">Commit</div>
                <p className="text-sm">Saves your changes as a snapshot in the Git history</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-1 text-[#7E57C2]">Branch</div>
                <p className="text-sm">Creates a new line of development</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-1 text-[#FF9800]">Merge</div>
                <p className="text-sm">Combines changes from one branch into another</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-1 text-[#42A5F5]">Checkout</div>
                <p className="text-sm">Switches to a different branch or commit</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-1 text-[#EF5350]">Revert</div>
                <p className="text-sm">Undoes changes from a specific commit</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Lessons</h3>
            <p className="mb-2">
              Follow structured lessons to learn Git concepts progressively:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Intro to Git - Understand basic concepts</li>
              <li>Creating Commits - Learn to save your work</li>
              <li>Branching & Merging - Work with parallel development</li>
              <li>Advanced Git - Master advanced workflows</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
            <div className="flex items-start">
              <i className="fas fa-lightbulb text-blue-500 mt-1 mr-3"></i>
              <div>
                <div className="font-medium text-blue-800 mb-1">Tip</div>
                <p className="text-blue-800 text-sm">
                  Hover over blocks to see tooltips explaining Git concepts. Take your time to understand how
                  each action affects the Git graph.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
