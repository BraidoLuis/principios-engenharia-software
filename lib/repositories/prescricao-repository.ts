// Information Expert: conhece e gerencia prescrições
// Pure Fabrication: repositório como serviço de persistência

import type { Prescricao } from "@/lib/types"

export class PrescricaoRepository {
  private static instance: PrescricaoRepository
  private prescricoes: Map<string, Prescricao> = new Map()

  private constructor() {
    this.initializeMockData()
  }

  public static getInstance(): PrescricaoRepository {
    if (!PrescricaoRepository.instance) {
      PrescricaoRepository.instance = new PrescricaoRepository()
    }
    return PrescricaoRepository.instance
  }

  private initializeMockData() {
    const mockPrescricoes: Prescricao[] = [
      {
        CodPresc: "PRESC001",
        Medicamentos: "Losartana 50mg",
        Quantidade: "30 comprimidos",
        Frequencia: "1x ao dia",
        Duracao: "30 dias",
        Observacoes: "Tomar pela manhã com água",
        CodConsulta: "CON001",
      },
      {
        CodPresc: "PRESC002",
        Medicamentos: "Dipirona 500mg",
        Quantidade: "20 comprimidos",
        Frequencia: "3x ao dia",
        Duracao: "7 dias",
        Observacoes: "Tomar após as refeições em caso de dor",
        CodConsulta: "CON002",
      },
    ]

    mockPrescricoes.forEach((p) => this.prescricoes.set(p.CodPresc, p))
  }

  public adicionar(prescricao: Prescricao): void {
    this.prescricoes.set(prescricao.CodPresc, prescricao)
  }

  public buscarPorCodigo(codPresc: string): Prescricao | null {
    return this.prescricoes.get(codPresc) || null
  }

  public buscarPorConsulta(codConsulta: string): Prescricao | null {
    return Array.from(this.prescricoes.values()).find((p) => p.CodConsulta === codConsulta) || null
  }

  public listarTodas(): Prescricao[] {
    return Array.from(this.prescricoes.values())
  }
}

export const prescricaoRepository = PrescricaoRepository.getInstance()
