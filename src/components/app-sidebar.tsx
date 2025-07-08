"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarSeparator
} from "@/components/ui/sidebar";
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
  Settings,
  Bot,
  FileText,
  ListOrdered,
  Captions,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const mainNav = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
];

const youtubeSuite = [
    { href: "/youtube-script", label: "Script Generator", icon: Youtube },
    { href: "/youtube-title", label: "Title Generator", icon: Type },
    { href: "/youtube-description", label: "Description Generator", icon: FileText },
    { href: "/seo-tags", label: "SEO Tags Generator", icon: Tags },
    { href: "/chapters-generator", label: "Chapters Generator", icon: ListOrdered },
    { href: "/thumbnail-ideas", label: "Thumbnail Ideas", icon: ImageIcon },
    { href: "/video-ideas", label: "Video Idea Generator", icon: Lightbulb },
    { href: "/video-to-script", label: "Video to Script", icon: FileVideo },
    { href: "/script-improver", label: "Script Improver", icon: Sparkles },
];

const socialSuite = [
  { href: "/reel-script", label: "Reel Script", icon: Instagram },
  { href: "/caption-generator",label: "Caption Generator", icon: Captions },
  { href: "/hashtag-generator", label: "Hashtag Generator", icon: Hash },
  { href: "/carousel-writer", label: "Carousel Writer", icon: CopyIcon },
  { href: "/instagram-story", label: "Instagram Story", icon: History },
  { href: "/trending-reels", label: "Trending Reels", icon: Flame },
];

const utilities = [
  { href: "/voiceover-generator", label: "Voiceover Generator", icon: Mic2 },
  { href: "/content-planner", label: "Content Planner", icon: Calendar },
]

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const renderLinks = (links: typeof youtubeSuite) => links.map((link) => (
    <SidebarMenuItem key={link.label}>
        <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={link.label}>
          <Link href={link.href} className="flex items-center gap-2">
            <link.icon className="shrink-0" />
            <span>{link.label}</span>
          </Link>
        </SidebarMenuButton>
    </SidebarMenuItem>
  ));

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 pr-0">
            <div className="bg-primary rounded-lg p-2">
                <Bot size={24} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">ContentForge</span>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {mainNav.map((link) => (
          <SidebarMenuItem key={link.label}>
            <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={link.label}>
                <Link href={link.href} className="flex items-center gap-2">
                    <link.icon className="shrink-0" />
                    <span>{link.label}</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarSeparator className="my-2" />
        <SidebarGroupLabel>YouTube Suite</SidebarGroupLabel>
        {renderLinks(youtubeSuite)}
        <SidebarSeparator className="my-2" />
        <SidebarGroupLabel>Social Suite</SidebarGroupLabel>
        {renderLinks(socialSuite)}
        <SidebarSeparator className="my-2" />
        <SidebarGroupLabel>Utilities</SidebarGroupLabel>
        {renderLinks(utilities)}
      </SidebarMenu>
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="profile avatar" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
                <span className="font-semibold truncate">User</span>
                <span className="text-xs text-muted-foreground truncate">user@example.com</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto shrink-0">
                <Settings />
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
