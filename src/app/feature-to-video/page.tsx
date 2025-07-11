"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { generateFeatureVideo, GenerateFeatureVideoOutput } from "@/ai/flows/generate-feature-video";
import { motion, AnimatePresence } from "framer-motion";
import { useApiKey } from "@/hooks/use-api-key";
import { handleFlowError } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, AlertCircle, Video, Play, Pause, FastForward, Rewind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  featureDescription: z.string().min(20, { message: "Please describe the feature in at least 20 characters." }),
  videoType: z.enum(['Demo', 'Explainer', 'Pitch', 'Promotional']),
  voiceStyle: z.enum(['calm-professional', 'energetic-promotional', 'friendly-casual']),
});

type ParsedStoryboardItem = { start: number; end: number };

const parseTimestamp = (timestamp: string): ParsedStoryboardItem => {
    try {
        const parts = timestamp.split(' - ');
        if (parts.length !== 2) return { start: 0, end: 0 };
        
        const [startMin, startSec] = parts[0].split(':').map(Number);
        const [endMin, endSec] = parts[1].split(':').map(Number);
        
        if (isNaN(startMin) || isNaN(startSec) || isNaN(endMin) || isNaN(endSec)) {
             return { start: 0, end: 0 };
        }
        
        return {
            start: startMin * 60 + startSec,
            end: endMin * 60 + endSec,
        };
    } catch (error) {
        console.error("Error parsing timestamp:", timestamp, error);
        return { start: 0, end: 0 };
    }
};

export default function FeatureToVideoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateFeatureVideoOutput | null>(null);
  const { toast } = useToast();
  const { apiKey, isApiKeySet } = useApiKey();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [parsedStoryboard, setParsedStoryboard] = useState<ParsedStoryboardItem[]>([]);

  useEffect(() => {
    if (output?.storyboard) {
      setParsedStoryboard(output.storyboard.map(parseTimestamp));
      setCurrentSceneIndex(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [output]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const timeUpdateHandler = () => {
      if (!audio.paused) {
          setCurrentTime(audio.currentTime);
          const newSceneIndex = parsedStoryboard.findIndex(
            (scene) => audio.currentTime >= scene.start && audio.currentTime < scene.end
          );
          if (newSceneIndex !== -1 && newSceneIndex !== currentSceneIndex) {
            setCurrentSceneIndex(newSceneIndex);
          }
      }
    };
    const durationChangeHandler = () => setDuration(audio.duration);
    const endedHandler = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentSceneIndex(0);
        audio.currentTime = 0;
    };
    const playHandler = () => setIsPlaying(true);
    const pauseHandler = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('durationchange', durationChangeHandler);
    audio.addEventListener('ended', endedHandler);
    audio.addEventListener('play', playHandler);
    audio.addEventListener('pause', pauseHandler);

    return () => {
      audio.removeEventListener('timeupdate', timeUpdateHandler);
      audio.removeEventListener('durationchange', durationChangeHandler);
      audio.removeEventListener('ended', endedHandler);
      audio.removeEventListener('play', playHandler);
      audio.removeEventListener('pause', pauseHandler);
    };
  }, [parsedStoryboard, currentSceneIndex]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };
  
  const seek = (seconds: number) => {
    if (audioRef.current) {
        audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { featureDescription: "", videoType: "Explainer", voiceStyle: "friendly-casual" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isApiKeySet || !apiKey) {
        toast({ title: "API Key Required", description: "Please set your Gemini API key in your profile.", variant: "destructive" });
        return;
    }
    setIsLoading(true); setOutput(null);
    try {
      const result = await generateFeatureVideo({ ...values, apiKey });
      setOutput(result);
    } catch (error) {
      handleFlowError(error, toast, "Error Generating Video Assets");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Script has been copied to your clipboard." });
  };
  
  const formatTime = (seconds: number) => {
      if (isNaN(seconds) || seconds < 0) return "00:00";
      return new Date(seconds * 1000).toISOString().slice(14, 19);
  }

  const renderResults = () => {
    if (!output) return null;
    const currentScene = output.storyboard[currentSceneIndex];

    return (
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Video Preview</TabsTrigger>
          <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                        <AnimatePresence>
                           {currentScene && (
                             <motion.div
                                key={`bg-${currentSceneIndex}`}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="absolute inset-0"
                             >
                                <Image 
                                    src={`https://placehold.co/1280x720.png`} 
                                    data-ai-hint={currentScene.visualHint}
                                    alt={currentScene.sceneDescription} 
                                    fill 
                                    className="object-cover" 
                                />
                                <div className="absolute inset-0 bg-black/40"></div>
                             </motion.div>
                           )}
                        </AnimatePresence>
                        
                        <div className="relative z-10 p-8 w-full h-full flex flex-col justify-end text-white">
                             <AnimatePresence mode="wait">
                                {currentScene?.textOverlay && (
                                    <motion.p 
                                        key={`text-${currentSceneIndex}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-2xl md:text-4xl font-bold text-center drop-shadow-lg bg-black/30 p-4 rounded-lg"
                                    >
                                        {currentScene.textOverlay}
                                    </motion.p>
                                )}
                             </AnimatePresence>
                        </div>
                    </div>
                    <div className="p-4 bg-secondary/30 space-y-3">
                        <Progress value={duration > 0 ? (currentTime / duration) * 100 : 0} />
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-mono text-muted-foreground">{formatTime(currentTime)} / {formatTime(duration)}</span>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => seek(-5)}><Rewind /></Button>
                                <Button size="icon" onClick={togglePlayPause}>
                                    {isPlaying ? <Pause /> : <Play />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => seek(5)}><FastForward /></Button>
                            </div>
                            <span className="text-xs font-mono text-muted-foreground w-20 text-right">{currentScene?.timestamp}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="storyboard" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Storyboard</CardTitle><CardDescription>Your shot-by-shot guide for video production.</CardDescription></CardHeader>
            <CardContent><div className="max-h-[calc(100vh-20rem)] overflow-y-auto pr-2"><Table>
              <TableHeader><TableRow><TableHead className="w-[100px]">Timestamp</TableHead><TableHead>Scene Description</TableHead><TableHead>Text Overlay</TableHead></TableRow></TableHeader>
              <TableBody>{output.storyboard.map((shot, index) => (<TableRow key={index}><TableCell className="font-mono text-xs">{shot.timestamp}</TableCell><TableCell className="text-sm">{shot.sceneDescription}</TableCell><TableCell className="font-semibold italic">{shot.textOverlay ? `"${shot.textOverlay}"` : '–'}</TableCell></TableRow>))}</TableBody>
            </Table></div></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="script" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Generated Script</CardTitle><CardDescription>The complete narration for your video.</CardDescription></div>
              <Button variant="ghost" size="icon" onClick={() => handleCopy(output.script)}><Copy className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent><div className="whitespace-pre-wrap text-sm max-h-[calc(100vh-22rem)] overflow-y-auto rounded-md border p-4 font-mono bg-secondary">{output.script}</div></CardContent>
          </Card>
        </TabsContent>
        <audio ref={audioRef} src={output.audioUrl} className="hidden" />
      </Tabs>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader><CardTitle>Feature-to-Video Generator</CardTitle><CardDescription>Describe a feature to get a full video production kit.</CardDescription></CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-primary/5 border-primary/20"><AlertCircle className="h-4 w-4 text-primary" /><AlertTitle className="text-primary">How it works</AlertTitle><AlertDescription>This tool generates a script, voiceover, storyboard, and an interactive preview. Use these assets to assemble the final product.</AlertDescription></Alert>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="featureDescription" render={({ field }) => (<FormItem><FormLabel>Feature Description</FormLabel><FormControl><Textarea placeholder="e.g., Our new dashboard allows users to see all their key metrics in one place with customizable widgets." {...field} rows={6} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="videoType" render={({ field }) => (<FormItem><FormLabel>Video Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a video type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Demo">Demo</SelectItem><SelectItem value="Explainer">Explainer</SelectItem><SelectItem value="Pitch">Pitch</SelectItem><SelectItem value="Promotional">Promotional</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="voiceStyle" render={({ field }) => (<FormItem><FormLabel>Voice Style</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a voice style" /></SelectTrigger></FormControl><SelectContent><SelectItem value="friendly-casual">Friendly & Casual</SelectItem><SelectItem value="calm-professional">Calm & Professional</SelectItem><SelectItem value="energetic-promotional">Energetic & Promotional</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={isLoading || !isApiKeySet} className="w-full" size="lg">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Generate Video Kit</Button>
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
        ) : output ? renderResults() : (
          <Card className="min-h-[calc(100vh-6.5rem)] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed">
            <Video className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold">Your AI Video Production Kit</h2>
            <p className="text-muted-foreground mt-2 max-w-md">Fill out the form to generate a script, storyboard, voiceover, and interactive preview for your next feature video.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
