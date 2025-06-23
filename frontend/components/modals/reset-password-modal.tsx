"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Key } from "lucide-react"

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userEmail: string
  onPasswordReset: () => void
}

export function ResetPasswordModal({ isOpen, onClose, userName, userEmail, onPasswordReset }: ResetPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onPasswordReset()
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 bg-white">
        <DialogHeader className="p-4 pb-3 border-b">
          <DialogTitle className="text-xl font-semibold">Reset Password</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Reset User Password</h3>
              <p className="text-sm text-gray-600">Send a password reset link to the user</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700">User: </span>
              <span className="text-sm text-gray-900">{userName}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Email: </span>
              <span className="text-sm text-gray-900">{userEmail}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            A password reset link will be sent to the user's email address. They will be able to create a new password
            using this link.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleReset} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
