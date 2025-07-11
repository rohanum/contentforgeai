"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateChapters, GenerateChaptersOutput } from "@/ai/flows/generate-chapters";
import { useApiKey } from "@/hooks/use-api-key";
import { handleFlowError } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, ListOrdered } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  script: z.string().min(50, { message: "Script must be at least 50 characters." }),
});

export default function ChaptersGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateChaptersOutput | null>(null);
  const { toast } = useToast();
  const { apiKey, isApiKeySet } = useApiKey();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      script: "",
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
      const result = await generateChapters({ ...values, apiKey });
      setOutput(result);
    } catch (error) {
      handleFlowError(error, toast);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (output?.chapters) {
      const chaptersText = output.chapters
        .map(c => `${c.timestamp} - ${c.title}`)
        .join("\n");
      navigator.clipboard.writeText(chaptersText);
      toast({
        title: "Copied!",
        description: "All chapters have been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Chapters Generator</CardTitle>
            <CardDescription>Paste your script to automatically create chapters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="script"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Script</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste your full video script here..." {...field} rows={15} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || !isApiKeySet} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Chapters
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
              <CardTitle>Generated Chapters</CardTitle>
              <CardDescription>Timestamps and titles for your video.</CardDescription>
            </div>
            {output && (
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy List
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
              <div className="space-y-2 max-h-[calc(100vh-14rem)] overflow-y-auto">
                {output.chapters.map((chapter, index) => (
                  <div key={index} className="flex items-center gap-4 text-sm p-3 rounded-md border bg-secondary/50">
                    <span className="font-mono text-muted-foreground">{chapter.timestamp}</span>
                    <span className="font-medium flex-1">{chapter.title}</span>
                  </div>
                ))}
              </div>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="flex flex-col items-center gap-2">
                    <ListOrdered className="h-10 w-10 text-primary" />
                    <p>Your generated chapters will appear here.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
