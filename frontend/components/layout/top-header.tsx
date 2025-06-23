"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, Plus, Settings, LogOut, User, Command, Grid3X3 } from "lucide-react"
import Link from "next/link"

export function TopHeader() {
  const pathname = usePathname()
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [userRole, setUserRole] = useState<string>("Member")

  useEffect(() => {
    const step1Data = localStorage.getItem("onboarding_step_1")
    if (step1Data) {
      try {
        const data = JSON.parse(step1Data)
        setUserName(data.firstName || "User")
        setUserAvatar(data.organizationLogo || null)
      } catch (error) {
        console.error("Error parsing step 1 data:", error)
        setUserName("User")
      }
    }
  }, [])

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const getPageInfo = (path: string) => {
    if (path === "/home") {
      return { title: "Dashboard", description: "Manage users, roles and permissions" }
    }
    if (path === "/ai") {
      return { title: "Fravvo AI", description: "Your intelligent workspace assistant" }
    }
    // Add more routes as needed
    return { title: "", description: "" }
  }

  const { title, description } = getPageInfo(pathname)

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left side - Only Title */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {/* Right side only - Search, Notifications, Actions, Avatar */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search everything… Ctrl + k" className="pl-10 pr-12 w-80 bg-gray-50 border-gray-200" />
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
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {userAvatar ? (
                  <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-purple-600 text-white font-semibold text-sm">
                    {getInitials(userName)}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userRole}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/quick-access" className="flex items-center">
                <Grid3X3 className="mr-2 h-4 w-4" />
                <span>Quick Access</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
