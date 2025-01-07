// Main editor page component that contains the editing sections and video preview
'use client';

import { type ReelState } from '../page';
import ScriptAndVideo from './editor-sections/ScriptAndVideo';
import VoiceAndBgMusic from './editor-sections/VoiceAndBgMusic';
import CaptionsAndStyle from './editor-sections/CaptionsAndStyle';
import TextStyles from './editor-sections/TextStyles';
import RemotionPreview from './RemotionPreview';

interface MainEditorPageProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

export default function MainEditorPage({
  reelState,
  setReelState,
}: MainEditorPageProps) {
  const handleVideoSelect = (video: any, clipIndex: number) => {
    setReelState(prev => ({
      ...prev,
      clips: prev.clips.map((clip, i) => 
        i === clipIndex ? { ...clip, video } : clip
      ),
    }));
  };

  const handleSaveTemplate = (name: string) => {
    setReelState(prev => ({
      ...prev,
      savedTemplates: [
        ...prev.savedTemplates,
        {
          id: `template-${Date.now()}`,
          name,
          style: { ...prev.textStyle },
        },
      ],
    }));
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = reelState.savedTemplates.find(t => t.id === templateId);
    if (template) {
      setReelState(prev => ({
        ...prev,
        textStyle: { ...template.style },
      }));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Left Pane - Editor Sections */}
      <div className="w-[60%] overflow-y-auto border-r border-gray-700 p-4">
        <div className="space-y-6">
          {/* Section 1: Script and Video */}
          <ScriptAndVideo
            reelState={reelState}
            setReelState={setReelState}
            onVideoSelect={handleVideoSelect}
          />

          {/* Section 2: Voice and Background Music */}
          <VoiceAndBgMusic
            reelState={reelState}
            setReelState={setReelState}
          />

          {/* Section 3: Captions and Style */}
          <CaptionsAndStyle
            reelState={reelState}
            setReelState={setReelState}
          />

          {/* Section 4: Text Styles */}
          <TextStyles
            showText={reelState.showText}
            setShowText={(show) => setReelState(prev => ({ ...prev, showText: show }))}
            textStyle={reelState.textStyle}
            onStyleChange={(style) => setReelState(prev => ({ ...prev, textStyle: { ...prev.textStyle, ...style } }))}
            savedTemplates={reelState.savedTemplates}
            onSaveTemplate={handleSaveTemplate}
            onApplyTemplate={handleApplyTemplate}
          />
        </div>
      </div>

      {/* Right Pane - Video Preview */}
      <div className="w-[40%] overflow-y-auto bg-black p-4">
        <div className="sticky top-4">
          <RemotionPreview reelState={reelState} />
        </div>
      </div>
    </div>
  );
} 