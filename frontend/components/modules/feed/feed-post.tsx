"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Sparkles } from "lucide-react"

interface FeedPostProps {
  post: {
    id: number
    content: string
    author: {
      name: string
      avatar: string
    }
    attachments?: Array<{
      type: string
      url: string
    }>
    reactions: Array<{
      emoji: string
      count: number
    }>
    comments: Array<{
      author: {
        name: string
        avatar: string
      }
      content: string
      timestamp: Date
    }>
    tags: string[]
    aiSummary?: string
    timestamp: Date
  }
}

export function FeedPost({ post }: FeedPostProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [reactions, setReactions] = useState(post.reactions)
  const [comments, setComments] = useState(post.comments)

  const handleReaction = (emoji: string) => {
    const existingReaction = reactions.find((r) => r.emoji === emoji)

    if (existingReaction) {
      setReactions(reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)))
    } else {
      setReactions([...reactions, { emoji, count: 1 }])
    }
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return

    setComments([
      ...comments,
      {
        author: {
          name: "John Doe",
          avatar: "/placeholder.svg?height=32&width=32&text=JD",
        },
        content: commentText,
        timestamp: new Date(),
      },
    ])

    setCommentText("")
  }

  // Format content with line breaks
  const formattedContent = post.content.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      {i < post.content.split("\n").length - 1 && <br />}
    </span>
  ))

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
        <Avatar>
          <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
          <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(post.timestamp, { addSuffix: true })}
              </p>
            </div>

            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Post content */}
        <div className="mb-4">{formattedContent}</div>

        {/* AI Summary */}
        {post.aiSummary && (
          <div className="mb-4 rounded-md bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
              <Sparkles className="h-3 w-3" />
              AI Summary
            </div>
            <p className="text-sm">{post.aiSummary}</p>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mb-4 space-y-2">
            {post.attachments.map((attachment, i) => (
              <div key={i} className="rounded-md overflow-hidden">
                {/* TODO: Add attachment display logic here */}
              </div>
            ))}
          </div>
        )}

        {/* Reactions */}
        <div className="flex items-center gap-4 pt-3 border-t">
          <div className="flex items-center gap-2">
            {reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReaction(reaction.emoji)}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted text-sm"
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="pt-3 border-t space-y-3">
            {comments.map((comment, i) => (
              <div key={i} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="font-medium text-sm">{comment.author.name}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32&text=JD" alt="John Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button size="sm" onClick={handleAddComment}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <span>👍</span>
              <span>1</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2"
            >
              <span>💬</span>
              <span>2</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <span>🔗</span>
              <span>Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
