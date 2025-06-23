"use client"

import { useState, useEffect, useCallback } from "react"
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
  Settings,
  LogOut,
  User,
  Command,
  Sparkles,
  Grid3X3,
  Users,
  Building2,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronRightIcon,
  MoreHorizontal,
  TreePine,
  Grid,
  Download,
  Upload,
  BarChart3,
  Eye,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { AnalyticsModal } from "@/components/modals/analytics-modal" // ONLY ADDITION

interface StructureItem {
  id: string
  name: string
  type: "division" | "office" | "department" | "team"
  description: string
  manager: string
  userCount: number
  location?: string
  status: "active" | "inactive"
  children?: StructureItem[]
  expanded?: boolean // Used for tree view
}

// Full mock data for all levels, including children
const fullStructureData: StructureItem[] = [
  {
    id: "1",
    name: "APAC Division",
    type: "division",
    description: "Asia pacific operations",
    manager: "Sarah Chen",
    userCount: 85,
    status: "active",
    children: [
      {
        id: "2",
        name: "Singapore Office",
        type: "office",
        description: "Singapore headquarters",
        manager: "David Lee",
        userCount: 45,
        location: "Singapore",
        status: "active",
        children: [
          {
            id: "3",
            name: "Engineering Department",
            type: "department",
            description: "Product development and engineering",
            manager: "Tech Lead",
            userCount: 25,
            status: "active",
            children: [
              {
                id: "4",
                name: "Frontend Team",
                type: "team",
                description: "React and mobile development",
                manager: "Emily Davis",
                userCount: 12,
                status: "active",
              },
              {
                id: "5",
                name: "Backend Team",
                type: "team",
                description: "API and infrastructure",
                manager: "John Smith",
                userCount: 13,
                status: "active",
              },
            ],
          },
          {
            id: "14",
            name: "Sales Department",
            type: "department",
            description: "Regional sales operations",
            manager: "Sales Manager",
            userCount: 20,
            status: "active",
            children: [
              {
                id: "15",
                name: "Enterprise Sales Team",
                type: "team",
                description: "Focus on large enterprise clients",
                manager: "Michael Brown",
                userCount: 10,
                status: "active",
              },
              {
                id: "16",
                name: "SMB Sales Team",
                type: "team",
                description: "Focus on small and medium businesses",
                manager: "Jessica Green",
                userCount: 10,
                status: "active",
              },
            ],
          },
        ],
      },
      {
        id: "13",
        name: "Tokyo Office",
        type: "office",
        description: "Japan headquarters",
        manager: "Yuki Tanaka",
        userCount: 40,
        location: "Tokyo",
        status: "active",
        children: [
          {
            id: "17",
            name: "Product Department",
            type: "department",
            description: "Product strategy and management",
            manager: "Kenji Sato",
            userCount: 20,
            status: "active",
          },
        ],
      },
    ],
  },
  {
    id: "6",
    name: "CPEC Corridor",
    type: "division",
    description: "Middle East operations",
    manager: "Hennery Kane",
    userCount: 138,
    status: "active",
    children: [
      {
        id: "7",
        name: "Dubai Office",
        type: "office",
        description: "Middle East headquarters",
        manager: "Ahmed Ali",
        userCount: 78,
        location: "Dubai",
        status: "active",
        children: [
          {
            id: "8",
            name: "Marketing Department",
            type: "department",
            description: "Regional marketing operations",
            manager: "Sara Ahmed",
            userCount: 35,
            status: "active",
            children: [
              {
                id: "18",
                name: "Digital Marketing Team",
                type: "team",
                description: "Online campaigns and SEO",
                manager: "Fatima Khan",
                userCount: 15,
                status: "active",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "10",
    name: "Fiction Force",
    type: "division",
    description: "Creative and content operations",
    manager: "Hennery Kane",
    userCount: 138,
    status: "active",
    children: [
      {
        id: "11",
        name: "Content Team",
        type: "team",
        description: "Content creation and management",
        manager: "Lisa Wong",
        userCount: 18,
        status: "active",
      },
      {
        id: "12",
        name: "Design Team",
        type: "team",
        description: "Creative design and branding",
        manager: "Alex Chen",
        userCount: 15,
        status: "active",
      },
    ],
  },
]

export default function StructurePage() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>("Emily Carter")
  const [userRole, setUserRole] = useState<string>("Product Manager")
  const [isWorkspaceHovered, setIsWorkspaceHovered] = useState(false)
  const [viewMode, setViewMode] = useState<"tree" | "grid">("grid") // Default to grid view as per screenshot
  const [selectedNode, setSelectedNode] = useState<StructureItem | null>(null) // For tree view right panel
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false) // ONLY ADDITION - State for analytics modal

  // State for grid view drill-down
  const [currentGridParentId, setCurrentGridParentId] = useState<string | null>(null)
  const [gridPathStack, setGridPathStack] = useState<string[]>([]) // Stack of parent IDs for back navigation

  // Build a flat map for quick lookup of any structure item by ID
  const [structureMap, setStructureMap] = useState<Map<string, StructureItem>>(new Map())

  // Tree view data state (separate from the full data for grid view, for expand/collapse)
  const [structureDataForTree, setStructureDataForTree] = useState<StructureItem[]>(fullStructureData)

  useEffect(() => {
    const buildMap = (items: StructureItem[]) => {
      const map = new Map<string, StructureItem>()
      const traverse = (nodes: StructureItem[]) => {
        nodes.forEach((node) => {
          map.set(node.id, node)
          if (node.children) {
            traverse(node.children)
          }
        })
      }
      traverse(items)
      return map
    }
    setStructureMap(buildMap(fullStructureData))
  }, [])

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

  const sidebarNavItems = [
    {
      label: "Workspace",
      active: false,
      customIcon: "/Avator + Company.svg",
      hoverIcon: "/Company+Avator.svg",
      isWorkspace: true,
    },
    { icon: Home, label: "Home", active: false, href: "/home" },
    { icon: FolderOpen, label: "Projects", active: false, href: "/projects" },
    { icon: Sparkles, label: "Fravvo AI", active: false, href: "/ai" },
    { icon: FileText, label: "Documents", active: false, href: "/documents" },
    { icon: ClipboardList, label: "Forms", active: false, href: "/forms" },
    { icon: MessageSquare, label: "Chat", active: false, href: "/chat" },
    { icon: Ticket, label: "Tickets", active: false, href: "/tickets" },
    { icon: Calendar, label: "Calendar", active: false, href: "/calendar" },
    { icon: BookOpen, label: "Knowledgebase", active: false, href: "/knowledgebase" },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "division":
        return Building2
      case "office":
        return MapPin
      case "department":
        return Briefcase
      case "team":
        return Users
      default:
        return Building2
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "division":
        return "bg-purple-100 text-purple-700"
      case "office":
        return "bg-blue-100 text-blue-700"
      case "department":
        return "bg-green-100 text-green-700"
      case "team":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Tree View specific toggle
  const toggleExpand = (id: string) => {
    const updateStructure = (items: StructureItem[]): StructureItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: updateStructure(item.children) }
        }
        return item
      })
    }
    setStructureDataForTree(updateStructure(structureDataForTree))
  }

  const handleNodeClick = (item: StructureItem) => {
    if (viewMode === "tree") {
      // Tree view: Update right panel
      setSelectedNode(item)
    }
  }

  // Tree View: Hierarchy Panel Component
  const renderTreeHierarchy = (items: StructureItem[], level = 0) => {
    return items.map((item) => {
      const Icon = getTypeIcon(item.type)
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = item.expanded

      return (
        <div key={item.id} className="mb-1">
          <div
            className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-200"
            style={{ marginLeft: `${level * 24}px` }}
          >
            <div className="flex items-center space-x-3 flex-grow">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-purple-600 rounded" />
              {hasChildren && (
                <Button variant="ghost" size="sm" className="p-0 h-4 w-4" onClick={() => toggleExpand(item.id)}>
                  {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRightIcon className="h-3 w-3" />}
                </Button>
              )}
              {!hasChildren && <div className="w-4" />}

              <div className={`p-2 rounded-lg ${getTypeBadgeColor(item.type)}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900">{item.name}</span>
                  <Badge className={`text-xs ${getTypeBadgeColor(item.type)} border-0`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-1">{item.description}</p>
                <p className="text-xs text-gray-400">
                  Manager: {item.manager} · {item.userCount} users
                  {item.location && ` · Location: ${item.location}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {hasChildren && isExpanded && <div className="mt-2">{renderTreeHierarchy(item.children, level + 1)}</div>}
        </div>
      )
    })
  }

  // Tree View: Right Panel Content
  const renderRightPanel = () => {
    if (!selectedNode) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Select a structure item to view details</p>
          </div>
        </div>
      )
    }

    const Icon = getTypeIcon(selectedNode.type)
    const hasChildren = selectedNode.children && selectedNode.children.length > 0

    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${getTypeBadgeColor(selectedNode.type)}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-gray-900">{selectedNode.name}</h2>
                <Badge className={`${getTypeBadgeColor(selectedNode.type)} border-0`}>
                  {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-500">{selectedNode.description}</p>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Eye className="w-4 h-4 mr-2" />
            View Users
          </Button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Manager</p>
                <p className="font-semibold">{selectedNode.manager}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="font-semibold">{selectedNode.userCount} users</p>
              </div>
            </div>
          </Card>
          {selectedNode.location && (
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{selectedNode.location}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
        {hasChildren && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Sub-structures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedNode.children?.map((child) => {
                const ChildIcon = getTypeIcon(child.type)
                return (
                  <Card
                    key={child.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedNode(child)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${getTypeBadgeColor(child.type)}`}>
                        <ChildIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{child.name}</h4>
                        <Badge className={`text-xs ${getTypeBadgeColor(child.type)} border-0`}>
                          {child.type.charAt(0).toUpperCase() + child.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{child.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{child.manager}</span>
                      <span>{child.userCount} users</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/home" },
    { label: "Company Structure", href: "/structure", current: true },
  ]

  // Helper to get items for the current grid view level
  const getDisplayedGridItems = useCallback(() => {
    if (currentGridParentId === null) {
      return fullStructureData // Top-level divisions
    }
    const parentItem = structureMap.get(currentGridParentId)
    return parentItem?.children || []
  }, [currentGridParentId, structureMap])

  // Handle click on a grid card for drill-down
  const handleGridCardClick = (item: StructureItem) => {
    if (item.children && item.children.length > 0) {
      setGridPathStack((prev) => [...prev, currentGridParentId || "root"]) // Push current parent to stack
      setCurrentGridParentId(item.id) // Set new parent
    } else {
      // If no children, navigate to detail page (e.g., for a Team)
      router.push(`/structure/${item.type}/${item.id}`)
    }
  }

  // Handle back button in grid view
  const handleGridBack = () => {
    if (gridPathStack.length > 0) {
      const prevParentId = gridPathStack[gridPathStack.length - 1]
      setGridPathStack((prev) => prev.slice(0, prev.length - 1))
      setCurrentGridParentId(prevParentId === "root" ? null : prevParentId)
    }
  }

  const renderGridView = () => {
    const itemsToDisplay = getDisplayedGridItems()

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map((item) => {
            const Icon = getTypeIcon(item.type)
            const childrenCount = item.children?.length || 0

            return (
              <Card
                key={item.id}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleGridCardClick(item)} // Use new handler
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getTypeBadgeColor(item.type)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit {item.type}</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/structure/${item.type}/${item.id}`)
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Manage Users</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete {item.type}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <Badge className={`text-xs ${getTypeBadgeColor(item.type)} border-0`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Manager</span>
                      <span className="font-medium">{item.manager}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Users</span>
                      <span className="font-medium">{item.userCount} users</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium">{item.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">{item.description}</p>

                  {childrenCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGridCardClick(item) // Trigger drill-down
                      }}
                    >
                      <span className="font-medium">{childrenCount} sub-structure</span>
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full bg-white rounded-xl p-12 text-center">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sub-structures found</h3>
            <p className="text-gray-500 mb-4">This structure doesn't have any child structures yet.</p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Structure
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F5F5F7" }}>
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

        {/* Workspace Switcher */}
        {sidebarNavItems.map((item, index) => {
          if (item.isWorkspace) {
            return (
              <div
                key={index}
                className="flex items-center justify-center h-12 mx-2 mb-2 rounded-lg cursor-pointer transition-colors relative"
                onMouseEnter={() => setIsWorkspaceHovered(true)}
                onMouseLeave={() => setIsWorkspaceHovered(false)}
              >
                <Image
                  src={isWorkspaceHovered ? item.hoverIcon : item.customIcon || "/placeholder.svg"}
                  alt={item.label}
                  width={68}
                  height={68}
                  className="w-[68px] h-[68px]"
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - 68px */}
        <header className="h-[68px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="font-semibold text-gray-900">Company Structure</h1>
              <p className="text-sm text-gray-500">Build and manage your entire organization</p>
            </div>
          </div>

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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
              </div>

              {/* Company Header */}
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Bluewave Technologies</h2>
                      <p className="text-gray-500">Client Admin : Emily Carter</p>
                    </div>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Structure
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Total Employee</p>
                      <p className="text-2xl font-bold text-gray-900">260+</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">Divisions</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Offices</p>
                      <p className="text-2xl font-bold text-gray-900">2</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-500">Departments</p>
                      <p className="text-2xl font-bold text-gray-900">2</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500">Teams</p>
                      <p className="text-2xl font-bold text-gray-900">4</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* View Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "tree" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("tree")}
                  >
                    <TreePine className="w-4 h-4 mr-2" />
                    Tree View
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    Grid View
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAnalyticsModal(true)}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>

              {/* Content Area */}
              {viewMode === "grid" && currentGridParentId !== null && (
                <div className="mb-6">
                  <Button variant="ghost" size="sm" onClick={handleGridBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
              )}

              {/* Structure Tree/Grid */}
              <div className="space-y-2">
                {viewMode === "tree" && renderTreeHierarchy(structureDataForTree)}
                {viewMode === "grid" && renderGridView()}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* ONLY ADDITION - Analytics Modal */}
      <AnalyticsModal isOpen={showAnalyticsModal} onClose={() => setShowAnalyticsModal(false)} />
    </div>
  )
}
