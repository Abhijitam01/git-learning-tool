import React from 'react';
import { Lesson, LessonProgress } from './types';

interface LessonCardProps {
  lesson: Lesson;
  progress: LessonProgress;
  isActive: boolean;
  onClick: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, progress, isActive, onClick }) => {
  // Generate a random color for lessons based on lesson.id (for consistent colors)
  const getColorFromId = (id: string) => {
    const colors = [
      '#FFC107', // amber
      '#FF9800', // orange
      '#2196F3', // blue
      '#4CAF50', // green
      '#9C27B0', // purple
      '#F44336'  // red
    ];
    
    // Simple hash function to get a consistent color
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  const cardColor = getColorFromId(lesson.id);
  
  return (
    <div 
      className={`lesson-card relative bg-white rounded-lg shadow-sm flex-shrink-0 w-36 cursor-pointer transition-all duration-200 overflow-hidden
                 ${isActive ? 'transform scale-105 shadow-md ring-2 ring-blue-300' : 'hover:shadow-md hover:transform hover:scale-102'}`}
      onClick={onClick}
      style={{ borderTop: `3px solid ${cardColor}` }}
    >
      {/* MusicBlocks-style icons with colorful backgrounds */}
      <div className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-bl-lg" 
           style={{ backgroundColor: cardColor }}>
        <i className="fas fa-graduation-cap text-xs text-white"></i>
      </div>
      
      {/* Progress indicator with MusicBlocks styling */}
      <div className="absolute bottom-0 left-0 right-0 h-1">
        <div 
          className="h-1 transition-all duration-300"
          style={{ 
            width: `${progress.progress * 100}%`,
            background: `linear-gradient(90deg, ${cardColor}99, ${cardColor})`
          }}
        ></div>
      </div>
      
      {/* Content */}
      <div className="p-2 pt-3">
        <div className="text-sm font-medium leading-tight">{lesson.title}</div>
        <div className="flex items-center justify-between mt-2.5 mb-1.5">
          <div className="text-xs text-gray-500 flex items-center">
            <i className="fas fa-tasks mr-1 text-gray-400"></i>
            <span>{progress.currentStep}/{progress.totalSteps}</span>
          </div>
          
          {/* Completion badge */}
          {progress.completed && (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-white text-xs"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
