"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, Search, Bell, Settings, LogOut, User, Moon, Sun, Command } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/providers/auth-provider"
import { GlobalCreateButton } from "@/components/global/create-button"

interface TopBarProps {
  onMenuClick: () => void
}

const notifications = [
  {
    id: "1",
    title: "New task assigned",
    description: "Sarah assigned you 'Review Q4 Budget'",
    time: "2 min ago",
    unread: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    title: "Meeting reminder",
    description: "Product sync in 15 minutes",
    time: "13 min ago",
    unread: true,
  },
  {
    id: "3",
    title: "Document shared",
    description: "Mike shared 'Design Guidelines' with you",
    time: "1 hour ago",
    unread: false,
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search or type a command..."
            className="w-80 pl-10 pr-12 bg-gray-50 border-gray-200 focus:bg-white"
            onClick={() => setSearchOpen(true)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Badge variant="outline" className="text-xs">
              <Command className="h-3 w-3 mr-1" />K
            </Badge>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Global Create Button */}
        <GlobalCreateButton />

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-gray-500">{unreadCount} unread</p>
            </div>
            <ScrollArea className="h-80">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${notification.unread ? "bg-blue-50" : ""}`}
                >
                  <div className="flex gap-3">
                    {notification.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Bell className="h-4 w-4 text-indigo-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-500 truncate">{notification.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full text-sm">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
