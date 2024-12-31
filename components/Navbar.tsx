'use client';

import React, { memo } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  BrainIcon,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const NavLink = memo(({ href, icon: Icon, children }: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200"
  >
    <Icon className="h-4 w-4" />
    <span>{children}</span>
  </Link>
));

NavLink.displayName = 'NavLink';

const MobileNavLink = memo(({ href, children }: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center px-3 py-2 text-gray-300 hover:text-blue-400 hover:bg-blue-900/20 rounded-md transition-all duration-200"
  >
    {children}
  </Link>
));

MobileNavLink.displayName = 'MobileNavLink';

function Navbar() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      router.push('/');
      toast({
        title: 'Logged out successfully',
        description: 'See you next time! 👋',
        variant: 'default',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-16 flex items-center justify-center bg-[#0f1833]/95 backdrop-blur-sm border-b border-blue-900/30">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full",
      "bg-[#0f1833]/95 backdrop-blur-sm",
      "border-b border-blue-900/30",
      "transition-all duration-300"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className="group cursor-pointer flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
          >
            <span className={cn(
              "text-2xl font-bold",
              "bg-clip-text text-transparent",
              "bg-gradient-to-r from-blue-400 to-purple-400",
              "group-hover:to-purple-500 transition-all duration-300"
            )}>
              BuildMyCV
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <NavLink href="/pages/Ask-AI" icon={BrainIcon}>
                  Ask AI
                </NavLink>
                <NavLink href="/pages/Analyse-Job-Fit" icon={FileText}>
                  Your Analyses
                </NavLink>
                <NavLink href="/Dashboard" icon={LayoutDashboard}>
                  Dashboard
                </NavLink>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className={cn(
                    "flex items-center space-x-2",
                    "bg-red-500/90 hover:bg-red-600",
                    "text-gray-100",
                    "transition-all duration-200",
                    "hover:scale-105"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push('/Dashboard')}
                className={cn(
                  "bg-blue-600/20 hover:bg-blue-600/30",
                  "text-blue-400",
                  "border border-blue-400/30",
                  "px-6 py-2 rounded-full",
                  "transition-all duration-300",
                  "hover:scale-105",
                  "hover:shadow-lg hover:shadow-blue-500/20"
                )}
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          {user && (
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-blue-400"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] bg-[#0f1833]/95 backdrop-blur-sm border-l border-blue-900/30"
                >
                  <div className="flex flex-col space-y-4 mt-8">
                    <MobileNavLink href="/pages/Ask-AI">
                      Ask AI
                    </MobileNavLink>
                    <MobileNavLink href="/pages/Analyse-Job-Fit">
                      Your Analyses
                    </MobileNavLink>
                    <MobileNavLink href="/Dashboard">
                      Dashboard
                    </MobileNavLink>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className={cn(
                        "mt-4 w-full",
                        "flex items-center justify-center space-x-2",
                        "bg-red-500/90 hover:bg-red-600",
                        "text-gray-100",
                        "transition-all duration-200"
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default memo(Navbar);