"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Loader2, AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { PhoneVerificationModal } from "./phone-verification-modal"
import { TermsModal } from "../modals/terms-modal"
import { PrivacyModal } from "../modals/privacy-modal"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [verificationLink, setVerificationLink] = useState("")
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const router = useRouter()

  const generateVerificationLink = (email: string) => {
    // Create a verification token (email + timestamp, base64 encoded)
    const timestamp = Date.now().toString()
    const tokenData = `${email}:${timestamp}`
    const token = Buffer.from(tokenData).toString("base64")

    // Get current domain
    const currentDomain = window.location.origin
    return `${currentDomain}/verify?token=${token}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    // Simulate account creation (no API call needed for demo)
    setTimeout(() => {
      try {
        console.log("Creating account for:", email)

        // Generate verification link
        const link = generateVerificationLink(email)
        setVerificationLink(link)
        setSuccess(true)

        // Store email for verification page
        localStorage.setItem("signup-email", email)
        localStorage.setItem("account-created", "true")
        localStorage.setItem("account-creation-date", new Date().toISOString())

        console.log("Account created successfully, verification link:", link)

        // Auto redirect after showing success
        setTimeout(() => {
          router.push(`/signup/verify-email?email=${encodeURIComponent(email)}`)
        }, 4000)
      } catch (err) {
        console.error("Signup error:", err)
        setError("Unable to create account. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }, 1500) // Simulate network delay
  }

  const handlePhoneSignup = () => {
    setIsPhoneModalOpen(true)
  }

  const handlePhoneVerificationSuccess = (phoneNumber: string) => {
    setIsPhoneModalOpen(false)

    // Store phone for verification
    localStorage.setItem("signup-phone", phoneNumber)
    localStorage.setItem("account-created", "true")
    localStorage.setItem("account-creation-date", new Date().toISOString())

    // Redirect to onboarding
    router.push("/onboarding")
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationLink)
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const openLink = () => {
    window.open(verificationLink, "_blank")
  }

  if (success) {
    return (
      <Card className="shadow-xl border-0 rounded-xl max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Account Created Successfully! 🎉</h3>
          <p className="text-gray-600 mb-4">
            Your Fravvo account has been created for
            <br />
            <strong>{email}</strong>
          </p>

          {/* Verification link */}
          {verificationLink && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800 mb-3 font-medium">Click to verify your account:</p>
              <div className="space-y-2">
                <Button onClick={openLink} className="w-full bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Verify Email Address
                </Button>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={verificationLink}
                    readOnly
                    className="flex-1 text-xs p-2 border rounded bg-white"
                  />
                  <Button size="sm" variant="outline" onClick={copyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                💡 This link works anywhere - copy and paste it in any browser!
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting to verification page in 4 seconds...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="shadow-xl border-0 rounded-xl max-w-md mx-auto">
        <CardHeader className="text-center pb-6 pt-8">
          {/* Removed logo and text from here as it's now in the page layout */}
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription className="text-gray-600 mt-2">Join thousands of teams already using Fravvo</CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <Button variant="outline" className="w-full h-12" type="button">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button variant="outline" className="w-full h-12" type="button">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z" />
                <path fill="#00a4ef" d="M13 1h10v10H13z" />
                <path fill="#7fba00" d="M1 13h10v10H1z" />
                <path fill="#ffb900" d="M13 13h10v10H13z" />
              </svg>
              Continue with Microsoft
            </Button>

            <Button variant="outline" className="w-full h-12" type="button" onClick={handlePhoneSignup}>
              📱 Continue with Phone
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
              Or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Sign in
            </Link>
          </div>

          <div className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our{" "}
            <button type="button" className="text-purple-600 hover:underline" onClick={() => setIsTermsModalOpen(true)}>
              Terms of Use
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-purple-600 hover:underline"
              onClick={() => setIsPrivacyModalOpen(true)}
            >
              Privacy Policy
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PhoneVerificationModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSuccess={handlePhoneVerificationSuccess}
      />

      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />

      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </>
  )
}
