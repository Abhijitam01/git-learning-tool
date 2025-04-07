import React from 'react';
import { useLesson } from '@/context/LessonContext';
import { useGit } from '@/context/GitContext';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const InstructionPanel: React.FC = () => {
  const { currentLesson, lessonProgress, nextStep, previousStep, checkStepCompletion } = useLesson();
  const { state: gitState } = useGit();
  const [showDocumentation, setShowDocumentation] = useState(false);
  
  // If no lesson is selected, show documentation or welcome message
  if (!currentLesson) {
    return (
      <div className="bg-[#F8F9FA] border-t border-gray-200 p-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
        {!showDocumentation ? (
          // Welcome message with MusicBlocks style
          <div className="speech-bubble bg-gradient-to-r from-blue-50 to-white shadow-sm border border-blue-100 mb-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#2196F3] flex items-center justify-center mr-3 flex-shrink-0">
                <i className="fas fa-code-branch text-white"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Welcome to Git Learning Tool</h3>
                <p className="text-gray-600 mt-1 leading-relaxed">
                  Select a lesson from the sidebar to begin your Git learning journey, 
                  or experiment freely with the Git operations.
                </p>
                
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" className="rounded-full border-blue-300 text-blue-600 hover:bg-blue-50">
                    <i className="fas fa-lightbulb mr-1.5"></i> Start Tutorial
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="rounded-full text-gray-600 hover:bg-gray-100"
                    onClick={() => setShowDocumentation(true)}
                  >
                    <i className="fas fa-book mr-1.5"></i> Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Colorful documentation display
          <div className="documentation-container">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-book text-[#2196F3] mr-2"></i> Git Learning Tool Documentation
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDocumentation(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </Button>
            </div>
            
            <Tabs defaultValue="usage" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="usage" className="data-[state=active]:bg-[#2196F3] data-[state=active]:text-white">
                  <i className="fas fa-play-circle mr-1.5"></i> How It Works
                </TabsTrigger>
                <TabsTrigger value="blocks" className="data-[state=active]:bg-[#FF9800] data-[state=active]:text-white">
                  <i className="fas fa-cubes mr-1.5"></i> Git Blocks
                </TabsTrigger>
                <TabsTrigger value="integration" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">
                  <i className="fas fa-plug mr-1.5"></i> Integration
                </TabsTrigger>
                <TabsTrigger value="faq" className="data-[state=active]:bg-[#9C27B0] data-[state=active]:text-white">
                  <i className="fas fa-question-circle mr-1.5"></i> FAQ
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="usage" className="mt-0">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    <i className="fas fa-info-circle text-blue-600 mr-2"></i> Getting Started
                  </h3>
                  <p className="text-blue-700 mb-3">
                    The Git Learning Tool helps you understand Git concepts through an interactive, visual interface. 
                    Drag blocks from the left sidebar to perform Git operations and see their effects in real-time.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3 mb-2">
                    <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                      <h4 className="font-medium text-blue-800"><i className="fas fa-mouse-pointer text-blue-500 mr-1.5"></i> Basic Interaction</h4>
                      <p className="text-sm text-gray-600">Drag blocks from the left panel or click them to execute Git commands. The visualization updates automatically.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                      <h4 className="font-medium text-blue-800"><i className="fas fa-chalkboard-teacher text-blue-500 mr-1.5"></i> Lessons</h4>
                      <p className="text-sm text-gray-600">Select a lesson from the sidebar to follow a guided tutorial on specific Git workflows.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                      <h4 className="font-medium text-blue-800"><i className="fas fa-eye text-blue-500 mr-1.5"></i> Visualization</h4>
                      <p className="text-sm text-gray-600">The center panel shows your Git repository visually. Commits appear as hexagons, connected by branches.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                    <i className="fas fa-magic text-indigo-600 mr-2"></i> Tool Features
                  </h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-indigo-200">
                      <AccordionTrigger className="text-indigo-700 hover:text-indigo-900">
                        <i className="fas fa-sitemap mr-2"></i> Visual Git Repository
                      </AccordionTrigger>
                      <AccordionContent className="text-indigo-700">
                        The central visualization displays commits, branches, and their relationships. Hover over commits for details, 
                        and use the toolbar to zoom and navigate. Each branch has a distinct color for easy identification.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2" className="border-indigo-200">
                      <AccordionTrigger className="text-indigo-700 hover:text-indigo-900">
                        <i className="fas fa-cubes mr-2"></i> Block-Based Operations
                      </AccordionTrigger>
                      <AccordionContent className="text-indigo-700">
                        Blocks in the left sidebar represent different Git operations. Click a block to open a form 
                        for that operation, or drag it onto the visualization. The blocks follow MusicBlocks' visual style 
                        for a consistent experience.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3" className="border-indigo-200">
                      <AccordionTrigger className="text-indigo-700 hover:text-indigo-900">
                        <i className="fas fa-graduation-cap mr-2"></i> Interactive Lessons
                      </AccordionTrigger>
                      <AccordionContent className="text-indigo-700">
                        Lessons guide you through common Git workflows step by step. Each step has clear instructions
                        and validation to ensure you've correctly performed the required operations. Progress is tracked
                        and saved automatically.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4" className="border-indigo-200">
                      <AccordionTrigger className="text-indigo-700 hover:text-indigo-900">
                        <i className="fas fa-save mr-2"></i> Progress Tracking
                      </AccordionTrigger>
                      <AccordionContent className="text-indigo-700">
                        Your progress through lessons and your Git repository state are saved automatically. You can
                        return to continue where you left off, or reset to start fresh.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="blocks" className="mt-0">
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 mb-4">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">
                    <i className="fas fa-cubes text-amber-600 mr-2"></i> Git Blocks Reference
                  </h3>
                  <p className="text-amber-700 mb-3">
                    The Git Learning Tool provides the following blocks for performing Git operations. Each block represents a specific Git command.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                      <h4 className="font-medium text-amber-800 flex items-center">
                        <div className="w-6 h-6 rounded-md bg-[#4CAF50] flex items-center justify-center mr-2">
                          <i className="fas fa-plus text-white text-xs"></i>
                        </div>
                        Commit
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">Creates a new commit with your changes and a message describing what you did.</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                      <h4 className="font-medium text-amber-800 flex items-center">
                        <div className="w-6 h-6 rounded-md bg-[#2196F3] flex items-center justify-center mr-2">
                          <i className="fas fa-code-branch text-white text-xs"></i>
                        </div>
                        Branch
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">Creates a new branch from the current commit, letting you work on features separately.</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                      <h4 className="font-medium text-amber-800 flex items-center">
                        <div className="w-6 h-6 rounded-md bg-[#9C27B0] flex items-center justify-center mr-2">
                          <i className="fas fa-code-merge text-white text-xs"></i>
                        </div>
                        Merge
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">Combines changes from one branch into another, integrating feature work.</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                      <h4 className="font-medium text-amber-800 flex items-center">
                        <div className="w-6 h-6 rounded-md bg-[#FF9800] flex items-center justify-center mr-2">
                          <i className="fas fa-exchange-alt text-white text-xs"></i>
                        </div>
                        Checkout
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">Switches to a different branch or commit, changing what you're working on.</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                      <h4 className="font-medium text-amber-800 flex items-center">
                        <div className="w-6 h-6 rounded-md bg-[#F44336] flex items-center justify-center mr-2">
                          <i className="fas fa-undo text-white text-xs"></i>
                        </div>
                        Revert
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">Undoes a specific commit, creating a new commit that reverses the changes.</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                      <h4 className="font-medium text-amber-800 flex items-center">
                        <div className="w-6 h-6 rounded-md bg-[#607D8B] flex items-center justify-center mr-2">
                          <i className="fas fa-exclamation-circle text-white text-xs"></i>
                        </div>
                        Issue
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">Creates a note about a problem or feature request for future work.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">
                    <i className="fas fa-cogs text-amber-600 mr-2"></i> How to Use Blocks
                  </h3>
                  
                  <ol className="list-decimal list-inside text-amber-700 space-y-2 ml-2">
                    <li>Click on a block in the left sidebar or drag it to the visualization area</li>
                    <li>Fill in the required information in the form that appears</li>
                    <li>Click "Execute" to apply the Git operation</li>
                    <li>Watch the visualization update to reflect your changes</li>
                    <li>Use the toolbar to navigate and zoom the visualization</li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-amber-100 rounded border border-amber-200">
                    <h4 className="font-medium text-amber-800 flex items-center">
                      <i className="fas fa-lightbulb text-amber-600 mr-2"></i> Tip
                    </h4>
                    <p className="text-sm text-amber-700">
                      Blocks are color-coded according to their function. Green for additions, blue for navigation, 
                      purple for merging, and red for reversals. This matches common Git interface conventions.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="integration" className="mt-0">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    <i className="fas fa-plug text-green-600 mr-2"></i> MusicBlocks Integration
                  </h3>
                  <p className="text-green-700 mb-3">
                    The Git Learning Tool is designed to integrate seamlessly with MusicBlocks, extending the platform
                    with version control capabilities for music programming projects.
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm mb-3">
                    <h4 className="font-medium text-green-800">
                      <i className="fas fa-puzzle-piece text-green-600 mr-1.5"></i> Integration Methods
                    </h4>
                    <div className="mt-2 text-sm text-gray-600 space-y-2">
                      <div className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 mt-0.5 mr-2">1</div>
                        <p><span className="font-medium text-green-700">Embedded Component:</span> Import the Git Learning Tool as a React component within MusicBlocks.</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 mt-0.5 mr-2">2</div>
                        <p><span className="font-medium text-green-700">Iframe Integration:</span> Load the tool in an iframe if frameworks are incompatible.</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 mt-0.5 mr-2">3</div>
                        <p><span className="font-medium text-green-700">Standalone Mode:</span> Deploy as a separate application linked from MusicBlocks.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                    <h4 className="font-medium text-green-800">
                      <i className="fas fa-exchange-alt text-green-600 mr-1.5"></i> Data & Project Sharing
                    </h4>
                    <div className="mt-2 text-sm text-gray-600 space-y-2">
                      <div className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 mt-0.5 mr-2">1</div>
                        <p><span className="font-medium text-green-700">Project Export/Import:</span> Export MusicBlocks projects to Git repositories and vice versa.</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 mt-0.5 mr-2">2</div>
                        <p><span className="font-medium text-green-700">Version Control:</span> Track changes to music compositions using Git history.</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 mt-0.5 mr-2">3</div>
                        <p><span className="font-medium text-green-700">Collaborative Workflow:</span> Enable multiple musicians to collaborate on projects.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    <i className="fas fa-code text-green-600 mr-2"></i> GitHub Integration
                  </h3>
                  <p className="text-green-700 mb-3">
                    Future versions will connect to real GitHub repositories, enabling authentic Git operations.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                      <h4 className="font-medium text-green-800"><i className="fas fa-user-lock text-green-500 mr-1.5"></i> Authentication</h4>
                      <p className="text-sm text-gray-600">Connect with your GitHub account using secure OAuth authentication.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                      <h4 className="font-medium text-green-800"><i className="fas fa-cloud-download-alt text-green-500 mr-1.5"></i> Repository Access</h4>
                      <p className="text-sm text-gray-600">Clone, create, and manage your GitHub repositories directly from the tool.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                      <h4 className="font-medium text-green-800"><i className="fas fa-users text-green-500 mr-1.5"></i> Collaboration</h4>
                      <p className="text-sm text-gray-600">Work with others on shared projects using GitHub's collaboration features.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-0">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    <i className="fas fa-question-circle text-purple-600 mr-2"></i> Frequently Asked Questions
                  </h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="faq-1" className="border-purple-200">
                      <AccordionTrigger className="text-purple-700 hover:text-purple-900">
                        Is this tool connected to a real Git repository?
                      </AccordionTrigger>
                      <AccordionContent className="text-purple-700">
                        Currently, the Git Learning Tool simulates Git operations for educational purposes. It doesn't connect
                        to actual repositories. Future versions will add GitHub integration for real repository operations.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-2" className="border-purple-200">
                      <AccordionTrigger className="text-purple-700 hover:text-purple-900">
                        How does the tool integrate with MusicBlocks?
                      </AccordionTrigger>
                      <AccordionContent className="text-purple-700">
                        The Git Learning Tool is designed as a complementary component for MusicBlocks. It can be integrated
                        as an embedded component, through an iframe, or as a standalone application. The UI matches MusicBlocks'
                        style for a consistent experience.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-3" className="border-purple-200">
                      <AccordionTrigger className="text-purple-700 hover:text-purple-900">
                        Can I save my progress and Git repository state?
                      </AccordionTrigger>
                      <AccordionContent className="text-purple-700">
                        Yes, your progress through lessons and your Git repository state are automatically saved. You can
                        return later and continue where you left off. You can also manually save your state using the
                        Save button in the navigation bar.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-4" className="border-purple-200">
                      <AccordionTrigger className="text-purple-700 hover:text-purple-900">
                        How do I start learning Git with this tool?
                      </AccordionTrigger>
                      <AccordionContent className="text-purple-700">
                        To start learning, select a lesson from the sidebar. Each lesson guides you through specific
                        Git workflows step by step. Follow the instructions in the panel, and use the Git blocks to
                        complete each task. The visualization will update to show your progress.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-5" className="border-purple-200">
                      <AccordionTrigger className="text-purple-700 hover:text-purple-900">
                        What are the requirements for MusicBlocks integration?
                      </AccordionTrigger>
                      <AccordionContent className="text-purple-700">
                        For complete integration with MusicBlocks, both applications should share authentication systems
                        and have compatible data formats. If MusicBlocks uses React, direct component integration is possible.
                        Otherwise, iframe integration provides a simpler approach with minimal dependencies.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-6" className="border-purple-200">
                      <AccordionTrigger className="text-purple-700 hover:text-purple-900">
                        How can I contribute to this project?
                      </AccordionTrigger>
                      <AccordionContent className="text-purple-700">
                        This tool was developed as part of a Google Summer of Code (GSoC) project with Sugar Labs.
                        You can contribute by submitting issues or pull requests to the GitHub repository, or by
                        providing feedback on the learning experience.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    );
  }
  
  // Get current step data
  const progress = lessonProgress[currentLesson.id];
  const currentStepIndex = progress.currentStep - 1;
  const currentStep = currentLesson.steps[currentStepIndex];
  const progressPercentage = (progress.currentStep / currentLesson.steps.length) * 100;
  
  // Determine if the current step is complete
  const isCurrentStepComplete = checkStepCompletion(gitState);
  
  return (
    <div className="bg-[#F8F9FA] border-t border-gray-200 p-5">
      {/* MusicBlocks style instruction panel */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-4">
          {/* Left side - instruction content */}
          <div className="speech-bubble relative bg-white shadow-sm border border-gray-100 rounded-lg p-4 max-w-2xl">
            {/* Lesson title with MusicBlocks style */}
            <div className="flex items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 text-white"
                   style={{ backgroundColor: isCurrentStepComplete ? '#4CAF50' : '#2196F3' }}>
                <i className={`fas ${isCurrentStepComplete ? 'fa-check' : 'fa-arrow-right'} text-xs`}></i>
              </div>
              <h3 className="font-bold text-lg text-gray-800" id="lesson-title">
                {currentStep.title}
              </h3>
            </div>
            
            {/* Step description with MusicBlocks style */}
            <div className="mt-2 pl-9" id="lesson-description">
              <p className="text-gray-700 leading-relaxed">
                {currentStep.description}
              </p>
              
              {/* Action hint */}
              {currentStep.actionDescription && (
                <div className="mt-3 p-2 bg-blue-50 border-l-4 border-blue-300 rounded-r-md">
                  <p className="text-blue-700 text-sm flex items-start">
                    <i className="fas fa-lightbulb mt-0.5 mr-2 text-blue-500"></i> 
                    <span>{currentStep.actionDescription}</span>
                  </p>
                </div>
              )}
              
              {/* Completion indicator */}
              {isCurrentStepComplete && (
                <div className="mt-3 text-green-600 text-sm flex items-center">
                  <i className="fas fa-check-circle mr-1.5"></i> 
                  <span>Step completed! You can proceed to the next step.</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right side - navigation controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="rounded-full hover:bg-gray-100 transition-all"
              onClick={previousStep}
              disabled={progress.currentStep <= 1}
            >
              <i className="fas fa-arrow-left mr-1.5"></i> Previous
            </Button>
            
            <Button
              className={`rounded-full shadow-sm transition-all ${isCurrentStepComplete ? 'bg-[#4CAF50] hover:bg-green-600' : 'bg-[#2196F3] hover:bg-blue-600'} text-white`}
              onClick={nextStep}
              disabled={!isCurrentStepComplete || progress.currentStep >= currentLesson.steps.length}
            >
              Next <i className="fas fa-arrow-right ml-1.5"></i>
            </Button>
          </div>
        </div>
        
        {/* Step Progress Indicator - MusicBlocks style */}
        <div className="mt-1 px-2">
          <div className="flex items-center">
            <div className="text-xs font-medium text-gray-500 flex items-center">
              <i className="fas fa-map-marker-alt mr-1.5 text-blue-500"></i>
              Step {progress.currentStep} of {currentLesson.steps.length}
            </div>
            
            <div className="flex-grow mx-4 lesson-progress-bar">
              <div
                className="lesson-progress-value"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="text-xs font-medium text-gray-500 flex items-center">
              <i className="fas fa-trophy mr-1.5 text-yellow-500"></i>
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
          
          {/* Mini steps indicator - MusicBlocks style */}
          <div className="flex items-center justify-center space-x-1 mt-3">
            {currentLesson.steps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index < progress.currentStep - 1 
                    ? 'bg-green-500' 
                    : index === progress.currentStep - 1 
                      ? 'bg-blue-500 w-3 h-3' 
                      : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionPanel;
