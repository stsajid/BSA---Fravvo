"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, FileText, CheckSquare, Calendar, Users, Plus, Edit } from "lucide-react"

// Sample activity data
const activities = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32&text=SJ",
    },
    action: "commented",
    target: "Design Review",
    targetType: "task",
    time: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32&text=MC",
    },
    action: "completed",
    target: "Update Homepage",
    targetType: "task",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 3,
    user: {
      name: "Alex Wong",
      avatar: "/placeholder.svg?height=32&width=32&text=AW",
    },
    action: "created",
    target: "Q2 Marketing Plan",
    targetType: "document",
    time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 4,
    user: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32&text=ED",
    },
    action: "scheduled",
    target: "Team Standup",
    targetType: "meeting",
    time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 5,
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32&text=JD",
    },
    action: "added",
    target: "Lisa Wang",
    targetType: "user",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
]

const getActionIcon = (action: string, targetType: string) => {
  if (action === "commented") return MessageSquare
  if (action === "created" && targetType === "document") return FileText
  if (action === "completed" || (action === "created" && targetType === "task")) return CheckSquare
  if (action === "scheduled") return Calendar
  if (action === "added" && targetType === "user") return Users
  if (action === "created") return Plus
  return Edit
}

const getActionColor = (action: string) => {
  if (action === "commented") return "bg-blue-500"
  if (action === "completed") return "bg-green-500"
  if (action === "created") return "bg-purple-500"
  if (action === "scheduled") return "bg-yellow-500"
  if (action === "added") return "bg-indigo-500"
  return "bg-gray-500"
}

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const ActionIcon = getActionIcon(activity.action, activity.targetType)
        const actionColor = getActionColor(activity.action)

        return (
          <div key={activity.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
              <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.user.name}</span>
                <Badge variant="outline" className="px-1 py-0 text-xs">
                  <div className={`mr-1 h-1.5 w-1.5 rounded-full ${actionColor}`} />
                  {activity.action}
                </Badge>
              </div>

              <p className="text-sm">
                {activity.action} {activity.targetType} <span className="font-medium">{activity.target}</span>
              </p>

              <p className="text-xs text-muted-foreground">{formatDistanceToNow(activity.time, { addSuffix: true })}</p>
            </div>

            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${actionColor}/10`}>
              <ActionIcon className={`h-4 w-4 ${actionColor.replace("bg-", "text-")}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
