// Information Expert: CatálogoPaciente conhece como encontrar pacientes
// Pure Fabrication: catálogo como serviço de busca

import type { Paciente } from "@/lib/types"

export class CatalogoPaciente {
  private static instance: CatalogoPaciente
  private pacientes: Map<string, Paciente> = new Map()

  private constructor() {
    // Mock data - em produção viria do banco de dados
    this.initializeMockData()
  }

  public static getInstance(): CatalogoPaciente {
    if (!CatalogoPaciente.instance) {
      CatalogoPaciente.instance = new CatalogoPaciente()
    }
    return CatalogoPaciente.instance
  }

  private initializeMockData() {
    const mockPacientes: Paciente[] = [
      {
        id: "1",
        Nome: "João Silva",
        Email: "joao@email.com",
        Senha: "senha123",
        Contato: "(11) 98765-4321",
        CEP: "01234-567",
        CPF: "123.456.789-00",
        DataNasc: "1990-05-15",
        Numero: "100",
        Bairro: "Centro",
        Cidade: "São Paulo",
        Estado: "SP",
      },
      {
        id: "P002",
        Nome: "Maria Santos",
        Email: "maria@email.com",
        Senha: "senha123",
        Contato: "(11) 98765-1234",
        CEP: "01234-890",
        CPF: "987.654.321-00",
        DataNasc: "1985-08-20",
        Numero: "200",
        Bairro: "Jardins",
        Cidade: "São Paulo",
        Estado: "SP",
      },
    ]

    mockPacientes.forEach((p) => this.pacientes.set(p.id, p))
  }

  // Método conforme diagrama de classes
  public encontraPaciente(codPaciente: string): Paciente | null {
    return this.pacientes.get(codPaciente) || null
  }

  public adicionarPaciente(paciente: Paciente): void {
    this.pacientes.set(paciente.id, paciente)
  }

  public listarTodos(): Paciente[] {
    return Array.from(this.pacientes.values())
  }
}

export const catalogoPaciente = CatalogoPaciente.getInstance()
