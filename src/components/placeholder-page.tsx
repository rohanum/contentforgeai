import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center bg-background rounded-lg border-2 border-dashed mt-8">
            <Construction className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold tracking-tight">Coming Soon!</h2>
            <p className="text-muted-foreground mt-2 max-w-md">This feature is currently under construction. Check back soon for updates!</p>
        </div>
    </div>
  );
}
