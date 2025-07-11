"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateThumbnailImage, GenerateThumbnailImageOutput } from "@/ai/flows/generate-thumbnail-image";
import Image from "next/image";
import { useApiKey } from "@/hooks/use-api-key";
import { handleFlowError } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  style: z.string().min(1, { message: "Please select a style." }),
});

const thumbnailStyles = [
  "Bold & Contrasting Colors",
  "Minimalist & Clean",
  "Energetic & Dynamic",
  "Photorealistic",
  "Futuristic & Sci-Fi",
  "Vintage & Retro",
  "Abstract & Artistic",
];

export default function ThumbnailGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateThumbnailImageOutput | null>(null);
  const { toast } = useToast();
  const { apiKey, isApiKeySet } = useApiKey();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      style: "Bold & Contrasting Colors",
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
      const result = await generateThumbnailImage({ ...values, apiKey });
      setOutput(result);
    } catch (error) {
      handleFlowError(error, toast, "Error Generating Thumbnails");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `thumbnail-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
        title: "Downloaded!",
        description: `Thumbnail ${index + 1} has been downloaded.`
    })
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Thumbnail Generator</CardTitle>
            <CardDescription>Generate eye-catching thumbnail images from your video topic.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Topic or Title</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Unboxing the new iPhone 15 Pro Max" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artistic Style</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select an artistic style" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {thumbnailStyles.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || !isApiKeySet} className="w-full" size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Thumbnails
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
        <div className="space-y-8">
            <CardHeader className="p-0">
                <CardTitle>Generated Images</CardTitle>
                <CardDescription>Your AI-generated thumbnail options will appear here.</CardDescription>
            </CardHeader>
             <div className="grid grid-cols-1 gap-6">
                {isLoading && (
                    Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <Skeleton className="w-full aspect-video" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-32" />
                            </CardFooter>
                        </Card>
                    ))
                )}
                
                {output && output.images.map((image, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                           <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                 <Image src={image} alt={`Generated thumbnail ${index + 1}`} fill className="object-cover" />
                           </div>
                        </CardContent>
                         <CardFooter>
                            <Button onClick={() => handleDownload(image, index)}>
                                <Download className="mr-2 h-4 w-4"/>
                                Download Option {index + 1}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {!isLoading && !output && (
                  <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg col-span-1">
                     <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-10 w-10 text-primary" />
                        <p>Fill out the form to generate thumbnails.</p>
                    </div>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
