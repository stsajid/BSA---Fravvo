"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, MessageSquare, CheckSquare, FileText, Calendar, Brain, Plus, Sparkles } from "lucide-react"

const commands = [
  {
    group: "Navigation",
    items: [
      { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, action: "/dashboard" },
      { id: "feed", label: "Go to Feed", icon: MessageSquare, action: "/feed" },
      { id: "chat", label: "Go to Chat", icon: MessageSquare, action: "/chat" },
      { id: "tasks", label: "Go to Tasks", icon: CheckSquare, action: "/tasks" },
      { id: "documents", label: "Go to Documents", icon: FileText, action: "/documents" },
      { id: "ai", label: "Go to Fravvo AI", icon: Brain, action: "/ai", badge: "AI" },
      { id: "schedule", label: "Go to Schedule", icon: Calendar, action: "/schedule" },
    ],
  },
  {
    group: "Create",
    items: [
      { id: "create-task", label: "Create Task", icon: Plus, action: "create-task" },
      { id: "create-doc", label: "Create Document", icon: Plus, action: "create-document" },
      { id: "create-meeting", label: "Schedule Meeting", icon: Plus, action: "create-meeting" },
      { id: "create-form", label: "Create Form", icon: Plus, action: "create-form" },
    ],
  },
  {
    group: "AI Actions",
    items: [
      { id: "ai-summarize", label: "Summarize current page", icon: Sparkles, action: "ai-summarize", badge: "AI" },
      { id: "ai-task", label: "Create task from selection", icon: Sparkles, action: "ai-task", badge: "AI" },
      { id: "ai-meeting", label: "Generate meeting notes", icon: Sparkles, action: "ai-meeting", badge: "AI" },
    ],
  },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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

  const handleSelect = (action: string) => {
    setOpen(false)

    if (action.startsWith("/")) {
      router.push(action)
    } else {
      // Handle other actions
      console.log("Executing action:", action)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {commands.map((group) => (
          <div key={group.group}>
            <CommandGroup heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item.action)}
                  className="flex items-center gap-3"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
