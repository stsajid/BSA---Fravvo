import type { NextRequest } from "next/server"
import { withTenantContext } from "@/lib/tenant-resolver"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    return await withTenantContext(request, async (tenant) => {
      const { searchParams } = new URL(request.url)
      const timeframe = searchParams.get("timeframe") || "30d"

      // Calculate date range
      const days = timeframe === "7d" ? 7 : timeframe === "90d" ? 90 : 30
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get comprehensive analytics
      const [overview] = await sql`
        SELECT 
          COUNT(DISTINCT p.id) as total_projects,
          COUNT(DISTINCT t.id) as total_tasks,
          COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
          COUNT(DISTINCT om.user_id) as active_users,
          AVG(CASE WHEN t.status = 'done' AND t.estimated_hours > 0 
              THEN t.actual_hours::float / t.estimated_hours 
              ELSE NULL END) as avg_estimation_accuracy,
          COUNT(DISTINCT CASE WHEN t.created_at >= ${startDate.toISOString()} THEN t.id END) as new_tasks_period
        FROM projects p
        LEFT JOIN tasks t ON p.id = t.project_id
        LEFT JOIN organization_members om ON p.organization_id = om.organization_id
        WHERE p.organization_id = ${tenant.id}
      `

      // Task completion trends
      const completionTrends = await sql`
        SELECT 
          DATE(t.updated_at) as date,
          COUNT(*) as completed_count
        FROM tasks t
        WHERE t.organization_id = ${tenant.id}
          AND t.status = 'done'
          AND t.updated_at >= ${startDate.toISOString()}
        GROUP BY DATE(t.updated_at)
        ORDER BY date
      `

      // Priority distribution
      const priorityDistribution = await sql`
        SELECT 
          priority,
          COUNT(*) as count,
          COUNT(CASE WHEN status = 'done' THEN 1 END) as completed
        FROM tasks
        WHERE organization_id = ${tenant.id}
          AND created_at >= ${startDate.toISOString()}
        GROUP BY priority
      `

      // Team performance
      const teamPerformance = await sql`
        SELECT 
          u.name,
          u.id as user_id,
          COUNT(t.id) as assigned_tasks,
          COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks,
          AVG(CASE WHEN t.status = 'done' AND t.estimated_hours > 0 
              THEN t.actual_hours::float / t.estimated_hours 
              ELSE NULL END) as avg_estimation_accuracy
        FROM users u
        JOIN organization_members om ON u.id = om.user_id
        LEFT JOIN tasks t ON u.id = t.assignee_id 
          AND t.created_at >= ${startDate.toISOString()}
        WHERE om.organization_id = ${tenant.id}
        GROUP BY u.id, u.name
        ORDER BY completed_tasks DESC
        LIMIT 10
      `

      // AI usage metrics
      const aiMetrics = await sql`
        SELECT 
          COUNT(*) as total_ai_interactions,
          COUNT(DISTINCT t.id) as tasks_with_ai_suggestions,
          AVG(LENGTH(ai_suggestions::text)) as avg_suggestion_length
        FROM tasks t
        WHERE t.organization_id = ${tenant.id}
          AND t.ai_suggestions IS NOT NULL
          AND t.ai_suggestions != '{}'
          AND t.created_at >= ${startDate.toISOString()}
      `

      return Response.json({
        overview,
        trends: {
          completion: completionTrends,
          priority: priorityDistribution,
        },
        team: teamPerformance,
        ai: aiMetrics[0] || {
          total_ai_interactions: 0,
          tasks_with_ai_suggestions: 0,
          avg_suggestion_length: 0,
        },
        timeframe,
        period: {
          start: startDate.toISOString(),
          end: new Date().toISOString(),
        },
      })
    })
  } catch (error) {
    console.error("Analytics API Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
