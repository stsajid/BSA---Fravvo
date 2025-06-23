"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"

interface MainAppLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function MainAppLayout({ children, title, description }: MainAppLayoutProps) {
  const pathname = usePathname()

  return (
    // This container now explicitly takes full screen height and hides its own overflow
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F5F5F7" }}>
      {/* Sidebar */}
      <AppSidebar currentPath={pathname} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AppHeader title={title} description={description} />

        {/* Page Content - This is the only scrollable area for pages using MainAppLayout */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}
