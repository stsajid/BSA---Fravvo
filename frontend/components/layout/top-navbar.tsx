import { GlobalCreateButton } from "@/components/global/create-button"

export const TopNavbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="font-bold">Acme</div>
        <div className="ml-auto flex items-center gap-2">
          {/* Global Create Button */}
          <GlobalCreateButton />
          {/* Notification component */}
          <div>Notifications</div>
          {/* User menu component */}
          <div>User Menu</div>
        </div>
      </div>
    </div>
  )
}
