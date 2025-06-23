import Image from "next/image"
import Link from "next/link"

export function AuthHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/fravvo_logo.svg" alt="Fravvo Logo" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link href="/signup" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Sign Up
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
