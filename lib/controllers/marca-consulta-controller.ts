// Controller: coordena o caso de uso "Marcar Consulta" e gerencia persistência
import { catalogoConsulta } from "@/lib/catalogues/catalogo-consulta"
import { catalogoDisponibilidade } from "@/lib/catalogues/catalogo-disponibilidade"
import type { Consulta, Pagamento } from "@/lib/types"

const STORAGE_KEY_CONSULTAS = "app_consultas_v1"
const STORAGE_KEY_PAGAMENTOS = "app_pagamentos_v1"

export class MarcaConsultaController {
  private static instance: MarcaConsultaController
  private consultas: Map<string, Consulta> = new Map()
  private pagamentos: Map<string, Pagamento> = new Map()

  private constructor() {
    // Ao iniciar, tenta carregar dados salvos anteriormente
    this.carregarDoStorage()
  }

  public static getInstance(): MarcaConsultaController {
    if (!MarcaConsultaController.instance) {
      MarcaConsultaController.instance = new MarcaConsultaController()
    }
    return MarcaConsultaController.instance
  }

  // --- MÉTODOS DE PERSISTÊNCIA (NOVO) ---
  private salvarNoStorage() {
    if (typeof window !== "undefined") {
      const consultasArray = Array.from(this.consultas.entries())
      const pagamentosArray = Array.from(this.pagamentos.entries())
      localStorage.setItem(STORAGE_KEY_CONSULTAS, JSON.stringify(consultasArray))
      localStorage.setItem(STORAGE_KEY_PAGAMENTOS, JSON.stringify(pagamentosArray))
    }
  }

  private carregarDoStorage() {
    if (typeof window !== "undefined") {
      const consultasJson = localStorage.getItem(STORAGE_KEY_CONSULTAS)
      const pagamentosJson = localStorage.getItem(STORAGE_KEY_PAGAMENTOS)

      if (consultasJson) {
        this.consultas = new Map(JSON.parse(consultasJson))
        // Sincroniza também com o catálogo para visualização
        this.consultas.forEach(c => catalogoConsulta.adicionar(c))
      }
      if (pagamentosJson) {
        this.pagamentos = new Map(JSON.parse(pagamentosJson))
      }
    }
  }
  // --------------------------------------

  public criarConsulta(
    idPaciente: string,
    codDisp: string,
    valor: number,
    dataPagam: string,
    horaPagam: string,
    tipoPagam: "credito" | "debito" | "pix" | "dinheiro",
  ): { sucesso: boolean; consulta?: Consulta; mensagem: string } {
    
    // ... Validações permanecem iguais ...
    if (!idPaciente) return { sucesso: false, mensagem: "Paciente não identificado" }

    const disponibilidade = catalogoDisponibilidade.encontraDisponibilidade(codDisp)
    if (!disponibilidade || disponibilidade.Reservado) {
      return { sucesso: false, mensagem: "Horário indisponível" }
    }

    const resultado = this.criaConsultaParaPaciente(
      idPaciente,
      disponibilidade.CodDisp,
      valor,
      dataPagam,
      horaPagam,
      tipoPagam,
    )

    if (resultado.sucesso) {
      catalogoDisponibilidade.reservaDisponibilidade(codDisp)
      this.salvarNoStorage() // <--- SALVA APÓS CRIAR
    }

    return resultado
  }

  private criaConsultaParaPaciente(
    id: string,
    codDisp: string,
    valor: number,
    dataPagam: string,
    horaPagam: string,
    tipoPagam: "credito" | "debito" | "pix" | "dinheiro",
  ): { sucesso: boolean; consulta?: Consulta; mensagem: string } {
    try {
      const codPagamento = `PAG${Date.now()}`
      const codConsulta = `CON${Date.now()}`

      const consulta: Consulta = {
        CodConsulta: codConsulta,
        Status: "agendada",
        idPaciente: id,
        CodDisp: codDisp,
      }

      const pagamento: Pagamento = {
        CodPagamento: codPagamento,
        Valor: valor,
        DataPagam: dataPagam, 
        HoraPagam: horaPagam,
        TipoPagam: tipoPagam,
        CodConsulta: codConsulta,
        Status: "Pendente" 
      }

      this.consultas.set(codConsulta, consulta)
      this.pagamentos.set(codPagamento, pagamento)
      catalogoConsulta.adicionar(consulta)
      
      this.salvarNoStorage() 

      return { sucesso: true, consulta, mensagem: "Sucesso" }
    } catch (error) {
      return { sucesso: false, mensagem: "Erro interno" }
    }
  }

  public getPagamentosPorPaciente(idPaciente: string): Pagamento[] {
    this.carregarDoStorage()
    
    console.log("--- DEBUG CONTROLLER ---")
    console.log("Total de pagamentos na memória:", this.pagamentos.size)
    console.log("Total de consultas na memória:", this.consultas.size)
    console.log("ID do Paciente Logado:", idPaciente)

    const pagamentosDoPaciente: Pagamento[] = []

    this.pagamentos.forEach((pagamento) => {
      const consulta = this.consultas.get(pagamento.CodConsulta || "")

      if (consulta) {
         console.log(`Comparando: Paciente da Consulta (${consulta.idPaciente}) === Logado (${idPaciente})?`, consulta.idPaciente === idPaciente)
      } else {
         console.log(`ALERTA: Pagamento ${pagamento.CodPagamento} não tem consulta vinculada ou não achou a consulta ${pagamento.CodConsulta}`)
      }

      if (consulta) {
        pagamentosDoPaciente.push(pagamento)
      }
    })
    
    return pagamentosDoPaciente
  }

  public getPagamento(codConsulta: string): Pagamento | undefined {
    // Garante que os dados estão atualizados do storage
    this.carregarDoStorage()
    
    // Itera sobre os valores do Map para encontrar o pagamento vinculado à consulta
    for (const pagamento of this.pagamentos.values()) {
      if (pagamento.CodConsulta === codConsulta) {
        return pagamento
      }
    }
    
    return undefined
  }

  public confirmarPagamento(codPagamento: string, metodo: "credito" | "pix"): boolean {
    const pagamento = this.pagamentos.get(codPagamento)
    if (!pagamento) return false

    pagamento.TipoPagam = metodo
    pagamento.Status = "Pago" // Atualiza status
    pagamento.DataPagam = new Date().toISOString().split('T')[0] 
    pagamento.HoraPagam = new Date().toLocaleTimeString()

    if(pagamento.CodConsulta){
      const consulta = this.consultas.get(pagamento.CodConsulta)
        if (consulta) consulta.Status = "confirmada"
    }

    this.salvarNoStorage() // <--- ATUALIZA STORAGE
    return true
  }

  public cancelarConsulta(codConsulta: string): boolean {
    // 1. Carrega dados atuais
    this.carregarDoStorage()

    // 2. Busca a consulta
    const consulta = this.consultas.get(codConsulta)
    if (!consulta) return false

    // 3. Atualiza status da consulta
    consulta.Status = "cancelada"
    
    // 4. Se tiver pagamento vinculado, cancela também
    const pagamento = this.getPagamento(codConsulta)
    if (pagamento) {
        pagamento.Status = "Cancelado"
    }

    // 5. Libera a disponibilidade (opcional, dependendo da sua regra de negócio)
    if (consulta.CodDisp) {
        catalogoDisponibilidade.reservaDisponibilidade(consulta.CodDisp)
    }

    // 6. Atualiza o catálogo global para a UI refletir imediatamente
    catalogoConsulta.atualizarStatus(codConsulta, "cancelada")

    // 7. SALVA NO DISCO (A chave para resolver o problema)
    this.salvarNoStorage()

    return true
  }
}

export const marcaConsultaController = MarcaConsultaController.getInstance()