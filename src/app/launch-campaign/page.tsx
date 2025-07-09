
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateLaunchCampaign, GenerateLaunchCampaignOutput } from "@/ai/flows/generate-launch-campaign";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Rocket, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GenerateLaunchCampaignInputSchema = z.object({
  productName: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  productDescription: z.string().min(20, { message: "Description must be at least 20 characters." }),
  targetAudience: z.string().min(10, { message: "Target audience must be at least 10 characters." }),
  launchGoal: z.enum(['sales', 'awareness', 'signups']),
});

export default function LaunchCampaignPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateLaunchCampaignOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof GenerateLaunchCampaignInputSchema>>({
    resolver: zodResolver(GenerateLaunchCampaignInputSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      targetAudience: "",
      launchGoal: "awareness",
    },
  });

  async function onSubmit(values: z.infer<typeof GenerateLaunchCampaignInputSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateLaunchCampaign(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Generating Campaign",
        description: "There was an issue creating the campaign assets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string, subject: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${subject} copied to clipboard.` });
  };
  
  const renderResults = () => {
    if (!output) return null;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-primary"/>
                    <CardTitle className="text-2xl">{output.campaignName}</CardTitle>
                </div>
                <CardDescription>Your complete AI-generated launch kit.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="landing-page" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                        <TabsTrigger value="video">Video Script</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="landing-page" className="mt-4">
                        <Card className="bg-secondary/30">
                            <CardHeader>
                                <CardTitle>Landing Page Copy</CardTitle>
                                <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => handleCopy(JSON.stringify(output.landingPageCopy, null, 2), 'Landing page copy')}><Copy className="h-4 w-4"/></Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center p-6 border-dashed border rounded-lg">
                                    <h1 className="text-4xl font-extrabold tracking-tight">{output.landingPageCopy.headline}</h1>
                                    <p className="text-xl text-muted-foreground mt-2">{output.landingPageCopy.subheadline}</p>
                                </div>
                                <div className="space-y-4">
                                     {output.landingPageCopy.features.map((feature, i) => (
                                         <div key={i} className="p-4 border rounded-lg">
                                            <h3 className="font-semibold">{feature.name}</h3>
                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                         </div>
                                     ))}
                                </div>
                                 <Button size="lg" className="w-full">{output.landingPageCopy.cta}</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="email" className="mt-4">
                        <Card className="bg-secondary/30">
                             <CardHeader>
                                <CardTitle>Launch Email</CardTitle>
                                <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => handleCopy(`Subject: ${output.emailCopy.subject}\n\n${output.emailCopy.body}`, 'Email copy')}><Copy className="h-4 w-4"/></Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <Input readOnly value={`Subject: ${output.emailCopy.subject}`} className="font-semibold" />
                               <Textarea readOnly value={output.emailCopy.body} className="h-72 font-mono text-xs" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social" className="mt-4 space-y-4">
                        {output.socialPosts.map((post, i) => (
                            <Card key={i} className="bg-secondary/30">
                                 <CardHeader>
                                    <CardTitle className="text-base">{post.platform} Post</CardTitle>
                                    <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => handleCopy(post.content, `${post.platform} post`)}><Copy className="h-4 w-4"/></Button>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                     <TabsContent value="video" className="mt-4">
                        <Card className="bg-secondary/30">
                             <CardHeader>
                                <CardTitle>Promo Video Script</CardTitle>
                                <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => handleCopy(output.videoScript, 'Video script')}><Copy className="h-4 w-4"/></Button>
                            </CardHeader>
                            <CardContent>
                               <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono bg-background p-4 rounded-lg max-h-80 overflow-y-auto">{output.videoScript}</pre>
                            </CardContent>
                        </Card>
                    </TabsContent>
                 </Tabs>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Launch Campaign Generator</CardTitle>
            <CardDescription>Generate a full marketing campaign from a product description.</CardDescription>
          </CardHeader>
          <CardContent>
             <Alert className="mb-6 bg-primary/5 border-primary/20"><Rocket className="h-4 w-4 text-primary" /><AlertTitle className="text-primary">Pro-Level Tool</AlertTitle><AlertDescription>This tool generates a complete set of marketing assets to launch your product successfully.</AlertDescription></Alert>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="productName" render={({ field }) => (<FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g., ContentForge AI" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="productDescription" render={({ field }) => (<FormItem><FormLabel>Product Description</FormLabel><FormControl><Textarea placeholder="Describe your product, its key features, and what makes it unique." {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="targetAudience" render={({ field }) => (<FormItem><FormLabel>Target Audience</FormLabel><FormControl><Input placeholder="e.g., Content creators, startup founders" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="launchGoal" render={({ field }) => (<FormItem><FormLabel>Campaign Goal</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a goal" /></SelectTrigger></FormControl><SelectContent><SelectItem value="awareness">Build Awareness</SelectItem><SelectItem value="sales">Drive Sales</SelectItem><SelectItem value="signups">Get Signups</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Generate Campaign</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 relative">
        {isLoading ? (
          <Card className="min-h-[calc(100vh-6.5rem)] flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Generating Your Launch Kit...</h2>
            <p className="text-muted-foreground mt-2">The AI is crafting your emails, social posts, and more. This might take a moment.</p>
          </Card>
        ) : output ? renderResults() : (
          <Card className="min-h-[calc(100vh-6.5rem)] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed">
            <Rocket className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold">Your AI Launch Strategist</h2>
            <p className="text-muted-foreground mt-2 max-w-md">Fill out the form to generate a complete multi-channel marketing campaign for your next big launch.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
