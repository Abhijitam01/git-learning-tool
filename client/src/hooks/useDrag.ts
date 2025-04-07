import { useState, useCallback, DragEvent } from 'react';
import { Position, GitBlockType } from '@/components/GitLearningTool/types';

interface UseDragReturn {
  isDragging: boolean;
  dragType: GitBlockType | null;
  dragPosition: Position | null;
  handleDragStart: (e: DragEvent<HTMLDivElement>, blockType: GitBlockType) => void;
  handleDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => { blockType: GitBlockType, position: Position } | null;
}

export function useDrag(): UseDragReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<GitBlockType | null>(null);
  const [dragPosition, setDragPosition] = useState<Position | null>(null);

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, blockType: GitBlockType) => {
    setIsDragging(true);
    setDragType(blockType);
    e.dataTransfer.setData('text/plain', blockType);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Set drag image (optional - for better UX)
    if (e.currentTarget.parentElement) {
      const clone = e.currentTarget.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.top = '-1000px';
      document.body.appendChild(clone);
      e.dataTransfer.setDragImage(clone, 20, 20);
      
      // Clean up the clone after the drag starts
      setTimeout(() => {
        document.body.removeChild(clone);
      }, 0);
    }
  }, []);

  const handleDragEnd = useCallback((e: DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setDragType(null);
    setDragPosition(null);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    // Track mouse position for positioning the new element
    setDragPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const blockType = e.dataTransfer.getData('text/plain') as GitBlockType;
    if (!blockType) return null;
    
    // Calculate position relative to the drop target
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setDragType(null);
    setDragPosition(null);
    
    return { blockType, position };
  }, []);

  return {
    isDragging,
    dragType,
    dragPosition,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop
  };
}
