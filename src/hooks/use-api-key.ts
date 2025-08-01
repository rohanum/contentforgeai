// src/hooks/use-api-key.ts
"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isApiKeySet: boolean;
  isLoading: boolean;
}

export const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = "contentforge-gemini-api-key";

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};

// This hook contains the provider's logic and can be used in a .tsx file
export const useApiKeyManager = (): ApiKeyContextType => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey) {
        setApiKeyState(storedKey);
      }
    } catch (error) {
      console.error("Could not access local storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setApiKey = useCallback((key: string | null) => {
    setApiKeyState(key);
    try {
      if (key) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key);
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    } catch (error) {
        console.error("Could not access local storage:", error);
    }
  }, []);

  return {
    apiKey,
    setApiKey,
    isApiKeySet: !!apiKey,
    isLoading,
  };
};
