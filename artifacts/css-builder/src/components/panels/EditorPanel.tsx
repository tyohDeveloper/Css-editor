import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useCssStore } from '@/store/use-css-store';
import { generateCssString } from '@/lib/css-parser';
import { Code2, Settings2, PencilLine, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { GuidedEditor } from './GuidedEditor';

export function EditorPanel() {
  const {
    activeSelector,
    rules,
    viewMode,
    setViewMode,
    applyRawEdits,
  } = useCssStore();

  const generatedCss = useMemo(() => generateCssString(rules), [rules]);

  const [rawBuffer, setRawBuffer] = useState(generatedCss);
  const [rawDirty, setRawDirty] = useState(false);
  const [sourceEditable, setSourceEditable] = useState(false);

  useEffect(() => {
    if (viewMode === 'source') {
      setRawBuffer(generatedCss);
      setRawDirty(false);
      setSourceEditable(false);
    }
  }, [viewMode]);

  const displayedSource = rawDirty ? rawBuffer : generatedCss;

  const handleApplyRaw = useCallback(() => {
    applyRawEdits(rawBuffer);
    setRawDirty(false);
    setSourceEditable(false);
  }, [rawBuffer, applyRawEdits]);

  const handleEnableEdit = () => {
    setRawBuffer(generatedCss);
    setRawDirty(false);
    setSourceEditable(true);
  };

  const handleCancelEdit = () => {
    setRawBuffer(generatedCss);
    setRawDirty(false);
    setSourceEditable(false);
  };

  if (!activeSelector && viewMode === 'editor') {
    return (
      <div className="flex-1 flex flex-col min-w-[300px] border-r border-border bg-background">
        <PanelHeader viewMode={viewMode} setViewMode={setViewMode} activeSelector={activeSelector} />
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4 shadow-inner">
            <Code2 size={24} className="text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-foreground">No Selector Active</p>
          <p className="text-xs text-center mt-2 max-w-[250px]">
            Select an element from the left panel to start editing its CSS properties.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background min-w-[300px] border-r border-border relative z-0">
      <PanelHeader viewMode={viewMode} setViewMode={setViewMode} activeSelector={activeSelector} />

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">

          {viewMode === 'editor' && activeSelector && (
            <motion.div
              key={`editor-${activeSelector}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 overflow-y-auto scrollbar-thin"
            >
              <GuidedEditor activeSelector={activeSelector} />
            </motion.div>
          )}

          {viewMode === 'source' && (
            <motion.div
              key="source"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex flex-col p-4 gap-3"
            >
              {!sourceEditable ? (
                <>
                  <pre className="flex-1 bg-card/50 text-foreground font-mono text-sm p-4 rounded-xl border border-border shadow-inner overflow-auto whitespace-pre-wrap break-words scrollbar-thin">
                    {displayedSource || '/* No rules defined yet */'}
                  </pre>
                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">Read-only view</span>
                    <Button size="sm" variant="outline" onClick={handleEnableEdit} className="h-8 gap-1.5">
                      <PencilLine size={14} /> Edit Source
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    value={rawBuffer}
                    onChange={e => { setRawBuffer(e.target.value); setRawDirty(true); }}
                    className="flex-1 bg-card/50 text-foreground font-mono text-sm p-4 rounded-xl border border-border shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none scrollbar-thin"
                    spellCheck={false}
                    autoFocus
                    placeholder="/* Edit CSS here, then click Apply */"
                  />
                  <div className="flex items-center gap-2 justify-end shrink-0">
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8">Cancel</Button>
                    <span className={`text-xs ${rawDirty ? 'text-accent' : 'text-muted-foreground'}`}>
                      {rawDirty ? 'Unsaved edits' : 'No changes'}
                    </span>
                    <Button size="sm" disabled={!rawDirty} onClick={handleApplyRaw} className="h-8 gap-1.5">
                      <Eye size={14} /> Apply
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function PanelHeader({
  viewMode,
  setViewMode,
  activeSelector,
}: {
  viewMode: 'editor' | 'source';
  setViewMode: (m: 'editor' | 'source') => void;
  activeSelector: string | null;
}) {
  return (
    <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
      <div className="flex items-center gap-2">
        {activeSelector && viewMode === 'editor' ? (
          <>
            <span className="text-xs font-mono px-2 py-1 bg-secondary rounded text-accent font-medium">
              {activeSelector}
            </span>
            <span className="text-xs text-muted-foreground ml-1">Properties</span>
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
          <div className="flex items-center gap-1.5"><Settings2 size={14} /> Visual</div>
        </button>
        <button
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'source' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setViewMode('source')}
        >
          <div className="flex items-center gap-1.5"><Code2 size={14} /> Source</div>
        </button>
      </div>
    </div>
  );
}
