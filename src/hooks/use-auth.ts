'use client';
// src/hooks/use-auth.ts
import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { 
  User, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  AuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // This listener handles session persistence
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // This handles the result after a sign-in redirect
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // Successfully signed in.
          setUser(result.user);
          router.push('/');
        }
      })
      .catch((error) => {
        handleAuthError(error, 'Redirect');
      })
      .finally(() => {
        // This is important to only set loading to false when we know
        // there is no pending redirect.
        if (!user) {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, [router]);
  
  const handleAuthError = (error: unknown, provider: string) => {
    console.error(`Error signing in with ${provider}: `, error);
    let description = "An unknown error occurred during sign-in.";
    
    if (error instanceof Error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case 'auth/invalid-api-key':
          description = "Sign-in failed. Your Firebase API Key is invalid. Please check your .env file.";
          break;
        case 'auth/popup-closed-by-user':
          description = "Sign-in was cancelled.";
          break;
        case 'auth/account-exists-with-different-credential':
          description = "An account already exists with this email using a different sign-in method.";
          break;
        case 'auth/unauthorized-domain':
          description = "This domain is not authorized. Please add it to your Firebase project's authorized domains list.";
          break;
        default:
          description = `Sign-in failed. Please try again. (${authError.code})`;
      }
    }
    
    toast({
      title: "Sign-in Failed",
      description: description,
      variant: "destructive",
    });
  }

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, new GoogleAuthProvider());
      // Firebase will handle the redirect away from the page.
    } catch (error) {
      handleAuthError(error, "Google");
      setLoading(false);
    }
  };
  
  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, new GithubAuthProvider());
      // Firebase will handle the redirect away from the page.
    } catch (error) {
      handleAuthError(error, "GitHub");
      setLoading(false);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/login');
  };

  const value = { user, loading, signInWithGoogle, signInWithGitHub, signOut };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
