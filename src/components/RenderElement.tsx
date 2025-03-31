
import React from 'react';
import { BuilderElement } from '../contexts/BuilderContext';
import { cn } from '@/lib/utils';

interface RenderElementProps {
  element: BuilderElement;
  onSelect: (id: string) => void;
  selectedId: string | null;
  onDragEnter: (e: React.DragEvent, id: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  dragOverId: string | null;
  elements: Record<string, BuilderElement>;
}

const RenderElement: React.FC<RenderElementProps> = ({
  element,
  onSelect,
  selectedId,
  onDragEnter,
  onDragLeave,
  onDrop,
  dragOverId,
  elements,
}) => {
  const isSelected = selectedId === element.id;
  const isDragOver = dragOverId === element.id;
  
  // Sort children by order
  const sortedChildren = [...element.children].sort((a, b) => {
    const childA = elements[a];
    const childB = elements[b];
    return (childA?.order || 0) - (childB?.order || 0);
  });

  // Create inline styles from element.styles
  const elementStyles: React.CSSProperties = {
    ...element.styles,
    position: 'relative' as const,
    outline: isSelected ? '2px solid #3B82F6' : undefined,
    boxShadow: isSelected ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : undefined,
  };

  const renderElementBasedOnType = () => {
    switch (element.type) {
      case 'text':
        return <div style={elementStyles}>{element.content}</div>;
      case 'image':
        return <img src={element.content} alt="Content" style={elementStyles} />;
      case 'button':
        return <button style={elementStyles}>{element.content}</button>;
      case 'form':
        return (
          <form style={elementStyles} onClick={(e) => e.preventDefault()}>
            {sortedChildren.map((childId) => {
              const child = elements[childId];
              if (!child) return null;
              return (
                <RenderElement
                  key={childId}
                  element={child}
                  onSelect={onSelect}
                  selectedId={selectedId}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  dragOverId={dragOverId}
                  elements={elements}
                />
              );
            })}
            {!sortedChildren.length && (
              <div className="text-muted-foreground text-center p-4">
                Drop form elements here
              </div>
            )}
          </form>
        );
      case 'container':
      default:
        return (
          <div
            style={elementStyles}
            className={cn(
              'transition-all',
              isDragOver && 'droppable-hover'
            )}
          >
            {sortedChildren.map((childId) => {
              const child = elements[childId];
              if (!child) return null;
              return (
                <RenderElement
                  key={childId}
                  element={child}
                  onSelect={onSelect}
                  selectedId={selectedId}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  dragOverId={dragOverId}
                  elements={elements}
                />
              );
            })}
            {!sortedChildren.length && element.type === 'container' && (
              <div className="text-muted-foreground text-center p-4">
                Drop elements here
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
      onDragEnter={(e) => onDragEnter(e, element.id)}
      onDragLeave={(e) => onDragLeave(e)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, element.id)}
      className="relative"
    >
      {renderElementBasedOnType()}
      {isSelected && (
        <div className="absolute top-0 left-0 text-xs bg-primary text-primary-foreground px-1 py-0.5 rounded-br">
          {element.type}
        </div>
      )}
    </div>
  );
};

export default RenderElement;
