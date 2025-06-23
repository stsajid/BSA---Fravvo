// Multi-tenant authentication context
export interface AuthUser {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: string
}

export interface TenantContext {
  organization: {
    id: string
    name: string
    slug: string
    subscription_tier: string
  }
  user: AuthUser
  permissions: string[]
}

// Mock auth for demo - replace with your auth provider
export async function getCurrentTenant(): Promise<TenantContext | null> {
  // In preview mode, always return mock tenant context
  if (!process.env.DATABASE_URL) {
    return {
      organization: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Acme Corporation",
        slug: "acme-corp",
        subscription_tier: "enterprise",
      },
      user: {
        id: "550e8400-e29b-41d4-a716-446655440010",
        email: "admin@acme.com",
        name: "John Admin",
        role: "admin",
      },
      permissions: ["read", "write", "admin"],
    }
  }

  // This would typically validate JWT and fetch tenant context
  return {
    organization: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Acme Corporation",
      slug: "acme-corp",
      subscription_tier: "enterprise",
    },
    user: {
      id: "550e8400-e29b-41d4-a716-446655440010",
      email: "admin@acme.com",
      name: "John Admin",
      role: "admin",
    },
    permissions: ["read", "write", "admin"],
  }
}

export function hasPermission(context: TenantContext, permission: string): boolean {
  return context.permissions.includes(permission) || context.permissions.includes("admin")
}
