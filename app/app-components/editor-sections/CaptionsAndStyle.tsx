'use client';

import { useState } from 'react';
import { type ReelState } from '../../page';
import { AnimatedTabs } from './tabs/AnimatedTabs';

// Define available transition types
export const transitionTypes = [
  'fade',
  'slide',
  'zoom',
  'wipe',
  'dissolve',
  'blur',
] as const;

export type TransitionType = typeof transitionTypes[number];

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

interface CaptionsAndStyleProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
  showText: boolean;
  setShowText: (show: boolean) => void;
  textStyle: ReelState['textStyle'];
  onStyleChange: (style: Partial<ReelState['textStyle']>) => void;
  savedTemplates: ReelState['savedTemplates'];
  onSaveTemplate: (name: string) => void;
  onApplyTemplate: (templateId: string) => void;
}

export default function CaptionsAndStyle({
  reelState,
  setReelState,
  showText,
  setShowText,
  textStyle,
  onStyleChange,
  savedTemplates,
  onSaveTemplate,
  onApplyTemplate,
}: CaptionsAndStyleProps) {
  const [newText, setNewText] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showTemplateInput, setShowTemplateInput] = useState(false);
  const [activeTab, setActiveTab] = useState('text-styles');

  const tabs = [
    { id: 'text-styles', label: 'Text Styles' },
    { id: 'captions', label: 'Captions' },
    { id: 'logo-transitions', label: 'Logo & Transitions' },
  ];

  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      onSaveTemplate(newTemplateName.trim());
      setNewTemplateName('');
      setShowTemplateInput(false);
    }
  };

  // Add new caption
  const handleAddCaption = () => {
    if (!newText.trim()) return;

    const newOverlay = {
      id: `text-${Date.now()}`,
      text: newText.trim(),
      position: { x: 50, y: 50 },
      style: {
        fontSize: 24,
        color: '#ffffff',
        fontFamily: 'Arial',
      },
    };

    setReelState((prev) => ({
      ...prev,
      overlayText: [...prev.overlayText, newOverlay],
    }));
    setNewText('');
  };

  // Remove caption
  const handleRemoveCaption = (id: string) => {
    setReelState((prev) => ({
      ...prev,
      overlayText: prev.overlayText.filter((overlay) => overlay.id !== id),
    }));
  };

  // Update caption
  const handleUpdateCaption = (id: string, updates: Partial<ReelState['overlayText'][0]>) => {
    setReelState((prev) => ({
      ...prev,
      overlayText: prev.overlayText.map((overlay) =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      ),
    }));
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReelState((prev) => ({
          ...prev,
          logo: {
            url: reader.result as string,
            position: { x: 50, y: 50 },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update transition type
  const handleTransitionChange = (transitionType: TransitionType) => {
    setReelState((prev) => ({
      ...prev,
      transition: transitionType,
    }));
  };

  return (
    <div className="w-full space-y-4 rounded-lg bg-accent p-4">
      <AnimatedTabs tabs={tabs} defaultTab="text-styles" onChange={setActiveTab} />

      {/* Text Styles Section */}
      {activeTab === 'text-styles' && (
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

          {/* Templates Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text">Templates</h3>
              <button
                onClick={() => setShowTemplateInput(true)}
                className="rounded bg-primary px-3 py-1 text-sm text-accent hover:bg-secondary"
              >
                Create Template
              </button>
            </div>

            {showTemplateInput && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Template name"
                  className="flex-1 rounded border border-gray-200 bg-accent px-3 py-1 text-text"
                />
                <button
                  onClick={handleSaveTemplate}
                  className="rounded bg-primary px-3 py-1 text-accent hover:bg-secondary"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNewTemplateName('');
                    setShowTemplateInput(false);
                  }}
                  className="rounded bg-red-600 px-3 py-1 text-accent hover:bg-red-700"
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
                  className="flex h-24 flex-col items-center justify-center rounded-lg bg-accent p-4 shadow-sm hover:bg-gray-50"
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
      )}

      {/* Captions Section */}
      {activeTab === 'captions' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter caption text"
              className="flex-1 rounded border border-gray-200 bg-accent p-2 text-text"
            />
            <button
              onClick={handleAddCaption}
              disabled={!newText.trim()}
              className="rounded bg-primary px-4 py-2 text-accent hover:bg-secondary disabled:opacity-50"
            >
              Add Caption
            </button>
          </div>

          <div className="space-y-3">
            {reelState.overlayText.map((overlay) => (
              <div
                key={overlay.id}
                className="rounded-lg border border-gray-200 bg-accent p-4"
              >
                <input
                  type="text"
                  value={overlay.text}
                  onChange={(e) =>
                    handleUpdateCaption(overlay.id, { text: e.target.value })
                  }
                  className="mb-2 w-full rounded border border-gray-200 bg-accent p-2 text-text"
                />

                <div className="mb-2 flex gap-2">
                  <input
                    type="color"
                    value={overlay.style.color}
                    onChange={(e) =>
                      handleUpdateCaption(overlay.id, {
                        style: { ...overlay.style, color: e.target.value },
                      })
                    }
                    className="h-8 w-8 rounded"
                  />
                  <input
                    type="number"
                    value={overlay.style.fontSize}
                    onChange={(e) =>
                      handleUpdateCaption(overlay.id, {
                        style: {
                          ...overlay.style,
                          fontSize: parseInt(e.target.value),
                        },
                      })
                    }
                    min="12"
                    max="72"
                    className="w-20 rounded border border-gray-200 bg-accent p-1 text-text"
                  />
                  <select
                    value={overlay.style.fontFamily}
                    onChange={(e) =>
                      handleUpdateCaption(overlay.id, {
                        style: { ...overlay.style, fontFamily: e.target.value },
                      })
                    }
                    className="rounded border border-gray-200 bg-accent p-1 text-text"
                  >
                    {POPULAR_FONTS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-600">X Position</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={overlay.position.x}
                      onChange={(e) =>
                        handleUpdateCaption(overlay.id, {
                          position: {
                            ...overlay.position,
                            x: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Y Position</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={overlay.position.y}
                      onChange={(e) =>
                        handleUpdateCaption(overlay.id, {
                          position: {
                            ...overlay.position,
                            y: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveCaption(overlay.id)}
                  className="w-full rounded bg-red-600 px-3 py-1 text-sm text-accent hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logo & Transitions Section */}
      {activeTab === 'logo-transitions' && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-bold text-text">Transitions</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {transitionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTransitionChange(type)}
                  className={`rounded-lg border p-3 text-sm transition-colors ${
                    reelState.transition === type
                      ? 'bg-primary text-accent'
                      : 'border-gray-200 bg-accent text-text hover:bg-gray-50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-text">Logo</h2>
            <div className="rounded-lg border border-gray-200 bg-accent p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="mb-4 w-full rounded border border-gray-200 bg-accent p-2 text-text"
              />
              
              {reelState.logo && (
                <div className="space-y-3">
                  <img
                    src={reelState.logo.url}
                    alt="Logo"
                    className="mx-auto max-h-24 object-contain"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm text-text">X Position</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={reelState.logo.position.x}
                        onChange={(e) =>
                          setReelState((prev) => ({
                            ...prev,
                            logo: prev.logo
                              ? {
                                  ...prev.logo,
                                  position: {
                                    ...prev.logo.position,
                                    x: parseInt(e.target.value),
                                  },
                                }
                              : undefined,
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-text">Y Position</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={reelState.logo.position.y}
                        onChange={(e) =>
                          setReelState((prev) => ({
                            ...prev,
                            logo: prev.logo
                              ? {
                                  ...prev.logo,
                                  position: {
                                    ...prev.logo.position,
                                    y: parseInt(e.target.value),
                                  },
                                }
                              : undefined,
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 