import React, { useState, useEffect } from 'react';
import { PropertyType } from '@/lib/css-catalog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface PropertyInputProps {
  type: PropertyType;
  value: string;
  onChange: (val: string) => void;
  options?: string[];
  defaultUnit?: string;
}

export function PropertyInput({ type, value, onChange, options, defaultUnit }: PropertyInputProps) {
  
  // Handlers for Length type (value + unit)
  if (type === 'length') {
    const parseLength = (val: string) => {
      const match = val.match(/^(-?\d*\.?\d+)(.*)$/);
      if (match) return { num: match[1], unit: match[2] || defaultUnit || 'px' };
      if (val === 'auto') return { num: 'auto', unit: '' };
      return { num: val, unit: defaultUnit || 'px' };
    };

    const parsed = parseLength(value || '');
    const units = ['px', 'em', 'rem', '%', 'vh', 'vw', 'auto'];

    const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newNum = e.target.value;
      if (newNum === 'auto' || newNum === '') {
        onChange(newNum);
      } else {
        onChange(`${newNum}${parsed.unit || defaultUnit || 'px'}`);
      }
    };

    const handleUnitChange = (newUnit: string) => {
      if (newUnit === 'auto') {
        onChange('auto');
      } else if (parsed.num && parsed.num !== 'auto') {
        onChange(`${parsed.num}${newUnit}`);
      } else {
        onChange(`0${newUnit}`);
      }
    };

    return (
      <div className="flex items-center gap-1">
        <Input 
          type={parsed.num === 'auto' ? 'text' : 'number'}
          value={parsed.num} 
          onChange={handleNumChange}
          placeholder="auto"
          className="h-8 text-xs bg-background/50 focus:bg-background"
        />
        <Select value={parsed.unit || (parsed.num === 'auto' ? 'auto' : defaultUnit)} onValueChange={handleUnitChange}>
          <SelectTrigger className="h-8 w-16 px-2 text-xs bg-secondary border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {units.map(u => <SelectItem key={u} value={u || 'none'}>{u || '-'}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Handler for Enum type (Select dropdown)
  if (type === 'enum' && options) {
    return (
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs bg-background/50 focus:bg-background">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Handler for Color type
  if (type === 'color') {
    return (
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
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000, rgba(...)"
          className="h-8 text-xs bg-background/50 font-mono"
        />
      </div>
    );
  }
  
  if (type === 'opacity') {
    const numValue = parseFloat(value) || 1;
    return (
      <div className="flex items-center gap-3">
        <Slider 
          value={[numValue]} 
          min={0} max={1} step={0.05} 
          onValueChange={(vals) => onChange(vals[0].toString())}
          className="flex-1"
        />
        <span className="text-xs w-8 text-right font-mono text-muted-foreground">{numValue.toFixed(2)}</span>
      </div>
    )
  }

  // Fallback string input
  return (
    <Input 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      className="h-8 text-xs bg-background/50"
      placeholder="Value..."
    />
  );
}
