"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Check, MessageSquare, CheckSquare, Calendar, Sparkles } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: "mention" | "task" | "meeting" | "comment" | "system"
  title: string
  message: string
  timestamp: Date
  read: boolean
  grouped?: boolean
  groupCount?: number
  actors?: Array<{
    name: string
    avatar?: string
  }>
  aiSummary?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "mention",
    title: "Multiple mentions",
    message: "You were mentioned in 3 conversations",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    grouped: true,
    groupCount: 3,
    actors: [
      { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Alex Rivera", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    aiSummary: "Team discussing Q4 planning and your input on budget allocation",
  },
  {
    id: "2",
    type: "task",
    title: "Task assignments",
    message: "5 new tasks assigned to you",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    grouped: true,
    groupCount: 5,
    aiSummary: "High priority: 2 urgent tasks due today, 3 can be scheduled for next week",
  },
  {
    id: "3",
    type: "meeting",
    title: "Meeting starting soon",
    message: "Q4 Planning Review starts in 15 minutes",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    aiSummary: "Agenda: Budget review, timeline discussion, resource allocation",
  },
]

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mention":
        return MessageSquare
      case "task":
        return CheckSquare
      case "meeting":
        return Calendar
      case "comment":
        return MessageSquare
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "mention":
        return "text-blue-500"
      case "task":
        return "text-green-500"
      case "meeting":
        return "text-purple-500"
      case "comment":
        return "text-orange-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const iconColor = getNotificationColor(notification.type)

                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-1.5 rounded-full bg-muted ${iconColor}`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>

                            {/* AI Summary */}
                            {notification.aiSummary && (
                              <div className="mt-2 p-2 bg-purple-50 rounded-md border border-purple-100">
                                <div className="flex items-center gap-1 mb-1">
                                  <Sparkles className="h-3 w-3 text-purple-500" />
                                  <span className="text-xs font-medium text-purple-700">AI Summary</span>
                                </div>
                                <p className="text-xs text-purple-600">{notification.aiSummary}</p>
                              </div>
                            )}

                            {/* Grouped actors */}
                            {notification.grouped && notification.actors && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex -space-x-1">
                                  {notification.actors.slice(0, 3).map((actor, index) => (
                                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                      <AvatarImage src={actor.avatar || "/placeholder.svg"} />
                                      <AvatarFallback className="text-xs">
                                        {actor.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                                {notification.groupCount && notification.groupCount > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{notification.groupCount - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-2">
                            {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
