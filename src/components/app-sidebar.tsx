"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
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
  LogOut,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";

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
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    await signOut();
  };
  
  const UserProfile = () => {
    if (loading) {
      return <div className="p-2 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (!user) {
      return <Button className="w-full" onClick={() => router.push('/login')}>Sign In</Button>;
    }
    
    return (
      <div className="flex items-center gap-3 p-2">
        <Link href="/profile" className="flex-1 flex items-center gap-3 truncate">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL!} alt={user.displayName || "User"} data-ai-hint="profile avatar" />
                <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
                <span className="font-semibold truncate">{user.displayName || "User"}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto shrink-0">
                <Settings />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-3 p-2 pr-0">
            <div className="bg-gradient-to-br from-primary to-purple-400 rounded-lg p-2 glow-primary">
                <Bot size={24} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-wide">ContentForge</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {mainNav.map((link) => (
            <SidebarMenuItem key={link.label}>
              <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={link.label} size="lg">
                  <Link href={link.href} className="flex items-center gap-3">
                      <link.icon className="shrink-0" />
                      <span>{link.label}</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator className="my-2" />
          <SidebarGroupLabel className="px-2">YouTube Suite</SidebarGroupLabel>
          {youtubeSuite.map((link) => (
              <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={link.label}>
                  <Link href={link.href} className="flex items-center gap-3">
                      <link.icon className="shrink-0" />
                      <span>{link.label}</span>
                  </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
          ))}
          <SidebarSeparator className="my-2" />
          <SidebarGroupLabel className="px-2">Social Suite</SidebarGroupLabel>
          {socialSuite.map((link) => (
              <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={link.label}>
                  <Link href={link.href} className="flex items-center gap-3">
                      <link.icon className="shrink-0" />
                      <span>{link.label}</span>
                  </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
          ))}
          <SidebarSeparator className="my-2" />
          <SidebarGroupLabel className="px-2">Utilities</SidebarGroupLabel>
          {utilities.map((link) => (
              <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={link.label}>
                  <Link href={link.href} className="flex items-center gap-3">
                      <link.icon className="shrink-0" />
                      <span>{link.label}</span>
                  </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
