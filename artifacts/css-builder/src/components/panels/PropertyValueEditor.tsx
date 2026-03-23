import React from 'react';
import { CssPropertyDef } from '@/lib/css-catalog';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyValueEditorProps {
  def: CssPropertyDef;
  value: string;
  onChange: (value: string) => void;
  focusRef?: React.RefObject<HTMLElement | null>;
}

export function PropertyValueEditor({ def, value, onChange, focusRef }: PropertyValueEditorProps) {
  const { type, options, defaultUnit, presets } = def;

  if (type === 'color') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border shrink-0 cursor-pointer shadow-sm">
            <input
              type="color"
              value={value || '#ffffff'}
              onChange={(e) => onChange(e.target.value)}
              className="absolute -inset-2 w-12 h-12 cursor-pointer"
            />
          </div>
          <Input
            ref={focusRef as React.RefObject<HTMLInputElement>}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="h-7 text-xs bg-background/50 font-mono flex-1"
          />
        </div>
      </div>
    );
  }

  if (type === 'opacity') {
    const numValue = parseFloat(value);
    const safeNum = isNaN(numValue) ? 1 : numValue;
    return (
      <div className="flex items-center gap-3">
        <Slider
          value={[safeNum]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={(vals) => onChange(vals[0].toString())}
          className="flex-1"
        />
        <span className="text-xs w-8 text-right font-mono text-muted-foreground shrink-0">
          {safeNum.toFixed(2)}
        </span>
      </div>
    );
  }

  if (type === 'enum' && options) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-1">
          {options.map((opt, i) => (
            <button
              key={opt}
              ref={i === 0 ? (focusRef as React.RefObject<HTMLButtonElement>) : undefined}
              onClick={() => onChange(opt)}
              className={`px-2 py-0.5 rounded text-xs font-mono border transition-all ${
                value === opt
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-background/50 text-muted-foreground border-border hover:border-accent/50 hover:text-foreground'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Custom value..."
          className="h-7 text-xs bg-background/50 font-mono"
        />
      </div>
    );
  }

  if (type === 'length') {
    const parseLength = (val: string) => {
      if (val === 'auto') return { num: '', unit: 'auto' };
      if (val === 'none') return { num: '', unit: 'none' };
      if (val === 'normal') return { num: '', unit: 'normal' };
      const match = val.match(/^(-?\d*\.?\d+)(.*)$/);
      if (match) return { num: match[1], unit: match[2] || defaultUnit || 'px' };
      return { num: val, unit: defaultUnit || 'px' };
    };

    const parsed = parseLength(value || '');
    const units = ['px', 'em', 'rem', '%', 'vh', 'vw', 'auto'];

    const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newNum = e.target.value;
      if (newNum === '') {
        onChange('');
      } else {
        const currentUnit = (parsed.unit === 'auto' || parsed.unit === 'none' || parsed.unit === 'normal')
          ? (defaultUnit || 'px')
          : parsed.unit;
        onChange(`${newNum}${currentUnit}`);
      }
    };

    const handleUnitChange = (newUnit: string) => {
      if (newUnit === 'auto') {
        onChange('auto');
      } else if (parsed.num && parsed.unit !== 'auto') {
        onChange(`${parsed.num}${newUnit}`);
      } else {
        onChange(`0${newUnit}`);
      }
    };

    const isSpecialUnit = parsed.unit === 'auto' || parsed.unit === 'none' || parsed.unit === 'normal';

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1">
          <Input
            ref={focusRef as React.RefObject<HTMLInputElement>}
            type={isSpecialUnit ? 'text' : 'number'}
            value={isSpecialUnit ? parsed.unit : parsed.num}
            onChange={handleNumChange}
            placeholder="0"
            className="h-7 text-xs bg-background/50 font-mono flex-1"
            readOnly={isSpecialUnit}
          />
          <Select
            value={isSpecialUnit ? parsed.unit : parsed.unit}
            onValueChange={handleUnitChange}
          >
            <SelectTrigger className="h-7 w-[70px] px-2 text-xs bg-secondary border-none shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {presets && presets.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => onChange(p)}
                className={`px-2 py-0.5 rounded text-xs font-mono border transition-all ${
                  value === p
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-background/50 text-muted-foreground border-border hover:border-accent/50 hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        ref={focusRef as React.RefObject<HTMLInputElement>}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Value..."
        className="h-7 text-xs bg-background/50"
      />
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`px-2 py-0.5 rounded text-xs font-mono border transition-all ${
                value === p
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-background/50 text-muted-foreground border-border hover:border-accent/50 hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
