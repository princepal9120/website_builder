
import React, { useState, useEffect } from 'react';
import { useBuilder } from '../contexts/BuilderContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash } from 'lucide-react';

const PropertyEditor: React.FC = () => {
  const { state, updateElement, deleteElement } = useBuilder();
  const selectedElement = state.selectedElementId
    ? state.elements[state.selectedElementId]
    : null;

  const [content, setContent] = useState('');
  const [styles, setStyles] = useState<Record<string, string>>({});

  // Update form when selection changes
  useEffect(() => {
    if (selectedElement) {
      setContent(selectedElement.content);
      setStyles(selectedElement.styles || {});
    } else {
      setContent('');
      setStyles({});
    }
  }, [selectedElement]);

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (selectedElement) {
      updateElement(selectedElement.id, { content: newContent });
    }
  };

  // Handle style change
  const handleStyleChange = (property: string, value: string) => {
    const newStyles = { ...styles, [property]: value };
    setStyles(newStyles);
    if (selectedElement) {
      updateElement(selectedElement.id, { styles: newStyles });
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedElement && selectedElement.id !== 'root') {
      deleteElement(selectedElement.id);
    }
  };

  if (!selectedElement) {
    return (
      <div className="p-4 bg-card border-l border-border h-full">
        <p className="text-muted-foreground text-center p-4">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-card border-l border-border h-full overflow-y-auto w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium capitalize">
          {selectedElement.type} Properties
        </h3>
        {selectedElement.id !== 'root' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash size={16} />
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['content', 'layout', 'typography', 'appearance']}>
        {/* Content Section */}
        {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
          <AccordionItem value="content">
            <AccordionTrigger>Content</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="element-content">Text</Label>
                  <Input
                    id="element-content"
                    value={content}
                    onChange={handleContentChange}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Layout Section */}
        <AccordionItem value="layout">
          <AccordionTrigger>Layout</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={styles.width || ''}
                    onChange={(e) => handleStyleChange('width', e.target.value)}
                    placeholder="auto, 100px, 50%"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={styles.height || ''}
                    onChange={(e) => handleStyleChange('height', e.target.value)}
                    placeholder="auto, 100px, 50%"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="margin">Margin</Label>
                  <Input
                    id="margin"
                    value={styles.margin || ''}
                    onChange={(e) => handleStyleChange('margin', e.target.value)}
                    placeholder="10px 20px"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="padding">Padding</Label>
                  <Input
                    id="padding"
                    value={styles.padding || ''}
                    onChange={(e) => handleStyleChange('padding', e.target.value)}
                    placeholder="10px 20px"
                  />
                </div>
              </div>

              {selectedElement.type === 'container' && (
                <div className="grid gap-1">
                  <Label htmlFor="display">Display</Label>
                  <Select
                    value={styles.display || ''}
                    onValueChange={(value) => handleStyleChange('display', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select display" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="flex">Flex</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="inline-block">Inline Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {styles.display === 'flex' && (
                <>
                  <div className="grid gap-1">
                    <Label htmlFor="flexDirection">Flex Direction</Label>
                    <Select
                      value={styles.flexDirection || ''}
                      onValueChange={(value) => handleStyleChange('flexDirection', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="row">Row</SelectItem>
                        <SelectItem value="column">Column</SelectItem>
                        <SelectItem value="row-reverse">Row Reverse</SelectItem>
                        <SelectItem value="column-reverse">Column Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-1">
                    <Label htmlFor="justifyContent">Justify Content</Label>
                    <Select
                      value={styles.justifyContent || ''}
                      onValueChange={(value) => handleStyleChange('justifyContent', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select justify content" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flex-start">Start</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="flex-end">End</SelectItem>
                        <SelectItem value="space-between">Space Between</SelectItem>
                        <SelectItem value="space-around">Space Around</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-1">
                    <Label htmlFor="alignItems">Align Items</Label>
                    <Select
                      value={styles.alignItems || ''}
                      onValueChange={(value) => handleStyleChange('alignItems', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select align items" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flex-start">Start</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="flex-end">End</SelectItem>
                        <SelectItem value="stretch">Stretch</SelectItem>
                        <SelectItem value="baseline">Baseline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {styles.display === 'grid' && (
                <>
                  <div className="grid gap-1">
                    <Label htmlFor="gridTemplateColumns">Grid Columns</Label>
                    <Input
                      id="gridTemplateColumns"
                      value={styles.gridTemplateColumns || ''}
                      onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                      placeholder="1fr 1fr 1fr"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="gridGap">Grid Gap</Label>
                    <Input
                      id="gridGap"
                      value={styles.gap || ''}
                      onChange={(e) => handleStyleChange('gap', e.target.value)}
                      placeholder="10px"
                    />
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Typography Section */}
        {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
          <AccordionItem value="typography">
            <AccordionTrigger>Typography</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="grid gap-1">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Input
                    id="fontSize"
                    value={styles.fontSize || ''}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="fontWeight">Font Weight</Label>
                  <Select
                    value={styles.fontWeight || ''}
                    onValueChange={(value) => handleStyleChange('fontWeight', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="lighter">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="textAlign">Text Align</Label>
                  <Select
                    value={styles.textAlign || ''}
                    onValueChange={(value) => handleStyleChange('textAlign', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="color"
                      className="w-10 h-10 p-0 border rounded"
                      value={styles.color || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                    />
                    <Input
                      value={styles.color || ''}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Appearance Section */}
        <AccordionItem value="appearance">
          <AccordionTrigger>Appearance</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="grid gap-1">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="backgroundColor"
                    className="w-10 h-10 p-0 border rounded"
                    value={styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  />
                  <Input
                    value={styles.backgroundColor || ''}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Input
                  id="borderRadius"
                  value={styles.borderRadius || ''}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  placeholder="4px"
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="border">Border</Label>
                <Input
                  id="border"
                  value={styles.border || ''}
                  onChange={(e) => handleStyleChange('border', e.target.value)}
                  placeholder="1px solid #000"
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="boxShadow">Box Shadow</Label>
                <Input
                  id="boxShadow"
                  value={styles.boxShadow || ''}
                  onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                  placeholder="0 2px 4px rgba(0,0,0,0.1)"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PropertyEditor;
