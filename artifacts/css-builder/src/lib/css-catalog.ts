export type PropertyType = 'string' | 'length' | 'color' | 'enum' | 'opacity';

export interface CssPropertyDef {
  name: string;
  type: PropertyType;
  options?: string[];
  defaultUnit?: string;
  defaultValue: string;
  presets?: string[];
}

export interface CssPropertyGroup {
  name: string;
  properties: CssPropertyDef[];
}

export interface CssCategory {
  name: string;
  selectors: string[];
}

const LENGTH_PRESETS = ['0', '4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px', 'auto'];
const EM_PRESETS = ['0', '0.25em', '0.5em', '0.75em', '1em', '1.25em', '1.5em', '2em', '3em', 'auto'];
const PERCENT_PRESETS = ['0%', '25%', '50%', '75%', '100%', 'auto'];

const TYPOGRAPHY_GROUP: CssPropertyGroup = {
  name: 'Typography',
  properties: [
    { name: 'font-family', type: 'string', defaultValue: 'sans-serif', presets: ['sans-serif', 'serif', 'monospace', 'Georgia, serif', 'Arial, sans-serif', 'system-ui, sans-serif'] },
    { name: 'font-size', type: 'length', defaultUnit: 'px', defaultValue: '16px', presets: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px', '1em', '1.25em', '1.5em', '2em'] },
    { name: 'font-weight', type: 'enum', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'], defaultValue: 'normal' },
    { name: 'font-style', type: 'enum', options: ['normal', 'italic', 'oblique'], defaultValue: 'normal' },
    { name: 'color', type: 'color', defaultValue: '#333333' },
    { name: 'text-align', type: 'enum', options: ['left', 'center', 'right', 'justify'], defaultValue: 'left' },
    { name: 'text-decoration', type: 'enum', options: ['none', 'underline', 'overline', 'line-through'], defaultValue: 'none' },
    { name: 'text-transform', type: 'enum', options: ['none', 'capitalize', 'uppercase', 'lowercase'], defaultValue: 'none' },
    { name: 'line-height', type: 'length', defaultUnit: 'em', defaultValue: '1.5em', presets: ['1em', '1.25em', '1.5em', '1.75em', '2em', 'normal'] },
    { name: 'letter-spacing', type: 'length', defaultUnit: 'px', defaultValue: '0px', presets: ['0px', '0.5px', '1px', '2px', '-0.5px'] },
  ],
};

const MARGIN_GROUP: CssPropertyGroup = {
  name: 'Margin',
  properties: [
    { name: 'margin', type: 'length', defaultUnit: 'px', defaultValue: '0px', presets: LENGTH_PRESETS },
    { name: 'margin-top', type: 'length', defaultUnit: 'px', defaultValue: '0px', presets: LENGTH_PRESETS },
    { name: 'margin-right', type: 'length', defaultUnit: 'px', defaultValue: '0px', presets: LENGTH_PRESETS },
    { name: 'margin-bottom', type: 'length', defaultUnit: 'px', defaultValue: '0px', presets: LENGTH_PRESETS },
    { name: 'margin-left', type: 'length', defaultUnit: 'px', defaultValue: '0px', presets: LENGTH_PRESETS },
  ],
};

const PADDING_GROUP: CssPropertyGroup = {
  name: 'Padding',
  properties: [
    { name: 'padding', type: 'length', defaultUnit: 'px', defaultValue: '8px', presets: LENGTH_PRESETS },
    { name: 'padding-top', type: 'length', defaultUnit: 'px', defaultValue: '8px', presets: LENGTH_PRESETS },
    { name: 'padding-right', type: 'length', defaultUnit: 'px', defaultValue: '8px', presets: LENGTH_PRESETS },
    { name: 'padding-bottom', type: 'length', defaultUnit: 'px', defaultValue: '8px', presets: LENGTH_PRESETS },
    { name: 'padding-left', type: 'length', defaultUnit: 'px', defaultValue: '8px', presets: LENGTH_PRESETS },
  ],
};

const SIZING_GROUP: CssPropertyGroup = {
  name: 'Sizing',
  properties: [
    { name: 'width', type: 'length', defaultUnit: '%', defaultValue: '100%', presets: PERCENT_PRESETS },
    { name: 'height', type: 'length', defaultUnit: 'px', defaultValue: 'auto', presets: [...LENGTH_PRESETS, '100vh'] },
    { name: 'max-width', type: 'length', defaultUnit: '%', defaultValue: '100%', presets: ['100%', '800px', '960px', '1200px', 'none'] },
    { name: 'min-width', type: 'length', defaultUnit: 'px', defaultValue: '0px', presets: ['0px', '200px', '300px', '400px'] },
    { name: 'max-height', type: 'length', defaultUnit: 'px', defaultValue: 'auto', presets: [...LENGTH_PRESETS, '100vh'] },
    { name: 'min-height', type: 'length', defaultUnit: 'px', defaultValue: '0px', presets: ['0px', '100px', '200px', '100vh'] },
  ],
};

const BACKGROUND_GROUP: CssPropertyGroup = {
  name: 'Background',
  properties: [
    { name: 'background-color', type: 'color', defaultValue: '#ffffff' },
    { name: 'background-image', type: 'string', defaultValue: 'none', presets: ['none', 'linear-gradient(to bottom, #fff, #f0f0f0)', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'] },
    { name: 'background-size', type: 'enum', options: ['auto', 'cover', 'contain', '100% 100%'], defaultValue: 'auto' },
    { name: 'background-repeat', type: 'enum', options: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'], defaultValue: 'no-repeat' },
    { name: 'background-position', type: 'enum', options: ['center', 'top', 'bottom', 'left', 'right'], defaultValue: 'center' },
  ],
};

const BORDER_GROUP: CssPropertyGroup = {
  name: 'Border',
  properties: [
    { name: 'border-width', type: 'length', defaultUnit: 'px', defaultValue: '1px', presets: ['1px', '2px', '4px', '8px'] },
    { name: 'border-style', type: 'enum', options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove'], defaultValue: 'solid' },
    { name: 'border-color', type: 'color', defaultValue: '#dddddd' },
    { name: 'border-radius', type: 'length', defaultUnit: 'px', defaultValue: '4px', presets: ['0px', '2px', '4px', '8px', '12px', '16px', '24px', '50%', '9999px'] },
  ],
};

const DISPLAY_GROUP: CssPropertyGroup = {
  name: 'Display & Layout',
  properties: [
    { name: 'display', type: 'enum', options: ['block', 'inline', 'inline-block', 'flex', 'grid', 'none', 'table'], defaultValue: 'block' },
    { name: 'position', type: 'enum', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'], defaultValue: 'static' },
    { name: 'overflow', type: 'enum', options: ['visible', 'hidden', 'scroll', 'auto'], defaultValue: 'visible' },
    { name: 'z-index', type: 'string', defaultValue: 'auto', presets: ['auto', '0', '1', '10', '100', '-1'] },
  ],
};

const EFFECTS_GROUP: CssPropertyGroup = {
  name: 'Effects',
  properties: [
    { name: 'opacity', type: 'opacity', defaultValue: '1' },
    { name: 'box-shadow', type: 'string', defaultValue: 'none', presets: ['none', '0 1px 3px rgba(0,0,0,0.12)', '0 4px 6px rgba(0,0,0,0.1)', '0 10px 15px rgba(0,0,0,0.1)', '0 0 0 3px rgba(59,130,246,0.4)'] },
    { name: 'transition', type: 'string', defaultValue: 'all 0.2s ease', presets: ['none', 'all 0.2s ease', 'opacity 0.2s ease', 'transform 0.2s ease', 'color 0.15s ease, background-color 0.15s ease'] },
    { name: 'cursor', type: 'enum', options: ['auto', 'default', 'pointer', 'text', 'not-allowed', 'crosshair'], defaultValue: 'auto' },
  ],
};

const LISTS_GROUP: CssPropertyGroup = {
  name: 'List Style',
  properties: [
    { name: 'list-style-type', type: 'enum', options: ['disc', 'circle', 'square', 'decimal', 'decimal-leading-zero', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha', 'none'], defaultValue: 'disc' },
    { name: 'list-style-position', type: 'enum', options: ['outside', 'inside'], defaultValue: 'outside' },
    { name: 'list-style-image', type: 'string', defaultValue: 'none', presets: ['none'] },
  ],
};

const TABLE_GROUP: CssPropertyGroup = {
  name: 'Table',
  properties: [
    { name: 'border-collapse', type: 'enum', options: ['separate', 'collapse'], defaultValue: 'collapse' },
    { name: 'border-spacing', type: 'length', defaultUnit: 'px', defaultValue: '0px', presets: ['0px', '2px', '4px', '8px'] },
    { name: 'caption-side', type: 'enum', options: ['top', 'bottom'], defaultValue: 'top' },
    { name: 'empty-cells', type: 'enum', options: ['show', 'hide'], defaultValue: 'show' },
    { name: 'table-layout', type: 'enum', options: ['auto', 'fixed'], defaultValue: 'auto' },
    { name: 'vertical-align', type: 'enum', options: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom'], defaultValue: 'middle' },
  ],
};

const FORM_GROUP: CssPropertyGroup = {
  name: 'Form & Input',
  properties: [
    { name: 'outline', type: 'string', defaultValue: 'none', presets: ['none', '2px solid #3b82f6', '2px solid transparent'] },
    { name: 'outline-color', type: 'color', defaultValue: '#3b82f6' },
    { name: 'outline-width', type: 'length', defaultUnit: 'px', defaultValue: '2px', presets: ['1px', '2px', '3px', '4px'] },
    { name: 'outline-style', type: 'enum', options: ['none', 'solid', 'dashed', 'dotted', 'double'], defaultValue: 'solid' },
    { name: 'resize', type: 'enum', options: ['none', 'both', 'horizontal', 'vertical'], defaultValue: 'vertical' },
    { name: 'appearance', type: 'enum', options: ['none', 'auto'], defaultValue: 'none' },
  ],
};

const IMAGE_GROUP: CssPropertyGroup = {
  name: 'Image',
  properties: [
    { name: 'object-fit', type: 'enum', options: ['fill', 'contain', 'cover', 'none', 'scale-down'], defaultValue: 'contain' },
    { name: 'object-position', type: 'string', defaultValue: 'center', presets: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right'] },
  ],
};

const ANCHOR_GROUP: CssPropertyGroup = {
  name: 'Link State',
  properties: [
    { name: 'text-decoration', type: 'enum', options: ['none', 'underline', 'overline', 'line-through'], defaultValue: 'underline' },
  ],
};

const COMMON_GROUPS = [TYPOGRAPHY_GROUP, MARGIN_GROUP, PADDING_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, DISPLAY_GROUP, EFFECTS_GROUP];
const BLOCK_GROUPS = [MARGIN_GROUP, PADDING_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, DISPLAY_GROUP, EFFECTS_GROUP];

const SELECTOR_PROPERTY_GROUPS: Record<string, CssPropertyGroup[]> = {
  body: [TYPOGRAPHY_GROUP, MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP, DISPLAY_GROUP, EFFECTS_GROUP],
  h1: COMMON_GROUPS,
  h2: COMMON_GROUPS,
  h3: COMMON_GROUPS,
  h4: COMMON_GROUPS,
  h5: COMMON_GROUPS,
  h6: COMMON_GROUPS,
  p: COMMON_GROUPS,
  a: [TYPOGRAPHY_GROUP, ANCHOR_GROUP, MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  em: [TYPOGRAPHY_GROUP, EFFECTS_GROUP],
  strong: [TYPOGRAPHY_GROUP, EFFECTS_GROUP],
  span: [TYPOGRAPHY_GROUP, MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  blockquote: COMMON_GROUPS,
  div: BLOCK_GROUPS,
  header: BLOCK_GROUPS,
  main: BLOCK_GROUPS,
  footer: BLOCK_GROUPS,
  nav: BLOCK_GROUPS,
  section: BLOCK_GROUPS,
  article: BLOCK_GROUPS,
  aside: BLOCK_GROUPS,
  ul: [LISTS_GROUP, MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, DISPLAY_GROUP, EFFECTS_GROUP],
  ol: [LISTS_GROUP, MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, DISPLAY_GROUP, EFFECTS_GROUP],
  li: [TYPOGRAPHY_GROUP, LISTS_GROUP, MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  dl: [MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP, DISPLAY_GROUP],
  dt: [TYPOGRAPHY_GROUP, MARGIN_GROUP, PADDING_GROUP],
  dd: [TYPOGRAPHY_GROUP, MARGIN_GROUP, PADDING_GROUP],
  table: [TABLE_GROUP, MARGIN_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  thead: [TYPOGRAPHY_GROUP, BACKGROUND_GROUP, BORDER_GROUP],
  tbody: [TYPOGRAPHY_GROUP, BACKGROUND_GROUP, BORDER_GROUP],
  tfoot: [TYPOGRAPHY_GROUP, BACKGROUND_GROUP, BORDER_GROUP],
  tr: [BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  th: [TYPOGRAPHY_GROUP, TABLE_GROUP, PADDING_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  td: [TYPOGRAPHY_GROUP, TABLE_GROUP, PADDING_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  caption: [TYPOGRAPHY_GROUP, MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP],
  form: [MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, DISPLAY_GROUP, EFFECTS_GROUP],
  input: [TYPOGRAPHY_GROUP, FORM_GROUP, MARGIN_GROUP, PADDING_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  textarea: [TYPOGRAPHY_GROUP, FORM_GROUP, MARGIN_GROUP, PADDING_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  select: [TYPOGRAPHY_GROUP, FORM_GROUP, MARGIN_GROUP, PADDING_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  button: [TYPOGRAPHY_GROUP, FORM_GROUP, MARGIN_GROUP, PADDING_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  label: [TYPOGRAPHY_GROUP, MARGIN_GROUP, PADDING_GROUP, DISPLAY_GROUP, EFFECTS_GROUP],
  fieldset: [MARGIN_GROUP, PADDING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, DISPLAY_GROUP],
  legend: [TYPOGRAPHY_GROUP, PADDING_GROUP, BACKGROUND_GROUP],
  img: [IMAGE_GROUP, MARGIN_GROUP, PADDING_GROUP, SIZING_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  video: [IMAGE_GROUP, MARGIN_GROUP, PADDING_GROUP, SIZING_GROUP, BORDER_GROUP, EFFECTS_GROUP],
  audio: [SIZING_GROUP, MARGIN_GROUP, DISPLAY_GROUP],
  figure: BLOCK_GROUPS,
  figcaption: [TYPOGRAPHY_GROUP, MARGIN_GROUP, PADDING_GROUP],
};

const ALL_GROUPS = [TYPOGRAPHY_GROUP, LISTS_GROUP, TABLE_GROUP, FORM_GROUP, IMAGE_GROUP, MARGIN_GROUP, PADDING_GROUP, SIZING_GROUP, BACKGROUND_GROUP, BORDER_GROUP, DISPLAY_GROUP, EFFECTS_GROUP];

export const getPropertyGroupsForSelector = (selector: string): CssPropertyGroup[] => {
  return SELECTOR_PROPERTY_GROUPS[selector] ?? COMMON_GROUPS;
};

export const CSS_CATEGORIES: CssCategory[] = [
  {
    name: 'Typography',
    selectors: ['body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'em', 'strong', 'span', 'blockquote'],
  },
  {
    name: 'Layout',
    selectors: ['div', 'header', 'main', 'footer', 'nav', 'section', 'article', 'aside'],
  },
  {
    name: 'Lists',
    selectors: ['ul', 'ol', 'li', 'dl', 'dt', 'dd'],
  },
  {
    name: 'Tables',
    selectors: ['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption'],
  },
  {
    name: 'Forms',
    selectors: ['form', 'input', 'textarea', 'select', 'button', 'label', 'fieldset', 'legend'],
  },
  {
    name: 'Images & Media',
    selectors: ['img', 'video', 'audio', 'figure', 'figcaption'],
  },
];

export const isStandardProperty = (propName: string): boolean => {
  return ALL_GROUPS.some(group =>
    group.properties.some(p => p.name === propName)
  );
};

export const STANDARD_SELECTORS: ReadonlySet<string> = new Set(Object.keys(SELECTOR_PROPERTY_GROUPS));

export const isStandardSelector = (selector: string): boolean =>
  STANDARD_SELECTORS.has(selector);
