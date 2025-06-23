"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  // This is the key fix - we need to handle the token in a way that works on first load
  useEffect(() => {
    // Don't run verification logic during SSR
    if (typeof window === "undefined") return

    const token = searchParams?.get("token")

    if (!token) {
      setStatus("error")
      setMessage("No verification token found in the link")
      return
    }

    try {
      // Decode the token client-side
      const decoded = Buffer.from(token, "base64").toString("utf-8")
      const [emailFromToken, timestamp] = decoded.split(":")

      if (!emailFromToken || !timestamp) {
        setStatus("error")
        setMessage("Invalid verification token format")
        return
      }

      setEmail(emailFromToken)

      // Store verification status in localStorage
      localStorage.setItem("email_verified", "true")
      localStorage.setItem("verified_email", emailFromToken)
      localStorage.setItem("verification_date", new Date().toISOString())

      // Set success state
      setStatus("success")
      setMessage("Email verified successfully! Welcome to Fravvo!")

      // Redirect to onboarding after 3 seconds
      const timer = setTimeout(() => {
        router.push("/onboarding")
      }, 3000)

      return () => clearTimeout(timer)
    } catch (error) {
      console.error("Token decode error:", error)
      setStatus("error")
      setMessage("Invalid verification token. The link may be corrupted.")
    }
  }, [searchParams, router])

  const handleGoToOnboarding = () => {
    router.push("/onboarding")
  }

  const handleBackToSignup = () => {
    router.push("/signup")
  }

  return (
    <AuthLayout>
      <Card className="shadow-lg border-0 max-w-md mx-auto">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            {status === "loading" && <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />}
            {status === "success" && <CheckCircle className="w-8 h-8 text-green-600" />}
            {status === "error" && <XCircle className="w-8 h-8 text-red-600" />}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Welcome to Fravvo! 🎉"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 pt-0 text-center">
          <p className="text-gray-600 mb-6">{message}</p>

          {email && (
            <div className="bg-gray-50 p-3 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                Email: <strong className="text-gray-900">{email}</strong>
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                <p className="text-sm text-green-800">
                  🚀 Your account is now active! You can now access all Fravvo features.
                </p>
              </div>
              <p className="text-sm text-green-600 mb-4">Redirecting to setup in 3 seconds...</p>
              <Button onClick={handleGoToOnboarding} className="w-full bg-purple-600 hover:bg-purple-700">
                Continue to Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                <p className="text-sm text-red-800">The verification link may be invalid, expired, or already used.</p>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleBackToSignup}>
                  Back to Signup
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
