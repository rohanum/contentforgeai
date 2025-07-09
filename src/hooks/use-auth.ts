
'use client';
import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { 
  User, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
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
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      handleAuthError(error, "Google Sign-In");
    }
  };
  
  const signInWithGitHub = async () => {
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
    } catch (error) {
      handleAuthError(error, "GitHub Sign-In");
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        handleAuthError(error, 'Email Sign-In');
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        handleAuthError(error, 'Email Sign-Up');
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const value = { user, loading, signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail, signOut };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
