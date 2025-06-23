"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Video, Users, MoreHorizontal } from "lucide-react"

// Sample meeting data
const meetings = [
  {
    id: 1,
    title: "Team Standup",
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    endTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours from now
    attendees: [
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32&text=SJ" },
      { name: "Michael Chen", avatar: "/placeholder.svg?height=32&width=32&text=MC" },
      { name: "Alex Wong", avatar: "/placeholder.svg?height=32&width=32&text=AW" },
    ],
    isVirtual: true,
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    title: "Product Review",
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    attendees: [
      { name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32&text=ED" },
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32&text=JD" },
    ],
    isVirtual: true,
    meetingLink: "https://zoom.us/j/1234567890",
  },
  {
    id: 3,
    title: "Client Meeting",
    startTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    attendees: [
      { name: "Lisa Wang", avatar: "/placeholder.svg?height=32&width=32&text=LW" },
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32&text=JD" },
    ],
    isVirtual: false,
    location: "Conference Room A",
  },
]

export function UpcomingMeetings() {
  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{meeting.title}</h4>
              <p className="text-xs text-muted-foreground">
                {format(meeting.startTime, "h:mm a")} - {format(meeting.endTime, "h:mm a")}
              </p>
            </div>

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex -space-x-2">
              {meeting.attendees.map((attendee, i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                  <AvatarFallback>{attendee.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              ))}
              {meeting.attendees.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                  +{meeting.attendees.length - 3}
                </div>
              )}
            </div>

            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${meeting.isVirtual ? "text-blue-500" : "text-green-500"}`}
            >
              {meeting.isVirtual ? (
                <>
                  <Video className="h-3 w-3" />
                  Virtual
                </>
              ) : (
                <>
                  <Users className="h-3 w-3" />
                  In Person
                </>
              )}
            </Badge>
          </div>

          {meeting.isVirtual && (
            <div className="mt-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Join Meeting
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
