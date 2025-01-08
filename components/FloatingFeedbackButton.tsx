'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { MessageSquare } from 'lucide-react'

export default function FloatingFeedbackButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/pages/Feedback')
  }

  return (
    <Button
      className="fixed bottom-8 right-8 rounded-full w-16 h-16 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
      onClick={handleClick}
    >
      <MessageSquare className="w-8 h-8 text-white" />
      <span className="sr-only">Feedback</span>
    </Button>
  )
}

