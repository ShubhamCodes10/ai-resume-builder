import React from 'react'
import { Facebook, Twitter, Linkedin, Link2Icon, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"

function Footer() {
  return (
    <footer className="bg-[#101a38] text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">BuildMyCV</h2>
            <p className="mt-2 text-sm text-gray-400">
              Simplify your job search with professional resumes in just a few clicks.
            </p>
          </div>
  
          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
            <a href="/pages/Ask-AI" className="text-sm text-gray-300 hover:text-white transition-colors">
              Chat with AI
            </a>
            <a href="/pages/Analyse-Job-Fit" className="text-sm text-gray-300 hover:text-white transition-colors">
              Your Analysis
            </a>
            <a href="/pages/Contact-Me" className="text-sm text-gray-300 hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
  
          {/* Social Media Links and Github Star Button */}
          <div className="flex items-center space-x-6">
            <a
              href="https://shubGupta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Personal Website"
            >
              <Link2Icon className="w-6 h-6" />
            </a>
            <a
              href="https://x.com/i_m_shubham45"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 hover:text-white text-white border-blue-500"
            >
              <a
                href="https://github.com/shubGupta10/AI-resume-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="w-4 h-4" />
                <span>Star on GitHub</span>
              </a>
            </Button>
          </div>
        </div>
  
        {/* Product Hunt Badge */}
        <div className="mt-8 text-center">
          <a href="https://www.producthunt.com/posts/buildmycv?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-buildmycv" target="_blank">
            <img 
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=765974&theme=light" 
              alt="BuildMyCv - BuildMyCV: AI resume builder for ATS-friendly resumes & tips | Product Hunt" 
              style={{ width: '250px', height: '54px' }} 
              width="250" 
              height="54"
            />
          </a>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BuildMyCV. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
