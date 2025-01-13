import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from './firebaseConfig';
import type { ReelState } from '@/app/(sidebar)/dashboard/page';

const db = getFirestore(app);

interface UserData {
  reelState: ReelState;
  uploadedVideos: string[];
  generationsLeft: number;
  workerNodesLeft: number;
  socialMediaLinks: {
    youtube: string | null;
    tiktok: string | null;
    instagram: string | null;
  };
}

// Save or update the entire reel state
export const saveReelState = async (userId: string, reelState: ReelState) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { reelState }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving reel state:', error);
    throw error;
  }
};

// Get the user's reel state
export const getReelState = async (userId: string): Promise<ReelState | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists() && docSnap.data().reelState) {
      return docSnap.data().reelState as ReelState;
    }
    return null;
  } catch (error) {
    console.error('Error getting reel state:', error);
    throw error;
  }
};

// Add a video URL to the user's uploaded videos
export const addUploadedVideo = async (userId: string, videoUrl: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      uploadedVideos: arrayUnion(videoUrl)
    });
    return true;
  } catch (error) {
    console.error('Error adding uploaded video:', error);
    throw error;
  }
};

// Update the number of generations left
export const updateGenerationsLeft = async (userId: string, amount: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      generationsLeft: amount
    });
    return true;
  } catch (error) {
    console.error('Error updating generations left:', error);
    throw error;
  }
};

// Update worker nodes left
export const updateWorkerNodesLeft = async (userId: string, amount: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      workerNodesLeft: amount
    });
    return true;
  } catch (error) {
    console.error('Error updating worker nodes left:', error);
    throw error;
  }
};

// Update social media links
export const updateSocialMediaLinks = async (
  userId: string,
  links: { youtube?: string; tiktok?: string; instagram?: string }
) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      socialMediaLinks: links
    });
    return true;
  } catch (error) {
    console.error('Error updating social media links:', error);
    throw error;
  }
};

// Get all user data
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}; 