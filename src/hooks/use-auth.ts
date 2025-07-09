'use client';
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
  const { toast } = useToast();
  
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
          description = "Sign-in was cancelled by the user.";
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

  useEffect(() => {
    // This is the primary listener for auth state changes.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Check for redirect result on initial load.
    // This will only be non-null on the page load after a redirect.
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User is signed in. The onAuthStateChanged listener above
          // will handle setting the user and loading state.
          // We can show a welcome message.
          toast({
            title: `Welcome, ${result.user.displayName || 'friend'}!`,
            description: "You have successfully signed in.",
          });
        }
      })
      .catch((error) => {
        // Handle errors from the redirect.
        handleAuthError(error, 'Redirect');
      });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);
  

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, new GoogleAuthProvider());
      // After this, the page will redirect, and the logic in useEffect will handle the result.
    } catch (error) {
      handleAuthError(error, "Google");
      setLoading(false);
    }
  };
  
  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, new GithubAuthProvider());
    } catch (error) {
      handleAuthError(error, "GitHub");
      setLoading(false);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    // The onAuthStateChanged listener will automatically set user to null.
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
