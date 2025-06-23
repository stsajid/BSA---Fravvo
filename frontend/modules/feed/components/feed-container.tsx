"use client"

import { useState } from "react"
import { FeedComposer } from "./feed-composer"
import { FeedPost } from "./feed-post"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/atoms/badge"
import { useQuery } from "@tanstack/react-query"
import { apiGateway } from "@/lib/api-gateway/client"
import { Filter, RefreshCw } from "lucide-react"

interface FeedContainerProps {
  initialPosts?: any[]
}

export function FeedContainer({ initialPosts = [] }: FeedContainerProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [postType, setPostType] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["feed", selectedTags, postType],
    queryFn: () =>
      apiGateway.feed.getPosts({
        tags: selectedTags,
        type: postType || undefined,
        limit: 20,
      }),
    initialData: initialPosts.length > 0 ? { posts: initialPosts, total: initialPosts.length } : undefined,
  })

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleTypeSelect = (type: string | null) => {
    setPostType(type === postType ? null : type)
  }

  const popularTags = ["design", "meeting", "milestone", "announcement", "question"]
  const postTypes = ["update", "announcement", "question", "event"]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Team Feed</h2>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Filters
          </Button>

          {postTypes.map((type) => (
            <Badge
              key={type}
              variant={postType === type ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTypeSelect(type)}
            >
              {type}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Popular tags:</span>
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagSelect(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Composer */}
      <FeedComposer onPostCreated={() => refetch()} />

      {/* Posts */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading posts...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load posts</p>
          <Button variant="outline" className="mt-2" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : data?.posts?.length > 0 ? (
        <div className="space-y-6">
          {data.posts.map((post: any) => (
            <FeedPost key={post.id} post={post} />
          ))}

          {data.total > data.posts.length && (
            <Button variant="outline" className="w-full">
              Load More
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No posts found</p>
          {(selectedTags.length > 0 || postType) && (
            <Button
              variant="link"
              onClick={() => {
                setSelectedTags([])
                setPostType(null)
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
