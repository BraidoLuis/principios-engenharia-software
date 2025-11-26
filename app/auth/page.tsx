// Controller: coordena fluxo de autenticação
// Creator: cria e gerencia componentes de auth

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import type { UserRole } from "@/lib/types"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const { login, register } = useAuth()
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    const user = await login(email, password)

    // Redirecionar baseado no papel do usuário - Polymorphism
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

  const handleRegister = async (email: string, password: string, name: string, role: UserRole) => {
    const user = await register(email, password, name, role)

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MediCare</h1>
          <p className="text-gray-600">Sistema de Gestão Médica</p>
        </div>

        {mode === "login" ? (
          <LoginForm onLogin={handleLogin} onToggleMode={() => setMode("register")} />
        ) : (
          <RegisterForm onRegister={handleRegister} onToggleMode={() => setMode("login")} />
        )}
      </div>
    </div>
  )
}
