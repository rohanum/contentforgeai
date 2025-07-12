
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Github, Twitter, Youtube, Send, MessageSquareHeart } from 'lucide-react';

const solutions = [
    { name: 'Viral Video Strategist', href: '/viral-video-strategist' },
    { name: 'YouTube Script Generator', href: '/youtube-script' },
    { name: 'Content Repurposer', href: '/script-to-shorts' },
    { name: 'Thumbnail Generator', href: '/thumbnail-generator' },
  ];
  
  const social = [
    { name: 'Trending Reels Discovery', href: '/trending-reels' },
    { name: 'Reel Script Generator', href: '/reel-script' },
    { name: 'Caption Generator', href: '/caption-generator' },
    { name: 'Hashtag Generator', href: '/hashtag-generator' },
  ];
  
  const company = [
    { name: 'Content Planner', href: '/content-planner' },
    { name: 'Brand Kit', href: '/brand-kit' },
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
  ];

  const TestimonialCard = ({ author, quote }: { author: string, quote: string }) => (
    <div className="p-6 rounded-2xl bg-secondary/50 border border-secondary">
      <p className="text-muted-foreground italic">"{quote}"</p>
      <p className="font-bold text-right mt-4">- {author}</p>
    </div>
  );

export function Footer() {
  return (
    <footer className="bg-background/50 backdrop-blur-sm mt-16 text-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Be part of a creative community! 🌎</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">A community of over 4 million is waiting for you.</p>
          <div className="mt-8">
            <Button size="lg" asChild className="glow-primary">
              <Link href="#">Join Discord Server</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <TestimonialCard author="Malakai030" quote="ContentForge gave me a way of expressing myself in a completely new and different way. Without AI I was only a consumer. Now I can create." />
            <TestimonialCard author="Raini Studios" quote="ContentForge is suitable for those who are just starting their way in the world of AI images, as well as for professionals, who are offered a wide range of tools to work with." />
            <TestimonialCard author="Dee Does A.I" quote="With its powerful fine-tuned models ContentForge makes A.I art a breeze. The community is also the best I've found to date!" />
        </div>

        <Separator className="my-16 bg-border/50" />
        
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
            <div className="space-y-4 col-span-1">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="ContentForge Logo" width={32} height={32} data-ai-hint="logo" />
                    <span className="font-bold text-xl">ContentForge AI</span>
                </Link>
                <p className="text-muted-foreground">Create your next masterpiece with the power of ContentForge AI.</p>
                 <div className="flex space-x-4">
                    <Link href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">Twitter</span><Twitter /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">GitHub</span><Github /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">YouTube</span><Youtube /></Link>
                 </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                        <h3 className="text-sm font-semibold leading-6">YouTube Suite</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            {solutions.map((item) => (
                                <li key={item.name}><Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-primary">{item.name}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-10 md:mt-0">
                        <h3 className="text-sm font-semibold leading-6">Social Suite</h3>
                         <ul role="list" className="mt-6 space-y-4">
                            {social.map((item) => (
                                <li key={item.name}><Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-primary">{item.name}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                        <h3 className="text-sm font-semibold leading-6">Utilities</h3>
                         <ul role="list" className="mt-6 space-y-4">
                            {company.map((item) => (
                                <li key={item.name}><Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-primary">{item.name}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-10 md:mt-0">
                        <h3 className="text-sm font-semibold leading-6">Suggestions & Feedback</h3>
                        <p className="text-sm text-muted-foreground mt-6">Have an idea or feedback? We'd love to hear from you.</p>
                        <Button asChild className="mt-4">
                            <a href="mailto:velora.official.ai@gmail.com?subject=Suggestion for ContentForge AI">
                                <MessageSquareHeart className="mr-2 h-4 w-4" />
                                Share Your Ideas
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-muted-foreground">&copy; {new Date().getFullYear()} ContentForge AI. All rights reserved.</p>
          <div className="flex space-x-4 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-primary">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
