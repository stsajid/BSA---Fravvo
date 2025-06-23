"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  FolderOpen,
  FileText,
  ClipboardList,
  MessageSquare,
  Ticket,
  Calendar,
  BookOpen,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Command,
  UserPlus,
  Building2,
  Cog,
  CheckCircle,
  Upload,
  UserRoundPlus,
  Briefcase,
  Sparkles,
  Grid3X3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function HomePage() {
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("Emily Carter")
  const [userRole, setUserRole] = useState<string>("Product Manager")
  const [isWorkspaceHovered, setIsWorkspaceHovered] = useState(false)

  useEffect(() => {
    // Get user data from localStorage
    const step1Data = localStorage.getItem("onboarding_step_1")
    if (step1Data) {
      try {
        const data = JSON.parse(step1Data)
        setUserName(data.firstName || "Emily Carter")
        setUserAvatar(data.organizationLogo || null)
      } catch (error) {
        console.error("Error parsing step 1 data:", error)
        setUserName("Emily Carter")
      }
    }
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const sidebarNavItems = [
    {
      label: "Workspace",
      active: false,
      customIcon: "/Avator + Company.svg",
      hoverIcon: "/Company+Avator.svg",
      isWorkspace: true,
    },
    { icon: Home, label: "Home", active: true, href: "/home" }, // Active for Home page
    { icon: FolderOpen, label: "Projects", active: false, href: "/projects" },
    {
      icon: Sparkles,
      label: "Fravvo AI",
      active: false,
      href: "/ai",
    },
    { icon: FileText, label: "Documents", active: false, href: "/documents" },
    { icon: ClipboardList, label: "Forms", active: false, href: "/forms" },
    { icon: MessageSquare, label: "Chat", active: false, href: "/chat" },
    { icon: Ticket, label: "Tickets", active: false, href: "/tickets" },
    { icon: Calendar, label: "Calendar", active: false, href: "/calendar" },
    { icon: BookOpen, label: "Knowledgebase", active: false, href: "/knowledgebase" },
    // Removed Users from sidebar navigation as requested
  ]

  const recentActivity = [
    {
      id: 1,
      icon: CheckCircle,
      color: "text-[#6a1b9a]", // Purple
      text: 'Emily Ross marked "Design Homepage" as Complete',
      time: "2 min ago",
    },
    {
      id: 2,
      icon: Upload,
      color: "text-[#1e88e5]", // Blue
      text: 'Jacob Lee uploaded "Q3 Budget Report" to Marketing Docs',
      time: "2 min ago",
    },
    {
      id: 3,
      icon: UserRoundPlus,
      color: "text-[#2e7d32]", // Green
      text: "Samantha Green joined the Product Team",
      time: "12 minutes ago",
    },
    {
      id: 4,
      icon: Briefcase,
      color: "text-[#e65100]", // Orange
      text: 'Project "LathranSuite v2" moved to In Progress',
      time: "18 minutes ago",
    },
    {
      id: 5,
      icon: FileText,
      color: "text-[#ad1457]", // Red
      text: "Michael Chan submitted a Leave Request Form",
      time: "30 minutes ago",
    },
    {
      id: 6,
      icon: Calendar,
      color: "text-[#f9a825]", // Yellow
      text: "Weekly Sync Call scheduled by Olivia James for Friday at 10:00 AM",
      time: "35 minutes ago",
    },
  ]

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#F5F5F7" }}>
      {/* Left Sidebar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col">
        {/* Topmost Fravvo Logo */}
        <div className="flex items-center justify-center h-12 mx-2 mt-4 mb-4 pb-4">
          <Image
            src="/icon_fravvo.svg"
            alt="Fravvo Logo"
            width={45}
            height={45}
            className="w-[45px] h-[45px]"
            style={{ paddingTop: "10px" }}
          />
        </div>

        {/* Workspace Switcher (Flipping Icon with Avatar) */}
        {sidebarNavItems.map((item, index) => {
          if (item.isWorkspace) {
            return (
              <div
                key={index}
                className={`flex items-center justify-center h-12 mx-2 mb-2 rounded-lg cursor-pointer transition-colors relative`}
                onMouseEnter={() => setIsWorkspaceHovered(true)}
                onMouseLeave={() => setIsWorkspaceHovered(false)}
              >
                <Image
                  src={isWorkspaceHovered ? item.hoverIcon : item.customIcon || "/placeholder.svg"}
                  alt={item.label}
                  width={68}
                  height={68}
                  className="w-[68px] h-[68px] transition-transform duration-300 ease-in-out transform hover:rotate-y-180"
                />
              </div>
            )
          }
        })}

        {/* Main Navigation Icons */}
        <div className="flex-1 py-4">
          {sidebarNavItems.map((item, index) => {
            if (item.isWorkspace) {
              return null
            } else {
              return (
                <Link href={item.href} key={index} passHref>
                  <div
                    className={`flex items-center justify-center h-12 mx-2 mb-2 rounded-lg cursor-pointer transition-colors relative ${
                      item.active ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.customIcon ? (
                      <Image
                        src={item.customIcon || "/placeholder.svg"}
                        alt={item.label}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    ) : (
                      <item.icon className="w-6 h-6" />
                    )}
                  </div>
                </Link>
              )
            }
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header - 68px */}
        <header className="h-[68px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
          {/* Left side - Only Title */}
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Manage users, roles and permissions</p>
            </div>
          </div>
          {/* Right side only - Search, Notifications, Actions, Avatar */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search everything… Ctrl + k"
                className="pl-10 pr-12 w-80 bg-gray-50 border-gray-200"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-gray-400">
                <Command className="w-3 h-3" />
                <span className="text-xs">K</span>
              </div>
            </div>

            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* Plus Button */}
            <Button size="icon" className="bg-purple-600 hover:bg-purple-700 rounded-full">
              <Plus className="w-5 h-5" />
            </Button>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-600 text-white font-semibold text-sm relative">
                      {getInitials(userName)}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-semibold leading-none text-gray-900">{userName}</p>
                    <p className="text-sm leading-none text-gray-500">{userRole}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <User className="mr-3 h-4 w-4" />
                  <span>View profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <Link href="/quick-access" className="flex items-center">
                    <Grid3X3 className="mr-3 h-4 w-4" />
                    <span>Quick Access</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="px-3 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content - Dashboard */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome 🎉, Emily Carter. Here's your organization overview
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h2>
              <p className="text-4xl font-bold text-gray-900 mb-4">247</p>
              <div className="flex space-x-2">
                <Badge className="bg-[#e3f2fd] text-[#1e88e5] hover:bg-[#e3f2fd]">Manager :12</Badge>
                <Badge className="bg-[#f3e5f5] text-[#6a1b9a] hover:bg-[#f3e5f5]">Members: 235</Badge>
              </div>
            </Card>
            <Card className="p-6 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Plan Usage</h2>
              <p className="text-4xl font-bold text-gray-900 mb-4">78%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-[#6c5ce7] h-2.5 rounded-full" style={{ width: "78%" }}></div>
              </div>
              <p className="text-sm text-[#6c5ce7] font-medium">Enterprise Plan</p>
            </Card>
            <Card className="p-6 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">AI Usage</h2>
              <p className="text-4xl font-bold text-gray-900 mb-2">1,234</p>
              <p className="text-sm text-gray-500 mb-4">Queries this month</p>
              <div className="flex items-center text-[#2ecc71] text-sm font-medium">
                <ChevronDown className="w-4 h-4 rotate-180" />
                <span>+23% vs last month</span>
              </div>
            </Card>
            <Card className="p-6 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Active Projects</h2>
              <p className="text-4xl font-bold text-gray-900 mb-4">18</p>
              <div className="flex items-center text-[#2e7d32] text-sm font-medium">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>3 Completing this week</span>
              </div>
            </Card>
          </div>

          {/* Quick Action buttons */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Action</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/users">
                <Card className="p-4 rounded-xl shadow-sm bg-white flex items-center space-x-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Add New User</h3>
                    <p className="text-sm text-gray-500">Invite team members</p>
                  </div>
                </Card>
              </Link>
              <Link href="/structure">
                <Card className="p-4 rounded-xl shadow-sm bg-white flex items-center space-x-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Manage Structure</h3>
                    <p className="text-sm text-gray-500">Team, departments, office</p>
                  </div>
                </Card>
              </Link>
              <Link href="/admin-settings">
                <Card className="p-4 rounded-xl shadow-sm bg-white flex items-center space-x-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <Cog className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Admin Setting</h3>
                    <p className="text-sm text-gray-500">Branding, security, notification</p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <Card className="p-6 rounded-xl shadow-sm bg-white">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <activity.icon className={cn("w-5 h-5", activity.color)} />
                    <p className="text-gray-700">
                      {activity.text} <span className="text-gray-500">• {activity.time}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
