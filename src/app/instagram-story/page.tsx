"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateInstagramStoryFlow, GenerateInstagramStoryFlowOutput } from "@/ai/flows/generate-instagram-story-flow";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Clapperboard, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  storyType: z.enum(['value', 'announcement', 'brand storytelling']),
});

export default function InstagramStoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateInstagramStoryFlowOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      storyType: "value",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateInstagramStoryFlow(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate story flow. Please try again.",
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
      description: "Frame content copied to clipboard.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Instagram Story Flow</CardTitle>
            <CardDescription>Generate a script for your next Instagram story.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., A day in the life of a software engineer" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select story type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="value">Value-Driven</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="brand storytelling">Brand Storytelling</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Story
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
        <Card className="min-h-[calc(100vh-6.5rem)]">
          <CardHeader>
            <CardTitle>Generated Story Frames</CardTitle>
            <CardDescription>Your AI-generated story frames will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {output && (
              <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {output.storyFrames.map((frame, index) => (
                  <Card key={index} className="bg-secondary p-4 flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <Clapperboard className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">Frame {index + 1}</p>
                        <p className="text-sm text-muted-foreground">{frame}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(frame)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Fill out the form to generate a story flow.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
