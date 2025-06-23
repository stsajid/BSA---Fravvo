import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, verified, verifiedAt } = body

    console.log("Saving user to database:", { email, verified, verifiedAt })

    if (!sql) {
      console.log("Database not available - using mock mode")
      return NextResponse.json({
        success: true,
        message: "User saved (mock mode)",
        userId: `mock_${Date.now()}`,
      })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    let userId: string

    if (existingUser.length > 0) {
      // Update existing user
      userId = existingUser[0].id
      await sql`
        UPDATE users 
        SET 
          email_verified = ${verified},
          email_verified_at = ${verifiedAt},
          updated_at = NOW()
        WHERE email = ${email}
      `
      console.log("✅ Updated existing user:", userId)
    } else {
      // Create new user
      const newUser = await sql`
        INSERT INTO users (
          email, 
          email_verified, 
          email_verified_at,
          name,
          created_at,
          updated_at
        ) VALUES (
          ${email},
          ${verified},
          ${verifiedAt},
          ${email.split("@")[0]},
          NOW(),
          NOW()
        )
        RETURNING id
      `
      userId = newUser[0].id
      console.log("✅ Created new user:", userId)
    }

    return NextResponse.json({
      success: true,
      message: "User saved successfully",
      userId: userId,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to save user", details: error.message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}
