"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Brain, Sparkles, MessageSquare, CheckSquare, FileText, Calendar, BarChart3, Send, Wand2 } from "lucide-react"

interface ContextSuggestion {
  id: string
  text: string
  category: string
  icon: React.ComponentType<{ className?: string }>
}

const contextSuggestions: Record<string, ContextSuggestion[]> = {
  "/dashboard": [
    { id: "1", text: "Summarize today's key metrics", category: "Analysis", icon: BarChart3 },
    { id: "2", text: "What tasks need my attention?", category: "Tasks", icon: CheckSquare },
    { id: "3", text: "Generate weekly team report", category: "Reports", icon: FileText },
  ],
  "/feed": [
    { id: "1", text: "Summarize today's team updates", category: "Summary", icon: MessageSquare },
    { id: "2", text: "Draft an announcement", category: "Create", icon: Wand2 },
    { id: "3", text: "Find trending topics", category: "Analysis", icon: BarChart3 },
  ],
  "/tasks": [
    { id: "1", text: "What are my overdue tasks?", category: "Analysis", icon: CheckSquare },
    { id: "2", text: "Create sprint planning summary", category: "Create", icon: FileText },
    { id: "3", text: "Assign tasks by workload", category: "Action", icon: CheckSquare },
  ],
  "/chat": [
    { id: "1", text: "Summarize this conversation", category: "Summary", icon: MessageSquare },
    { id: "2", text: "Draft a professional response", category: "Create", icon: Wand2 },
    { id: "3", text: "Extract action items", category: "Analysis", icon: CheckSquare },
  ],
  "/documents": [
    { id: "1", text: "Summarize this document", category: "Summary", icon: FileText },
    { id: "2", text: "Convert to presentation", category: "Transform", icon: Wand2 },
    { id: "3", text: "Extract key insights", category: "Analysis", icon: BarChart3 },
  ],
  "/schedule": [
    { id: "1", text: "Create meeting agenda", category: "Create", icon: Calendar },
    { id: "2", text: "Summarize meeting notes", category: "Summary", icon: FileText },
    { id: "3", text: "Schedule follow-ups", category: "Action", icon: Calendar },
  ],
}

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  const currentSuggestions = contextSuggestions[pathname] || contextSuggestions["/dashboard"]

  // Animated pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const handleSuggestionClick = (suggestion: ContextSuggestion) => {
    setPrompt(suggestion.text)
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setResponse(
        `AI Response to: "${prompt}"\n\nThis is a contextual response based on your current page and request. The AI would analyze your data and provide relevant insights or actions.`,
      )
      setIsLoading(false)
    }, 2000)
  }

  const getPageContext = () => {
    const contexts: Record<string, { title: string; icon: any; color: string }> = {
      "/dashboard": { title: "Dashboard Assistant", icon: BarChart3, color: "text-blue-500" },
      "/feed": { title: "Feed Assistant", icon: MessageSquare, color: "text-green-500" },
      "/tasks": { title: "Task Assistant", icon: CheckSquare, color: "text-orange-500" },
      "/chat": { title: "Chat Assistant", icon: MessageSquare, color: "text-purple-500" },
      "/documents": { title: "Document Assistant", icon: FileText, color: "text-indigo-500" },
      "/schedule": { title: "Meeting Assistant", icon: Calendar, color: "text-pink-500" },
    }

    return contexts[pathname] || contexts["/dashboard"]
  }

  const context = getPageContext()
  const IconComponent = context.icon

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className={`h-12 w-12 rounded-full shadow-lg transition-all duration-300 ${
              isAnimating ? "scale-110 shadow-xl" : ""
            } bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700`}
          >
            <Brain className="h-6 w-6 text-white" />
            {isAnimating && <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />}
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-96 p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="p-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${context.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <SheetTitle className="text-lg">{context.title}</SheetTitle>
                    <SheetDescription>AI assistant for your current screen</SheetDescription>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 flex flex-col p-6">
              {/* Ask Me Anything Bar */}
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Ask Me Anything
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="What can I help you with?"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={handleSubmit} disabled={!prompt.trim() || isLoading}>
                      {isLoading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Response */}
              {response && (
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-indigo-500" />
                      AI Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{response}</div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        Convert to Task
                      </Button>
                      <Button size="sm" variant="outline">
                        Share in Feed
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Context Suggestions */}
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Suggested Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {currentSuggestions.map((suggestion) => (
                        <Button
                          key={suggestion.id}
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 text-left"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <suggestion.icon className="h-4 w-4 mt-0.5 text-gray-500" />
                            <div className="space-y-1 flex-1">
                              <span className="text-sm">{suggestion.text}</span>
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.category}
                              </Badge>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <div className="mt-4 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Brain className="mr-2 h-4 w-4" />
                  Open Full AI Workspace
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View AI History
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
