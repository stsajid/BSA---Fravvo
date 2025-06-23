"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem as CommandItemComponent,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Calendar,
  CheckSquare,
  MessageSquare,
  Settings,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react"
import { useAI } from "@/hooks/use-ai"

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  category: string
  keywords?: string[]
  aiSuggested?: boolean
}

export function CommandBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { generateSuggestions, isLoading } = useAI()

  // Global keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "dashboard",
      title: "Go to Dashboard",
      icon: Search,
      action: () => router.push("/dashboard"),
      category: "Navigation",
    },
    {
      id: "tasks",
      title: "Go to Tasks",
      icon: CheckSquare,
      action: () => router.push("/tasks"),
      category: "Navigation",
    },
    {
      id: "chat",
      title: "Go to Chat",
      icon: MessageSquare,
      action: () => router.push("/chat"),
      category: "Navigation",
    },
    {
      id: "calendar",
      title: "Go to Calendar",
      icon: Calendar,
      action: () => router.push("/calendar"),
      category: "Navigation",
    },

    // Quick Actions
    {
      id: "new-task",
      title: "Create New Task",
      description: "Create a task with AI assistance",
      icon: CheckSquare,
      action: () => console.log("Create task"),
      category: "Create",
      aiSuggested: true,
    },
    {
      id: "new-doc",
      title: "Create Document",
      description: "Start a new document",
      icon: FileText,
      action: () => console.log("Create document"),
      category: "Create",
    },
    {
      id: "schedule-meeting",
      title: "Schedule Meeting",
      description: "Book a meeting with AI scheduling",
      icon: Calendar,
      action: () => console.log("Schedule meeting"),
      category: "Create",
      aiSuggested: true,
    },

    // AI Actions
    {
      id: "ai-summary",
      title: "Generate AI Summary",
      description: "Summarize recent activity",
      icon: Sparkles,
      action: () => console.log("AI summary"),
      category: "AI",
      aiSuggested: true,
    },
    {
      id: "ai-insights",
      title: "Get AI Insights",
      description: "Analyze team productivity",
      icon: Zap,
      action: () => console.log("AI insights"),
      category: "AI",
      aiSuggested: true,
    },

    // Settings
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      action: () => router.push("/settings"),
      category: "Settings",
    },
  ]

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description?.toLowerCase().includes(query.toLowerCase()) ||
      command.keywords?.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())),
  )

  const groupedCommands = filteredCommands.reduce(
    (acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = []
      }
      acc[command.category].push(command)
      return acc
    },
    {} as Record<string, CommandItem[]>,
  )

  const handleSelect = (command: CommandItem) => {
    setOpen(false)
    setQuery("")
    command.action()
  }

  return (
    <>
      {/* Trigger button */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>Search or run a command...</span>
        <Badge variant="outline" className="ml-auto">
          ⌘K
        </Badge>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p>No results found.</p>
              {query && (
                <div className="flex items-center gap-1 text-sm text-purple-600">
                  <Sparkles className="h-4 w-4" />
                  <span>Try AI search suggestions</span>
                </div>
              )}
            </div>
          </CommandEmpty>

          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category}>
              <CommandGroup heading={category}>
                {items.map((command) => (
                  <CommandItemComponent
                    key={command.id}
                    onSelect={() => handleSelect(command)}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-1.5 rounded-md bg-muted">
                        <command.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{command.title}</span>
                          {command.aiSuggested && (
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        {command.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{command.description}</p>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItemComponent>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </div>
          ))}

          {/* AI Suggestions */}
          {query && (
            <CommandGroup heading="AI Suggestions">
              <CommandItemComponent className="flex items-center gap-3 px-3 py-2">
                <div className="p-1.5 rounded-md bg-purple-100">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium">Ask AI about "{query}"</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Get intelligent suggestions and answers</p>
                </div>
              </CommandItemComponent>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
