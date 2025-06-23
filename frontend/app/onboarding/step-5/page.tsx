"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Loader2,
  Check,
  Sparkles,
  Rss,
  MessageSquare,
  FileText,
  ClipboardList,
  CheckSquare,
  CalendarCheck,
} from "lucide-react"
import Link from "next/link"

const tools = [
  {
    name: "Fravvo AI",
    description: "AI assistant for everything",
    icon: Sparkles,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    name: "Company Feed",
    description: "Social updates & announcements",
    icon: Rss,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    name: "Team Chat",
    description: "Instant team messaging",
    icon: MessageSquare,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    name: "Documents",
    description: "Shared docs & files",
    icon: FileText,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    name: "Forms",
    description: "Custom data collection",
    icon: ClipboardList,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    name: "Tasks",
    description: "Visual task tracking",
    icon: CheckSquare,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    name: "Meetings",
    description: "Schedule & join calls",
    icon: CalendarCheck,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
]

export default function OnboardingStep5() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const isStep1Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_1")
  const isStep2Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_2")
  const isStep3Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_3")
  const isStep4Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_4")

  useEffect(() => {
    // Check if previous steps are completed
    if (!isStep1Completed || !isStep2Completed || !isStep3Completed || !isStep4Completed) {
      router.push("/onboarding") // Redirect to step 1 if not completed
    }
  }, [router, isStep1Completed, isStep2Completed, isStep3Completed, isStep4Completed])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    // Simulate API call or data saving
    await new Promise((resolve) => setTimeout(resolve, 1500))

    localStorage.setItem("onboarding_step_5", "true")
    setIsLoading(false)
    router.push("/quick-access") // Navigate to quick access instead of dashboard
  }

  return (
    <div className="grid grid-cols-12 h-screen overflow-hidden">
      {/* Left Form Section */}
      <div className="col-span-12 lg:col-span-7 h-screen overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white px-8 pt-6 pb-4 border-b border-gray-100">
          {/* Fravvo Logo */}
          <div className="flex items-center gap-3 mb-6">
            <Image src="/fravvo_logo.svg" alt="Fravvo Logo" width={100} height={45} className="max-h-[45px] w-auto" />
          </div>

          {/* Step Indicators */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              {/* Step 1: Completed */}
              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
              {/* Step 2: Completed */}
              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
              {/* Step 3: Completed */}
              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
              {/* Step 4: Completed */}
              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
              {/* Step 5: Completed */}
              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Your Toolkit is Ready</h1>
            <p className="text-muted-foreground text-sm">Here are the tools now available to your team</p>
          </div>
        </div>

        {/* Scrollable Form Section */}
        <div className="h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar px-4 py-6">
          <div className="max-w-lg mx-auto px-4">
            {/* Tools List */}
            <div className="mb-8 space-y-4">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${tool.bgColor} flex items-center justify-center`}>
                      <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                    Ready
                  </span>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 pb-4">
              <p className="text-xs text-gray-500">
                © 2025, Fravvo.{" "}
                <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block col-span-5">
        <div
          className="h-screen bg-no-repeat bg-cover bg-center bg-right"
          style={{ backgroundImage: `url('/Business_Social_App.png')` }}
        ></div>
      </div>
    </div>
  )
}
