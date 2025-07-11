
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Target, Rocket } from "lucide-react";

const teamMembers = [
    { name: "Alex Turing", role: "Founder & AI Visionary", avatar: "https://placehold.co/100x100.png", dataAiHint: "ceo portrait" },
    { name: "Jordan Smith", role: "Lead Product Designer", avatar: "https://placehold.co/100x100.png", dataAiHint: "designer profile" },
    { name: "Casey Lovelace", role: "Head of Community", avatar: "https://placehold.co/100x100.png", dataAiHint: "community manager" },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">About ContentForge AI</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          We're on a mission to build the most intelligent and intuitive creative co-pilot for creators and founders everywhere.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
            <h2 className="text-3xl font-bold flex items-center gap-3"><Target className="w-8 h-8 text-primary" /> Our Mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
            Content creation should be about strategy and storytelling, not tedious tasks. ContentForge AI was born from a simple idea: what if every creator had access to a world-class strategist, a brilliant scriptwriter, and a tireless production assistant? We build tools that don't just save time—they unlock new levels of creativity and provide a real competitive advantage.
            </p>
        </div>
         <div>
            <h2 className="text-3xl font-bold flex items-center gap-3"><Rocket className="w-8 h-8 text-primary" /> Our Vision</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
            We envision a future where artificial intelligence acts as a true creative partner, empowering individuals and teams to bring their most ambitious ideas to life. We are committed to pushing the boundaries of what's possible, creating a platform that is not only powerful but also inspiring, ethical, and accessible to all who have a story to tell.
            </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-8 flex items-center justify-center gap-3"><Users className="w-8 h-8 text-primary" /> Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="bg-secondary/50">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Avatar className="w-24 h-24 mb-4 border-4 border-primary/50">
                  <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
