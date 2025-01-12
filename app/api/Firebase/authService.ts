import { 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from './firebaseConfig';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      return { user: null, error: error.message };
    }
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      return { user: null, error: error.message };
    }
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    // First try to sign in
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      // If error is auth/user-not-found, try to sign up instead
      if (error.code === 'auth/user-not-found') {
        return signUpWithEmail(email, password);
      }
      return { user: null, error: error.message };
    }
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      return { error: error.message };
    }
    return { error: 'An unexpected error occurred' };
  }
};

// Auth state observer
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 