
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BrainCircuit, Users } from "lucide-react";
import Link from "next/link";

const jobOpenings = [
  {
    title: "Senior AI Engineer (Genkit)",
    department: "Engineering",
    location: "Remote",
    description: "Build the next generation of AI-powered creative tools using the Genkit framework.",
  },
  {
    title: "Product Designer (UI/UX)",
    department: "Design",
    location: "Remote",
    description: "Craft intuitive and beautiful user experiences that make complex AI tools feel like magic.",
  },
  {
    title: "Community Manager",
    department: "Marketing",
    location: "Remote",
    description: "Engage and grow our passionate community of creators across Discord, X, and other platforms.",
  },
];

const values = [
    { icon: Sparkles, title: "Creator-Obsessed", description: "We wake up every day thinking about how to help creators win." },
    { icon: BrainCircuit, title: "Innovate Fearlessly", description: "We push the boundaries of AI to build things no one else is offering." },
    { icon: Users, title: "Community-First", description: "Our community is our anchor. We build with them, for them." },
]

export default function CareersPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">Join Our Mission</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          We're building the future of content creation and are looking for passionate people to join our team.
        </p>
      </header>
      
      <div className="grid md:grid-cols-3 gap-8 text-center">
          {values.map(value => (
              <div key={value.title} className="p-6 rounded-lg">
                  <div className="inline-block p-4 bg-primary/10 text-primary rounded-lg mb-4 glow-primary">
                      <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground mt-2">{value.description}</p>
              </div>
          ))}
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Current Openings</h2>
        <div className="space-y-6">
          {jobOpenings.map((job) => (
            <Card key={job.title} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {job.department} &middot; {job.location}
                  </CardDescription>
                   <p className="mt-4 text-sm text-muted-foreground">{job.description}</p>
                </div>
                <Button asChild>
                  <Link href="mailto:careers@contentforge.ai?subject=Application for Senior AI Engineer (Genkit)">
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
           <Card className="text-center p-8 border-dashed">
                <h3 className="text-lg font-semibold">Don't see your role?</h3>
                <p className="text-muted-foreground mt-2">We're always looking for talented people. Send your resume to <a href="mailto:careers@contentforge.ai" className="text-primary underline">careers@contentforge.ai</a>.</p>
            </Card>
        </div>
      </div>
    </div>
  );
}
