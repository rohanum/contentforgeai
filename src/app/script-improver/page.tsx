"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { improveScript, ImproveScriptOutput } from "@/ai/flows/improve-script";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  script: z.string().min(20, { message: "Script must be at least 20 characters." }),
  tone: z.string().optional(),
});

export default function ScriptImproverPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<ImproveScriptOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      script: "",
      tone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await improveScript(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to improve script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (output?.improvedScript) {
      navigator.clipboard.writeText(output.improvedScript);
      toast({
        title: "Copied!",
        description: "The improved script has been copied to your clipboard.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col h-full">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Script Improver</h1>
                <p className="text-muted-foreground mt-2">Paste your script, and let AI enhance its clarity, emotion, and flow.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Script</CardTitle>
                        <CardDescription>Paste the script you want to improve.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="script"
                            render={({ field }) => (
                                <FormItem className="flex-1 flex flex-col">
                                    <FormLabel>Script</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Paste your script here..." {...field} className="flex-1 min-h-[300px]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tone (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., More confident, witty, or professional" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} size="lg">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            Improve Script
                        </Button>
                    </CardContent>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Improved Script</CardTitle>
                            <CardDescription>The AI-enhanced version of your script.</CardDescription>
                        </div>
                        {output && (
                            <Button variant="ghost" size="icon" onClick={handleCopy}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1">
                        {isLoading && (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}
                        {output && (
                            <div className="whitespace-pre-wrap text-sm h-full max-h-[calc(100vh-22rem)] overflow-y-auto rounded-md border p-4 font-mono bg-secondary/50">
                                {output.improvedScript}
                            </div>
                        )}
                        {!isLoading && !output && (
                            <div className="flex items-center justify-center h-full text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                <p>Your improved script will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </form>
    </Form>
  );
}
