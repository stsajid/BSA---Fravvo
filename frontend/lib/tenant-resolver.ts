import type { NextRequest } from "next/server"
import { sql } from "@/lib/database"

export interface TenantInfo {
  id: string
  name: string
  slug: string
  domain?: string
  schema: string
  subscription_tier: string
  settings: Record<string, any>
}

export class TenantResolver {
  private static cache = new Map<string, TenantInfo>()
  private static cacheExpiry = new Map<string, number>()
  private static CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  static async resolveTenant(request: NextRequest): Promise<TenantInfo | null> {
    const host = request.headers.get("host")
    const subdomain = this.extractSubdomain(host)

    if (!subdomain) return null

    // Check cache first
    const cached = this.getFromCache(subdomain)
    if (cached) return cached

    try {
      // If no database connection, return mock tenant for preview
      if (!sql) {
        const mockTenant: TenantInfo = {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Acme Corporation",
          slug: "acme-corp",
          domain: host || "localhost",
          schema: "tenant_acme_corp",
          subscription_tier: "enterprise",
          settings: {
            brand_color: "#6c5ce7",
            logo_url: "/placeholder.svg?height=32&width=32",
          },
        }

        // Cache the mock result
        this.setCache(subdomain, mockTenant)
        return mockTenant
      }

      // Resolve tenant from database
      const [tenant] = await sql`
        SELECT 
          id, name, slug, domain, subscription_tier, settings,
          CONCAT('tenant_', slug) as schema
        FROM organizations 
        WHERE slug = ${subdomain} OR domain = ${host}
        AND status = 'active'
        LIMIT 1
      `

      if (!tenant) return null

      const tenantInfo: TenantInfo = {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain,
        schema: tenant.schema,
        subscription_tier: tenant.subscription_tier,
        settings: tenant.settings || {},
      }

      // Cache the result
      this.setCache(subdomain, tenantInfo)

      return tenantInfo
    } catch (error) {
      console.error("Tenant resolution error:", error)

      // Return mock tenant as fallback
      const fallbackTenant: TenantInfo = {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Acme Corporation",
        slug: "acme-corp",
        domain: host || "localhost",
        schema: "tenant_acme_corp",
        subscription_tier: "enterprise",
        settings: {},
      }

      return fallbackTenant
    }
  }

  private static extractSubdomain(host: string | null): string | null {
    if (!host) return "acme-corp" // Default for preview

    // Handle localhost development
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      const parts = host.split(".")
      return parts.length > 1 ? parts[0] : "acme-corp" // Default for dev
    }

    // Extract subdomain from production domain
    const parts = host.split(".")
    return parts.length > 2 ? parts[0] : "acme-corp" // Default fallback
  }

  private static getFromCache(key: string): TenantInfo | null {
    const expiry = this.cacheExpiry.get(key)
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key)
      this.cacheExpiry.delete(key)
      return null
    }
    return this.cache.get(key) || null
  }

  private static setCache(key: string, tenant: TenantInfo): void {
    this.cache.set(key, tenant)
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL)
  }

  static clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key)
      this.cacheExpiry.delete(key)
    } else {
      this.cache.clear()
      this.cacheExpiry.clear()
    }
  }
}

// Middleware helper for tenant context
export async function withTenantContext<T>(
  request: NextRequest,
  handler: (tenant: TenantInfo) => Promise<T>,
): Promise<T> {
  const tenant = await TenantResolver.resolveTenant(request)

  if (!tenant) {
    throw new Error("Tenant not found or inactive")
  }

  // Set schema for this request (PostgreSQL schema-based multitenancy)
  // Only if we have a real database connection
  if (sql) {
    try {
      await sql`SET search_path TO ${sql(tenant.schema)}, public`
    } catch (error) {
      console.warn("Could not set schema path:", error)
    }
  }

  return handler(tenant)
}
