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

const tools = [
  // YouTube Suite
  { href: "/youtube-script", title: "YouTube Script Generator", description: "Generate full video scripts from a simple topic or idea.", icon: Youtube },
  { href: "/youtube-title", title: "YouTube Title Generator", description: "Create clickbait-friendly titles that get views.", icon: Type },
  { href: "/youtube-description", title: "Description Generator", description: "Generate SEO-optimized video descriptions in seconds.", icon: FileText },
  { href: "/seo-tags", title: "SEO Tags Generator", description: "Find the best keywords and tags for your videos.", icon: Tags },
  { href: "/chapters-generator", title: "Chapters Generator", description: "Automatically create timestamped chapters from your script.", icon: ListOrdered },
  { href: "/thumbnail-ideas", title: "Thumbnail Idea Generator", description: "Get ideas and prompts for eye-catching thumbnails.", icon: ImageIcon },
  { href: "/video-ideas", title: "Video Idea Generator", description: "Discover new video ideas based on your niche.", icon: Lightbulb },
  { href: "/video-to-script", title: "Video to Script Converter", description: "Turn any YouTube video into a clean, editable script.", icon: FileVideo },
  { href: "/script-improver", title: "Script Improver", description: "Enhance your script's clarity, emotion, and flow.", icon: Sparkles },
  
  // Social Suite
  { href: "/reel-script", title: "Reel Script Generator", description: "Create short-form video scripts for Reels and TikTok.", icon: Instagram },
  { href: "/caption-generator", title: "Caption Generator", description: "Generate engaging captions for your social media posts.", icon: Captions },
  { href: "/hashtag-generator", title: "Hashtag Generator", description: "Find viral, medium, and low competition hashtags.", icon: Hash },
  { href: "/carousel-writer", title: "Carousel Writer", description: "Write compelling slide-by-slide carousel copy.", icon: CopyIcon },
  { href: "/instagram-story", title: "Instagram Story Flow", description: "Generate a 3-5 frame story script for your brand.", icon: History },
  { href: "/trending-reels", title: "Trending Reels Discovery", description: "Find trending Reels and get content suggestions.", icon: Flame },

  // Utilities
  { href: "/voiceover-generator", title: "Voiceover Generator", description: "Generate a realistic voiceover from your script.", icon: Mic2 },
  { href: "/content-planner", title: "Content Planner", description: "Organize all your content in a drag-and-drop calendar.", icon: Calendar },
];

export default function DashboardPage() {
  return (
    <div>
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to ContentForge AI</h1>
        <p className="text-muted-foreground mt-2">Your all-in-one AI toolkit for content creation.</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {tools.map((tool) => (
          <ToolCard
            key={tool.href}
            href={tool.href}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
          />
        ))}
      </main>
    </div>
  );
}
