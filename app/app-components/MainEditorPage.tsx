// Main editor page component that contains the editing sections and video preview
'use client';

import { type ReelState } from '@/app/(sidebar)/dashboard/page';
import { TabsContent } from "@/components/ui/tabs";
import { SimpleTabsForNavigation } from '@/components/ui/simple-tabs-for-navigation';
import ScriptAndVideo from './editor-sections/ScriptAndVideo';
import VoiceAndBgMusic from './editor-sections/VoiceAndBgMusic';
import CaptionsAndStyle from './editor-sections/CaptionsAndStyle';
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

  const handleCreateNewReel = () => {
    // Clear localStorage
    localStorage.removeItem('reelState');
    // Reset state to trigger redirect to PromptPage
    setReelState(prev => ({ ...prev, prompt: '' }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background">
      {/* Left Pane - Editor Sections */}
      <div className="w-full lg:w-[60%] overflow-y-auto border-r border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text">Edit Reel</h1>
            <button
              onClick={handleCreateNewReel}
              className="rounded bg-primary px-4 py-2 text-accent hover:bg-secondary transition-colors"
            >
              Create New Reel
            </button>
          </div>
        </div>

        <div className="px-8 py-6">
          <SimpleTabsForNavigation>
            {/* Section 1: Script and Video */}
            <TabsContent value="script-video" className="mt-4">
              <ScriptAndVideo
                reelState={reelState}
                setReelState={setReelState}
                onVideoSelect={handleVideoSelect}
              />
            </TabsContent>

            {/* Section 2: Voice and Background Music */}
            <TabsContent value="voice-music" className="mt-4">
              <VoiceAndBgMusic
                reelState={reelState}
                setReelState={setReelState}
              />
            </TabsContent>

            {/* Section 3: Captions and Style (Combined) */}
            <TabsContent value="captions-style" className="mt-4">
              <CaptionsAndStyle
                reelState={reelState}
                setReelState={setReelState}
                showText={reelState.showText}
                setShowText={(show) => setReelState(prev => ({ ...prev, showText: show }))}
                textStyle={reelState.textStyle}
                onStyleChange={(style) => setReelState(prev => ({ ...prev, textStyle: { ...prev.textStyle, ...style } }))}
                savedTemplates={reelState.savedTemplates}
                onSaveTemplate={handleSaveTemplate}
                onApplyTemplate={handleApplyTemplate}
              />
            </TabsContent>
          </SimpleTabsForNavigation>
        </div>
      </div>

      {/* Right Pane - Video Preview */}
      <div className="w-full lg:w-[40%] overflow-y-auto bg-background">
        <div className="sticky top-0 px-8 py-6">
          <RemotionPreview reelState={reelState} setReelState={setReelState} />
        </div>
      </div>
    </div>
  );
} 