"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Send, Loader2 } from "lucide-react"

// Sample AI suggestions
const aiSuggestions = [
  "Summarize my tasks for today",
  "What's the status of the Website Redesign project?",
  "Generate a meeting agenda for tomorrow",
  "Help me prioritize my tasks",
]

export function AiAssistant() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")

    // Simulate AI response
    setIsLoading(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I've processed your request. Here's what I found based on your team's data and activities. Let me know if you need more specific information!",
        },
      ])
      setIsLoading(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessages((prev) => [...prev, { role: "user", content: suggestion }])

    // Simulate AI response
    setIsLoading(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I've analyzed your request and here's what I found. This is based on your team's current data and recent activities. Would you like me to provide more details?",
        },
      ])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex h-[300px] flex-col">
      <div className="flex-1 overflow-auto p-1">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div key={i} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex max-w-[80%] items-start gap-3 rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="mt-0.5 h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24&text=AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className="text-sm">{message.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-center gap-3 rounded-lg bg-muted px-4 py-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg?height=24&width=24&text=AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </div>

      {messages.length === 1 && !isLoading && (
        <div className="grid grid-cols-2 gap-2 px-1 py-2">
          {aiSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              className="justify-start text-left text-xs"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Sparkles className="mr-2 h-3 w-3 text-primary" />
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 p-1">
        <Input
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend()
            }
          }}
        />
        <Button size="icon" onClick={handleSend} disabled={!input.trim() || isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
