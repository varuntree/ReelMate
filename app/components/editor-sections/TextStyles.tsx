'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';

interface TextStylesProps {
  showText: boolean;
  setShowText: (show: boolean) => void;
  textStyle: {
    fontWeight: 'normal' | 'bold';
    color: string;
    underline: boolean;
    size: 'small' | 'medium' | 'large';
    align: 'left' | 'center' | 'right';
    decoration: 'none' | 'shadow1' | 'shadow2' | 'shadow3' | 'shadow4';
  };
  onStyleChange: (style: Partial<TextStylesProps['textStyle']>) => void;
}

const TEXT_DECORATIONS = [
  { id: 'none', preview: 'Hey There', style: {} },
  { id: 'shadow1', preview: 'Hey There', style: { textShadow: '2px 2px 4px rgba(0,0,0,0.5)' } },
  { id: 'shadow2', preview: 'Hey There', style: { textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.8)' } },
  { id: 'shadow3', preview: 'Hey There', style: { textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' } },
];

export default function TextStyles({ showText, setShowText, textStyle, onStyleChange }: TextStylesProps) {
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

      <div className="space-y-4">
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
                <span style={decoration.style} className="text-white">
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