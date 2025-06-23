"use client"

import React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Loader2, Check, Copy, Plus } from "lucide-react"
import Link from "next/link"

interface TeamMember {
  email: string
  role: "Admin" | "Member" | "E-User"
}

export default function OnboardingStep4() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { email: "samantha.brown@gmail.com", role: "Admin" },
    { email: "michaeljohn@gmail.com", role: "E-User" },
    { email: "oliviaelizabeth@gmail.com", role: "Member" },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false)

  const isStep1Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_1")
  const isStep2Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_2")
  const isStep3Completed = typeof window !== "undefined" && localStorage.getItem("onboarding_step_3")

  useEffect(() => {
    // Check if previous steps are completed
    if (!isStep1Completed || !isStep2Completed || !isStep3Completed) {
      router.push("/onboarding") // Redirect to step 1 if not completed
    }
  }, [router, isStep1Completed, isStep2Completed, isStep3Completed])

  const handleAddMember = () => {
    setTeamMembers((prev) => [...prev, { email: "", role: "Member" }])
  }

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...teamMembers]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setTeamMembers(newMembers)
  }

  const inviteLink = "https://fravvo.com/invite/BluewaveTechnologies" // Example dynamic link

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setInviteLinkCopied(true)
      setTimeout(() => setInviteLinkCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy invite link: ", err)
    }
  }

  const isFormValid = () => {
    return teamMembers.some((member) => member.email.trim() !== "")
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
      "onboarding_step_4",
      JSON.stringify({
        teamMembers: teamMembers.filter((member) => member.email.trim() !== ""), // Save only members with emails
      }),
    )
    setIsLoading(false)
    router.push("/onboarding/step-5") // Navigate to the next step
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
              {/* Step 4: Active */}
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              {/* Step 5: Inactive */}
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Invite Your Team</h1>
            <p className="text-muted-foreground text-sm">Step 4 of 5: Add team members to start collaborating</p>
          </div>
        </div>

        {/* Scrollable Form Section */}
        <div className="h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar px-4 py-6">
          <div className="max-w-lg mx-auto px-4">
            {/* Team Member Input List */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                <label className="text-sm font-medium text-gray-900">Email</label>
                <label className="text-sm font-medium text-gray-900">Role</label>
                {teamMembers.map((member, index) => (
                  <React.Fragment key={index}>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                      className="col-span-1"
                    />
                    <Select
                      value={member.role}
                      onValueChange={(value: "Admin" | "Member" | "E-User") => handleMemberChange(index, "role", value)}
                    >
                      <SelectTrigger className="col-span-1">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                        <SelectItem value="E-User">E-User</SelectItem>
                      </SelectContent>
                    </Select>
                  </React.Fragment>
                ))}
              </div>
              <Button
                type="button"
                variant="link"
                onClick={handleAddMember}
                className="text-purple-600 hover:text-purple-700 px-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add another
              </Button>
            </div>

            {/* Invite Link Section */}
            <div className="mb-8">
              <label className="text-sm font-medium text-gray-900 mb-2 block">Invite</label>
              <div className="relative">
                <Input type="text" value={inviteLink} readOnly className="pr-10" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyInviteLink}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:bg-gray-100"
                  aria-label="Copy invite link"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                {inviteLinkCopied && <span className="absolute -bottom-6 left-0 text-xs text-green-600">Copied!</span>}
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
