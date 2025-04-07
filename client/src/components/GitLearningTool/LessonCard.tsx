import React from 'react';
import { Lesson, LessonProgress } from '@/context/LessonContext';

interface LessonCardProps {
  lesson: Lesson;
  progress: LessonProgress;
  isActive: boolean;
  onClick: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  progress,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`lesson-card p-3 mb-2 rounded-lg cursor-pointer transition-all ${
        isActive
          ? 'bg-blue-50 border-blue-200 shadow-sm'
          : 'bg-white border-gray-100 hover:bg-gray-50'
      } border`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 mb-1">{lesson.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-2">{lesson.description}</p>
        </div>
        
        {/* Progress indicator */}
        <div className="ml-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium"
            style={{
              borderColor: progress.completed ? '#4CAF50' : '#2196F3',
              color: progress.completed ? '#4CAF50' : '#2196F3',
            }}
          >
            {progress.completed ? (
              <i className="fas fa-check"></i>
            ) : (
              `${Math.round(progress.progress)}%`
            )}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-2 w-full lesson-progress-bar">
        <div
          className="lesson-progress-value"
          style={{ 
            width: `${progress.progress}%`,
            backgroundColor: progress.completed ? '#4CAF50' : '#2196F3'
          }}
        ></div>
      </div>
    </div>
  );
};

export default LessonCard;