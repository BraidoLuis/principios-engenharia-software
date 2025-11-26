// Controller: coordena o caso de uso "Cadastrar Horários de Atendimento"
// Low Coupling: não depende de implementações específicas
// High Cohesion: focado apenas em cadastrar horários

import { Horario } from "@/lib/types"
import CatalogoHorario from "@/lib/catalogues/catalogo-horario"

class CadastraHorarioController {
  private catalogoHorario: CatalogoHorario

  constructor() {
    // Indirection: usa o catálogo como intermediário
    this.catalogoHorario = CatalogoHorario.getInstance()
  }

  // Controller: coordena o fluxo de cadastro de horário
  public cadastrarHorario(
    dia: string,
    horaIni: string,
    horaFim: string,
    codMedico: string
  ): { sucesso: boolean; mensagem: string; horario?: Horario } {
    // Validação de dados
    if (!dia || !horaIni || !horaFim || !codMedico) {
      return {
        sucesso: false,
        mensagem: "Todos os campos são obrigatórios",
      }
    }

    // Validação de horário
    if (horaIni >= horaFim) {
      return {
        sucesso: false,
        mensagem: "Horário de início deve ser anterior ao horário de fim",
      }
    }

    // Verifica conflito de horários
    const horariosExistentes = this.catalogoHorario.buscarHorariosPorMedico(codMedico)
    const conflito = horariosExistentes.some((h) => {
      if (h.Dia !== dia) return false
      
      // Verifica sobreposição de horários
      return (
        (horaIni >= h.HoraIni && horaIni < h.HoraFim) ||
        (horaFim > h.HoraIni && horaFim <= h.HoraFim) ||
        (horaIni <= h.HoraIni && horaFim >= h.HoraFim)
      )
    })

    if (conflito) {
      return {
        sucesso: false,
        mensagem: "Já existe um horário cadastrado neste período",
      }
    }

    // Creator: delega a criação do horário ao catálogo
    const novoHorario: Horario = {
      CodHorario: `H${Date.now()}`,
      Dia: dia,
      HoraIni: horaIni,
      HoraFim: horaFim,
      CodMedico: codMedico,
    }

    this.catalogoHorario.cadastrarHorario(novoHorario)

    return {
      sucesso: true,
      mensagem: "Horário cadastrado com sucesso",
      horario: novoHorario,
    }
  }

  // Listar horários do médico
  public listarHorariosMedico(codMedico: string): Horario[] {
    return this.catalogoHorario.buscarHorariosPorMedico(codMedico)
  }

  // Remover horário
  public removerHorario(codHorario: string): { sucesso: boolean; mensagem: string } {
    const removido = this.catalogoHorario.removerHorario(codHorario)
    
    if (removido) {
      return {
        sucesso: true,
        mensagem: "Horário removido com sucesso",
      }
    }
    
    return {
      sucesso: false,
      mensagem: "Horário não encontrado",
    }
  }

  // Atualizar horário
  public atualizarHorario(
    codHorario: string,
    dia: string,
    horaIni: string,
    horaFim: string
  ): { sucesso: boolean; mensagem: string } {
    const horarioExistente = this.catalogoHorario.buscarHorario(codHorario)
    
    if (!horarioExistente) {
      return {
        sucesso: false,
        mensagem: "Horário não encontrado",
      }
    }

    // Validação de horário
    if (horaIni >= horaFim) {
      return {
        sucesso: false,
        mensagem: "Horário de início deve ser anterior ao horário de fim",
      }
    }

    const horarioAtualizado: Horario = {
      ...horarioExistente,
      Dia: dia,
      HoraIni: horaIni,
      HoraFim: horaFim,
    }

    this.catalogoHorario.atualizarHorario(horarioAtualizado)

    return {
      sucesso: true,
      mensagem: "Horário atualizado com sucesso",
    }
  }
}

export default CadastraHorarioController
