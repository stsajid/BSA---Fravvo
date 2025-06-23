"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Mail, User, Building, Shield, Clock } from "lucide-react"

interface UserType {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin: string
}

interface ViewUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
  onEdit: (UserType) => void
}

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

export function ViewUserModal({ isOpen, onClose, user, onEdit }: ViewUserModalProps) {
  if (!user) return null

  const handleEdit = () => {
    onClose()
    onEdit(user)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white">
        <DialogHeader className="p-4 pb-3 border-b">
          <DialogTitle className="text-xl font-semibold">User Details</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xl font-semibold text-purple-600">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email Address</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Role</p>
                <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Department</p>
                <p className="text-gray-900">{user.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <Badge className={getStatusBadgeColor(user.status)}>{user.status}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Last Login</p>
                <p className="text-gray-900">{user.lastLogin}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleEdit} className="bg-purple-600 hover:bg-purple-700">
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
