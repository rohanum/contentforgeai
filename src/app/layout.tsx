import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/app-sidebar';
import {Toaster} from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/hooks/use-auth';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'ContentForge AI',
  description: 'AI-powered tools for content creators',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-sans antialiased", "aurora-background")}>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] z-0"></div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <AuthProvider>
            <SidebarProvider defaultOpen>
              <AppSidebar />
              <SidebarInset>
                <div className="p-4 sm:p-6 lg:p-8 flex-grow">{children}</div>
                <Footer />
              </SidebarInset>
            </SidebarProvider>
          </AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
