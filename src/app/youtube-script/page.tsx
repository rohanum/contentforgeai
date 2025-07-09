
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateYoutubeScript, GenerateYoutubeScriptOutput } from "@/ai/flows/generate-youtube-script";
import { saveYoutubeScript } from "@/lib/firebase/scripts";
import { useAuth } from "@/hooks/use-auth";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Save, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  tone: z.string().optional(),
  scriptLength: z.enum(["short-form", "long-form"]),
});

export default function YoutubeScriptGeneratorPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [output, setOutput] = useState<GenerateYoutubeScriptOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "",
      scriptLength: "long-form",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    setIsSaved(false);
    try {
      const result = await generateYoutubeScript(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
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

  const handleSave = async () => {
    if (!output || !user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to save a script.",
        variant: "destructive"
      });
      return;
    };
    setIsSaving(true);
    try {
      const formData = form.getValues();
      await saveYoutubeScript({
        uid: user.uid,
        topic: formData.topic,
        tone: formData.tone,
        scriptLength: formData.scriptLength,
        script: output.script,
      });
      toast({ title: "Script Saved!", description: "You can find it in your Content Library."});
      setIsSaved(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your script.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>YouTube Script Generator</CardTitle>
            <CardDescription>Provide the details for your video script.</CardDescription>
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
                        <Textarea placeholder="e.g., The history of ancient Rome in 10 minutes" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Humorous" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="scriptLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Script Length</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="long-form">Long-form</SelectItem>
                            <SelectItem value="short-form">Short-form</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
              <CardDescription>Your AI-generated script will appear here.</CardDescription>
            </div>
            {output && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleSave} disabled={isSaving || isSaved}>
                    {isSaving 
                        ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        : isSaved 
                        ? <Check className="mr-2 h-4 w-4" /> 
                        : <Save className="mr-2 h-4 w-4" />
                    }
                    {isSaved ? "Saved" : "Save"}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {output && (
              <div className="whitespace-pre-wrap text-sm max-h-[calc(100vh-14rem)] overflow-y-auto rounded-md border p-4 font-mono bg-secondary">
                {output.script}
              </div>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Fill out the form to generate your script.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
