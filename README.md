# Sistema de Gestão Médica

Sistema completo de gestão de clínicas médicas com agendamento de consultas, prontuário eletrônico, pagamentos e área administrativa.

## Arquitetura GRASP

Este projeto foi desenvolvido seguindo os princípios GRASP (General Responsibility Assignment Software Patterns):

### Princípios Aplicados

1. **Information Expert**: Atribuição de responsabilidades às classes que possuem as informações necessárias
2. **Creator**: Definição clara de quem cria cada objeto
3. **Controller**: Coordenação de casos de uso através de controllers dedicados
4. **Low Coupling**: Minimização de dependências entre componentes
5. **High Cohesion**: Cada classe tem responsabilidade única e bem definida
6. **Pure Fabrication**: Criação de serviços artificiais para organização
7. **Protected Variations**: Proteção contra mudanças através de interfaces estáveis
8. **Polymorphism**: Comportamento diferenciado por tipo de usuário
9. **Indirection**: Uso de intermediários para reduzir acoplamento

## Estrutura do Projeto

\`\`\`
├── app/                      # Páginas Next.js
│   ├── auth/                 # Autenticação
│   ├── patient/              # Portal do Paciente
│   ├── doctor/               # Portal do Médico
│   └── admin/                # Painel Administrativo
├── components/               # Componentes React
│   ├── auth/                 # Componentes de autenticação
│   ├── patient/              # Componentes do paciente
│   ├── doctor/               # Componentes do médico
│   ├── admin/                # Componentes administrativos
│   ├── payment/              # Componentes de pagamento
│   └── layout/               # Componentes de layout
├── lib/                      # Lógica de negócio
│   ├── types/                # Definições de tipos
│   ├── catalogues/           # Catálogos (Information Expert)
│   ├── controllers/          # Controllers (Controller Pattern)
│   ├── repositories/         # Repositórios (Pure Fabrication)
│   ├── services/             # Serviços (Pure Fabrication)
│   └── hooks/                # React Hooks customizados
└── docs/                     # Documentação
\`\`\`

## Diagramas dos Casos de Uso

### 1. Caso de Uso: Marcar Consulta

#### Diagrama de Classes
\`\`\`
┌─────────────────────┐
│   MarcaConsultaUI   │ (Boundary - Interface com usuário)
│─────────────────────│
│ - paciente: Paciente│
│─────────────────────│
│ + exibirFormulario()│
│ + capturarDados()   │
│ + exibirMensagem()  │
└──────────┬──────────┘
           │ usa
           ▼
┌─────────────────────────────┐
│ MarcaConsultaController     │ (Controller - Coordena o caso de uso)
│─────────────────────────────│
│ - catalogoPaciente          │
│ - catalogoDisponibilidade   │
│─────────────────────────────│
│ + marcarConsulta()          │
│ + buscarMedicosPorEspec()   │
│ + buscarDisponibilidades()  │
│ + validarDados()            │
└──────┬──────────────────┬───┘
       │                  │
       │ usa              │ usa
       ▼                  ▼
┌──────────────────┐  ┌─────────────────────────┐
│ CatalogoPaciente │  │ CatalogoDisponibilidade │ (Information Expert)
│──────────────────│  │─────────────────────────│
│ - pacientes: Map │  │ - disponibilidades: Map │
│──────────────────│  │─────────────────────────│
│ + buscarPorId()  │  │ + buscarPorMedico()     │
│ + atualizar()    │  │ + buscarPorData()       │
└──────────────────┘  │ + reservar()            │
                      │ + cancelarReserva()     │
                      └─────────────────────────┘
       │                           │
       │ gerencia                  │ gerencia
       ▼                           ▼
┌──────────────┐           ┌─────────────────┐
│   Paciente   │           │ Disponibilidade │
│──────────────│           │─────────────────│
│ - CodPaciente│           │ - CodDisp       │
│ - Nome       │───────┐   │ - Data          │
│ - Email      │       │   │ - Reservado     │
│ - CPF        │       │   │ - CodHorario    │
└──────────────┘       │   └─────────────────┘
                       │            │
                       │            │ referencia
                       │            ▼
                       │   ┌─────────────────┐
                       │   │    Horario      │
                       │   │─────────────────│
                       │   │ - CodHorario    │
                       │   │ - Dia           │
                       │   │ - HoraIni       │
                       │   │ - HoraFim       │
                       │   │ - CodMedico     │
                       │   └─────────────────┘
                       │            │
                       │            │ pertence a
                       │            ▼
                       │   ┌─────────────────┐
                       │   │     Medico      │
                       │   │─────────────────│
                       │   │ - CodMedico     │
                       │   │ - Nome          │
                       │   │ - CRM           │
                       │   │ - Preco         │
                       │   │ - CodEspec      │
                       │   └─────────────────┘
                       │            │
                       │            │ tem
                       │            ▼
                       │   ┌─────────────────┐
                       │   │ Especialidade   │
                       │   │─────────────────│
                       │   │ - CodEspec      │
                       │   │ - Nome          │
                       │   └─────────────────┘
                       │
                       │ cria (Creator Pattern)
                       ▼
              ┌─────────────────┐
              │    Consulta     │
              │─────────────────│
              │ - CodConsulta   │
              │ - Status        │
              │ - CodPaciente   │
              │ - CodMedico     │
              │ - CodDisp       │
              └─────────────────┘
                       │
                       │ gera (Creator Pattern)
                       ▼
              ┌─────────────────┐
              │    Pagamento    │
              │─────────────────│
              │ - CodPagamento  │
              │ - Valor         │
              │ - DataPagam     │
              │ - TipoPagam     │
              │ - CodConsulta   │
              └─────────────────┘
\`\`\`

#### Diagrama de Comunicação/Colaboração
\`\`\`
1. Paciente acessa interface
   ↓
┌─────────────────────┐
│  MarcaConsultaUI    │
│  (Boundary)         │
└──────────┬──────────┘
           │ 2: selecionar(especialidade, medico, data, horario, tipoPagamento)
           ▼
┌───────────────────────────┐
│ MarcaConsultaController   │
│ (Controller)              │
└───────┬───────────────────┘
        │
        │ 3: buscarPaciente(codPaciente)
        ▼
┌─────────────────────┐
│  CatalogoPaciente   │ ◄─── Information Expert
│  (Information       │      (conhece pacientes)
│   Expert)           │
└─────────────────────┘
        │
        │ 4: retorna Paciente
        ▼
┌───────────────────────────┐
│ MarcaConsultaController   │
│                           │
└───────┬───────────────────┘
        │
        │ 5: buscarDisponibilidade(codMedico, data)
        ▼
┌──────────────────────────────┐
│  CatalogoDisponibilidade     │ ◄─── Information Expert
│  (Information Expert)        │      (conhece disponibilidades)
└────────┬─────────────────────┘
         │
         │ 6: retorna Disponibilidade
         ▼
┌───────────────────────────────┐
│  MarcaConsultaController      │
│                               │
└────────┬──────────────────────┘
         │
         │ 7: criarConsulta() ◄─── Creator Pattern
         ▼                         (Paciente cria Consulta)
┌─────────────────┐
│    Consulta     │
│  (Entity)       │
└────────┬────────┘
         │
         │ 8: criarPagamento(valor, tipo) ◄─── Creator Pattern
         ▼                                     (Consulta cria Pagamento)
┌─────────────────┐
│   Pagamento     │
│   (Entity)      │
└─────────────────┘
         │
         │ 9: reservarDisponibilidade(codDisp)
         ▼
┌──────────────────────────────┐
│  CatalogoDisponibilidade     │
│                              │
└────────┬─────────────────────┘
         │
         │ 10: confirmação
         ▼
┌───────────────────────────────┐
│  MarcaConsultaController      │
└────────┬──────────────────────┘
         │
         │ 11: exibirMensagemSucesso()
         ▼
┌─────────────────────┐
│  MarcaConsultaUI    │
└─────────────────────┘
\`\`\`

#### Fluxo de Eventos Principais
1. **Paciente acessa a interface** de marcação de consultas
2. **MarcaConsultaUI captura dados**: especialidade, médico, data, horário, forma de pagamento
3. **MarcaConsultaController** (Controller) coordena o processo:
   - Busca dados do paciente via **CatalogoPaciente** (Information Expert)
   - Busca médicos disponíveis por especialidade
   - Busca horários disponíveis via **CatalogoDisponibilidade** (Information Expert)
4. **Valida disponibilidade** do horário selecionado
5. **Cria Consulta** (Creator Pattern - Paciente cria Consulta)
6. **Cria Pagamento** associado (Creator Pattern - Consulta cria Pagamento)
7. **Reserva disponibilidade** no catálogo
8. **Retorna confirmação** para a interface
9. **Exibe mensagem de sucesso** ao paciente

#### Princípios GRASP Aplicados

- **Controller**: `MarcaConsultaController` coordena todo o fluxo do caso de uso
- **Information Expert**: `CatalogoPaciente` e `CatalogoDisponibilidade` conhecem e gerenciam seus dados
- **Creator**: `Paciente` cria `Consulta`, e `Consulta` cria `Pagamento` (quem possui os dados iniciais)
- **Low Coupling**: Controller comunica-se com catálogos através de interfaces bem definidas
- **High Cohesion**: Cada classe tem responsabilidade única e focada
- **Pure Fabrication**: Catálogos são abstrações criadas para organizar lógica de negócio
- **Protected Variations**: Mudanças em persistência não afetam a lógica de negócio

---

### 2. Caso de Uso: Avaliar Atendimento

#### Diagrama de Classes
\`\`\`
┌──────────────────────────┐
│  AvaliaAtendimentoUI     │ (Boundary - Interface com usuário)
│──────────────────────────│
│ - paciente: Paciente     │
│──────────────────────────│
│ + listarConsultas()      │
│ + exibirFormAvaliacao()  │
│ + capturarNota()         │
│ + capturarDescricao()    │
│ + exibirMensagem()       │
└───────────┬──────────────┘
            │ usa
            ▼
┌──────────────────────────────────────┐
│  AvaliaAtendimentoController         │ (Controller - Coordena o caso de uso)
│──────────────────────────────────────│
│ - catalogoConsulta                   │
│ - avaliacaoRepository                │
│──────────────────────────────────────│
│ + listarConsultasAvaliaveisPorPaciente() │
│ + verificarConsultaJaAvaliada()      │
│ + criarAvaliacao()                   │
│ + obterAvaliacaoDaConsulta()         │
│ + calcularMediaGeralAvaliacoes()     │
└─────────┬────────────────────────┬───┘
          │                        │
          │ usa                    │ usa
          ▼                        ▼
┌───────────────────┐     ┌─────────────────────────┐
│ CatalogoConsulta  │     │  AvaliacaoRepository    │ (Pure Fabrication)
│───────────────────│     │─────────────────────────│
│ - consultas: Map  │     │ - avaliacoes: Map       │
│───────────────────│     │─────────────────────────│
│ + buscarPorCodigo()│    │ + adicionar()           │
│ + buscarPorPaciente()│  │ + buscarPorCodigo()     │
│ + buscarConsultasConcluidas()│ │ + buscarPorConsulta()   │
│ + atualizarStatus()│    │ + listarTodas()         │
└─────────┬─ ────────┘     │ + calcularMediaAvaliacoes()│
          │               └─────────────────────────┘
          │ gerencia               │
          ▼                        │ gerencia
┌───────────────────┐              ▼
│     Consulta      │      ┌─────────────────┐
│───────────────────│      │    Avaliacao    │
│ - CodConsulta     │      │─────────────────│
│ - Status          │◄─────│ - CodAvaliacao  │
│ - CodPaciente     │      │ - Descricao     │
│ - CodMedico       │      │ - Nota          │
│ - CodDisp         │      │ - CodConsulta   │
└───────────────────┘      └─────────────────┘
          │                        ▲
          │ cria (Creator Pattern) │
          └────────────────────────┘
\`\`\`

#### Diagrama de Comunicação/Colaboração
\`\`\`
1. Paciente acessa avaliações
   ↓
┌──────────────────────────┐
│  AvaliaAtendimentoUI     │
│  (Boundary)              │
└───────────┬──────────────┘
            │ 2: listarConsultasAvaliaveisPorPaciente(codPaciente)
            ▼
┌─────────────────────────────────┐
│ AvaliaAtendimentoController     │
│ (Controller)                    │
└──────────┬──────────────────────┘
           │
           │ 3: buscarConsultasConcluidas(codPaciente)
           ▼
┌─────────────────────────┐
│  CatalogoConsulta       │ ◄─── Information Expert
│  (Information Expert)   │      (conhece consultas)
└──────────┬──────────────┘
           │
           │ 4: retorna lista de Consultas concluídas
           ▼
┌─────────────────────────────────┐
│ AvaliaAtendimentoController     │
└──────────┬──────────────────────┘
           │
           │ 5: para cada consulta: buscarPorConsulta(codConsulta)
           ▼
┌──────────────────────────┐
│  AvaliacaoRepository     │ ◄─── Information Expert
│  (Pure Fabrication)      │      (conhece avaliações)
└──────────┬───────────────┘
           │
           │ 6: retorna Avaliacao (se exisir)
           ▼
┌─────────────────────────────────┐
│ AvaliaAtendimentoController     │
│ (filtra não avaliadas)          │
└──────────┬──────────────────────┘
           │
           │ 7: retorna lista de consultas não avaliadas
           ▼
┌──────────────────────────┐
│  AvaliaAtendimentoUI     │
│ (exibe lista)           │
└───────────┬──────────────┘
            │
            │ 8. Paciente seleciona consulta e informa (nota, descrição)
            ▼
┌──────────────────────────┐
│  AvaliaAtendimentoUI     │
└───────────┬──────────────┘
            │ 9: criarAvaliacao(codConsulta, nota, descricao)
            ▼
┌─────────────────────────────────┐
│ AvaliaAtendimentoController     │
└──────────┬──────────────────────┘
           │
           │ 10: buscarPorCodigo(codConsulta)
           ▼
┌─────────────────────────┐
│  CatalogoConsulta       │
└──────────┬──────────────┘
           │
           │ 11: retorna Consulta
           ▼
┌─────────────────────────────────┐
│ AvaliaAtendimentoController     │
│ (valida status = "concluida")   │
└──────────┬──────────────────────┘
           │
           │ 12: verificarConsultaJaAvaliada(codConsulta)
           ▼
┌──────────────────────────┐
│  AvaliacaoRepository     │
└──────────┬───────────────┘
           │
           │ 13: retorna se já existe avaliação
           ▼
┌─────────────────────────────────┐
│ AvaliaAtendimentoController     │
│ (valida não duplicação)         │
└──────────┬──────────────────────┘
           │
           │ 14: new Avaliacao() ◄─── Creator Pattern
           ▼                          (Consulta cria Avaliacao)
┌─────────────────┐
│   Avaliacao     │
│   (Entity)      │
└────────┬────────┘
         │
         │ 15: adicionar(avaliacao)
         ▼
┌──────────────────────────┐
│  AvaliacaoRepository     │
└──────────┬───────────────┘
           │
           │ 16: confirmação
           ▼
┌─────────────────────────────────┐
│ AvaliaAtendimentoController     │
└──────────┬──────────────────────┘
           │
           │ 17: exibirMensagemSucesso()
           ▼
┌──────────────────────────┐
│  AvaliaAtendimentoUI     │
└──────────────────────────┘
\`\`\`

#### Fluxo de Eventos Principais

1. **Paciente acessa a aba de avaliações** no portal
2. **AvaliaAtendimentoUI** solicita consultas disponíveis para avaliação
3. **AvaliaAtendimentoController** (Controller) coordena:
   - Busca consultas concluídas do paciente via **CatalogoConsulta** (Information Expert)
   - Para cada consulta, verifica se já foi avaliada via **AvaliacaoRepository**
   - Filtra apenas consultas não avaliadas
4. **Exibe lista de consultas** disponíveis para avaliação
5. **Paciente seleciona consulta** e fornece nota (1-5 estrelas) e descrição opcional
6. **AvaliaAtendimentoController valida**:
   - Consulta existe e está com status "concluida"
   - Consulta ainda não foi avaliada
   - Nota está entre 1 e 5
7. **Cria Avaliação** (Creator Pattern - Consulta cria Avaliação)
8. **Salva avaliação** no repositório
9. **Retorna confirmação** para a interface
10. **Exibe mensagem de sucesso** ao paciente

#### Princípios GRASP Aplicados

- **Controller**: `AvaliaAtendimentoController` coordena todo o fluxo do caso de uso de avaliação
- **Information Expert**: 
  - `CatalogoConsulta` conhece e gerencia consultas
  - `AvaliacaoRepository` conhece e gerencia avaliações
- **Low Coupling**: Controller se comunica com catálogo e repositório através de interfaces bem definidas
- **High Cohesion**: 
  - `AvaliaAtendimentoUI` focado apenas em capturar e exibir avaliações
  - `AvaliacaoRepository` focado apenas em persistir avaliações
- **Pure Fabrication**: `AvaliacaoRepository` é uma abstração criada para gerenciar persistência
- **Protected Variations**: Mudanças na forma de armazenar avaliações não afetam o controller ou UI
- **Indirection**: Repository atua como intermediário entre controller e dados

---

### 3. Caso de Uso: Visualizar Consultas Marcadas

#### Diagrama de Classes
\`\`\`
┌──────────────────────────────┐
│  VisualizaConsultasUI        │ (Boundary - Interface com usuário)
│──────────────────────────────│
│ - paciente: Paciente         │
│──────────────────────────────│
│ + listarConsultas()          │
│ + exibirConsulta()           │
│ + exibirAcoes()              │
│ + capturarCancelamento()     │
│ + capturarConfirmacao()      │
│ + exibirMensagem()           │
└───────────┬──────────────────┘
            │ usa
            ▼
┌──────────────────────────────────────────┐
│  VisualizaConsultasController            │ (Controller - Coordena o caso de uso)
│──────────────────────────────────────────│
│ - catalogoConsulta                       │
│ - catalogoDisponibilidade                │
│──────────────────────────────────────────│
│ + listarConsultasPorPaciente()           │
│ + listarConsultasPorStatus()             │
│ + listarConsultasAgendadas()             │
│ + listarHistoricoConsultas()             │
│ + obterConsultaDetalhada()               │
│ + cancelarConsulta()                     │
│ + confirmarConsulta()                    │
│ - enriquecerConsulta()                   │
└─────────┬────────────────────────┬───────┘
          │                        │
          │ usa                    │ usa
          ▼                        ▼
┌───────────────────┐     ┌─────────────────────────┐
│ CatalogoConsulta  │     │ CatalogoDisponibilidade │ (Information Expert)
│───────────────────│     │─────────────────────────│
│ - consultas: Map  │     │ - disponibilidades: Map │
│───────────────────│     │─────────────────────────│
│ + buscarPorCodigo()│    │ + encontraDisponibilidade()│
│ + buscarPorPaciente()│  │ + getHorario()          │
│ + atualizarStatus()│    │ + getMedico()           │
└─────────┬─ ────────┘     │ + getEspecialidade()    │
          │               │ + cancelarReserva()     │
          │ gerencia      │ ` ` ` ` ` ` ` ` ` ` ` ` `
          ▼               │
┌───────────────────┐     │ gerencia
│     Consulta      │     ▼
│───────────────────│┌─────────────────┐
│ - CodConsulta     ││ Disponibilidade │
│ - Status          ││─────────────────│
│ - CodPaciente     ││ - CodDisp       │
│ - CodMedico       ││ - Data          │
│ - CodDisp         ││ - Reservado     │
└───────────────────┘│ - CodHorario    │
                     └─────────────────┘
                                   │
                                   │ referencia
                                   ▼
                          ┌─────────────────┐
                          │    Horario      │
                          │─────────────────│
                          │ - CodHorario    │
                          │ - Dia           │
                          │ - HoraIni       │
                          │ - HoraFim       │
                          │ - CodMedico     │
                          └─────────────────┘
                                   │
                                   │ pertence a
                                   ▼
                          ┌─────────────────┐
                          │     Medico      │
                          │─────────────────│
                          │ - CodMedico     │
                          │ - Nome          │
                          │ - CRM           │
                          │ - Preco         │
                          │ - CodEspec      │
                          └─────────────────┘
                                   │
                                   │ tem
                                   ▼
                          ┌─────────────────┐
                          │ Especialidade   │
                          │─────────────────│
                          │ - CodEspec      │
                          │ - Nome          │
                          └─────────────────┘
\`\`\`

#### Diagrama de Comunicação/Colaboração
\`\`\`
1. Paciente acessa visualização de consultas
   ↓
┌──────────────────────────┐
│  VisualizaConsultasUI    │
│  (Boundary)              │
└───────────┬──────────────┘
            │ 2: listarConsultasPorPaciente(codPaciente)
            ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
│ (Controller)                    │
└──────────┬──────────────────────┘
           │
           │ 3: buscarPorPaciente(codPaciente)
           ▼
┌─────────────────────────┐
│  CatalogoConsulta       │ ◄─── Information Expert
│  (Information Expert)   │      (conhece consultas)
└──────────┬──────────────┘
           │
           │ 4: retorna lista de Consultas
           ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
│ (para cada consulta)            │
└──────────┬──────────────────────┘
           │
           │ 5: enriquecerConsulta(consulta)
           │
           │ 5.1: encontraDisponibilidade(codDisp)
           ▼
┌──────────────────────────────┐
│  CatalogoDisponibilidade     │ ◄─── Information Expert
│  (Information Expert)        │      (conhece disponibilidades)
└────────┬─────────────────────┘
         │
         │ 5.2: retorna Disponibilidade
         ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
└──────────┬──────────────────────┘
           │
           │ 5.3: getHorario(codHorario)
           ▼
┌──────────────────────────────┐
│  CatalogoDisponibilidade     │
└────────┬─────────────────────┘
         │
         │ 5.4: retorna Horario
         ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
└──────────┬──────────────────────┘
           │
           │ 5.5: getMedico(codMedico)
           ▼
┌──────────────────────────────┐
│  CatalogoDisponibilidade     │
└────────┬─────────────────────┘
         │
         │ 5.6: retorna Medico
         ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
└──────────┬──────────────────────┘
           │
           │ 5.7: getEspecialidade(codEspec)
           ▼
┌──────────────────────────────┐
│  CatalogoDisponibilidade     │
└────────┬─────────────────────┘
         │
         │ 5.8: retorna Especialidade
         ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
│ (monta ConsultaDetalhada)       │
└──────────┬──────────────────────┘
           │
           │ 6: retorna lista de ConsultasDetalhadas
           ▼
┌──────────────────────────┐
│  VisualizaConsultasUI    │
│  (exibe consultas)       │
└──────────────────────────┘


--- FLUXO ALTERNATIVO: Cancelar Consulta ---

7. Paciente clica em "Cancelar" em uma consulta
   ↓
┌──────────────────────────┐
│  VisualizaConsultasUI    │
└───────────┬──────────────┘
            │ 8: cancelarConsulta(codConsulta)
            ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
└──────────┬──────────────────────┘
           │
           │ 9: buscarPorCodigo(codConsulta)
           ▼
┌─────────────────────────┐
│  CatalogoConsulta       │
└──────────┬──────────────┘
           │
           │ 10: retorna Consulta
           ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
│ (valida status)                 │
└──────────┬──────────────────────┘
           │
           │ 11: atualizarStatus(codConsulta, "cancelada")
           ▼
┌─────────────────────────┐
│  CatalogoConsulta       │
└──────────┬──────────────┘
           │
           │ 12: confirmação
           ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
└──────────┬──────────────────────┘
           │
           │ 13: cancelarReserva(codDisp)
           ▼
┌──────────────────────────────┐
│  CatalogoDisponibilidade     │
└────────┬─────────────────────┘
         │
         │ 14: confirmação
         ▼
┌─────────────────────────────────┐
│ VisualizaConsultasController    │
└──────────┬──────────────────────┘
           │
           │ 15: retorna sucesso
           ▼
┌──────────────────────────┐
│  VisualizaConsultasUI    │
│  (exibe mensagem)        │
└──────────────────────────┘
\`\`\`

#### Fluxo de Eventos Principais

1. **Paciente acessa o portal** e navega para a aba "Consultas"
2. **VisualizaConsultasUI** solicita lista de consultas ao controller
3. **VisualizaConsultasController** (Controller) coordena:
   - Busca todas as consultas do paciente via **CatalogoConsulta** (Information Expert)
   - Para cada consulta, **enriquece com detalhes** através de método privado:
     - Busca disponibilidade associada
     - Busca horário da disponibilidade
     - Busca médico do horário
     - Busca especialidade do médico
     - Busca informações de pagamento
4. **Retorna lista de ConsultasDetalhadas** para a interface
5. **VisualizaConsultasUI exibe** consultas em duas abas:
   - **Agendadas**: consultas com status "agendada" ou "confirmada"
   - **Histórico**: consultas com status "concluida" ou "cancelada"
6. **Para consultas agendadas**, exibe botões de ação:
   - **Confirmar**: muda status de "agendada" para "confirmada"
   - **Cancelar**: muda status para "cancelada" e libera disponibilidade

#### Fluxo Alternativo: Cancelar Consulta

1. **Paciente clica** no botão "Cancelar" em uma consulta agendada
2. **VisualizaConsultasUI** chama `cancelarConsulta()` do controller
3. **Controller busca consulta** no catálogo
4. **Valida** se consulta pode ser cancelada (status "agendada" ou "confirmada")
5. **Atualiza status** da consulta para "cancelada"
6. **Libera disponibilidade** associada no CatalogoDisponibilidade
7. **Retorna confirmação** para a interface
8. **Exibe mensagem de sucesso** e atualiza lista de consultas

#### Fluxo Alternativo: Confirmar Consulta

1. **Paciente clica** no botão "Confirmar" em uma consulta agendada
2. **VisualizaConsultasUI** chama `confirmarConsulta()` do controller
3. **Controller busca consulta** no catálogo
4. **Valida** se consulta pode ser confirmada (status "agendada")
5. **Atualiza status** da consulta para "confirmada"
6. **Retorna confirmação** para a interface
7. **Exibe mensagem de sucesso** e atualiza lista de consultas

#### Princípios GRASP Aplicados

- **Controller**: `VisualizaConsultasController` coordena todo o fluxo de visualização e gerenciamento de consultas
- **Information Expert**: 
  - `CatalogoConsulta` conhece e gerencia consultas do sistema
  - `CatalogoDisponibilidade` conhece e gerencia disponibilidades, horários, médicos e especialidades
- **Low Coupling**: 
  - Controller comunica-se com catálogos através de interfaces bem definidas
  - UI conhece apenas o controller, não os catálogos
- **High Cohesion**: 
  - `VisualizaConsultasUI` focado apenas em exibir e capturar ações sobre consultas
  - `VisualizaConsultasController` focado apenas em coordenar visualização de consultas
  - Cada catálogo gerencia apenas seu domínio específico
- **Protected Variations**: 
  - Método privado `enriquecerConsulta()` encapsula lógica de busca de dados relacionados
  - Mudanças na estrutura de dados não afetam métodos públicos
- **Pure Fabrication**: Catálogos são abstrações criadas para organizar lógica de negócio
- **Indirection**: Controller atua como intermediário entre UI e catálogos, reduzindo acoplamento

---

### 4. Caso de Uso: Pagamento da Consulta

#### Diagrama de Classes
\`\`\`
┌──────────────────────────┐
│  PagamentoConsultaUI     │ (Boundary - Interface com usuário)
│──────────────────────────│
│ - paciente: Paciente     │
│──────────────────────────│
│ + exibirFormulario()     │
│ + selecionarMetodo()     │
│ + capturarDados()        │
│ + exibirConfirmacao()    │
│ + exibirRecibo()         │
└───────────┬──────────────┘
            │ usa
            ▼
┌─────────────────────────────────┐
│  PagamentoConsultaController    │ (Controller - Coordena o caso de uso)
│─────────────────────────────────│
│ - catalogoConsulta              │
│ - catalogoPagamento             │
│─────────────────────────────────│
│ + buscarConsultasPendentes()    │
│ + processarPagamento()          │
│ + gerarRecibo()                 │
│ + validarDadosPagamento()       │
└─────────┬───────────────────┬───┘
          │                   │
          │ usa               │ usa
          ▼                   ▼
┌───────────────────┐  ┌──────────────────────┐
│ CatalogoConsulta  │  │  CatalogoPagamento   │ (Information Expert)
│───────────────────│  │──────────────────────│
│ - consultas: Map  │  │ - pagamentos: Map    │
│───────────────────│  │──────────────────────│
│ + buscarPorCodigo()│ │ + adicionar()        │
│ + atualizar()     │  │ + buscarPorConsulta()│
└─────────┬─────────┘  │ + listarPorPaciente()│
          │            │ + gerarRecibo()      │
          │ gerencia   └──────────────────────┘
          ▼                     │
┌───────────────────┐           │ gerencia
│     Consulta      │           ▼
│───────────────────│   ┌─────────────────┐
│ - CodConsulta     │   │   Pagamento     │
│ - Status          │◄──│─────────────────│
│ - CodPaciente     │   │ - CodPagamento  │
│ - CodMedico       │   │ - Valor         │
│ - CodDisp         │   │ - DataPagam     │
└───────────────────┘   │ - TipoPagam     │
                        │ - Status        │
                        │ - CodConsulta   │
                        └─────────────────┘
\`\`\`

#### Diagrama de Comunicação/Colaboração
\`\`\`
1. Paciente acessa pagamentos
   ↓
┌──────────────────────────┐
│  PagamentoConsultaUI     │
└───────────┬──────────────┘
            │ 2: buscarConsultasPendentes(codPaciente)
            ▼
┌─────────────────────────────────┐
│ PagamentoConsultaController     │
└──────────┬──────────────────────┘
           │ 3: buscarPorPaciente(codPaciente, status="agendada")
           ▼
┌───────────────────┐
│ CatalogoConsulta  │ ◄─── Information Expert
└──────────┬────────┘
           │ 4: retorna lista de Consultas pendentes
           ▼
┌─────────────────────────────────┐
│ PagamentoConsultaController     │
└──────────┬──────────────────────┘
           │ 5: para cada consulta: buscarPorConsulta(codConsulta)
           ▼
┌──────────────────────┐
│ CatalogoPagamento    │ ◄─── Information Expert
└──────────┬───────────┘
           │ 6: retorna Pagamento ou null
           ▼
┌─────────────────────────────────┐
│ PagamentoConsultaController     │
│ (filtra não pagas)              │
└──────────┬──────────────────────┘
           │ 7: retorna consultas com pagamento pendente
           ▼
┌──────────────────────────┐
│  PagamentoConsultaUI     │
│  (exibe consultas)       │
└───────────┬──────────────┘
            │ 8: Paciente seleciona consulta e método (cartão/PIX/dinheiro)
            ▼
┌──────────────────────────┐
│  PagamentoConsultaUI     │
└───────────┬──────────────┘
            │ 9: processarPagamento(codConsulta, tipoPagamento, dados)
            ▼
┌─────────────────────────────────┐
│ PagamentoConsultaController     │
└──────────┬──────────────────────┘
           │ 10: validarDadosPagamento()
           │ 11: new Pagamento() ◄─── Creator Pattern
           ▼
┌─────────────────┐
│   Pagamento     │
└────────┬────────┘
         │ 12: adicionar(pagamento)
         ▼
┌──────────────────────┐
│ CatalogoPagamento    │
└──────────┬───────────┘
           │ 13: confirmação
           ▼
┌─────────────────────────────────┐
│ PagamentoConsultaController     │
└──────────┬──────────────────────┘
           │ 14: atualizar(consulta, status="confirmada")
           ▼
┌───────────────────┐
│ CatalogoConsulta  │
└──────────┬────────┘
           │ 15: confirmação
           ▼
┌─────────────────────────────────┐
│ PagamentoConsultaController     │
└──────────┬──────────────────────┘
           │ 16: gerarRecibo(pagamento)
           ▼
┌──────────────────────────┐
│  PagamentoConsultaUI     │
│  (exibe recibo)          │
└──────────────────────────┘
\`\`\`

**Princípios GRASP**: Controller coordena fluxo, Information Expert em catálogos, Creator para criar Pagamento, Protected Variations isola processamento de pagamento.

---

### 5. Caso de Uso: Efetuar Login

#### Diagrama de Classes
\`\`\`
┌──────────────────────────┐
│      LoginUI             │ (Boundary - Interface com usuário)
│──────────────────────────│
│ + exibirFormulario()     │
│ + capturarCredenciais()  │
│ + exibirErro()           │
│ + redirecionarPortal()   │
└───────────┬──────────────┘
            │ usa
            ▼
┌─────────────────────────────────┐
│     LoginController             │ (Controller - Coordena o caso de uso)
│─────────────────────────────────│
│ - authService                   │
│ - catalogoUsuarios              │
│─────────────────────────────────│
│ + autenticar()                  │
│ + validarCredenciais()          │
│ + criarSessao()                 │
└─────────┬───────────────────┬───┘
          │                   │
          │ usa               │ usa
          ▼                   ▼
┌───────────────────┐   ┌────────────────────┐
│  AuthService     │   │ CatalogoUsuarios   │ (Information Expert)
│──────────────────│   │────────────────────│
│ + hashPassword() │   │ - usuarios: Map    │
│ + verifyPassword()│  │────────────────────│
│ + generateToken()│   │ + buscarPorEmail() │
│ + validateToken()│   │ + verificarSenha() │
└──────────────────┘   │ + getTipo()        │
                       └────────────────────┘
                                │
                                │ gerencia
                                ▼
                       ┌────────────────────┐
                       │     Usuario        │
                       │────────────────────│
                       │ - CodUsuario       │
                       │ - Email            │
                       │ - SenhaHash        │
                       │ - Tipo             │
                       └────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
            ┌───────────┐ ┌─────────┐ ┌──────┐
            │ Paciente  │ │ Medico  │ │Admin │
            └───────────┘ └─────────┘ └──────┘
\`\`\`

#### Diagrama de Comunicação/Colaboração
\`\`\`
1. Usuário acessa página de login
   ↓
┌──────────────────────────┐
│      LoginUI             │
└───────────┬──────────────┘
            │ 2: autenticar(email, senha)
            ▼
┌─────────────────────────────────┐
│     LoginController             │
└──────────┬──────────────────────┘
           │ 3: validarCredenciais(email, senha)
           │ 4: buscarPorEmail(email)
           ▼
┌────────────────────┐
│ CatalogoUsuarios   │ ◄─── Information Expert
└──────────┬─────────┘
           │ 5: retorna Usuario ou null
           ▼
┌─────────────────────────────────┐
│     LoginController             │
└──────────┬──────────────────────┘
           │ 6: verifyPassword(senha, senhaHash)
           ▼
┌──────────────────┐
│  AuthService     │ ◄─── Pure Fabrication
└──────────┬───────┘
           │ 7: retorna boolean
           ▼
┌─────────────────────────────────┐
│     LoginController             │
└──────────┬──────────────────────┘
           │ 8: generateToken(usuario)
           ▼
┌──────────────────┐
│  AuthService     │
└──────────┬───────┘
           │ 9: retorna token JWT
           ▼
┌─────────────────────────────────┐
│     LoginController             │
│ (cria sessão)                   │
└──────────┬──────────────────────┘
           │ 10: redirecionarPortal(tipo)
           ▼
┌──────────────────────────┐
│      LoginUI             │ ◄─── Polymorphism
│ (redireciona conforme tipo)    │      (comportamento por tipo)
└──────────────────────────┘
\`\`\`

**Princípios GRASP**: Controller coordena autenticação, Information Expert valida credenciais, Pure Fabrication para AuthService, Polymorphism para redirecionamento por tipo de usuário.

---

### 6. Caso de Uso: Cadastrar Paciente

#### Diagrama de Classes
\`\`\`
┌──────────────────────────┐
│  CadastraPacienteUI      │ (Boundary)
│──────────────────────────│
│ + exibirFormulario()     │
│ + capturarDados()        │
│ + validarCampos()        │
│ + exibirMensagem()       │
└───────────┬──────────────┘
            │ usa
            ▼
┌─────────────────────────────────┐
│  CadastraPacienteController     │ (Controller)
│─────────────────────────────────│
│ - catalogoPaciente              │
│ - authService                   │
│─────────────────────────────────│
│ + cadastrar()                   │
│ + validarCPF()                  │
│ + validarEmail()                │
│ + verificarDuplicidade()        │
└─────────┬───────────────────────┘
          │ usa
          ▼
┌──────────────────────┐
│  CatalogoPaciente    │ (Information Expert)
│──────────────────────│
│ - pacientes: Map     │
│──────────────────────│
│ + adicionar()        │
│ + buscarPorCPF()     │
│ + buscarPorEmail()   │
└──────────┬───────────┘
           │ gerencia / cria (Creator)
           ▼
┌────────────────────┐
│     Paciente       │
│────────────────────│
│ - CodPaciente      │
│ - Nome             │
│ - Email            │
│ - CPF              │
│ - Telefone         │
│ - DataNasc         │
│ - Endereco         │
└────────────────────┘
\`\`\`

**Princípios GRASP**: Controller coordena cadastro, Information Expert gerencia pacientes, Creator define CatalogoPaciente cria Paciente (possui dados iniciais).

---

### 7. Caso de Uso: Cadastrar Médico

#### Diagrama de Classes
\`\`\`
┌──────────────────────────┐
│   CadastraMedicoUI       │ (Boundary)
│──────────────────────────│
│ + exibirFormulario()     │
│ + listarEspecialidades() │
│ + capturarDados()        │
│ + exibirMensagem()       │
└───────────┬──────────────┘
            │ usa
            ▼
┌─────────────────────────────────┐
│   CadastraMedicoController      │ (Controller)
│─────────────────────────────────│
│ - catalogoMedico                │
│ - catalogoEspecialidade         │
│─────────────────────────────────│
│ + cadastrar()                   │
│ + validarCRM()                  │
│ + verificarDuplicidade()        │
│ + listarEspecialidades()        │
└─────────┬─────────────────┬─────┘
          │                 │
          │ usa             │ usa
          ▼                 ▼
┌──────────────────┐  ┌─────────────────────────┐
│ CatalogoMedico   │  │ CatalogoEspecialidade   │
│──────────────────│  │─────────────────────────│
│ - medicos: Map   │  │0 - especialidades: Map   │
│──────────────────│  │─────────────────────────│
│ + adicionar()    │  │ + listarTodas()         │
│ + buscarPorCRM() │  │ + buscarPorCodigo()     │
└─────────┬────────┘  └─────────────────────────┘
          │ cria (Creator)
          ▼
┌────────────────────┐
│      Medico        │
│────────────────────│
│ - CodMedico        │
│ - Nome             │
│ - CRM              │
│ - Email            │
│ - Preco            │
│ - CodEspec         │
└────────────────────┘
\`\`\`

**Princípios GRASP**: Controller coordena cadastro médico, Information Expert em catálogos, Creator para CatalogoMedico criar Medico.

---

### 8. Caso de Uso: Cadastrar Horários de Atendimento

#### Diagrama de Classes
\`\`\`
┌──────────────────────────────┐
│  CadastraHorarioUI           │ (Boundary)
│──────────────────────────────│
│ - codMedico: string          │
│ - controller: CadastraHorarioController │
│ - horarios: Horario[]        │
│──────────────────────────────│
│ + exibirFormulario()         │
│ + selecionarDia()            │
│ + definirHorarios()          │
│ + cadastrarHorario()         │
│ + listarHorarios()           │
│ + editarHorario()            │
│ + removerHorario()           │
└───────────┬──────────────────┘
            │ usa
            ▼
┌─────────────────────────────────────┐
│  CadastraHorarioController          │ (Controller)
│─────────────────────────────────────│
│ - catalogoHorario: CatalogoHorario  │
│─────────────────────────────────────│
│ + cadastrarHorario(dia, horaIni,    │
│   horaFim, codMedico): Resultado    │
│ + listarHorariosMedico(codMedico)   │
│ + removerHorario(codHorario)        │
│ + atualizarHorario(codHorario,      │
│   dia, horaIni, horaFim)            │
│ - validarDados()                    │
│ - validarIntervalo()                │
│ - verificarConflito()               │
└─────────┬───────────────────────────┘
          │ usa (Indirection)
          ▼
┌─────────────────────────────────────┐
│      CatalogoHorario                │ (Pure Fabrication)
│─────────────────────────────────────│
│ - horarios: Map<string, Horario>    │
│─────────────────────────────────────│
│ + buscarHorariosPorMedico(codMedico)│
│ + cadastrarHorario(horario)         │
│ + buscarHorario(codHorario)         │
│ + removerHorario(codHorario)        │
│ + atualizarHorario(horario)         │
│ + listarTodos()                     │
└─────────┬───────────────────────────┘
          │ cria (Creator)
          ▼
┌────────────────────────────────────┐
│          Horario                   │ (Information Expert)
│────────────────────────────────────│
│ - CodHorario: string               │
│ - Dia: string                      │
│ - HoraIni: string                  │
│ - HoraFim: string                  │
│ - CodMedico: string                │
│────────────────────────────────────│
│ Conhece seus próprios atributos    │
└────────────────────────────────────┘
\`\`\`

#### Diagrama de Comunicação
\`\`\`
1: cadastrarHorario(dia, horaIni, horaFim)
┌─────────────────┐                    ┌───────────────────────┐
│ CadastraHorario │───────────────────▶│ CadastraHorario       │
│ UI              │                    │ Controller            │
└─────────────────┘                    └───────┬───────────────┘
                                               │
                                               │ 2: validarDados()
                                               │ 3: validarIntervalo()
                                               │
                                               │ 4: buscarHorariosPorMedico(codMedico)
                                               ▼
                                       ┌─────────────────┐
                                       │ CatalogoHorario │
                                       └─────────┬───────┘
                                                 │
                                                 │ 5: verificarConflito()
                                                 │
                                                 │ 6: cadastrarHorario(novoHorario)
                                                 │
                                                 │ 7: criar Horario
                                                 ▼
                                       ┌─────────────────┐
                                       │    Horario      │
                                       └─────────────────┘

Fluxo de Comunicação:
1. UI recebe dados do formulário e chama controller
2. Controller valida se todos os campos estão preenchidos
3. Controller valida se horário de início < horário de fim
4. Controller solicita horários existentes do médico ao catálogo
5. Controller verifica se há conflito com horários existentes
6. Controller delega criação ao catálogo
7. Catálogo cria novo objeto Horario
8. Controller retorna resultado de sucesso para UI
9. UI atualiza lista de horários exibida
\`\`\`

#### Princípios GRASP Aplicados

**Controller**
- `CadastraHorarioController` coordena todo o caso de uso
- Recebe eventos da UI e orquestra validações e persistência
- Centraliza lógica de negócio relacionada a horários

**Information Expert**
- `CatalogoHorario` conhece todos os horários e é expert em buscas
- `Horario` conhece seus próprios atributos (Dia, HoraIni, HoraFim)
- Cada classe tem responsabilidade sobre suas informações

**Creator**
- `CatalogoHorario` cria objetos Horario pois:
  - Contém e gerencia todos os horários
  - Tem dados necessários para inicialização
  - Registra horários criados

**Low Coupling**
- UI depende apenas do controller
- Controller usa catálogo através de interface clara
- Mudanças no catálogo não afetam UI

**High Cohesion**
- `CadastraHorarioController` focado em operações de horários
- `CadastraHorarioUI` responsável apenas por interface de horários
- Cada classe tem responsabilidade bem definida

**Pure Fabrication**
- `CatalogoHorario` é classe artificial para gerenciar coleção
- Não representa conceito do domínio médico
- Criada para melhorar design (baixo acoplamento, alta coesão)

**Indirection**
- Controller atua como intermediário entre UI e catálogo
- Reduz dependência direta e facilita manutenção

**Protected Variations**
- Interface do catálogo protege contra mudanças de implementação
- Possível trocar armazenamento sem afetar controller/UI

---

### 9. Caso de Uso: Enviar Prescrição Eletrônica

#### Diagrama de Classes
\`\`\`
┌──────────────────────────────┐
│  EnviaPrescricaoUI           │ (Boundary)
│──────────────────────────────│
│ - medico: Medico             │
│──────────────────────────────│
│ + listarConsultasConcluidas()│
│ + exibirFormulario()         │
│ + adicionarMedicamento()     │
│ + capturarInstrucoes()       │
│ + exibirConfirmacao()        │
└───────────┬──────────────────┘
            │ usa
            ▼
┌─────────────────────────────────────┐
│  EnviaPrescricaoController          │ (Controller)
│─────────────────────────────────────│
│ - catalogoConsulta                  │
│ - prescricaoRepository              │
│ - notificacaoService                │
│─────────────────────────────────────│
│ + listarConsultasDoPaciente()       │
│ + criarPrescricao()                 │
│ + enviarNotificacao()               │
└─────────┬─────────────────────┬─────┘
          │                     │
          │ usa                 │ usa
          ▼                     ▼
┌───────────────────┐   ┌──────────────────────┐
│ CatalogoConsulta  │   │ PrescricaoRepository │
│───────────────────│   │──────────────────────│
│ + buscarPorCodigo()│  │ - prescricoes: Map   │
│ + buscarPorMedico()│  │──────────────────────│
└───────────────────┘   │ + adicionar()        │
                        │ + buscarPorConsulta()│
                        └──────────┬───────────┘
                                   │ gerencia / cria
                                   ▼
                          ┌──────────────────┐
                          │   Prescricao     │
                          │─────────────────│
                          │ - CodPresc       │
                          │ - Medicamentos   │
                          │ - Frequencia     │
                          │ - Duracao        │
                          │ - Instrucoes     │
                          │ - Data           │
                          │ - CodConsulta    │
                          └──────────────────┘
\`\`\`

**Princípios GRASP**: Controller coordena envio de prescrição, Pure Fabrication no PrescricaoRepository, Creator para criar Prescricao, Low Coupling com NotificacaoService.

---

### 10. Caso de Uso: Consultar Histórico Médico

#### Diagrama de Classes
\`\`\`
┌──────────────────────────────┐
│  ConsultaHistoricoUI         │ (Boundary)
│──────────────────────────────┐
│ - usuario: Usuario           │
│──────────────────────────────│
│ + exibirHistorico()          │
│ + filtrarPorData()           │
│ + exibirDetalhesConsulta()   │
│ + exibirPrescricoes()        │
│ + exibirAvaliacoes()         │
└───────────┬──────────────────┘
            │ usa
            ▼
┌──────────────────────────────────────┐
│  ConsultaHistoricoController         │ (Controller)
│──────────────────────────────────────│
│ - catalogoConsulta                   │
│ - prescricaoRepository               │
│ - avaliacaoRepository                │
│──────────────────────────────────────│
│ + obterHistoricoCompleto()           │
│ + filtrarConsultas()                 │
│ + enriquecerComDetalhes()            │
└─────────┬────────────────────────┬───┘
          │                        │
          │ usa                    │ usa
          ▼                        ▼
┌───────────────────┐   ┌──────────────────────┐
│ CatalogoConsulta  │   │ PrescricaoRepository │
│───────────────────│   │──────────────────────│
│ + buscarPorPaciente()│ │ + buscarPorConsulta()│
│ + buscarPorPeriodo()│ └──────────────────────┘
└───────────────────┘            │
          │                      │ usa
          │                      ▼
          │              ┌──────────────────────┐
          │              │ AvaliacaoRepository  │
          │              │──────────────────────│
          │              │ + buscarPorConsulta()│
          │              └──────────────────────┘
          │ gerencia
          ▼
┌───────────────────┐
│     Consulta      │
│───────────────────│
│ - CodConsulta     │
│ - Status          │
│ - CodPaciente     │
│ - CodMedico       │
│ - Data            │
└───────────────────┘
\`\`\`

**Princípios GRASP**: Controller coordena consulta de histórico, Information Expert em todos os repositórios, Protected Variations protege dados sensíveis.

---

### 11. Caso de Uso: Gerar Notificações e Lembretes de Consulta

#### Diagrama de Classes
\`\`\`
┌──────────────────────────────┐
│  NotificacaoUI               │ (Boundary)
│──────────────────────────────│
│ + exibirNotificacoes()       │
│ + marcarComoLida()           │
│ + exibirBadge()              │
└───────────┬──────────────────┘
            │ usa
            ▼
┌──────────────────────────────────────┐
│  NotificacaoController               │ (Controller)
│──────────────────────────────────────│
│ - notificacaoRepository              │
│ - catalogoConsulta                   │
│──────────────────────────────────────│
│ + listarPorUsuario()                 │
│ + marcarComoLida()                   │
│ + contarNaoLidas()                   │
└──────────┬───────────────────────────┘
           │ usa
           ▼
┌──────────────────────────────┐
│  NotificacaoRepository       │ (Information Expert)
│──────────────────────────────│
│ - notificacoes: Map          │
│──────────────────────────────│
│ + adicionar()                │
│ + buscarPorUsuario()         │
│ + marcarLida()               │
│ + contarNaoLidas()           │
└──────────┬───────────────────┘
           │ gerencia
           ▼
┌──────────────────────────────┐
│      Notificacao             │
│──────────────────────────────│
│ - CodNotificacao             │
│ - Tipo                       │
│ - Mensagem                   │
│ - DataEnvio                  │
│ - Lida                       │
│ - CodUsuario                 │
└──────────────────────────────┘

---SUBSISTEMA: Gerador Automático ---

┌──────────────────────────────────────┐
│  NotificacaoScheduler                │ (Pure Fabrication - Serviço)
│──────────────────────────────────────│
│ + verificarConsultasProximas()       │
│ + gerarLembretes()                   │
│ + enviarNotificacoes()               │
└──────────┬───────────────────────────┘
           │ usa
           ▼
┌──────────────────────────────┐
│  CatalogoConsulta            │
│──────────────────────────────│
│ + buscarProximas24h()        │
│ + buscarProximas1h()         │
└──────────────────────────────┘
\`\`\`

**Princípios GRASP**: Pure Fabrication para NotificacaoScheduler (serviço que gera notificações automaticamente), Controller coordena exibição, Information Expert gerencia notificações.

---

### 12. Caso de Uso: Enviar Emails com Comunicações Institucionais

#### Diagrama de Classes
\`\`\`
┌──────────────────────────────┐
│  EnviaEmailUI                │ (Boundary)
│──────────────────────────────│
│ - admin: Admin               │
│──────────────────────────────│
│ + exibirFormulario()         │
│ + selecionarDestinatarios()  │
│ + redigirEmail()             │
│ + exibirPrevia()             │
│ + confirmarEnvio()           │
└───────────┬──────────────────┘
            │ usa
            ▼
┌──────────────────────────────────────┐
│  EnviaEmailController                │ (Controller)
│──────────────────────────────────────│
│ - catalogoUsuarios                   │
│ - emailService                       │
│ - emailRepository                    │
│──────────────────────────────────────│
│ + listarDestinatarios()              │
│ + enviarEmail()                      │
│ + registrarEnvio()                   │
│ + gerarRelatorioEnvios()             │
└──────────┬───────────────────────────┘
           │ usa
           ▼
┌──────────────────────────────┐
│  EmailService                │ (Pure Fabrication)
│──────────────────────────────│
│ + enviarIndividual()         │
│ + enviarEmMassa()            │
│ + validarEmail()             │
│ + formatarMensagem()         │
└──────────────────────────────┘
           │ registra em
           ▼
┌──────────────────────────────┐
│  EmailRepository             │ (Information Expert)
│──────────────────────────────│
│ - emails: Map                │
│──────────────────────────────│
│ + adicionar()                │
│ + buscarPorData()            │
│ + gerarRelatorio()           │
└──────────┬───────────────────┘
           │ gerencia
           ▼
┌──────────────────────────────┐
│      EmailEnviado            │
│──────────────────────────────│
│ - CodEmail                   │
│ - Assunto                    │
│ - Corpo                      │
│ - Destinatarios              │
│ - DataEnvio                  │
│ - Status                     │
└──────────────────────────────┘
\`\`\`

**Princípios GRASP**: Pure Fabrication para EmailService (lógica de envio), Controller coordena, Information Expert gerencia histórico de envios, Indirection reduz acoplamento.

---

### 13. Caso de Uso: Gerar Relatório de Consultas

#### Diagrama de Classes
\`\`\`
┌──────────────────────────────┐
│  GeraRelatorioUI             │ (Boundary)
│──────────────────────────────│
│ - admin: Admin               │
│──────────────────────────────│
│ + selecionarPeriodo()        │
│ + selecionarFiltros()        │
│ + exibirRelatorio()          │
│ + exportarPDF()              │
│ + exportarExcel()            │
└───────────┬──────────────────┘
            │ usa
            ▼
┌──────────────────────────────────────┐
│  GeraRelatorioController             │ (Controller)
│──────────────────────────────────────│
│ - catalogoConsulta                   │
│ - catalogoPagamento                  │
│ - avaliacaoRepository                │
│ - relatorioService                   │
│──────────────────────────────────────│
│ + gerarRelatorioGeral()              │
│ + filtrarDados()                     │
│ + calcularEstatisticas()             │
│ + exportar()                         │
└──────────┬───────────────────────────┘
           │ usa
           ▼
┌──────────────────────────────┐
│  RelatorioService            │ (Pure Fabrication)
│──────────────────────────────│
│ + calcularTotais()           │
│ + agruparPorMedico()         │
│ + agruparPorEspecialidade()  │
│ + calcularReceita()          │
│ + calcularMediaAvaliacoes()  │
│ + gerarGraficos()            │
│ + exportarPDF()              │
│ + exportarExcel()            │
└──────────┬───────────────────┘
           │ consulta
           ▼
┌──────────────────────────────┐
│  CatalogoConsulta            │ (Information Expert)
│──────────────────────────────│
│ + buscarPorPeriodo()         │
│ + buscarPorStatus()          │
│ + buscarPorMedico()          │
│ + contarTotal()              │
└──────────────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│      DadosRelatorio          │
│──────────────────────────────│
│ - TotalConsultas             │
│ - ConsultasPorMedico         │
│ - ConsultasPorEspecialidade  │
│ - ReceitaTotal               │
│ - MediaAvaliacoes            │
│ - Graficos                   │
└──────────────────────────────┘
\`\`\`

**Princípios GRASP**: Pure Fabrication para RelatorioService (agregação e cálculos), Controller coordena geração, Information Expert fornece dados base, High Cohesion em cada componente.

---

## Casos de Uso Implementados

### Paciente
- ✅ Efetuar Login
- ✅ Cadastrar Paciente
- ✅ **Marcar Consulta** (com diagrama GRASP completo)
- ✅ **Visualizar consultas marcadas** (com diagrama GRASP completo)
- ✅ **Avaliação de atendimento** (com diagrama GRASP completo)
- ✅ Consultar Histórico Médico
- ✅ **Pagamento da Consulta**

### Médico
- ✅ Efetuar Login
- ✅ Cadastrar Médico
- ✅ Cadastrar Horários de Atendimento
- ✅ Enviar Prescrição Eletrônica
- ✅ Consultar agenda de consultas
- ✅ Visualizar histórico de pacientes

### Administrador
- ✅ Gerenciar usuários (pacientes e médicos)
- ✅ Gerar Relatório de Consultas
- ✅ Enviar emails com comunicações institucionais
- ✅ Gerar notificações e lembretes de consulta
- ✅ Visualizar dashboard com métricas

## Histórias de Usuário

### 1. Marcar Consulta
**Como** paciente,  
**Eu quero** agendar uma consulta médica selecionando especialidade, médico, data e horário disponível,  
**Para** garantir atendimento médico de forma organizada e conveniente.

**Critérios de Aceitação:**
- Sistema deve listar especialidades médicas disponíveis
- Deve exibir médicos filtrados por especialidade selecionada
- Deve mostrar apenas horários disponíveis do médico escolhido
- Deve permitir seleção de forma de pagamento (cartão, PIX, dinheiro)
- Deve confirmar agendamento e reservar o horário
- Deve enviar notificação de confirmação ao paciente

---

### 2. Visualizar Consultas Marcadas
**Como** paciente,  
**Eu quero** visualizar todas as minhas consultas agendadas e histórico de consultas passadas,  
**Para** acompanhar meus compromissos médicos e ter acesso ao histórico de atendimentos.

**Critérios de Aceitação:**
- Sistema deve listar consultas separadas em "Agendadas" e "Histórico"
- Deve exibir informações completas: médico, especialidade, data, horário, local, preço
- Deve permitir cancelar consultas agendadas
- Deve permitir confirmar presença em consultas
- Deve mostrar status do pagamento de cada consulta
- Deve permitir filtrar consultas por período

---

### 3. Avaliação de Atendimento
**Como** paciente,  
**Eu quero** avaliar o atendimento recebido após uma consulta concluída,  
**Para** fornecer feedback sobre a qualidade do serviço e ajudar outros pacientes na escolha de médicos.

**Critérios de Aceitação:**
- Sistema deve listar apenas consultas concluídas e não avaliadas
- Deve permitir atribuir nota de 1 a 5 estrelas
- Deve permitir adicionar comentário opcional sobre o atendimento
- Não deve permitir avaliar a mesma consulta mais de uma vez
- Deve confirmar envio da avaliação
- Avaliações devem ser visíveis para outros pacientes

---

### 4. Pagamento da Consulta
**Como** paciente,  
**Eu quero** realizar o pagamento de uma consulta agendada,  
**Para** confirmar meu compromisso e garantir o atendimento médico.

**Critérios de Aceitação:**
- Sistema deve listar consultas com pagamento pendente
- Deve suportar múltiplos métodos: cartão de crédito, débito, PIX, dinheiro
- Deve validar dados de pagamento fornecidos
- Deve gerar comprovante/recibo após pagamento
- Deve atualizar status da consulta após pagamento confirmado
- Deve enviar notificação de confirmação de pagamento

---

### 5. Efetuar Login
**Como** usuário (paciente, médico ou administrador),  
**Eu quero** fazer login no sistema com email e senha,  
**Para** acessar funcionalidades específicas do meu perfil de forma segura.

**Critérios de Aceitação:**
- Sistema deve validar credenciais fornecidas
- Deve redirecionar para portal correto conforme tipo de usuário
- Deve exibir mensagem de erro para credenciais inválidas
- Deve criar sessão segura após login bem-sucedido
- Deve manter usuário logado durante a sessão
- Deve permitir logout a qualquer momento

---

### 6. Cadastrar Paciente
**Como** novo usuário,  
**Eu quero** me cadastrar como paciente no sistema,  
**Para** poder agendar consultas e utilizar os serviços da clínica.

**Critérios de Aceitação:**
- Sistema deve solicitar: nome, email, CPF, telefone, data de nascimento, endereço
- Deve validar formato de CPF e email
- Deve verificar se CPF/email já está cadastrado
- Não deve permitir duplicidade de cadastros
- Deve criar conta de acesso automaticamente
- Deve enviar email de confirmação de cadastro

---

### 7. Cadastrar Médico
**Como** administrador,  
**Eu quero** cadastrar novos médicos no sistema,  
**Para** disponibilizar profissionais para agendamento de consultas pelos pacientes.

**Critérios de Aceitação:**
- Sistema deve solicitar: nome, CRM, especialidade, preço da consulta, email, telefone
- Deve validar formato e autenticidade do CRM
- Deve verificar se CRM já está cadastrado
- Deve permitir seleção de especialidade médica existente
- Deve criar conta de acesso para o médico
- Deve enviar credenciais de acesso por email

---

### 8. Cadastrar Horários de Atendimento
**Como** médico,  
**Eu quero** definir meus horários de atendimento disponíveis,  
**Para** que pacientes possam agendar consultas nos períodos que estou disponível.

**Critérios de Aceitação:**
- Sistema deve permitir selecionar dias da semana
- Deve permitir definir horário de início e fim para cada dia
- Deve verificar conflito com horários já cadastrados
- Deve gerar disponibilidades automaticamente para datas futuras
- Deve permitir visualizar e editar horários existentes
- Deve permitir bloquear/desbloquear horários específicos

---

### 9. Enviar Prescrição Eletrônica
**Como** médico,  
**Eu quero** emitir prescrição eletrônica após uma consulta,  
**Para** registrar medicamentos e orientações de forma digital e segura para o paciente.

**Critérios de Aceitação:**
- Sistema deve listar consultas concluídas do médico
- Deve permitir adicionar múltiplos medicamentos
- Deve incluir campos: medicamento, dosagem, frequência, duração, instruções
- Deve salvar prescrição vinculada à consulta
- Deve enviar notificação ao paciente quando prescrição estiver disponível
- Paciente deve poder visualizar e imprimir prescrição

---

### 10. Consultar Histórico Médico
**Como** médico ou paciente,  
**Eu quero** consultar o histórico médico completo de um paciente,  
**Para** ter acesso a consultas anteriores, prescrições e avaliações para melhor acompanhamento.

**Critérios de Aceitação:**
- Sistema deve listar todas as consultas do paciente em ordem cronológica
- Deve exibir detalhes: data, médico, diagnóstico, prescrição
- Deve permitir visualizar prescrições emitidas em cada consulta
- Deve mostrar avaliações do paciente sobre atendimentos
- Deve permitir filtrar por período ou médico
- Médico deve ter acesso apenas durante consulta ou com autorização

---

### 11. Gerar Notificações e Lembretes de Consulta
**Como** paciente,  
**Eu quero** receber lembretes automáticos sobre minhas consultas agendadas,  
**Para** não esquecer dos meus compromissos médicos e comparecer no horário correto.

**Critérios de Aceitação:**
- Sistema deve enviar lembrete 24 horas antes da consulta
- Deve enviar lembrete 1 hora antes da consulta
- Deve notificar sobre confirmação de agendamento
- Deve notificar sobre cancelamento de consulta
- Deve notificar quando prescrição estiver disponível
- Notificações devem aparecer no centro de notificações do sistema

---

### 12. Enviar Emails com Comunicações Institucionais
**Como** administrador,  
**Eu quero** enviar emails em massa para pacientes e médicos,  
**Para** comunicar informações importantes, novidades, avisos e campanhas da clínica.

**Critérios de Aceitação:**
- Sistema deve permitir selecionar destinatários (todos, apenas pacientes, apenas médicos)
- Deve permitir redigir assunto e corpo do email
- Deve oferecer prévia antes do envio
- Deve confirmar envio antes de executar
- Deve registrar histórico de emails enviados
- Deve gerar relatório de emails enviados por período

---

### 13. Gerar Relatório de Consultas
**Como** administrador,  
**Eu quero** gerar relatórios detalhados sobre consultas realizadas,  
**Para** analisar desempenho da clínica, receitas e qualidade dos serviços.

**Critérios de Aceitação:**
- Sistema deve permitir selecionar período do relatório
- Deve exibir: total de consultas, consultas por médico, consultas por especialidade
- Deve calcular receita total e por médico
- Deve mostrar média de avaliações dos médicos
- Deve gerar gráficos visuais das estatísticas
- Deve permitir exportar relatório em PDF e Excel

---

## Tecnologias

- **Next.js 16**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS v4**: Estilização
- **shadcn/ui**: Componentes UI
- **React 19**: Biblioteca de interface

## Modelo de Dados

O sistema utiliza as seguintes entidades principais:

- **Paciente**: CodPaciente, Nome, Email, CPF, etc.
- **Médico**: CodMedico, Nome, CRM, Preço, etc.
- **Especialidade**: CodEspec, Nome
- **Horário**: CodHorario, Dia, HoraIni, HoraFim
- **Disponibilidade**: CodDisp, Data, Reservado
- **Consulta**: CodConsulta, Status
- **Pagamento**: CodPagamento, Valor, TipoPagam
- **Prescrição**: CodPresc, Medicamentos, Frequência
- **Avaliação**: CodAvaliacao, Nota, Descrição
- **Notificação**: CodNotificacao, Tipo, Mensagem

## Como Executar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o servidor de desenvolvimento: `npm run dev`
4. Acesse `http://localhost:3000`

## Credenciais de Teste

### Paciente
- Email: joao@email.com
- Senha: senha123

### Médico
- Email: dr.joao@clinica.com
- Senha: senha123

### Administrador
- Email: admin@clinica.com
- Senha: admin123

## Arquivos de Implementação

### Caso de Uso: Marcar Consulta
- `lib/controllers/marca-consulta-controller.ts` - Controller do caso de uso
- `lib/catalogues/catalogo-paciente.ts` - Catálogo de pacientes
- `lib/catalogues/catalogo-disponibilidade.ts` - Catálogo de disponibilidades
- `components/patient/marca-consulta-ui.tsx` - Interface do usuário
- `lib/types/index.ts` - Definições de tipos

### Caso de Uso: Visualizar Consultas Marcadas
- `lib/controllers/visualiza-consultas-controller.ts` - Controller do caso de uso
- `lib/catalogues/catalogo-consulta.ts` - Catálogo de consultas
- `lib/catalogues/catalogo-disponibilidade.ts` - Catálogo de disponibilidades
- `components/patient/visualiza-consultas-ui.tsx` - Interface do usuário

### Caso de Uso: Avaliar Atendimento
- `lib/controllers/avalia-atendimento-controller.ts` - Controller do caso de uso
- `lib/catalogues/catalogo-consulta.ts` - Catálogo de consultas
- `lib/repositories/avaliacao-repository.ts` - Repositório de avaliações
- `components/patient/avalia-atendimento-ui.tsx` - Interface do usuário

### Caso de Uso: Pagamento da Consulta
- `lib/controllers/pagamento-consulta-controller.ts` - Controller do caso de uso
- `lib/catalogues/catalogo-consulta.ts` - Catálogo de consultas
- `lib/catalogues/catalogo-pagamento.ts` - Catálogo de pagamentos
- `components/patient/pagamento-consulta-ui.tsx` - Interface do usuário

### Caso de Uso: Efetuar Login
- `lib/controllers/login-controller.ts` - Controller do caso de uso
- `lib/services/auth-service.ts` - Serviço de autenticação
- `lib/catalogues/catalogo-usuarios.ts` - Catálogo de usuários
- `components/auth/login-ui.tsx` - Interface do usuário

### Caso de Uso: Cadastrar Paciente
- `lib/controllers/cadastra-paciente-controller.ts` - Controller do caso de uso
- `lib/catalogues/catalogo-paciente.ts` - Catálogo de pacientes
- `components/auth/cadastra-paciente-ui.tsx` - Interface do usuário

### Caso de Uso: Cadastrar Médico
- `lib/controllers/cadastra-medico-controller.ts` - Controller do caso de uso
- `lib/catalogues/catalogo-medico.ts` - Catálogo de médicos
- `lib/catalogues/catalogo-especialidade.ts` - Catálogo de especialidades
- `components/admin/cadastra-medico-ui.tsx` - Interface do usuário

### Caso de Uso: Cadastrar Horários de Atendimento
- `lib/controllers/cadastra-horario-controller.ts` - Controller do caso de uso
- `lib/catalogues/catalogo-horario.ts` - Catálogo de horários
- `lib/catalogues/catalogo-disponibilidade.ts` - Catálogo de disponibilidades
- `components/doctor/cadastra-horario-ui.tsx` - Interface do usuário

### Caso de Uso: Enviar Prescrição Eletrônica
- `lib/controllers/envia-prescricao-controller.ts` - Controller do caso de uso
- `lib/repositories/prescricao-repository.ts` - Repositório de prescrições
- `lib/services/notificacao-service.ts` - Serviço de notificações
- `components/doctor/envia-prescricao-ui.tsx` - Interface do usuário

### Caso de Uso: Consultar Histórico Médico
- `lib/controllers/consulta-historico-controller.ts` - Controller do caso de uso
- `lib/catalogues/catalogo-consulta.ts` - Catálogo de consultas
- `lib/repositories/prescricao-repository.ts` - Repositório de prescrições
- `lib/repositories/avaliacao-repository.ts` - Repositório de avaliações
- `components/shared/consulta-historico-ui.tsx` - Interface do usuário

### Caso de Uso: Gerar Notificações e Lembretes de Consulta
- `lib/controllers/notificacao-controller.ts` - Controller do caso de uso
- `lib/repositories/notificacao-repository.ts` - Repositório de notificações
- `lib/services/notificacao-scheduler.ts` - Agendador de notificações
- `components/shared/notificacao-ui.tsx` - Interface do usuário

### Caso de Uso: Enviar Emails com Comunicações Institucionais
- `lib/controllers/envia-email-controller.ts` - Controller do caso de uso
- `lib/services/email-service.ts` - Serviço de emails
- `lib/repositories/email-repository.ts` - Repositório de emails
- `components/admin/envia-email-ui.tsx` - Interface do usuário

### Caso de Uso: Gerar Relatório de Consultas
- `lib/controllers/gera-relatorio-controller.ts` - Controller do caso de uso
- `lib/services/relatorio-service.ts` - Serviço de relatórios
- `lib/catalogues/catalogo-consulta.ts` - Catálogo de consultas
- `components/admin/gera-relatorio-ui.tsx` - Interface do usuário

## Próximas Melhorias

- Integração com banco de dados real (Supabase/Neon)
- Sistema de notificações push
- Integração com gateway de pagamento (Stripe)
- Exportação de relatórios em PDF
- Sistema de videochamadas para teleconsulta
- App mobile (React Native)

## Histórias de Usuário

### 1. Marcar Consulta
**Como** paciente,  
**Eu quero** agendar uma consulta médica selecionando especialidade, médico, data e horário disponível,  
**Para** garantir atendimento médico de forma organizada e conveniente.

**Critérios de Aceitação:**
- Sistema deve listar especialidades médicas disponíveis
- Deve exibir médicos filtrados por especialidade selecionada
- Deve mostrar apenas horários disponíveis do médico escolhido
- Deve permitir seleção de forma de pagamento (cartão, PIX, dinheiro)
- Deve confirmar agendamento e reservar o horário
- Deve enviar notificação de confirmação ao paciente

---

### 2. Visualizar Consultas Marcadas
**Como** paciente,  
**Eu quero** visualizar todas as minhas consultas agendadas e histórico de consultas passadas,  
**Para** acompanhar meus compromissos médicos e ter acesso ao histórico de atendimentos.

**Critérios de Aceitação:**
- Sistema deve listar consultas separadas em "Agendadas" e "Histórico"
- Deve exibir informações completas: médico, especialidade, data, horário, local, preço
- Deve permitir cancelar consultas agendadas
- Deve permitir confirmar presença em consultas
- Deve mostrar status do pagamento de cada consulta
- Deve permitir filtrar consultas por período

---

### 3. Avaliação de Atendimento
**Como** paciente,  
**Eu quero** avaliar o atendimento recebido após uma consulta concluída,  
**Para** fornecer feedback sobre a qualidade do serviço e ajudar outros pacientes na escolha de médicos.

**Critérios de Aceitação:**
- Sistema deve listar apenas consultas concluídas e não avaliadas
- Deve permitir atribuir nota de 1 a 5 estrelas
- Deve permitir adicionar comentário opcional sobre o atendimento
- Não deve permitir avaliar a mesma consulta mais de uma vez
- Deve confirmar envio da avaliação
- Avaliações devem ser visíveis para outros pacientes

---

### 4. Pagamento da Consulta
**Como** paciente,  
**Eu quero** realizar o pagamento de uma consulta agendada,  
**Para** confirmar meu compromisso e garantir o atendimento médico.

**Critérios de Aceitação:**
- Sistema deve listar consultas com pagamento pendente
- Deve suportar múltiplos métodos: cartão de crédito, débito, PIX, dinheiro
- Deve validar dados de pagamento fornecidos
- Deve gerar comprovante/recibo após pagamento
- Deve atualizar status da consulta após pagamento confirmado
- Deve enviar notificação de confirmação de pagamento

---

### 5. Efetuar Login
**Como** usuário (paciente, médico ou administrador),  
**Eu quero** fazer login no sistema com email e senha,  
**Para** acessar funcionalidades específicas do meu perfil de forma segura.

**Critérios de Aceitação:**
- Sistema deve validar credenciais fornecidas
- Deve redirecionar para portal correto conforme tipo de usuário
- Deve exibir mensagem de erro para credenciais inválidas
- Deve criar sessão segura após login bem-sucedido
- Deve manter usuário logado durante a sessão
- Deve permitir logout a qualquer momento

---

### 6. Cadastrar Paciente
**Como** novo usuário,  
**Eu quero** me cadastrar como paciente no sistema,  
**Para** poder agendar consultas e utilizar os serviços da clínica.

**Critérios de Aceitação:**
- Sistema deve solicitar: nome, email, CPF, telefone, data de nascimento, endereço
- Deve validar formato de CPF e email
- Deve verificar se CPF/email já está cadastrado
- Não deve permitir duplicidade de cadastros
- Deve criar conta de acesso automaticamente
- Deve enviar email de confirmação de cadastro

---

### 7. Cadastrar Médico
**Como** administrador,  
**Eu quero** cadastrar novos médicos no sistema,  
**Para** disponibilizar profissionais para agendamento de consultas pelos pacientes.

**Critérios de Aceitação:**
- Sistema deve solicitar: nome, CRM, especialidade, preço da consulta, email, telefone
- Deve validar formato e autenticidade do CRM
- Deve verificar se CRM já está cadastrado
- Deve permitir seleção de especialidade médica existente
- Deve criar conta de acesso para o médico
- Deve enviar credenciais de acesso por email

---

### 8. Cadastrar Horários de Atendimento
**Como** médico,  
**Eu quero** definir meus horários de atendimento disponíveis,  
**Para** que pacientes possam agendar consultas nos períodos que estou disponível.

**Critérios de Aceitação:**
- Sistema deve permitir selecionar dias da semana
- Deve permitir definir horário de início e fim para cada dia
- Deve verificar conflito com horários já cadastrados
- Deve gerar disponibilidades automaticamente para datas futuras
- Deve permitir visualizar e editar horários existentes
- Deve permitir bloquear/desbloquear horários específicos

---

### 9. Enviar Prescrição Eletrônica
**Como** médico,  
**Eu quero** emitir prescrição eletrônica após uma consulta,  
**Para** registrar medicamentos e orientações de forma digital e segura para o paciente.

**Critérios de Aceitação:**
- Sistema deve listar consultas concluídas do médico
- Deve permitir adicionar múltiplos medicamentos
- Deve incluir campos: medicamento, dosagem, frequência, duração, instruções
- Deve salvar prescrição vinculada à consulta
- Deve enviar notificação ao paciente quando prescrição estiver disponível
- Paciente deve poder visualizar e imprimir prescrição

---

### 10. Consultar Histórico Médico
**Como** médico ou paciente,  
**Eu quero** consultar o histórico médico completo de um paciente,  
**Para** ter acesso a consultas anteriores, prescrições e avaliações para melhor acompanhamento.

**Critérios de Aceitação:**
- Sistema deve listar todas as consultas do paciente em ordem cronológica
- Deve exibir detalhes: data, médico, diagnóstico, prescrição
- Deve permitir visualizar prescrições emitidas em cada consulta
- Deve mostrar avaliações do paciente sobre atendimentos
- Deve permitir filtrar por período ou médico
- Médico deve ter acesso apenas durante consulta ou com autorização

---

### 11. Gerar Notificações e Lembretes de Consulta
**Como** paciente,  
**Eu quero** receber lembretes automáticos sobre minhas consultas agendadas,  
**Para** não esquecer dos meus compromissos médicos e comparecer no horário correto.

**Critérios de Aceitação:**
- Sistema deve enviar lembrete 24 horas antes da consulta
- Deve enviar lembrete 1 hora antes da consulta
- Deve notificar sobre confirmação de agendamento
- Deve notificar sobre cancelamento de consulta
- Deve notificar quando prescrição estiver disponível
- Notificações devem aparecer no centro de notificações do sistema

---

### 12. Enviar Emails com Comunicações Institucionais
**Como** administrador,  
**Eu quero** enviar emails em massa para pacientes e médicos,  
**Para** comunicar informações importantes, novidades, avisos e campanhas da clínica.

**Critérios de Aceitação:**
- Sistema deve permitir selecionar destinatários (todos, apenas pacientes, apenas médicos)
- Deve permitir redigir assunto e corpo do email
- Deve oferecer prévia antes do envio
- Deve confirmar envio antes de executar
- Deve registrar histórico de emails enviados
- Deve gerar relatório de emails enviados por período

---

### 13. Gerar Relatório de Consultas
**Como** administrador,  
**Eu quero** gerar relatórios detalhados sobre consultas realizadas,  
**Para** analisar desempenho da clínica, receitas e qualidade dos serviços.

**Critérios de Aceitação:**
- Sistema deve permitir selecionar período do relatório
- Deve exibir: total de consultas, consultas por médico, consultas por especialidade
- Deve calcular receita total e por médico
- Deve mostrar média de avaliações dos médicos
- Deve gerar gráficos visuais das estatísticas
- Deve permitir exportar relatório em PDF e Excel

---

## Resumo dos Princípios GRASP Aplicados

### Controller
Coordena cada caso de uso:
- `MarcaConsultaController`
- `AvaliaAtendimentoController`
- `VisualizaConsultasController`
- `PagamentoConsultaController`
- `LoginController`
- `CadastraPacienteController`
- `CadastraMedicoController`
- `CadastraHorarioController`
- `EnviaPrescricaoController`
- `ConsultaHistoricoController`
- `NotificacaoController`
- `EnviaEmailController`
- `GeraRelatorioController`

### Information Expert
Responsabilidades atribuídas a quem possui informação:
- **Catálogos**: gerenciam coleções de entidades
- **Repositories**: conhecem e persistem dados específicos

### Creator
Definição clara de criação:
- `Paciente` cria `Consulta` (possui dados iniciais)
- `Consulta` cria `Pagamento` (possui contexto)
- `Consulta` cria `Avaliacao` (relacionamento direto)
- Catálogos criam entidades que gerenciam

### Low Coupling
- Controllers comunicam-se com catálogos via interfaces
- UI conhece apenas controllers
- Serviços são injetados, não instanciados diretamente

### High Cohesion
- Cada classe tem responsabilidade única e focada
- Componentes UI focados em apresentação
- Controllers focados em coordenação
- Catálogos/Repositories focados em dados

### Pure Fabrication
Serviços artificiais para organização:
- `AuthService` (autenticação)
- `NotificacaoService` (envio de notificações)
- `EmailService` (envio de emails)
- `RelatorioService` (geração de relatórios)
- `NotificacaoScheduler` (agendamento)
- Repositories (persistência)

### Protected Variations
- Interfaces estáveis protegem mudanças de implementação
- Métodos privados encapsulam lógica interna
- Dados sensíveis protegidos por validações

### Polymorphism
- Redirecionamento após login varia por tipo de usuário
- Comportamento diferenciado em portais (Paciente/Médico/Admin)

### Indirection
- Repositories atuam como intermediários para persistência
- Services reduzem acoplamento entre controllers e lógica complexa
