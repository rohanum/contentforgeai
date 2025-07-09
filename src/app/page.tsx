// src/app/page.tsx
"use client";

import { ToolCard } from '@/components/tool-card';
import {
  Flame,
  Youtube,
  Type,
  Tags,
  ImageIcon,
  Lightbulb,
  FileVideo,
  Instagram,
  Sparkles,
  Hash,
  Copy as CopyIcon,
  History,
  Mic2,
  Calendar,
  FileText,
  ListOrdered,
  Captions,
  Palette,
} from "lucide-react";
import { motion } from "framer-motion";

const youtubeTools = [
  { href: "/youtube-script", title: "YouTube Script Generator", description: "Generate full video scripts from a simple topic or idea.", icon: Youtube, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "holographic script" },
  { href: "/youtube-title", title: "YouTube Title Generator", description: "Create clickbait-friendly titles that get views.", icon: Type, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "glowing typography" },
  { href: "/youtube-description", title: "Description Generator", description: "Generate SEO-optimized video descriptions in seconds.", icon: FileText, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "data stream interface" },
  { href: "/seo-tags", title: "SEO Tags Generator", description: "Find the best keywords and tags for your videos.", icon: Tags, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "digital tag cloud" },
  { href: "/chapters-generator", title: "Chapters Generator", description: "Automatically create timestamped chapters from your script.", icon: ListOrdered, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "sci-fi timeline" },
  { href: "/thumbnail-ideas", title: "Thumbnail Idea Generator", description: "Get ideas and prompts for eye-catching thumbnails.", icon: ImageIcon, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "cyberpunk artwork" },
  { href: "/video-ideas", title: "Video Idea Generator", description: "Discover new video ideas based on your niche.", icon: Lightbulb, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "glowing idea orb" },
  { href: "/video-to-script", title: "Video to Script Converter", description: "Turn any YouTube video into a clean, editable script.", icon: FileVideo, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "video data analysis" },
  { href: "/script-improver", title: "Script Improver", description: "Enhance your script's clarity, emotion, and flow.", icon: Sparkles, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "magic particles" },
];

const socialTools = [
  { href: "/reel-script", title: "Reel Script Generator", description: "Create short-form video scripts for Reels and TikTok.", icon: Instagram, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "social media interface" },
  { href: "/caption-generator", title: "Caption Generator", description: "Generate engaging captions for your social media posts.", icon: Captions, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "glowing text editor" },
  { href: "/hashtag-generator", title: "Hashtag Generator", description: "Find viral, medium, and low competition hashtags.", icon: Hash, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "data analytics" },
  { href: "/carousel-writer", title: "Carousel Writer", description: "Write compelling slide-by-slide carousel copy.", icon: CopyIcon, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "modern ui slides" },
  { href: "/instagram-story", title: "Instagram Story Flow", description: "Generate a 3-5 frame story script for your brand.", icon: History, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "futuristic story ui" },
  { href: "/trending-reels", title: "Trending Reels Discovery", description: "Find trending Reels and get content suggestions.", icon: Flame, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "abstract fire digital" },
];

const utilityTools = [
  { href: "/voiceover-generator", title: "Voiceover Generator", description: "Generate a realistic voiceover from your script.", icon: Mic2, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "sound waveform graph" },
  { href: "/content-planner", title: "Content Planner", description: "Organize all your content in a drag-and-drop calendar.", icon: Calendar, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "holographic calendar" },
  { href: "/brand-kit", title: "Brand Kit", description: "Define your brand voice and keywords for consistent AI-generated content.", icon: Palette, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "brand color palette" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function DashboardPage() {
  const renderToolSection = (title: string, tools: any[]) => (
    <section className="mb-20">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl font-bold mb-8 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">{title}</motion.h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={itemVariants}>
            <ToolCard
              href={tool.href}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              imageUrl={tool.imageUrl}
              dataAiHint={tool.dataAiHint}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );

  return (
    <div>
      <header className="mb-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-purple-400">ContentForge AI</motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="text-muted-foreground mt-4 text-lg md:text-xl max-w-3xl mx-auto">Your all-in-one AI toolkit for creating stunning content that captivates, engages, and converts.</motion.p>
      </header>
      <main>
        {renderToolSection("YouTube Suite", youtubeTools)}
        {renderToolSection("Social Media Suite", socialTools)}
        {renderToolSection("Utilities", utilityTools)}
      </main>
    </div>
  );
}
