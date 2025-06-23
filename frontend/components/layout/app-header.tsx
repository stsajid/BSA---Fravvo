"use client"

import { useState, useEffect } from "react"
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
import { Search, Bell, Plus, Settings, LogOut, User, Command, Grid3X3 } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  title: string
  description: string
}

export function AppHeader({ title, description }: HeaderProps) {
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
    <header className="h-[68px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left side - Title aligned with icon_fravvo at exact center */}
      <div className="flex items-center h-full">
        <div className="flex flex-col justify-center">
          <h1 className="font-semibold text-gray-900 leading-tight">{title}</h1>
          <p className="text-sm text-gray-500 leading-tight">{description}</p>
        </div>
      </div>

      {/* Right side - Search, Notifications, Actions, Avatar */}
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
    </header>
  )
}
