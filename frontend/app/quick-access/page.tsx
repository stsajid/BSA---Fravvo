"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Sparkles,
  Rss,
  MessageSquare,
  FileText,
  ClipboardList,
  CheckSquare,
  CalendarCheck,
  Building2,
  Workflow,
  LogOut,
  Settings,
  User,
  Grid3X3,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const tools = [
  {
    name: "Fravvo AI",
    description: "Smart assistant for everything",
    icon: Sparkles,
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600",
    href: "/ai",
    buttonText: "Open Fravvo AI",
    buttonColor: "text-purple-600",
  },
  {
    name: "Company Feed",
    description: "Company-wide social feeds",
    icon: Rss,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    href: "/feed",
    buttonText: "View Feed",
    buttonColor: "text-purple-600",
  },
  {
    name: "Team Messaging",
    description: "Real-time team chat system",
    icon: MessageSquare,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    href: "/chat",
    buttonText: "Open Chat",
    buttonColor: "text-purple-600",
  },
  {
    name: "Smart Documents",
    description: "Collaborative knowledge base hub",
    icon: FileText,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    href: "/docs",
    buttonText: "View Docs",
    buttonColor: "text-purple-600",
  },
  {
    name: "Dynamic Forms",
    description: "Flexible data collection forms",
    icon: ClipboardList,
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
    href: "/forms",
    buttonText: "Open Forms",
    buttonColor: "text-purple-600",
  },
  {
    name: "Project Tasks",
    description: "Visual project management board",
    icon: CheckSquare,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    href: "/tasks",
    buttonText: "View Tasks",
    buttonColor: "text-purple-600",
  },
  {
    name: "Calendar & Meetings",
    description: "Schedule meetings and calls",
    icon: CalendarCheck,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
    href: "/calendar",
    buttonText: "Open Calendar",
    buttonColor: "text-purple-600",
  },
  {
    name: "Workspaces",
    description: "Process automation",
    icon: Building2,
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
    href: "/workspaces",
    buttonText: "View Teams",
    buttonColor: "text-purple-600",
  },
  {
    name: "Workflows",
    description: "Automate tasks and actions",
    icon: Workflow,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    href: "#",
    buttonText: "Coming Soon",
    buttonColor: "text-gray-500",
  },
]

export default function QuickAccessPage() {
  const [userName, setUserName] = useState<string>("Emily Carter")
  const [userRole, setUserRole] = useState<string>("Product Manager")

  useEffect(() => {
    const step1Data = localStorage.getItem("onboarding_step_1")
    if (step1Data) {
      try {
        const data = JSON.parse(step1Data)
        setUserName(data.firstName || "Emily Carter")
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-[68px] flex items-center justify-between px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Image src="/fravvo_logo.svg" alt="Fravvo Logo" width={100} height={45} className="max-h-[45px] w-auto" />
        </div>
        <div className="flex items-center gap-4">
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
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-3 py-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold leading-none text-gray-900">{userName}</p>
                  <p className="text-xs leading-none text-gray-500">{userRole}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>View profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                <Link href="/quick-access" className="flex items-center">
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  <span>Quick Access</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Fravvo 👋</h1>
          <p className="text-lg text-gray-600">Your all-in-one workspace for modern teams</p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center`}>
                  <tool.icon className={`w-6 h-6 ${tool.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
              <Link href={tool.href} className={`inline-block text-sm font-medium ${tool.buttonColor} hover:underline`}>
                {tool.buttonText}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Ready to get started?</h2>
              <p className="text-purple-100">Try asking Fravvo AI for help or explore the tools above</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/ai"
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Ask AI
              </Link>
              <button className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-400 transition-colors flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Quick Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
