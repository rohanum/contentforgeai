"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, User, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApiKey } from "@/hooks/use-api-key";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name cannot be longer than 50 characters." }),
  apiKey: z.string().optional(),
});

export default function ProfilePage() {
  const { user, loading, updateUserProfile } = useAuth();
  const { apiKey, setApiKey } = useApiKey();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      apiKey: "",
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      form.setValue('displayName', user.displayName || "");
    }
    if (apiKey) {
        form.setValue('apiKey', apiKey);
    }
  }, [user, loading, router, form, apiKey]);

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsSubmitting(true);
    try {
      await updateUserProfile({ displayName: values.displayName });
      if (values.apiKey) {
        setApiKey(values.apiKey);
      }
      toast({
        title: "Profile Updated",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClearKey = () => {
    setApiKey(null);
    form.setValue('apiKey', '');
    toast({
        title: "API Key Cleared",
        description: "Your Gemini API Key has been removed from local storage."
    })
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-primary">
                  <AvatarImage src={user.photoURL!} alt={user.displayName || "User"} data-ai-hint="profile avatar" />
                  <AvatarFallback className="text-3xl">
                    {user.displayName?.charAt(0).toUpperCase() || <User size={30} />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl">{user.displayName || "Your Profile"}</CardTitle>
                  <CardDescription>Manage your account settings and API key.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Profile</h3>
                 <FormField
                  name="displayName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <Input value={user.email || ""} disabled readOnly />
                  <FormDescription>Your email address cannot be changed.</FormDescription>
                </FormItem>
              </div>

              <Separator />

               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-primary"/>
                    <h3 className="text-lg font-medium">Gemini API Key</h3>
                  </div>
                  <FormField
                    name="apiKey"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Your API Key</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your Google AI Gemini API Key" {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                            Your key is stored only in your browser. We never see it. 
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary"> Get a key here.</a>
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {apiKey && (
                        <Button variant="destructive" type="button" onClick={handleClearKey}>
                            Clear API Key
                        </Button>
                    )}
               </div>

            </CardContent>
             <CardFooter className="px-6 pt-4 border-t">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
