
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
  LayoutGrid,
  History,
  Mic2,
  Calendar,
  FileText,
  ListOrdered,
  Captions,
  Palette,
  BrainCircuit,
  Film,
  Video,
  Rocket,
  Zap,
  Library,
} from "lucide-react";
import { motion } from "framer-motion";

const mainNav = [
  { href: "/", title: "Dashboard", description: "Your central hub for all content creation tools.", icon: LayoutGrid, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "futuristic command center" },
  { href: "/my-content", title: "Content Library", description: "Access all your saved AI-generated content in one place.", icon: Library, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "digital library archive" },
];

const youtubeTools = [
  { href: "/viral-video-strategist", title: "Viral Video Strategist", description: "Get AI-powered strategic blueprints for your next hit video.", icon: Zap, imageUrl: "https://i.ibb.co/G4TJt0MS/Viral-Video-Strategist.png", dataAiHint: "lightning analytics" },
  { href: "/youtube-script", title: "YouTube Script Generator", description: "Generate full video scripts from a simple topic or idea.", icon: Youtube, imageUrl: "https://i.ibb.co/chCQt6F5/You-Tube-Script-Generator.png", dataAiHint: "holographic script" },
  { href: "/youtube-title", title: "YouTube Title Generator", description: "Create clickbait-friendly titles that get views.", icon: Type, imageUrl: "https://i.ibb.co/LB3WwNC/You-Tube-Title-Generator.png", dataAiHint: "glowing typography" },
  { href: "/youtube-description", title: "Description Generator", description: "Generate SEO-optimized video descriptions in seconds.", icon: FileText, imageUrl: "https://i.ibb.co/jPNWb6j3/Description-Generator.png", dataAiHint: "data stream interface" },
  { href: "/seo-tags", title: "SEO Tags Generator", description: "Find the best keywords and tags for your videos.", icon: Tags, imageUrl: "https://i.ibb.co/6cY3mLhc/SEO-Tags-Generator.png", dataAiHint: "digital tag cloud" },
  { href: "/chapters-generator", title: "Chapters Generator", description: "Automatically create timestamped chapters from your script.", icon: ListOrdered, imageUrl: "https://i.ibb.co/twqm0qV4/Chapters-Generator.png", dataAiHint: "sci-fi timeline" },
  { href: "/thumbnail-generator", title: "Thumbnail Generator", description: "Generate multiple eye-catching thumbnail images from a single prompt.", icon: ImageIcon, imageUrl: "https://i.ibb.co/KgF6FBp/Thumbnail-Generator.png", dataAiHint: "cyberpunk artwork" },
  { href: "/video-ideas", title: "Video Idea Generator", description: "Discover new video ideas based on your niche.", icon: Lightbulb, imageUrl: "https://i.ibb.co/Zz3Y3YBM/video-idea-generator.png", dataAiHint: "glowing idea orb" },
  { href: "/video-to-script", title: "Video to Script Converter", description: "Turn any YouTube video into a clean, editable script.", icon: FileVideo, imageUrl: "https://i.ibb.co/FRwhjJD/Video-to-Script-Converter.png", dataAiHint: "video data analysis" },
  { href: "/script-improver", title: "Script Improver", description: "Enhance your script's clarity, emotion, and flow.", icon: Sparkles, imageUrl: "https://i.ibb.co/rG2H02XQ/Script-Improver.png", dataAiHint: "magic particles" },
];

const socialTools = [
  { href: "/reel-script", title: "Reel Script Generator", description: "Create short-form video scripts for Reels and TikTok.", icon: Instagram, imageUrl: "https://i.ibb.co/8gvPm9fM/reel-script-generator.png", dataAiHint: "social media interface" },
  { href: "/caption-generator", title: "Caption Generator", description: "Generate engaging captions for your social media posts.", icon: Captions, imageUrl: "https://i.ibb.co/Ld1Mnq86/Caption-Generator.png", dataAiHint: "glowing text editor" },
  { href: "/hashtag-generator", title: "Hashtag Generator", description: "Find viral, medium, and low competition hashtags.", icon: Hash, imageUrl: "https://i.ibb.co/cSPs4PPb/Hashtag-Generator.png", dataAiHint: "data analytics" },
  { href: "/carousel-writer", title: "Carousel Writer", description: "Write compelling slide-by-slide carousel copy.", icon: CopyIcon, imageUrl: "https://placehold.co/500x300.png", dataAiHint: "modern ui slides" },
  { href: "/instagram-story", title: "Instagram Story Flow", description: "Generate a 3-5 frame story script for your brand.", icon: History, imageUrl: "https://i.ibb.co/VpQBRgcz/Instagram-Story-Flow.png", dataAiHint: "futuristic story ui" },
  { href: "/trending-reels", title: "Trending Reels Discovery", description: "Find trending Reels and get content suggestions.", icon: Flame, imageUrl: "https://i.ibb.co/FbNNPzv8/Trending-Reels-Discovery.png", dataAiHint: "abstract fire digital" },
];

const utilityTools = [
  { href: "/content-strategist", title: "Content Strategist", description: "Get a complete, multi-platform content strategy for your brand.", icon: BrainCircuit, imageUrl: "https://i.ibb.co/RTd3ym2r/Content-Strategist.png", dataAiHint: "neural network" },
  { href: "/launch-campaign", title: "Launch Campaign", description: "Generate a full marketing campaign for a product launch.", icon: Rocket, imageUrl: "https://i.ibb.co/7NXsZ3ty/flux-1-kontext-pro-A-stylized-rocket-s.png", dataAiHint: "rocket launch space" },
  { href: "/voiceover-generator", title: "Voiceover Generator", description: "Generate a realistic voiceover from your script.", icon: Mic2, imageUrl: "https://i.ibb.co/RpB61rqw/Voiceover-Generator.png", dataAiHint: "sound waveform graph" },
  { href: "/content-planner", title: "Content Planner", description: "Organize all your content in a drag-and-drop calendar.", icon: Calendar, imageUrl: "https://i.ibb.co/zhXLqBTF/Content-Planner.png", dataAiHint: "holographic calendar" },
  { href: "/brand-kit", title: "Brand Kit", description: "Define your brand voice and keywords for consistent AI-generated content.", icon: Palette, imageUrl: "https://i.ibb.co/3yS98GzD/Brand-Kit.png", dataAiHint: "brand color palette" },
  { href: "/script-to-shorts", title: "Content Repurposer", description: "Turn one long-form script into multiple viral short videos.", icon: Film, imageUrl: "https://i.ibb.co/d09SNdxY/Content-Repurposer.png", dataAiHint: "film reels abstract" },
  { href: "/feature-to-video", title: "Feature to Video", description: "Generate a script, storyboard, and voiceover from a feature description.", icon: Video, imageUrl: "https://i.ibb.co/Y7xCB3Tj/Feature-to-Video.png", dataAiHint: "abstract video editing" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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
  const renderToolSection = (title: string, tools: any[], delay: number = 0.2) => (
    <section className="mb-20">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay, duration: 0.5 }}
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
        {renderToolSection("YouTube Suite", youtubeTools, 0.5)}
        {renderToolSection("Social Media Suite", socialTools, 0.6)}
        {renderToolSection("Utilities", utilityTools, 0.7)}
      </main>
    </div>
  );
}
