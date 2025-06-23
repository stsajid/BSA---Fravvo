"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Check } from "lucide-react"
import { Clipboard, Headphones, MessageCircle, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function OnboardingStep2() {
  const router = useRouter()
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isStep1Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_1")

  useEffect(() => {
    // Check if step 1 is completed
    if (!isStep1Completed) {
      router.push("/onboarding")
    }
  }, [router, isStep1Completed])

  const useCases = [
    {
      id: "project-management",
      name: "Project Management",
      description: "Managing tasks, deadlines, and deliverables",
      icon: Clipboard,
      iconColor: "#298F55", // Dark Green
      bgColor: "#C9F1D8", // Light Green
    },
    {
      id: "customer-support",
      name: "Customer Support",
      description: "Handling customer inquiries and issues",
      icon: Headphones,
      iconColor: "#4377C1", // Dark Blue
      bgColor: "#D6E7FB", // Light Blue
    },
    {
      id: "team-collaboration",
      name: "Team Collaboration",
      description: "Communication and knowledge sharing",
      icon: MessageCircle,
      iconColor: "#794BC4", // Purple
      bgColor: "#E4D9FA", // Light Purple
    },
    {
      id: "sales-marketing",
      name: "Sales & Marketing",
      description: "Lead generation and customer acquisition",
      icon: BarChart,
      iconColor: "#D38436", // Dark Orange
      bgColor: "#FFE1C5", // Light Orange
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedUseCase) {
      setError("Please select a primary use case.")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)

    // Redirect to the next step (e.g., Step 3)
    // router.push('/onboarding/step-3');
    localStorage.setItem("onboarding_step_2", "true")
    router.push("/onboarding/step-3")
  }

  const steps = [
    { id: 1, name: "Company Info", status: "completed" },
    { id: 2, name: "Use Case", status: "current" },
    { id: 3, name: "Team Size", status: "upcoming" },
    { id: 4, name: "Goals", status: "upcoming" },
    { id: 5, name: "Finish", status: "upcoming" },
  ]

  return (
    <div className="grid grid-cols-12 h-screen overflow-hidden">
      {/* Left Form Section */}
      <div className="col-span-12 lg:col-span-7 h-screen overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white px-8 pt-6 pb-4 border-b border-gray-100">
          {/* Fravvo Logo */}
          <div className="flex items-center gap-3 mb-6">
            <Image src="/fravvo_logo.svg" alt="Fravvo Logo" width={100} height={45} className="max-h-[45px] w-auto" />
            {/* Removed Fravvo text */}
          </div>

          {/* Step Indicators */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              {/* Step 1: Completed */}
              {isStep1Completed ? (
                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-white" />
                </div>
              ) : (
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              )}
              {/* Step 2: Active */}
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              {/* Step 3-5: Inactive */}
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">What is your team's primary focus?</h1>
            <p className="text-muted-foreground text-sm">
              Step 2 of 5: This helps us suggest the right tools and workflows
            </p>
          </div>
        </div>

        {/* Scrollable Form Section */}
        <div className="h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar px-4 py-6">
          <div className="max-w-lg mx-auto px-4">
            {/* Option Cards */}
            <div className="space-y-4">
              {useCases.map((useCase) => {
                const IconComponent = useCase.icon
                const isSelected = selectedUseCase === useCase.id
                return (
                  <button
                    key={useCase.id}
                    type="button"
                    onClick={() => setSelectedUseCase(useCase.id)}
                    className={cn(
                      "flex items-center p-4 rounded-lg border-2 transition-all duration-200",
                      "hover:border-purple-300 hover:shadow-sm",
                      isSelected ? "border-purple-600 bg-purple-50 shadow-md" : "border-gray-200 bg-white",
                    )}
                  >
                    {/* Radio button */}
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3">
                      {isSelected && <div className="w-2 h-2 rounded-full bg-purple-600"></div>}
                    </div>
                    {/* Icon and Text */}
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center p-2 rounded-lg"
                        style={{ backgroundColor: useCase.bgColor }}
                      >
                        <IconComponent style={{ color: useCase.iconColor }} className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-base font-medium text-gray-900">{useCase.name}</span>
                        <span className="text-sm text-gray-500">{useCase.description}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Continue Button */}
            <div className="pt-8">
              <Button
                onClick={handleSubmit}
                disabled={!selectedUseCase}
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
        <div className="h-screen bg-[url('/onboarding-hero.jpg')] bg-no-repeat bg-cover bg-center bg-right"></div>
      </div>
    </div>
  )
}
