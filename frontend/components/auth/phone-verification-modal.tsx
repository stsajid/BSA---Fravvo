"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface PhoneVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (phoneNumber: string) => void
}

export function PhoneVerificationModal({ isOpen, onClose, onSuccess }: PhoneVerificationModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [step, setStep] = useState<"phone" | "code" | "success">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Handle OTP input focus management
  useEffect(() => {
    if (step === "code") {
      inputRefs.current[0]?.focus()
    }
  }, [step])

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handlePhoneSubmit = () => {
    setError("")
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)

    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false)
      setStep("code")
      setCountdown(30) // 30 seconds countdown for resend

      // For demo purposes, we'll log the "code" to console
      console.log("Verification code for demo: 123456")
    }, 1500)
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && index > 0 && verificationCode[index] === "") {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)

    if (/^\d+$/.test(pastedData)) {
      const newCode = [...verificationCode]

      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newCode[i] = pastedData[i]
      }

      setVerificationCode(newCode)

      // Focus the next empty input or the last one
      const nextEmptyIndex = newCode.findIndex((c) => c === "")
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus()
      } else {
        inputRefs.current[5]?.focus()
      }
    }
  }

  const handleVerifyCode = () => {
    setError("")
    const code = verificationCode.join("")

    if (code.length !== 6) {
      setError("Please enter the complete verification code")
      return
    }

    setIsLoading(true)

    // For demo purposes, any code is valid
    setTimeout(() => {
      setIsLoading(false)

      // Demo: 123456 is the "correct" code
      if (code === "123456") {
        setStep("success")

        // Auto close after success
        setTimeout(() => {
          onSuccess(phoneNumber)
        }, 2000)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    }, 1500)
  }

  const handleResendCode = () => {
    setError("")
    setIsLoading(true)

    // Simulate resending code
    setTimeout(() => {
      setIsLoading(false)
      setCountdown(30)
      console.log("New verification code for demo: 123456")
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "phone" && "Enter your phone number"}
            {step === "code" && "Enter verification code"}
            {step === "success" && "Verification successful"}
          </DialogTitle>
          <DialogDescription>
            {step === "phone" && "We'll send you a verification code via SMS"}
            {step === "code" && `We've sent a 6-digit code to ${phoneNumber}`}
            {step === "success" && "Your phone number has been verified"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === "phone" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                className="w-full h-12 bg-purple-600 hover:bg-purple-700"
                onClick={handlePhoneSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Send verification code"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "code" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Verification code</Label>
              <div className="flex gap-2 justify-between">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="h-12 w-12 text-center text-lg font-medium"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Didn't receive a code?{" "}
                {countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    className="text-purple-600 hover:text-purple-700 font-medium"
                    onClick={handleResendCode}
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                )}
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                className="w-full h-12 bg-purple-600 hover:bg-purple-700"
                onClick={handleVerifyCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center text-gray-600">Your phone number has been verified successfully!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
