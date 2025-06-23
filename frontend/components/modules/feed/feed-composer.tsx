"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Users, Tag, Smile, X, Sparkles } from "lucide-react"

export function FeedComposer() {
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [aiSuggesting, setAiSuggesting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, we would upload the files to a server
      // For this demo, we'll just use placeholder images
      const newAttachments = Array.from(e.target.files).map(
        (_, i) =>
          `/placeholder.svg?height=${300 + i * 10}&width=${600 + i * 20}&text=Attachment+${attachments.length + i + 1}`,
      )
      setAttachments([...attachments, ...newAttachments])
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleAddTag = () => {
    const tag = prompt("Enter tag name:")
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAiSuggest = () => {
    setAiSuggesting(true)

    // Simulate AI suggestion
    setTimeout(() => {
      setContent(
        "Just finished implementing the new feature we discussed in yesterday's meeting. Key improvements include:\n\n- 30% faster load times\n- Simplified user flow\n- Better mobile responsiveness\n\nLet me know what you think!",
      )
      setTags(["development", "feature", "performance"])
      setAiSuggesting(false)
    }, 1500)
  }

  const handleSubmit = () => {
    // In a real app, we would submit the post to a server
    console.log({ content, attachments, tags })

    // Reset form
    setContent("")
    setAttachments([])
    setTags([])
    setExpanded(false)
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40&text=JD" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            className="min-h-[100px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setExpanded(true)}
          />

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {attachments.map((url, i) => (
                <div key={i} className="relative rounded-md overflow-hidden">
                  <img src={url || "/placeholder.svg"} alt={`Attachment ${i + 1}`} className="w-full h-auto" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => handleRemoveAttachment(i)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  #{tag}
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => handleRemoveTag(tag)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {expanded && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={handleAttachmentClick}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Photo/Video
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                />

                <Button variant="ghost" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Tag People
                </Button>

                <Button variant="ghost" size="sm" onClick={handleAddTag}>
                  <Tag className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>

                <Button variant="ghost" size="sm">
                  <Smile className="mr-2 h-4 w-4" />
                  Feeling
                </Button>

                <Button variant="ghost" size="sm" onClick={handleAiSuggest} disabled={aiSuggesting}>
                  {aiSuggesting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Suggesting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      AI Suggest
                    </>
                  )}
                </Button>
              </div>

              <Button onClick={handleSubmit} disabled={!content.trim() && attachments.length === 0}>
                Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
