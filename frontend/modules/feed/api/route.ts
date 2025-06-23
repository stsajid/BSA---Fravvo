import type { NextRequest } from "next/server"
import { withTenantContext } from "@/lib/tenant-resolver"
import { sql, mockData } from "@/lib/database"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Mock feed data for preview mode
const mockFeedPosts = [
  {
    id: "post-1",
    content: "Just finished the new dashboard design! Check it out and let me know what you think.",
    author: {
      id: mockData.user.id,
      name: mockData.user.name,
      avatar_url: mockData.user.avatar_url,
    },
    attachments: [
      {
        id: "att-1",
        type: "image",
        url: "/placeholder.svg?height=300&width=500",
        thumbnail_url: "/placeholder.svg?height=100&width=100",
      },
    ],
    reactions: [
      { emoji: "👍", count: 5, users: ["user-1", "user-2"] },
      { emoji: "🎉", count: 3, users: ["user-3"] },
    ],
    comments_count: 2,
    ai_tags: ["design", "dashboard", "ui"],
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "post-2",
    content:
      "Team meeting notes from yesterday:\n\n- Reviewed Q1 goals\n- Discussed new feature priorities\n- Set timeline for next release\n\nLet me know if you have any questions!",
    author: {
      id: "user-2",
      name: "Sarah Johnson",
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    attachments: [],
    reactions: [{ emoji: "👍", count: 2, users: ["user-1"] }],
    comments_count: 5,
    ai_tags: ["meeting", "notes", "planning"],
    ai_summary: "Q1 goals review and next release planning discussion",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "post-3",
    content: "We're excited to announce that we've reached 10,000 users! 🎉 Thanks to everyone for their hard work.",
    author: {
      id: "user-3",
      name: "Alex Wong",
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    attachments: [
      {
        id: "att-2",
        type: "chart",
        url: "/placeholder.svg?height=250&width=400",
        thumbnail_url: "/placeholder.svg?height=100&width=100",
      },
    ],
    reactions: [
      { emoji: "🎉", count: 12, users: ["user-1", "user-2", "user-3"] },
      { emoji: "👏", count: 8, users: ["user-4", "user-5"] },
    ],
    comments_count: 7,
    ai_tags: ["milestone", "growth", "celebration"],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    return await withTenantContext(request, async (tenant) => {
      const { searchParams } = new URL(request.url)
      const type = searchParams.get("type")
      const tags = searchParams.getAll("tag")
      const limit = Number.parseInt(searchParams.get("limit") || "20", 10)

      // Use mock data if no database connection
      if (!sql) {
        let filteredPosts = [...mockFeedPosts]

        if (type) {
          filteredPosts = filteredPosts.filter((post) => post.ai_tags.includes(type))
        }

        if (tags.length > 0) {
          filteredPosts = filteredPosts.filter((post) => tags.some((tag) => post.ai_tags.includes(tag)))
        }

        return Response.json({
          posts: filteredPosts.slice(0, limit),
          total: filteredPosts.length,
        })
      }

      // Build query with filters
      let query = sql`
        SELECT 
          p.*,
          u.name as author_name,
          u.avatar_url as author_avatar_url,
          COUNT(DISTINCT r.id) as reaction_count,
          COUNT(DISTINCT c.id) as comment_count
        FROM feed_posts p
        JOIN users u ON p.author_id = u.id
        LEFT JOIN feed_reactions r ON p.id = r.post_id
        LEFT JOIN feed_comments c ON p.id = c.post_id
        WHERE p.organization_id = ${tenant.id}
      `

      if (type) {
        query = sql`${query} AND p.ai_tags ? ${type}`
      }

      if (tags.length > 0) {
        const tagConditions = tags.map((tag) => sql`p.ai_tags ? ${tag}`).join(" OR ")
        query = sql`${query} AND (${tagConditions})`
      }

      query = sql`
        ${query}
        GROUP BY p.id, u.name, u.avatar_url
        ORDER BY p.created_at DESC
        LIMIT ${limit}
      `

      const posts = await query

      // Get reactions for each post
      const postsWithReactions = await Promise.all(
        posts.map(async (post) => {
          const reactions = await sql`
            SELECT 
              emoji,
              COUNT(*) as count,
              ARRAY_AGG(user_id) as users
            FROM feed_reactions
            WHERE post_id = ${post.id}
            GROUP BY emoji
          `

          const attachments = await sql`
            SELECT id, type, url, thumbnail_url
            FROM feed_attachments
            WHERE post_id = ${post.id}
          `

          return {
            ...post,
            author: {
              id: post.author_id,
              name: post.author_name,
              avatar_url: post.author_avatar_url,
            },
            reactions,
            attachments,
          }
        }),
      )

      return Response.json({
        posts: postsWithReactions,
        total: posts.length,
      })
    })
  } catch (error) {
    console.error("Feed API Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await withTenantContext(request, async (tenant) => {
      const body = await request.json()
      const { content, attachments = [], mentions = [], tags = [] } = body

      // Generate AI tags and summary
      let aiTags = tags
      let aiSummary = null

      try {
        // Generate AI tags if not provided
        if (tags.length === 0) {
          const { text: tagText } = await generateText({
            model: openai("gpt-4o"),
            prompt: `Extract 3-5 relevant tags from this post content. Return only the tags as a JSON array of strings:\n\n${content}`,
            temperature: 0.3,
          })

          try {
            aiTags = JSON.parse(tagText)
          } catch {
            aiTags = tagText.split(",").map((tag) => tag.trim())
          }
        }

        // Generate summary for longer posts
        if (content.length > 300) {
          const { text: summaryText } = await generateText({
            model: openai("gpt-4o"),
            prompt: `Summarize this post in a single concise sentence:\n\n${content}`,
            temperature: 0.3,
            maxTokens: 100,
          })

          aiSummary = summaryText
        }
      } catch (error) {
        console.error("AI processing error:", error)
      }

      // In preview mode, return mock success
      if (!sql) {
        const mockPost = {
          id: `post-${Date.now()}`,
          content,
          author: {
            id: mockData.user.id,
            name: mockData.user.name,
            avatar_url: mockData.user.avatar_url,
          },
          attachments: attachments.map((url: string, i: number) => ({
            id: `att-${Date.now()}-${i}`,
            type: "image",
            url,
            thumbnail_url: url,
          })),
          reactions: [],
          comments_count: 0,
          ai_tags: aiTags,
          ai_summary: aiSummary,
          created_at: new Date().toISOString(),
        }

        return Response.json({ post: mockPost })
      }

      // Create post in database
      const [post] = await sql`
        INSERT INTO feed_posts (
          organization_id, author_id, content, ai_tags, ai_summary
        ) VALUES (
          ${tenant.id}, ${mockData.user.id}, ${content}, ${JSON.stringify(aiTags)}, ${aiSummary}
        )
        RETURNING *
      `

      // Add attachments
      if (attachments.length > 0) {
        await Promise.all(
          attachments.map(async (attachment: string) => {
            await sql`
              INSERT INTO feed_attachments (
                post_id, type, url, thumbnail_url
              ) VALUES (
                ${post.id}, 'image', ${attachment}, ${attachment}
              )
            `
          }),
        )
      }

      // Process mentions
      if (mentions.length > 0) {
        await Promise.all(
          mentions.map(async (userId: string) => {
            await sql`
              INSERT INTO notifications (
                organization_id, user_id, type, title, message, data
              ) VALUES (
                ${tenant.id}, ${userId}, 'mention', 'You were mentioned in a post', 
                ${`${mockData.user.name} mentioned you in a post`}, 
                ${JSON.stringify({ post_id: post.id })}
              )
            `
          }),
        )
      }

      // Return the created post with author info
      return Response.json({
        post: {
          ...post,
          author: {
            id: mockData.user.id,
            name: mockData.user.name,
            avatar_url: mockData.user.avatar_url,
          },
          attachments: attachments.map((url: string, i: number) => ({
            id: `att-${Date.now()}-${i}`,
            type: "image",
            url,
            thumbnail_url: url,
          })),
          reactions: [],
          comments_count: 0,
        },
      })
    })
  } catch (error) {
    console.error("Create Post Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
