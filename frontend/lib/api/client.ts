import { useAppStore } from "@/lib/state/store"

// API client with tenant context
class APIClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || ""
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { tenant, user } = useAppStore.getState()

    const url = `${this.baseURL}${endpoint}`
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    }

    // Add tenant context
    if (tenant) {
      headers["X-Tenant-ID"] = tenant.id
      headers["X-Tenant-Schema"] = tenant.schema
    }

    // Add auth token (assuming Clerk)
    if (typeof window !== "undefined") {
      const token = await (window as any).Clerk?.session?.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // Projects API
  async getProjects(workspaceId?: string) {
    const params = workspaceId ? `?workspace_id=${workspaceId}` : ""
    return this.request(`/api/projects${params}`)
  }

  async createProject(data: {
    name: string
    description?: string
    workspace_id: string
    priority?: string
    due_date?: string
  }) {
    return this.request("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProject(
    id: string,
    data: Partial<{
      name: string
      description: string
      status: string
      priority: string
      due_date: string
    }>,
  ) {
    return this.request(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // Tasks API
  async getTasks(projectId?: string, status?: string) {
    const params = new URLSearchParams()
    if (projectId) params.append("project_id", projectId)
    if (status) params.append("status", status)

    return this.request(`/api/tasks?${params.toString()}`)
  }

  async createTask(data: {
    title: string
    description?: string
    project_id: string
    priority?: string
    assignee_id?: string
    due_date?: string
    estimated_hours?: number
  }) {
    return this.request("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateTask(
    id: string,
    data: Partial<{
      title: string
      description: string
      status: string
      priority: string
      assignee_id: string
      due_date: string
      actual_hours: number
    }>,
  ) {
    return this.request(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // AI API
  async generateTaskSuggestions(taskData: {
    title: string
    description?: string
    context?: Record<string, any>
  }) {
    return this.request("/api/ai/task-suggestions", {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  }

  async analyzeContent(content: string, type: "task" | "project" | "comment") {
    return this.request("/api/ai/analyze", {
      method: "POST",
      body: JSON.stringify({ content, type }),
    })
  }

  // Analytics API
  async getAnalytics(timeframe: "7d" | "30d" | "90d" = "30d") {
    return this.request(`/api/analytics?timeframe=${timeframe}`)
  }

  async getTeamMetrics(teamId?: string) {
    const params = teamId ? `?team_id=${teamId}` : ""
    return this.request(`/api/analytics/team${params}`)
  }

  // Webhooks API
  async createWebhook(data: {
    url: string
    events: string[]
    secret?: string
  }) {
    return this.request("/api/webhooks", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async testWebhook(id: string) {
    return this.request(`/api/webhooks/${id}/test`, {
      method: "POST",
    })
  }
}

export const apiClient = new APIClient()

// React Query hooks for data fetching
export { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Custom hooks using React Query
export function useProjects(workspaceId?: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => apiClient.getProjects(workspaceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useTasks(projectId?: string, status?: string) {
  return useQuery({
    queryKey: ["tasks", projectId, status],
    queryFn: () => apiClient.getTasks(projectId, status),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiClient.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["analytics"] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
