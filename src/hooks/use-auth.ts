
'use client';
import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { 
  User, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithRedirect,
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
        case 'auth/popup-closed-by-user':
          // This is a common case, we can handle it silently or with a mild notification
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, new GoogleAuthProvider());
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
    setUser(null);
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
