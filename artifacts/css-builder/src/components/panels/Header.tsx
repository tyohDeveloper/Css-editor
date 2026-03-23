import React from 'react';
import { FileCode, Save, FolderOpen, Plus, Download } from 'lucide-react';
import { useCssStore } from '@/store/use-css-store';
import { generateCssString } from '@/lib/css-parser';
import {
  hasFileSystemAccess,
  openCssFile,
  saveCssFile,
  downloadCssFile,
  type FileSystemFileHandle,
} from '@/lib/file-system-access';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const {
    fileName, isDirty, rules, fileHandle,
    setFileName, setFileHandle, loadCssText, resetState, setDirty,
  } = useCssStore();
  const { toast } = useToast();

  const handleNew = () => {
    if (isDirty && !confirm('You have unsaved changes. Create new anyway?')) return;
    resetState();
  };

  const handleOpen = async () => {
    try {
      if (hasFileSystemAccess()) {
        const result = await openCssFile();
        if (!result) return;
        const text = await result.file.text();
        loadCssText(text);
        setFileName(result.file.name);
        setFileHandle(result.handle);
        toast({ title: 'File loaded', description: result.file.name });
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.css';
        input.onchange = async (e: Event) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          if (!file) return;
          const text = await file.text();
          loadCssText(text);
          setFileName(file.name);
          setFileHandle(null);
          toast({ title: 'File loaded', description: file.name });
        };
        input.click();
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error(err);
        toast({ title: 'Failed to open file', variant: 'destructive' });
      }
    }
  };

  const handleSave = async (forceNew: boolean = false) => {
    const cssContent = generateCssString(rules);
    const handleToUse: FileSystemFileHandle | null = forceNew ? null : fileHandle;

    if (hasFileSystemAccess()) {
      try {
        const handle = await saveCssFile(cssContent, fileName, handleToUse);
        if (!handle) return;
        const file = await handle.getFile();
        setFileName(file.name);
        setFileHandle(handle);
        setDirty(false);
        toast({ title: 'Saved', description: file.name });
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error(err);
          toast({ title: 'Failed to save', variant: 'destructive' });
        }
      }
    } else {
      downloadCssFile(cssContent, fileName);
      setDirty(false);
      toast({ title: 'File downloaded', description: fileName });
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
            <span className={isDirty ? 'text-accent font-medium' : ''}>
              {isDirty && '*'}{fileName}
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
          <TooltipContent>Open .css File</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isDirty ? 'default' : 'secondary'}
              size="sm"
              onClick={() => handleSave(false)}
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
            <Button variant="outline" size="icon" onClick={() => handleSave(true)} className="h-9 w-9">
              <Download size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save As...</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
