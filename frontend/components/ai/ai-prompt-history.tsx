"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, RefreshCw, Copy, Trash2 } from "lucide-react"

const mockHistory = [
  {
    id: "1",
    prompt: "Create a project update for the marketing team",
    category: "Documents",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    prompt: "Summarize today's team standup",
    category: "Meetings",
    timestamp: "4 hours ago",
    status: "completed",
  },
  {
    id: "3",
    prompt: "Generate task breakdown for Q1 planning",
    category: "Tasks",
    timestamp: "1 day ago",
    status: "completed",
  },
]

export function AIPromptHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Prompt History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {mockHistory.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium">{item.prompt}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                    </div>
                  </div>
                  <Badge variant={item.status === "completed" ? "default" : "secondary"}>{item.status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Reuse
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="mr-2 h-3 w-3" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
