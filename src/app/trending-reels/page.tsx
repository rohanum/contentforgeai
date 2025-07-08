"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { discoverTrendingReels, DiscoverTrendingReelsOutput } from "@/ai/flows/discover-trending-reels";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Flame, Copy, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
});

export default function TrendingReelsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<DiscoverTrendingReelsOutput | null>(null);
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: "Failed to discover trending reels. Please try again.",
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
        <Card className="min-h-[calc(100vh-6.5rem)]">
          <CardHeader>
            <CardTitle>Trending Reels & Ideas</CardTitle>
            <CardDescription>Hot trends and how you can use them.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {output && (
              <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                {output.trends.map((trend, index) => (
                  <Card key={index} className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Flame className="w-5 h-5 text-primary"/>
                            <span>{trend.title}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Why it's trending:</h4>
                            <p className="text-sm text-muted-foreground">{trend.reason}</p>
                        </div>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Enter a topic to discover trending Reels.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
