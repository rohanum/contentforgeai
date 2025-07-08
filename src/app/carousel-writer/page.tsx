"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateCarouselSlides, GenerateCarouselSlidesOutput } from "@/ai/flows/generate-carousel-slides";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }),
  numSlides: z.number().min(3).max(10).default(5),
});

export default function CarouselWriterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<GenerateCarouselSlidesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      numSlides: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateCarouselSlides(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate carousel slides. Please try again.",
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
            <CardTitle>Carousel Writer</CardTitle>
            <CardDescription>Generate slide-by-slide copy for your carousels.</CardDescription>
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
                        <Textarea placeholder="e.g., 5 tips for better time management" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numSlides"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Slides: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={3}
                          max={10}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Slides
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 relative">
        <Card className="min-h-[calc(100vh-6.5rem)]">
          <CardHeader>
            <CardTitle>Generated Carousel</CardTitle>
            <CardDescription>Swipe through your AI-generated carousel slides.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {output && (
              <Carousel className="w-full max-w-lg mx-auto" opts={{ loop: true }}>
                <CarouselContent>
                  {output.slides.map((slide, index) => (
                    <CarouselItem key={index}>
                      <Card className="bg-secondary">
                        <CardHeader>
                          <CardTitle>Slide {index + 1}</CardTitle>
                          <CardDescription className="font-semibold text-foreground pt-2">"{slide.hook}"</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-primary">Story</h4>
                            <p className="text-sm text-muted-foreground">{slide.story}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary">Value</h4>
                            <p className="text-sm text-muted-foreground">{slide.value}</p>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <p className="text-sm font-bold text-center w-full bg-primary/10 text-primary p-2 rounded-md">"{slide.cta}"</p>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
            {!isLoading && !output && (
              <div className="flex items-center justify-center h-96 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Fill out the form to generate carousel slides.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
