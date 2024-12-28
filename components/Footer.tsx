import React from 'react'
import { Facebook, Twitter, Linkedin } from 'lucide-react'

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
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#templates" className="text-sm text-gray-300 hover:text-white transition-colors">
              Templates
            </a>
            <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-sm text-gray-300 hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
  
          {/* Social Media Links */}
          <div className="flex space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
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

