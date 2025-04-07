# GitLearningTool Page

## Overview

The GitLearningTool page is the main interface for the Git Learning Tool application. It integrates all the components and provides the overall layout and functionality for the tool.

**File Location:** `client/src/pages/GitLearningTool.tsx`

## Component Structure

The GitLearningTool page has a hierarchical structure:

```
GitLearningTool
├── Navigation Bar
├── Main Content
│   ├── Left Sidebar
│   │   ├── GitBlocks
│   │   └── Lessons Section
│   └── Right Content Area
│       ├── GitToolbar
│       ├── GitVisualization
│       └── InstructionPanel
├── Git Operation Dialog
└── Help Modal
```

## Key Features

1. **MusicBlocks-Style Navigation Bar**
   - Logo and title
   - Save/reset buttons
   - Help and settings buttons
   - GitHub link

2. **Git Blocks Sidebar**
   - Draggable blocks for Git operations
   - MusicBlocks-style tab navigation
   - Lesson cards for selecting lessons

3. **Visualization Area**
   - Toolbar with current branch and zoom controls
   - Interactive Git repository visualization
   - Instruction panel for guided learning

4. **Operation Dialogs**
   - Forms for Git operations
   - Confirmation dialogs for destructive actions
   - Help documentation modal

## State Management

The component uses several hooks to manage state:

```typescript
// UI state
const [showHelpModal, setShowHelpModal] = useState(false);
const [scale, setScale] = useState(1);

// Git context
const { state, saveState, resetState } = useGit();

// Lesson context
const { lessons, lessonProgress, currentLesson, setCurrentLesson } = useLesson();

// Git operations
const { formState, openForm, closeForm, handleInputChange, executeOperation } = useGitOperations();

// Toast notifications
const { toast } = useToast();
```

## Key Functions

### Zoom Controls

```typescript
const handleZoomIn = () => {
  setScale(prev => Math.min(prev + 0.1, 2.0));
};

const handleZoomOut = () => {
  setScale(prev => Math.max(prev - 0.1, 0.5));
};

const handleFitView = () => {
  setScale(1);
};
```

### Project Management

```typescript
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
```

### Form Rendering

The component uses a dynamic form renderer based on the current block type:

```typescript
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
    // Other form types...
  }
};
```

## Styling

The component uses Tailwind CSS for styling with MusicBlocks-inspired design:

```tsx
<nav className="bg-[#2196F3] text-white p-2 flex items-center justify-between shadow-md">
  {/* Navigation bar content */}
</nav>

<div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col">
  {/* Sidebar content */}
</div>

<div className="w-3/4 flex flex-col">
  {/* Main content area */}
</div>
```

## Integration with Other Components

The GitLearningTool page integrates several components:

1. **GitBlocks** - For drag and drop Git operation blocks
   ```tsx
   <GitBlocks onBlockClick={openForm} />
   ```

2. **GitVisualization** - For visualizing the Git repository
   ```tsx
   <GitVisualization
     gitState={state}
     scale={scale}
     onBlockDrop={(blockType) => openForm(blockType)}
   />
   ```

3. **GitToolbar** - For zoom controls and navigation
   ```tsx
   <GitToolbar
     currentBranch={state.currentBranch}
     onZoomIn={handleZoomIn}
     onZoomOut={handleZoomOut}
     onFitView={handleFitView}
   />
   ```

4. **InstructionPanel** - For lesson instructions
   ```tsx
   <InstructionPanel />
   ```

5. **LessonCard** - For lesson selection
   ```tsx
   {lessons.map(lesson => (
     <LessonCard
       key={lesson.id}
       lesson={lesson}
       progress={lessonProgress[lesson.id]}
       isActive={currentLesson?.id === lesson.id}
       onClick={() => setCurrentLesson(lesson.id)}
     />
   ))}
   ```

## Dialog Components

The page includes modals and dialogs for user interaction:

1. **Git Operation Dialog**
   ```tsx
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
   ```

2. **Reset Confirmation Dialog**
   ```tsx
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
   ```

3. **Help Modal**
   ```tsx
   <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
   ```

## Export

The component is exported as the default export:

```typescript
export default GitLearningTool;
```

It is then used in the App component with the necessary providers.
