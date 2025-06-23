"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { FloatingAIAssistant } from "@/components/ai/floating-ai-assistant"
import { CommandPalette } from "@/components/command/command-palette"
import { useAuth } from "@/components/providers/auth-provider"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  if (!user) {
    return null // Will be handled by auth guard
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-white">
          <div className="h-full max-w-[1280px] mx-auto px-6">{children}</div>
        </main>
      </div>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />

      {/* Command Palette */}
      <CommandPalette />
    </div>
  )
}
