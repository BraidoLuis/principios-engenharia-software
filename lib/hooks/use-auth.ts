// Custom Hook: encapsula lógica de autenticação
// Protected Variations: protege componentes de mudanças no auth

"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { authService } from "@/lib/services/auth-service"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password)
    setUser(user)
    return user
  }

  const register = async (email: string, password: string, name: string, role: User["role"]) => {
    const user = await authService.register(email, password, name, role)
    setUser(user)
    return user
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }
}
