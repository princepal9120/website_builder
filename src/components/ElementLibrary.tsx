
import React from 'react';
import { useBuilder } from '../contexts/BuilderContext';
import { ElementType } from '../contexts/BuilderContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Type, Image, Square, Layers, FormInput } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ElementLibraryProps {
  onDragStart: (type: ElementType) => void;
}

const ElementLibrary: React.FC<ElementLibraryProps> = ({ onDragStart }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const elementTypes = [
    { type: 'text', label: 'Text', icon: <Type size={20} /> },
    { type: 'image', label: 'Image', icon: <Image size={20} /> },
    { type: 'button', label: 'Button', icon: <Square size={20} /> },
    { type: 'container', label: 'Container', icon: <Layers size={20} /> },
    { type: 'form', label: 'Form', icon: <FormInput size={20} /> },
  ] as const;
  
  const filteredElements = elementTypes.filter(el => 
    el.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData('elementType', type);
    onDragStart(type);
  };

  return (
    <div className="p-4 bg-card border-r border-border h-full flex flex-col">
      <h3 className="font-medium mb-4">Elements</h3>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search elements..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {filteredElements.map((element) => (
          <Card
            key={element.type}
            className={cn(
              "p-4 cursor-grab flex flex-col items-center justify-center gap-2 component-library-item hover:bg-accent transition-all",
            )}
            draggable
            onDragStart={(e) => handleDragStart(e, element.type as ElementType)}
          >
            {element.icon}
            <span className="text-xs text-center">{element.label}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ElementLibrary;
