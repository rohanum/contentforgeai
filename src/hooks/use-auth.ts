
'use client';
import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { 
  User, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  AuthError,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  
  const handleAuthError = (error: unknown, provider: string) => {
    console.error(`Error with ${provider}: `, error);
    let description = "An unknown error occurred.";
    
    if (error instanceof Error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
          description = "Sign-in was cancelled.";
          break;
        case 'auth/account-exists-with-different-credential':
          description = "An account already exists with this email using a different sign-in method.";
          break;
        case 'auth/unauthorized-domain':
          description = "This domain is not authorized. Please check your Firebase project settings.";
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            description = "Invalid email or password. Please try again.";
            break;
        case 'auth/email-already-in-use':
            description = "An account with this email already exists.";
            break;
        case 'auth/weak-password':
            description = "The password is too weak. Please choose a stronger password.";
            break;
        default:
          description = `An error occurred. Please try again. (${authError.code})`;
      }
    }
    
    toast({
      title: `${provider} Failed`,
      description: description,
      variant: "destructive",
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push('/');
    } catch (error) {
      handleAuthError(error, "Google Sign-In");
    } finally {
      // onAuthStateChanged will set loading to false
    }
  };
  
  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
      router.push('/');
    } catch (error) {
      handleAuthError(error, "GitHub Sign-In");
    } finally {
      // onAuthStateChanged will set loading to false
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        router.push('/');
    } catch (error) {
        handleAuthError(error, 'Email Sign-In');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        router.push('/');
    } catch (error) {
        handleAuthError(error, 'Email Sign-Up');
    } finally {
      setLoading(false);
    }
  }

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) {
      throw new Error("No user is signed in.");
    }
    await updateProfile(auth.currentUser, data);
    // Manually update the user state to reflect changes immediately
    setUser(auth.currentUser);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  const value = { user, loading, signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail, signOut, updateUserProfile };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
