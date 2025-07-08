"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { addContentIdea, getContentIdeas, ContentIdea } from '@/lib/firebase/firestore';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ideaFormSchema = z.object({
  text: z.string().min(3, { message: 'Idea must be at least 3 characters.' }),
});

export default function ContentPlannerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [ideas, setIdeas] = useState<Record<string, ContentIdea[]>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);

  const form = useForm<z.infer<typeof ideaFormSchema>>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: { text: '' },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    async function fetchIdeas() {
      if (user) {
        setIsLoadingIdeas(true);
        const userIdeas = await getContentIdeas(user.uid);
        const groupedIdeas = userIdeas.reduce((acc, idea) => {
          const dateKey = idea.date;
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(idea);
          return acc;
        }, {} as Record<string, ContentIdea[]>);
        setIdeas(groupedIdeas);
        setIsLoadingIdeas(false);
      }
    }
    fetchIdeas();
  }, [user]);

  const handleDayClick = (day: Date) => {
    setDate(day);
    setIsDialogOpen(true);
  };
  
  async function onSubmit(values: z.infer<typeof ideaFormSchema>) {
    if (!user || !date) return;
    setIsSubmitting(true);
    try {
      const newIdea: Omit<ContentIdea, 'id' | 'createdAt'> = {
        uid: user.uid,
        date: format(date, 'yyyy-MM-dd'),
        text: values.text,
      };
      await addContentIdea(newIdea);
      
      const dateKey = format(date, 'yyyy-MM-dd');
      setIdeas(prev => ({
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), { ...newIdea, createdAt: new Date() } as any],
      }));
      
      toast({ title: 'Success', description: 'Your content idea has been saved.' });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to save idea. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const selectedDateIdeas = date ? ideas[format(date, 'yyyy-MM-dd')] || [] : [];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">Content Planner</h1>
        <p className="text-muted-foreground mt-2">Organize your content ideas on a calendar. Click a day to add a new idea.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-2">
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              onDayClick={handleDayClick}
              className="w-full"
              components={{
                DayContent: ({ date }) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  const dayHasIdea = ideas[dateKey] && ideas[dateKey].length > 0;
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span>{date.getDate()}</span>
                      {dayHasIdea && <div className="absolute bottom-1 w-1.5 h-1.5 bg-primary rounded-full"></div>}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
        
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Ideas for {date ? format(date, 'MMMM d, yyyy') : 'selected date'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingIdeas ? <Loader2 className="animate-spin mx-auto" /> : 
                        selectedDateIdeas.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedDateIdeas.map((idea, index) => (
                                    <li key={index} className="text-sm p-2 bg-secondary/50 rounded-md">{idea.text}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No ideas for this date.</p>
                        )
                    }
                </CardContent>
                <CardFooter>
                    <Button onClick={() => setIsDialogOpen(true)} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Idea
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Idea</DialogTitle>
            <DialogDescription>
              What's your content idea for {date ? format(date, 'MMMM d, yyyy') : ''}?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register('text')} placeholder="e.g., Film a new tutorial video" autoFocus />
            {form.formState.errors.text && <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>}
            <DialogFooter>
              <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Idea
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
