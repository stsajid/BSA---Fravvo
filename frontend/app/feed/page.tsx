"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Sparkles,
  Upload,
  Calendar,
  FileText,
  Users,
  Plus,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share,
  Download,
  ExternalLink,
  CheckSquare,
  Mic,
  Pin,
  TrendingUp,
  BarChart3,
  Clock,
  MapPin,
} from "lucide-react"

const breadcrumbItems = [
  { label: "Dashboard", href: "/home" },
  { label: "Team Feeds", href: "/feed" },
]

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("all-post")
  const [postContent, setPostContent] = useState("")

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar currentPath="/feed" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Team Feeds" description="Company wide Social Feeds" />

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
              {/* Main Feed Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Tab Navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 bg-white">
                    <TabsTrigger
                      value="all-post"
                      className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                    >
                      <FileText className="h-4 w-4" />
                      All Post
                    </TabsTrigger>
                    <TabsTrigger value="pinned" className="flex items-center gap-2">
                      <Pin className="h-4 w-4" />
                      Pinned
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Trending
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Analytics
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all-post" className="space-y-6 mt-6">
                    {/* Post Composer */}
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40&text=JD" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                              <Input
                                placeholder="What do you want to do?"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="flex-1 border-gray-200"
                              />
                              <Button variant="ghost" size="icon" className="text-gray-400">
                                <Mic className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 text-purple-600 border-purple-200"
                              >
                                <Sparkles className="h-4 w-4" />
                                Ask AI
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Upload
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <CheckSquare className="h-4 w-4" />
                                Assign Task
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <span className="h-4 w-4">📢</span>
                                Announcement
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Schedule
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Create Form
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Latest from Teams */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Latest from Teams</h3>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-purple-100 border-2 border-dashed border-purple-300 flex items-center justify-center mb-2">
                            <Plus className="h-6 w-6 text-purple-500" />
                          </div>
                          <span className="text-sm text-center">Add Status</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg mb-2">
                            UI
                          </div>
                          <span className="text-sm text-center">UI/UX Team</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                            PM
                          </div>
                          <span className="text-sm text-center">Product M...</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                            MK
                          </div>
                          <span className="text-sm text-center">Marketing</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                            HR
                          </div>
                          <span className="text-sm text-center">Human Re...</span>
                        </div>
                      </div>
                    </div>

                    {/* Feed Posts */}
                    <div className="space-y-6">
                      {/* Michael Thompson Post */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40&text=MT" />
                              <AvatarFallback>MT</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Michael Thompson</span>
                                <span className="text-purple-600">• Product Manager</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="text-blue-500">Updated a document</span>
                                <span>• Today at 8:45 AM</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p>
                            Here's the updated product roadmap for QA-2025. Please review and provide your feedback by
                            the end of the week.
                          </p>

                          {/* Document Attachment */}
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border">
                            <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                              <span className="text-white font-bold text-sm">W</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Q2-2025-Product-Roadmap.docx</p>
                              <p className="text-sm text-muted-foreground">2.4 MB • Added Today</p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Schedule Review
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Open in Doc
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4" />
                              Create Task
                            </Button>
                          </div>

                          {/* AI Summary */}
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            AI Summary
                          </Button>

                          {/* Quick Reactions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Looks good
                            </Button>
                            <Button variant="outline" size="sm">
                              I'll review
                            </Button>
                            <Button variant="outline" size="sm">
                              Clarify?
                            </Button>
                          </div>

                          {/* Post Actions */}
                          <div className="flex items-center gap-4 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4" />1
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />2
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Share className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Sarah Johnson Post */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40&text=SJ" />
                              <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Sarah Johnson</span>
                                <span className="text-purple-600">• UX Designer</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="text-green-500">Shared a design</span>
                                <span>• Yesterday at 3:22 PM</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p>
                            Here's a preview of the new dashboard design we've been working on. Would love to get
                            everyone's thoughts!
                          </p>

                          {/* Design Preview Image */}
                          <div className="rounded-lg overflow-hidden border">
                            <img
                              src="/placeholder.svg?height=300&width=500&text=Dashboard+Design+Preview"
                              alt="Dashboard Design Preview"
                              className="w-full h-auto"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />
                              Provide Feedback
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4" />
                              Create Task
                            </Button>
                          </div>

                          {/* AI Summary */}
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            AI Summary
                          </Button>

                          {/* Quick Reactions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Looks good
                            </Button>
                            <Button variant="outline" size="sm">
                              Clarify?
                            </Button>
                          </div>

                          {/* Post Actions */}
                          <div className="flex items-center gap-4 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4" />1
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />2
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Share className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* David Wilson Post */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40&text=DW" />
                              <AvatarFallback>DW</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">David Wilson</span>
                                <span className="text-purple-600">• Project Lead</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="text-orange-500">Assigned a ticket</span>
                                <span>• Yesterday at 5:15 PM</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p>Assigned a new ticket for the mobile app navigation issue.</p>

                          {/* Ticket Card */}
                          <div className="border rounded-lg p-4 bg-orange-50">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-sm">
                                T
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-orange-700">FRA-342: Mobile Navigation Bug</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Users are reporting that the bottom navigation bar disappears when switching between
                                  tabs on Android devices running OS version 12 and above.
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                  <span>Due Tomorrow • 5:00 PM</span>
                                  <div className="flex items-center gap-1">
                                    <span>Assigned to:</span>
                                    <div className="flex -space-x-1">
                                      <Avatar className="h-6 w-6 border-2 border-white">
                                        <AvatarImage src="/placeholder.svg?height=24&width=24&text=A1" />
                                        <AvatarFallback className="text-xs">A1</AvatarFallback>
                                      </Avatar>
                                      <Avatar className="h-6 w-6 border-2 border-white">
                                        <AvatarImage src="/placeholder.svg?height=24&width=24&text=A2" />
                                        <AvatarFallback className="text-xs">A2</AvatarFallback>
                                      </Avatar>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4" />
                              Accept Task
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Create Branch
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              View Task
                            </Button>
                          </div>

                          {/* AI Summary */}
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            AI Summary
                          </Button>

                          {/* Quick Reactions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Looks good
                            </Button>
                            <Button variant="outline" size="sm">
                              Clarify?
                            </Button>
                          </div>

                          {/* Post Actions */}
                          <div className="flex items-center gap-4 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4" />1
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />2
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Share className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Emily Rodriguez Post */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40&text=ER" />
                              <AvatarFallback>ER</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Emily Rodriguez</span>
                                <span className="text-purple-600">• Team Lead</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="text-blue-500">Scheduled a meeting</span>
                                <span>• Today at 9:30 AM</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p>
                            I've scheduled a sprint planning meeting for tomorrow. Please review the agenda and come
                            prepared with your updates.
                          </p>

                          {/* Meeting Card */}
                          <div className="border rounded-lg p-4 bg-blue-50">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-blue-700">Sprint Planning Meeting - May 2025</h4>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>May 16</span>
                                  </div>
                                  <span>10:00 AM - 11:30 AM</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>Main Conference Room</span>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                  <div className="flex -space-x-1">
                                    <Avatar className="h-6 w-6 border-2 border-white">
                                      <AvatarImage src="/placeholder.svg?height=24&width=24&text=A1" />
                                      <AvatarFallback className="text-xs">A1</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="h-6 w-6 border-2 border-white">
                                      <AvatarImage src="/placeholder.svg?height=24&width=24&text=A2" />
                                      <AvatarFallback className="text-xs">A2</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="h-6 w-6 border-2 border-white">
                                      <AvatarImage src="/placeholder.svg?height=24&width=24&text=A3" />
                                      <AvatarFallback className="text-xs">A3</AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Join Meeting
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4" />
                              Accept Task
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Create Branch
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              View Task
                            </Button>
                          </div>

                          {/* AI Summary */}
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            AI Summary
                          </Button>

                          {/* Quick Reactions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Looks good
                            </Button>
                            <Button variant="outline" size="sm">
                              Clarify?
                            </Button>
                          </div>

                          {/* Post Actions */}
                          <div className="flex items-center gap-4 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4" />1
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />2
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Share className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Thomas Lee Post */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40&text=TL" />
                              <AvatarFallback>TL</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Thomas Lee</span>
                                <span className="text-purple-600">• HR Manager</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="text-green-500">Shared a form</span>
                                <span>• Yesterday at 2:15 PM</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p>
                            Please fill out the quarterly team satisfaction survey by the end of this week. Your
                            feedback is important!
                          </p>

                          {/* Survey Form */}
                          <div className="border rounded-lg p-4 bg-green-50">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-green-700">2025 Training Preferences</h4>
                                <div className="mt-3">
                                  <Input placeholder="Fill out the form" className="bg-white border-green-200" />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Responses due by Thursday, May 16, 2025</p>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />
                              Remind Me Later
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Schedule Meeting
                            </Button>
                          </div>

                          {/* AI Summary */}
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            AI Summary
                          </Button>

                          {/* Quick Reactions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Looks good
                            </Button>
                            <Button variant="outline" size="sm">
                              Clarify?
                            </Button>
                          </div>

                          {/* Post Actions */}
                          <div className="flex items-center gap-4 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4" />1
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />2
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Share className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="pinned">
                    <div className="text-center py-12">
                      <Pin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No pinned posts yet.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="trending">
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No trending posts at the moment.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics">
                    <div className="text-center py-12">
                      <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Analytics coming soon.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* My Teams */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <h3 className="font-semibold">My Teams</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        UI
                      </div>
                      <span className="text-sm">UI/UX Team</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                        PM
                      </div>
                      <span className="text-sm">Product Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center text-white font-bold text-sm">
                        MK
                      </div>
                      <span className="text-sm">Marketing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        HR
                      </div>
                      <span className="text-sm">Human Resources</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2 mt-4">
                      <Users className="h-4 w-4" />
                      Create New Team
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Meetings */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <h3 className="font-semibold">Upcoming Meetings</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">📅</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Design Review</p>
                        <p className="text-xs text-muted-foreground">10:30 AM - 11:00 AM</p>
                        <p className="text-xs text-muted-foreground">Today - 30 min</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">📅</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Check-in with John</p>
                        <p className="text-xs text-muted-foreground">12:00 PM - 1:30 PM</p>
                        <p className="text-xs text-muted-foreground">Today - 1 hr 30 min</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">📅</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Sprint Planning</p>
                        <p className="text-xs text-muted-foreground">2:30 PM - 4:30 PM</p>
                        <p className="text-xs text-muted-foreground">Tomorrow - 2 hr</p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2 mt-4">
                      <Calendar className="h-4 w-4" />
                      Create New Meeting
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
