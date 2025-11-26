"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth")
      } else {
        // Redirecionar baseado no papel - Protected Variations
        switch (user.role) {
          case "patient":
            router.push("/patient")
            break
          case "doctor":
            router.push("/doctor")
            break
          case "admin":
            router.push("/admin")
            break
        }
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}
