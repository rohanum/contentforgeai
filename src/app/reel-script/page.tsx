"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateReelScript, GenerateReelScriptOutput } from "@/ai/flows/generate-reel-script";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  trendingSong: z.string().optional(),
  style: z.string().optional(),
});

export default function ReelScriptGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateReelScriptOutput | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      trendingSong: "",
      style: "",
    },
  });

  useEffect(() => {
    const topicFromParams = searchParams.get('topic');
    if (topicFromParams) {
        form.setValue('topic', topicFromParams);
    }
  }, [searchParams, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateReelScript(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate Reel script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (output?.script) {
      navigator.clipboard.writeText(output.script);
      toast({
        title: "Copied!",
        description: "The script has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Reel Script Generator</CardTitle>
            <CardDescription>Create short-form video scripts for Reels and TikTok.</CardDescription>
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
                        <Textarea placeholder="e.g., How to make the perfect cup of coffee" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Funny, cinematic, informative" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trendingSong"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trending Song (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Aesthetic' by Tollan Kim" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Script
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
              <CardTitle>Generated Script</CardTitle>
              <CardDescription>Your AI-generated Reel script will appear here.</CardDescription>
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
              <div className="whitespace-pre-wrap text-sm max-h-[calc(100vh-14rem)] overflow-y-auto rounded-md border p-4 font-mono bg-secondary/50">
                {output.script}
              </div>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Fill out the form to generate your Reel script.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
