import { FeedContainer } from "@/modules/feed/components/feed-container"
import { getCurrentTenant } from "@/lib/auth"
import { apiGateway } from "@/lib/api-gateway/client"

export default async function FeedPage() {
  const tenant = await getCurrentTenant()

  if (!tenant) {
    return <div>Unauthorized</div>
  }

  // Pre-fetch initial posts for better UX
  let initialPosts = []
  try {
    const response = await apiGateway.feed.getPosts({ limit: 10 })
    initialPosts = response.posts || []
  } catch (error) {
    console.error("Failed to fetch initial posts:", error)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Team Feed</h1>
        <p className="text-muted-foreground mt-2">Stay updated with your team's latest activities and announcements</p>
      </div>

      <FeedContainer initialPosts={initialPosts} />
    </div>
  )
}
