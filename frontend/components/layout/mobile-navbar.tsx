"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, CheckSquare, FileText, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Docs", href: "/documents", icon: FileText },
    { name: "Menu", href: "#", icon: Menu },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
      <nav className="flex h-16">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
