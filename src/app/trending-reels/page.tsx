"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { discoverTrendingReels, DiscoverTrendingReelsOutput } from "@/ai/flows/discover-trending-reels";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Flame, Copy, Lightbulb, Megaphone, Bookmark, PenSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
});

const popularityMap: Record<string, { icon: string; text: string; className: string }> = {
  'Very Hot': { icon: '🔥🔥🔥', text: 'Very Hot', className: 'text-red-400 border-red-400/30' },
  'Gaining Momentum': { icon: '🔥🔥', text: 'Gaining Momentum', className: 'text-orange-400 border-orange-400/30' },
  'Niche-Specific': { icon: '🔥', text: 'Niche-Specific', className: 'text-amber-400 border-amber-400/30' },
};

export default function TrendingReelsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<DiscoverTrendingReelsOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await discoverTrendingReels(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      let description = "Failed to discover trending reels. Please try again.";
      if (error instanceof Error && (error.message.includes('503') || error.message.includes('overloaded'))) {
        description = "The AI model is currently busy. Please wait a moment and try again.";
      }
      toast({
        title: "Error",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content suggestion copied to clipboard.",
    });
  };

  const handleTurnIntoScript = (idea: string) => {
    router.push(`/reel-script?topic=${encodeURIComponent(idea)}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Trending Reels Discovery</CardTitle>
            <CardDescription>Find trending audio and content suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Topic or Niche</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Home decor, fitness tips" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Discover Trends
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
        <div className="space-y-4">
            <CardHeader className="p-0">
                <CardTitle>Trending Reels & Ideas</CardTitle>
                <CardDescription>Hot trends and how you can use them.</CardDescription>
            </CardHeader>

            {isLoading && (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            )}
            
            {output && (
            <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                {output.trends.map((trend, index) => {
                const popularityInfo = popularityMap[trend.popularity] || { icon: '🤔', text: 'Unknown', className: 'text-muted-foreground' };
                return (
                    <Card key={index} className="bg-card">
                    <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Flame className="w-5 h-5 text-primary flex-shrink-0"/>
                                <span>{trend.title}</span>
                            </CardTitle>
                            <Badge variant="outline" className={`flex-shrink-0 ${popularityInfo.className}`}>
                                {popularityInfo.icon}
                                <span className="hidden sm:inline ml-2">{popularityInfo.text}</span>
                            </Badge>
                        </div>
                        <CardDescription className="pt-2">{trend.reason}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-md bg-background border border-dashed border-primary/50">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-primary"/>
                                    <span>Your Content Idea</span>
                                </h4>
                                <Button variant="ghost" size="icon" onClick={() => handleCopy(trend.contentSuggestion)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{trend.contentSuggestion}</p>
                        </div>
                        <div className="p-4 rounded-md bg-background border">
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                                <Megaphone className="w-4 h-4 text-primary"/>
                                <span>Suggested CTA</span>
                            </h4>
                            <p className="text-sm text-muted-foreground italic">"{trend.suggestedCTA}"</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" disabled>
                            <Bookmark className="mr-2 h-4 w-4" />
                            Save Trend
                        </Button>
                        <Button size="sm" onClick={() => handleTurnIntoScript(trend.contentSuggestion)}>
                            <PenSquare className="mr-2 h-4 w-4" />
                            Turn into Reel Script
                        </Button>
                    </CardFooter>
                    </Card>
                )
                })}
            </div>
            )}
            {!isLoading && !output && (
            <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Enter a topic to discover trending Reels.</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}
