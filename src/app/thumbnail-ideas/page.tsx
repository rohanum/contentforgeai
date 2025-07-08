"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateThumbnailIdeas, GenerateThumbnailIdeasOutput } from "@/ai/flows/generate-thumbnail-ideas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
});

export default function ThumbnailIdeasPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateThumbnailIdeasOutput | null>(null);
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
      const result = await generateThumbnailIdeas(values.topic);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate thumbnail ideas. Please try again.",
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
      description: "Thumbnail idea copied to clipboard.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Thumbnail Idea Generator</CardTitle>
            <CardDescription>Get ideas for eye-catching thumbnails.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Topic or Title</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Unboxing the new iPhone 15 Pro Max" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
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
            <CardTitle>Generated Ideas</CardTitle>
            <CardDescription>Your AI-generated thumbnail ideas will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {output && (
              <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {output.map((idea, index) => (
                  <Card key={index} className="bg-secondary p-4 flex items-start gap-4">
                     <div className="bg-primary/10 text-primary p-2 rounded-lg mt-1">
                      <ImageIcon className="w-5 h-5" />
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
                <p>Fill out the form to generate thumbnail ideas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
