import React, { useState, useMemo } from 'react';
import { useCssStore } from '@/store/use-css-store';
import { PROPERTY_GROUPS, isStandardProperty } from '@/lib/css-catalog';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyInput } from './PropertyInput';
import { generateCssString } from '@/lib/css-parser';
import { Code2, Settings2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export function EditorPanel() {
  const { 
    activeSelector, 
    rules, 
    viewMode, 
    setViewMode, 
    updateProperty, 
    toggleProperty,
    deleteProperty,
    loadCssText
  } = useCssStore();
  
  const [newPropName, setNewPropName] = useState('');
  const [isAddingProp, setIsAddingProp] = useState(false);

  const activeRules = activeSelector ? (rules[activeSelector] || {}) : {};

  // Extract non-standard (custom) properties for the active selector
  const customProps = useMemo(() => {
    return Object.keys(activeRules).filter(prop => !isStandardProperty(prop));
  }, [activeRules]);

  const handleAddCustomProp = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPropName.trim() && activeSelector) {
      updateProperty(activeSelector, newPropName.trim(), '');
      setNewPropName('');
      setIsAddingProp(false);
    }
  };

  const handleRawCssChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    loadCssText(e.target.value);
  };

  if (!activeSelector && viewMode === 'editor') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background text-muted-foreground p-8">
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4 shadow-inner">
          <Code2 size={24} className="text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground">No Selector Active</p>
        <p className="text-xs text-center mt-2 max-w-[250px]">
          Select an element from the left panel to begin editing its CSS properties.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background min-w-[300px] border-r border-border relative z-0">
      
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-2">
          {activeSelector && viewMode === 'editor' ? (
            <>
              <span className="text-xs font-mono px-2 py-1 bg-secondary rounded text-accent font-medium">
                {activeSelector}
              </span>
              <span className="text-xs text-muted-foreground ml-2">Properties</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-foreground">Global Source</span>
          )}
        </div>
        
        <div className="flex p-1 bg-secondary rounded-lg">
          <button 
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'editor' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('editor')}
          >
            <div className="flex items-center gap-1.5"><Settings2 size={14}/> Visual</div>
          </button>
          <button 
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'source' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('source')}
          >
            <div className="flex items-center gap-1.5"><Code2 size={14}/> Source</div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          
          {/* VISUAL EDITOR MODE */}
          {viewMode === 'editor' && activeSelector && (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-8 pb-20"
            >
              {PROPERTY_GROUPS.map((group) => {
                // Check if any property in this group is active to auto-expand or highlight
                return (
                  <div key={group.name} className="space-y-3">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border pb-1">
                      {group.name}
                    </h3>
                    <div className="grid gap-3">
                      {group.properties.map((prop) => {
                        const state = activeRules[prop.name];
                        const isEnabled = state?.enabled ?? false;
                        
                        return (
                          <div key={prop.name} className={`flex items-center gap-3 p-1.5 rounded-md transition-colors ${isEnabled ? 'bg-secondary/30' : 'hover:bg-secondary/20'}`}>
                            <Checkbox 
                              checked={isEnabled} 
                              onCheckedChange={(c) => toggleProperty(activeSelector, prop.name, !!c)}
                              className="mt-0.5 border-muted-foreground/50 data-[state=checked]:bg-primary"
                            />
                            <div className="w-1/3 truncate text-xs text-muted-foreground font-mono" title={prop.name}>
                              {prop.name}
                            </div>
                            <div className="flex-1 relative">
                              {/* Only show input fully opaque if enabled */}
                              <div className={`transition-opacity duration-200 ${isEnabled ? 'opacity-100' : 'opacity-40 grayscale-[50%]'}`}>
                                <PropertyInput 
                                  type={prop.type}
                                  options={prop.options}
                                  defaultUnit={prop.defaultUnit}
                                  value={state?.value || ''}
                                  onChange={(v) => {
                                    updateProperty(activeSelector, prop.name, v);
                                    if (!isEnabled && v) toggleProperty(activeSelector, prop.name, true);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* CUSTOM PROPERTIES SECTION */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between border-b border-border pb-1">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Custom Properties
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs" 
                    onClick={() => setIsAddingProp(!isAddingProp)}
                  >
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
                
                {isAddingProp && (
                  <form onSubmit={handleAddCustomProp} className="flex gap-2 p-2 bg-secondary/30 rounded-md border border-border">
                    <Input 
                      autoFocus
                      value={newPropName}
                      onChange={e => setNewPropName(e.target.value)}
                      placeholder="property-name"
                      className="h-8 text-xs font-mono"
                    />
                    <Button type="submit" size="sm" className="h-8">Add</Button>
                  </form>
                )}

                <div className="grid gap-3">
                  {customProps.length === 0 && !isAddingProp && (
                    <p className="text-xs text-muted-foreground italic px-2">No custom properties defined.</p>
                  )}
                  {customProps.map((propName) => {
                    const state = activeRules[propName];
                    const isEnabled = state?.enabled ?? false;
                    return (
                      <div key={propName} className={`flex items-center gap-3 p-1.5 rounded-md transition-colors ${isEnabled ? 'bg-secondary/30' : 'hover:bg-secondary/20'}`}>
                        <Checkbox 
                          checked={isEnabled} 
                          onCheckedChange={(c) => toggleProperty(activeSelector, propName, !!c)}
                        />
                        <div className="w-1/3 truncate text-xs text-accent font-mono">
                          {propName}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <Input 
                            value={state?.value || ''}
                            onChange={(e) => updateProperty(activeSelector, propName, e.target.value)}
                            className="h-8 text-xs font-mono"
                            placeholder="value..."
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => deleteProperty(activeSelector, propName)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {/* RAW SOURCE MODE */}
          {viewMode === 'source' && (
            <motion.div 
              key="source"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-4"
            >
              <textarea
                value={generateCssString(rules)}
                onChange={handleRawCssChange}
                className="w-full h-full bg-card/50 text-foreground font-mono text-sm p-4 rounded-xl border border-border shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none scrollbar-thin"
                spellCheck={false}
                placeholder="/* CSS generated will appear here. You can also type raw CSS. */"
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
