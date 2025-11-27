// Controller Pattern: coordena o caso de uso "Visualizar Consultas Marcadas"
// Low Coupling: comunica-se com catálogos através de interfaces
// High Cohesion: responsável apenas por visualização de consultas

import type { Consulta } from "@/lib/types"
import { catalogoConsulta } from "@/lib/catalogues/catalogo-consulta"
import { catalogoDisponibilidade } from "@/lib/catalogues/catalogo-disponibilidade"
import { marcaConsultaController } from "./marca-consulta-controller"


export interface ConsultaDetalhada extends Consulta {
  medicoNome?: string
  medicoEspecialidade?: string
  data?: string
  horario?: string
  valor?: number
  metodoPagamento?: string
  statusPagamento?: string
}

export class VisualizaConsultasController {
  private static instance: VisualizaConsultasController

  private constructor() {}

  public static getInstance(): VisualizaConsultasController {
    if (!VisualizaConsultasController.instance) {
      VisualizaConsultasController.instance = new VisualizaConsultasController()
    }
    return VisualizaConsultasController.instance
  }

  /**
   * Information Expert: controller conhece como buscar e enriquecer consultas
   * Busca todas as consultas de um paciente e retorna com informações detalhadas
   */
  public listarConsultasPorPaciente(codPaciente: string): ConsultaDetalhada[] {
    // Busca consultas do paciente através do catálogo
    const consultas = catalogoConsulta.buscarPorPaciente(codPaciente)

    // Enriquece cada consulta com informações detalhadas
    return consultas.map((consulta) => this.enriquecerConsulta(consulta))
  }

  /**
   * Busca consultas filtradas por status
   */
  public listarConsultasPorStatus(codPaciente: string, status: Consulta["Status"]): ConsultaDetalhada[] {
    const consultas = catalogoConsulta.buscarPorPaciente(codPaciente)
    return consultas.filter((c) => c.Status == status).map((consulta) => this.enriquecerConsulta(consulta))
  }

  /**
   * Busca consultas agendadas (futuras)
   */
  public listarConsultasAgendadas(codPaciente: string): ConsultaDetalhada[] {
    return this.listarConsultasPorStatus(codPaciente, "agendada").concat(
      this.listarConsultasPorStatus(codPaciente, "confirmada"),
    )
  }

  /**
   * Busca histórico de consultas (concluídas e canceladas)
   */
  public listarHistoricoConsultas(codPaciente: string): ConsultaDetalhada[] {
    return this.listarConsultasPorStatus(codPaciente, "concluida").concat(
      this.listarConsultasPorStatus(codPaciente, "cancelada"),
    )
  }

  /**
   * Busca uma consulta específica com todos os detalhes
   */
  public obterConsultaDetalhada(codConsulta: string): ConsultaDetalhada | null {
    const consulta = catalogoConsulta.buscarPorCodigo(codConsulta)
    if (!consulta) return null

    return this.enriquecerConsulta(consulta)
  }

  /**
   * Protected Variations: encapsula a lógica de enriquecimento de dados
   * Mudanças na estrutura de dados não afetam os métodos públicos
   */
  private enriquecerConsulta(consulta: Consulta): ConsultaDetalhada {
    // Busca disponibilidade
    const disponibilidade = catalogoDisponibilidade.encontraDisponibilidade(consulta.CodDisp || "")

    // Busca horário
    const horario = disponibilidade
      ? catalogoDisponibilidade.getHorario(disponibilidade.CodHorario || "")
      : null

    // Busca médico
    const medico = horario
      ? catalogoDisponibilidade.getMedico(horario.idMedico || "")
      : null

    // Busca especialidade
    const especialidade = medico
      ? catalogoDisponibilidade.getEspecialidade(medico.CodEspec || "")
      : null

    // Busca pagamento
    const pagamento = marcaConsultaController.getPagamento(consulta.CodConsulta)

    return {
      ...consulta,
      medicoNome: medico?.Nome,
      medicoEspecialidade: especialidade?.Nome,
      data: disponibilidade?.Data,
      horario: horario ? `${horario.HoraIni} - ${horario.HoraFim}` : undefined,
      valor: pagamento?.Valor,
      metodoPagamento: pagamento?.TipoPagam,
    }
  }

  /**
   * Cancela uma consulta
   */
  public cancelarConsulta(codConsulta: string): boolean {
    const consulta = catalogoConsulta.buscarPorCodigo(codConsulta)
    if (!consulta) return false

    // Só pode cancelar consultas agendadas ou confirmadas
    if (consulta.Status !== "agendada" && consulta.Status !== "confirmada") {
      return false
    }

    // Atualiza status da consulta
    const sucesso = marcaConsultaController.cancelarConsulta(codConsulta)
    
    return sucesso
  }

  /**
   * Confirma uma consulta
   */
  public confirmarConsulta(codConsulta: string): boolean {
    const consulta = catalogoConsulta.buscarPorCodigo(codConsulta)
    if (!consulta) return false

    // Só pode confirmar consultas agendadas
    if (consulta.Status !== "agendada") {
      return false
    }

    catalogoConsulta.atualizarStatus(codConsulta, "confirmada")
    return true
  }

  
}

export const visualizaConsultasController = VisualizaConsultasController.getInstance()
