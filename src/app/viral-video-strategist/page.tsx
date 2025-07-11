"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { findViralVideoIdeas, FindViralVideoIdeasOutput, ViralVideoConcept } from "@/ai/flows/find-viral-video-ideas";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { saveViralVideoConcept, getSavedViralVideoConcepts } from "@/lib/firebase/concepts";
import { useApiKey } from "@/hooks/use-api-key";
import { handleFlowError } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Zap, Lightbulb, TrendingUp, DollarSign, Target, Bookmark, PenSquare, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const formSchema = z.object({
  niche: z.string().min(3, { message: "Niche must be at least 3 characters." }),
});

export default function ViralVideoStrategistPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<FindViralVideoIdeasOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const { apiKey, isApiKeySet } = useApiKey();
  
  const [savingConceptTitle, setSavingConceptTitle] = useState<string | null>(null);
  const [savedConceptTitles, setSavedConceptTitles] = useState<Set<string>>(new Set());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { niche: "" },
  });

  useEffect(() => {
    if (user) {
      getSavedViralVideoConcepts(user.uid).then(concepts => {
        setSavedConceptTitles(new Set(concepts.map(c => c.title)));
      });
    }
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isApiKeySet || !apiKey) {
        toast({ title: "API Key Required", description: "Please set your Gemini API key in your profile.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await findViralVideoIdeas({ ...values, apiKey });
      setOutput(result);
    } catch (error) {
      handleFlowError(error, toast);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleSaveConcept = async (concept: ViralVideoConcept) => {
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to save ideas.", variant: "destructive"});
      return;
    }
    setSavingConceptTitle(concept.title);
    try {
      await saveViralVideoConcept({
        ...concept,
        uid: user.uid,
        niche: form.getValues('niche'),
      });
      setSavedConceptTitles(prev => new Set(prev).add(concept.title));
      toast({ title: "Concept Saved!", description: "You can find it in your Content Library." });
    } catch (error) {
      console.error(error);
      toast({ title: "Save Failed", description: "There was an error saving this concept.", variant: "destructive" });
    } finally {
      setSavingConceptTitle(null);
    }
  }

  const handleGenerateScript = (concept: ViralVideoConcept) => {
    const topic = `Video Title: ${concept.title}\n\nStyle: ${concept.format}\n\nOpening Hook: ${concept.hook}\n\nCore Message: ${concept.coreValue}`;
    router.push(`/youtube-script?topic=${encodeURIComponent(topic)}`);
  };

  const DetailItem = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-background border">
      <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
        {icon}
        <span>{title}</span>
      </h4>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
             <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg border border-primary/20 glow-primary">
                  <Zap size={24} />
              </div>
              <div>
                <CardTitle>Viral Video Strategist</CardTitle>
                <CardDescription>Get AI-powered strategies for your next hit video.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="niche"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Niche / Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sustainable tech, historical deep dives" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || !isApiKeySet} className="w-full" size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Strategies
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
        <div className="space-y-4">
            <CardHeader className="p-0 mb-4">
                <CardTitle>Generated Video Concepts</CardTitle>
                <CardDescription>Your AI-generated blueprints for viral videos.</CardDescription>
            </CardHeader>

            {isLoading && (
              <div className="flex items-center justify-center h-96">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">The AI is analyzing viral patterns...</p>
                  </div>
              </div>
            )}
            
            {output && (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {output.concepts.map((concept, index) => {
                const isSaved = savedConceptTitles.has(concept.title);
                const isSaving = savingConceptTitle === concept.title;
                return (
                  <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                    <Card className="overflow-hidden">
                      <AccordionTrigger className="p-6 hover:no-underline">
                        <CardTitle className="flex items-start gap-3 text-left">
                            <span className="text-primary font-bold text-2xl mt-1">{index + 1}.</span>
                            <span className="flex-1">{concept.title}</span>
                        </CardTitle>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4">
                          <DetailItem icon={<Lightbulb className="w-4 h-4 text-primary"/>} title="The Hook (First 15s)">
                            <span className="italic">"{concept.hook}"</span>
                          </DetailItem>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem icon={<Target className="w-4 h-4 text-primary"/>} title="Core Value">{concept.coreValue}</DetailItem>
                            <DetailItem icon={<TrendingUp className="w-4 h-4 text-primary"/>} title="Video Format">{concept.format}</DetailItem>
                            <DetailItem icon={<Sparkles className="w-4 h-4 text-primary"/>} title="Uniqueness">{concept.uniqueness}</DetailItem>
                            <DetailItem icon={<DollarSign className="w-4 h-4 text-primary"/>} title="Monetization Angle">{concept.monetizationAngle}</DetailItem>
                          </div>
                        </div>
                        <CardFooter className="px-0 pt-6 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleSaveConcept(concept)} disabled={isSaving || isSaved}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isSaved ? <Check className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                            {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Concept'}
                          </Button>
                          <Button size="sm" onClick={() => handleGenerateScript(concept)}>
                              <PenSquare className="mr-2 h-4 w-4" />
                              Generate Full Script
                          </Button>
                        </CardFooter>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                )
              })}
            </Accordion>
            )}

            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="flex flex-col items-center gap-2">
                    <Zap className="h-10 w-10 text-primary" />
                    <p>Enter a niche to generate viral video strategies.</p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
