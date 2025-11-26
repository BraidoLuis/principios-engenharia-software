// Controller Pattern: coordena o caso de uso "Avaliar Atendimento"
// Low Coupling: usa catálogos e repositórios como dependências

import { catalogoConsulta } from "@/lib/catalogues/catalogo-consulta"
import { avaliacaoRepository } from "@/lib/repositories/avaliacao-repository"
import type { Avaliacao, Consulta } from "@/lib/types"

export class AvaliaAtendimentoController {
  private static instance: AvaliaAtendimentoController

  private constructor() {}

  public static getInstance(): AvaliaAtendimentoController {
    if (!AvaliaAtendimentoController.instance) {
      AvaliaAtendimentoController.instance = new AvaliaAtendimentoController()
    }
    return AvaliaAtendimentoController.instance
  }

  /**
   * Fluxo de avaliação seguindo diagrama de comunicação:
   * 1. Buscar consultas concluídas do paciente (CatalogoConsulta)
   * 2. Verificar se consulta já foi avaliada (AvaliacaoRepository)
   * 3. Criar avaliação (Creator Pattern - Consulta cria Avaliação)
   * 4. Salvar avaliação (AvaliacaoRepository)
   */
  public listarConsultasAvaliaveisPorPaciente(codPaciente: string): Consulta[] {
    // 1. Buscar consultas concluídas
    const consultasConcluidas = catalogoConsulta.buscarPorPaciente(codPaciente).filter(
  c => c.Status === "concluida"
)

    // 2. Filtrar consultas não avaliadas
    return consultasConcluidas.filter((consulta) => {
      const avaliacaoExistente = avaliacaoRepository.buscarPorConsulta(consulta.CodConsulta)
      return !avaliacaoExistente
    })
  }

  public verificarConsultaJaAvaliada(codConsulta: string): boolean {
    const avaliacao = avaliacaoRepository.buscarPorConsulta(codConsulta)
    return avaliacao !== null
  }

  public criarAvaliacao(
    codConsulta: string,
    nota: number,
    descricao: string,
  ): {
    sucesso: boolean
    mensagem: string
    avaliacao?: Avaliacao
  } {
    // Validar consulta existe
    const consulta = catalogoConsulta.buscarPorCodigo(codConsulta)
    if (!consulta) {
      return { sucesso: false, mensagem: "Consulta não encontrada" }
    }

    // Validar status da consulta
    if (consulta.Status !== "concluida") {
      return { sucesso: false, mensagem: "Apenas consultas concluídas podem ser avaliadas" }
    }

    // Verificar se já foi avaliada
    if (this.verificarConsultaJaAvaliada(codConsulta)) {
      return { sucesso: false, mensagem: "Esta consulta já foi avaliada" }
    }

    // Validar nota
    if (nota < 1 || nota > 5) {
      return { sucesso: false, mensagem: "Nota deve estar entre 1 e 5" }
    }

    // Creator Pattern: Consulta cria Avaliação
    const avaliacao: Avaliacao = {
      CodAvaliacao: `AVAL${Date.now()}`,
      Descricao: descricao,
      Nota: nota,
      CodConsulta: codConsulta,
    }

    // Salvar avaliação
    avaliacaoRepository.adicionar(avaliacao)

    return {
      sucesso: true,
      mensagem: "Avaliação registrada com sucesso",
      avaliacao,
    }
  }

  public obterAvaliacaoDaConsulta(codConsulta: string): Avaliacao | null {
    return avaliacaoRepository.buscarPorConsulta(codConsulta)
  }

  public calcularMediaGeralAvaliacoes(): number {
    return avaliacaoRepository.calcularMediaAvaliacoes()
  }
}

export const avaliaAtendimentoController = AvaliaAtendimentoController.getInstance()
