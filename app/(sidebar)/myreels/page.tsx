"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/app/app-components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight } from 'lucide-react';
import { 
  GlowingStarsBackgroundCard, 
  GlowingStarsTitle, 
  GlowingStarsDescription 
} from '@/app/app-components/ui/glowing-background-stars-card';
import { getUserReels, deleteReel } from '@/app/api/Firebase/firestoreService';
import { useAuth } from '@/app/hooks/useAuth';
import { toast } from 'sonner';
import type { SavedReel, ReelStatus } from '@/app/types/api';

const tabTypes = ['saved', 'scheduled', 'approval', 'published'] as const;

export default function MyReels() {
  const [reels, setReels] = useState<SavedReel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Fetch reels when component mounts
  useEffect(() => {
    const fetchReels = async () => {
      if (!user) return;
      
      try {
        const fetchedReels = await getUserReels(user.uid);
        setReels(fetchedReels);
      } catch (error) {
        console.error('Error fetching reels:', error);
        toast.error('Failed to load reels');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReels();
  }, [user]);

  const handleDelete = async (reelId: string) => {
    if (!user) return;

    try {
      await deleteReel(user.uid, reelId);
      setReels(reels.filter(reel => reel.id !== reelId));
      toast.success('Reel deleted successfully');
    } catch (error) {
      console.error('Error deleting reel:', error);
      toast.error('Failed to delete reel');
    }
  };

  const handleEdit = (reel: SavedReel) => {
    // Clear any existing state first
    localStorage.removeItem('reelState');
    // Then set the new state
    localStorage.setItem('reelState', JSON.stringify(reel.reelState));
    router.push('/dashboard');
  };

  const tabs = tabTypes.map(tabType => ({
    id: tabType,
    label: tabType.charAt(0).toUpperCase() + tabType.slice(1),
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading reels...</div>
        ) : reels.filter((reel) => reel.status === tabType).length === 0 ? (
          <div className="col-span-full text-center py-8">No reels found</div>
        ) : (
          reels
            .filter((reel) => reel.status === tabType)
            .map((reel) => (
              <GlowingStarsBackgroundCard key={reel.id}>
                <GlowingStarsTitle>
                  {reel.reelState.prompt.slice(0, 50)}
                  {reel.reelState.prompt.length > 50 ? '...' : ''}
                </GlowingStarsTitle>
                <GlowingStarsDescription>
                  Created: {new Date(reel.createdAt).toLocaleDateString()}
                </GlowingStarsDescription>
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(reel.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(reel)}
                  >
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                  </Button>
                </div>
              </GlowingStarsBackgroundCard>
            ))
        )}
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