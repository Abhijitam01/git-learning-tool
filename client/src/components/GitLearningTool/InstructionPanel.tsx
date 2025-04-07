import { useLesson } from '@/context/LessonContext';
import { useGit } from '@/context/GitContext';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

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
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-0">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    <i className="fas fa-question-circle text-purple-600 mr-2"></i> Frequently Asked Questions
                  </h3>
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
            
            {/* Step description */}
            <p className="mt-2 text-gray-600 leading-relaxed" id="step-description">
              {currentStep.description}
            </p>
            
            {/* Action hint */}
            {currentStep.actionDescription && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-blue-700 text-sm">
                  <i className="fas fa-info-circle mr-2"></i>
                  {currentStep.actionDescription}
                </p>
              </div>
            )}
          </div>
          
          {/* Right side - navigation buttons */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="rounded-full shadow-sm"
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
        </div>
      </div>
    </div>
  );
};

export default InstructionPanel;