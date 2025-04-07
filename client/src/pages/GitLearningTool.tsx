import React, { useState, useEffect } from 'react';
import GitBlocks from '@/components/GitLearningTool/GitBlocks';
import GitVisualization from '@/components/GitLearningTool/GitVisualization';
import InstructionPanel from '@/components/GitLearningTool/InstructionPanel';
import GitToolbar from '@/components/GitLearningTool/GitToolbar';
import HelpModal from '@/components/GitLearningTool/HelpModal';
import LessonCard from '@/components/GitLearningTool/LessonCard';
import { useGit } from '@/context/GitContext';
import { useLesson } from '@/context/LessonContext';
import { useGitOperations } from '@/hooks/useGitOperations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

const GitLearningTool: React.FC = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [scale, setScale] = useState(1);
  const { state, saveState, resetState } = useGit();
  const { lessons, lessonProgress, currentLesson, setCurrentLesson } = useLesson();
  const { formState, openForm, closeForm, handleInputChange, executeOperation } = useGitOperations();
  const { toast } = useToast();

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

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleFitView = () => {
    setScale(1);
  };

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
                placeholder="Enter new branch name"
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
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formState.inputs.sourceBranch || ''}
                onChange={(e) => handleInputChange('sourceBranch', e.target.value)}
              >
                <option value="">Select a branch to merge</option>
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
                <optgroup label="Commits">
                  {state.commits.map(commit => (
                    <option key={commit.id} value={commit.id}>
                      {commit.message.slice(0, 20)}... [{commit.id.slice(0, 7)}]
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
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formState.inputs.commitId || ''}
                onChange={(e) => handleInputChange('commitId', e.target.value)}
              >
                <option value="">Select commit to revert</option>
                {state.commits.map(commit => (
                  <option key={commit.id} value={commit.id}>
                    {commit.message.slice(0, 20)}... [{commit.id.slice(0, 7)}]
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
                placeholder="Describe the issue"
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
    <div className="flex flex-col h-screen">
      {/* MusicBlocks-style Top Navigation Bar */}
      <nav className="bg-[#2196F3] text-white p-2 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
          >
            <i className="fas fa-play"></i>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
          >
            <i className="fas fa-stop"></i>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
          >
            <i className="fas fa-sync-alt"></i>
          </Button>
          <div className="h-8 w-px bg-blue-400 mx-1"></div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
            onClick={handleSave}
            title="Save Project"
          >
            <i className="fas fa-save"></i>
          </Button>
          <div className="h-8 w-8 ml-2 bg-[#2196F3] text-white rounded-full flex items-center justify-center shadow-md">
            <i className="fas fa-code-branch text-lg"></i>
          </div>
        </div>
        
        <div className="text-center font-bold text-xl">
          <h1>Git Learning Tool</h1>
        </div>
        
        <div className="flex space-x-2">
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
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
            title="GitHub"
            onClick={() => window.open('https://github.com/Abhijitam01/git-learning-tool', '_blank')}
          >
            <i className="fab fa-github"></i>
          </Button>
        </div>
      </nav>

      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar - Toolbox (MusicBlocks style) */}
        <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* MusicBlocks-style toolbar header */}
          <div className="p-3 bg-[#F5F5F5] border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="bg-[#2196F3] text-white w-8 h-8 rounded-full flex items-center justify-center">
                <i className="fas fa-code-branch"></i>
              </div>
              <div>
                <h2 className="font-bold text-lg">Git Blocks</h2>
                <p className="text-xs text-gray-500">Drag blocks to workspace</p>
              </div>
            </div>
          </div>
          
          {/* Tab navigation (MusicBlocks style) */}
          <div className="mb-tabs border-b border-gray-200 px-2 flex">
            <div 
              className={`mb-tab flex items-center py-2 px-3 cursor-pointer ${!showDocumentation ? 'active' : ''}`}
              onClick={() => setShowDocumentation(false)}
            >
              <i className={`fas fa-cubes mr-2 ${!showDocumentation ? 'text-blue-500' : 'text-gray-400'}`}></i>
              <span className="font-medium">Blocks</span>
            </div>
            <div 
              className={`mb-tab flex items-center py-2 px-3 cursor-pointer ${showDocumentation ? 'active' : ''}`}
              onClick={() => setShowDocumentation(true)}
            >
              <i className={`fas fa-book mr-2 ${showDocumentation ? 'text-blue-500' : 'text-gray-400'}`}></i>
              <span className="font-medium">Documentation</span>
            </div>
          </div>
          
          {/* Blocks or Documentation area */}
          <div className="overflow-y-auto p-3 flex-grow">
            {showDocumentation ? (
              <div className="documentation-container">
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                  <i className="fas fa-book text-[#2196F3] mr-2"></i> Git Learning Tool Documentation
                </h2>
                
                <Tabs defaultValue="usage" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="usage" className="data-[state=active]:bg-[#2196F3] data-[state=active]:text-white">
                      <i className="fas fa-play-circle mr-1.5"></i> How It Works
                    </TabsTrigger>
                    <TabsTrigger value="blocks" className="data-[state=active]:bg-[#2196F3] data-[state=active]:text-white">
                      <i className="fas fa-cubes mr-1.5"></i> Git Blocks
                    </TabsTrigger>
                    <TabsTrigger value="musicblocks" className="data-[state=active]:bg-[#2196F3] data-[state=active]:text-white">
                      <i className="fas fa-music mr-1.5"></i> MusicBlocks
                    </TabsTrigger>
                    <TabsTrigger value="github" className="data-[state=active]:bg-[#2196F3] data-[state=active]:text-white">
                      <i className="fab fa-github mr-1.5"></i> GitHub
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="usage" className="space-y-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-bold text-blue-800 mb-2">Getting Started</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        The Git Learning Tool is an interactive way to learn Git concepts through visualization:
                      </p>
                      <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li>Drag blocks from the left panel to the workspace</li>
                        <li>Fill in the required information in the form</li>
                        <li>See the Git visualization update in real-time</li>
                        <li>Follow guided lessons to learn Git concepts step-by-step</li>
                      </ol>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="blocks" className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg">
                        <div className="font-bold text-blue-600 mb-1 flex items-center">
                          <i className="fas fa-code-commit mr-1.5"></i> Commit
                        </div>
                        <p className="text-sm text-gray-600">Creates a snapshot of your changes with a descriptive message.</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-bold text-green-600 mb-1 flex items-center">
                          <i className="fas fa-code-branch mr-1.5"></i> Branch
                        </div>
                        <p className="text-sm text-gray-600">Creates a new line of development to work on features or fixes.</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-bold text-purple-600 mb-1 flex items-center">
                          <i className="fas fa-code-merge mr-1.5"></i> Merge
                        </div>
                        <p className="text-sm text-gray-600">Combines changes from one branch into another.</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-bold text-amber-600 mb-1 flex items-center">
                          <i className="fas fa-exchange-alt mr-1.5"></i> Checkout
                        </div>
                        <p className="text-sm text-gray-600">Switches between branches or restores files.</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="musicblocks" className="space-y-4">
                    <div className="p-4 border rounded-lg bg-green-50">
                      <h3 className="font-bold text-green-800 mb-2">MusicBlocks Integration</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        This tool is designed to integrate with MusicBlocks as part of a GSoC project:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Matches MusicBlocks UI/UX design patterns</li>
                        <li>Provides a similar block-based interaction model</li>
                        <li>Teaches Git concepts relevant to MusicBlocks development</li>
                        <li>Prepares users to contribute to open-source projects</li>
                      </ul>
                      <div className="mt-3">
                        <a href="https://github.com/sugarlabs/musicblocks" className="text-blue-500 hover:underline text-sm flex items-center">
                          <i className="fab fa-github mr-1"></i> MusicBlocks Repository
                        </a>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="github" className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-bold text-gray-800 mb-2">GitHub Integration</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Future versions of this tool will include GitHub integration:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Connect to your GitHub account</li>
                        <li>Clone, create, and manage real repositories</li>
                        <li>Create pull requests and issues</li>
                        <li>View repository history and branches</li>
                      </ul>
                      <div className="mt-3 text-sm text-amber-600">
                        <i className="fas fa-tools mr-1"></i> This feature is currently in development.
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <GitBlocks onBlockClick={openForm} />
            )}
          </div>
          
          {/* Lessons Section (MusicBlocks style) */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="w-5 h-5 bg-green-500 text-white flex items-center justify-center rounded-full mr-2">
                <i className="fas fa-graduation-cap text-xs"></i>
              </div>
              <div className="font-bold">Lessons & Tutorials</div>
            </div>
            <div className="flex overflow-x-auto pb-2 space-x-2">
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
            <div className="mt-2 text-xs text-blue-500 flex items-center cursor-pointer">
              <i className="fas fa-plus-circle mr-1"></i>
              <span>Browse more tutorials</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-3/4 flex flex-col">
          <GitToolbar
            currentBranch={state.currentBranch}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitView={handleFitView}
          />
          
          <GitVisualization
            gitState={state}
            scale={scale}
            onBlockDrop={(blockType) => openForm(blockType)}
          />
          
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
