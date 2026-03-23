import React, { useState } from 'react';
import { FileCode, Save, FolderOpen, Plus, Download } from 'lucide-react';
import { useCssStore } from '@/store/use-css-store';
import { generateCssString } from '@/lib/css-parser';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { 
    fileName, isDirty, rules, fileHandle, 
    setFileName, setFileHandle, loadCssText, resetState, setDirty 
  } = useCssStore();
  const { toast } = useToast();

  const handleNew = () => {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Create new anyway?')) return;
    }
    resetState();
  };

  const handleOpen = async () => {
    try {
      if ('showOpenFilePicker' in window) {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [{ description: 'CSS Files', accept: { 'text/css': ['.css'] } }],
          multiple: false
        });
        const file = await handle.getFile();
        const text = await file.text();
        loadCssText(text);
        setFileName(file.name);
        setFileHandle(handle);
        toast({ title: "File loaded successfully", description: file.name });
      } else {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.css';
        input.onchange = async (e: any) => {
          const file = e.target.files[0];
          if (!file) return;
          const text = await file.text();
          loadCssText(text);
          setFileName(file.name);
          setFileHandle(null);
          toast({ title: "File loaded successfully", description: file.name });
        };
        input.click();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(err);
        toast({ title: "Failed to open file", variant: "destructive" });
      }
    }
  };

  const saveContent = async (handleToUse: any = fileHandle) => {
    const cssContent = generateCssString(rules);
    
    if ('showSaveFilePicker' in window) {
      try {
        let handle = handleToUse;
        if (!handle) {
          handle = await (window as any).showSaveFilePicker({
            suggestedName: fileName,
            types: [{ description: 'CSS Files', accept: { 'text/css': ['.css'] } }]
          });
        }
        
        const writable = await handle.createWritable();
        await writable.write(cssContent);
        await writable.close();
        
        const file = await handle.getFile();
        setFileName(file.name);
        setFileHandle(handle);
        setDirty(false);
        toast({ title: "Saved successfully", description: file.name });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
          toast({ title: "Failed to save file", variant: "destructive" });
        }
      }
    } else {
      // Fallback programmatic download
      const blob = new Blob([cssContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      setDirty(false);
      toast({ title: "File downloaded", description: fileName });
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
          <FileCode size={18} />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground leading-none">CSS Builder</h1>
          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
            <span className={isDirty ? "text-accent font-medium" : ""}>
              {fileName} {isDirty && "*"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleNew} className="h-9 w-9">
              <Plus size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New File</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleOpen} className="h-9 w-9">
              <FolderOpen size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open File</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={isDirty ? "default" : "secondary"} 
              size="sm" 
              onClick={() => saveContent(fileHandle)}
              className="gap-2 h-9"
            >
              <Save size={16} />
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save to disk</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => saveContent(null)} className="h-9 w-9">
              <Download size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save As...</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
