"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Search,
  Bell,
  Plus,
  Command,
  UserPlus,
  Building2,
  Cog,
  TrendingUp,
} from "lucide-react"
import { SimpleTooltip } from "@/components/ui/simple-tooltip"
import { RichTooltipContent } from "@/components/ui/rich-tooltip-content"

const sidebarNavItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
    tooltip: {
      title: "Dashboard",
      description: "Your workspace overview at a glance.",
      cta: { text: "Go to Dashboard", href: "/dashboard" },
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

function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-[70px] flex-col items-center border-r bg-white py-4">
      <div className="mb-6 flex h-[45px] w-[45px] items-center justify-center">
        <Image src="/icon_fravvo.svg" alt="Fravvo Icon" width={45} height={45} className="max-h-[45px] w-auto" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-4">
        {adminNavigation.map((item) => (
          <SimpleTooltip
            key={item.name}
            content={
              <RichTooltipContent
                title={item.tooltip.title}
                description={item.tooltip.description}
                cta={item.tooltip.cta}
              />
            }
            side="right"
            sideOffset={12}
          >
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
              <Link href={item.href}>
                <item.icon className="h-6 w-6" />
                <span className="sr-only">{item.name}</span>
              </Link>
            </Button>
          </SimpleTooltip>
        ))}

        <div className="my-4 h-px w-8 bg-gray-200" />

        {sidebarNavItems.map((item) => (
          <SimpleTooltip
            key={item.name}
            content={
              <RichTooltipContent
                title={item.tooltip.title}
                description={item.tooltip.description}
                cta={item.tooltip.cta}
              />
            }
            side="right"
            sideOffset={12}
          >
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
                <Link href={item.href}>
                  <item.icon className="h-6 w-6" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              )}
            </Button>
          </SimpleTooltip>
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
  )
}

function TopHeader() {
  return (
    <header className="flex h-[70px] items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Manage users, roles and permissions</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search everything... Ctrl + k" className="w-80 pl-10 pr-4" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
        </Button>

        <Button size="icon" className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Command className="h-5 w-5" />
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarImage src="/Company+Avator.svg" alt="User Avatar" />
          <AvatarFallback>EC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: "#F5F5F7" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1400px] mx-auto p-6">
            <div className="mb-8 flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/Company+Avator.svg" alt="Emily Carter" />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome 🎉, Emily Carter. Here's your organization overview
                </h1>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">247</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Manager: 12
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          Members: 235
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <p className="text-sm font-medium text-gray-600">Plan Usage</p>
                      <p className="text-3xl font-bold text-gray-900">78%</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                      <p className="mt-2 text-sm text-blue-600 font-medium">Enterprise Plan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">AI Usage</p>
                      <p className="text-3xl font-bold text-gray-900">1,234</p>
                      <p className="text-sm text-gray-500">Queries this month</p>
                      <div className="mt-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">+23% vs last month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-3xl font-bold text-gray-900">18</p>
                      <div className="mt-2 flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-green-600 font-medium">3 Completing this week</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Action</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                        <UserPlus className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Add New User</h3>
                        <p className="text-sm text-gray-500">Invite team members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Manage Structure</h3>
                        <p className="text-sm text-gray-500">Team, departments, office</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
                  <Link href="/admin-settings">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                          <Cog className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Admin Setting</h3>
                          <p className="text-sm text-gray-500">Branding, security, notification</p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-gray-900">
                        <strong>Emily Ross</strong> marked "Design Homepage" as <strong>Complete</strong>
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-900">
                        <strong>Jacob Lee</strong> uploaded "Q3 Budget Report" to <strong>Marketing Docs</strong>
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-900">
                        <strong>Samantha Green</strong> joined the <strong>Product Team</strong>
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">12 minutes ago</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                      <span className="text-sm text-gray-900">
                        Project <strong>"LathranSuite v2"</strong> moved to <strong>In Progress</strong>
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">18 minutes ago</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                      <span className="text-sm text-gray-900">
                        <strong>Michael Chan</strong> submitted a <strong>Leave Request Form</strong>
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">30 minutes ago</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-gray-900">
                        <strong>Weekly Sync Call</strong> scheduled by <strong>Olivia James</strong> for{" "}
                        <strong>Friday at 10:00 AM</strong>
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">35 minutes ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
