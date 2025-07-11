"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateYoutubeDescription, GenerateYoutubeDescriptionOutput } from "@/ai/flows/generate-youtube-description";
import { useAuth } from "@/hooks/use-auth";
import { getBrandKit, BrandKit } from "@/lib/firebase/brand-kit";
import { useApiKey } from "@/hooks/use-api-key";
import { handleFlowError } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";


const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  script: z.string().optional(),
  exampleLinks: z.string().optional(),
});

export default function YoutubeDescriptionPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [output, setOutput] = useState<GenerateYoutubeDescriptionOutput | null>(null);
  const { toast } = useToast();
  const { apiKey, isApiKeySet } = useApiKey();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      script: "",
      exampleLinks: "",
    },
  });
  
  useEffect(() => {
    async function fetchBrandKit() {
        if(user) {
            const data = await getBrandKit(user.uid);
            setBrandKit(data);
        }
    }
    fetchBrandKit();
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isApiKeySet || !apiKey) {
        toast({ title: "API Key Required", description: "Please set your Gemini API key in your profile.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    setOutput(null);
    try {
      const input = {
        ...values,
        apiKey,
        ...(brandKit && {
            brandName: brandKit.brandName,
            brandDescription: brandKit.brandDescription,
            keywords: brandKit.keywords,
            toneOfVoice: brandKit.toneOfVoice,
        })
      };
      const result = await generateYoutubeDescription(input);
      setOutput(result);
    } catch (error) {
      handleFlowError(error, toast);
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
            {user && brandKit && (
                 <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-200">
                    <Palette className="h-4 w-4 text-green-400" />
                    <AlertTitle className="text-green-300">Brand Kit Applied!</AlertTitle>
                    <AlertDescription>
                        Your description will be generated using your "{brandKit.brandName}" brand identity.
                    </AlertDescription>
                </Alert>
            )}
             {user && !brandKit && (
                 <Alert className="mb-6">
                    <Palette className="h-4 w-4" />
                    <AlertTitle>Want better results?</AlertTitle>
                    <AlertDescription>
                        <Link href="/brand-kit" className="underline">Set up your Brand Kit</Link> to generate content in your unique voice.
                    </AlertDescription>
                </Alert>
            )}
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
                <Button type="submit" disabled={isLoading || !isApiKeySet} className="w-full">
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
              <div className="whitespace-pre-wrap text-sm max-h-[calc(100vh-14rem)] overflow-y-auto rounded-md border p-4 bg-secondary">
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
