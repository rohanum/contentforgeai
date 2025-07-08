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
} from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  // YouTube Suite
  { href: "/youtube-script", title: "YouTube Script Generator", description: "Generate full video scripts from a simple topic or idea.", icon: Youtube, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "writing script" },
  { href: "/youtube-title", title: "YouTube Title Generator", description: "Create clickbait-friendly titles that get views.", icon: Type, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "bold typography" },
  { href: "/youtube-description", title: "Description Generator", description: "Generate SEO-optimized video descriptions in seconds.", icon: FileText, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "video seo" },
  { href: "/seo-tags", title: "SEO Tags Generator", description: "Find the best keywords and tags for your videos.", icon: Tags, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "keywords analytics" },
  { href: "/chapters-generator", title: "Chapters Generator", description: "Automatically create timestamped chapters from your script.", icon: ListOrdered, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "video timeline" },
  { href: "/thumbnail-ideas", title: "Thumbnail Idea Generator", description: "Get ideas and prompts for eye-catching thumbnails.", icon: ImageIcon, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "colorful design" },
  { href: "/video-ideas", title: "Video Idea Generator", description: "Discover new video ideas based on your niche.", icon: Lightbulb, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "bright idea" },
  { href: "/video-to-script", title: "Video to Script Converter", description: "Turn any YouTube video into a clean, editable script.", icon: FileVideo, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "video player" },
  { href: "/script-improver", title: "Script Improver", description: "Enhance your script's clarity, emotion, and flow.", icon: Sparkles, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "magic sparkle" },
  
  // Social Suite
  { href: "/reel-script", title: "Reel Script Generator", description: "Create short-form video scripts for Reels and TikTok.", icon: Instagram, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "social media" },
  { href: "/caption-generator", title: "Caption Generator", description: "Generate engaging captions for your social media posts.", icon: Captions, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "social post" },
  { href: "/hashtag-generator", title: "Hashtag Generator", description: "Find viral, medium, and low competition hashtags.", icon: Hash, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "trending tags" },
  { href: "/carousel-writer", title: "Carousel Writer", description: "Write compelling slide-by-slide carousel copy.", icon: CopyIcon, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "photo slides" },
  { href: "/instagram-story", title: "Instagram Story Flow", description: "Generate a 3-5 frame story script for your brand.", icon: History, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "mobile interface" },
  { href: "/trending-reels", title: "Trending Reels Discovery", description: "Find trending Reels and get content suggestions.", icon: Flame, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "fire flame" },

  // Utilities
  { href: "/voiceover-generator", title: "Voiceover Generator", description: "Generate a realistic voiceover from your script.", icon: Mic2, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "microphone audio" },
  { href: "/content-planner", title: "Content Planner", description: "Organize all your content in a drag-and-drop calendar.", icon: Calendar, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "calendar schedule" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function DashboardPage() {
  return (
    <div>
      <header className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-300">ContentForge AI</h1>
        <p className="text-muted-foreground mt-4 text-lg">Your all-in-one AI toolkit for next-gen content creation.</p>
      </header>
      <motion.main 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={itemVariants}>
            <ToolCard
              href={tool.href}
              title={tool.title}
              icon={tool.icon}
              imageUrl={tool.imageUrl}
              dataAiHint={tool.dataAiHint}
            />
          </motion.div>
        ))}
      </motion.main>
    </div>
  );
}
