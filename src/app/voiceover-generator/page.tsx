"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateVoiceover, GenerateVoiceoverOutput } from "@/ai/flows/generate-voiceover";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  script: z.string().min(20, { message: "Script must be at least 20 characters." }),
});

export default function VoiceoverGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateVoiceoverOutput | null>(null);
  const { toast } = useToast();

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
      const result = await generateVoiceover(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate voiceover. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Voiceover Generator</CardTitle>
            <CardDescription>Generate a realistic voiceover from your script.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="script"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Script</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste the script you want to generate a voiceover for..." {...field} rows={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic2 className="mr-2 h-4 w-4" />}
                  Generate Voiceover
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
        <Card className="min-h-[calc(100vh-6.5rem)]">
          <CardHeader>
            <CardTitle>Generated Voiceover</CardTitle>
            <CardDescription>Your AI-generated audio will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating audio, this may take a moment...</p>
              </div>
            )}
            {output && (
              <div className="w-full">
                <audio controls src={output.audioUrl} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg w-full">
                <p>Enter a script to generate a voiceover.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
