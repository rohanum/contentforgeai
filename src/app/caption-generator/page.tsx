"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateCaption, GenerateCaptionOutput } from "@/ai/flows/generate-caption";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  tone: z.enum(['bold', 'chill', 'classy', 'funny']),
  platform: z.enum(['instagram', 'facebook', 'x', 'tiktok']),
  additionalEmojis: z.string().optional(),
});

export default function CaptionGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateCaptionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "bold",
      platform: "instagram",
      additionalEmojis: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateCaption(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate caption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (output?.caption) {
      navigator.clipboard.writeText(output.caption);
      toast({
        title: "Copied!",
        description: "The caption has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Caption Generator</CardTitle>
            <CardDescription>Provide details to generate a social media caption.</CardDescription>
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
                        <Textarea placeholder="e.g., Launching my new product..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="x">X (Twitter)</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="chill">Chill</SelectItem>
                          <SelectItem value="classy">Classy</SelectItem>
                          <SelectItem value="funny">Funny</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalEmojis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Emojis (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ✨🚀" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Caption
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
              <CardTitle>Generated Caption</CardTitle>
              <CardDescription>Your AI-generated caption will appear here.</CardDescription>
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
                {output.caption}
              </div>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Fill out the form to generate your caption.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
