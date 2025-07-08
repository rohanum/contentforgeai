"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateYoutubeDescription, GenerateYoutubeDescriptionOutput } from "@/ai/flows/generate-youtube-description";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  script: z.string().optional(),
  exampleLinks: z.string().optional(),
});

export default function YoutubeDescriptionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateYoutubeDescriptionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      script: "",
      exampleLinks: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateYoutubeDescription(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (output?.description) {
      navigator.clipboard.writeText(output.description);
      toast({
        title: "Copied!",
        description: "The description has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Description Generator</CardTitle>
            <CardDescription>Generate SEO-optimized video descriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic / Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., My Honest Review of the New Tesla Cybertruck" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="script"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Script / Summary (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste your script or a summary of your video..." {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="exampleLinks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Links to Include (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., https://my-website.com\nhttps://affiliate-link.com" {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Description
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
        <Card className="min-h-[calc(100vh-6.5rem)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Description</CardTitle>
              <CardDescription>Your AI-generated description will appear here.</CardDescription>
            </div>
            {output && (
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {output && (
              <div className="whitespace-pre-wrap text-sm max-h-[calc(100vh-14rem)] overflow-y-auto rounded-md border p-4 bg-secondary/50">
                {output.description}
              </div>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Fill out the form to generate a description.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
