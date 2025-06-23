"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Check } from "lucide-react"
import { Users, Building, Zap, MessageSquare, Target, Share2, Handshake, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function OnboardingStep3() {
  const router = useRouter()
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null)
  const [selectedMainGoals, setSelectedMainGoals] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const isStep1Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_1")
  const isStep2Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_2") // Assuming step 2 saves something

  useEffect(() => {
    // Check if previous steps are completed
    if (!isStep1Completed || !isStep2Completed) {
      router.push("/onboarding") // Redirect to step 1 if not completed
    }
  }, [router, isStep1Completed, isStep2Completed])

  const companySizes = [
    { id: "1-10", label: "1–10 People", icon: Users },
    { id: "11-50", label: "11–50 People", icon: Users },
    { id: "51-200", label: "51–200 People", icon: Building },
    { id: "200+", label: "200+ People", icon: Building },
  ]

  const mainGoals = [
    { id: "better-collaboration", label: "Better Collaboration", icon: Handshake },
    { id: "increase-productivity", label: "Increase Productivity", icon: Zap },
    { id: "get-more-organized", label: "Get More Organized", icon: Target },
    { id: "improve-team-communication", label: "Improve Team Communication", icon: MessageSquare },
    { id: "increase-transparency", label: "Increase Transparency", icon: Lightbulb },
    { id: "share-knowledge-better", label: "Share Knowledge Better", icon: Share2 },
  ]

  const handleCompanySizeSelect = (sizeId: string) => {
    setSelectedCompanySize(sizeId)
  }

  const handleMainGoalToggle = (goalId: string) => {
    setSelectedMainGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
  }

  const isFormValid = () => {
    return selectedCompanySize !== null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      return
    }

    setIsLoading(true)
    // Simulate API call or data saving
    await new Promise((resolve) => setTimeout(resolve, 1500))

    localStorage.setItem(
      "onboarding_step_3",
      JSON.stringify({
        companySize: selectedCompanySize,
        mainGoals: selectedMainGoals,
      }),
    )
    setIsLoading(false)
    router.push("/onboarding/step-4") // Navigate to the next step
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
              {/* Step 3: Active */}
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              {/* Step 4-5: Inactive */}
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              How many people are in your organization?
            </h1>
            <p className="text-muted-foreground text-sm">
              Step 3 of 5: This helps us configure the right features and limits
            </p>
          </div>
        </div>

        {/* Scrollable Form Section */}
        <div className="h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar px-4 py-6">
          <div className="max-w-lg mx-auto px-4">
            {/* Company Size Section */}
            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Company Size</h2>
              <div className="grid grid-cols-2 gap-3">
                {companySizes.map((size) => {
                  const IconComponent = size.icon
                  const isSelected = selectedCompanySize === size.id
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => handleCompanySizeSelect(size.id)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200",
                        "hover:border-purple-300 hover:shadow-sm",
                        isSelected ? "border-purple-600 bg-purple-50 shadow-md" : "border-gray-200 bg-white",
                      )}
                    >
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{size.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main Goals Section */}
            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Main Goals</h2>
              <div className="grid grid-cols-2 gap-3">
                {mainGoals.map((goal) => {
                  const IconComponent = goal.icon
                  const isSelected = selectedMainGoals.includes(goal.id)
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => handleMainGoalToggle(goal.id)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200",
                        "hover:border-purple-300 hover:shadow-sm",
                        isSelected ? "border-purple-600 bg-purple-50 shadow-md" : "border-gray-200 bg-white",
                      )}
                    >
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{goal.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Continuing...
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
