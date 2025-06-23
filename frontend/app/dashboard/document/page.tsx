"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, FileText, Folder, MoreHorizontal, Star, Download, Share, Eye, Filter } from "lucide-react"

export default function DocumentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const documents = [
    {
      id: 1,
      name: "Q4 Product Roadmap",
      type: "document",
      size: "2.4 MB",
      modified: "2 hours ago",
      author: "John Doe",
      starred: true,
      shared: true,
    },
    {
      id: 2,
      name: "Design System Guidelines",
      type: "document",
      size: "1.8 MB",
      modified: "1 day ago",
      author: "Sarah Wilson",
      starred: false,
      shared: true,
    },
    {
      id: 3,
      name: "Marketing Assets",
      type: "folder",
      items: 24,
      modified: "3 days ago",
      author: "Mike Johnson",
      starred: false,
      shared: false,
    },
    {
      id: 4,
      name: "Team Meeting Notes",
      type: "document",
      size: "856 KB",
      modified: "1 week ago",
      author: "Emily Davis",
      starred: true,
      shared: false,
    },
  ]

  const recentDocuments = [
    { name: "Sprint Planning Notes", author: "John Doe", time: "2 hours ago" },
    { name: "User Research Report", author: "Sarah Wilson", time: "1 day ago" },
    { name: "API Documentation", author: "Mike Johnson", time: "2 days ago" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500">Manage and organize your team documents</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Create Document</h3>
                <p className="text-sm text-gray-500">Start a new document</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Folder className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">New Folder</h3>
                <p className="text-sm text-gray-500">Organize your files</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Share className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Share Files</h3>
                <p className="text-sm text-gray-500">Collaborate with team</p>
              </CardContent>
            </Card>
          </div>

          {/* Documents Grid */}
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {doc.type === "folder" ? (
                          <Folder className="h-8 w-8 text-blue-600" />
                        ) : (
                          <FileText className="h-8 w-8 text-purple-600" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                          <p className="text-sm text-gray-500">
                            {doc.type === "folder" ? `${doc.items} items` : doc.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {doc.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        {doc.shared && (
                          <Badge variant="secondary" className="text-xs">
                            Shared
                          </Badge>
                        )}
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {doc.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{doc.author}</span>
                      </div>
                      <span>{doc.modified}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDocuments.map((doc, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.author} • {doc.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Storage Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used</span>
                  <span>2.4 GB of 10 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "24%" }}></div>
                </div>
                <p className="text-xs text-gray-500">7.6 GB available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
