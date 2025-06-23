import type { NextRequest } from "next/server"
import { getCurrentTenant } from "@/lib/auth"
import { sql, mockData } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const tenant = await getCurrentTenant()
    if (!tenant) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use mock data if no database connection
    if (!sql) {
      const mockProjects = [
        {
          id: "550e8400-e29b-41d4-a716-446655440030",
          organization_id: tenant.organization.id,
          workspace_id: "550e8400-e29b-41d4-a716-446655440020",
          name: "Q1 Platform Redesign",
          description: "Complete redesign of the platform UI/UX",
          status: "active",
          priority: "high",
          workspace_name: "Product Development",
          created_by_name: "John Admin",
          task_count: mockData.tasks.length,
          completed_tasks: mockData.tasks.filter((t) => t.status === "done").length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      return Response.json({ projects: mockProjects })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get("workspace_id")

    let query = sql`
      SELECT 
        p.*,
        w.name as workspace_name,
        u.name as created_by_name,
        COUNT(t.id) as task_count,
        COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks
      FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      JOIN users u ON p.created_by = u.id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.organization_id = ${tenant.organization.id}
    `

    if (workspaceId) {
      query = sql`${query} AND p.workspace_id = ${workspaceId}`
    }

    query = sql`${query} 
      GROUP BY p.id, w.name, u.name
      ORDER BY p.created_at DESC
    `

    const projects = await query

    return Response.json({ projects })
  } catch (error) {
    console.error("Projects API Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenant = await getCurrentTenant()
    if (!tenant) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In preview mode, return mock success
    if (!sql) {
      const body = await request.json()
      const mockProject = {
        id: crypto.randomUUID(),
        organization_id: tenant.organization.id,
        workspace_id: body.workspace_id,
        name: body.name,
        description: body.description,
        priority: body.priority || "medium",
        due_date: body.due_date,
        created_by: tenant.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return Response.json({ project: mockProject })
    }

    const body = await request.json()
    const { name, description, workspace_id, priority = "medium", due_date } = body

    const [project] = await sql`
      INSERT INTO projects (
        organization_id, workspace_id, name, description, 
        priority, due_date, created_by
      ) VALUES (
        ${tenant.organization.id}, ${workspace_id}, ${name}, ${description},
        ${priority}, ${due_date}, ${tenant.user.id}
      )
      RETURNING *
    `

    // Log activity
    await sql`
      INSERT INTO activities (
        organization_id, user_id, action, entity_type, entity_id, metadata
      ) VALUES (
        ${tenant.organization.id}, ${tenant.user.id}, 'created', 'project', 
        ${project.id}, ${JSON.stringify({ entity_name: name })}
      )
    `

    return Response.json({ project })
  } catch (error) {
    console.error("Create Project Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
