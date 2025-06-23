import type { NextRequest } from "next/server"
import { getCurrentTenant } from "@/lib/auth"
import { sql, mockData } from "@/lib/database"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function GET(request: NextRequest) {
  try {
    const tenant = await getCurrentTenant()
    if (!tenant) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use mock data if no database connection
    if (!sql) {
      return Response.json({ tasks: mockData.tasks })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")
    const status = searchParams.get("status")

    let query = sql`
      SELECT 
        t.*,
        assignee.name as assignee_name,
        assignee.email as assignee_email,
        assignee.avatar_url as assignee_avatar_url,
        creator.name as created_by_name
      FROM tasks t
      LEFT JOIN users assignee ON t.assignee_id = assignee.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.organization_id = ${tenant.organization.id}
    `

    if (projectId) {
      query = sql`${query} AND t.project_id = ${projectId}`
    }

    if (status) {
      query = sql`${query} AND t.status = ${status}`
    }

    query = sql`${query} ORDER BY t.created_at DESC`

    const tasks = await query

    // Transform the data to include nested user objects
    const transformedTasks = tasks.map((task) => ({
      ...task,
      assignee: task.assignee_name
        ? {
            id: task.assignee_id,
            name: task.assignee_name,
            email: task.assignee_email,
            avatar_url: task.assignee_avatar_url,
          }
        : null,
      created_by_user: {
        id: task.created_by,
        name: task.created_by_name,
      },
    }))

    return Response.json({ tasks: transformedTasks })
  } catch (error) {
    console.error("Tasks API Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenant = await getCurrentTenant()
    if (!tenant) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, project_id, priority = "medium", assignee_id, due_date, estimated_hours } = body

    // Generate AI suggestions for the task (only if we have API access)
    let aiSuggestions = {}
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze this task and provide helpful suggestions:
        
        Title: ${title}
        Description: ${description || "No description provided"}
        Priority: ${priority}
        
        Provide suggestions for:
        1. Potential subtasks or breakdown
        2. Estimated time if not provided
        3. Dependencies or blockers to consider
        4. Best practices or tips
        
        Format as JSON with keys: subtasks, time_estimate, dependencies, tips`,
        temperature: 0.3,
      })

      try {
        aiSuggestions = JSON.parse(text)
      } catch {
        aiSuggestions = { raw_suggestion: text }
      }
    } catch (error) {
      console.error("AI suggestion generation failed:", error)
      // Provide fallback suggestions
      aiSuggestions = {
        subtasks: ["Break down into smaller tasks", "Define acceptance criteria", "Review requirements"],
        time_estimate: estimated_hours ? `${estimated_hours} hours` : "2-4 hours",
        tips: "Consider breaking this into smaller, manageable pieces",
      }
    }

    // In preview mode, return mock success
    if (!sql) {
      const mockTask = {
        id: crypto.randomUUID(),
        organization_id: tenant.organization.id,
        project_id,
        title,
        description,
        priority,
        assignee_id,
        due_date,
        estimated_hours,
        ai_suggestions: aiSuggestions,
        created_by: tenant.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return Response.json({ task: mockTask })
    }

    const [task] = await sql`
      INSERT INTO tasks (
        organization_id, project_id, title, description, priority,
        assignee_id, due_date, estimated_hours, ai_suggestions, created_by
      ) VALUES (
        ${tenant.organization.id}, ${project_id}, ${title}, ${description}, ${priority},
        ${assignee_id}, ${due_date}, ${estimated_hours}, ${JSON.stringify(aiSuggestions)}, ${tenant.user.id}
      )
      RETURNING *
    `

    // Log activity
    await sql`
      INSERT INTO activities (
        organization_id, user_id, action, entity_type, entity_id, metadata
      ) VALUES (
        ${tenant.organization.id}, ${tenant.user.id}, 'created', 'task', 
        ${task.id}, ${JSON.stringify({
          entity_name: title,
          assignee_name: assignee_id ? "Assigned user" : null,
        })}
      )
    `

    return Response.json({ task })
  } catch (error) {
    console.error("Create Task Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
