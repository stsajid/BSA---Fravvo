"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Building2, Globe, Shield, Bell, Upload, Palette } from "lucide-react"

const tabs = [
  {
    id: "branding",
    label: "Company Branding",
    icon: Palette,
  },
  {
    id: "organization",
    label: "Organization Details",
    icon: Building2,
  },
  {
    id: "timezone",
    label: "Timezone & Locale",
    icon: Globe,
  },
  {
    id: "security",
    label: "Security Settings",
    icon: Shield,
  },
]

const themeColors = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#10B981", // Green
  "#F59E0B", // Orange
  "#EF4444", // Red
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("branding")
  const [settings, setSettings] = useState({
    companyName: "Bluewave Technologies",
    industry: "Technology",
    timezone: "UTC (GMT + 0)",
    dateFormat: "mm/dd/yyyy",
    twoFactorAuth: true,
    sessionTimeout: false,
    weeklyDigest: false,
    securityAlerts: false,
    systemUpdates: false,
    themeColor: "#8B5CF6",
  })

  const breadcrumbItems = [
    { label: "Dashboard", href: "/home" },
    { label: "Admin Setting", href: "/admin-settings", current: true },
  ]

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "branding":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Organization Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                      F
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG upto 5 MB</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Theme Color</Label>
                  <div className="mt-2 flex items-center gap-2">
                    {themeColors.map((color) => (
                      <button
                        key={color}
                        className={`h-8 w-8 rounded-full border-2 ${
                          settings.themeColor === color ? "border-gray-400" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleSettingChange("themeColor", color)}
                      />
                    ))}
                    <button className="h-8 w-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full border border-gray-300 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "organization":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => handleSettingChange("companyName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={settings.industry} onValueChange={(value) => handleSettingChange("industry", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <textarea
                    id="description"
                    className="mt-1 w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter company description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="https://example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "timezone":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Timezone & Locale Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC (GMT + 0)">UTC (GMT + 0)</SelectItem>
                        <SelectItem value="EST (GMT - 5)">EST (GMT - 5)</SelectItem>
                        <SelectItem value="PST (GMT - 8)">PST (GMT - 8)</SelectItem>
                        <SelectItem value="JST (GMT + 9)">JST (GMT + 9)</SelectItem>
                        <SelectItem value="CET (GMT + 1)">CET (GMT + 1)</SelectItem>
                        <SelectItem value="IST (GMT + 5:30)">IST (GMT + 5:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={settings.dateFormat}
                      onValueChange={(value) => handleSettingChange("dateFormat", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">mm/dd/yyyy</SelectItem>
                        <SelectItem value="dd/mm/yyyy">dd/mm/yyyy</SelectItem>
                        <SelectItem value="yyyy-mm-dd">yyyy-mm-dd</SelectItem>
                        <SelectItem value="dd-mm-yyyy">dd-mm-yyyy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select defaultValue="12h">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Session Timeout</Label>
                    <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                  </div>
                  <Switch
                    checked={settings.sessionTimeout}
                    onCheckedChange={(checked) => handleSettingChange("sessionTimeout", checked)}
                  />
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Password Policy</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Minimum 8 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Require uppercase letters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Require numbers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Require special characters</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Email & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Weekly Digest</Label>
                    <p className="text-sm text-gray-500">Summary of organization activity</p>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => handleSettingChange("weeklyDigest", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Security Alerts</Label>
                    <p className="text-sm text-gray-500">Login attempts and security events</p>
                  </div>
                  <Switch
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => handleSettingChange("securityAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">System Updates</Label>
                    <p className="text-sm text-gray-500">New features and maintenance notices</p>
                  </div>
                  <Switch
                    checked={settings.systemUpdates}
                    onCheckedChange={(checked) => handleSettingChange("systemUpdates", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar currentPath="/admin-settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Admin Setting" description="Branding, security, notification" />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-6">
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="flex gap-6">
              {/* Left Sidebar - Tabs */}
              <div className="w-64 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-purple-100 text-purple-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Main Content */}
              <div className="flex-1">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
