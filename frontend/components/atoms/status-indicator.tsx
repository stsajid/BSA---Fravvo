import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "online" | "offline" | "away" | "busy"
  size?: "sm" | "md" | "lg"
  className?: string
}

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
}

const sizes = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
}

export function StatusIndicator({ status, size = "md", className }: StatusIndicatorProps) {
  return (
    <div
      className={cn("rounded-full", statusColors[status], sizes[size], className)}
      aria-label={`Status: ${status}`}
    />
  )
}
