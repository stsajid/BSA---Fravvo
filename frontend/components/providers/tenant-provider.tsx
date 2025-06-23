"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Tenant {
  id: string
  name: string
  logo?: string
  domain: string
  primaryColor: string
  features: string[]
  subscription: "free" | "pro" | "enterprise"
}

interface TenantContextType {
  tenant: Tenant | null
  setTenant: (tenant: Tenant) => void
  isLoading: boolean
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock tenant data
    setTenant({
      id: "tenant-1",
      name: "Acme Corp",
      logo: "/placeholder.svg?height=32&width=32",
      domain: "acme.fravvo.com",
      primaryColor: "#6366f1",
      features: ["feed", "chat", "tasks", "documents", "forms", "meetings", "ai", "analytics"],
      subscription: "enterprise",
    })
    setIsLoading(false)
  }, [])

  return <TenantContext.Provider value={{ tenant, setTenant, isLoading }}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}
