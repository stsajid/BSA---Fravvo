"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Home,
  FolderOpen,
  FileText,
  ClipboardList,
  MessageSquare,
  Ticket,
  Calendar,
  BookOpen,
  Users,
  Sparkles,
} from "lucide-react"

interface SidebarProps {
  currentPath: string
}

export function AppSidebar({ currentPath }: SidebarProps) {
  const [isWorkspaceHovered, setIsWorkspaceHovered] = useState(false)

  const sidebarNavItems = [
    {
      label: "Workspace",
      active: false,
      customIcon: "/Avator + Company.svg",
      hoverIcon: "/Company+Avator.svg",
      isWorkspace: true,
    },
    { icon: Home, label: "Home", active: currentPath === "/home", href: "/home" },
    { icon: FolderOpen, label: "Projects", active: currentPath === "/projects", href: "/projects" },
    { icon: Sparkles, label: "Fravvo AI", active: currentPath === "/ai", href: "/ai" },
    { icon: FileText, label: "Documents", active: currentPath === "/documents", href: "/documents" },
    { icon: ClipboardList, label: "Forms", active: currentPath === "/forms", href: "/forms" },
    { icon: MessageSquare, label: "Chat", active: currentPath === "/chat", href: "/chat" },
    { icon: Ticket, label: "Tickets", active: currentPath === "/tickets", href: "/tickets" },
    { icon: Calendar, label: "Calendar", active: currentPath === "/calendar", href: "/calendar" },
    { icon: BookOpen, label: "Knowledgebase", active: currentPath === "/knowledgebase", href: "/knowledgebase" },
    { icon: Users, label: "Users", active: currentPath === "/users", href: "/users" },
  ]

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col">
      {/* Topmost Fravvo Logo - Exactly 68px to match header with padding-top */}
      <div className="flex items-center justify-center h-[68px] mx-2" style={{ paddingTop: "10px" }}>
        <Image src="/icon_fravvo.svg" alt="Fravvo Logo" width={45} height={45} className="w-[45px] h-[45px]" />
      </div>

      {/* Workspace Switcher */}
      {sidebarNavItems.map((item, index) => {
        if (item.isWorkspace) {
          return (
            <div
              key={index}
              className="flex items-center justify-center h-12 mx-2 mb-2 mt-4 rounded-lg cursor-pointer transition-colors relative"
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
                  <item.icon className="w-6 h-6" />
                </div>
              </Link>
            )
          }
        })}
      </div>
    </div>
  )
}
