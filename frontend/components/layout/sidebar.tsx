"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  MessageSquare,
  Users,
  FileText,
  ClipboardList,
  Calendar,
  LayoutGrid,
  Sparkles,
  Workflow,
  LogOut,
  Settings,
  User,
  FolderOpen,
  Ticket,
  BookOpen,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  {
    name: "Home",
    href: "/home", // Changed to /home
    icon: Home,
    tooltip: {
      title: "Dashboard",
      description: "Your workspace overview at a glance.",
      cta: { text: "Go to Dashboard", href: "/home" },
    },
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpen,
    tooltip: {
      title: "Projects",
      description: "Manage your projects and tasks.",
      cta: { text: "View Projects", href: "/projects" },
    },
  },
  {
    name: "Fravvo AI",
    href: "/ai",
    icon: Sparkles,
    tooltip: {
      title: "Fravvo AI Assistant",
      description: "Ask, summarize, and take smart actions.",
      cta: { text: "Use AI", href: "/ai" },
    },
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
    tooltip: {
      title: "Documents",
      description: "Upload, view, and collaborate on files.",
      cta: { text: "Browse Docs", href: "/documents" },
    },
  },
  {
    name: "Forms",
    href: "/forms",
    icon: ClipboardList,
    tooltip: {
      title: "Forms",
      description: "Collect data with structured form submissions.",
      cta: { text: "Create Form", href: "/forms" },
    },
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageSquare,
    tooltip: {
      title: "Chat",
      description: "Message teammates in real time.",
      cta: { text: "Open Chat", href: "/chat" },
    },
  },
  {
    name: "Tickets",
    href: "/tickets",
    icon: Ticket,
    tooltip: {
      title: "Tickets",
      description: "Track and manage support tickets.",
      cta: { text: "View Tickets", href: "/tickets" },
    },
  },
  {
    name: "Scheduler",
    href: "/calendar",
    icon: Calendar,
    tooltip: {
      title: "Scheduler",
      description: "Book, manage, and sync your meetings.",
      cta: { text: "View Calendar", href: "/calendar" },
    },
  },
  {
    name: "Knowledgebase",
    href: "/knowledgebase",
    icon: BookOpen,
    tooltip: {
      title: "Knowledgebase",
      description: "Access and share company knowledge.",
      cta: { text: "Browse KB", href: "/knowledgebase" },
    },
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    tooltip: {
      title: "Users",
      description: "Manage users, roles, and permissions.",
      cta: { text: "Manage Users", href: "/users" },
    },
  },
  {
    name: "Workflows",
    href: "#",
    icon: Workflow,
    disabled: true,
    tooltip: {
      title: "Workflows (Coming Soon)",
      description: "Automate steps and streamline work across teams.",
      cta: { text: "Notify Me", href: "#" },
    },
  },
]

const adminNavigation = [
  {
    name: "Switch Workspace",
    href: "/workspaces",
    icon: LayoutGrid,
    tooltip: {
      title: "Switch Workspace",
      description: "Jump between your teams or companies.",
      cta: { text: "Change Workspace", href: "/workspaces" },
    },
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <div className="flex h-screen w-[70px] flex-col items-center border-r bg-white py-4">
        <div className="mb-6 flex h-[45px] w-[45px] items-center justify-center">
          <Image src="/icon_fravvo.svg" alt="Fravvo Icon" width={45} height={45} className="max-h-[45px] w-auto" />
        </div>

        <nav className="flex flex-1 flex-col items-center gap-4">
          {adminNavigation.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg",
                    pathname === item.href
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                  )}
                  asChild
                >
                  <Link href={item.href} passHref>
                    <item.icon className="h-6 w-6" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                <div className="max-w-xs">
                  <p className="font-medium">{item.tooltip.title}</p>
                  <p className="text-sm text-muted-foreground">{item.tooltip.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}

          <div className="my-4 h-px w-8 bg-gray-200" />

          {navigation.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg",
                    pathname === item.href
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                    item.disabled && "cursor-not-allowed opacity-50",
                  )}
                  disabled={item.disabled}
                  asChild={!item.disabled}
                >
                  {item.disabled ? (
                    <>
                      <item.icon className="h-6 w-6" />
                      <span className="sr-only">{item.name}</span>
                    </>
                  ) : (
                    <Link href={item.href} passHref>
                      <item.icon className="h-6 w-6" />
                      <span className="sr-only">{item.name}</span>
                    </Link>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                <div className="max-w-xs">
                  <p className="font-medium">{item.tooltip.title}</p>
                  <p className="text-sm text-muted-foreground">{item.tooltip.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/Avator + Company.svg" alt="User Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">Admin</p>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  )
}
