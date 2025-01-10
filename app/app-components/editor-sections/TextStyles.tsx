'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { type ReelState } from '../../page';

interface TextStylesProps {
  showText: boolean;
  setShowText: (show: boolean) => void;
  textStyle: ReelState['textStyle'];
  onStyleChange: (style: Partial<ReelState['textStyle']>) => void;
  savedTemplates: ReelState['savedTemplates'];
  onSaveTemplate: (name: string) => void;
  onApplyTemplate: (templateId: string) => void;
}

const POPULAR_FONTS = [
  { name: 'Inter', value: 'var(--font-inter)' },
  { name: 'Roboto', value: 'var(--font-roboto)' },
  { name: 'Poppins', value: 'var(--font-poppins)' },
  { name: 'Open Sans', value: 'var(--font-open-sans)' },
  { name: 'Montserrat', value: 'var(--font-montserrat)' },
  { name: 'Lato', value: 'var(--font-lato)' },
  { name: 'Source Sans', value: 'var(--font-source-sans)' },
  { name: 'Oswald', value: 'var(--font-oswald)' },
];

const TEXT_DECORATIONS = [
  { id: 'none', preview: 'Did you know?', style: {} },
  { id: 'shadow1', preview: 'Did you know?', style: { textShadow: '2px 2px 4px rgba(0,0,0,0.5)' } },
  { id: 'shadow2', preview: 'Did you know?', style: { textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.8)' } },
  { id: 'shadow3', preview: 'Did you know?', style: { textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' } },
];

export default function TextStyles({ 
  showText, 
  setShowText, 
  textStyle, 
  onStyleChange,
  savedTemplates,
  onSaveTemplate,
  onApplyTemplate,
}: TextStylesProps) {
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showTemplateInput, setShowTemplateInput] = useState(false);

  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      onSaveTemplate(newTemplateName.trim());
      setNewTemplateName('');
      setShowTemplateInput(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <span className="text-white">Show Text</span>
        <Switch
          checked={showText}
          onChange={setShowText}
          className={`${
            showText ? 'bg-blue-600' : 'bg-gray-600'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span
            className={`${
              showText ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {/* Templates Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <label className="text-lg font-medium text-gray-300">Templates</label>
          <button
            onClick={() => setShowTemplateInput(true)}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Create New Template
          </button>
        </div>

        {showTemplateInput && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Template name"
              className="flex-1 rounded border border-gray-600 bg-gray-700 px-3 py-1 text-white"
            />
            <button
              onClick={handleSaveTemplate}
              className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setNewTemplateName('');
                setShowTemplateInput(false);
              }}
              className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {savedTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onApplyTemplate(template.id)}
              className="flex h-24 flex-col items-center justify-center rounded-lg bg-gray-700 p-4 hover:bg-gray-600"
            >
              <span
                className="mb-2 text-lg"
                style={{
                  color: template.style.color,
                  fontWeight: template.style.fontWeight,
                  textDecoration: template.style.underline ? 'underline' : 'none',
                  fontFamily: template.style.fontFamily,
                  ...TEXT_DECORATIONS.find(d => d.id === template.style.decoration)?.style,
                }}
              >
                {template.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Font Family */}
        <div>
          <label className="mb-2 block text-sm text-gray-300">Font Family</label>
          <select
            value={textStyle.fontFamily}
            onChange={(e) => onStyleChange({ fontFamily: e.target.value })}
            className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
          >
            {POPULAR_FONTS.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Weight */}
        <div>
          <label className="mb-2 block text-sm text-gray-300">Font Weight</label>
          <div className="flex gap-2">
            <button
              onClick={() => onStyleChange({ fontWeight: 'normal' })}
              className={`rounded px-4 py-2 ${
                textStyle.fontWeight === 'normal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onStyleChange({ fontWeight: 'bold' })}
              className={`rounded px-4 py-2 ${
                textStyle.fontWeight === 'bold'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Bold
            </button>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="mb-2 block text-sm text-gray-300">Text Color</label>
          <input
            type="color"
            value={textStyle.color}
            onChange={(e) => onStyleChange({ color: e.target.value })}
            className="h-10 w-full rounded"
          />
        </div>

        {/* Underline */}
        <div>
          <label className="mb-2 block text-sm text-gray-300">Underline</label>
          <div className="flex gap-2">
            <button
              onClick={() => onStyleChange({ underline: false })}
              className={`rounded px-4 py-2 ${
                !textStyle.underline
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              None
            </button>
            <button
              onClick={() => onStyleChange({ underline: true })}
              className={`rounded px-4 py-2 ${
                textStyle.underline
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Underline
            </button>
          </div>
        </div>

        {/* Text Size */}
        <div>
          <label className="mb-2 block text-sm text-gray-300">Text Size</label>
          <div className="flex gap-2">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => onStyleChange({ size: size as 'small' | 'medium' | 'large' })}
                className={`rounded px-4 py-2 ${
                  textStyle.size === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Text Align */}
        <div>
          <label className="mb-2 block text-sm text-gray-300">Text Alignment</label>
          <div className="flex gap-2">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                onClick={() => onStyleChange({ align: align as 'left' | 'center' | 'right' })}
                className={`rounded px-4 py-2 ${
                  textStyle.align === align
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Text Decorations */}
        <div>
          <label className="mb-2 block text-sm text-gray-300">Text Decorations</label>
          <div className="grid grid-cols-2 gap-4">
            {TEXT_DECORATIONS.map((decoration) => (
              <button
                key={decoration.id}
                onClick={() => onStyleChange({ decoration: decoration.id as any })}
                className={`flex h-24 items-center justify-center rounded-lg bg-gray-700 ${
                  textStyle.decoration === decoration.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <span
                  style={{
                    ...decoration.style,
                    color: textStyle.color,
                    fontFamily: textStyle.fontFamily,
                  }}
                  className="text-white"
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