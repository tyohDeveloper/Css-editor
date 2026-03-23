import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { parseCssString } from '@/lib/css-parser';
import { isStandardSelector } from '@/lib/css-catalog';
import type { FileSystemFileHandle } from '@/lib/file-system-access';

export type PropertyState = {
  value: string;
  enabled: boolean;
};

export type RuleState = Record<string, PropertyState>;

export type ViewMode = 'editor' | 'source';

interface CssState {
  fileName: string;
  isDirty: boolean;
  rules: Record<string, RuleState>;
  activeSelector: string | null;
  customSelectors: string[];
  viewMode: ViewMode;
  fileHandle: FileSystemFileHandle | null;

  setFileName: (name: string) => void;
  setFileHandle: (handle: FileSystemFileHandle | null) => void;
  setDirty: (dirty: boolean) => void;
  setActiveSelector: (selector: string | null) => void;
  setViewMode: (mode: ViewMode) => void;

  updateProperty: (selector: string, property: string, value: string) => void;
  toggleProperty: (selector: string, property: string, enabled: boolean) => void;
  deleteProperty: (selector: string, property: string) => void;

  addCustomSelector: (selector: string) => void;
  deleteSelector: (selector: string) => void;

  /** Called when opening a file from disk — resets dirty state. */
  loadCssText: (cssText: string) => void;
  /** Called when applying raw source edits — marks dirty. */
  applyRawEdits: (cssText: string) => void;

  resetState: () => void;
}

const initialState = {
  fileName: 'untitled.css',
  isDirty: false,
  rules: {},
  activeSelector: null,
  customSelectors: [],
  viewMode: 'editor' as ViewMode,
  fileHandle: null,
};

function parseAndClassify(cssText: string, existingCustomSelectors: string[]) {
  const parsedRules = parseCssString(cssText);
  const customSelectorSet = new Set(existingCustomSelectors);

  for (const sel of Object.keys(parsedRules)) {
    if (!isStandardSelector(sel)) {
      customSelectorSet.add(sel);
    }
  }

  return { parsedRules, customSelectors: Array.from(customSelectorSet) };
}

export const useCssStore = create<CssState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setFileName: (name) => set({ fileName: name, isDirty: false }),
      setFileHandle: (handle) => set({ fileHandle: handle }),
      setDirty: (dirty) => set({ isDirty: dirty }),
      setActiveSelector: (selector) => set({ activeSelector: selector, viewMode: 'editor' }),
      setViewMode: (mode) => set({ viewMode: mode }),

      updateProperty: (selector, property, value) =>
        set((state) => {
          const selRules = state.rules[selector] ?? {};
          return {
            isDirty: true,
            rules: {
              ...state.rules,
              [selector]: {
                ...selRules,
                [property]: { value, enabled: selRules[property]?.enabled ?? true },
              },
            },
          };
        }),

      toggleProperty: (selector, property, enabled) =>
        set((state) => {
          const selRules = state.rules[selector] ?? {};
          if (!selRules[property]) return state;
          return {
            isDirty: true,
            rules: {
              ...state.rules,
              [selector]: {
                ...selRules,
                [property]: { ...selRules[property], enabled },
              },
            },
          };
        }),

      deleteProperty: (selector, property) =>
        set((state) => {
          const selRules = { ...state.rules[selector] };
          delete selRules[property];
          return {
            isDirty: true,
            rules: { ...state.rules, [selector]: selRules },
          };
        }),

      addCustomSelector: (selector) =>
        set((state) => {
          if (state.customSelectors.includes(selector)) return state;
          return {
            customSelectors: [...state.customSelectors, selector],
            activeSelector: selector,
          };
        }),

      deleteSelector: (selector) =>
        set((state) => {
          const newRules = { ...state.rules };
          delete newRules[selector];
          return {
            isDirty: true,
            rules: newRules,
            customSelectors: state.customSelectors.filter(s => s !== selector),
            activeSelector: state.activeSelector === selector ? null : state.activeSelector,
          };
        }),

      /** File open: parse, classify selectors, reset dirty. */
      loadCssText: (cssText) => {
        const { parsedRules, customSelectors } = parseAndClassify(cssText, get().customSelectors);
        set({ rules: parsedRules, isDirty: false, customSelectors });
      },

      /** Raw source apply: parse, classify selectors, mark dirty. */
      applyRawEdits: (cssText) => {
        const { parsedRules, customSelectors } = parseAndClassify(cssText, get().customSelectors);
        set({ rules: parsedRules, isDirty: true, customSelectors });
      },

      resetState: () => set({ ...initialState }),
    }),
    {
      name: 'css-builder-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        fileName: state.fileName,
        isDirty: state.isDirty,
        rules: state.rules,
        activeSelector: state.activeSelector,
        customSelectors: state.customSelectors,
        viewMode: state.viewMode,
        // fileHandle intentionally excluded: File System API handles are not serializable
      }),
    },
  ),
);
