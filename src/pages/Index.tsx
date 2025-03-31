
import React, { useState } from 'react';
import { BuilderProvider, ElementType } from '../contexts/BuilderContext';
import BuilderHeader from '../components/BuilderHeader';
import ElementLibrary from '../components/ElementLibrary';
import BuilderCanvas from '../components/BuilderCanvas';
import PropertyEditor from '../components/PropertyEditor';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentDragElement, setCurrentDragElement] = useState<ElementType | null>(null);
  const { toast } = useToast();

  const handleDragStart = (type: ElementType) => {
    setCurrentDragElement(type);
    toast({
      title: "Dragging Element",
      description: `Drag the ${type} element to the canvas`,
      duration: 1500,
    });
  };

  return (
    <BuilderProvider>
      <div className="flex flex-col h-screen">
        <BuilderHeader />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64">
            <ElementLibrary onDragStart={handleDragStart} />
          </div>
          
          <BuilderCanvas
            currentDragElement={currentDragElement}
            setCurrentDragElement={setCurrentDragElement}
          />
          
          <div className="w-80">
            <PropertyEditor />
          </div>
        </div>
      </div>
    </BuilderProvider>
  );
};

export default Index;
