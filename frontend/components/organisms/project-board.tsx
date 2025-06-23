"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/molecules/task-card"
import { Plus, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Task, User } from "@/lib/database"

interface ProjectBoardProps {
  tasks: (Task & {
    assignee?: User
    created_by_user?: User
  })[]
  onTaskCreate?: () => void
  onTaskEdit?: (task: Task) => void
  onTaskStatusChange?: (taskId: string, status: string) => void
}

const columns = [
  { id: "todo", title: "To Do", status: "todo" },
  { id: "in_progress", title: "In Progress", status: "in_progress" },
  { id: "review", title: "Review", status: "review" },
  { id: "done", title: "Done", status: "done" },
]

export function ProjectBoard({ tasks, onTaskCreate, onTaskEdit, onTaskStatusChange }: ProjectBoardProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button onClick={onTaskCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status)

          return (
            <Card key={column.id} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  {column.title}
                  <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                    {columnTasks.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={onTaskEdit} onStatusChange={onTaskStatusChange} />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
