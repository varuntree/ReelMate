'use client';

import type { PlayerRef } from '@remotion/player';
import { useCallback, useEffect, useState } from 'react';

export const PlayPauseButton: React.FC<{
  playerRef: React.RefObject<PlayerRef | null>;
}> = ({ playerRef }) => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const { current } = playerRef;
    setPlaying(current?.isPlaying() ?? false);
    if (!current) return;

    const onPlay = () => {
      setPlaying(true);
    };

    const onPause = () => {
      setPlaying(false);
    };

    current.addEventListener('play', onPlay);
    current.addEventListener('pause', onPause);

    return () => {
      current.removeEventListener('play', onPlay);
      current.removeEventListener('pause', onPause);
    };
  }, [playerRef]);

  const onToggle = useCallback(() => {
    playerRef.current?.toggle();
  }, [playerRef]);

  return (
    <button
      onClick={onToggle}
      type="button"
      className="rounded bg-primary px-4 py-2 text-accent hover:bg-secondary transition-colors"
    >
      {playing ? 'Pause' : 'Play'}
    </button>
  );
};