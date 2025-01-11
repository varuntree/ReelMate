'use client';

import { useState } from 'react';
import { type ReelState } from '../../../page';
import { TEXT_DECORATIONS } from './constants';

interface TemplatesSectionProps {
  savedTemplates: ReelState['savedTemplates'];
  onSaveTemplate: (name: string) => void;
  onApplyTemplate: (templateId: string) => void;
  textStyle: ReelState['textStyle'];
}

export function TemplatesSection({
  savedTemplates,
  onSaveTemplate,
  onApplyTemplate,
  textStyle,
}: TemplatesSectionProps) {
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
  );
} 