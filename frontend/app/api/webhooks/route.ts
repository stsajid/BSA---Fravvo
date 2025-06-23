import type { NextRequest } from "next/server"
import { withTenantContext } from "@/lib/tenant-resolver"
import { sql } from "@/lib/database"
import { addWebhookJob } from "@/lib/queue/job-processor"
import crypto from "crypto"

export async function GET(request: NextRequest) {
  try {
    return await withTenantContext(request, async (tenant) => {
      const webhooks = await sql`
        SELECT 
          id, url, events, active, secret_key IS NOT NULL as has_secret,
          created_at, updated_at, last_triggered_at, failure_count
        FROM webhooks
        WHERE organization_id = ${tenant.id}
        ORDER BY created_at DESC
      `

      return Response.json({ webhooks })
    })
  } catch (error) {
    console.error("Webhooks API Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await withTenantContext(request, async (tenant) => {
      const body = await request.json()
      const { url, events, secret } = body

      // Validate webhook URL
      try {
        new URL(url)
      } catch {
        return Response.json({ error: "Invalid webhook URL" }, { status: 400 })
      }

      // Generate secret if not provided
      const secretKey = secret || crypto.randomBytes(32).toString("hex")
      const hashedSecret = crypto.createHash("sha256").update(secretKey).digest("hex")

      const [webhook] = await sql`
        INSERT INTO webhooks (
          organization_id, url, events, secret_key, active
        ) VALUES (
          ${tenant.id}, ${url}, ${JSON.stringify(events)}, ${hashedSecret}, true
        )
        RETURNING id, url, events, active, created_at
      `

      // Test the webhook
      await addWebhookJob({
        url,
        payload: {
          event: "webhook.test",
          data: {
            webhook_id: webhook.id,
            organization: tenant.name,
            timestamp: new Date().toISOString(),
          },
        },
        headers: {
          "X-Webhook-Secret": secretKey,
        },
        tenantId: tenant.id,
      })

      return Response.json({
        webhook: {
          ...webhook,
          secret_key: secretKey, // Return once for storage
        },
      })
    })
  } catch (error) {
    console.error("Create Webhook Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
