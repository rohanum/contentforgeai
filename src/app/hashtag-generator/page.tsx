"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateHashtag, GenerateHashtagOutput } from "@/ai/flows/generate-hashtag";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  tone: z.string().optional(),
});

type HashtagCategory = keyof GenerateHashtagOutput['hashtags'];

export default function HashtagGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateHashtagOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateHashtag({
        ...values,
        popularityLevels: ['low', 'medium', 'viral']
      });
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate hashtags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (category: HashtagCategory) => {
    if (output?.hashtags?.[category]) {
      const textToCopy = output.hashtags[category].join(" ");
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} hashtags copied.`,
      });
    }
  };
  
  const renderHashtags = (category: HashtagCategory) => (
    <div>
        <div className="flex justify-end mb-4">
             <Button variant="ghost" size="sm" onClick={() => handleCopy(category)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy {category}
            </Button>
        </div>
        <div className="flex flex-wrap gap-2 rounded-md border p-4 min-h-[10rem] bg-secondary/50">
        {output?.hashtags[category].map((tag, index) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
        ))}
        </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Hashtag Generator</CardTitle>
            <CardDescription>Provide post details to get hashtags.</CardDescription>
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
                        <Textarea placeholder="e.g., My morning routine for a productive day" {...field} rows={4} />
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
                        <Input placeholder="e.g., Inspirational, Funny" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Hashtags
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
        <Card className="min-h-[calc(100vh-6.5rem)]">
          <CardHeader>
            <CardTitle>Generated Hashtags</CardTitle>
            <CardDescription>Your AI-generated hashtags, grouped by popularity.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {output && (
              <Tabs defaultValue="viral" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="viral">Viral</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="low">Niche</TabsTrigger>
                </TabsList>
                <TabsContent value="viral" className="mt-4">{renderHashtags('viral')}</TabsContent>
                <TabsContent value="medium" className="mt-4">{renderHashtags('medium')}</TabsContent>
                <TabsContent value="low" className="mt-4">{renderHashtags('low')}</TabsContent>
              </Tabs>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Fill out the form to generate hashtags.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
