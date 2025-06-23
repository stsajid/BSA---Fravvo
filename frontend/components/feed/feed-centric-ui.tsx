"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Heart,
  Share,
  MoreHorizontal,
  CheckSquare,
  FileText,
  Calendar,
  Users,
  Sparkles,
  TrendingUp,
  Filter,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface FeedItem {
  id: string
  type: "task_created" | "task_completed" | "document_shared" | "meeting_scheduled" | "comment_added" | "user_joined"
  actor: {
    name: string
    avatar?: string
    role?: string
  }
  action: string
  target?: {
    title: string
    type: string
    url?: string
  }
  content?: string
  timestamp: Date
  reactions?: {
    likes: number
    comments: number
    shares: number
  }
  aiInsight?: string
  priority?: "low" | "medium" | "high"
  workspace?: string
}

const mockFeedItems: FeedItem[] = [
  {
    id: "1",
    type: "task_completed",
    actor: { name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40", role: "Product Manager" },
    action: "completed task",
    target: { title: "Q4 Budget Review", type: "task", url: "/tasks/123" },
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    reactions: { likes: 3, comments: 1, shares: 0 },
    aiInsight: "This completion unblocks 2 dependent tasks and moves the project 15% closer to deadline",
    priority: "high",
    workspace: "Finance",
  },
  {
    id: "2",
    type: "document_shared",
    actor: { name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40", role: "Designer" },
    action: "shared document",
    target: { title: "Design System Guidelines", type: "document", url: "/docs/456" },
    content: "Updated with new component specifications and accessibility guidelines. Ready for team review!",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    reactions: { likes: 8, comments: 3, shares: 2 },
    workspace: "Design",
  },
  {
    id: "3",
    type: "meeting_scheduled",
    actor: { name: "Alex Rivera", avatar: "/placeholder.svg?height=40&width=40", role: "Engineering Lead" },
    action: "scheduled meeting",
    target: { title: "Sprint Planning", type: "meeting", url: "/calendar/789" },
    content: "Let's align on priorities for the next sprint. I've added the agenda to the meeting notes.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    reactions: { likes: 5, comments: 2, shares: 1 },
    aiInsight: "Optimal time slot based on team availability. 94% attendance probability",
    workspace: "Engineering",
  },
  {
    id: "4",
    type: "user_joined",
    actor: { name: "Emma Wilson", avatar: "/placeholder.svg?height=40&width=40", role: "Marketing Specialist" },
    action: "joined the team",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reactions: { likes: 12, comments: 5, shares: 0 },
    workspace: "Marketing",
  },
]

export function FeedCentricUI() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(mockFeedItems)
  const [filter, setFilter] = useState<string>("all")
  const [showAIInsights, setShowAIInsights] = useState(true)

  const getActionIcon = (type: string) => {
    switch (type) {
      case "task_created":
      case "task_completed":
        return CheckSquare
      case "document_shared":
        return FileText
      case "meeting_scheduled":
        return Calendar
      case "user_joined":
        return Users
      case "comment_added":
        return MessageSquare
      default:
        return MessageSquare
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case "task_completed":
        return "text-green-600 bg-green-100"
      case "task_created":
        return "text-blue-600 bg-blue-100"
      case "document_shared":
        return "text-purple-600 bg-purple-100"
      case "meeting_scheduled":
        return "text-orange-600 bg-orange-100"
      case "user_joined":
        return "text-pink-600 bg-pink-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-200"
    }
  }

  const filteredItems = feedItems.filter((item) => {
    if (filter === "all") return true
    if (filter === "tasks") return item.type.includes("task")
    if (filter === "documents") return item.type === "document_shared"
    if (filter === "meetings") return item.type === "meeting_scheduled"
    if (filter === "team") return item.type === "user_joined" || item.type === "comment_added"
    return true
  })

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-muted-foreground">Stay updated with your team's progress</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showAIInsights ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAIInsights(!showAIInsights)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Insights
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const ActionIcon = getActionIcon(item.type)
                const actionColor = getActionColor(item.type)
                const priorityColor = getPriorityColor(item.priority)

                return (
                  <Card key={item.id} className={`border-l-4 ${priorityColor} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Actor Avatar */}
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.actor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {item.actor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* Action Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{item.actor.name}</span>
                              {item.actor.role && (
                                <Badge variant="outline" className="text-xs">
                                  {item.actor.role}
                                </Badge>
                              )}
                              <span className="text-muted-foreground">{item.action}</span>
                              {item.target && (
                                <>
                                  <div className={`p-1 rounded-full ${actionColor}`}>
                                    <ActionIcon className="h-3 w-3" />
                                  </div>
                                  <span className="font-medium text-primary hover:underline cursor-pointer">
                                    {item.target.title}
                                  </span>
                                </>
                              )}
                              {item.workspace && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.workspace}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                              </span>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Content */}
                          {item.content && (
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.content}</p>
                          )}

                          {/* AI Insight */}
                          {showAIInsights && item.aiInsight && (
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">AI Insight</span>
                              </div>
                              <p className="text-sm text-purple-600">{item.aiInsight}</p>
                            </div>
                          )}

                          {/* Reactions */}
                          {item.reactions && (
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Heart className="mr-1.5 h-4 w-4" />
                                {item.reactions.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <MessageSquare className="mr-1.5 h-4 w-4" />
                                {item.reactions.comments}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Share className="mr-1.5 h-4 w-4" />
                                {item.reactions.shares}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* AI Summary Card */}
      {showAIInsights && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Daily AI Summary</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <p className="text-sm text-purple-700">Team Productivity</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <p className="text-sm text-blue-700">Tasks Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <p className="text-sm text-green-700">Goals Achieved</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Your team is performing exceptionally well today. Task completion is 20% above average, and collaboration
              metrics show strong engagement across all workspaces.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
