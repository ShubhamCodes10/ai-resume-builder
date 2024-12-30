'use client'

import { useRef, useState } from "react"
import { Send, Loader2, Bot, User, ArrowDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'ai'
  content: string | StructuredResponse
  timestamp: string
}

interface StructuredResponse {
  summary: string
  sections: Section[]
}

interface Section {
  title: string
  content: string[]
}

const WELCOME_MESSAGE: Message = {
  role: 'ai',
  content: {
    summary: "👋 Welcome to your AI Job Analysis Assistant!",
    sections: [{
      title: "How I can help you:",
      content: [
        "Get personalized suggestions for improving your resume's impact",
        "Ask specific questions about job requirements and your qualifications",
        "Receive guidance on highlighting your skills and experiences effectively",
        "Discover areas where you can strengthen your professional profile",
        "Atleast have one previous resume scan to get started"
      ]
    }]
  },
  timestamp: new Date().toLocaleTimeString()
}

const SUGGESTED_PROMPTS = [
  "What are the key areas I should improve in my resume?",
  "What skills should I highlight for my role?",
  "How can I make my work experience more impactful?",
  "What certifications would benefit my career path?"
]

const structureAIResponse = (response: string): StructuredResponse => {
  const sections = response.split(/\d+\./).filter(section => section.trim() !== '')
  const structuredSections: Section[] = sections.map(section => {
    const [title, ...content] = section.split('\n')
    const structuredContent = content
      .filter(item => item.trim() !== '')
      .map(item => item.trim().replace(/^\*+|\*+$/g, ''))

    return {
      title: title.trim(),
      content: structuredContent
    }
  })

  return {
    summary: "Your resume analysis is complete. Here are the key areas for improvement:",
    sections: structuredSections
  }
}

export default function App() {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  const handleSuggestedPrompt = (suggPrompt: string) => {
    setPrompt(suggPrompt)
  }

  const handleAskQuestion = async () => {
    if (!prompt.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setPrompt("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat-with-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        throw new Error("Failed to fetch response.")
      }

      const data = await res.json()
      console.log(data);
      
      const aiResponse = data.answer.kwargs?.content || "No valid response found."
      const structuredResponse = structureAIResponse(aiResponse)
      const aiMessage: Message = {
        role: 'ai',
        content: structuredResponse,
        timestamp: new Date().toLocaleTimeString()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        role: 'ai',
        content: "Something went wrong. Please try again.",
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(scrollToBottom, 100)
    }
  }

  const MessageContent = ({ content }: { content: string | StructuredResponse }) => {
    if (typeof content === 'string') {
      return <p>{content}</p>
    }

    return (
      <div className="space-y-4">
        <p className="font-medium text-white">{content.summary}</p>
        <ol className="space-y-4 list-decimal list-inside">
          {content.sections.map((section, index) => (
            <li key={index} className="text-white">
              <span className="font-medium">{section.title}</span>
              <ul className="pl-6 mt-2 space-y-2 list-disc list-inside">
                {section.content.map((item, i) => (
                  <li key={i} className="text-white">{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="max-w-3xl mx-auto flex justify-center items-center gap-2">
          <Bot className="w-6 h-6 text-gray-400" />
          <h1 className="text-xl font-semibold text-white">AI Job Analysis Assistant</h1>
        </div>
      </header>

      <div className="flex-grow overflow-hidden relative">
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-full px-4 py-6"
          onScroll={handleScroll}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-2 mt-4"
              >
                {SUGGESTED_PROMPTS.map((suggPrompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-gray-900 border-gray-700 hover:bg-gray-300"
                    onClick={() => handleSuggestedPrompt(suggPrompt)}
                  >
                    {suggPrompt}
                  </Button>
                ))}
              </motion.div>
            )}
            
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    "flex gap-3 max-w-[80%]",
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}>
                    <Avatar className="w-8 h-8">
                      {message.role === 'user' ? (
                        <>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/robot-avatar.png" />
                          <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    <div className={cn(
                      "rounded-lg p-4",
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 border border-gray-700 text-white'
                    )}>
                      <MessageContent content={message.content} />
                      <div className={cn(
                        "text-xs mt-3 opacity-70",
                        message.role === 'user' ? 'text-right' : 'text-left'
                      )}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/robot-avatar.png" />
                    <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-400">Cooking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {showScrollButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 rounded-full bg-gray-800/90 border-gray-700 hover:bg-gray-700"
            onClick={scrollToBottom}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              className="flex-grow min-h-[2.5rem] max-h-32 bg-gray-900 border-gray-700 text-white resize-none"
              placeholder="Ask about your job analysis..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAskQuestion()
                }
              }}
            />
            <Button
              onClick={handleAskQuestion}
              disabled={isLoading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}