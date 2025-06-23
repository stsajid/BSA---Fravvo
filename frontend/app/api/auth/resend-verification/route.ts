import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    console.log("Resending verification for email:", email)

    // Simple validation
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Try to use nodemailer if available, otherwise use fallback
    try {
      // Dynamic import to handle if nodemailer is not available
      const nodemailer = await import("nodemailer").catch(() => null)

      if (nodemailer) {
        console.log("Nodemailer available, attempting to send email...")

        // SMTP Configuration
        const SMTP_USER = "sejafahabroo@gmail.com"
        const SMTP_PASS = "ipdo hkrx vsva olxj"
        const APP_URL = "https://kzmqdjovsdlliwglfrzm.lite.vusercontent.net"

        // Create transporter
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        })

        // Generate new verification token
        const verificationToken = Buffer.from(`${email}:${Date.now()}`).toString("base64")
        const verificationLink = `${APP_URL}/verify?token=${encodeURIComponent(verificationToken)}`

        // Send email
        await transporter.sendMail({
          from: `"Fravvo Team" <${SMTP_USER}>`,
          to: email,
          subject: "🚀 Verify your Fravvo account (Resent)",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Verify your Fravvo account</title>
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                  <span style="color: white; font-size: 24px; font-weight: bold;">F</span>
                </div>
                <h1 style="color: #1f2937; margin: 0; font-size: 28px;">Verify your Fravvo account</h1>
                <p style="color: #6b7280; margin: 10px 0 0 0;">Verification email resent</p>
              </div>
              
              <div style="background: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <p style="margin: 0 0 20px 0; font-size: 16px; color: #6b7280;">
                  Here's your new verification link. Click the button below to verify your email address.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationLink}" style="background: #8b5cf6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                    Verify Email Address
                  </a>
                </div>
                
                <p style="margin: 20px 0 0 0; font-size: 14px; color: #9ca3af;">
                  If the button doesn't work, copy and paste this link:<br>
                  <a href="${verificationLink}" style="color: #8b5cf6; word-break: break-all;">${verificationLink}</a>
                </p>
              </div>
              
              <div style="text-align: center; font-size: 14px; color: #9ca3af;">
                <p>This verification link will expire in 24 hours.</p>
              </div>
            </body>
            </html>
          `,
          text: `
Verify your Fravvo account

Here's your new verification link:
${verificationLink}

This link will expire in 24 hours.
          `,
        })

        console.log(`✅ Resend email sent successfully to: ${email}`)

        return NextResponse.json({
          status: "sent",
          message: "New verification email sent successfully!",
          email: email,
        })
      } else {
        throw new Error("Nodemailer not available")
      }
    } catch (emailError) {
      console.log("📧 Email sending failed, using fallback mode:", emailError.message)

      // Fallback: Generate new verification link for demo
      const verificationToken = Buffer.from(`${email}:${Date.now()}`).toString("base64")
      const verificationLink = `https://kzmqdjovsdlliwglfrzm.lite.vusercontent.net/verify?token=${encodeURIComponent(
        verificationToken,
      )}`

      console.log(`📧 Demo resend verification link: ${verificationLink}`)

      return NextResponse.json({
        status: "sent",
        message: "New verification link generated! (Demo mode)",
        email: email,
        verificationLink: verificationLink,
        demo: true,
      })
    }
  } catch (error) {
    console.error("❌ Resend error:", error)
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
