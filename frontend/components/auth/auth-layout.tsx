import type React from "react"
import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
  hideSignIn?: boolean
}

export function AuthLayout({ children, hideSignIn }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top-left header for logo */}
      <header className="absolute top-0 left-0 p-6 z-10">
        <Image src="/fravvo_logo.svg" alt="Fravvo Logo" width={32} height={32} />
      </header>

      <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
