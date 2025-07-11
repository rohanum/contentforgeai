
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateContentStrategy, GenerateContentStrategyOutput } from "@/ai/flows/generate-content-strategy";
import { useApiKey } from "@/hooks/use-api-key";
import { handleFlowError } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, BrainCircuit, UserCheck, Target, BarChart, CalendarDays, Lightbulb, Youtube, Instagram, Twitter, Clapperboard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  topic: z.string().min(5, { message: "Topic must be at least 5 characters." }),
  goal: z.enum(['grow-audience', 'launch-product', 'build-authority']),
});

const platformIcons: Record<string, React.ReactNode> = {
    YouTube: <Youtube className="w-5 h-5 text-red-500" />,
    Instagram: <Instagram className="w-5 h-5 text-pink-500" />,
    TikTok: <Clapperboard className="w-5 h-5 text-cyan-400" />,
    X: <Twitter className="w-5 h-5 text-blue-400" />,
};

export default function ContentStrategistPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateContentStrategyOutput | null>(null);
  const { toast } = useToast();
  const { apiKey, isApiKeySet } = useApiKey();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      goal: "grow-audience",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isApiKeySet || !apiKey) {
        toast({ title: "API Key Required", description: "Please set your Gemini API key in your profile.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateContentStrategy({ ...values, apiKey });
      setOutput(result);
    } catch (error) {
      handleFlowError(error, toast);
    } finally {
      setIsLoading(false);
    }
  }
  
  const renderOutput = () => {
    if (!output) return null;

    const { audiencePersona, contentPillars, platformStrategies, weeklySchedule, specificIdeas } = output;

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <UserCheck className="w-8 h-8 text-primary" />
                        <div>
                            <CardTitle className="text-2xl">Target Audience: {audiencePersona.name}</CardTitle>
                            <CardDescription>{audiencePersona.demographics}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-muted-foreground">Pain Points</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {audiencePersona.painPoints.map((point, i) => <li key={i}>{point}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-muted-foreground">Goals</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {audiencePersona.goals.map((goal, i) => <li key={i}>{goal}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Target className="w-8 h-8 text-primary" />
                            <CardTitle className="text-2xl">Core Content Pillars</CardTitle>
                        </div>
                        <CardDescription>The foundational themes for all your content.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {contentPillars.map((pillar, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <p className="font-medium">{pillar}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Lightbulb className="w-8 h-8 text-primary" />
                            <CardTitle className="text-2xl">Actionable Ideas</CardTitle>
                        </div>
                        <CardDescription>Specific content ideas you can create now.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {specificIdeas.map((idea, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm">
                                <span className="text-primary font-bold">{i + 1}.</span>
                                <p>{idea}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <BarChart className="w-8 h-8 text-primary" />
                        <CardTitle className="text-2xl">Platform-Specific Strategy</CardTitle>
                    </div>
                     <CardDescription>Tailored advice for each major platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {platformStrategies.map((strategy, i) => (
                            <AccordionItem value={`item-${i}`} key={i}>
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        {platformIcons[strategy.platform]}
                                        {strategy.platform}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <div className="flex flex-wrap gap-4">
                                        <Badge variant="outline">Format: {strategy.contentFormat}</Badge>
                                        <Badge variant="outline">Frequency: {strategy.postingFrequency}</Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{strategy.strategicAdvice}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <CalendarDays className="w-8 h-8 text-primary" />
                        <CardTitle className="text-2xl">Sample Weekly Schedule</CardTitle>
                    </div>
                     <CardDescription>A bird's-eye view of your content week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Day</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Content Idea</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {weeklySchedule.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{item.day}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {platformIcons[item.platform]}
                                            {item.platform}
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.idea}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg border border-primary/20 glow-primary">
                  <BrainCircuit size={24} />
              </div>
              <div>
                <CardTitle>Content Strategist</CardTitle>
                <CardDescription>Generate a complete content plan.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Topic / Niche</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AI for small businesses" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a goal" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="grow-audience">Grow My Audience</SelectItem>
                          <SelectItem value="launch-product">Launch a Product</SelectItem>
                          <SelectItem value="build-authority">Build Brand Authority</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || !isApiKeySet} className="w-full" size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate My Strategy
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
                <h2 className="text-xl font-semibold">Building Your Strategy...</h2>
                <p className="text-muted-foreground mt-2">The AI is analyzing your goals and crafting the perfect plan. This might take a moment.</p>
              </Card>
            ) : output ? (
              renderOutput()
            ) : (
                <Card className="min-h-[calc(100vh-6.5rem)] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed">
                    <BrainCircuit className="h-16 w-16 text-primary mb-4" />
                    <h2 className="text-2xl font-bold">Your AI-Generated Content Strategy</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">Fill out the form to generate a comprehensive plan and get a clear roadmap for your content.</p>
                </Card>
            )}
      </div>
    </div>
  );
}
