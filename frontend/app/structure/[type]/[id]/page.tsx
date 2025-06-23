"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, MapPin, BriefcaseBusiness, UsersRound, Plus, MoreHorizontal, User } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/layout/breadcrumb"

interface StructureItem {
  id: string
  name: string
  type: "division" | "office" | "department" | "team"
  description: string
  manager: string
  users: number
  location?: string
  status: "active" | "inactive"
  children?: StructureItem[]
}

// Full mock data for all levels
const fullStructureData: StructureItem[] = [
  {
    id: "division-1",
    type: "division",
    name: "APAC Division",
    description: "Asia pacific operations",
    manager: "Sarah Chen",
    users: 85,
    status: "active",
    children: [
      {
        id: "office-1",
        type: "office",
        name: "Singapore Office",
        description: "Singapore headquarters",
        manager: "David Lee",
        users: 45,
        location: "Singapore",
        status: "active",
        children: [
          {
            id: "department-1",
            type: "department",
            name: "Engineering Department",
            description: "Product development and engineering",
            manager: "Emily Davis",
            users: 12,
            status: "active",
            children: [
              {
                id: "team-1",
                type: "team",
                name: "Frontend Team",
                description: "React and mobile development",
                manager: "Emily Davis",
                users: 12,
                status: "active",
              },
              {
                id: "team-2",
                type: "team",
                name: "Backend Team",
                description: "API and infrastructure",
                manager: "John Smith",
                users: 13,
                status: "active",
              },
            ],
          },
        ],
      },
      {
        id: "office-2",
        type: "office",
        name: "Sydney Office",
        description: "Australian operations",
        manager: "Michael Brown",
        users: 40,
        location: "Sydney",
        status: "active",
        children: [],
      },
    ],
  },
  {
    id: "division-2",
    type: "division",
    name: "Fiction Force",
    description: "Creative content and storytelling",
    manager: "Alice Wonderland",
    users: 120,
    status: "active",
    children: [
      {
        id: "office-3",
        type: "office",
        name: "Storytelling Hub",
        description: "Narrative development and publishing",
        manager: "Bob The Builder",
        users: 60,
        location: "New York",
        status: "active",
        children: [
          {
            id: "department-2",
            type: "department",
            name: "Fantasy Department",
            description: "World-building and character design",
            manager: "Charlie Chaplin",
            users: 30,
            status: "active",
            children: [
              {
                id: "team-3",
                type: "team",
                name: "Mythos Team",
                description: "Ancient lore and epic tales",
                manager: "Diana Prince",
                users: 15,
                status: "active",
              },
            ],
          },
        ],
      },
    ],
  },
]

// Helper function to find a node by ID and type
const findNode = (nodes: StructureItem[], type: string, id: string): StructureItem | null => {
  for (const node of nodes) {
    if (node.id === id && node.type === type) {
      return node
    }
    if (node.children) {
      const found = findNode(node.children, type, id)
      if (found) return found
    }
  }
  return null
}

export default function StructureDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { type, id } = params

  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<StructureItem | null>(null)
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: "Dashboard", href: "/home" },
    { label: "Company Structure", href: "/structure" },
  ])

  useEffect(() => {
    if (type && id) {
      setLoading(true)
      const foundItem = findNode(fullStructureData, type as string, id as string)
      setItem(foundItem)

      if (foundItem) {
        // Build dynamic breadcrumbs
        const newBreadcrumbItems = [
          { label: "Dashboard", href: "/home" },
          { label: "Company Structure", href: "/structure" },
        ]
        const buildPath = (nodes: StructureItem[], currentPath: StructureItem[] = []) => {
          for (const node of nodes) {
            const newPath = [...currentPath, node]
            if (node.id === id && node.type === type) {
              newPath.forEach((pathNode) => {
                newBreadcrumbItems.push({
                  label: pathNode.name,
                  href: `/structure/${pathNode.type}/${pathNode.id}`,
                  current: pathNode.id === id,
                })
              })
              return true
            }
            if (node.children && buildPath(node.children, newPath)) {
              return true
            }
          }
          return false
        }
        buildPath(fullStructureData)
        setBreadcrumbItems(newBreadcrumbItems)
      }
      setLoading(false)
    }
  }, [type, id])

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case "division":
        return Building2
      case "office":
        return MapPin
      case "department":
        return BriefcaseBusiness
      case "team":
        return UsersRound
      default:
        return Building2
    }
  }

  const getTypeBadgeColor = (itemType: string) => {
    switch (itemType) {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#fafafa] p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 border-opacity-25"></div>
        <p className="mt-4 text-lg text-[#69738d]">Loading...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#fafafa] p-6">
        <h1 className="text-2xl font-bold text-[#1c1c1e]">Structure Item Not Found</h1>
        <p className="text-[#69738d]">The requested organization unit could not be found.</p>
        <Button onClick={() => router.push("/structure")} className="mt-4 bg-[#0072ed] hover:bg-[#005bb5] text-white">
          Go to Company Structure
        </Button>
      </div>
    )
  }

  const IconComponent = getTypeIcon(item.type)
  const hasChildren = item.children && item.children.length > 0

  return (
    <div className="flex flex-col h-full bg-[#fafafa] p-6 overflow-auto">
      <div className="max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${getTypeBadgeColor(item.type)}`}>
              <IconComponent className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-[#1c1c1e]">{item.name}</h1>
                <Badge className={`text-sm ${getTypeBadgeColor(item.type)} border-0`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Badge>
              </div>
              <p className="text-[#69738d]">{item.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="bg-[#0072ed] hover:bg-[#005bb5] text-white px-4 py-2 rounded-lg shadow-md">
              <Plus className="h-5 w-5 mr-2" />
              Add Sub-structure
            </Button>
            <Button variant="outline" className="text-[#69738d]">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-[#0072ed]" />
              <div>
                <p className="text-sm text-[#69738d]">Manager</p>
                <p className="text-xl font-bold text-[#1c1c1e]">{item.manager}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-[#2ecc71]" />
              <div>
                <p className="text-sm text-[#69738d]">Total Users</p>
                <p className="text-xl font-bold text-[#1c1c1e]">{item.users}</p>
              </div>
            </div>
          </Card>
          {item.location && (
            <Card className="p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="w-8 h-8 text-[#ff6b6b]" />
                <div>
                  <p className="text-sm text-[#69738d]">Location</p>
                  <p className="text-xl font-bold text-[#1c1c1e]">{item.location}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sub-structures Section */}
        {hasChildren && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-[#1c1c1e] mb-4">Sub-structures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {item.children?.map((child) => {
                const ChildIconComponent = getTypeIcon(child.type)
                return (
                  <Link href={`/structure/${child.type}/${child.id}`} key={child.id}>
                    <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center space-x-2">
                          {ChildIconComponent && <ChildIconComponent className="h-5 w-5 text-[#0072ed]" />}
                          <span>{child.name}</span>
                        </CardTitle>
                        <span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: getTypeBadgeColor(child.type).split(" ")[0],
                            color: getTypeBadgeColor(child.type).split(" ")[1],
                          }}
                        >
                          {child.type.charAt(0).toUpperCase() + child.type.slice(1)}
                        </span>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-xs text-[#69738d]">{child.description}</p>
                        <p className="text-xs text-[#69738d] mt-2">
                          Manager: {child.manager}
                          {child.location && ` · Location: ${child.location}`}
                        </p>
                        <p className="text-xs text-[#69738d]">{child.users} users</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
