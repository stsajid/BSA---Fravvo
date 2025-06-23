"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  Plus,
} from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

const stats = [
  {
    title: "Active Projects",
    value: "12",
    change: "+2 from last month",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "Team Members",
    value: "48",
    change: "+6 new this week",
    trend: "up",
    icon: Users,
  },
  {
    title: "Tasks Completed",
    value: "156",
    change: "+12% from last week",
    trend: "up",
    icon: CheckCircle,
  },
  {
    title: "Avg Response Time",
    value: "2.4h",
    change: "-30min improvement",
    trend: "up",
    icon: Clock,
  },
]

const recentActivity = [
  {
    id: "1",
    user: "Sarah Chen",
    action: "completed task",
    target: "Q4 Budget Review",
    time: "2 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    user: "Mike Johnson",
    action: "shared document",
    target: "Design Guidelines v2.0",
    time: "15 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    user: "Alex Rivera",
    action: "scheduled meeting",
    target: "Sprint Planning",
    time: "1 hour ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    user: "Emma Wilson",
    action: "created form",
    target: "Employee Feedback Survey",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const upcomingTasks = [
  {
    id: "1",
    title: "Review marketing proposals",
    project: "Q1 Campaign",
    priority: "high",
    dueDate: "Today",
    assignee: "You",
  },
  {
    id: "2",
    title: "Update project timeline",
    project: "Website Redesign",
    priority: "medium",
    dueDate: "Tomorrow",
    assignee: "Design Team",
  },
  {
    id: "3",
    title: "Prepare quarterly report",
    project: "Analytics",
    priority: "high",
    dueDate: "This week",
    assignee: "You",
  },
]

const projects = [
  {
    id: "1",
    name: "Website Redesign",
    progress: 75,
    team: "Design",
    dueDate: "Dec 15",
    status: "on-track",
  },
  {
    id: "2",
    name: "Mobile App",
    progress: 45,
    team: "Engineering",
    dueDate: "Jan 30",
    status: "at-risk",
  },
  {
    id: "3",
    name: "Q1 Marketing Campaign",
    progress: 90,
    team: "Marketing",
    dueDate: "Dec 1",
    status: "ahead",
  },
]

export function DashboardContent() {
  const { user } = useAuth()

  const getDashboardTitle = () => {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    return `${greeting}, ${user?.name?.split(" ")[0]}!`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getDashboardTitle()}</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your team today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-gray-900">{activity.user}</span>
                      <span className="text-gray-600"> {activity.action} </span>
                      <span className="font-medium text-gray-900">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>Tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.project}</p>
                    </div>
                    <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{task.dueDate}</span>
                    <span className="text-xs text-gray-500">{task.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Track progress across your team's projects</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            View All Projects
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <Badge
                    variant={
                      project.status === "ahead"
                        ? "default"
                        : project.status === "at-risk"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{project.team}</span>
                    <span>Due {project.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
