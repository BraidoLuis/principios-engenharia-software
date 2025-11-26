// Pure Fabrication: serviço especializado em autenticação
// Indirection: abstrai a lógica de autenticação

import type { User, UserRole } from "@/lib/types"

class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string): Promise<User> {
    // Simulação - em produção, chamar API real
    const mockUser: User = {
      id: "1",
      email,
      name: "Usuário Teste",
      role: email.includes("doctor") ? "doctor" : email.includes("admin") ? "admin" : "patient",
      createdAt: new Date().toISOString(),
    }

    this.currentUser = mockUser
    localStorage.setItem("user", JSON.stringify(mockUser))
    return mockUser
  }

  async register(email: string, password: string, name: string, role: UserRole): Promise<User> {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    }

    this.currentUser = newUser
    localStorage.setItem("user", JSON.stringify(newUser))
    return newUser
  }

  logout(): void {
    this.currentUser = null
    localStorage.removeItem("user")
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    const stored = localStorage.getItem("user")
    if (stored) {
      this.currentUser = JSON.parse(stored)
      return this.currentUser
    }
    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

export const authService = AuthService.getInstance()
