import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  href: string;
  icon: LucideIcon;
  imageUrl: string;
  dataAiHint: string;
}

export function ToolCard({ title, href, icon: Icon, imageUrl, dataAiHint }: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="h-full"
    >
      <Link href={href} className="group flex flex-col h-full">
        <Card className="flex flex-col h-full bg-card/80 border-border/60 hover:border-primary/50 transition-colors duration-300 overflow-hidden shadow-lg hover:shadow-primary/20">
          <div className="relative w-full h-40 overflow-hidden">
             <Image
              src={imageUrl}
              alt={title}
              data-ai-hint={dataAiHint}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-base font-semibold text-white tracking-wide">{title}</CardTitle>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
