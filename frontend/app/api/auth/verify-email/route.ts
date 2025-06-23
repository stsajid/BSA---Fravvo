import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    console.log("Verifying token:", token)

    if (!token) {
      return NextResponse.json({ error: "Invalid verification link" }, { status: 400 })
    }

    try {
      // Decode the token
      const decoded = Buffer.from(token, "base64").toString("utf-8")
      const [email, timestamp] = decoded.split(":")

      console.log("Decoded email:", email, "timestamp:", timestamp)

      if (!email || !timestamp) {
        return NextResponse.json({ error: "Invalid verification token format" }, { status: 400 })
      }

      // For demo purposes, we'll accept any token that's properly formatted
      // In production, you'd check against a database

      // Check if token is expired (24 hours)
      const tokenAge = Date.now() - Number.parseInt(timestamp)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

      if (tokenAge > maxAge) {
        return NextResponse.json({ error: "Verification link has expired. Please request a new one." }, { status: 400 })
      }

      // Token is valid - mark email as verified
      console.log(`✅ Email verified successfully: ${email}`)

      return NextResponse.json({
        status: "verified",
        message: "Email verified successfully! Welcome to Fravvo!",
        email: email,
      })
    } catch (decodeError) {
      console.error("Token decode error:", decodeError)
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 })
    }
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}
