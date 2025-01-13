"use client";

import { useState } from 'react';
import { Tabs } from '@/app/app-components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight } from 'lucide-react';
import { 
  GlowingStarsBackgroundCard, 
  GlowingStarsTitle, 
  GlowingStarsDescription 
} from '@/app/app-components/ui/glowing-background-stars-card';

const mockReels = [
  { id: 1, title: 'Summer Vibes', createdAt: '2023-06-15', status: 'Saved' },
  { id: 2, title: 'Travel Diaries', createdAt: '2023-06-18', status: 'Scheduled' },
  { id: 3, title: 'Cooking Adventures', createdAt: '2023-06-20', status: 'Approval' },
  { id: 4, title: 'Fitness Journey', createdAt: '2023-06-22', status: 'Published' },
];

const tabTypes = ['Saved', 'Scheduled', 'Approval', 'Published'] as const;

export default function MyReels() {
  const tabs = tabTypes.map(tabType => ({
    id: tabType,
    label: tabType,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockReels
          .filter((reel) => reel.status === tabType)
          .map((reel) => (
            <GlowingStarsBackgroundCard key={reel.id}>
              <GlowingStarsTitle>{reel.title}</GlowingStarsTitle>
              <GlowingStarsDescription>
                Created: {reel.createdAt}
              </GlowingStarsDescription>
              <div className="flex justify-between mt-4">
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                </Button>
              </div>
            </GlowingStarsBackgroundCard>
          ))}
      </div>
    ),
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Reels</h1>
      <Tabs tabs={tabs} />
    </div>
  );
} 