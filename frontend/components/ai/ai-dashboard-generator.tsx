"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, TrendingUp, Users, Target } from "lucide-react"

export function AIDashboardGenerator() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI Dashboard Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Describe the dashboard you want to create..." />
          <Button className="w-full">Generate Dashboard</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Team Performance", value: "94%", icon: Users, trend: "+5%" },
          { title: "Project Completion", value: "87%", icon: Target, trend: "+12%" },
          { title: "Task Velocity", value: "23/week", icon: TrendingUp, trend: "+8%" },
          { title: "AI Usage", value: "156", icon: BarChart3, trend: "+25%" },
        ].map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-green-600">{metric.trend}</p>
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
