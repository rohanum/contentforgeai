
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { getSavedYoutubeScripts, SavedYoutubeScript } from "@/lib/firebase/scripts";
import { getSavedTrends, SavedTrend } from "@/lib/firebase/trends";
import { formatDistanceToNow } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Loader2, Library, Copy, FileText, Flame, Lightbulb, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function MyContentPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [scripts, setScripts] = useState<SavedYoutubeScript[]>([]);
    const [trends, setTrends] = useState<SavedTrend[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            const fetchData = async () => {
                try {
                    const [userScripts, userTrends] = await Promise.all([
                        getSavedYoutubeScripts(user.uid),
                        getSavedTrends(user.uid)
                    ]);
                    setScripts(userScripts);
                    setTrends(userTrends);
                } catch (error) {
                    console.error("Failed to fetch content:", error);
                    toast({
                        title: "Error",
                        description: "Could not load your saved content.",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [user, loading, router, toast]);

    const handleCopy = (text: string, subject: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: `${subject} copied to clipboard.` });
    };

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div>
            <header className="mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg border border-primary/20 glow-primary">
                        <Library size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold">Content Library</h1>
                        <p className="text-muted-foreground mt-2">All your saved AI-generated content in one place.</p>
                    </div>
                </div>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Saved Scripts</h2>
                {scripts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scripts.map(script => (
                            <Dialog key={script.id}>
                                <DialogTrigger asChild>
                                    <Card className="cursor-pointer hover:border-primary/50 transition-colors group">
                                        <CardHeader>
                                            <CardTitle className="truncate">{script.topic}</CardTitle>
                                            <CardDescription>
                                                Saved {formatDistanceToNow(script.createdAt.toDate(), { addSuffix: true })}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-3">{script.script}</p>
                                        </CardContent>
                                        <CardFooter className="flex-wrap gap-2">
                                            <Badge variant="outline">{script.scriptLength}</Badge>
                                            {script.tone && <Badge variant="secondary">{script.tone}</Badge>}
                                        </CardFooter>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle>{script.topic}</DialogTitle>
                                        <DialogDescription>
                                            Generated {formatDistanceToNow(script.createdAt.toDate(), { addSuffix: true })}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="max-h-[60vh] my-4">
                                        <pre className="whitespace-pre-wrap text-sm font-mono p-4 rounded-md bg-secondary border">
                                            {script.script}
                                        </pre>
                                    </ScrollArea>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Close</Button>
                                        </DialogClose>
                                        <Button onClick={() => handleCopy(script.script, "Script")}>
                                            <Copy className="mr-2 h-4 w-4" /> Copy Script
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">No Saved Scripts Yet</h3>
                        <p className="text-muted-foreground mt-2">
                            Head over to the <a href="/youtube-script" className="text-primary underline">YouTube Script Generator</a> to create and save your first script.
                        </p>
                    </div>
                )}
            </section>

             <section>
                <h2 className="text-2xl font-bold mb-4">Saved Trends</h2>
                {trends.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {trends.map(trend => (
                            <Dialog key={trend.id}>
                                <DialogTrigger asChild>
                                     <Card className="cursor-pointer hover:border-primary/50 transition-colors group">
                                        <CardHeader>
                                            <CardTitle className="truncate flex items-center gap-2"><Flame className="w-5 h-5 text-primary" /> {trend.title}</CardTitle>
                                            <CardDescription>
                                                Saved {formatDistanceToNow(trend.createdAt.toDate(), { addSuffix: true })}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-3">{trend.contentSuggestion}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <Badge variant="outline">{trend.popularity}</Badge>
                                        </CardFooter>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                     <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2"><Flame className="w-6 h-6 text-primary" /> {trend.title}</DialogTitle>
                                        <DialogDescription>
                                            Saved {formatDistanceToNow(trend.createdAt.toDate(), { addSuffix: true })}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1">Reason for Trend</h4>
                                            <p className="text-sm text-muted-foreground">{trend.reason}</p>
                                        </div>
                                         <div className="p-4 rounded-md bg-secondary border">
                                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                                                <Lightbulb className="w-4 h-4 text-primary"/>
                                                <span>Your Content Idea</span>
                                            </h4>
                                            <p className="text-sm text-muted-foreground">{trend.contentSuggestion}</p>
                                        </div>
                                        <div className="p-4 rounded-md bg-secondary border">
                                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                                                <Megaphone className="w-4 h-4 text-primary"/>
                                                <span>Suggested CTA</span>
                                            </h4>
                                            <p className="text-sm text-muted-foreground italic">"{trend.suggestedCTA}"</p>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                         <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                                         <Button onClick={() => handleCopy(trend.contentSuggestion, "Content Idea")}><Copy className="mr-2 h-4 w-4" /> Copy Idea</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                        <Flame className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">No Saved Trends Yet</h3>
                        <p className="text-muted-foreground mt-2">
                           Visit the <a href="/trending-reels" className="text-primary underline">Trending Reels Discovery</a> tool to find and save trends.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
