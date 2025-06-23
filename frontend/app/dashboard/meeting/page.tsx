"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, Users, Plus, Search, Filter, MoreHorizontal, MapPin } from "lucide-react"

export default function MeetingPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const upcomingMeetings = [
    {
      id: 1,
      title: "Design Review",
      time: "10:30 AM - 11:00 AM",
      date: "Today",
      type: "video",
      attendees: 4,
      location: "Conference Room A",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Sprint Planning",
      time: "2:00 PM - 3:30 PM",
      date: "Today",
      type: "video",
      attendees: 8,
      location: "Virtual",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Client Presentation",
      time: "9:00 AM - 10:00 AM",
      date: "Tomorrow",
      type: "video",
      attendees: 6,
      location: "Virtual",
      status: "upcoming",
    },
    {
      id: 4,
      title: "Team Standup",
      time: "9:30 AM - 10:00 AM",
      date: "Tomorrow",
      type: "video",
      attendees: 12,
      location: "Virtual",
      status: "recurring",
    },
  ]

  const recentMeetings = [
    {
      title: "Product Strategy Meeting",
      date: "Yesterday",
      duration: "1h 30m",
      attendees: 6,
    },
    {
      title: "Design System Review",
      date: "2 days ago",
      duration: "45m",
      attendees: 4,
    },
    {
      title: "All Hands Meeting",
      date: "1 week ago",
      duration: "1h",
      attendees: 25,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-500">Schedule and manage your team meetings</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Calendar View
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Video className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Start Instant Meeting</h3>
                <p className="text-sm text-gray-500">Begin a meeting now</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Schedule Meeting</h3>
                <p className="text-sm text-gray-500">Plan for later</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Join Meeting</h3>
                <p className="text-sm text-gray-500">Enter meeting ID</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                        {meeting.status === "recurring" && (
                          <Badge variant="secondary" className="text-xs">
                            Recurring
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{meeting.attendees} attendees</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        {meeting.location === "Virtual" ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        <span>{meeting.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Join
                      </Button>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">2 meetings scheduled</p>
                <p className="text-xs text-gray-400">Next meeting in 2 hours</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMeetings.map((meeting, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <h4 className="font-medium text-gray-900 text-sm">{meeting.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{meeting.date}</span>
                    <span>{meeting.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                    <Users className="h-3 w-3" />
                    <span>{meeting.attendees} attendees</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Meeting Rooms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meeting Rooms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Conference Room A</span>
                <Badge variant="secondary" className="text-xs">
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Conference Room B</span>
                <Badge variant="destructive" className="text-xs">
                  Occupied
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Meeting Room C</span>
                <Badge variant="secondary" className="text-xs">
                  Available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
