"use client"

import type React from "react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // Import from pre-installed shadcn tooltip
import { cn } from "@/lib/utils"

interface RichTooltipProps {
  children: React.ReactNode
  title: string
  description: string
  cta?: {
    text: string
    href: string
  }
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

export function RichTooltip({ children, title, description, cta, side = "right", sideOffset = 8 }: RichTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          className={cn(
            "z-[9999] max-w-xs p-4 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-lg",
            "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          <h4 className="font-semibold text-base mb-1">{title}</h4>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          {cta && (
            <Link href={cta.href} className="text-sm text-purple-600 hover:underline">
              {cta.text}
            </Link>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
