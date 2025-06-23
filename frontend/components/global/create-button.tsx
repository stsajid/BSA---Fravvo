"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, CheckSquare, MessageSquare, Calendar, Users, Workflow, Sparkles, Zap } from "lucide-react"

const createOptions = [
  {
    id: "task",
    label: "Task",
    description: "Create a new task with AI suggestions",
    icon: CheckSquare,
    aiEnabled: true,
    shortcut: "⌘T",
  },
  {
    id: "document",
    label: "Document",
    description: "Start a new document with AI assistance",
    icon: FileText,
    aiEnabled: true,
    shortcut: "⌘D",
  },
  {
    id: "meeting",
    label: "Meeting",
    description: "Schedule a meeting with smart suggestions",
    icon: Calendar,
    aiEnabled: true,
    shortcut: "⌘M",
  },
  {
    id: "form",
    label: "Form",
    description: "Build a form with drag & drop",
    icon: Workflow,
    aiEnabled: true,
    shortcut: "⌘F",
  },
  {
    id: "chat",
    label: "Chat Channel",
    description: "Create a new chat channel",
    icon: MessageSquare,
    shortcut: "⌘C",
  },
  {
    id: "team",
    label: "Team",
    description: "Create a new team workspace",
    icon: Users,
    shortcut: "⌘G",
  },
]

export function GlobalCreateButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleCreate = (type: string) => {
    setSelectedType(type)
    setIsOpen(true)
  }

  const handleSubmit = () => {
    console.log("Creating:", selectedType, { title, description })
    setTitle("")
    setDescription("")
    setSelectedType(null)
    setIsOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-1.5 h-4 w-4" />
            Create
            <Sparkles className="ml-1.5 h-3 w-3 text-yellow-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            Create with AI
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {createOptions.map((option) => (
            <DropdownMenuItem key={option.id} className="cursor-pointer p-3" onClick={() => handleCreate(option.id)}>
              <div className="flex items-start gap-3 w-full">
                <div className="p-1.5 rounded-md bg-gray-100">
                  <option.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.label}</span>
                    {option.aiEnabled && (
                      <Badge variant="secondary" className="text-xs">
                        AI
                      </Badge>
                    )}
                    {option.shortcut && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        {option.shortcut}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedType && (
                <>
                  <div className="p-1.5 rounded-md bg-gray-100">
                    {(() => {
                      const option = createOptions.find((opt) => opt.id === selectedType)
                      const IconComponent = option?.icon
                      return IconComponent ? <IconComponent className="h-4 w-4" /> : null
                    })()}
                  </div>
                  Create {createOptions.find((opt) => opt.id === selectedType)?.label}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {createOptions.find((opt) => opt.id === selectedType)?.aiEnabled && (
                <span className="flex items-center gap-1 text-purple-600">
                  <Sparkles className="h-3 w-3" />
                  AI will help optimize your content
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full" />
            </div>

            <div>
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!title.trim()}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
