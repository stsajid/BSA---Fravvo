"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, CheckCircle, RefreshCw, ArrowLeft, Loader2 } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email")
  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Store email in localStorage to persist it
  useEffect(() => {
    if (emailParam) {
      localStorage.setItem("verification_email", emailParam)
    }
  }, [emailParam])

  // Get email from params or localStorage
  const email = emailParam || localStorage.getItem("verification_email") || ""

  useEffect(() => {
    // If no email is available, redirect to signup
    if (!email) {
      router.push("/signup")
    }
  }, [email, router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendCooldown])

  const handleResendEmail = async () => {
    if (!email || resendCooldown > 0) return

    setIsResending(true)
    setError("")

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setResent(true)
        setResendCooldown(30) // 30 second cooldown
        setTimeout(() => setResent(false), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to resend email")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsResending(false)
    }
  }

  const handleChangeEmail = () => {
    setShowEmailModal(true)
    setNewEmail(email)
    setError("")
  }

  const handleEmailChange = async () => {
    if (!newEmail || !validateEmail(newEmail)) {
      setError("Please enter a valid email address")
      return
    }

    // Update email in localStorage
    localStorage.setItem("verification_email", newEmail)

    // Update URL without refreshing the page
    const url = new URL(window.location.href)
    url.searchParams.set("email", newEmail)
    window.history.pushState({}, "", url.toString())

    setShowEmailModal(false)
    setResendCooldown(0)
    setResent(false)
    setError("")
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Show loading if no email yet
  if (!email) {
    return (
      <AuthLayout>
        <Card className="shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
            <p className="text-gray-600 mt-4">Loading...</p>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Check your email</CardTitle>
        </CardHeader>

        <CardContent className="p-8 pt-0 text-center">
          <p className="text-gray-600 mb-6">
            We've sent a verification link to <br />
            <strong className="text-gray-900">{email}</strong>
          </p>

          <p className="text-sm text-gray-500 mb-8">
            Click the link in the email to verify your account and continue setting up your workspace.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-4 text-left">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resent && (
            <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Email sent again!</span>
            </div>
          )}

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend verification email"
              )}
            </Button>

            <Button
              variant="ghost"
              className="w-full text-purple-600 hover:text-purple-700"
              onClick={handleChangeEmail}
            >
              Use a different email address
            </Button>

            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-700"
              onClick={() => router.push("/signup")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to signup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Change Email Address</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter a new email address to receive the verification link
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="new-email" className="text-gray-700 font-medium">
                New email address
              </Label>
              <Input
                id="new-email"
                type="email"
                placeholder="Enter new email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-2 h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowEmailModal(false)} className="border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleEmailChange} disabled={!newEmail} className="bg-purple-600 hover:bg-purple-700">
                Update Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  )
}
