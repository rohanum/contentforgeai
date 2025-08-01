
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Target, Rocket, Handshake, ShieldCheck, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const teamMembers = [
    { name: "RUX", role: "Founder & Product Architect", description: "Driving the future of AI-powered creativity and smart automation", avatar: "/RUX_AVTAR.png", dataAiHint: "founder portrait" },
    { name: "Skye Raynor", role: "Creative Systems Engineer", description: "Leads AI pipeline design, UX intelligence, and backend wizardry", avatar: "/Skye_avatar.png", dataAiHint: "engineer profile" },
    { name: "Nova Kessler", role: "Community Strategy & Ecosystem Partnerships", description: "Building creator culture and tools that empower millions", avatar: "/Nova_avatar.png", dataAiHint: "strategist portrait" },
];

const values = [
    { icon: Gem, title: "Human-First AI", description: "AI should adapt to you, not the other way around." },
    { icon: ShieldCheck, title: "Transparency & Ethics", description: "No hidden tricks. No shady data usage." },
    { icon: Handshake, title: "Community-Led", description: "We build with creators—not just for them." },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-20">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">About ContentForge AI</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          We believe creators shouldn&apos;t be buried in busywork.
        </p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
            <div className="inline-block p-3 bg-primary/10 text-primary rounded-lg mb-4 glow-primary">
                <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
            ContentForge was built to give every creator, founder, and brand the unfair advantage of having a strategist, scriptwriter, and editor in one intelligent workspace. We don’t replace creativity—we amplify it.
            </p>
        </div>
        <div className="space-y-4">
             <div className="inline-block p-3 bg-primary/10 text-primary rounded-lg mb-4 glow-primary">
                <Rocket className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
            We’re building the future of content—one where AI becomes a trusted creative partner. We envision a world where solo creators feel like a full media team and storytellers bring bold visions to life faster than ever.
            </p>
        </div>
      </div>

       <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {values.map((value) => (
            <div key={value.title} className="p-6 rounded-lg bg-secondary/30">
                <div className="inline-block p-4 bg-primary/10 text-primary rounded-lg mb-4 glow-primary">
                    <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground mt-2">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Meet the Humans Behind the AI</h2>
         <p className="text-muted-foreground mb-8 text-lg">We&apos;re not just engineers. We&apos;re creators, dreamers, and toolmakers.</p>
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
                <p className="text-sm text-muted-foreground mt-2 italic">"{member.description}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
       <div className="text-center py-10 bg-secondary/30 rounded-2xl border border-secondary">
          <h2 className="text-3xl font-bold tracking-tight">Join the Community</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We’re more than a product—we’re a movement. Share your wins, learn from others, and shape the future of AI-powered content.
          </p>
           <div className="mt-8">
            <Button size="lg" className="glow-primary">
              <Link href="#">Join the Discord</Link>
            </Button>
          </div>
       </div>

    </div>
  );
}
