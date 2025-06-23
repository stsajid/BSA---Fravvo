import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getCurrentTenant } from "@/lib/auth"
import { sql } from "@/lib/database"

export async function POST(req: Request) {
  try {
    const { messages, organizationId, context } = await req.json()

    // Verify tenant access
    const tenant = await getCurrentTenant()
    if (!tenant || tenant.organization.id !== organizationId) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Build context-aware system prompt
    let systemPrompt = `You are an AI assistant for ${tenant.organization.name}, a professional collaboration platform. 
    You help users with project management, task organization, and team collaboration.
    
    Current user: ${tenant.user.name} (${tenant.user.role})
    Organization: ${tenant.organization.name}
    Subscription: ${tenant.organization.subscription_tier}
    
    You can help with:
    - Task management and prioritization
    - Project planning and organization  
    - Team collaboration suggestions
    - Workflow optimization
    - Data analysis and insights
    
    Be professional, helpful, and concise. Focus on actionable advice.`

    // Add context-specific information only if database is available
    if (context?.type === "project" && context.id && sql) {
      try {
        const projectData = await sql`
          SELECT p.*, w.name as workspace_name 
          FROM projects p 
          JOIN workspaces w ON p.workspace_id = w.id 
          WHERE p.id = ${context.id} AND p.organization_id = ${organizationId}
        `

        if (projectData.length > 0) {
          const project = projectData[0]
          systemPrompt += `\n\nCurrent context: Project "${project.name}" in workspace "${project.workspace_name}"`

          // Get related tasks
          const tasks = await sql`
            SELECT title, status, priority, description 
            FROM tasks 
            WHERE project_id = ${context.id} AND organization_id = ${organizationId}
            ORDER BY created_at DESC 
            LIMIT 10
          `

          if (tasks.length > 0) {
            systemPrompt += `\n\nRecent tasks in this project:\n${tasks
              .map((t) => `- ${t.title} (${t.status}, ${t.priority} priority)`)
              .join("\n")}`
          }
        }
      } catch (error) {
        console.warn("Could not fetch project context:", error)
      }
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("AI Chat Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
