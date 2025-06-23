"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, Upload, Plus, MoreHorizontal, Users, ChevronLeft, ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { AddUserModal } from "@/components/modals/add-user-modal"
import { EditUserModal } from "@/components/modals/edit-user-modal"
import { ViewUserModal } from "@/components/modals/view-user-modal"
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal"
import { ResetPasswordModal } from "@/components/modals/reset-password-modal"
import { Toast } from "@/components/ui/toast"

interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin: string
}

// Initial mock data
const initialUsers: User[] = [
  {
    id: 1,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "Client Admin",
    department: "IT",
    status: "Active",
    lastLogin: "2025-05-29 14:22",
  },
  {
    id: 2,
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    role: "Manager",
    department: "Design",
    status: "Active",
    lastLogin: "2025-05-28 09:13",
  },
  {
    id: 3,
    name: "Sophia Clark",
    email: "sophia.clark@example.com",
    role: "Internal User",
    department: "Engineering",
    status: "Pending",
    lastLogin: "2025-05-25 17:41",
  },
  {
    id: 4,
    name: "Ava Robinson",
    email: "ava.robinson@example.com",
    role: "External User",
    department: "Design",
    status: "Active",
    lastLogin: "2025-05-15 11:07",
  },
  {
    id: 5,
    name: "Isabella Moore",
    email: "isabella.moore@example.com",
    role: "Internal User",
    department: "IT",
    status: "Pending",
    lastLogin: "2025-05-20 10:05",
  },
  {
    id: 6,
    name: "Liam Anderson",
    email: "liam.anderson@example.com",
    role: "Client Admin",
    department: "IT",
    status: "Active",
    lastLogin: "2025-05-29 14:22",
  },
  {
    id: 7,
    name: "Noah Thompson",
    email: "noah.thompson@example.com",
    role: "Manager",
    department: "Design",
    status: "Active",
    lastLogin: "2025-05-28 09:13",
  },
]

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Client Admin":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "Manager":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200"
    case "Internal User":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "External User":
      return "bg-pink-100 text-pink-800 hover:bg-pink-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "Inactive":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("All Users")

  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ title: string; description: string; variant: "success" | "error" } | null>(null)

  const usersPerPage = 7
  const totalPages = Math.ceil(users.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = users.slice(startIndex, endIndex)

  // Calculate user stats dynamically
  const userStats = [
    { label: "All Users", count: users.length, active: activeTab === "All Users" },
    {
      label: "Internal Users",
      count: users.filter((u) => u.role === "Internal User").length,
      active: activeTab === "Internal Users",
    },
    {
      label: "Active Users",
      count: users.filter((u) => u.status === "Active").length,
      active: activeTab === "Active Users",
    },
    { label: "Manager", count: users.filter((u) => u.role === "Manager").length, active: activeTab === "Manager" },
    {
      label: "External Users",
      count: users.filter((u) => u.role === "External User").length,
      active: activeTab === "External Users",
    },
    {
      label: "Pending Users",
      count: users.filter((u) => u.status === "Pending").length,
      active: activeTab === "Pending Users",
    },
  ]

  const handleAddUser = (userData: any) => {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: userData.fullName,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      status: userData.status,
      lastLogin: "Never",
    }

    setUsers((prev) => [...prev, newUser])
    setToast({
      title: "Success!",
      description: `User ${userData.fullName} has been added successfully.`,
      variant: "success",
    })
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewUserModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditUserModalOpen(true)
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setToast({
      title: "Success!",
      description: `User ${updatedUser.name} has been updated successfully.`,
      variant: "success",
    })
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    setIsDeleting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id))
    setToast({
      title: "User Deleted",
      description: `User ${userToDelete.name} has been removed successfully.`,
      variant: "success",
    })

    setIsDeleting(false)
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setIsResetPasswordModalOpen(true)
  }

  const handlePasswordResetSuccess = () => {
    setToast({
      title: "Password Reset Sent!",
      description: `Password reset link has been sent to ${selectedUser?.email}.`,
      variant: "success",
    })
  }

  return (
    <>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm">
          <Link href="/home" className="text-gray-500 hover:text-gray-700 transition-colors flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <span className="text-gray-400">{">"}</span>
          <span className="font-semibold text-gray-900">User Management</span>
        </nav>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {userStats.map((stat) => (
            <Card
              key={stat.label}
              className={`cursor-pointer transition-colors ${
                stat.active ? "ring-2 ring-purple-500 bg-purple-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(stat.label)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  </div>
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Table Section */}
        <Card>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{activeTab}</h2>
                  <p className="text-sm text-gray-500">{users.length} users</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Users
                  </Button>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setIsAddUserModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="client-admin">Client Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="internal-user">Internal User</SelectItem>
                    <SelectItem value="external-user">External User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Users</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">{user.department}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(user.status)}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">{user.lastLogin}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit User</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user)}>Reset Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(user)}>
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-6 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={handleAddUser}
      />

      <ViewUserModal
        isOpen={isViewUserModalOpen}
        onClose={() => setIsViewUserModalOpen(false)}
        user={selectedUser}
        onEdit={handleEditUser}
      />

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        user={selectedUser}
        onUserUpdated={handleUpdateUser}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        userName={userToDelete?.name || ""}
        isLoading={isDeleting}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        userName={selectedUser?.name || ""}
        userEmail={selectedUser?.email || ""}
        onPasswordReset={handlePasswordResetSuccess}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
