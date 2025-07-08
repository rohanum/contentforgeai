import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function ToolCard({ title, description, href, icon: Icon }: ToolCardProps) {
  return (
    <Link href={href} className="group flex flex-col h-full">
      <Card className="flex flex-col h-full hover:border-primary transition-colors duration-200 bg-card">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="pt-2">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary">
                <span>Use Tool</span>
                <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
