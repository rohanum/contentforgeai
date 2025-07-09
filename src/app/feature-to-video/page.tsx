"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateFeatureVideo, GenerateFeatureVideoOutput } from "@/ai/flows/generate-feature-video";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, AlertCircle, Sparkles, AudioLines, FileVideo, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const formSchema = z.object({
  featureDescription: z.string().min(20, { message: "Please describe the feature in at least 20 characters." }),
  videoType: z.enum(['Demo', 'Explainer', 'Pitch', 'Promotional']),
  voiceStyle: z.enum(['calm-professional', 'energetic-promotional', 'friendly-casual']),
});

export default function FeatureToVideoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateFeatureVideoOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      featureDescription: "",
      videoType: "Explainer",
      voiceStyle: "friendly-casual",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateFeatureVideo(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Generating Video Assets",
        description: "There was an issue creating the assets. Please try again.",
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
      description: "Script has been copied to your clipboard.",
    });
  };

  const renderResults = () => {
    if (!output) return null;
    return (
        <Tabs defaultValue="script" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="script">Script</TabsTrigger>
                <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
                <TabsTrigger value="voiceover">Voiceover</TabsTrigger>
            </TabsList>
            <TabsContent value="script" className="mt-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Generated Script</CardTitle>
                            <CardDescription>The complete narration for your video.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(output.script)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="whitespace-pre-wrap text-sm max-h-[calc(100vh-22rem)] overflow-y-auto rounded-md border p-4 font-mono bg-secondary">
                            {output.script}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="storyboard" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Storyboard</CardTitle>
                        <CardDescription>Your shot-by-shot guide for video production.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Timestamp</TableHead>
                                        <TableHead>Scene Description</TableHead>
                                        <TableHead>Text Overlay</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {output.storyboard.map((shot, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-mono text-xs">{shot.timestamp}</TableCell>
                                            <TableCell className="text-sm">{shot.sceneDescription}</TableCell>
                                            <TableCell className="font-semibold italic">"{shot.textOverlay}"</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="voiceover" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Voiceover</CardTitle>
                        <CardDescription>Listen to and download the generated audio.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-10">
                        <audio controls src={output.audioUrl} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Feature-to-Video Generator</CardTitle>
            <CardDescription>Describe a feature to get a full video production kit.</CardDescription>
          </CardHeader>
          <CardContent>
             <Alert className="mb-6 bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">How it works</AlertTitle>
              <AlertDescription>
                This tool generates a script, voiceover, and storyboard. Use these assets in your favorite video editor to assemble the final product.
              </AlertDescription>
            </Alert>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="featureDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Our new dashboard allows users to see all their key metrics in one place with customizable widgets." {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="videoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Type</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a video type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Demo">Demo</SelectItem>
                            <SelectItem value="Explainer">Explainer</SelectItem>
                            <SelectItem value="Pitch">Pitch</SelectItem>
                            <SelectItem value="Promotional">Promotional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="voiceStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Style</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a voice style" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="friendly-casual">Friendly & Casual</SelectItem>
                           <SelectItem value="calm-professional">Calm & Professional</SelectItem>
                           <SelectItem value="energetic-promotional">Energetic & Promotional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Video Kit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
          {isLoading ? (
            <Card className="min-h-[calc(100vh-6.5rem)] flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-semibold">Generating Your Video Kit...</h2>
                <p className="text-muted-foreground mt-2">The AI is writing, storyboarding, and recording. This might take a moment.</p>
            </Card>
          ) : output ? (
              renderResults()
          ) : (
            <Card className="min-h-[calc(100vh-6.5rem)] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed">
                <Video className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold">Your AI Video Production Kit</h2>
                <p className="text-muted-foreground mt-2 max-w-md">Fill out the form to generate a script, storyboard, and voiceover for your next feature video.</p>
            </Card>
          )}
      </div>
    </div>
  );
}
