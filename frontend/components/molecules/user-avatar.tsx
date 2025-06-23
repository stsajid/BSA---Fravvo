import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusIndicator } from "@/components/atoms/status-indicator"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  user: {
    name: string
    email: string
    avatar_url?: string
  }
  size?: "sm" | "md" | "lg" | "xl"
  showStatus?: boolean
  status?: "online" | "offline" | "away" | "busy"
  className?: string
}

const sizes = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
}

export function UserAvatar({ user, size = "md", showStatus = false, status = "offline", className }: UserAvatarProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn("relative", className)}>
      <Avatar className={sizes[size]}>
        <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
      </Avatar>
      {showStatus && (
        <StatusIndicator
          status={status}
          size="sm"
          className="absolute -bottom-0.5 -right-0.5 border-2 border-background"
        />
      )}
    </div>
  )
}
