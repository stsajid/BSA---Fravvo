import { AnalyticsDashboard } from "@/components/organisms/analytics-dashboard"
import { getCurrentTenant } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/atoms/badge"
import { Download, RefreshCw, Calendar } from "lucide-react"

export default async function AnalyticsPage() {
  const tenant = await getCurrentTenant()

  if (!tenant) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Comprehensive insights for {tenant.organization.name}</p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Last 30 days
          </Badge>

          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard timeframe="30d" />
    </div>
  )
}
