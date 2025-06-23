import Image from "next/image"

export function OnboardingHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Image src="/fravvo_logo.svg" alt="Fravvo Logo" width={120} height={40} className="h-8 w-auto" />
        </div>
      </div>
    </header>
  )
}
