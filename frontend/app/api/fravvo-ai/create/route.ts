import { getCurrentTenant } from "@/lib/auth"
import { sql } from "@/lib/database"
import { nanoid } from "nanoid"

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json()

    const tenant = await getCurrentTenant()
    if (!tenant) {
      return new Response("Unauthorized", { status: 401 })
    }

    switch (type) {
      case "form":
        return await createForm(data, tenant)

      case "task":
        return await createTask(data, tenant)

      default:
        return new Response("Unsupported creation type", { status: 400 })
    }
  } catch (error) {
    console.error("Creation Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

async function createForm(formData: any, tenant: any) {
  // For now, return a mock response since we don't have a forms table
  const formId = nanoid()

  return Response.json({
    success: true,
    id: formId,
    message: `Form "${formData.title}" created successfully!`,
    data: {
      id: formId,
      title: formData.title,
      fields: formData.fields,
      created_at: new Date().toISOString(),
    },
  })
}

async function createTask(taskData: any, tenant: any) {
  if (!sql) {
    // Mock response for preview mode
    const taskId = nanoid()
    return Response.json({
      success: true,
      id: taskId,
      message: `Task "${taskData.title}" created successfully!`,
      data: {
        id: taskId,
        ...taskData,
        created_at: new Date().toISOString(),
      },
    })
  }

  try {
    const taskId = nanoid()

    await sql`
      INSERT INTO tasks (
        id, organization_id, title, description, status, priority, 
        due_date, created_by, created_at, updated_at
      ) VALUES (
        ${taskId}, ${tenant.organization.id}, ${taskData.title}, 
        ${taskData.description || ""}, 'todo', ${taskData.priority},
        ${taskData.due_date || null}, ${tenant.user.id}, NOW(), NOW()
      )
    `

    return Response.json({
      success: true,
      id: taskId,
      message: `Task "${taskData.title}" created successfully!`,
      data: {
        id: taskId,
        ...taskData,
        status: "todo",
        created_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Task creation error:", error)
    return Response.json(
      {
        success: false,
        message: "Failed to create task",
      },
      { status: 500 },
    )
  }
}
