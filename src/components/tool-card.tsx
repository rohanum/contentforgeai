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
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="h-full"
    >
      <Link href={href} className="group flex flex-col h-full">
        <div className={cn(
          "flex flex-col h-full rounded-xl overflow-hidden",
          "bg-white/[.05] border border-white/[.1] shadow-xl",
          "hover:border-primary/50 transition-colors duration-300",
          "hover:shadow-2xl hover:shadow-primary/20"
        )}>
          <div className="relative w-full h-40 overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              data-ai-hint={dataAiHint}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
            </div>
            <p className="text-muted-foreground mt-2 text-sm flex-1">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
