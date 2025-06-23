"use client"

import { useState } from "react"
import { FeedComposer } from "./feed-composer"
import { FeedPost } from "./feed-post"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, RefreshCw, Sparkles } from "lucide-react"

// Sample feed data
const feedPosts = [
  {
    id: 1,
    content:
      "Just finished the new dashboard design! Check it out and let me know what you think. I've incorporated the feedback from our last meeting.",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    },
    attachments: [
      {
        type: "image",
        url: "/placeholder.svg?height=300&width=600&text=Dashboard+Preview",
      },
    ],
    reactions: [
      { emoji: "👍", count: 5 },
      { emoji: "🎉", count: 3 },
    ],
    comments: [
      {
        author: {
          name: "Michael Chen",
          avatar: "/placeholder.svg?height=32&width=32&text=MC",
        },
        content: "Looks great! I especially like the new analytics section.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    ],
    tags: ["design", "dashboard", "ui"],
    aiSummary: "New dashboard design with improved analytics section and user feedback incorporated.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    content:
      "Team meeting notes from yesterday:\n\n- Reviewed Q2 goals\n- Discussed new feature priorities\n- Set timeline for next release\n\nLet me know if you have any questions!",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
    },
    attachments: [],
    reactions: [{ emoji: "👍", count: 2 }],
    comments: [],
    tags: ["meeting", "notes", "planning"],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 3,
    content: "We're excited to announce that we've reached 10,000 users! 🎉 Thanks to everyone for their hard work.",
    author: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40&text=ED",
    },
    attachments: [
      {
        type: "image",
        url: "/placeholder.svg?height=300&width=600&text=Growth+Chart",
      },
    ],
    reactions: [
      { emoji: "🎉", count: 12 },
      { emoji: "👏", count: 8 },
    ],
    comments: [
      {
        author: {
          name: "Alex Wong",
          avatar: "/placeholder.svg?height=32&width=32&text=AW",
        },
        content: "Amazing milestone! Great job everyone!",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
    ],
    tags: ["milestone", "growth", "celebration"],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
]

export function FeedContainer() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Filter posts based on selected tags and search query
  const filteredPosts = feedPosts.filter((post) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => post.tags.includes(tag))

    const matchesSearch =
      !searchQuery ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTags && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10 md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Summary
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Popular tags:</span>
          {["design", "meeting", "milestone", "planning", "ui", "growth"].map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagSelect(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Composer */}
      <FeedComposer />

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}

        {filteredPosts.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No posts found matching your filters.</p>
            {(selectedTags.length > 0 || searchQuery) && (
              <Button
                variant="link"
                onClick={() => {
                  setSelectedTags([])
                  setSearchQuery("")
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
