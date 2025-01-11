'use client';

import { useState } from 'react';
import { type ReelState } from '../../page';
import { AnimatedTabs } from './tabs/AnimatedTabs';
import { TextStylesSection } from './text-styles/TextStylesSection';
import { TransitionsSection } from './text-styles/TransitionsSection';
import { type TransitionType } from './text-styles/constants';

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
  const [activeTab, setActiveTab] = useState('text-styles');

  const tabs = [
    { id: 'text-styles', label: 'Text Styles' },
    { id: 'transitions', label: 'Transitions' },
  ];

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
        <TextStylesSection
          reelState={reelState}
          showText={showText}
          setShowText={setShowText}
          textStyle={textStyle}
          onStyleChange={onStyleChange}
          savedTemplates={savedTemplates}
          onSaveTemplate={onSaveTemplate}
          onApplyTemplate={onApplyTemplate}
        />
      )}

      {/* Transitions Section */}
      {activeTab === 'transitions' && (
        <TransitionsSection
          reelState={reelState}
          onTransitionChange={handleTransitionChange}
        />
      )}
    </div>
  );
} 