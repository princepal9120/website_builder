
import React, { useState } from 'react';
import { useBuilder } from '../contexts/BuilderContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ElementType } from '../contexts/BuilderContext';
import { cn } from '@/lib/utils';
import RenderElement from './RenderElement';

interface BuilderCanvasProps {
  currentDragElement: ElementType | null;
  setCurrentDragElement: (type: ElementType | null) => void;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ currentDragElement, setCurrentDragElement }) => {
  const { state, addElement, selectElement } = useBuilder();
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  
  // Find the root element if templates are used
  const rootElement = Object.values(state.elements).find(
    (element) => element.parentId === null
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, parentId: string | null) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType') as ElementType;
    if (elementType) {
      addElement(elementType, parentId);
      setCurrentDragElement(null);
    }
    setDragOverId(null);
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (currentDragElement) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  // Do not render if there are no elements
  if (!rootElement) {
    return (
      <div className="flex items-center justify-center h-full p-8 bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">No Template Selected</h2>
          <p className="text-muted-foreground mb-4">Choose a template from the header menu to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-canvas overflow-auto h-full flex-grow">
      <div
        className="min-h-full p-4"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, null)}
      >
        <RenderElement
          element={rootElement}
          onSelect={selectElement}
          selectedId={state.selectedElementId}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          dragOverId={dragOverId}
          elements={state.elements}
        />
      </div>
    </div>
  );
};

export default BuilderCanvas;
