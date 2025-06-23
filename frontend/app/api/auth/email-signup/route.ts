import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    console.log("Processing signup for email:", email)

    // Simple validation
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Generate verification token
    const verificationToken = Buffer.from(`${email}:${Date.now()}`).toString("base64")
    const APP_URL = "https://kzmqdjovsdlliwglfrzm.lite.vusercontent.net"
    const verificationLink = `${APP_URL}/verify?token=${encodeURIComponent(verificationToken)}`

    console.log(`✅ Account created for: ${email}`)
    console.log(`📧 Verification link: ${verificationLink}`)

    // Store the verification data in localStorage for demo
    if (typeof window !== "undefined") {
      localStorage.setItem(`verification_${email}`, verificationToken)
    }

    return NextResponse.json({
      status: "sent",
      message: "Account created successfully!",
      email: email,
      verificationLink: verificationLink,
      demo: true,
    })
  } catch (error) {
    console.error("❌ Signup error:", error)
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}
