// Controller: coordena o caso de uso "Marcar Consulta"
// Low Coupling: não conhece detalhes internos das entidades
// Versão atualizada para o modelo Tipo A (paciente vem do login)

import { catalogoDisponibilidade } from "@/lib/catalogues/catalogo-disponibilidade"
import type { Consulta, Pagamento } from "@/lib/types"

export class MarcaConsultaController {
  private static instance: MarcaConsultaController
  private consultas: Map<string, Consulta> = new Map()
  private pagamentos: Map<string, Pagamento> = new Map()

  private constructor() {}

  public static getInstance(): MarcaConsultaController {
    if (!MarcaConsultaController.instance) {
      MarcaConsultaController.instance = new MarcaConsultaController()
    }
    return MarcaConsultaController.instance
  }

  // Método principal do caso de uso conforme diagrama de comunicação
  public criarConsulta(
    idPaciente: string,
    codDisp: string,
    valor: number,
    dataPagam: string,
    horaPagam: string,
    tipoPagam: "credito" | "debito" | "pix" | "dinheiro",
  ): { sucesso: boolean; consulta?: Consulta; mensagem: string } {

    // 1.1 — Paciente agora vem do login → apenas valida se existe
    if (!idPaciente || idPaciente.trim() === "") {
      return { sucesso: false, mensagem: "Paciente não encontrado" }
    }

    // 1.2 — Localiza disponibilidade no catálogo
    const disponibilidade = catalogoDisponibilidade.encontraDisponibilidade(codDisp)
    if (!disponibilidade) {
      return { sucesso: false, mensagem: "Disponibilidade não encontrada" }
    }

    if (disponibilidade.Reservado) {
      return { sucesso: false, mensagem: "Horário já reservado" }
    }

    // 1.3 — Cria consulta + pagamento
    const resultado = this.criaConsultaParaPaciente(
      idPaciente,
      disponibilidade.CodDisp,
      valor,
      dataPagam,
      horaPagam,
      tipoPagam,
    )

    // 1.3.2 — Reserva a disponibilidade no catálogo
    if (resultado.sucesso) {
      catalogoDisponibilidade.reservaDisponibilidade(codDisp)
    }

    return resultado
  }

  // Creator: encapsula a criação da consulta e do pagamento
  private criaConsultaParaPaciente(
    id: string,
    codDisp: string,
    valor: number,
    dataPagam: string,
    horaPagam: string,
    tipoPagam: "credito" | "debito" | "pix" | "dinheiro",
  ): { sucesso: boolean; consulta?: Consulta; mensagem: string } {
    try {
      // 1.3.1.1 — Criar Pagamento
      const codPagamento = `PAG${Date.now()}`
      const pagamento: Pagamento = {
        CodPagamento: codPagamento,
        Valor: valor,
        DataPagam: dataPagam,
        HoraPagam: horaPagam,
        TipoPagam: tipoPagam,
      }

      // 1.3.1 — Criar Consulta
      const codConsulta = `CON${Date.now()}`
      const consulta: Consulta = {
        CodConsulta: codConsulta,
        Status: "agendada",
        idPaciente: id,
        CodDisp: codDisp,
      }

      // Vincula o pagamento
      pagamento.CodConsulta = codConsulta

      // Salva em memória
      this.consultas.set(codConsulta, consulta)
      this.pagamentos.set(codPagamento, pagamento)

      return {
        sucesso: true,
        consulta,
        mensagem: "Consulta marcada com sucesso",
      }
    } catch (error) {
      return {
        sucesso: false,
        mensagem: "Erro ao criar consulta: " + (error as Error).message,
      }
    }
  }

  // Métodos utilitários
  public getConsulta(codConsulta: string): Consulta | null {
    return this.consultas.get(codConsulta) || null
  }

  public getConsultasPorPaciente(idPaciente: string): Consulta[] {
    return Array.from(this.consultas.values()).filter(
      (c) => c.idPaciente === idPaciente,
    )
  }

  public getPagamento(codPagamento: string): Pagamento | null {
    return this.pagamentos.get(codPagamento) || null
  }
}

export const marcaConsultaController = MarcaConsultaController.getInstance()
