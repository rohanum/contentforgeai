// src/app/layout.tsx
"use client";

import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { ApiKeyContext, useApiKeyManager, useApiKey } from '@/hooks/use-api-key';
import { Footer } from '@/components/footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect, ReactNode } from 'react';
import { Loader2, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';

function ApiKeyPrompt() {
    const { user, loading: authLoading } = useAuth();
    const { isApiKeySet, setApiKey, isLoading: apiKeyLoading } = useApiKey();
    const [isOpen, setIsOpen] = useState(false);
    const [keyInput, setKeyInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const pathname = usePathname();

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    useEffect(() => {
        if (!authLoading && !apiKeyLoading && user && !isApiKeySet && !isAuthPage) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [user, isApiKeySet, authLoading, apiKeyLoading, pathname, isAuthPage]);

    const handleSaveKey = () => {
        if (!keyInput.trim()) {
            toast({
                title: "Invalid Key",
                description: "API Key cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        setIsSaving(true);
        setApiKey(keyInput);
        setIsSaving(false);
        setIsOpen(false);
        toast({
            title: "API Key Saved!",
            description: "You can now start using the AI tools.",
        });
    };

    if (isAuthPage) return null;

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="bg-primary/10 text-primary p-3 rounded-lg border border-primary/20 glow-primary w-fit mb-4">
                        <KeyRound size={28} />
                    </div>
                    <DialogTitle>Enter Your Gemini API Key</DialogTitle>
                    <DialogDescription>
                        To use ContentForge AI, please provide your own Google AI Gemini API key. We save it securely in your browser's local storage and never send it to our servers.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        id="apiKey"
                        placeholder="Your Gemini API Key"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        type="password"
                    />
                     <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary underline">
                        Don't have a key? Get one from Google AI Studio.
                    </a>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSaveKey} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save & Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ApiKeyProvider({ children }: { children: ReactNode }) {
  const apiKeyManager = useApiKeyManager();
  return (
    <ApiKeyContext.Provider value={apiKeyManager}>
      {children}
    </ApiKeyContext.Provider>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ApiKeyPrompt />
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8 flex-grow">{children}</div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>ContentForge AI</title>
        <meta name="description" content="AI-powered tools for content creators" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-sans antialiased", "aurora-background")}>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] z-0"></div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <AuthProvider>
            <ApiKeyProvider>
              <AppLayout>{children}</AppLayout>
            </ApiKeyProvider>
          </AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
