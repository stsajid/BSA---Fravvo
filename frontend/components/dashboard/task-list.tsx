"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, AlertCircle, Clock } from "lucide-react"

// Sample task data
const tasks = [
  {
    id: 1,
    title: "Finalize design mockups",
    completed: false,
    priority: "high",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
    project: "Website Redesign",
    assignee: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32&text=JD",
    },
  },
  {
    id: 2,
    title: "Review content strategy",
    completed: false,
    priority: "medium",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    project: "Q2 Marketing",
    assignee: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32&text=JD",
    },
  },
  {
    id: 3,
    title: "Prepare quarterly report",
    completed: false,
    priority: "high",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday (overdue)
    project: "Finance",
    assignee: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32&text=JD",
    },
  },
  {
    id: 4,
    title: "Update team documentation",
    completed: true,
    priority: "low",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    project: "Internal",
    assignee: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32&text=JD",
    },
  },
]

const getPriorityColor = (priority: string) => {
  if (priority === "high") return "text-red-500 bg-red-50"
  if (priority === "medium") return "text-yellow-500 bg-yellow-50"
  return "text-green-500 bg-green-50"
}

export function TaskList() {
  const [completedTasks, setCompletedTasks] = useState<number[]>(
    tasks.filter((task) => task.completed).map((task) => task.id),
  )

  const handleTaskToggle = (taskId: number) => {
    setCompletedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const isCompleted = completedTasks.includes(task.id)
        const isOverdue = !isCompleted && task.dueDate < new Date()
        const priorityColor = getPriorityColor(task.priority)

        return (
          <div
            key={task.id}
            className={`flex items-center justify-between rounded-lg border p-3 ${isCompleted ? "bg-muted/40" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={isCompleted} onCheckedChange={() => handleTaskToggle(task.id)} />

              <div>
                <p className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{task.project}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {isOverdue ? <AlertCircle className="h-3 w-3 text-red-500" /> : <Clock className="h-3 w-3" />}
                    <span className={isOverdue ? "text-red-500" : ""}>
                      {formatDistanceToNow(task.dueDate, { addSuffix: true })}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${priorityColor} border-none`}>
                {task.priority}
              </Badge>

              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                <AvatarFallback>{task.assignee.name.substring(0, 2)}</AvatarFallback>
              </Avatar>

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
