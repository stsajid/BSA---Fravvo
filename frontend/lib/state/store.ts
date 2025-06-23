import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { TenantInfo } from "@/lib/tenant-resolver"

// Global app state
interface AppState {
  tenant: TenantInfo | null
  user: {
    id: string
    email: string
    name: string
    role: string
    permissions: string[]
  } | null

  // UI state
  sidebarCollapsed: boolean
  theme: "light" | "dark" | "system"

  // Actions
  setTenant: (tenant: TenantInfo | null) => void
  setUser: (user: AppState["user"]) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: AppState["theme"]) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        tenant: null,
        user: null,
        sidebarCollapsed: false,
        theme: "system",

        setTenant: (tenant) => set({ tenant }),
        setUser: (user) => set({ user }),
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        setTheme: (theme) => set({ theme }),
        reset: () =>
          set({
            tenant: null,
            user: null,
            sidebarCollapsed: false,
            theme: "system",
          }),
      }),
      {
        name: "enterprise-saas-store",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      },
    ),
    {
      name: "enterprise-saas",
    },
  ),
)

// Project-specific state
interface ProjectState {
  currentProject: {
    id: string
    name: string
    workspace_id: string
  } | null

  tasks: Array<{
    id: string
    title: string
    status: string
    priority: string
    assignee_id?: string
  }>

  filters: {
    status: string[]
    priority: string[]
    assignee: string[]
  }

  // Actions
  setCurrentProject: (project: ProjectState["currentProject"]) => void
  setTasks: (tasks: ProjectState["tasks"]) => void
  updateTask: (taskId: string, updates: Partial<ProjectState["tasks"][0]>) => void
  setFilters: (filters: Partial<ProjectState["filters"]>) => void
  clearProject: () => void
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      currentProject: null,
      tasks: [],
      filters: {
        status: [],
        priority: [],
        assignee: [],
      },

      setCurrentProject: (project) => set({ currentProject: project }),
      setTasks: (tasks) => set({ tasks }),
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
        })),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      clearProject: () =>
        set({
          currentProject: null,
          tasks: [],
          filters: { status: [], priority: [], assignee: [] },
        }),
    }),
    {
      name: "project-store",
    },
  ),
)

// Real-time notifications state
interface NotificationState {
  notifications: Array<{
    id: string
    type: "info" | "success" | "warning" | "error"
    title: string
    message: string
    timestamp: Date
    read: boolean
    actions?: Array<{
      label: string
      action: () => void
    }>
  }>

  unreadCount: number

  // Actions
  addNotification: (notification: Omit<NotificationState["notifications"][0], "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const id = crypto.randomUUID()
        const newNotification = {
          ...notification,
          id,
          timestamp: new Date(),
          read: false,
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
          unreadCount: state.unreadCount + 1,
        }))
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      removeNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          }
        }),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "notification-store",
    },
  ),
)
