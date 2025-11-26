// Information Expert: conhece e gerencia avaliações
// Pure Fabrication: repositório como serviço de persistência

import type { Avaliacao } from "@/lib/types"

export class AvaliacaoRepository {
  private static instance: AvaliacaoRepository
  private avaliacoes: Map<string, Avaliacao> = new Map()

  private constructor() {}

  public static getInstance(): AvaliacaoRepository {
    if (!AvaliacaoRepository.instance) {
      AvaliacaoRepository.instance = new AvaliacaoRepository()
    }
    return AvaliacaoRepository.instance
  }

  public adicionar(avaliacao: Avaliacao): void {
    this.avaliacoes.set(avaliacao.CodAvaliacao, avaliacao)
  }

  public buscarPorCodigo(codAvaliacao: string): Avaliacao | null {
    return this.avaliacoes.get(codAvaliacao) || null
  }

  public buscarPorConsulta(codConsulta: string): Avaliacao | null {
    return Array.from(this.avaliacoes.values()).find((a) => a.CodConsulta === codConsulta) || null
  }

  public listarTodas(): Avaliacao[] {
    return Array.from(this.avaliacoes.values())
  }

  public calcularMediaAvaliacoes(): number {
    const avaliacoes = this.listarTodas()
    if (avaliacoes.length === 0) return 0
    const soma = avaliacoes.reduce((acc, av) => acc + av.Nota, 0)
    return soma / avaliacoes.length
  }
}

export const avaliacaoRepository = AvaliacaoRepository.getInstance()
