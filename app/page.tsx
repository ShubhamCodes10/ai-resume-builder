'use client';

import { Button } from '@/components/ui/button';
import { Brain, FileChartLine, FileUser, Layers2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1833] to-black text-white">
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <CTAsection />
    </div>
  );
}

function HeroSection() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center space-y-8">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
        Welcome to BuildMyCv
      </h1>
      <div className="space-y-4 max-w-2xl">
        <p className="text-2xl md:text-3xl font-medium">
          Stop Commenting <span className="text-white bg-red-800 rounded-md p-1 ">Interested</span> on LinkedIn posts
        </p>
        <p className="text-3xl text-gray-300">Get your ATS-friendly resume for free</p>
      </div>
      <Button 
        onClick={() => router.push('/Dashboard')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
      >
        Get Started <ArrowRight className="ml-2" />
      </Button>
    </div>
  );
}

function AboutSection() {
  const router = useRouter();
  return (
    <div className="bg-[#0f1833]/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-5xl mx-auto">
          <div className="space-y-6 lg:pr-8">
            <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              BuildMyCv - An AI Resume Builder
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg lg:text-xl leading-relaxed">
                Create professional, AI-generated resumes and analyze them based on job descriptions.
                Our platform helps you stand out in the competitive job market.
              </p>
              <p className="text-base lg:text-lg">
                Ready to transform your career? Click{' '}
                <button 
                  onClick={() => router.push('/Dashboard')}
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-4 font-medium"
                >
                  here
                </button>{' '}
                to build your future
              </p>
            </div>
            <div className="hidden lg:block">
              <Button
                onClick={() => router.push('/Dashboard')}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30 px-6 py-2 text-sm rounded-full transition-all duration-300 hover:scale-105"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0f1833] p-2 rounded-lg">
              <Image 
                src="/homeImage.png"
                width={600}
                height={400}
                alt="Resume Builder Interface"
                className="rounded-md shadow-lg w-full object-cover"
                priority
                quality={90}
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-[#0f1833] via-transparent to-transparent opacity-20"></div>
            </div>
          </div>
          <div className="lg:hidden text-center">
            <Button
              onClick={() => router.push('/Dashboard')}
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-400/30 px-6 py-2 text-sm rounded-full transition-all duration-300 hover:scale-105"
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureSection() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h2 className="text-5xl font-bold text-center mb-16">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: FileUser, title: 'ATS-friendly Resume', description: 'Optimized for applicant tracking systems' },
          { icon: Brain, title: 'AI Resume Enhancer', description: 'Smart suggestions to improve your resume' },
          { icon: Brain, title: 'Ask AI', description: 'Chat with AI, know insight about your resume' },
          { icon: FileChartLine, title: 'Analyse Job Fit', description: 'Match your resume with job requirements' },
          // { icon: Layers2, title: 'Interactive UI', description: 'User-friendly interface for easy editing' }
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-[#0f1833]/30 p-8 rounded-xl backdrop-blur-sm hover:bg-[#0f1833]/50 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-600/10 rounded-full group-hover:bg-blue-600/20 transition-colors">
                <feature.icon size={32} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTAsection() {
  const router = useRouter();
  return (
    <div className="bg-[#0f1833]/50 py-24">
      <div className="container mx-auto px-4 text-center space-y-8">
        <h2 className="text-4xl font-bold">Ready to Build Your Future?</h2>
        <p className="text-xl text-gray-300">Create your ATS-friendly resume today</p>
        <Button
          onClick={() => router.push('/Dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default Home;