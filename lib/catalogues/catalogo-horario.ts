// Pure Fabrication: catálogo para gerenciar horários
// Information Expert: conhece todos os horários cadastrados
// Singleton: instância única do catálogo

import { Horario } from "@/lib/types"

class CatalogoHorario {
  private static instance: CatalogoHorario
  private horarios: Map<string, Horario>

  private constructor() {
    this.horarios = new Map()
    this.initializeMockData()
  }

  public static getInstance(): CatalogoHorario {
    if (!CatalogoHorario.instance) {
      CatalogoHorario.instance = new CatalogoHorario()
    }
    return CatalogoHorario.instance
  }

  private initializeMockData() {
    const mockHorarios: Horario[] = [
      {
        CodHorario: "H001",
        Dia: "Segunda-feira",
        HoraIni: "08:00",
        HoraFim: "12:00",
        CodMedico: "M001",
      },
      {
        CodHorario: "H002",
        Dia: "Segunda-feira",
        HoraIni: "14:00",
        HoraFim: "18:00",
        CodMedico: "M001",
      },
    ]

    mockHorarios.forEach((horario) => {
      this.horarios.set(horario.CodHorario, horario)
    })
  }

  // Information Expert: busca horários por médico
  public buscarHorariosPorMedico(codMedico: string): Horario[] {
    return Array.from(this.horarios.values()).filter(
      (horario) => horario.CodMedico === codMedico
    )
  }

  // Creator: cria novo horário
  public cadastrarHorario(horario: Horario): void {
    this.horarios.set(horario.CodHorario, horario)
  }

  // Information Expert: busca horário específico
  public buscarHorario(codHorario: string): Horario | undefined {
    return this.horarios.get(codHorario)
  }

  // Remove horário
  public removerHorario(codHorario: string): boolean {
    return this.horarios.delete(codHorario)
  }

  // Atualiza horário
  public atualizarHorario(horario: Horario): boolean {
    if (this.horarios.has(horario.CodHorario)) {
      this.horarios.set(horario.CodHorario, horario)
      return true
    }
    return false
  }

  // Lista todos os horários
  public listarTodos(): Horario[] {
    return Array.from(this.horarios.values())
  }
}

export default CatalogoHorario
