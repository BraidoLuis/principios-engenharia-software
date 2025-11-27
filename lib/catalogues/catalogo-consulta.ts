import type { Consulta } from "@/lib/types"

export class CatalogoConsulta {
  private static instance: CatalogoConsulta
  private consultas: Map<string, Consulta> = new Map()

  private constructor() {
    console.log("CatalogoConsulta inicializado")
  }

  public static getInstance(): CatalogoConsulta {
    if (!CatalogoConsulta.instance) {
      CatalogoConsulta.instance = new CatalogoConsulta()
    }
    return CatalogoConsulta.instance
  }

  /**
   * Carrega consultas para o usuário logado
   * (usado no login)
   */
  public carregarConsultasDoPaciente(lista: Consulta[]) {
    lista.forEach((consulta) => {
      this.consultas.set(consulta.CodConsulta, consulta)
    })
  }

  /**
   * Limpa consultas ao deslogar
   */
  public reset() {
    this.consultas.clear()
  }

  public buscarPorCodigo(codConsulta: string): Consulta | null {
    return this.consultas.get(codConsulta) || null
  }

  public buscarPorPaciente(idPaciente: string): Consulta[] {
    return Array.from(this.consultas.values()).filter(
      (c) => c.idPaciente === idPaciente
    )
  }

  public atualizarStatus(codConsulta: string, novoStatus: Consulta["Status"]): void {
    const consulta = this.consultas.get(codConsulta)
    if (consulta) {
      consulta.Status = novoStatus
      this.consultas.set(codConsulta, consulta)
    }
  }

  public adicionar(consulta: Consulta) {
    this.consultas.set(consulta.CodConsulta, consulta)
  }
}

export const catalogoConsulta = CatalogoConsulta.getInstance()
