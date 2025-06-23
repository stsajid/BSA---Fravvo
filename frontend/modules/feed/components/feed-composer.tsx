"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Users, Tag, X } from "lucide-react"
import { apiGateway } from "@/lib/api-gateway/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@/lib/state/store"

interface FeedComposerProps {
  onPostCreated?: () => void
}

export function FeedComposer({ onPostCreated }: FeedComposerProps) {
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [mentions, setMentions] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { user } = useAppStore((state) => ({ user: state.user }))

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: { content: string; attachments?: string[]; mentions?: string[]; tags?: string[] }) =>
      apiGateway.feed.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      resetForm()
      if (onPostCreated) onPostCreated()
    },
  })

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      // Mock file upload for preview
      const newAttachments = Array.from(files).map(
        (_, index) => `/placeholder.svg?height=${300 + index * 10}&width=${500 + index * 20}`,
      )

      setAttachments([...attachments, ...newAttachments])
    } catch (error) {
      console.error("File upload error:", error)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = () => {
    if (!content.trim() && attachments.length === 0) return

    createPostMutation.mutate({
      content,
      attachments,
      mentions,
      tags,
    })
  }

  const resetForm = () => {
    setContent("")
    setAttachments([])
    setTags([])
    setMentions([])
    setIsExpanded(false)
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user?.avatar_url || "/placeholder.svg?height=40&width=40"} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[60px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
            />

            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {attachments.map((url, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden">
                    <img src={url || "/placeholder.svg"} alt={`Attachment ${index + 1}`} className="w-full h-auto" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <div key={tag} className="bg-muted text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    #{tag}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => handleRemoveTag(tag)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {isExpanded && (
        <CardFooter className="flex-col items-stretch border-t pt-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Add to your post</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleAttachmentClick} disabled={isUploading}>
                <ImageIcon className="h-5 w-5 text-green-600" />
              </Button>
              <Button variant="ghost" size="icon">
                <Users className="h-5 w-5 text-blue-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleAddTag(prompt("Enter tag name:") || "")}>
                <Tag className="h-5 w-5 text-orange-600" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </div>
          </div>

          <Button
            className="w-full mt-3"
            disabled={(!content.trim() && attachments.length === 0) || createPostMutation.isPending || isUploading}
            onClick={handleSubmit}
          >
            {createPostMutation.isPending ? "Posting..." : "Post"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
