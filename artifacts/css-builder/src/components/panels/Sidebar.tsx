import React, { useState } from 'react';
import { CSS_CATEGORIES } from '@/lib/css-catalog';
import { useCssStore } from '@/store/use-css-store';
import { ChevronRight, ChevronDown, Hash, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Sidebar() {
  const { activeSelector, setActiveSelector, customSelectors, addCustomSelector, deleteSelector } = useCssStore();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    CSS_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
  );
  
  const [newSelector, setNewSelector] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const toggleCategory = (name: string) => {
    setOpenCategories(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleAddSelector = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSelector.trim()) {
      addCustomSelector(newSelector.trim());
      setNewSelector('');
      setIsAdding(false);
    }
  };

  const allCategories = [
    ...CSS_CATEGORIES,
    ...(customSelectors.length > 0 ? [{ name: 'Custom Selectors', selectors: customSelectors }] : [])
  ];

  return (
    <div className="w-64 flex flex-col h-full bg-card border-r border-border shrink-0">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Selectors</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={() => setIsAdding(!isAdding)}
          title="Add Custom Selector"
        >
          <Plus size={14} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {isAdding && (
          <form onSubmit={handleAddSelector} className="p-2 mb-2 bg-secondary/50 rounded-md border border-border">
            <Input 
              autoFocus
              size={1}
              value={newSelector}
              onChange={e => setNewSelector(e.target.value)}
              placeholder=".my-class, #id"
              className="h-8 text-xs bg-background mb-2"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="h-7 text-xs flex-1">Add</Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </form>
        )}

        {allCategories.map((category) => (
          <div key={category.name} className="mb-1">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 rounded-md transition-colors"
            >
              {openCategories[category.name] ? 
                <ChevronDown size={14} className="text-muted-foreground" /> : 
                <ChevronRight size={14} className="text-muted-foreground" />
              }
              {category.name}
            </button>
            
            {openCategories[category.name] && (
              <div className="pl-6 pr-1 py-1 space-y-0.5">
                {category.selectors.map(selector => {
                  const isActive = activeSelector === selector;
                  const isCustom = customSelectors.includes(selector);
                  
                  return (
                    <div 
                      key={selector} 
                      className={`group flex items-center justify-between px-2 py-1.5 rounded-md text-xs cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-primary/15 text-primary font-medium' 
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                      onClick={() => setActiveSelector(selector)}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Hash size={12} className={isActive ? 'opacity-100' : 'opacity-40'} />
                        <span className="truncate">{selector}</span>
                      </div>
                      
                      {isCustom && (
                        <button 
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSelector(selector);
                          }}
                          title="Delete Custom Selector"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
