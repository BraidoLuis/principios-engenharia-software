import { useState, useEffect } from "react"
import type { User } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockUser: User = {
        role: "patient",
        id: "123",
        CodPaciente: "PAC-2024-001",
        Nome: "João da Silva",
        Email: "joao@email.com",
        CPF: "111.222.333-44",
        Senha: "",
        Contato: "(11) 99999-9999",
        CEP: "00000-000",
        DataNasc: "1985-05-15",
        Numero: "100",
        Bairro: "Centro",
        Cidade: "São Paulo",
        Estado: "SP",
      }

      setUser(mockUser)
      setLoading(false)
    }

    checkAuth()
  }, [])

  return { user, loading }
}