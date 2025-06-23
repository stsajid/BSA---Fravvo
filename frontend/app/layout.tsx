import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/providers/auth-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fravvo",
  description: "Your intelligent workspace assistant",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <TooltipProvider>
            {/* Removed min-h-screen and bg-gray-50 from here */}
            {/* The children will now determine the height, allowing body/html to scroll if needed */}
            <div>{children}</div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
