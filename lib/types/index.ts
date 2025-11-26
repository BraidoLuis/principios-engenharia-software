// Domain Types - Information Expert: cada tipo conhece seus próprios dados
// Seguindo exatamente as classes e atributos fornecidos

export type UserRole = "patient" | "doctor" | "admin"

// Classe: Paciente
export interface Paciente {
  id: string
  Nome: string
  Senha: string
  Email: string
  Contato: string
  CEP: string
  CPF: string
  DataNasc: string
  Numero: string
  Bairro: string
  Cidade: string
  Estado: string
}

// Classe: Médico
export interface Medico {
  id: string
  Nome: string
  Email: string
  Senha: string
  Contato: string
  CRM: string
  Preco: number
  CodEspec?: string // Foreign key para Especialidade
}

// Classe: Especialidade
export interface Especialidade {
  CodEspec: string
  Nome: string
}

// Classe: Horário
export interface Horario {
  CodHorario: string
  Dia: string // Dia da semana
  HoraIni: string
  HoraFim: string
  idMedico?: string // Foreign key para Médico
}

// Classe: Disponibilidade
export interface Disponibilidade {
  CodDisp: string
  Data: string
  Reservado: boolean
  CodHorario?: string // Foreign key para Horário
}

// Classe: Consulta
export interface Consulta {
  CodConsulta: string
  Status: "agendada" | "confirmada" | "concluida" | "cancelada"
  idPaciente?: string   // ← AGORA É ASSIM
  idMedico?: string     // opcional se quiser mudar Medico também
  CodDisp?: string
}

// Classe: Pagamento
export interface Pagamento {
  CodPagamento: string
  Valor: number
  DataPagam: string
  HoraPagam: string
  TipoPagam: "credito" | "debito" | "pix" | "dinheiro"
  CodConsulta?: string // Foreign key para Consulta
}

// Classe: Avaliação
export interface Avaliacao {
  CodAvaliacao: string
  Descricao: string
  Nota: number
  CodConsulta?: string // Foreign key para Consulta
}

// Classe: Prescrição
export interface Prescricao {
  CodPresc: string
  Medicamentos: string
  Quantidade: string
  Frequencia: string
  Duracao: string
  Observacoes: string
  CodConsulta?: string // Foreign key para Consulta
}

// Classe: Notificação
export interface Notificacao {
  CodNotificacao: string
  Tipo: "lembrete" | "confirmacao" | "prescricao" | "pagamento"
  Data: string
  Mensagem: string
  idPaciente?: string // Foreign key para Paciente
  Lida?: boolean // Campo adicional para controle de leitura
}

// Tipos auxiliares para compatibilidade com o sistema existente
export type User =
  | Paciente & { role: "patient"; name?:string}
  | Medico & { role: "doctor"; name?:string}
  | {
      id: string
      email: string
      name: string
      role: "admin"
    }

export interface UserWithRole extends Omit<Paciente | Medico, "Senha"> {
  role: UserRole
}
