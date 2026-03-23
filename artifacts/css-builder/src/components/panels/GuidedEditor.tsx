import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronRight, X, Plus } from 'lucide-react';
import { useCssStore } from '@/store/use-css-store';
import { getPropertyGroupsForSelector, CssPropertyDef } from '@/lib/css-catalog';
import { PropertyValueEditor } from './PropertyValueEditor';

interface GuidedEditorProps {
  activeSelector: string;
}

export function GuidedEditor({ activeSelector }: GuidedEditorProps) {
  const { rules, updateProperty, deleteProperty } = useCssStore();
  const selectorRules = rules[activeSelector] ?? {};
  const addedProps = Object.keys(selectorRules);

  const groups = getPropertyGroupsForSelector(activeSelector);

  const allDefs = React.useMemo(() => {
    const seen = new Set<string>();
    const result: CssPropertyDef[] = [];
    for (const group of groups) {
      for (const prop of group.properties) {
        if (!seen.has(prop.name)) {
          seen.add(prop.name);
          result.push(prop);
        }
      }
    }
    return result;
  }, [groups]);

  const getDefForProp = (propName: string): CssPropertyDef | undefined =>
    allDefs.find(d => d.name === propName);

  const [newlyAdded, setNewlyAdded] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const focusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!newlyAdded) return;
    const timer = setTimeout(() => {
      if (focusRef.current) {
        focusRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        focusRef.current.focus();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [newlyAdded]);

  const handleAdd = useCallback((def: CssPropertyDef) => {
    updateProperty(activeSelector, def.name, def.defaultValue);
    setNewlyAdded(def.name);
  }, [activeSelector, updateProperty]);

  const handleRemove = useCallback((propName: string) => {
    deleteProperty(activeSelector, propName);
    if (newlyAdded === propName) setNewlyAdded(null);
  }, [activeSelector, deleteProperty, newlyAdded]);

  const handleChange = useCallback((propName: string, value: string) => {
    updateProperty(activeSelector, propName, value);
  }, [activeSelector, updateProperty]);

  const availableGroups = groups.map(group => ({
    ...group,
    properties: group.properties.filter(p => !addedProps.includes(p.name)),
  })).filter(g => g.properties.length > 0);

  const hasActive = addedProps.length > 0;
  const hasAvailable = availableGroups.length > 0;

  return (
    <div ref={containerRef} className="flex flex-col gap-0 h-full">
      <section className="flex flex-col">
        <div className="px-4 py-2.5 bg-card/80 border-b border-border sticky top-0 z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Properties
          </span>
          {hasActive && (
            <span className="ml-2 text-xs text-muted-foreground/60">
              ({addedProps.length})
            </span>
          )}
        </div>

        {!hasActive ? (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground/60 italic">
            No properties added yet — click one below to add it.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border/50">
            {addedProps.map((propName) => {
              const def = getDefForProp(propName);
              const propState = selectorRules[propName];
              const isNew = newlyAdded === propName;

              return (
                <div
                  key={propName}
                  className={`px-4 py-3 transition-colors ${isNew ? 'bg-accent/5' : 'hover:bg-card/50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-medium text-foreground">
                      {propName}
                    </span>
                    <button
                      onClick={() => handleRemove(propName)}
                      className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                      title={`Remove ${propName}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                  {def ? (
                    <PropertyValueEditor
                      def={def}
                      value={propState?.value ?? ''}
                      onChange={(val) => handleChange(propName, val)}
                      focusRef={isNew ? focusRef : undefined}
                    />
                  ) : (
                    <input
                      ref={isNew ? (el) => { focusRef.current = el; } : undefined}
                      value={propState?.value ?? ''}
                      onChange={(e) => handleChange(propName, e.target.value)}
                      className="w-full h-7 px-2 rounded border border-border bg-background/50 text-xs font-mono"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="border-t border-border/80 mx-0" />

      <section className="flex flex-col flex-1 min-h-0">
        <div className="px-4 py-2.5 bg-card/80 border-b border-border sticky top-0 z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Add Property
          </span>
        </div>

        {!hasAvailable ? (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground/60 italic">
            All available properties are already added.
          </div>
        ) : (
          <div className="flex flex-col">
            {availableGroups.map((group) => (
              <CollapsibleGroup key={group.name} name={group.name} defaultOpen={false}>
                {group.properties.map((prop) => (
                  <button
                    key={prop.name}
                    onClick={() => handleAdd(prop)}
                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-accent/10 transition-colors group"
                  >
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      {prop.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground/50 group-hover:text-accent transition-colors shrink-0">
                      <Plus size={11} />
                      <span className="font-mono">{prop.defaultValue}</span>
                    </span>
                  </button>
                ))}
              </CollapsibleGroup>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CollapsibleGroup({
  name,
  defaultOpen = false,
  children,
}: {
  name: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-card/80 transition-colors"
      >
        <span className="text-xs font-semibold text-muted-foreground">{name}</span>
        {open ? (
          <ChevronDown size={13} className="text-muted-foreground/60" />
        ) : (
          <ChevronRight size={13} className="text-muted-foreground/60" />
        )}
      </button>
      {open && <div className="border-t border-border/30">{children}</div>}
    </div>
  );
}
