
import React from 'react';
import { useBuilder } from '../contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Undo, Redo, FileText, Plus, Eye, Save, Layout } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

const BuilderHeader: React.FC = () => {
  const { undo, redo, state, setTemplate } = useBuilder();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-lg">Snaplify</h1>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={undo} title="Undo">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} title="Redo">
            <Redo className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Layout className="h-4 w-4" />
                <span>Templates</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Choose a template</h4>
                  <p className="text-sm text-muted-foreground">Select a pre-built layout to get started</p>
                </div>
                <div className="grid gap-2">
                  {state.templates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => setTemplate(template.id)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-1">
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </Button>
        <Button className="gap-1">
          <Save className="h-4 w-4" />
          <span>Save</span>
        </Button>
      </div>
    </header>
  );
};

export default BuilderHeader;
