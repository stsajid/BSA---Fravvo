"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "success" | "error"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn("fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all", {
        "bg-white border-gray-200": variant === "default",
        "bg-green-50 border-green-200": variant === "success",
        "bg-red-50 border-red-200": variant === "error",
      })}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && (
            <h4
              className={cn("text-sm font-semibold", {
                "text-gray-900": variant === "default",
                "text-green-800": variant === "success",
                "text-red-800": variant === "error",
              })}
            >
              {title}
            </h4>
          )}
          {description && (
            <p
              className={cn("text-sm", {
                "text-gray-600": variant === "default",
                "text-green-700": variant === "success",
                "text-red-700": variant === "error",
              })}
            >
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
