import React, { useState } from 'react';
import { useGit } from '@/context/GitContext';
import { useLesson } from '@/context/LessonContext';
import { useGitOperations, GitBlockType } from '../hooks/useGitOperations';
import { useToast } from '../hooks/use-toast';

import GitBlocks from '@/components/GitLearningTool/GitBlocks';
import GitVisualization from '@/components/GitLearningTool/GitVisualization';
import GitToolbar from '@/components/GitLearningTool/GitToolbar';
import InstructionPanel from '@/components/GitLearningTool/InstructionPanel';
import LessonCard from '@/components/GitLearningTool/LessonCard';
import HelpModal from '@/components/GitLearningTool/HelpModal';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const GitLearningTool: React.FC = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [scale, setScale] = useState(1);
  
  const { state, saveState, resetState } = useGit();
  const { lessons, lessonProgress, currentLesson, setCurrentLesson } = useLesson();
  const { formState, openForm, closeForm, handleInputChange, executeOperation } = useGitOperations();
  const { toast } = useToast();
  
  // Zoom controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleFitView = () => {
    setScale(1);
  };
  
  // Save and reset handlers
  const handleSave = () => {
    saveState();
    toast({
      title: "Project saved",
      description: "Your Git project has been saved to local storage.",
    });
  };
  
  const handleReset = () => {
    resetState();
    toast({
      title: "Project reset",
      description: "Your Git project has been reset to initial state.",
    });
  };
  
  // Render form inputs based on block type
  const renderFormInputs = () => {
    if (!formState.blockType) return null;
    
    switch (formState.blockType) {
      case 'commit':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Commit Message</Label>
              <Input
                id="message"
                placeholder="Enter a descriptive commit message"
                value={formState.inputs.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'branch':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name</Label>
              <Input
                id="name"
                placeholder="Enter a branch name"
                value={formState.inputs.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'merge':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceBranch">Source Branch</Label>
              <select
                id="sourceBranch"
                className="w-full p-2 border rounded-md"
                value={formState.inputs.sourceBranch || ''}
                onChange={(e) => handleInputChange('sourceBranch', e.target.value)}
              >
                <option value="">Select branch to merge</option>
                {state.branches
                  .filter(branch => branch.name !== state.currentBranch)
                  .map(branch => (
                    <option key={branch.name} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        );
      
      case 'checkout':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target">Checkout Target</Label>
              <select
                id="target"
                className="w-full p-2 border rounded-md"
                value={formState.inputs.target || ''}
                onChange={(e) => handleInputChange('target', e.target.value)}
              >
                <option value="">Select branch or commit</option>
                <optgroup label="Branches">
                  {state.branches.map(branch => (
                    <option key={branch.name} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Recent Commits">
                  {state.commits.slice(-5).map(commit => (
                    <option key={commit.id} value={commit.id}>
                      {commit.message.slice(0, 30)} ({commit.id.slice(0, 7)})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        );
      
      case 'revert':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commitId">Commit to Revert</Label>
              <select
                id="commitId"
                className="w-full p-2 border rounded-md"
                value={formState.inputs.commitId || ''}
                onChange={(e) => handleInputChange('commitId', e.target.value)}
              >
                <option value="">Select commit to revert</option>
                {state.commits.map(commit => (
                  <option key={commit.id} value={commit.id}>
                    {commit.message.slice(0, 30)} ({commit.id.slice(0, 7)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      
      case 'issue':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                placeholder="Enter issue title"
                value={formState.inputs.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Issue Description</Label>
              <Textarea
                id="description"
                placeholder="Enter issue description"
                value={formState.inputs.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="git-learning-tool flex flex-col h-screen">
      {/* Top Navigation Bar - MusicBlocks style */}
      <nav className="bg-[#2196F3] text-white p-2 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="font-bold text-xl mr-4 flex items-center">
            <i className="fas fa-code-branch mr-2"></i>
            Git Learning Tool
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
            onClick={handleSave}
            title="Save Project"
          >
            <i className="fas fa-save"></i>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-blue-600 w-8 h-8 p-0"
                title="Reset Project"
              >
                <i className="fas fa-undo"></i>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset your current Git project. All your progress will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
            onClick={() => setShowHelpModal(true)}
            title="Help"
          >
            <i className="fas fa-question-circle"></i>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
            title="Settings"
          >
            <i className="fas fa-cog"></i>
          </Button>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Git Blocks */}
          <GitBlocks onBlockClick={openForm} />
          
          {/* Lessons Section */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-lg font-bold mb-3">Lessons</h3>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
              {lessons.map(lesson => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={lessonProgress[lesson.id]}
                  isActive={currentLesson?.id === lesson.id}
                  onClick={() => setCurrentLesson(lesson.id)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="w-3/4 flex flex-col">
          {/* Git Toolbar */}
          <GitToolbar
            currentBranch={state.currentBranch}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitView={handleFitView}
          />
          
          {/* Git Visualization */}
          <div className="flex-1 overflow-hidden">
            <GitVisualization
              gitState={state}
              scale={scale}
              onBlockDrop={(blockType) => openForm(blockType)}
            />
          </div>
          
          {/* Instruction Panel */}
          <InstructionPanel />
        </div>
      </div>
      
      {/* Git Operation Dialog */}
      <Dialog open={formState.isOpen} onOpenChange={closeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formState.blockType && formState.blockType.charAt(0).toUpperCase() + formState.blockType.slice(1)}
            </DialogTitle>
          </DialogHeader>
          {renderFormInputs()}
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button onClick={executeOperation}>
              Execute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};

export default GitLearningTool;