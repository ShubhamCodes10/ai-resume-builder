'use client';

import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BrainIcon, FileText, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

function Navbar() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0f1833]/95 backdrop-blur-sm border-b border-blue-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className="cursor-pointer flex items-center space-x-2 group"
          >
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 group-hover:to-purple-500 transition-all duration-300">
              BuildMyCV
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  href="/pages/Ask-AI"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  <BrainIcon className="h-4 w-4" />
                  <span>Ask AI</span>
                </Link>
                <Link
                  href="/pages/Analyse-Job-Fit"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  <FileText className="h-4 w-4" />
                  <span>Your Analyses</span>
                </Link>
                <Link
                  href="/Dashboard"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="flex items-center space-x-2 bg-red-500 text-gray-100 hover:text-red-100 hover:bg-red-800"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push('/Dashboard')}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30 px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button - Only show if user is logged in */}
          {user && (
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-blue-400"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Only render if user is logged in */}
      {user && (
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/pages/Ask-AI"
              className="block px-3 py-2 text-gray-300 hover:text-blue-400"
            >
              Ask AI
            </Link>
            <Link
              href="/pages/Analyse-Job-Fit"
              className="block px-3 py-2 text-gray-300 hover:text-blue-400"
            >
              Your Analyses
            </Link>
            <Link
              href="/Dashboard"
              className="block px-3 py-2 text-gray-300 hover:text-blue-400"
            >
              Dashboard
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full mt-2 flex items-center justify-center space-x-2 bg-red-500 text-gray-100 hover:text-red-100 hover:bg-red-800"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;