// Information Expert: CatálogoDisponibilidade conhece como encontrar disponibilidades
// Pure Fabrication: catálogo como serviço de busca

import type { Disponibilidade, Horario, Medico, Especialidade } from "@/lib/types"

export class CatalogoDisponibilidade {
  private static instance: CatalogoDisponibilidade
  private disponibilidades: Map<string, Disponibilidade> = new Map()
  private horarios: Map<string, Horario> = new Map()
  private medicos: Map<string, Medico> = new Map()
  private especialidades: Map<string, Especialidade> = new Map()

  private constructor() {
    this.initializeMockData()
  }

  public static getInstance(): CatalogoDisponibilidade {
    if (!CatalogoDisponibilidade.instance) {
      CatalogoDisponibilidade.instance = new CatalogoDisponibilidade()
    }
    return CatalogoDisponibilidade.instance
  }

  private initializeMockData() {
    // Mock Especialidades
    const especialidades: Especialidade[] = [
      { CodEspec: "E001", Nome: "Cardiologia" },
      { CodEspec: "E002", Nome: "Dermatologia" },
      { CodEspec: "E003", Nome: "Clínico Geral" },
    ]
    especialidades.forEach((e) => this.especialidades.set(e.CodEspec, e))

    // Mock Médicos
    const medicos: Medico[] = [
      {
        id: "MD001",
        Nome: "Dr. João Silva",
        Email: "dr.joao@clinica.com",
        Senha: "senha123",
        Contato: "(11) 3456-7890",
        CRM: "12345/SP",
        Preco: 250.0,
        CodEspec: "E001",
      },
      {
        id: "MD002",
        Nome: "Dra. Maria Santos",
        Email: "dra.maria@clinica.com",
        Senha: "senha123",
        Contato: "(11) 3456-7891",
        CRM: "67890/SP",
        Preco: 300.0,
        CodEspec: "E002",
      },
      {
        id: "MD003",
        Nome: "Dr. Pedro Costa",
        Email: "dr.pedro@clinica.com",
        Senha: "senha123",
        Contato: "(11) 3456-7892",
        CRM: "11223/SP",
        Preco: 200.0,
        CodEspec: "E003",
      },
    ]
    medicos.forEach((m) => this.medicos.set(m.id, m))

    // Mock Horários
    const horarios: Horario[] = [
      { CodHorario: "H001", Dia: "Segunda", HoraIni: "08:00", HoraFim: "12:00", idMedico: "MD001" },
      { CodHorario: "H002", Dia: "Segunda", HoraIni: "14:00", HoraFim: "18:00", idMedico: "MD001" },
      { CodHorario: "H003", Dia: "Terça",  HoraIni: "08:00", HoraFim: "12:00", idMedico: "MD002" },
      { CodHorario: "H004", Dia: "Quarta", HoraIni: "14:00", HoraFim: "18:00", idMedico: "MD003" },

      // 👉 Novos horários
      { CodHorario: "H005", Dia: "Quarta", HoraIni: "08:00", HoraFim: "12:00", idMedico: "MD002" },
      { CodHorario: "H006", Dia: "Quarta", HoraIni: "19:00", HoraFim: "22:00", idMedico: "MD003" },
      { CodHorario: "H007", Dia: "Quinta", HoraIni: "08:00", HoraFim: "12:00", idMedico: "MD002" },
      { CodHorario: "H008", Dia: "Quinta", HoraIni: "14:00", HoraFim: "18:00", idMedico: "MD001" },
      { CodHorario: "H009", Dia: "Sexta",  HoraIni: "08:00", HoraFim: "12:00", idMedico: "MD002" },
      { CodHorario: "H010", Dia: "Sexta",  HoraIni: "14:00", HoraFim: "18:00", idMedico: "MD003" },
      { CodHorario: "H011", Dia: "Sábado", HoraIni: "08:00", HoraFim: "12:00", idMedico: "MD003" },
      { CodHorario: "H012", Dia: "Sábado", HoraIni: "13:00", HoraFim: "17:00", idMedico: "MD001" },
      { CodHorario: "H013", Dia: "Domingo", HoraIni: "09:00", HoraFim: "12:00", idMedico: "MD001" },
      { CodHorario: "H014", Dia: "Domingo", HoraIni: "14:00", HoraFim: "17:00", idMedico: "MD002" },
    ]

    horarios.forEach((h) => this.horarios.set(h.CodHorario, h))


    // Mock Disponibilidades
    const disponibilidades: Disponibilidade[] = [
      { CodDisp: "D001", Data: "2025-11-27", Reservado: false, CodHorario: "H001" },
      { CodDisp: "D002", Data: "2025-11-27", Reservado: false, CodHorario: "H002" },
      { CodDisp: "D003", Data: "2025-11-28", Reservado: false, CodHorario: "H003" },
      { CodDisp: "D004", Data: "2025-11-29", Reservado: false, CodHorario: "H004" },

      // 👉 Novas disponibilidades
      { CodDisp: "D005", Data: "2025-11-30", Reservado: false, CodHorario: "H005" },
      { CodDisp: "D006", Data: "2025-11-30", Reservado: false, CodHorario: "H006" },
      { CodDisp: "D007", Data: "2025-12-01", Reservado: false, CodHorario: "H007" },
      { CodDisp: "D008", Data: "2025-12-01", Reservado: false, CodHorario: "H008" },
      { CodDisp: "D009", Data: "2025-12-02", Reservado: false, CodHorario: "H009" },
      { CodDisp: "D010", Data: "2025-12-02", Reservado: false, CodHorario: "H010" },
      { CodDisp: "D011", Data: "2025-12-03", Reservado: false, CodHorario: "H011" },
      { CodDisp: "D012", Data: "2025-12-03", Reservado: false, CodHorario: "H012" },
      { CodDisp: "D013", Data: "2025-12-04", Reservado: false, CodHorario: "H013" },
      { CodDisp: "D014", Data: "2025-12-04", Reservado: false, CodHorario: "H014" },

      // Segunda semana extra
      { CodDisp: "D015", Data: "2025-12-05", Reservado: false, CodHorario: "H001" },
      { CodDisp: "D016", Data: "2025-12-06", Reservado: false, CodHorario: "H003" },
      { CodDisp: "D017", Data: "2025-12-07", Reservado: false, CodHorario: "H008" },
      { CodDisp: "D018", Data: "2025-12-08", Reservado: false, CodHorario: "H012" },
    ]

    disponibilidades.forEach((d) => this.disponibilidades.set(d.CodDisp, d))
  }

  // Método conforme diagrama de classes
  public encontraDisponibilidade(codDisp: string): Disponibilidade | null {
    return this.disponibilidades.get(codDisp) || null
  }

  public reservaDisponibilidade(codDisp: string): boolean {
    const disp = this.disponibilidades.get(codDisp)
    if (disp && !disp.Reservado) {
      disp.Reservado = true
      return true
    }
    return false
  }

  public listarDisponibilidadesPorData(data: string): Disponibilidade[] {
    return Array.from(this.disponibilidades.values()).filter((d) => d.Data === data && !d.Reservado)
  }

  public listarDisponibilidadesPorMedico(codMedico: string): Disponibilidade[] {
    return Array.from(this.disponibilidades.values()).filter((d) => {
      const horario = this.horarios.get(d.CodHorario || "")
      return horario?.idMedico === codMedico && !d.Reservado
    })
  }

  public getMedico(codMedico: string): Medico | null {
    return this.medicos.get(codMedico) || null
  }

  public getHorario(codHorario: string): Horario | null {
    return this.horarios.get(codHorario) || null
  }

  public getEspecialidade(codEspec: string): Especialidade | null {
    return this.especialidades.get(codEspec) || null
  }

  public listarMedicos(): Medico[] {
    return Array.from(this.medicos.values())
  }

  public listarEspecialidades(): Especialidade[] {
    return Array.from(this.especialidades.values())
  }
}

export const catalogoDisponibilidade = CatalogoDisponibilidade.getInstance()
