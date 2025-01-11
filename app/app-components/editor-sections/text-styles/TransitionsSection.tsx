'use client';

import { type ReelState } from '../../../page';
import { transitionTypes, type TransitionType } from './constants';

interface TransitionsSectionProps {
  reelState: ReelState;
  onTransitionChange: (type: TransitionType) => void;
}

export function TransitionsSection({ reelState, onTransitionChange }: TransitionsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-bold text-text">Transitions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {transitionTypes.map((type) => (
            <button
              key={type}
              onClick={() => onTransitionChange(type)}
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
    </div>
  );
} 