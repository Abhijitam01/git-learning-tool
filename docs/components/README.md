# Components Documentation

This directory contains documentation for all UI components used in the Git Learning Tool application.

## Component Overview

The components are organized into two main categories:

1. **Git Learning Tool Components** - Custom components specific to the Git Learning Tool application
2. **UI Components** - Reusable UI components based on shadcn/ui

## Git Learning Tool Components

These components are found in the `client/src/components/GitLearningTool` directory:

- [GitBlocks.tsx](GitBlocks.md) - Drag and drop blocks for Git operations
- [GitVisualization.tsx](GitVisualization.md) - Visual representation of Git repository
- [GitToolbar.tsx](GitToolbar.md) - Toolbar with zoom controls and actions
- [HelpModal.tsx](HelpModal.md) - Help and information modal
- [InstructionPanel.tsx](InstructionPanel.md) - Panel displaying current lesson instructions
- [LessonCard.tsx](LessonCard.md) - Cards representing individual lessons
- [types.ts](types.md) - TypeScript type definitions for components

## UI Components

The application uses shadcn/ui components for the user interface. These components are found in the `client/src/components/ui` directory and provide a consistent design system for the application.

Key UI components used include:

- Button
- Dialog
- Input
- Tabs
- Toast
- Alert
- Card
- Separator

For a complete reference of these components, see the [shadcn/ui documentation](https://ui.shadcn.com/docs).
