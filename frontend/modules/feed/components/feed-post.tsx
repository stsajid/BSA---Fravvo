"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/atoms/badge"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, ThumbsUp, Share, MoreHorizontal, Send, ImageIcon, Smile } from "lucide-react"
import { apiGateway } from "@/lib/api-gateway/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface FeedPostProps {
  post: {
    id: string
    content: string
    author: {
      id: string
      name: string
      avatar_url?: string
    }
    attachments?: Array<{
      id: string
      type: string
      url: string
      thumbnail_url?: string
    }>
    reactions: Array<{
      emoji: string
      count: number
      users: string[]
    }>
    comments_count: number
    ai_tags?: string[]
    ai_summary?: string
    created_at: string
  }
  onReaction?: (postId: string, emoji: string) => void
  onComment?: (postId: string, comment: string) => void
}

export function FeedPost({ post, onReaction, onComment }: FeedPostProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const queryClient = useQueryClient()

  // Fetch comments when expanded
  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ["post-comments", post.id],
    queryFn: () => apiGateway.feed.getComments(post.id),
    enabled: showComments,
  })

  // Add reaction mutation
  const addReactionMutation = useMutation({
    mutationFn: ({ postId, reaction }: { postId: string; reaction: string }) =>
      apiGateway.feed.reactToPost(postId, reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      apiGateway.feed.addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", post.id] })
      setCommentText("")
    },
  })

  const handleReaction = (emoji: string) => {
    addReactionMutation.mutate({ postId: post.id, reaction: emoji })
    if (onReaction) onReaction(post.id, emoji)
  }

  const handleComment = () => {
    if (!commentText.trim()) return

    addCommentMutation.mutate({ postId: post.id, content: commentText })
    if (onComment) onComment(post.id, commentText)
  }

  const formatContent = (content: string) => {
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const withLinks = content.replace(
      urlRegex,
      '<a href="$1" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // Convert line breaks to <br>
    return withLinks.replace(/\n/g, "<br />")
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={post.author.avatar_url || "/placeholder.svg?height=32&width=32"}
                alt={post.author.name}
              />
              <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Post content */}
        <div className="mb-3 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />

        {/* AI Summary (if available) */}
        {post.ai_summary && (
          <div className="mb-3 p-2 bg-blue-50 rounded-md">
            <div className="flex items-center gap-1 text-xs text-blue-700 font-medium mb-1">
              <Smile className="w-3 h-3" />
              AI Summary
            </div>
            <p className="text-sm text-blue-800">{post.ai_summary}</p>
          </div>
        )}

        {/* Tags */}
        {post.ai_tags && post.ai_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.ai_tags.map((tag) => (
              <Badge key={tag} variant="secondary" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {post.attachments.map((attachment) => (
              <div key={attachment.id} className="rounded-md overflow-hidden">
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url || "/placeholder.svg"}
                    alt="Attachment"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="bg-muted p-4 text-center">{attachment.type} attachment</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reactions */}
        {post.reactions && post.reactions.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.reactions.map((reaction) => (
              <Button
                key={reaction.emoji}
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => handleReaction(reaction.emoji)}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex-col items-stretch">
        {/* Action buttons */}
        <div className="flex border-t border-b py-2 mb-2">
          <Button variant="ghost" className="flex-1" onClick={() => handleReaction("👍")}>
            <ThumbsUp className="h-4 w-4 mr-2" />
            Like
          </Button>
          <Button variant="ghost" className="flex-1" onClick={() => setShowComments(!showComments)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" className="flex-1">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="space-y-4">
            {/* Comment input */}
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  className="flex-1 min-h-[40px] resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!commentText.trim()}
                    onClick={handleComment}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments list */}
            {loadingComments ? (
              <div className="text-center py-4">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : comments?.comments?.length > 0 ? (
              <div className="space-y-3">
                {comments.comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar_url || "/placeholder.svg?height=32&width=32"} />
                      <AvatarFallback>{comment.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-2">
                        <div className="font-medium text-sm">{comment.author.name}</div>
                        <div className="text-sm">{comment.content}</div>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <button className="hover:text-foreground">Like</button>
                        <button className="hover:text-foreground">Reply</button>
                        <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
