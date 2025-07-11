"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateShortsFromScript, GenerateShortsFromScriptOutput, GenerateShortsFromScriptInputSchema } from "@/ai/flows/generate-shorts-from-script";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Clapperboard, Film, PenSquare, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = GenerateShortsFromScriptInputSchema;

export default function ScriptToShortsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateShortsFromScriptOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      script: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateShortsFromScript(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate short-form ideas. Please try again.",
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
      description: "Content copied to clipboard.",
    });
  };
  
  const handleTurnIntoScript = (idea: string) => {
    router.push(`/reel-script?topic=${encodeURIComponent(idea)}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg border border-primary/20 glow-primary">
                  <Film size={24} />
              </div>
              <div>
                <CardTitle>Content Repurposer</CardTitle>
                <CardDescription>Turn one script into many shorts.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="script"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Video Script</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste your long-form video script here..." {...field} rows={15} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Shorts
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
         <div className="space-y-4">
            <CardHeader className="p-0 mb-4">
                <CardTitle>Generated Short-Form Ideas</CardTitle>
                <CardDescription>Viral moments extracted from your script.</CardDescription>
            </CardHeader>
            
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {output && (
              <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                {output.shorts.map((short, index) => (
                  <Card key={index} className="bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Clapperboard className="w-5 h-5 text-primary flex-shrink-0"/>
                            <span>{short.title}</span>
                        </CardTitle>
                        <CardDescription className="pt-2 font-semibold text-foreground">"{short.hook}"</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative p-4 rounded-md bg-background border border-dashed border-primary/50">
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleCopy(short.script_segment)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{short.script_segment}</p>
                        </div>
                    </CardContent>
                     <CardFooter className="flex flex-col items-start gap-4">
                        <div className="p-4 rounded-md bg-background border w-full">
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                                Suggested CTA
                            </h4>
                            <p className="text-sm text-muted-foreground italic">"{short.cta}"</p>
                        </div>
                        <Button size="sm" onClick={() => handleTurnIntoScript(short.script_segment)}>
                            <PenSquare className="mr-2 h-4 w-4" />
                            Refine in Reel Script Generator
                        </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <div className="flex flex-col items-center gap-2">
                    <Film className="h-10 w-10 text-primary" />
                    <p>Your short-form video ideas will appear here.</p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
