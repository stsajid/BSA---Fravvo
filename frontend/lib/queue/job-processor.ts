import { Queue, Worker, type Job } from "bullmq"
import { Redis } from "ioredis"
import { sql } from "@vercel/postgres"

// Redis connection for BullMQ
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
})

// Job types
export interface EmailJob {
  type: "email"
  data: {
    to: string
    subject: string
    template: string
    variables: Record<string, any>
    tenantId: string
  }
}

export interface WebhookJob {
  type: "webhook"
  data: {
    url: string
    payload: Record<string, any>
    headers?: Record<string, string>
    tenantId: string
    retries?: number
  }
}

export interface AIProcessingJob {
  type: "ai_processing"
  data: {
    taskId: string
    action: "generate_suggestions" | "analyze_content" | "auto_categorize"
    context: Record<string, any>
    tenantId: string
  }
}

export type JobData = EmailJob | WebhookJob | AIProcessingJob

// Queue setup
export const taskQueue = new Queue<JobData>("enterprise-tasks", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
})

// Job processors
class JobProcessor {
  private worker: Worker<JobData>

  constructor() {
    this.worker = new Worker<JobData>(
      "enterprise-tasks",
      async (job: Job<JobData>) => {
        console.log(`Processing job ${job.id} of type ${job.data.type}`)

        try {
          switch (job.data.type) {
            case "email":
              return await this.processEmailJob(job.data)
            case "webhook":
              return await this.processWebhookJob(job.data)
            case "ai_processing":
              return await this.processAIJob(job.data)
            default:
              throw new Error(`Unknown job type: ${(job.data as any).type}`)
          }
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error)
          throw error
        }
      },
      {
        connection: redis,
        concurrency: 10,
        limiter: {
          max: 100,
          duration: 60000, // 100 jobs per minute
        },
      },
    )

    this.setupEventHandlers()
  }

  private async processEmailJob(job: EmailJob): Promise<void> {
    const { to, subject, template, variables, tenantId } = job.data

    // Mock email sending - replace with your email service
    console.log(`Sending email to ${to} for tenant ${tenantId}`)
    console.log(`Subject: ${subject}`)
    console.log(`Template: ${template}`)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Log email activity
    await this.logActivity(tenantId, "email_sent", {
      recipient: to,
      subject,
      template,
    })
  }

  private async processWebhookJob(job: WebhookJob): Promise<void> {
    const { url, payload, headers = {}, tenantId } = job.data

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`)
      }

      await this.logActivity(tenantId, "webhook_sent", {
        url,
        status: response.status,
      })
    } catch (error) {
      console.error(`Webhook to ${url} failed:`, error)
      throw error
    }
  }

  private async processAIJob(job: AIProcessingJob): Promise<void> {
    const { taskId, action, context, tenantId } = job.data

    // Import AI SDK here to avoid loading it at startup
    const { generateText } = await import("ai")
    const { openai } = await import("@ai-sdk/openai")

    try {
      let prompt = ""

      switch (action) {
        case "generate_suggestions":
          prompt = `Analyze this task and provide actionable suggestions: ${JSON.stringify(context)}`
          break
        case "analyze_content":
          prompt = `Analyze and categorize this content: ${JSON.stringify(context)}`
          break
        case "auto_categorize":
          prompt = `Suggest appropriate categories and tags for: ${JSON.stringify(context)}`
          break
      }

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.3,
        maxTokens: 500,
      })

      // Store AI results back to database
      await this.storeAIResults(tenantId, taskId, action, text)
    } catch (error) {
      console.error(`AI processing failed for task ${taskId}:`, error)
      throw error
    }
  }

  private async logActivity(tenantId: string, action: string, metadata: Record<string, any>): Promise<void> {
    // Log to tenant-specific schema
    await sql`
      INSERT INTO activities (organization_id, action, entity_type, entity_id, metadata, created_at)
      VALUES (${tenantId}, ${action}, 'system', 'job_processor', ${JSON.stringify(metadata)}, NOW())
    `
  }

  private async storeAIResults(tenantId: string, taskId: string, action: string, result: string): Promise<void> {
    await sql`
      UPDATE tasks 
      SET ai_suggestions = COALESCE(ai_suggestions, '{}') || ${JSON.stringify({ [action]: result })}
      WHERE id = ${taskId} AND organization_id = ${tenantId}
    `
  }

  private setupEventHandlers(): void {
    this.worker.on("completed", (job) => {
      console.log(`Job ${job.id} completed successfully`)
    })

    this.worker.on("failed", (job, err) => {
      console.error(`Job ${job?.id} failed:`, err)
    })

    this.worker.on("error", (err) => {
      console.error("Worker error:", err)
    })
  }

  async close(): Promise<void> {
    await this.worker.close()
  }
}

// Export singleton instance
export const jobProcessor = new JobProcessor()

// Helper functions for adding jobs
export async function addEmailJob(data: EmailJob["data"]): Promise<void> {
  await taskQueue.add("email", data, {
    priority: 10,
    delay: 0,
  })
}

export async function addWebhookJob(data: WebhookJob["data"]): Promise<void> {
  await taskQueue.add("webhook", data, {
    priority: 5,
    attempts: data.retries || 3,
  })
}

export async function addAIProcessingJob(data: AIProcessingJob["data"]): Promise<void> {
  await taskQueue.add("ai_processing", data, {
    priority: 3,
    delay: 1000, // Small delay to batch AI requests
  })
}
