/**
 * API Gateway Client
 *
 * Provides a unified interface for accessing all microservices
 * with proper tenant context, authentication, and error handling.
 */

import { useAppStore } from "@/lib/state/store"

// Service endpoints
const SERVICES = {
  FEED: "/api/feed",
  CHAT: "/api/chat",
  DOCS: "/api/docs",
  FORMS: "/api/forms",
  TASKS: "/api/tasks",
  MEETINGS: "/api/meetings",
  USERS: "/api/users",
  ANALYTICS: "/api/analytics",
  SUPPORT: "/api/support",
}

// Error types
export interface ApiError {
  code: string
  message: string
  details?: any
}

// Base client for all API calls
class ApiGatewayClient {
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

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          code: errorData.code || `HTTP_${response.status}`,
          message: errorData.message || `API Error: ${response.statusText}`,
          details: errorData.details,
        }
      }

      return response.json()
    } catch (error) {
      console.error(`API Gateway Error (${endpoint}):`, error)
      throw error
    }
  }

  // Feed Service
  feed = {
    getPosts: (filters?: { type?: string; tags?: string[]; limit?: number }) => {
      const params = new URLSearchParams()
      if (filters?.type) params.append("type", filters.type)
      if (filters?.tags) filters.tags.forEach((tag) => params.append("tag", tag))
      if (filters?.limit) params.append("limit", filters.limit.toString())

      return this.request(`${SERVICES.FEED}?${params.toString()}`)
    },

    createPost: (data: { content: string; attachments?: string[]; mentions?: string[]; tags?: string[] }) => {
      return this.request(SERVICES.FEED, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    reactToPost: (postId: string, reaction: string) => {
      return this.request(`${SERVICES.FEED}/${postId}/reactions`, {
        method: "POST",
        body: JSON.stringify({ reaction }),
      })
    },

    getComments: (postId: string) => {
      return this.request(`${SERVICES.FEED}/${postId}/comments`)
    },

    addComment: (postId: string, content: string) => {
      return this.request(`${SERVICES.FEED}/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      })
    },
  }

  // Chat Service
  chat = {
    getChannels: () => {
      return this.request(`${SERVICES.CHAT}/channels`)
    },

    getDirectMessages: () => {
      return this.request(`${SERVICES.CHAT}/direct`)
    },

    getMessages: (channelId: string, before?: string) => {
      const params = new URLSearchParams()
      if (before) params.append("before", before)

      return this.request(`${SERVICES.CHAT}/channels/${channelId}/messages?${params.toString()}`)
    },

    sendMessage: (channelId: string, data: { content: string; attachments?: string[] }) => {
      return this.request(`${SERVICES.CHAT}/channels/${channelId}/messages`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    createChannel: (data: { name: string; description?: string; members: string[] }) => {
      return this.request(`${SERVICES.CHAT}/channels`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    getSmartReplies: (channelId: string, messageId: string) => {
      return this.request(`${SERVICES.CHAT}/ai/smart-replies`, {
        method: "POST",
        body: JSON.stringify({ channelId, messageId }),
      })
    },
  }

  // Docs Service
  docs = {
    getDocuments: (folderId?: string) => {
      const params = new URLSearchParams()
      if (folderId) params.append("folder_id", folderId)

      return this.request(`${SERVICES.DOCS}?${params.toString()}`)
    },

    getDocument: (documentId: string) => {
      return this.request(`${SERVICES.DOCS}/${documentId}`)
    },

    createDocument: (data: { title: string; content?: any; folder_id?: string }) => {
      return this.request(SERVICES.DOCS, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updateDocument: (documentId: string, data: { title?: string; content?: any }) => {
      return this.request(`${SERVICES.DOCS}/${documentId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    getFolders: () => {
      return this.request(`${SERVICES.DOCS}/folders`)
    },

    createFolder: (data: { name: string; parent_id?: string }) => {
      return this.request(`${SERVICES.DOCS}/folders`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    generateSummary: (documentId: string) => {
      return this.request(`${SERVICES.DOCS}/${documentId}/ai/summarize`, {
        method: "POST",
      })
    },
  }

  // Forms Service
  forms = {
    getForms: () => {
      return this.request(SERVICES.FORMS)
    },

    getForm: (formId: string) => {
      return this.request(`${SERVICES.FORMS}/${formId}`)
    },

    createForm: (data: { title: string; fields: any[]; settings?: any }) => {
      return this.request(SERVICES.FORMS, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updateForm: (formId: string, data: { title?: string; fields?: any[]; settings?: any }) => {
      return this.request(`${SERVICES.FORMS}/${formId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    getResponses: (formId: string) => {
      return this.request(`${SERVICES.FORMS}/${formId}/responses`)
    },

    submitResponse: (formId: string, data: Record<string, any>) => {
      return this.request(`${SERVICES.FORMS}/${formId}/responses`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    generateFormFromDescription: (description: string) => {
      return this.request(`${SERVICES.FORMS}/ai/generate`, {
        method: "POST",
        body: JSON.stringify({ description }),
      })
    },
  }

  // Tasks Service
  tasks = {
    getTasks: (projectId?: string, filters?: { status?: string[]; assignee?: string; priority?: string[] }) => {
      const params = new URLSearchParams()
      if (projectId) params.append("project_id", projectId)
      if (filters?.status) filters.status.forEach((s) => params.append("status", s))
      if (filters?.assignee) params.append("assignee", filters.assignee)
      if (filters?.priority) filters.priority.forEach((p) => params.append("priority", p))

      return this.request(`${SERVICES.TASKS}?${params.toString()}`)
    },

    getTask: (taskId: string) => {
      return this.request(`${SERVICES.TASKS}/${taskId}`)
    },

    createTask: (data: {
      title: string
      description?: string
      project_id: string
      status?: string
      priority?: string
      assignee_id?: string
      due_date?: string
      estimated_hours?: number
      parent_id?: string
    }) => {
      return this.request(SERVICES.TASKS, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updateTask: (
      taskId: string,
      data: Partial<{
        title: string
        description: string
        status: string
        priority: string
        assignee_id: string
        due_date: string
        estimated_hours: number
        actual_hours: number
      }>,
    ) => {
      return this.request(`${SERVICES.TASKS}/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    getSubtasks: (taskId: string) => {
      return this.request(`${SERVICES.TASKS}/${taskId}/subtasks`)
    },

    getTaskSuggestions: (projectId: string) => {
      return this.request(`${SERVICES.TASKS}/ai/suggestions`, {
        method: "POST",
        body: JSON.stringify({ project_id: projectId }),
      })
    },

    getRecommendedAssignee: (taskId: string) => {
      return this.request(`${SERVICES.TASKS}/${taskId}/ai/recommend-assignee`, {
        method: "GET",
      })
    },
  }

  // Meetings Service
  meetings = {
    getMeetings: (filters?: { start?: string; end?: string; status?: string }) => {
      const params = new URLSearchParams()
      if (filters?.start) params.append("start", filters.start)
      if (filters?.end) params.append("end", filters.end)
      if (filters?.status) params.append("status", filters.status)

      return this.request(`${SERVICES.MEETINGS}?${params.toString()}`)
    },

    getMeeting: (meetingId: string) => {
      return this.request(`${SERVICES.MEETINGS}/${meetingId}`)
    },

    createMeeting: (data: {
      title: string
      description?: string
      start_time: string
      end_time: string
      attendees: string[]
      location?: string
      virtual_meeting_link?: string
    }) => {
      return this.request(SERVICES.MEETINGS, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updateMeeting: (
      meetingId: string,
      data: Partial<{
        title: string
        description: string
        start_time: string
        end_time: string
        attendees: string[]
        location: string
        virtual_meeting_link: string
      }>,
    ) => {
      return this.request(`${SERVICES.MEETINGS}/${meetingId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    generateAgenda: (meetingId: string) => {
      return this.request(`${SERVICES.MEETINGS}/${meetingId}/ai/agenda`, {
        method: "POST",
      })
    },

    generateMeetingNotes: (meetingId: string, transcript?: string) => {
      return this.request(`${SERVICES.MEETINGS}/${meetingId}/ai/notes`, {
        method: "POST",
        body: JSON.stringify({ transcript }),
      })
    },
  }

  // Users Service
  users = {
    getUsers: (filters?: { role?: string; status?: string }) => {
      const params = new URLSearchParams()
      if (filters?.role) params.append("role", filters.role)
      if (filters?.status) params.append("status", filters.status)

      return this.request(`${SERVICES.USERS}?${params.toString()}`)
    },

    getUser: (userId: string) => {
      return this.request(`${SERVICES.USERS}/${userId}`)
    },

    updateUser: (
      userId: string,
      data: Partial<{
        name: string
        avatar_url: string
        role: string
        status: string
      }>,
    ) => {
      return this.request(`${SERVICES.USERS}/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    getRoles: () => {
      return this.request(`${SERVICES.USERS}/roles`)
    },

    createRole: (data: { name: string; permissions: string[] }) => {
      return this.request(`${SERVICES.USERS}/roles`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    inviteUser: (data: { email: string; role: string; message?: string }) => {
      return this.request(`${SERVICES.USERS}/invite`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    getOnboardingInsights: () => {
      return this.request(`${SERVICES.USERS}/ai/onboarding-insights`)
    },
  }

  // Analytics Service
  analytics = {
    getDashboard: (timeframe: "7d" | "30d" | "90d" = "30d") => {
      return this.request(`${SERVICES.ANALYTICS}?timeframe=${timeframe}`)
    },

    getModuleUsage: (module: string, timeframe: "7d" | "30d" | "90d" = "30d") => {
      return this.request(`${SERVICES.ANALYTICS}/modules/${module}?timeframe=${timeframe}`)
    },

    getUserActivity: (userId?: string, timeframe: "7d" | "30d" | "90d" = "30d") => {
      const params = new URLSearchParams()
      params.append("timeframe", timeframe)
      if (userId) params.append("user_id", userId)

      return this.request(`${SERVICES.ANALYTICS}/user-activity?${params.toString()}`)
    },

    getAIUsageMetrics: (timeframe: "7d" | "30d" | "90d" = "30d") => {
      return this.request(`${SERVICES.ANALYTICS}/ai-usage?timeframe=${timeframe}`)
    },

    getTrendAnalysis: () => {
      return this.request(`${SERVICES.ANALYTICS}/ai/trends`)
    },
  }

  // Support Service
  support = {
    getTickets: (filters?: { status?: string; priority?: string; assigned_to?: string }) => {
      const params = new URLSearchParams()
      if (filters?.status) params.append("status", filters.status)
      if (filters?.priority) params.append("priority", filters.priority)
      if (filters?.assigned_to) params.append("assigned_to", filters.assigned_to)

      return this.request(`${SERVICES.SUPPORT}/tickets?${params.toString()}`)
    },

    getTicket: (ticketId: string) => {
      return this.request(`${SERVICES.SUPPORT}/tickets/${ticketId}`)
    },

    createTicket: (data: {
      subject: string
      description: string
      priority?: string
      category?: string
      attachments?: string[]
    }) => {
      return this.request(`${SERVICES.SUPPORT}/tickets`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    updateTicket: (
      ticketId: string,
      data: Partial<{
        status: string
        priority: string
        assigned_to: string
        resolution: string
      }>,
    ) => {
      return this.request(`${SERVICES.SUPPORT}/tickets/${ticketId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },

    addComment: (ticketId: string, content: string, internal = false) => {
      return this.request(`${SERVICES.SUPPORT}/tickets/${ticketId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content, internal }),
      })
    },

    getAutoResponse: (ticketId: string) => {
      return this.request(`${SERVICES.SUPPORT}/tickets/${ticketId}/ai/auto-response`)
    },

    getSuggestedTags: (ticketId: string) => {
      return this.request(`${SERVICES.SUPPORT}/tickets/${ticketId}/ai/suggested-tags`)
    },
  }
}

// Export singleton instance
export const apiGateway = new ApiGatewayClient()
