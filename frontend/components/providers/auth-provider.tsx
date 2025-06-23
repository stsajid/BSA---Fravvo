"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id?: string
  email: string
  name?: string
  isVerified: boolean
  role?: "admin" | "manager" | "internal" | "external"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (email: string) => Promise<{ success: boolean; message?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signOut: () => void
  updateUser: (userData: Partial<User>) => void
  resendVerification: (email: string) => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("fravvo_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("fravvo_user")
      }
    }
    setIsLoading(false)
  }, [])

  const signUp = async (email: string) => {
    try {
      const response = await fetch("/api/auth/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        const newUser: User = {
          email,
          isVerified: false,
        }
        setUser(newUser)
        localStorage.setItem("fravvo_user", JSON.stringify(newUser))
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, message: "Network error occurred" }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        localStorage.setItem("fravvo_user", JSON.stringify(data.user))
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error("Signin error:", error)
      return { success: false, message: "Network error occurred" }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("fravvo_user")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("fravvo_user", JSON.stringify(updatedUser))
    }
  }

  const resendVerification = async (email: string) => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: "Verification email sent successfully" }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error("Resend verification error:", error)
      return { success: false, message: "Network error occurred" }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateUser,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
