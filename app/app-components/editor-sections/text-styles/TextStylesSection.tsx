'use client';

import { useState } from 'react';
import { type ReelState } from '../../../page';
import { POPULAR_FONTS, TEXT_DECORATIONS } from './constants';
import { TemplatesSection } from './TemplatesSection';

interface TextStylesSectionProps {
  reelState: ReelState;
  showText: boolean;
  setShowText: (show: boolean) => void;
  textStyle: ReelState['textStyle'];
  onStyleChange: (style: Partial<ReelState['textStyle']>) => void;
  savedTemplates: ReelState['savedTemplates'];
  onSaveTemplate: (name: string) => void;
  onApplyTemplate: (templateId: string) => void;
}

export function TextStylesSection({
  showText,
  setShowText,
  textStyle,
  onStyleChange,
  savedTemplates,
  onSaveTemplate,
  onApplyTemplate,
}: TextStylesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-text">Show Text</span>
        <button
          onClick={() => setShowText(!showText)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showText ? 'bg-primary' : 'bg-gray-600'
          }`}
        >
          <span
            className={`${
              showText ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-accent transition-transform`}
          />
        </button>
      </div>

      <TemplatesSection
        savedTemplates={savedTemplates}
        onSaveTemplate={onSaveTemplate}
        onApplyTemplate={onApplyTemplate}
        textStyle={textStyle}
      />

      {/* Font Controls */}
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-text">Font Family</label>
          <select
            value={textStyle.fontFamily}
            onChange={(e) => onStyleChange({ fontFamily: e.target.value })}
            className="w-full rounded border border-gray-200 bg-accent p-2 text-text"
          >
            {POPULAR_FONTS.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-text">Font Weight</label>
          <div className="flex gap-2">
            <button
              onClick={() => onStyleChange({ fontWeight: 'normal' })}
              className={`flex-1 rounded px-4 py-2 ${
                textStyle.fontWeight === 'normal'
                  ? 'bg-primary text-accent'
                  : 'bg-accent text-text hover:bg-gray-50'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onStyleChange({ fontWeight: 'bold' })}
              className={`flex-1 rounded px-4 py-2 ${
                textStyle.fontWeight === 'bold'
                  ? 'bg-primary text-accent'
                  : 'bg-accent text-text hover:bg-gray-50'
              }`}
            >
              Bold
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-text">Text Color</label>
          <input
            type="color"
            value={textStyle.color}
            onChange={(e) => onStyleChange({ color: e.target.value })}
            className="h-10 w-full rounded"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-text">Text Size</label>
          <div className="flex gap-2">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => onStyleChange({ size: size as 'small' | 'medium' | 'large' })}
                className={`flex-1 rounded px-4 py-2 ${
                  textStyle.size === size
                    ? 'bg-primary text-accent'
                    : 'bg-accent text-text hover:bg-gray-50'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-text">Text Alignment</label>
          <div className="flex gap-2">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                onClick={() => onStyleChange({ align: align as 'left' | 'center' | 'right' })}
                className={`flex-1 rounded px-4 py-2 ${
                  textStyle.align === align
                    ? 'bg-primary text-accent'
                    : 'bg-accent text-text hover:bg-gray-50'
                }`}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-text">Text Decorations</label>
          <div className="grid grid-cols-2 gap-4">
            {TEXT_DECORATIONS.map((decoration) => (
              <button
                key={decoration.id}
                onClick={() => onStyleChange({ decoration: decoration.id as any })}
                className={`flex h-24 items-center justify-center rounded-lg bg-accent ${
                  textStyle.decoration === decoration.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <span
                  style={{
                    ...decoration.style,
                    color: textStyle.color,
                    fontFamily: textStyle.fontFamily,
                  }}
                  className="text-text"
                >
                  {decoration.preview}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 