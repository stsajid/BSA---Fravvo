import type { NextRequest } from "next/server"
import { withTenantContext } from "@/lib/tenant-resolver"
import { sql, mockData } from "@/lib/database"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Mock chat data for preview mode
const mockChannels = [
  {
    id: "channel-1",
    name: "general",
    description: "General team discussions",
    is_private: false,
    member_count: 15,
    unread_count: 3,
    last_message: {
      content: "Has everyone seen the new dashboard design?",
      sender: {
        id: "user-2",
        name: "Sarah Johnson",
        avatar_url: "/placeholder.svg?height=32&width=32",
      },
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "channel-2",
    name: "product",
    description: "Product development discussions",
    is_private: false,
    member_count: 8,
    unread_count: 0,
    last_message: {
      content: "The new feature is ready for testing",
      sender: {
        id: mockData.user.id,
        name: mockData.user.name,
        avatar_url: mockData.user.avatar_url,
      },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "channel-3",
    name: "random",
    description: "Random discussions and fun",
    is_private: false,
    member_count: 12,
    unread_count: 5,
    last_message: {
      content: "Check out this cool article I found!",
      sender: {
        id: "user-3",
        name: "Alex Wong",
        avatar_url: "/placeholder.svg?height=32&width=32",
      },
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  },
]

const mockDirectMessages = [
  {
    id: "dm-1",
    user: {
      id: "user-2",
      name: "Sarah Johnson",
      avatar_url: "/placeholder.svg?height=32&width=32",
      status: "online",
    },
    unread_count: 2,
    last_message: {
      content: "Can you review my PR when you get a chance?",
      sender_id: "user-2",
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "dm-2",
    user: {
      id: "user-3",
      name: "Alex Wong",
      avatar_url: "/placeholder.svg?height=32&width=32",
      status: "away",
    },
    unread_count: 0,
    last_message: {
      content: "Thanks for the help yesterday!",
      sender_id: mockData.user.id,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
]

const mockMessages = {
  "channel-1": [
    {
      id: "msg-1",
      content: "Has everyone seen the new dashboard design?",
      sender: {
        id: "user-2",
        name: "Sarah Johnson",
        avatar_url: "/placeholder.svg?height=32&width=32",
      },
      reactions: [{ emoji: "👍", count: 3, users: ["user-1", "user-3"] }],
      attachments: [],
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "msg-2",
      content: "Yes, it looks great! I especially like the new analytics section.",
      sender: {
        id: "user-3",
        name: "Alex Wong",
        avatar_url: "/placeholder.svg?height=32&width=32",
      },
      reactions: [],
      attachments: [],
      created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    },
    {
      id: "msg-3",
      content: "I have a few suggestions for improvements. Can we discuss in our next meeting?",
      sender: {
        id: mockData.user.id,
        name: mockData.user.name,
        avatar_url: mockData.user.avatar_url,
      },
      reactions: [{ emoji: "👍", count: 1, users: ["user-2"] }],
      attachments: [],
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url)

    // Handle different endpoints
    if (pathname.endsWith("/channels")) {
      return await getChannels(request)
    } else if (pathname.endsWith("/direct")) {
      return await getDirectMessages(request)
    } else if (pathname.includes("/channels/") && pathname.includes("/messages")) {
      return await getChannelMessages(request)
    }

    return Response.json({ error: "Invalid endpoint" }, { status: 404 })
  } catch (error) {
    console.error("Chat API Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

async function getChannels(request: NextRequest) {
  return await withTenantContext(request, async (tenant) => {
    // Use mock data if no database connection
    if (!sql) {
      return Response.json({ channels: mockChannels })
    }

    const channels = await sql`
      SELECT 
        c.*,
        COUNT(DISTINCT cm.user_id) as member_count,
        (
          SELECT COUNT(*) 
          FROM chat_messages m 
          WHERE m.channel_id = c.id AND m.created_at > (
            SELECT COALESCE(last_read_at, '1970-01-01') 
            FROM chat_channel_members 
            WHERE channel_id = c.id AND user_id = ${mockData.user.id}
          )
        ) as unread_count,
        (
          SELECT ROW_TO_JSON(last_msg) FROM (
            SELECT 
              m.content,
              m.created_at,
              json_build_object(
                'id', u.id,
                'name', u.name,
                'avatar_url', u.avatar_url
              ) as sender
            FROM chat_messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.channel_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
          ) as last_msg
        ) as last_message
      FROM chat_channels c
      LEFT JOIN chat_channel_members cm ON c.id = cm.channel_id
      WHERE c.organization_id = ${tenant.id}
      GROUP BY c.id
      ORDER BY c.name
    `

    return Response.json({ channels })
  })
}

async function getDirectMessages(request: NextRequest) {
  return await withTenantContext(request, async (tenant) => {
    // Use mock data if no database connection
    if (!sql) {
      return Response.json({ direct_messages: mockDirectMessages })
    }

    const directMessages = await sql`
      SELECT 
        c.id,
        u.id as user_id,
        u.name,
        u.avatar_url,
        u.status,
        (
          SELECT COUNT(*) 
          FROM chat_messages m 
          WHERE m.channel_id = c.id AND m.created_at > (
            SELECT COALESCE(last_read_at, '1970-01-01') 
            FROM chat_channel_members 
            WHERE channel_id = c.id AND user_id = ${mockData.user.id}
          )
        ) as unread_count,
        (
          SELECT ROW_TO_JSON(last_msg) FROM (
            SELECT 
              m.content,
              m.sender_id,
              m.created_at
            FROM chat_messages m
            WHERE m.channel_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
          ) as last_msg
        ) as last_message
      FROM chat_channels c
      JOIN chat_channel_members cm ON c.id = cm.channel_id AND cm.user_id != ${mockData.user.id}
      JOIN users u ON cm.user_id = u.id
      WHERE c.is_direct = true
        AND c.id IN (
          SELECT channel_id 
          FROM chat_channel_members 
          WHERE user_id = ${mockData.user.id}
        )
      ORDER BY (
        SELECT created_at 
        FROM chat_messages 
        WHERE channel_id = c.id 
        ORDER BY created_at DESC 
        LIMIT 1
      ) DESC NULLS LAST
    `

    return Response.json({ direct_messages: directMessages })
  })
}

async function getChannelMessages(request: NextRequest) {
  return await withTenantContext(request, async (tenant) => {
    const { pathname, searchParams } = new URL(request.url)
    const channelId = pathname.split("/")[4] // Extract channel ID from path
    const before = searchParams.get("before")
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)

    // Use mock data if no database connection
    if (!sql) {
      const messages = mockMessages[channelId as keyof typeof mockMessages] || []
      return Response.json({ messages })
    }

    let query = sql`
      SELECT 
        m.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'avatar_url', u.avatar_url
        ) as sender,
        (
          SELECT json_agg(
            json_build_object(
              'emoji', r.emoji,
              'count', r.count,
              'users', r.users
            )
          )
          FROM (
            SELECT 
              emoji,
              COUNT(*) as count,
              array_agg(user_id) as users
            FROM chat_reactions
            WHERE message_id = m.id
            GROUP BY emoji
          ) r
        ) as reactions,
        (
          SELECT json_agg(
            json_build_object(
              'id', a.id,
              'type', a.type,
              'url', a.url,
              'filename', a.filename
            )
          )
          FROM chat_attachments a
          WHERE a.message_id = m.id
        ) as attachments
      FROM chat_messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.channel_id = ${channelId}
        AND m.organization_id = ${tenant.id}
    `

    if (before) {
      query = sql`${query} AND m.created_at < ${before}`
    }

    query = sql`${query} ORDER BY m.created_at DESC LIMIT ${limit}`

    const messages = await query

    return Response.json({ messages: messages.reverse() })
  })
}

export async function POST(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url)

    if (pathname.endsWith("/channels")) {
      return await createChannel(request)
    } else if (pathname.includes("/channels/") && pathname.includes("/messages")) {
      return await sendMessage(request)
    } else if (pathname.includes("/ai/smart-replies")) {
      return await getSmartReplies(request)
    }

    return Response.json({ error: "Invalid endpoint" }, { status: 404 })
  } catch (error) {
    console.error("Chat API Error:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

async function createChannel(request: NextRequest) {
  return await withTenantContext(request, async (tenant) => {
    const body = await request.json()
    const { name, description, members } = body

    // In preview mode, return mock success
    if (!sql) {
      const mockChannel = {
        id: `channel-${Date.now()}`,
        name,
        description,
        is_private: false,
        member_count: members.length + 1,
        unread_count: 0,
        created_at: new Date().toISOString(),
      }

      return Response.json({ channel: mockChannel })
    }

    const [channel] = await sql`
      INSERT INTO chat_channels (
        organization_id, name, description, created_by
      ) VALUES (
        ${tenant.id}, ${name}, ${description}, ${mockData.user.id}
      )
      RETURNING *
    `

    // Add members to channel
    const allMembers = [mockData.user.id, ...members]
    await Promise.all(
      allMembers.map(async (userId) => {
        await sql`
          INSERT INTO chat_channel_members (
            channel_id, user_id, role
          ) VALUES (
            ${channel.id}, ${userId}, ${userId === mockData.user.id ? "admin" : "member"}
          )
        `
      }),
    )

    return Response.json({ channel })
  })
}

async function sendMessage(request: NextRequest) {
  return await withTenantContext(request, async (tenant) => {
    const { pathname } = new URL(request.url)
    const channelId = pathname.split("/")[4]
    const body = await request.json()
    const { content, attachments = [] } = body

    // In preview mode, return mock success
    if (!sql) {
      const mockMessage = {
        id: `msg-${Date.now()}`,
        content,
        sender: {
          id: mockData.user.id,
          name: mockData.user.name,
          avatar_url: mockData.user.avatar_url,
        },
        reactions: [],
        attachments: attachments.map((url: string, i: number) => ({
          id: `att-${Date.now()}-${i}`,
          type: "image",
          url,
          filename: `attachment-${i + 1}`,
        })),
        created_at: new Date().toISOString(),
      }

      return Response.json({ message: mockMessage })
    }

    const [message] = await sql`
      INSERT INTO chat_messages (
        organization_id, channel_id, sender_id, content
      ) VALUES (
        ${tenant.id}, ${channelId}, ${mockData.user.id}, ${content}
      )
      RETURNING *
    `

    // Add attachments
    if (attachments.length > 0) {
      await Promise.all(
        attachments.map(async (attachment: string) => {
          await sql`
            INSERT INTO chat_attachments (
              message_id, type, url, filename
            ) VALUES (
              ${message.id}, 'image', ${attachment}, 'attachment'
            )
          `
        }),
      )
    }

    // Update last read timestamp for sender
    await sql`
      UPDATE chat_channel_members 
      SET last_read_at = NOW()
      WHERE channel_id = ${channelId} AND user_id = ${mockData.user.id}
    `

    return Response.json({ message })
  })
}

async function getSmartReplies(request: NextRequest) {
  return await withTenantContext(request, async (tenant) => {
    const body = await request.json()
    const { channelId, messageId } = body

    try {
      // Get the message context
      let messageContent = "Hello, how are you?"
      let channelContext = "general discussion"

      if (sql) {
        const [message] = await sql`
          SELECT m.content, c.name as channel_name
          FROM chat_messages m
          JOIN chat_channels c ON m.channel_id = c.id
          WHERE m.id = ${messageId} AND m.organization_id = ${tenant.id}
        `

        if (message) {
          messageContent = message.content
          channelContext = message.channel_name
        }
      }

      // Generate smart replies using AI
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate 3 short, professional smart reply suggestions for this message in a ${channelContext} channel:

        Message: "${messageContent}"

        Return as a JSON array of strings. Each reply should be:
        - Professional and contextually appropriate
        - Brief (under 20 words)
        - Varied in tone (acknowledgment, question, action)

        Example format: ["Thanks for sharing!", "Could you provide more details?", "I'll take a look at this."]`,
        temperature: 0.7,
        maxTokens: 200,
      })

      let smartReplies = []
      try {
        smartReplies = JSON.parse(text)
      } catch {
        // Fallback replies
        smartReplies = ["Thanks for sharing!", "Could you provide more details?", "I'll take a look at this."]
      }

      return Response.json({ smart_replies: smartReplies })
    } catch (error) {
      console.error("Smart replies error:", error)

      // Return fallback replies
      return Response.json({
        smart_replies: ["Thanks!", "Got it.", "Will do."],
      })
    }
  })
}
