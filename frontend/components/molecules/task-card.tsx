import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/atoms/badge"
import { UserAvatar } from "@/components/molecules/user-avatar"
import { Calendar, Clock, MessageSquare } from "lucide-react"
import type { Task, User } from "@/lib/database"

interface TaskCardProps {
  task: Task & {
    assignee?: User
    created_by_user?: User
  }
  onEdit?: (task: Task) => void
  onStatusChange?: (taskId: string, status: string) => void
}

const statusVariants = {
  todo: { variant: "outline" as const, label: "To Do" },
  in_progress: { variant: "info" as const, label: "In Progress" },
  review: { variant: "warning" as const, label: "Review" },
  done: { variant: "success" as const, label: "Done" },
}

const priorityVariants = {
  low: { variant: "secondary" as const, label: "Low" },
  medium: { variant: "outline" as const, label: "Medium" },
  high: { variant: "warning" as const, label: "High" },
  urgent: { variant: "destructive" as const, label: "Urgent" },
}

export function TaskCard({ task, onEdit, onStatusChange }: TaskCardProps) {
  const statusConfig = statusVariants[task.status as keyof typeof statusVariants] || statusVariants.todo
  const priorityConfig = priorityVariants[task.priority as keyof typeof priorityVariants] || priorityVariants.medium

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
            {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}
          </div>
          {task.assignee && <UserAvatar user={task.assignee} size="sm" showStatus status="online" />}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig.variant} size="sm">
              {statusConfig.label}
            </Badge>
            <Badge variant={priorityConfig.variant} size="sm">
              {priorityConfig.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
            {task.estimated_hours && (
              <div className="flex items-center gap-1 ml-2">
                <Clock className="w-3 h-3" />
                <span>{task.estimated_hours}h</span>
              </div>
            )}
          </div>
        </div>

        {task.ai_suggestions && Object.keys(task.ai_suggestions).length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <div className="flex items-center gap-1 text-xs text-blue-700 font-medium">
              <MessageSquare className="w-3 h-3" />
              AI Suggestion Available
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
