"use client"

import type React from "react"

import { ClerkProvider as BaseClerkProvider } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import type { TenantInfo } from "@/lib/tenant-resolver"

interface TenantClerkProviderProps {
  children: React.ReactNode
  tenant?: TenantInfo
}

export function TenantClerkProvider({ children, tenant }: TenantClerkProviderProps) {
  const [publishableKey, setPublishableKey] = useState<string>()

  useEffect(() => {
    if (tenant) {
      // Use tenant-specific Clerk configuration
      const tenantKey = tenant.settings.clerk_publishable_key || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      setPublishableKey(tenantKey)
    } else {
      setPublishableKey(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
    }
  }, [tenant])

  if (!publishableKey) {
    return <div>Loading authentication...</div>
  }

  return (
    <BaseClerkProvider
      publishableKey={publishableKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: tenant?.settings.brand_color || "#6c5ce7",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#1c1c1e",
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: tenant?.settings.brand_color || "#6c5ce7",
          },
          logoImage: {
            content: tenant?.settings.logo_url ? `url(${tenant.settings.logo_url})` : undefined,
          },
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  )
}
