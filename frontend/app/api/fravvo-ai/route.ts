import { streamText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { getCurrentTenant } from "@/lib/auth"
import { sql, mockData } from "@/lib/database"
import { z } from "zod"

// Define the schema for different AI actions
const aiActionSchema = z.object({
  mode: z.enum(["quick_ask", "dig", "make"]),
  action: z.string(),
  intent: z.string(),
  parameters: z.record(z.any()).optional(),
  confidence: z.number().min(0).max(1),
})

// Define schemas for different creation types
const formCreationSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["text", "email", "number", "select", "textarea", "checkbox", "date"]),
      label: z.string(),
      required: z.boolean(),
      options: z.array(z.string()).optional(),
    }),
  ),
})

const taskCreationSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  assignee: z.string().optional(),
  due_date: z.string().optional(),
  project_id: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const { prompt, mode, context } = await req.json()

    // Get current tenant for context
    const tenant = await getCurrentTenant()
    if (!tenant) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Build context-aware system prompt
    const systemPrompt = `You are Fravvo AI, an intelligent assistant for ${tenant.organization.name}.
    
Current context:
- User: ${tenant.user.name} (${tenant.user.role})
- Organization: ${tenant.organization.name}
- Current page: ${context?.page || "unknown"}
- Mode: ${mode}

You have access to the following capabilities:
1. Quick Ask: Provide short, direct answers to questions
2. Dig: Perform deeper analysis and multi-turn conversations
3. Make: Create forms, tasks, documents, and other items

Available data sources:
- Tasks and projects
- Team members and roles
- Forms and submissions
- Documents and files
- Organization policies and settings

When in "make" mode, you should generate structured data that can be used to create actual items in the system.`

    // Handle different modes
    switch (mode) {
      case "quick_ask":
        return handleQuickAsk(prompt, systemPrompt, tenant, context)

      case "dig":
        return handleDig(prompt, systemPrompt, tenant, context)

      case "make":
        return handleMake(prompt, systemPrompt, tenant, context)

      default:
        return new Response("Invalid mode", { status: 400 })
    }
  } catch (error) {
    console.error("Fravvo AI Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

async function handleQuickAsk(prompt: string, systemPrompt: string, tenant: any, context: any) {
  // Get relevant data for context
  const contextData = await getRelevantContext(prompt, tenant.organization.id)

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `${systemPrompt}
    
    For Quick Ask mode:
    - Provide concise, actionable answers
    - Use the provided context data when relevant
    - Keep responses under 100 words
    - Be direct and helpful
    
    Context data: ${JSON.stringify(contextData)}`,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    maxTokens: 200,
  })

  return result.toDataStreamResponse()
}

async function handleDig(prompt: string, systemPrompt: string, tenant: any, context: any) {
  // Get comprehensive data for analysis
  const analysisData = await getAnalysisContext(prompt, tenant.organization.id)

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `${systemPrompt}
    
    For Dig mode:
    - Provide detailed analysis and insights
    - Ask follow-up questions when appropriate
    - Use data to support your analysis
    - Suggest actionable next steps
    
    Analysis data: ${JSON.stringify(analysisData)}`,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    maxTokens: 800,
  })

  return result.toDataStreamResponse()
}

async function handleMake(prompt: string, systemPrompt: string, tenant: any, context: any) {
  // First, determine what the user wants to create
  const intentAnalysis = await generateObject({
    model: openai("gpt-4o"),
    system: `${systemPrompt}
    
    Analyze the user's request to determine what they want to create.
    Respond with the type of item and the structured data needed to create it.`,
    prompt: `User wants to create something based on this prompt: "${prompt}"
    
    What do they want to make? Respond with the creation type and parameters.`,
    schema: z.object({
      type: z.enum(["form", "task", "document", "meeting", "team", "project"]),
      data: z.record(z.any()),
      confidence: z.number(),
    }),
  })

  // Generate the appropriate structure based on the type
  switch (intentAnalysis.object.type) {
    case "form":
      const formData = await generateObject({
        model: openai("gpt-4o"),
        prompt: `Create a form based on this request: "${prompt}"`,
        schema: formCreationSchema,
      })

      return Response.json({
        type: "form",
        data: formData.object,
        preview: `I'll create a form titled "${formData.object.title}" with ${formData.object.fields.length} fields.`,
        confirmation: "Would you like me to create this form?",
      })

    case "task":
      const taskData = await generateObject({
        model: openai("gpt-4o"),
        prompt: `Create a task based on this request: "${prompt}"`,
        schema: taskCreationSchema,
      })

      return Response.json({
        type: "task",
        data: taskData.object,
        preview: `I'll create a ${taskData.object.priority} priority task: "${taskData.object.title}"`,
        confirmation: "Would you like me to create this task?",
      })

    default:
      return Response.json({
        type: "text",
        data: {
          message:
            "I can help you create forms, tasks, documents, and more. Could you be more specific about what you'd like to make?",
        },
        preview: "I need more details about what you'd like to create.",
        confirmation: null,
      })
  }
}

async function getRelevantContext(prompt: string, organizationId: string) {
  // Use mock data if database is not available
  if (!sql) {
    return {
      tasks: mockData.tasks.slice(0, 3),
      activities: mockData.activities.slice(0, 3),
      organization: mockData.organization,
    }
  }

  try {
    // Get recent tasks
    const tasks = await sql`
      SELECT t.*, u.name as assignee_name 
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id 
      WHERE t.organization_id = ${organizationId} 
      ORDER BY t.created_at DESC 
      LIMIT 5
    `

    // Get recent activities
    const activities = await sql`
      SELECT * FROM activities 
      WHERE organization_id = ${organizationId} 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    return { tasks, activities }
  } catch (error) {
    console.warn("Could not fetch context data:", error)
    return { tasks: [], activities: [] }
  }
}

async function getAnalysisContext(prompt: string, organizationId: string) {
  // Use mock data if database is not available
  if (!sql) {
    return {
      tasks: mockData.tasks,
      activities: mockData.activities,
      organization: mockData.organization,
    }
  }

  try {
    // Get comprehensive task data
    const tasks = await sql`
      SELECT t.*, u.name as assignee_name, p.name as project_name
      FROM tasks t 
      LEFT JOIN users u ON t.assignee_id = u.id 
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.organization_id = ${organizationId} 
      ORDER BY t.created_at DESC 
      LIMIT 20
    `

    // Get team performance data
    const teamStats = await sql`
      SELECT 
        u.name,
        COUNT(t.id) as total_tasks,
        COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks,
        AVG(t.actual_hours) as avg_hours
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assignee_id AND t.organization_id = ${organizationId}
      GROUP BY u.id, u.name
      LIMIT 10
    `

    return { tasks, teamStats }
  } catch (error) {
    console.warn("Could not fetch analysis data:", error)
    return { tasks: [], teamStats: [] }
  }
}
