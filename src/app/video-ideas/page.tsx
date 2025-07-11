"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateVideoIdeas, GenerateVideoIdeasOutput } from "@/ai/flows/generate-video-ideas";
import { useApiKey } from "@/hooks/use-api-key";
import { handleFlowError } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lightbulb, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  niche: z.string().min(3, { message: "Niche must be at least 3 characters." }),
  trendingTopics: z.string().optional(),
  pastVideoTypes: z.string().optional(),
});

export default function VideoIdeasPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateVideoIdeasOutput | null>(null);
  const { toast } = useToast();
  const { apiKey, isApiKeySet } = useApiKey();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: "",
      trendingTopics: "",
      pastVideoTypes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isApiKeySet || !apiKey) {
        toast({ title: "API Key Required", description: "Please set your Gemini API key in your profile.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateVideoIdeas({ ...values, apiKey });
      setOutput(result);
    } catch (error) {
      handleFlowError(error, toast);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Video idea copied to clipboard.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Video Idea Generator</CardTitle>
            <CardDescription>Discover new video ideas based on your niche.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="niche"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Niche</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tech reviews, daily vlogs, cooking tutorials" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trendingTopics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trending Topics (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., AI in creative workflows, new camera releases" {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pastVideoTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Past Video Types (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Top 5 lists, how-to guides, challenge videos" {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || !isApiKeySet} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Ideas
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
        <Card className="min-h-[calc(100vh-6.5rem)]">
          <CardHeader>
            <CardTitle>Generated Video Ideas</CardTitle>
            <CardDescription>Your AI-generated video ideas will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {output && (
              <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {output.videoIdeas.map((idea, index) => (
                   <Card key={index} className="bg-secondary p-4 flex items-start gap-4">
                     <div className="bg-primary/10 text-primary p-2 rounded-lg mt-1">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <p className="flex-1 text-sm">{idea}</p>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(idea)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Fill out the form to generate video ideas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
