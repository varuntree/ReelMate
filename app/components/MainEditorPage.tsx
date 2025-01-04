// Main editor page component that contains the editing sections and video preview
'use client';

import { type ReelState } from '../page';
import ScriptAndVideo from './editor-sections/ScriptAndVideo';
import VoiceAndBgMusic from './editor-sections/VoiceAndBgMusic';
import TextAndLogo from './editor-sections/TextAndLogo';
import VideoPreview from './VideoPreview';

interface MainEditorPageProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

export default function MainEditorPage({
  reelState,
  setReelState,
}: MainEditorPageProps) {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Pane - Editor Sections */}
      <div className="w-1/2 overflow-y-auto border-r border-gray-700 p-4">
        <div className="space-y-6">
          {/* Section 1: Script and Video */}
          <ScriptAndVideo
            reelState={reelState}
            setReelState={setReelState}
          />

          {/* Section 2: Voice and Background Music */}
          <VoiceAndBgMusic
            reelState={reelState}
            setReelState={setReelState}
          />

          {/* Section 3: Text and Logo */}
          <TextAndLogo
            reelState={reelState}
            setReelState={setReelState}
          />
        </div>
      </div>

      {/* Right Pane - Video Preview */}
      <div className="w-1/2 bg-black p-4">
        <VideoPreview reelState={reelState} />
      </div>
    </div>
  );
} 