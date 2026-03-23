export type PropertyType = 'string' | 'length' | 'color' | 'enum' | 'opacity';

export interface CssPropertyDef {
  name: string;
  type: PropertyType;
  options?: string[];
  defaultUnit?: string;
}

export interface CssPropertyGroup {
  name: string;
  properties: CssPropertyDef[];
}

export interface CssCategory {
  name: string;
  selectors: string[];
}

const TYPOGRAPHY_GROUP: CssPropertyGroup = {
  name: 'Typography',
  properties: [
    { name: 'font-family', type: 'string' },
    { name: 'font-size', type: 'length', defaultUnit: 'px' },
    { name: 'font-weight', type: 'enum', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { name: 'font-style', type: 'enum', options: ['normal', 'italic', 'oblique'] },
    { name: 'color', type: 'color' },
    { name: 'text-align', type: 'enum', options: ['left', 'center', 'right', 'justify'] },
    { name: 'text-decoration', type: 'enum', options: ['none', 'underline', 'overline', 'line-through'] },
    { name: 'text-transform', type: 'enum', options: ['none', 'capitalize', 'uppercase', 'lowercase'] },
    { name: 'line-height', type: 'length', defaultUnit: 'em' },
    { name: 'letter-spacing', type: 'length', defaultUnit: 'px' },
  ],
};

const MARGIN_GROUP: CssPropertyGroup = {
  name: 'Margin',
  properties: [
    { name: 'margin', type: 'length', defaultUnit: 'px' },
    { name: 'margin-top', type: 'length', defaultUnit: 'px' },
    { name: 'margin-right', type: 'length', defaultUnit: 'px' },
    { name: 'margin-bottom', type: 'length', defaultUnit: 'px' },
    { name: 'margin-left', type: 'length', defaultUnit: 'px' },
  ],
};

const PADDING_GROUP: CssPropertyGroup = {
  name: 'Padding',
  properties: [
    { name: 'padding', type: 'length', defaultUnit: 'px' },
    { name: 'padding-top', type: 'length', defaultUnit: 'px' },
    { name: 'padding-right', type: 'length', defaultUnit: 'px' },
    { name: 'padding-bottom', type: 'length', defaultUnit: 'px' },
    { name: 'padding-left', type: 'length', defaultUnit: 'px' },
  ],
};

const SIZING_GROUP: CssPropertyGroup = {
  name: 'Sizing',
  properties: [
    { name: 'width', type: 'length', defaultUnit: '%' },
    { name: 'height', type: 'length', defaultUnit: 'px' },
    { name: 'max-width', type: 'length', defaultUnit: '%' },
    { name: 'min-width', type: 'length', defaultUnit: 'px' },
    { name: 'max-height', type: 'length', defaultUnit: 'px' },
    { name: 'min-height', type: 'length', defaultUnit: 'px' },
  ],
};

const BACKGROUND_GROUP: CssPropertyGroup = {
  name: 'Background',
  properties: [
    { name: 'background-color', type: 'color' },
    { name: 'background-image', type: 'string' },
    { name: 'background-size', type: 'enum', options: ['auto', 'cover', 'contain', '100% 100%'] },
    { name: 'background-repeat', type: 'enum', options: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'] },
    { name: 'background-position', type: 'enum', options: ['center', 'top', 'bottom', 'left', 'right'] },
  ],
};

const BORDER_GROUP: CssPropertyGroup = {
  name: 'Border',
  properties: [
    { name: 'border-width', type: 'length', defaultUnit: 'px' },
    { name: 'border-style', type: 'enum', options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove'] },
    { name: 'border-color', type: 'color' },
    { name: 'border-radius', type: 'length', defaultUnit: 'px' },
  ],
};

const DISPLAY_GROUP: CssPropertyGroup = {
  name: 'Display & Layout',
  properties: [
    { name: 'display', type: 'enum', options: ['block', 'inline', 'inline-block', 'flex', 'grid', 'none', 'table'] },
    { name: 'position', type: 'enum', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'] },
    { name: 'overflow', type: 'enum', options: ['visible', 'hidden', 'scroll', 'auto'] },
    { name: 'z-index', type: 'string' },
  ],
};

const EFFECTS_GROUP: CssPropertyGroup = {
  name: 'Effects',
  properties: [
    { name: 'opacity', type: 'opacity' },
    { name: 'box-shadow', type: 'string' },
    { name: 'transition', type: 'string' },
    { name: 'cursor', type: 'enum', options: ['auto', 'default', 'pointer', 'text', 'not-allowed', 'crosshair'] },
  ],
};

const LISTS_GROUP: CssPropertyGroup = {
  name: 'List Style',
  properties: [
    { name: 'list-style-type', type: 'enum', options: ['disc', 'circle', 'square', 'decimal', 'decimal-leading-zero', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha', 'none'] },
    { name: 'list-style-position', type: 'enum', options: ['outside', 'inside'] },
    { name: 'list-style-image', type: 'string' },
  ],
};

const TABLE_GROUP: CssPropertyGroup = {
  name: 'Table',
  properties: [
    { name: 'border-collapse', type: 'enum', options: ['separate', 'collapse'] },
    { name: 'border-spacing', type: 'length', defaultUnit: 'px' },
    { name: 'caption-side', type: 'enum', options: ['top', 'bottom'] },
    { name: 'empty-cells', type: 'enum', options: ['show', 'hide'] },
    { name: 'table-layout', type: 'enum', options: ['auto', 'fixed'] },
    { name: 'vertical-align', type: 'enum', options: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom'] },
  ],
};

const FORM_GROUP: CssPropertyGroup = {
  name: 'Form & Input',
  properties: [
    { name: 'outline', type: 'string' },
    { name: 'outline-color', type: 'color' },
    { name: 'outline-width', type: 'length', defaultUnit: 'px' },
    { name: 'outline-style', type: 'enum', options: ['none', 'solid', 'dashed', 'dotted', 'double'] },
    { name: 'resize', type: 'enum', options: ['none', 'both', 'horizontal', 'vertical'] },
    { name: 'appearance', type: 'enum', options: ['none', 'auto'] },
  ],
};

const IMAGE_GROUP: CssPropertyGroup = {
  name: 'Image',
  properties: [
    { name: 'object-fit', type: 'enum', options: ['fill', 'contain', 'cover', 'none', 'scale-down'] },
    { name: 'object-position', type: 'string' },
  ],
};

const ANCHOR_GROUP: CssPropertyGroup = {
  name: 'Link State',
  properties: [
    { name: 'text-decoration', type: 'enum', options: ['none', 'underline', 'overline', 'line-through'] },
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
