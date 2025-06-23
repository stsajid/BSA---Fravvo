"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserAvatar } from "@/components/molecules/user-avatar"
import { Badge } from "@/components/atoms/badge"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Plus, Edit, MessageSquare, Users, FileText, Calendar } from "lucide-react"

interface Activity {
  id: string
  user: {
    name: string
    email: string
    avatar_url?: string
  }
  action: string
  entity_type: string
  entity_id: string
  metadata: Record<string, any>
  created_at: string
}

interface ActivityFeedProps {
  activities: Activity[]
  organizationId: string
}

const actionIcons = {
  created: Plus,
  updated: Edit,
  completed: CheckCircle,
  commented: MessageSquare,
  assigned: Users,
  uploaded: FileText,
  scheduled: Calendar,
}

const actionColors = {
  created: "success",
  updated: "info",
  completed: "success",
  commented: "secondary",
  assigned: "warning",
  uploaded: "info",
  scheduled: "warning",
} as const

export function ActivityFeed({ activities, organizationId }: ActivityFeedProps) {
  const getActionDescription = (activity: Activity) => {
    const { action, entity_type, metadata } = activity

    switch (action) {
      case "created":
        return `created a new ${entity_type.toLowerCase()}`
      case "updated":
        return `updated ${entity_type.toLowerCase()}`
      case "completed":
        return `completed ${entity_type.toLowerCase()}`
      case "commented":
        return `commented on ${entity_type.toLowerCase()}`
      case "assigned":
        return `assigned ${entity_type.toLowerCase()} to ${metadata.assignee_name}`
      case "uploaded":
        return `uploaded a file to ${entity_type.toLowerCase()}`
      case "scheduled":
        return `scheduled ${entity_type.toLowerCase()}`
      default:
        return `performed ${action} on ${entity_type.toLowerCase()}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 p-4">
            {activities.map((activity) => {
              const ActionIcon = actionIcons[activity.action as keyof typeof actionIcons] || Edit
              const actionColor = actionColors[activity.action as keyof typeof actionColors] || "secondary"

              return (
                <div key={activity.id} className="flex gap-3">
                  <UserAvatar user={activity.user} size="sm" showStatus status="online" />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{activity.user.name}</span>
                      <Badge variant={actionColor} size="sm">
                        <ActionIcon className="w-3 h-3 mr-1" />
                        {activity.action}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {getActionDescription(activity)}
                      {activity.metadata.entity_name && (
                        <span className="font-medium"> "{activity.metadata.entity_name}"</span>
                      )}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}

            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
