import { RuleState, PropertyState } from '@/store/use-css-store';

/**
 * Generates a formatted CSS string from the state object.
 */
export const generateCssString = (rules: Record<string, RuleState>): string => {
  let cssStr = '';
  
  for (const [selector, properties] of Object.entries(rules)) {
    const activeProps = Object.entries(properties)
      .filter(([_, propState]) => propState.enabled)
      .map(([propName, propState]) => `  ${propName}: ${propState.value};`);
      
    if (activeProps.length > 0) {
      cssStr += `${selector} {\n${activeProps.join('\n')}\n}\n\n`;
    }
  }
  
  return cssStr.trim();
};

/**
 * Parses a flat CSS string into the state object.
 * Note: This is a basic parser. It ignores media queries, nested rules, and comments.
 */
export const parseCssString = (css: string): Record<string, RuleState> => {
  const result: Record<string, RuleState> = {};
  
  // Remove comments
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Match rules: selector { properties }
  const ruleRegex = /([^{]+)\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = ruleRegex.exec(noComments)) !== null) {
    const rawSelectors = match[1].trim();
    const rawProperties = match[2].trim();
    
    if (!rawSelectors || !rawProperties) continue;
    
    // Split multiple selectors (e.g., "h1, h2")
    const selectors = rawSelectors.split(',').map(s => s.trim());
    
    // Parse properties
    const propsList = rawProperties.split(';').map(p => p.trim()).filter(p => p.length > 0);
    const parsedProps: RuleState = {};
    
    for (const propStr of propsList) {
      const parts = propStr.split(':');
      if (parts.length >= 2) {
        const propName = parts[0].trim();
        const propValue = parts.slice(1).join(':').trim(); // Handle values that might contain ':'
        
        parsedProps[propName] = {
          value: propValue,
          enabled: true
        };
      }
    }
    
    // Assign to state
    if (Object.keys(parsedProps).length > 0) {
      for (const sel of selectors) {
        // If selector already exists, merge properties
        if (result[sel]) {
          result[sel] = { ...result[sel], ...parsedProps };
        } else {
          result[sel] = parsedProps;
        }
      }
    }
  }
  
  return result;
};

/**
 * Converts a RuleState (for one selector) to a flat CSS properties string
 * suitable for passing to CSSBuilder (no selector wrapper).
 * Only includes enabled properties.
 */
export const ruleStateToStyleString = (ruleState: RuleState): string => {
  return Object.entries(ruleState)
    .filter(([, ps]) => ps.enabled && ps.value.trim() !== '')
    .map(([prop, ps]) => `${prop}: ${ps.value};`)
    .join('\n');
};

/**
 * Parses a flat CSS properties string (output from CSSBuilder's onChange)
 * into a RuleState. All parsed properties are enabled.
 */
export const styleStringToRuleState = (css: string): RuleState => {
  const result: RuleState = {};
  const lines = css.split(/[\n;]/).map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const colon = line.indexOf(':');
    if (colon < 1) continue;
    const prop = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/;$/, '').trim();
    if (prop) {
      result[prop] = { value, enabled: true } satisfies PropertyState;
    }
  }
  return result;
};
