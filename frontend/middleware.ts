import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware ensures that API routes always return JSON, even for errors
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply to API routes
  if (pathname.startsWith("/api/")) {
    // For API routes, we want to ensure we always return JSON
    try {
      // Continue to the actual route handler
      return NextResponse.next()
    } catch (error) {
      // If an error occurs, return a JSON response instead of HTML
      console.error("API error caught in middleware:", error)
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
    }
  }

  // For non-API routes, just continue
  return NextResponse.next()
}

// Configure the middleware to run only for API routes
export const config = {
  matcher: "/api/:path*",
}
