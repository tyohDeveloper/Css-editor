export interface FileSystemFileHandle {
  readonly kind: 'file';
  readonly name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableFileStream>;
}

export interface FileSystemWritableFileStream {
  write(data: string | BufferSource | Blob): Promise<void>;
  close(): Promise<void>;
}

export interface OpenFilePickerOptions {
  types?: Array<{ description?: string; accept: Record<string, string[]> }>;
  multiple?: boolean;
}

export interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{ description?: string; accept: Record<string, string[]> }>;
}

interface WindowWithFileSystem extends Window {
  showOpenFilePicker?: (opts?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
  showSaveFilePicker?: (opts?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
}

export function hasFileSystemAccess(): boolean {
  return typeof (window as WindowWithFileSystem).showOpenFilePicker === 'function';
}

export async function openCssFile(): Promise<{ file: File; handle: FileSystemFileHandle } | null> {
  const w = window as WindowWithFileSystem;
  if (!w.showOpenFilePicker) return null;
  const [handle] = await w.showOpenFilePicker({
    types: [{ description: 'CSS Files', accept: { 'text/css': ['.css'] } }],
    multiple: false,
  });
  const file = await handle.getFile();
  return { file, handle };
}

export async function saveCssFile(
  content: string,
  suggestedName: string,
  existingHandle: FileSystemFileHandle | null,
): Promise<FileSystemFileHandle | null> {
  const w = window as WindowWithFileSystem;
  if (!w.showSaveFilePicker) return null;

  const handle = existingHandle ?? await w.showSaveFilePicker({
    suggestedName,
    types: [{ description: 'CSS Files', accept: { 'text/css': ['.css'] } }],
  });

  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
  return handle;
}

export function downloadCssFile(content: string, fileName: string): void {
  const blob = new Blob([content], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
