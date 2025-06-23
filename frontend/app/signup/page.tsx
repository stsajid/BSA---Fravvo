"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { AuthLayout } from "@/components/auth/auth-layout"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <Image src="/fravvo_logo.svg" alt="Fravvo Logo" width={100} height={45} className="max-h-[45px] w-auto" />
        </div>
        <Link href="/contact" className="text-sm text-gray-600 hover:text-purple-700">
          Contact
        </Link>
      </header>
      {/* Main content (AuthLayout centers the form) */}
      <main className="flex-1 flex items-center justify-center">
        <AuthLayout>
          <SignupForm />
        </AuthLayout>
      </main>
    </div>
  )
}
