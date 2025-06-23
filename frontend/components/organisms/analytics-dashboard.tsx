"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/atoms/badge"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, CheckCircle, Zap } from "lucide-react"

interface AnalyticsDashboardProps {
  timeframe?: "7d" | "30d" | "90d"
}

const COLORS = ["#6c5ce7", "#00b894", "#fdcb6e", "#e17055", "#74b9ff"]

export function AnalyticsDashboard({ timeframe = "30d" }: AnalyticsDashboardProps) {
  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analytics", timeframe],
    queryFn: () => apiClient.getAnalytics(timeframe),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-8 bg-muted rounded w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Failed to load analytics data</p>
        </CardContent>
      </Card>
    )
  }

  const { overview, trends, team, ai } = analytics

  const completionRate =
    overview.total_tasks > 0 ? Math.round((overview.completed_tasks / overview.total_tasks) * 100) : 0

  const estimationAccuracy = overview.avg_estimation_accuracy ? Math.round(overview.avg_estimation_accuracy * 100) : 0

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_projects}</div>
            <p className="text-xs text-muted-foreground">{overview.new_tasks_period} new tasks this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {overview.completed_tasks} of {overview.total_tasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.active_users}</div>
            <p className="text-xs text-muted-foreground">Active collaborators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Assistance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ai.tasks_with_ai_suggestions}</div>
            <p className="text-xs text-muted-foreground">Tasks enhanced with AI</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Task Completion Trends
              <Badge variant="secondary">{timeframe}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends.completion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                <Line
                  type="monotone"
                  dataKey="completed_count"
                  stroke="#6c5ce7"
                  strokeWidth={2}
                  name="Completed Tasks"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trends.priority}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ priority, count }) => `${priority}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {trends.priority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={team.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed_tasks" fill="#00b894" name="Completed" />
                <Bar dataKey="assigned_tasks" fill="#74b9ff" name="Assigned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estimation Accuracy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Estimation Accuracy
              <Badge
                variant={estimationAccuracy >= 80 ? "success" : estimationAccuracy >= 60 ? "warning" : "destructive"}
              >
                {estimationAccuracy}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{estimationAccuracy}%</div>
                <p className="text-sm text-muted-foreground">Average estimation accuracy</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Excellent (90-100%)</span>
                  <span className="text-green-600">Target</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Good (70-89%)</span>
                  <span className="text-yellow-600">Acceptable</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Needs Improvement (&lt;70%)</span>
                  <span className="text-red-600">Focus Area</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  AI suggestions can help improve estimation accuracy by analyzing historical data and task complexity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{ai.total_ai_interactions}</div>
              <p className="text-sm text-muted-foreground">AI Interactions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{ai.tasks_with_ai_suggestions}</div>
              <p className="text-sm text-muted-foreground">Enhanced Tasks</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(ai.avg_suggestion_length / 100) || 0}</div>
              <p className="text-sm text-muted-foreground">Avg. Suggestion Quality</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
