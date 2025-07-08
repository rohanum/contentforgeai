import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  imageUrl: string;
  dataAiHint: string;
}

export function ToolCard({ title, description, href, icon: Icon, imageUrl, dataAiHint }: ToolCardProps) {
  return (
    <motion.div
      whileHover="hover"
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link href={href} className="group block h-full">
        <motion.div 
          variants={{
            initial: { y: 0 },
            hover: { y: -8, scale: 1.03 }
          }}
          className={cn(
            "relative flex flex-col h-full rounded-2xl overflow-hidden",
            "bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl",
            "transition-shadow duration-300",
            "group-hover:shadow-2xl group-hover:shadow-primary/30",
            "animated-gradient-border"
        )}>
           <div className="absolute inset-0 z-10 group-hover:animated-gradient-border::before:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="relative w-full h-40 overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              data-ai-hint={dataAiHint}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          </div>
          <div className="p-5 flex-1 flex flex-col z-20">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg border border-primary/20 glow-primary">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
            </div>
            <p className="text-muted-foreground mt-2 text-sm flex-1">{description}</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
