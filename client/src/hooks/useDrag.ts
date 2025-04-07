import { useState, useCallback, DragEvent } from 'react';
import { GitBlockType } from './useGitOperations';

interface Position {
  x: number;
  y: number;
}

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
    
    // Set the drag data
    e.dataTransfer.setData('blockType', blockType);
    
    // Set the drag image (optional)
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.5';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Remove the element after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  }, []);
  
  const handleDragEnd = useCallback((_e: DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setDragType(null);
    setDragPosition(null);
  }, []);
  
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Update the drag position
    setDragPosition({
      x: e.clientX,
      y: e.clientY,
    });
  }, []);
  
  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (!dragType) {
      const blockType = e.dataTransfer.getData('blockType') as GitBlockType;
      if (!blockType) return null;
      
      return {
        blockType,
        position: {
          x: e.clientX,
          y: e.clientY,
        },
      };
    }
    
    const result = {
      blockType: dragType,
      position: {
        x: e.clientX,
        y: e.clientY,
      },
    };
    
    setIsDragging(false);
    setDragType(null);
    setDragPosition(null);
    
    return result;
  }, [dragType]);
  
  return {
    isDragging,
    dragType,
    dragPosition,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
}