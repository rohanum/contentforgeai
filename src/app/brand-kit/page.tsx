"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getBrandKit, saveBrandKit } from "@/lib/firebase/brand-kit";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const brandKitFormSchema = z.object({
  brandName: z.string().min(2, "Brand name must be at least 2 characters."),
  brandDescription: z.string().min(10, "Description must be at least 10 characters."),
  keywords: z.string().min(3, "Please provide at least one keyword."),
  toneOfVoice: z.string().min(3, "Please describe your tone of voice."),
});

export default function BrandKitPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<z.infer<typeof brandKitFormSchema>>({
    resolver: zodResolver(brandKitFormSchema),
    defaultValues: {
      brandName: "",
      brandDescription: "",
      keywords: "",
      toneOfVoice: "",
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      async function fetchBrandKit() {
        try {
          const brandKitData = await getBrandKit(user.uid);
          if (brandKitData) {
            form.reset({
              brandName: brandKitData.brandName,
              brandDescription: brandKitData.brandDescription,
              keywords: brandKitData.keywords.join(', '),
              toneOfVoice: brandKitData.toneOfVoice,
            });
          }
        } catch (error) {
          console.error("Failed to fetch brand kit", error);
          toast({
            title: "Error",
            description: "Could not load your brand kit. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setIsFetching(false);
        }
      }
      fetchBrandKit();
    }
  }, [user, loading, router, form, toast]);

  async function onSubmit(values: z.infer<typeof brandKitFormSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...values,
        keywords: values.keywords.split(',').map(k => k.trim()).filter(Boolean),
      };
      await saveBrandKit(user.uid, dataToSave);
      toast({
        title: "Brand Kit Saved!",
        description: "Your brand information has been successfully updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your brand kit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading || isFetching) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 text-primary p-3 rounded-lg border border-primary/20 glow-primary">
                <Palette size={28} />
            </div>
            <div>
              <CardTitle className="text-3xl">Brand Kit</CardTitle>
              <CardDescription>Define your brand's identity to generate more consistent and personalized content.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="brandName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ContentForge AI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="brandDescription"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your brand, its mission, and target audience in a few sentences." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="keywords"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Core Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., content creation, AI tools, social media" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="toneOfVoice"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone of Voice</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Professional yet friendly, witty and sarcastic, inspirational" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0 pt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Brand Kit
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
