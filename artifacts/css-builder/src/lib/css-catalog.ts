export type PropertyType = 'string' | 'length' | 'color' | 'enum' | 'opacity';

export interface CssPropertyDef {
  name: string;
  type: PropertyType;
  options?: string[]; // for enum
  defaultUnit?: string; // for length
}

export interface CssPropertyGroup {
  name: string;
  properties: CssPropertyDef[];
}

export interface CssCategory {
  name: string;
  selectors: string[];
}

export const CSS_CATEGORIES: CssCategory[] = [
  {
    name: 'Typography',
    selectors: ['body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'em', 'strong', 'span', 'blockquote']
  },
  {
    name: 'Layout',
    selectors: ['div', 'header', 'main', 'footer', 'nav', 'section', 'article', 'aside']
  },
  {
    name: 'Lists',
    selectors: ['ul', 'ol', 'li', 'dl', 'dt', 'dd']
  },
  {
    name: 'Tables',
    selectors: ['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption']
  },
  {
    name: 'Forms',
    selectors: ['form', 'input', 'textarea', 'select', 'button', 'label', 'fieldset', 'legend']
  },
  {
    name: 'Images & Media',
    selectors: ['img', 'video', 'audio', 'figure', 'figcaption']
  }
];

export const PROPERTY_GROUPS: CssPropertyGroup[] = [
  {
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
      { name: 'letter-spacing', type: 'length', defaultUnit: 'px' }
    ]
  },
  {
    name: 'Box Model: Margin',
    properties: [
      { name: 'margin', type: 'length', defaultUnit: 'px' },
      { name: 'margin-top', type: 'length', defaultUnit: 'px' },
      { name: 'margin-right', type: 'length', defaultUnit: 'px' },
      { name: 'margin-bottom', type: 'length', defaultUnit: 'px' },
      { name: 'margin-left', type: 'length', defaultUnit: 'px' },
    ]
  },
  {
    name: 'Box Model: Padding',
    properties: [
      { name: 'padding', type: 'length', defaultUnit: 'px' },
      { name: 'padding-top', type: 'length', defaultUnit: 'px' },
      { name: 'padding-right', type: 'length', defaultUnit: 'px' },
      { name: 'padding-bottom', type: 'length', defaultUnit: 'px' },
      { name: 'padding-left', type: 'length', defaultUnit: 'px' },
    ]
  },
  {
    name: 'Sizing',
    properties: [
      { name: 'width', type: 'length', defaultUnit: '%' },
      { name: 'height', type: 'length', defaultUnit: 'px' },
      { name: 'max-width', type: 'length', defaultUnit: '%' },
      { name: 'min-width', type: 'length', defaultUnit: 'px' },
      { name: 'max-height', type: 'length', defaultUnit: 'px' },
      { name: 'min-height', type: 'length', defaultUnit: 'px' },
    ]
  },
  {
    name: 'Background',
    properties: [
      { name: 'background-color', type: 'color' },
      { name: 'background-image', type: 'string' },
      { name: 'background-size', type: 'enum', options: ['auto', 'cover', 'contain', '100% 100%'] },
      { name: 'background-repeat', type: 'enum', options: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'] },
      { name: 'background-position', type: 'enum', options: ['center', 'top', 'bottom', 'left', 'right'] },
    ]
  },
  {
    name: 'Border',
    properties: [
      { name: 'border-width', type: 'length', defaultUnit: 'px' },
      { name: 'border-style', type: 'enum', options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove'] },
      { name: 'border-color', type: 'color' },
      { name: 'border-radius', type: 'length', defaultUnit: 'px' },
    ]
  },
  {
    name: 'Display & Layout',
    properties: [
      { name: 'display', type: 'enum', options: ['block', 'inline', 'inline-block', 'flex', 'grid', 'none', 'table'] },
      { name: 'position', type: 'enum', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'] },
      { name: 'top', type: 'length', defaultUnit: 'px' },
      { name: 'right', type: 'length', defaultUnit: 'px' },
      { name: 'bottom', type: 'length', defaultUnit: 'px' },
      { name: 'left', type: 'length', defaultUnit: 'px' },
      { name: 'z-index', type: 'string' },
      { name: 'overflow', type: 'enum', options: ['visible', 'hidden', 'scroll', 'auto'] },
    ]
  },
  {
    name: 'Effects',
    properties: [
      { name: 'opacity', type: 'opacity' },
      { name: 'box-shadow', type: 'string' },
      { name: 'transition', type: 'string' },
      { name: 'cursor', type: 'enum', options: ['auto', 'default', 'pointer', 'text', 'not-allowed', 'crosshair'] },
    ]
  },
  {
    name: 'Lists (ul, ol, li)',
    properties: [
      { name: 'list-style-type', type: 'enum', options: ['disc', 'circle', 'square', 'decimal', 'lower-roman', 'upper-roman', 'none'] },
      { name: 'list-style-position', type: 'enum', options: ['outside', 'inside'] },
      { name: 'list-style-image', type: 'string' },
    ]
  }
];

// Helper to check if a property is standard
export const isStandardProperty = (propName: string): boolean => {
  return PROPERTY_GROUPS.some(group => 
    group.properties.some(p => p.name === propName)
  );
};
