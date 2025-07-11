import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleFlowError(error: any, toast: (options: any) => void, title?: string) {
    console.error(error);
    const errorMessage = String(error?.message || '');
    let description = "An unknown error occurred. Please try again.";

    if (errorMessage.includes('API key') || errorMessage.includes('quota') || errorMessage.includes('429')) {
        description = "Your Gemini API key limit may have been reached or it is invalid. Please update it in your profile and try again.";
    } else if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
        description = "The AI model is currently busy. Please wait a moment and try again.";
    }

    toast({
        title: title || "An Error Occurred",
        description: description,
        variant: "destructive",
    });
}
