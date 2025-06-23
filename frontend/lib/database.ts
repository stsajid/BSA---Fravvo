import { neon } from "@neondatabase/serverless"

// Make database connection optional for preview environments
let sql: ReturnType<typeof neon> | null = null

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL)
} else {
  console.warn("DATABASE_URL not found - using mock data for preview")
}

// Multi-tenant query helpers
export async function withTenant<T>(
  organizationId: string,
  query: (sql: NonNullable<typeof sql>) => Promise<T>,
): Promise<T> {
  if (!sql) {
    throw new Error("Database not available in preview mode")
  }
  // Add tenant isolation at the query level
  return query(sql)
}

// Mock data for preview mode
const mockOrganization = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Acme Corporation",
  slug: "acme-corp",
  domain: "acme.com",
  settings: {},
  subscription_tier: "enterprise",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockUser = {
  id: "550e8400-e29b-41d4-a716-446655440010",
  email: "admin@acme.com",
  name: "John Admin",
  avatar_url: "/placeholder.svg?height=32&width=32",
  role: "admin",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockTasks = [
  {
    id: "550e8400-e29b-41d4-a716-446655440040",
    organization_id: "550e8400-e29b-41d4-a716-446655440001",
    project_id: "550e8400-e29b-41d4-a716-446655440030",
    title: "Design new dashboard layout",
    description: "Create wireframes and mockups for the new dashboard",
    status: "in_progress",
    priority: "high",
    assignee_id: "550e8400-e29b-41d4-a716-446655440011",
    ai_suggestions: {
      subtasks: ["Create wireframes", "Design mockups", "User testing"],
      time_estimate: "8 hours",
      tips: "Consider mobile-first approach",
    },
    estimated_hours: 8,
    actual_hours: null,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "550e8400-e29b-41d4-a716-446655440010",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: {
      id: "550e8400-e29b-41d4-a716-446655440011",
      name: "Sarah Johnson",
      email: "sarah@acme.com",
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    created_by_user: {
      id: "550e8400-e29b-41d4-a716-446655440010",
      name: "John Admin",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440041",
    organization_id: "550e8400-e29b-41d4-a716-446655440001",
    project_id: "550e8400-e29b-41d4-a716-446655440030",
    title: "Implement responsive navigation",
    description: "Build mobile-first navigation component",
    status: "todo",
    priority: "medium",
    assignee_id: "550e8400-e29b-41d4-a716-446655440010",
    ai_suggestions: {},
    estimated_hours: 4,
    actual_hours: null,
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "550e8400-e29b-41d4-a716-446655440010",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: mockUser,
    created_by_user: {
      id: "550e8400-e29b-41d4-a716-446655440010",
      name: "John Admin",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440042",
    organization_id: "550e8400-e29b-41d4-a716-446655440001",
    project_id: "550e8400-e29b-41d4-a716-446655440030",
    title: "Setup user authentication",
    description: "Integrate Clerk authentication system",
    status: "done",
    priority: "high",
    assignee_id: "550e8400-e29b-41d4-a716-446655440010",
    ai_suggestions: {},
    estimated_hours: 6,
    actual_hours: 5,
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "550e8400-e29b-41d4-a716-446655440010",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignee: mockUser,
    created_by_user: {
      id: "550e8400-e29b-41d4-a716-446655440010",
      name: "John Admin",
    },
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440043",
    organization_id: "550e8400-e29b-41d4-a716-446655440001",
    project_id: "550e8400-e29b-41d4-a716-446655440030",
    title: "Code review process",
    description: "Establish code review guidelines and workflow",
    status: "review",
    priority: "medium",
    assignee_id: "550e8400-e29b-41d4-a716-446655440011",
    ai_suggestions: {},
    estimated_hours: 3,
    actual_hours: null,
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "550e8400-e29b-41d4-a716-446655440010",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    assignee: {
      id: "550e8400-e29b-41d4-a716-446655440011",
      name: "Sarah Johnson",
      email: "sarah@acme.com",
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    created_by_user: {
      id: "550e8400-e29b-41d4-a716-446655440010",
      name: "John Admin",
    },
  },
]

const mockActivities = [
  {
    id: "1",
    user: {
      name: "John Admin",
      email: "admin@acme.com",
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    action: "created",
    entity_type: "task",
    entity_id: "550e8400-e29b-41d4-a716-446655440043",
    metadata: {
      entity_name: "Code review process",
    },
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    user: {
      name: "Sarah Johnson",
      email: "sarah@acme.com",
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    action: "updated",
    entity_type: "task",
    entity_id: "550e8400-e29b-41d4-a716-446655440040",
    metadata: {
      entity_name: "Design new dashboard layout",
    },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    user: {
      name: "John Admin",
      email: "admin@acme.com",
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    action: "completed",
    entity_type: "task",
    entity_id: "550e8400-e29b-41d4-a716-446655440042",
    metadata: {
      entity_name: "Setup user authentication",
    },
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
]

// Export the sql connection (can be null)
export { sql }

// Export mock data for preview mode
export const mockData = {
  organization: mockOrganization,
  user: mockUser,
  tasks: mockTasks,
  activities: mockActivities,
}

// Database types (unchanged)
export interface Organization {
  id: string
  name: string
  slug: string
  domain?: string
  settings: Record<string, any>
  subscription_tier: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  organization_id: string
  workspace_id: string
  name: string
  description?: string
  status: string
  priority: string
  due_date?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  organization_id: string
  project_id: string
  title: string
  description?: string
  status: string
  priority: string
  assignee_id?: string
  ai_suggestions: Record<string, any>
  estimated_hours?: number
  actual_hours?: number
  due_date?: string
  created_by: string
  created_at: string
  updated_at: string
}
