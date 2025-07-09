
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignupPage() {
  const { user, loading, signUpWithEmail } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsSubmitting(true);
    await signUpWithEmail(values.email, values.password);
    setIsSubmitting(false);
  }

  if (loading || user) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 group">
       <Card className="w-full max-w-md shadow-2xl shadow-primary/20 animated-gradient-border">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary to-purple-400 rounded-lg p-3 inline-block glow-primary mb-4">
              <Bot size={32} className="text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-extrabold">Create an Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Get started with your AI content creation toolkit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...form.register('email')} />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...form.register('password')} />
                {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
                Already have an account?{' '}
                <Link href="/login" className="underline text-primary">
                    Sign in
                </Link>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
