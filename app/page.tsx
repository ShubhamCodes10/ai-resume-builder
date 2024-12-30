'use client';

import { Button } from '@/components/ui/button';
import { Brain, FileLineChartIcon as FileChartLine, FileIcon as FileUser, MessageSquare, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import jobfitpart1 from '@/public/jobfitpart1.png';
import jobfitpart2 from '@/public/jobfitpart2.png';
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";


function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1833] to-black text-white">
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <AIAnalysisSection />
      <ChatbotSection />
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
          AI-Powered ATS Resume Builder
        </p>
        <p className="text-xl text-gray-300">Create, Analyze, and Perfect Your Resume with AI</p>
      </div>
      <Button 
        onClick={() => router.push('/Dashboard')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
      >
        Build Your Resume <ArrowRight className="ml-2" />
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
              BuildMyCv - AI-Powered Resume Mastery
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg lg:text-xl leading-relaxed">
                Create professional, ATS-friendly resumes, analyze them against job descriptions, and perfect your application with our AI-powered chatbot.
              </p>
              <p className="text-base lg:text-lg">
                Ready to stand out in the job market? Click{' '}
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
                Explore Features <ArrowRight className="ml-2 h-4 w-4" />
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
                alt="AI Resume Builder Interface"
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
              Explore Features <ArrowRight className="ml-2 h-4 w-4" />
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
          { icon: FileUser, title: 'ATS-friendly Resume', description: 'Create resumes optimized for applicant tracking systems' },
          { icon: Brain, title: 'AI Resume Enhancer', description: 'Get smart suggestions to improve your resume' },
          { icon: MessageSquare, title: 'AI Chatbot Assistant', description: 'Chat with AI to perfect your resume' },
          { icon: FileChartLine, title: 'Job Fit Analysis', description: 'Match your resume with job requirements' },
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

function AIAnalysisSection() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div className="bg-[#0f1833]/30 py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={cn("space-y-6 transition-all duration-1000 ease-in-out", 
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <h2 className="text-4xl font-bold">AI-Powered Job Fit Analysis</h2>
            <p className="text-xl text-gray-300">
              Our advanced AI analyzes your resume against job descriptions to ensure the perfect fit.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <ArrowRight className="mr-2 text-blue-400" /> Job Fit Score
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 text-blue-400" /> Skills Assesment
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 text-blue-400" /> Areas of Improvement
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 text-blue-400" /> Recomendation where you can improve
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 text-blue-400" /> Resume Confidence Meter
              </li>
            </ul>
          </div>
          <div className={cn("relative group transition-all duration-1000 ease-in-out", 
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0f1833] p-2 rounded-lg">
              <Carousel className="w-full max-w-2xl mx-auto">
                <CarouselContent>
                  {['/jobfitAnalysis-part1.png', '/jobfitAnalysis-part2.png'].map((src, index) => (
                    <CarouselItem key={index}>
                      <Card className="border-0 bg-transparent">
                        <CardContent className="flex items-center justify-center p-0">
                          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
                            <Image 
                              src={src}
                              alt={`Job Fit Analysis Part ${index + 1}`}
                              fill
                              className="object-contain transition-opacity duration-300 ease-in-out"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute text-black left-4 top-1/2 transform -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 text-black transform -translate-y-1/2" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function ChatbotSection() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0f1833] p-2 rounded-lg">
              <Image 
                src="/ChatBot.png"
                width={600}
                height={400}
                alt="AI Chatbot Interface"
                className="rounded-md shadow-lg w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl font-bold">AI Chatbot Assistant</h2>
            <p className="text-xl text-gray-300">
              Interact with our AI-powered chatbot to get personalized advice and improve your resume.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <ArrowRight className="mr-2 text-blue-400" /> Real-time resume feedback
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 text-blue-400" /> Advice on resume improvement
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 text-blue-400" /> Resume optimization tips
              </li>
            </ul>
          </div>
        </div>
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
        <p className="text-xl text-gray-300">Create your AI-powered, ATS-friendly resume today</p>
        <Button
          onClick={() => router.push('/Dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
        >
          Get Started Now <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default Home;

